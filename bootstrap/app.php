<?php
// File: bootstrap/app.php

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

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
            $user = Auth::user();

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

            // Jika $user adalah null (belum login) ATAU tidak punya peran di atas
            return route('umkm.dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) { // <--- MODIFIKASI DI SINI

        $exceptions->render(function (Throwable $e, Request $request) {

            // Tentukan status code dari exception
            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
            } else {
                $status = 500;
            }

            // Daftar kode error yang ingin kita render dengan Inertia
            $errorCodes = [403, 404, 500, 503];

            if (in_array($status, $errorCodes)) {

                // Jika APP_DEBUG=true dan errornya 500,
                // kembalikan null agar Ignition (halaman debug default) yang tampil.
                if ($status === 500 && config('app.debug')) {
                    return null;
                }

                // Render komponen Error.jsx Anda
                return Inertia::render('Error', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            // Untuk error lain (misal: 419, 429), biarkan Laravel menanganinya
            return null;
        });
    })->create();



// 3. Return variabel $app
return $app;
