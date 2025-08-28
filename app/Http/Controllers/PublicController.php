<?php
// app/Http/Controllers/PublicController.php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home(Request $request)
    {

        $filters = $request->only('search', 'status');

        // --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ ---
        $events = Event::query()
            // Hanya ambil event yang belum selesai
            ->whereIn('status', ['active', 'upcoming'])
            // Terapkan filter dari request
            ->filter($filters)
            // Ganti 'tanggal_mulai' menjadi 'tanggal_mulai_acara'
            ->orderBy('tanggal_mulai_acara', 'asc')
            ->take(12)
            ->get();
        // --- ▲▲▲ AKHIR DARI PERBAIKAN ---

        return Inertia::render('Public/HomePage', [
            'events' => $events,
            'filters' => $filters,
        ]);
    }

    public function umkmDirectory(Event $event)
    {
        $umkmProfiles = $event->verifiedParticipants()
            ->get();

        $umkmProfiles->each(function ($profile) {
            $profile->logo_url = $profile->logo_path ? Storage::url($profile->logo_path) : null;
            $profile->qris_url = $profile->qris_path ? Storage::url($profile->qris_path) : null;
        });

        return Inertia::render('Public/UMKMDirectoryPage', [
            'event' => $event,
            'umkmProfiles' => $umkmProfiles
        ]);
    }

    public function umkmDetail(UmkmProfile $umkm)
    {
        $umkm->load('user', 'products');

        $umkm->logo_url = $umkm->logo_path ? Storage::url($umkm->logo_path) : null;
        $umkm->qris_url = $umkm->qris_path ? Storage::url($umkm->qris_path) : null;

        return Inertia::render('Public/UMKMDetailPage', [
            'umkm' => $umkm
        ]);
    }
}
