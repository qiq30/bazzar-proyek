<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::user();

                // Logika redirect berdasarkan peran pengguna
                $home = match (true) {
                    $user->is_super_admin => route('superadmin.dashboard'),
                    $user->is_admin => route('admin.dashboard'),
                    $user->is_penyelenggara => route('penyelenggara.dashboard'),
                    default => route('dashboard'), // Default untuk UMKM
                };

                return redirect($home);
            }
        }

        return $next($request);
    }
}
