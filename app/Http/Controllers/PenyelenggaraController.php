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

class PenyelenggaraController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $profile = $user->penyelenggaraProfile;

        // Menggunakan withCount untuk efisiensi jika perlu menampilkan jumlah pendaftar
        $events = Event::withCount('eventRegistrations')
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
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'deskripsi_event' => 'required|string',
            'poster_event' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi_event' => 'required|string|max:255',
            'biaya_pendaftaran_umkm' => 'required|numeric|min:0',
            'kuota_umkm' => 'required|integer|min:1',
            'nama_bank_penyelenggara' => 'required|string|max:100',
            'nomor_rekening_penyelenggara' => 'required|string|max:50',
            'nama_pemilik_rekening' => 'required|string|max:255',
        ]);

        $posterPath = $request->file('poster_event')->store('events/posters', 'public');

        $proposal = Event::create([ // <-- Ubah nama variabel menjadi $proposal
            'user_id' => Auth::id(),
            'nama_event' => $request->nama_event,
            'deskripsi_event' => $request->deskripsi_event,
            'poster_event' => $posterPath,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi_event' => $request->lokasi_event,
            'biaya_pendaftaran_umkm' => $request->biaya_pendaftaran_umkm,
            'kuota_umkm' => $request->kuota_umkm,
            'nama_bank_penyelenggara' => $request->nama_bank_penyelenggara,
            'nomor_rekening_penyelenggara' => $request->nomor_rekening_penyelenggara,
            'nama_pemilik_rekening' => $request->nama_pemilik_rekening,
            'status_proposal' => 'menunggu_persetujuan',
            'status' => null,
        ]);

        $proposal->load('user');

        // Kirim event broadcast setelah proposal berhasil dibuat
        ProposalSubmitted::dispatch($proposal);

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Proposal event berhasil diajukan dan sedang menunggu persetujuan admin.');
    }


    public function createProfile()
    {
        $profile = Auth::user()->penyelenggaraProfile;

        if ($profile && $profile->status === 'verified') {
            return redirect()->route('penyelenggara.dashboard')->with('info', 'Profil yang sudah terverifikasi tidak dapat diubah.');
        }

        return Inertia::render('Penyelenggara/ProfileSetup');
    }

    public function storeProfile(Request $request)
    {
        $request->validate([
            'organizer_name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'verification_document' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();

        $documentPath = $request->file('verification_document')->store('penyelenggara/documents', 'public');
        $logoPath = $request->hasFile('logo') ? $request->file('logo')->store('penyelenggara/logos', 'public') : null;

        PenyelenggaraProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'organizer_name' => $request->organizer_name,
                'description' => $request->description,
                'address' => $request->address,
                'verification_document_path' => $documentPath,
                'logo_path' => $logoPath,
                'status' => 'pending',
            ]
        );

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Profil berhasil disimpan dan sedang menunggu verifikasi.');
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
            // --- ▼▼▼ UBAH BARIS DI BAWAH INI ▼▼▼ ---
            ->whereIn('status', ['pembayaran_terkonfirmasi', 'approved', 'rejected', 'sudah_check_in'])
            // --- ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ ---
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

        $registration->update(['status' => 'pembayaran_terkonfirmasi']);

        // Muat relasi yang dibutuhkan oleh event
        $registration->load('umkmProfile');

        // Kirim event ke UMKM yang bersangkutan
        RegistrationStatusUpdated::dispatch($registration); // <-- TAMBAHKAN BARIS INI

        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')->with('success', 'Pembayaran telah dikonfirmasi.');
    }

    public function rejectPayment(EventRegistration $registration)
    {
        if ($registration->event->user_id !== Auth::id()) {
            abort(403);
        }

        // Hapus file bukti pembayaran yang lama
        if ($registration->bukti_pembayaran_path) {
            Storage::disk('public')->delete($registration->bukti_pembayaran_path);
        }

        // Update status menjadi 'rejected' dan hapus path bukti pembayaran
        $registration->update([
            'status' => 'rejected',
            'bukti_pembayaran_path' => null,
        ]);

        // Muat relasi yang dibutuhkan oleh event
        $registration->load('event', 'umkmProfile');

        // Panggil event notifikasi penolakan
        PaymentRejected::dispatch($registration);

        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')
            ->with('success', 'Pembayaran ditolak dan notifikasi telah dikirim ke UMKM.');
    }

    public function showProposal(Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Penyelenggara/ProposalDetail', [
            'proposal' => $event,
        ]);
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
