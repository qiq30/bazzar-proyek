<?php
// app/Http/Controllers/PublicController.php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class PublicController extends Controller
{
    public function home(Request $request)
    {

        $filters = $request->only('search', 'status');

        // Buat cache key unik berdasarkan filter
        $cacheKey = 'public_home_events_' . md5(json_encode($filters));

        $events = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($filters) {
            return Event::query()
                // Hanya ambil event yang belum selesai (termasuk pendaftaran buka/tutup)
                ->whereIn('status', [Event::STATUS_ACTIVE, Event::STATUS_UPCOMING, Event::STATUS_REGISTRATION_OPEN, Event::STATUS_REGISTRATION_CLOSED])
                ->where('status_proposal', Event::PROPOSAL_APPROVED)
                // Terapkan filter dari request
                ->filter($filters)
                // Ganti 'tanggal_mulai' menjadi 'tanggal_mulai_acara'
                ->orderBy('tanggal_mulai_acara', 'asc')
                ->take(12)
                ->get();
        });

        // Transform status for public view (Guest & Regular Users)
        // Admin & UMKM will see detailed statuses
        $user = $request->user();
        $shouldSimplifyStatus = !$user || (!$user->isAdmin() && !$user->hasUmkmProfile());

        if ($shouldSimplifyStatus) {
            $events->transform(function ($event) {
                if (in_array($event->status, [Event::STATUS_REGISTRATION_OPEN, Event::STATUS_REGISTRATION_CLOSED])) {
                    $event->status = Event::STATUS_UPCOMING;
                }
                return $event;
            });
        }

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
