<?php
// File: app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Events\ProposalDocumentStatusUpdated;
use App\Events\UmkmProfileUpdated;
use App\Events\ProposalStatusUpdated;
use App\Models\Event;
use App\Models\UmkmProfile;
use App\Models\EventRegistration;
use App\Models\User; // <-- Pastikan User model di-import
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
    public function dashboard()
    {
        // --- ▼▼▼ PERBAIKAN FINAL DI SINI ▼▼▼ ---
        $pendingProposalsCount = Event::where(function ($query) {
            $query->where('status_proposal', 'menunggu_persetujuan')
                ->orWhere('document_verification_status', 'pending_document_verification');
        })->count();

        $stats = [
            'totalEvents' => Event::whereNotNull('status')->count(),
            'activeEvents' => Event::where('status', 'active')->count(),
            'totalUmkm' => UmkmProfile::count(),
            'verifiedUmkm' => UmkmProfile::where('status', 'verified')->count(),
            'pendingUmkm' => UmkmProfile::where('status', 'pending')->count(),
            'totalPenyelenggara' => PenyelenggaraProfile::count(),
            'verifiedPenyelenggara' => PenyelenggaraProfile::where('status', 'verified')->count(),
            'pendingPenyelenggara' => PenyelenggaraProfile::where('status', 'pending')->count(),
            'pendingProposals' => $pendingProposalsCount, // Menggunakan hasil query yang sudah digabung
        ];
        // --- ▲▲▲ AKHIR DARI PERBAIKAN ▲▲▲ ---

        // ... (sisa kode tidak berubah)
        $chartData = [
            'userComposition' => [
                'UMKM' => UmkmProfile::count(),
                'Penyelenggara' => PenyelenggaraProfile::count(),
            ],
            'popularEvents' => Event::withCount(['eventRegistrations' => function ($query) {
                $query->whereIn('status', ['approved', 'sudah_check_in', 'pembayaran_terkonfirmasi']);
            }])
                ->whereIn('status', ['active', 'upcoming'])
                ->orderBy('event_registrations_count', 'desc')
                ->limit(5)
                ->get(['nama_event', 'event_registrations_count'])
                ->mapWithKeys(function ($event) {
                    return [$event->nama_event => $event->event_registrations_count];
                }),
        ];

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }

    // ... (sisa method lainnya tidak perlu diubah) ...

    public function events()
    {
        $events = Event::whereNotNull('status')
            ->orderBy('tanggal_mulai_acara', 'desc')
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
            'status' => 'required|in:upcoming,active',
        ]);

        $event = Event::findOrFail($request->proposal_id);
        $panitiaPin = rand(100000, 999999);

        $event->update([
            'nama_event' => $request->nama_event,
            'deskripsi_event' => $request->deskripsi_event,
            'status' => $request->status,
            'panitia_pin' => $panitiaPin,
            'pendaftaran_dibuka' => $event->pendaftaran_dibuka,
            'pendaftaran_ditutup' => $event->pendaftaran_ditutup,
            'tanggal_mulai_acara' => $event->tanggal_mulai_acara,
            'tanggal_selesai_acara' => $event->tanggal_selesai_acara,
            'lokasi_event' => $event->lokasi_event,
            'biaya_pendaftaran_umkm' => $event->biaya_pendaftaran_umkm,
            'kuota_umkm' => $event->kuota_umkm,
        ]);

        EventPublished::dispatch($event);

        return redirect()->route('admin.events')->with('success', 'Event berhasil diterbitkan!');
    }

    public function updateEvent(Request $request, Event $event)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'tanggal_mulai_acara' => 'required|date',
            'tanggal_selesai_acara' => 'required|date|after_or_equal:tanggal_mulai_acara',
            'lokasi_event' => 'required|string|max:255',
            'status' => 'required|in:upcoming,active,finished',
        ]);

        $event->update($request->only([
            'nama_event',
            'tanggal_mulai_acara',
            'tanggal_selesai_acara',
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
        $umkm->refresh();
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

        $umkm->refresh();
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
        $penyelenggara->refresh();
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

        $penyelenggara->refresh();
        ProfileStatusUpdated::dispatch($penyelenggara);

        return back()->with('success', 'Profil Penyelenggara ditolak.');
    }

    public function listProposals()
    {
        $pendingDocumentProposals = Event::with('user')
            ->where('document_verification_status', 'pending_document_verification')
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingProposals = Event::with('user')
            ->where('status_proposal', 'menunggu_persetujuan')
            ->orderBy('created_at', 'desc')
            ->get();

        $approvedProposals = Event::with('user')
            ->where('status_proposal', 'disetujui')
            ->orderBy('updated_at', 'desc')
            ->get();

        $rejectedProposals = Event::withTrashed()->with('user')
            ->where(function ($query) {
                $query->where('status_proposal', 'ditolak')
                    ->orWhere('document_verification_status', 'document_rejected');
            })
            ->orderBy('deleted_at', 'desc')
            ->get();

        return Inertia::render('Admin/ProposalList', [
            'pendingDocumentProposals' => $pendingDocumentProposals, // Kirim data baru
            'pendingProposals' => $pendingProposals,
            'approvedProposals' => $approvedProposals,
            'rejectedProposals' => $rejectedProposals,
        ]);
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

        $event->refresh();
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

        $event->refresh();
        ProposalStatusUpdated::dispatch($event);

        $event->delete();

        return redirect()->route('admin.proposals.list')->with('success', 'Proposal event telah ditolak dan diarsipkan.');
    }

    public function permanentlyDeleteProposal($id)
    {
        $proposal = Event::withTrashed()->findOrFail($id);

        if ($proposal->poster_event) {
            Storage::disk('public')->delete($proposal->poster_event);
        }

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

    public function showDocumentReview(Event $event)
    {
        $event->load('user.penyelenggaraProfile');
        return Inertia::render('Admin/ProposalDocumentReview', ['proposal' => $event]);
    }

    public function approveDocument(Event $event)
    {
        $event->update([
            'document_verification_status' => 'document_approved',
            'document_rejection_reason' => null,
        ]);

        $event->load('user');
        // Picu event notifikasi untuk penyelenggara
        ProposalDocumentStatusUpdated::dispatch($event);

        return redirect()->route('admin.proposals.list')->with('success', 'Dokumen proposal telah disetujui. Penyelenggara dapat melanjutkan pengisian detail event.');
    }

    public function rejectDocument(Request $request, Event $event)
    {
        $request->validate([
            'document_rejection_reason' => 'required|string|min:10',
        ]);

        $event->update([
            'document_verification_status' => 'document_rejected',
            'document_rejection_reason' => $request->document_rejection_reason,
        ]);

        $event->load('user');
        // Picu event notifikasi untuk penyelenggara
        ProposalDocumentStatusUpdated::dispatch($event);

        return redirect()->route('admin.proposals.list')->with('success', 'Dokumen proposal telah ditolak.');
    }
}
