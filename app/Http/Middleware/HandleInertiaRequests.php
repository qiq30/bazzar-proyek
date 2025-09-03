<?php
// File: app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\ImpersonationRequest;


class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                // Ambil semua notifikasi dari relasi di model User
                'notifications' => $request->user() ? $request->user()->notifications : [],
                // Ambil jumlah notifikasi yang belum dibaca
                'unreadNotifications' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'impersonating' => fn() => $request->session()->has('impersonate_by'),
            'pendingImpersonationRequest' => fn() => $request->user()
                ? ImpersonationRequest::where('target_user_id', $request->user()->id)
                ->where('status', 'pending')
                ->where('expires_at', '>', now())
                ->exists()
                : null,
        ]);
    }
}
