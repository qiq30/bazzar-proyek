<?php
// File: bootstrap/app.php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Event;

// 1. Buat aplikasi dan simpan dalam variabel $app
$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        channels: __DIR__ . '/../routes/channels.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'penyelenggara' => \App\Http\Middleware\PenyelenggaraMiddleware::class,
            'umkm' => \App\Http\Middleware\UmkmMiddleware::class,
            'super_admin' => \App\Http\Middleware\SuperAdminMiddleware::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        ]);

        $middleware->redirectUsersTo(function () {
            $user = auth()->user();
            if ($user) {
                if ($user->is_super_admin) {
                    return route('superadmin.dashboard');
                }
                if ($user->is_admin) {
                    return route('admin.dashboard');
                }
                if ($user->is_penyelenggara) {
                    return route('penyelenggara.dashboard');
                }
            }
            // Jika tidak ada peran di atas yang cocok, arahkan ke dasbor UMKM
            return route('umkm.dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();



// 3. Return variabel $app
return $app;
