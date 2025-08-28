<?php
// File: app/Http/Controllers/PenyelenggaraController.php

namespace App\Http\Controllers;

use App\Events\RegistrationStatusUpdated;
use App\Events\ProposalSubmitted;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\PenyelenggaraProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\EventRegistration;
use App\Events\PaymentRejected;
use Illuminate\Http\Request;
use App\Events\NewUserRegisteredForVerification;
use App\Events\ProfileStatusUpdated; // <-- 1. TAMBAHKAN IMPORT INI

class PenyelenggaraController extends Controller
{
    // ... (method lain tidak berubah) ...
    public function dashboard()
    {
        $user = Auth::user();
        $profile = $user->penyelenggaraProfile;

        $events = Event::withTrashed()
            ->withCount('eventRegistrations')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Penyelenggara/Dashboard', [
            'hasProfile' => !is_null($profile),
            'profile' => $profile,
            'events' => $events,
        ]);
    }

    public function createProposal()
    {
        return Inertia::render('Penyelenggara/CreateProposal');
    }

    public function storeProposal(Request $request)
    {
        // --- ▼▼▼ PERBAIKAN LOGIKA VALIDASI DI SINI ▼▼▼ ---
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'deskripsi_event' => 'required|string',
            'poster_event' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'pendaftaran_dibuka' => 'required|date|after_or_equal:today',
            'pendaftaran_ditutup' => 'required|date|after_or_equal:pendaftaran_dibuka',
            'tanggal_mulai_acara' => 'required|date|after:pendaftaran_ditutup',
            'tanggal_selesai_acara' => 'required|date|after_or_equal:tanggal_mulai_acara',
            'lokasi_event' => 'required|string|max:255',
            'biaya_pendaftaran_umkm' => 'required|numeric|min:0',
            'kuota_umkm' => 'required|integer|min:1',
            'nama_bank_penyelenggara' => 'required|string|max:100',
            'nomor_rekening_penyelenggara' => 'required|string|max:50',
            'nama_pemilik_rekening' => 'required|string|max:255',
        ]);

        $posterPath = $request->file('poster_event')->store('events/posters', 'public');

        $proposal = Event::create([
            'user_id' => Auth::id(),
            'nama_event' => $request->nama_event,
            'deskripsi_event' => $request->deskripsi_event,
            'poster_event' => $posterPath,
            'pendaftaran_dibuka' => $request->pendaftaran_dibuka,
            'pendaftaran_ditutup' => $request->pendaftaran_ditutup,
            'tanggal_mulai_acara' => $request->tanggal_mulai_acara,
            'tanggal_selesai_acara' => $request->tanggal_selesai_acara,
            'lokasi_event' => $request->lokasi_event,
            'biaya_pendaftaran_umkm' => $request->biaya_pendaftaran_umkm,
            'kuota_umkm' => $request->kuota_umkm,
            'nama_bank_penyelenggara' => $request->nama_bank_penyelenggara,
            'nomor_rekening_penyelenggara' => $request->nomor_rekening_penyelenggara,
            'nama_pemilik_rekening' => $request->nama_pemilik_rekening,
            'status_proposal' => 'menunggu_persetujuan',
            'status' => null,
        ]);
        // --- ▲▲▲ AKHIR DARI PERUBAHAN LOGIKA ---

        $proposal->load('user');

        ProposalSubmitted::dispatch($proposal);

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Proposal event berhasil diajukan dan sedang menunggu persetujuan admin.');
    }


    public function createProfile()
    {
        $profile = Auth::user()->penyelenggaraProfile;

        if ($profile && $profile->status === 'verified') {
            return redirect()->route('penyelenggara.dashboard')->with('info', 'Profil yang sudah terverifikasi tidak dapat diubah.');
        }

        return Inertia::render('Penyelenggara/ProfileSetup', [
            'profile' => $profile,
        ]);
    }

    public function storeProfile(Request $request)
    {
        $user = Auth::user();
        $profile = $user->penyelenggaraProfile;

        $request->validate([
            'organizer_name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'verification_document' => [$profile ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $documentPath = $profile->verification_document_path ?? null;
        if ($request->hasFile('verification_document')) {
            if ($profile && $profile->verification_document_path) {
                Storage::disk('public')->delete($profile->verification_document_path);
            }
            $documentPath = $request->file('verification_document')->store('penyelenggara/documents', 'public');
        }

        $logoPath = $profile->logo_path ?? null;
        if ($request->hasFile('logo')) {
            if ($profile && $profile->logo_path) {
                Storage::disk('public')->delete($profile->logo_path);
            }
            $logoPath = $request->file('logo')->store('penyelenggara/logos', 'public');
        }

        $updatedProfile = PenyelenggaraProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'organizer_name' => $request->organizer_name,
                'description' => $request->description,
                'address' => $request->address,
                'verification_document_path' => $documentPath,
                'logo_path' => $logoPath,
                'status' => 'pending',
                'rejection_reason' => null,
            ]
        );

        NewUserRegisteredForVerification::dispatch($user);

        // --- ▼▼▼ 2. TAMBAHKAN BARIS INI ▼▼▼ ---
        ProfileStatusUpdated::dispatch($updatedProfile);
        // --- ▲▲▲ AKHIR DARI PERBAIKAN ---

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Profil berhasil disimpan dan diajukan ulang untuk verifikasi.');
    }

    public function listVerifikasi()
    {
        $user = Auth::user();

        $pendingRegistrations = EventRegistration::whereHas('event', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['umkmProfile', 'event'])
            ->where('status', 'menunggu_konfirmasi_pembayaran')
            ->orderBy('created_at', 'desc')
            ->get();

        $confirmedRegistrations = EventRegistration::whereHas('event', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['umkmProfile', 'event'])
            ->whereIn('status', ['pembayaran_terkonfirmasi', 'approved', 'rejected', 'sudah_check_in'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Penyelenggara/VerifikasiPendaftarList', [
            'pendingRegistrations' => $pendingRegistrations,
            'confirmedRegistrations' => $confirmedRegistrations,
        ]);
    }


    public function showVerifikasi(EventRegistration $registration)
    {
        if ($registration->event->user_id !== Auth::id()) {
            abort(403);
        }
        $registration->load(['umkmProfile', 'event']);

        return Inertia::render('Penyelenggara/VerifikasiDetail', [
            'registration' => $registration
        ]);
    }
    public function confirmPayment(EventRegistration $registration)
    {
        if ($registration->event->user_id !== Auth::id()) {
            abort(403);
        }

        $registration->update(['status' => 'pembayaran_terkonfirmasi', 'rejection_reason' => null]);

        $registration->load('umkmProfile');

        RegistrationStatusUpdated::dispatch($registration);

        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')->with('success', 'Pembayaran telah dikonfirmasi.');
    }

    public function rejectPayment(Request $request, EventRegistration $registration)
    {
        if ($registration->event->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate(['rejection_reason' => 'required|string|min:10']);

        if ($registration->bukti_pembayaran_path) {
            Storage::disk('public')->delete($registration->bukti_pembayaran_path);
        }

        $registration->update([
            'status' => 'rejected',
            'bukti_pembayaran_path' => null,
            'rejection_reason' => $request->rejection_reason,
        ]);

        // --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ ---
        $registration->refresh();
        $registration->load('event', 'umkmProfile');
        PaymentRejected::dispatch($registration);
        // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')
            ->with('success', 'Pembayaran ditolak dan notifikasi telah dikirim ke UMKM.');
    }

    public function showProposal(Event $event)
    {
        // --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ ---
        // Gunakan withTrashed() untuk mencari proposal di arsip (soft-deleted) juga.
        // Route model binding tidak bisa menangani soft-deleted secara default.
        $proposal = Event::withTrashed()->where('id', $event->id)->firstOrFail();

        if ($proposal->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Penyelenggara/ProposalDetail', [
            'proposal' => $proposal,
        ]);
        // --- ▲▲▲ AKHIR DARI PERUBAHAN ---
    }

    public function assignStandNumber(Request $request, EventRegistration $registration)
    {
        if ($registration->event->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'nomor_stand' => 'required|string|max:50',
        ]);

        $registration->update([
            'nomor_stand' => $request->nomor_stand,
        ]);

        return back()->with('success', 'Nomor stand berhasil ditetapkan.');
    }
}
