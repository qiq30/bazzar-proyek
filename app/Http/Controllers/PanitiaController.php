<?php
// File: app/Http/Controllers/PanitiaController.php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanitiaController extends Controller
{
    // Menampilkan halaman login PIN
    public function showPinLogin(Request $request)
    {
        // Jika panitia sudah punya sesi, langsung arahkan ke dashboard
        if ($request->session()->has('panitia_event_id')) {
            return redirect()->route('panitia.dashboard');
        }

        return Inertia::render('Panitia/PinLogin');
    }

    // Memvalidasi PIN dan menyimpan event_id di session
    public function handlePinLogin(Request $request)
    {
        $request->validate(['pin' => 'required|digits:6']);

        $event = Event::where('panitia_pin', $request->pin)->first();

        if ($event) {
            $request->session()->put('panitia_event_id', $event->id);
            return redirect()->route('panitia.dashboard');
        }

        return back()->withErrors(['pin' => 'PIN Panitia tidak valid.']);
    }

    // Menampilkan dashboard panitia
    public function showDashboard(Request $request)
    {
        $eventId = $request->session()->get('panitia_event_id');

        if (!$eventId) {
            return redirect()->route('panitia.login.show');
        }

        $event = Event::with(['eventRegistrations.umkmProfile.user'])->findOrFail($eventId);

        return Inertia::render('Panitia/Dashboard', [
            'event' => $event,
        ]);
    }

    // Mencari pendaftar berdasarkan kode pendaftaran, kode PIN, atau nama UMKM
    public function search(Request $request, Event $event)
    {
        $request->validate(['term' => 'required|string']);
        $term = $request->input('term');

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('status', '!=', EventRegistration::STATUS_REJECTED) // Tetap tolak yang sudah ditolak
            ->where(function ($query) use ($term) {
                $query->where('kode_pendaftaran', $term) // Prioritaskan pencarian berdasarkan kode pendaftaran (hasil scan)
                    ->orWhere('kode_pin', $term)
                    ->orWhereHas('umkmProfile', function ($q) use ($term) {
                        $q->where('business_name', 'LIKE', "%{$term}%");
                    });
            })
            ->with('umkmProfile')
            ->first();

        return response()->json($registration);
    }
    // Memproses check-in pendaftar
    public function processCheckIn(EventRegistration $registration)
    {
        // Pastikan pendaftar ini milik event yang sedang diakses panitia
        if ($registration->event_id != session('panitia_event_id')) {
            abort(403);
        }

        if ($registration->status === EventRegistration::STATUS_APPROVED) {
            $registration->update(['status' => EventRegistration::STATUS_CHECKED_IN]);
            return response()->json(['success' => true, 'message' => 'Check-in Berhasil!']);
        }

        return response()->json(['success' => false, 'message' => 'Gagal, status pendaftar tidak valid.'], 422);
    }

    public function handleLogout(Request $request)
    {
        $request->session()->forget('panitia_event_id');
        return redirect()->route('panitia.login.show');
    }
}
