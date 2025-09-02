<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class SuperAdminLoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/SuperAdminLogin');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages(['email' => trans('auth.failed')]);
        }

        $user = Auth::user();
        if (!$user->is_super_admin) {
            Auth::logout();
            throw ValidationException::withMessages(['email' => 'Akses ditolak.']);
        }

        $request->session()->regenerate();
        return redirect()->intended(route('superadmin.dashboard'));
    }
}
