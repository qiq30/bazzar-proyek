<?php
// app/Http/Middleware/UmkmMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UmkmMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // HANYA izinkan jika pengguna BUKAN admin, BUKAN penyelenggara, DAN BUKAN super admin.
        if (!Auth::check() || Auth::user()->is_admin || Auth::user()->is_penyelenggara || Auth::user()->is_super_admin) {
            abort(403, 'AKSES DITOLAK: Unauthorized access.');
        }
        return $next($request);
    }
}
