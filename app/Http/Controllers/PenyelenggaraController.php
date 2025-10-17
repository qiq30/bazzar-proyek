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
use App\Events\ProfileStatusUpdated;
use Carbon\Carbon;
use App\Events\ProposalStep1Submitted;
use App\Models\Notification;
use App\Events\NotificationReceived;
use App\Events\RegistrationFinalized;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;

class PenyelenggaraController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $profile = $user->penyelenggaraProfile;

        $events = Event::withCount('eventRegistrations')
            ->where('user_id', $user->id)
            ->withTrashed() // Ambil semua proposal termasuk yang ditolak
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Penyelenggara/Dashboard', [
            'hasProfile' => !is_null($profile),
            'profile' => $profile,
            'events' => $events,
        ]);
    }

    public function proposalWizard(Event $event = null)
    {
        // Kondisi 1: Lanjutkan ke Step 2 jika dokumen disetujui ATAU proposal ditolak (untuk diperbaiki)
        if (
            $event && $event->user_id === Auth::id() &&
            ($event->document_verification_status === 'document_approved' || $event->status_proposal === 'ditolak')
        ) {
            return Inertia::render('Penyelenggara/ProposalWizard', [
                'step' => 2,
                'event' => $event
            ]);
        }

        // Kondisi 2: Kembali ke Step 1 untuk proposal baru
        return Inertia::render('Penyelenggara/ProposalWizard', [
            'step' => 1,
            'event' => null
        ]);
    }

    public function storeProposalStep1(Request $request)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'proposal_document' => 'required|file|mimes:pdf|max:5120', // PDF, max 5MB
        ]);

        $documentPath = $request->file('proposal_document')->store('proposals/documents', 'public');

        $event = Event::create([
            'user_id' => Auth::id(),
            'nama_event' => $request->nama_event,
            'proposal_document_path' => $documentPath,
            'document_verification_status' => 'pending_document_verification',
            'status_proposal' => 'draft', // Status awal sebagai draft
        ]);

        $event->load('user');

        // 1. Kirim notifikasi ke semua Admin
        ProposalStep1Submitted::dispatch($event);

        // 2. Buat dan kirim notifikasi untuk Penyelenggara yang mengajukan
        $organizer = Auth::user();
        $notificationForOrganizer = Notification::create([
            'user_id' => $organizer->id,
            'type'    => 'App\Notifications\ProposalSubmittedInfo', // Tipe deskriptif
            'data'    => [
                'title'   => 'Proposal Anda Telah Diajukan',
                'message' => "Proposal untuk '{$event->nama_event}' sedang menunggu verifikasi dokumen oleh admin.",
                'url'     => route('penyelenggara.dashboard'),
            ]
        ]);
        NotificationReceived::dispatch($organizer, $notificationForOrganizer);

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Proposal awal berhasil diajukan. Mohon tunggu verifikasi dokumen dari Admin.');
    }

    public function storeProposalStep2(Request $request, Event $event)
    {
        // Boleh diakses jika dokumen disetujui ATAU proposalnya ditolak
        if ($event->user_id !== Auth::id() || !in_array($event->document_verification_status, ['document_approved', 'ditolak'])) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $request->validate([
            'deskripsi_event' => 'required|string',
            'poster_event' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        $updateData = $request->except('poster_event'); // Ambil semua data kecuali poster
        $address = $request->input('lokasi_event');
        $latitude = null;
        $longitude = null;

        try {
            $response = Http::get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'email' => 'sniqi87@gmail.com'
            ]);

            if ($response->successful() && count($response->json()) > 0) {
                $locationData = $response->json()[0];
                $latitude = (float) $locationData['lat'];
                $longitude = (float) $locationData['lon'];
            }
        } catch (\Exception $e) {
            // Jika API gagal, catat errornya tapi jangan hentikan proses.
            // Event tetap bisa dibuat, hanya saja petanya tidak akan muncul.
            Log::error('Nominatim Geocoding API request failed: ' . $e->getMessage());
        }

        // Tambahkan latitude dan longitude ke data yang akan di-update
        $updateData['latitude'] = $latitude;
        $updateData['longitude'] = $longitude;

        if ($request->hasFile('poster_event')) {
            // Hapus poster lama jika ada
            if ($event->poster_event) {
                Storage::disk('public')->delete($event->poster_event);
            }
            // Simpan poster baru dan tambahkan ke data update
            $updateData['poster_event'] = $request->file('poster_event')->store('events/posters', 'public');
        }

        // Set status kembali menjadi 'menunggu_persetujuan'
        $updateData['status_proposal'] = 'menunggu_persetujuan';

        $event->update($updateData); // Data koordinat akan tersimpan di sini

        $event->load('user');

        ProposalSubmitted::dispatch($event);

        return redirect()->route('penyelenggara.dashboard')->with('success', 'Detail proposal berhasil dikirim ulang dan sedang menunggu persetujuan akhir dari admin.');
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

        $request->validate(
            [
                'organizer_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'verification_document' => [$profile ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
                'logo' => 'nullable|image|mimes:jpeg,png,jpg',
                'max:2048'
            ],
        );

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

        ProfileStatusUpdated::dispatch($updatedProfile);

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

        // Langsung setujui pendaftaran jika nomor stand sudah diisi
        if (is_null($registration->nomor_stand)) {
            return back()->with('error', 'Anda harus menetapkan nomor stand terlebih dahulu sebelum menyetujui pembayaran.');
        }

        // Buat PIN acak untuk check-in
        $kodePin = rand(100000, 999999);

        $registration->update([
            'status'      => 'approved',
            'kode_pin'    => $kodePin,
            'rejection_reason' => null
        ]);

        $registration->load('umkmProfile', 'event');

        // Kirim notifikasi e-ticket ke UMKM
        RegistrationFinalized::dispatch($registration);


        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')->with('success', 'Pembayaran telah dikonfirmasi dan pendaftaran UMKM berhasil disetujui. E-Ticket telah dikirim.');
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

        $registration->refresh();
        $registration->load('event', 'umkmProfile');
        PaymentRejected::dispatch($registration);

        return redirect()->route('penyelenggara.pendaftar.verifikasi.list')
            ->with('success', 'Pembayaran ditolak dan notifikasi telah dikirim ke UMKM.');
    }

    public function showProposal($eventHashid)
    {
        // 1. Decode hashid untuk mendapatkan ID asli
        $decodedId = Hashids::decode($eventHashid)[0] ?? null;

        // 2. Cari proposal (termasuk yang soft-deleted) menggunakan ID asli
        $proposal = Event::withTrashed()->find($decodedId);

        // 3. Jika tidak ditemukan, tampilkan halaman 404
        if (!$proposal) {
            abort(404);
        }

        // 4. Pastikan proposal ini milik user yang sedang login
        if ($proposal->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Penyelenggara/ProposalDetail', [
            'proposal' => $proposal,
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

    public function downloadTemplate()
    {
        // Path file RELATIF terhadap folder /storage/app/public
        $path = 'templates/template_proposal_event.pdf';

        // Cek apakah file ada SECARA SPESIFIK di disk 'public'
        if (!Storage::disk('public')->exists($path)) {
            // Jika tidak ditemukan, tampilkan pesan error yang jelas
            abort(404, 'File tidak ditemukan di storage/app/public/' . $path);
        }

        // Ambil path absolut dari file tersebut
        $fullPath = Storage::disk('public')->path($path);

        // Ambil nama file asli untuk di-download
        $fileName = basename($path);

        // Kirimkan file untuk di-download menggunakan path absolutnya
        return response()->download($fullPath, $fileName);
    }
}
