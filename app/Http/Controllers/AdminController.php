<?php
// File: app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Events\UmkmProfileUpdated;
use App\Events\ProposalStatusUpdated;
use App\Models\Event;
use App\Models\UmkmProfile;
use App\Models\EventRegistration;
use App\Models\User;
use App\Events\RegistrationFinalized;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\PenyelenggaraProfile;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Events\ProfileStatusUpdated;
use App\Events\EventPublished;

class AdminController extends Controller
{
    // ... (method dashboard() dan method lainnya tidak berubah) ...
    public function dashboard()
    {
        $totalEvents = Event::whereNotNull('status')->count();
        $totalUmkm = UmkmProfile::count();
        $totalPenyelenggara = PenyelenggaraProfile::count();
        $activeEvents = Event::where('status', 'active')->count();

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => [
                'totalEvents' => $totalEvents,
                'totalUmkm' => $totalUmkm,
                'totalPenyelenggara' => $totalPenyelenggara,
                'activeEvents' => $activeEvents,
            ],
        ]);
    }

    public function events()
    {
        $events = Event::whereNotNull('status')
            ->orderBy('tanggal_mulai', 'desc')
            ->get();

        return Inertia::render('Admin/EventManagement', [
            'events' => $events
        ]);
    }

    public function showPublishForm()
    {
        $approvedProposals = Event::with('user')
            ->where('status_proposal', 'disetujui')
            ->whereNull('status')
            ->get();

        return Inertia::render('Admin/PublishEventForm', [
            'proposals' => $approvedProposals,
        ]);
    }

    public function storeEventFromProposal(Request $request)
    {
        $request->validate([
            'proposal_id' => 'required|exists:events,id',
            'nama_event' => 'required|string|max:255',
            'deskripsi_event' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi_event' => 'required|string|max:255',
            'biaya_pendaftaran_umkm' => 'required|numeric|min:0',
            'kuota_umkm' => 'required|integer|min:1',
            'status' => 'required|in:upcoming,active',
        ]);

        $event = Event::findOrFail($request->proposal_id);
        $panitiaPin = rand(100000, 999999);

        $event->update([
            'nama_event' => $request->nama_event,
            'deskripsi_event' => $request->deskripsi_event,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi_event' => $request->lokasi_event,
            'biaya_pendaftaran_umkm' => $request->biaya_pendaftaran_umkm,
            'kuota_umkm' => $request->kuota_umkm,
            'status' => $request->status,
            'panitia_pin' => $panitiaPin,
        ]);

        EventPublished::dispatch($event);

        return redirect()->route('admin.events')->with('success', 'Event berhasil diterbitkan!');
    }

    public function updateEvent(Request $request, Event $event)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi_event' => 'required|string|max:255',
            'status' => 'required|in:upcoming,active,finished',
        ]);

        $event->update($request->only([
            'nama_event',
            'tanggal_mulai',
            'tanggal_selesai',
            'lokasi_event',
            'status'
        ]));

        return back()->with('success', 'Event berhasil diupdate!');
    }

    public function destroyEvent(Event $event)
    {
        if ($event->poster_event) {
            Storage::disk('public')->delete($event->poster_event);
        }
        $event->delete();
        return back()->with('success', 'Event berhasil dihapus!');
    }

    public function umkmVerification()
    {
        $pendingUmkmProfiles = UmkmProfile::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        $verifiedUmkmProfiles = UmkmProfile::with('user')
            ->whereIn('status', ['verified', 'rejected'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $pendingRegistrations = EventRegistration::with(['umkmProfile', 'event'])
            ->where('status', 'pembayaran_terkonfirmasi')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/UMKMVerification', [
            'pendingUmkmProfiles' => $pendingUmkmProfiles,
            'verifiedUmkmProfiles' => $verifiedUmkmProfiles,
            'registrations' => $pendingRegistrations,
        ]);
    }

    public function finalizeRegistration(EventRegistration $registration)
    {
        if (is_null($registration->nomor_stand)) {
            return back()->with('error', 'Penyelenggara belum menginput nomor stand untuk UMKM ini.');
        }

        $kodePin = rand(100000, 999999);

        $registration->update([
            'status'      => 'approved',
            'kode_pin'    => $kodePin,
        ]);

        $registration->load('event', 'umkmProfile');
        RegistrationFinalized::dispatch($registration);

        return back()->with('success', 'Pendaftaran UMKM berhasil disetujui! E-Ticket telah dibuat.');
    }

    public function verifyUmkm(UmkmProfile $umkm)
    {
        $umkm->update(['status' => 'verified', 'rejection_reason' => null]);
        $umkm->refresh(); // Ambil data terbaru
        ProfileStatusUpdated::dispatch($umkm);
        return back()->with('success', 'UMKM berhasil diverifikasi!');
    }

    public function rejectUmkm(Request $request, UmkmProfile $umkm)
    {
        $request->validate(['rejection_reason' => 'required|string|min:10']);

        $umkm->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        $umkm->refresh(); // <-- TAMBAHKAN INI
        ProfileStatusUpdated::dispatch($umkm);

        return back()->with('success', 'UMKM ditolak.');
    }

    public function penyelenggaraVerification()
    {
        $pendingPenyelenggara = PenyelenggaraProfile::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        $verifiedPenyelenggara = PenyelenggaraProfile::with('user')
            ->whereIn('status', ['verified', 'rejected'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Admin/PenyelenggaraVerification', [
            'pendingPenyelenggara' => $pendingPenyelenggara,
            'verifiedPenyelenggara' => $verifiedPenyelenggara,
        ]);
    }

    public function verifyPenyelenggara(PenyelenggaraProfile $penyelenggara)
    {
        $penyelenggara->update(['status' => 'verified', 'rejection_reason' => null]);
        $penyelenggara->refresh(); // Ambil data terbaru
        ProfileStatusUpdated::dispatch($penyelenggara);
        return back()->with('success', 'Profil Penyelenggara berhasil diverifikasi!');
    }

    public function rejectPenyelenggara(Request $request, PenyelenggaraProfile $penyelenggara)
    {
        $request->validate(['rejection_reason' => 'required|string|min:10']);

        $penyelenggara->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        $penyelenggara->refresh(); // <-- TAMBAHKAN INI
        ProfileStatusUpdated::dispatch($penyelenggara);

        return back()->with('success', 'Profil Penyelenggara ditolak.');
    }

    public function listProposals()
    {
        $pendingProposals = Event::with('user')
            ->where('status_proposal', 'menunggu_persetujuan')
            ->orderBy('created_at', 'desc')
            ->get();

        $approvedProposals = Event::with('user')
            ->where('status_proposal', 'disetujui')
            ->orderBy('updated_at', 'desc')
            ->get();

        // --- ▼▼▼ PASTIKAN BAGIAN INI SUDAH BENAR ▼▼▼ ---
        $rejectedProposals = Event::withTrashed()->with('user') // Gunakan withTrashed()
            ->where('status_proposal', 'ditolak')
            ->orderBy('deleted_at', 'desc')
            ->get();

        return Inertia::render('Admin/ProposalList', [
            'pendingProposals' => $pendingProposals,
            'approvedProposals' => $approvedProposals,
            'rejectedProposals' => $rejectedProposals, // Pastikan ini dikirim
        ]);
        // --- ▲▲▲ AKHIR DARI BAGIAN PENTING ---
    }

    public function showProposal(Event $event)
    {
        $event->load('user.penyelenggaraProfile');
        return Inertia::render('Admin/ProposalDetail', ['proposal' => $event]);
    }

    public function approveProposal(Request $request, Event $event)
    {
        $event->update([
            'status_proposal' => 'disetujui',
            'status'          => null,
            'rejection_reason' => null,
        ]);

        $event->refresh(); // Ambil data terbaru
        ProposalStatusUpdated::dispatch($event);

        return redirect()->route('admin.proposals.list')->with('success', 'Proposal event telah disetujui dan siap untuk diterbitkan.');
    }

    public function rejectProposal(Request $request, Event $event)
    {
        $request->validate(['rejection_reason' => 'required|string|min:10']);

        $event->update([
            'status_proposal' => 'ditolak',
            'rejection_reason' => $request->rejection_reason,
        ]);

        $event->refresh(); // <-- TAMBAHKAN INI
        ProposalStatusUpdated::dispatch($event);

        $event->delete();

        return redirect()->route('admin.proposals.list')->with('success', 'Proposal event telah ditolak dan diarsipkan.');
    }

    public function permanentlyDeleteProposal($id)
    {
        // Temukan proposal, TERMASUK yang sudah di-soft delete
        $proposal = Event::withTrashed()->findOrFail($id);

        // Hapus file poster jika ada
        if ($proposal->poster_event) {
            Storage::disk('public')->delete($proposal->poster_event);
        }

        // Hapus secara permanen dari database
        $proposal->forceDelete();

        return back()->with('success', 'Proposal telah dihapus permanen.');
    }

    public function eventParticipants(Event $event)
    {
        $event->load('eventRegistrations.umkmProfile.user');

        return Inertia::render('Admin/EventParticipantVerification', [
            'event' => $event,
            'registrations' => $event->eventRegistrations,
        ]);
    }

    public function approveRegistration(EventRegistration $registration)
    {
        $registration->update(['status' => 'approved', 'rejection_reason' => null]);
        return back()->with('success', 'Pendaftaran UMKM disetujui.');
    }

    public function rejectRegistration(Request $request, EventRegistration $registration)
    {
        $request->validate(['rejection_reason' => 'required|string|min:10']);

        $registration->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason
        ]);

        return back()->with('success', 'Pendaftaran UMKM ditolak.');
    }
}
