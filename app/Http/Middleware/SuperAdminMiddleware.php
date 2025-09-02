<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Izinkan jika user yang sedang login adalah super admin,
        // ATAU jika ada sesi 'impersonate_by' yang menandakan super admin sedang menyamar.
        if (Auth::check() && (Auth::user()->is_super_admin || $request->session()->has('impersonate_by'))) {
            return $next($request);
        }

        abort(403, 'AKSES SUPER ADMIN DITOLAK.');
    }
}
