<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'adminCount' => User::where('is_admin', true)->count(),
                'umkmCount' => User::where('is_penyelenggara', false)->where('is_admin', false)->where('is_super_admin', false)->count(),
                'penyelenggaraCount' => User::where('is_penyelenggara', true)->count(),
            ]
        ]);
    }

    public function manageAdmins()
    {
        return Inertia::render('SuperAdmin/AdminManagement', [
            'admins' => User::where('is_admin', true)->orderBy('name')->get(),
        ]);
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Akun admin berhasil dibuat.');
    }

    public function destroyAdmin(User $admin)
    {
        // Pastikan user yang dihapus adalah admin
        if (!$admin->is_admin) {
            return back()->with('error', 'Pengguna ini bukan admin.');
        }
        $admin->delete();
        return back()->with('success', 'Akun admin berhasil dihapus.');
    }
}
