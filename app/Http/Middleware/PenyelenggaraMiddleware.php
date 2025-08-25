<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PenyelenggaraMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // HANYA izinkan jika pengguna adalah seorang penyelenggara.
        if (!Auth::check() || !Auth::user()->is_penyelenggara) {
            abort(403, 'AKSES DITOLAK: Unauthorized access.');
        }
        return $next($request);
    }
}
