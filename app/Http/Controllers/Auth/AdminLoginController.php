<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AdminLoginController extends Controller
{
    /**
     * Menampilkan form login untuk admin.
     */
    public function create()
    {
        return Inertia::render('Auth/AdminLogin');
    }

    /**
     * Menangani permintaan otentikasi untuk admin.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 1. Coba otentikasi pengguna
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // 2. Periksa apakah pengguna adalah admin
        $user = Auth::user();
        if (!$user->is_admin) {
            // Jika bukan admin, logout dan kirim error
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Akses ditolak. Akun ini bukan akun admin.',
            ]);
        }

        // 3. Jika admin, regenerasi session dan arahkan ke dashboard admin
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }
}
