<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

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
        if (!$admin->is_admin) {
            return back()->with('error', 'Pengguna ini bukan admin.');
        }
        $admin->delete();
        return back()->with('success', 'Akun admin berhasil dihapus.');
    }

    public function userManagementHub()
    {
        return Inertia::render('SuperAdmin/UserManagementHub');
    }

    public function manageUsers()
    {
        return Inertia::render('SuperAdmin/UserManagement', [
            'users' => User::where('is_super_admin', false)
                ->orderBy('name')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->is_admin ? 'Admin' : ($user->is_penyelenggara ? 'Penyelenggara' : 'UMKM'),
                    ];
                }),
        ]);
    }

    public function editUserProfile(User $user)
    {
        $profile = null;
        if ($user->is_penyelenggara) {
            $profile = $user->penyelenggaraProfile;
        } else if (!$user->is_admin) {
            $profile = $user->umkmProfile;
        }

        if (!$profile) {
            return redirect()->route('superadmin.users.manage')->with('error', 'Profil pengguna tidak ditemukan atau tidak dapat diedit.');
        }

        return Inertia::render('SuperAdmin/EditUserProfile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->is_admin ? 'Admin' : ($user->is_penyelenggara ? 'Penyelenggara' : 'UMKM'),
            ],
            'profile' => $profile,
        ]);
    }

    public function updateUserProfile(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($request->only('name', 'email'));

        if ($user->is_penyelenggara && $user->penyelenggaraProfile) {
            $request->validate([
                'organizer_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
            $profileData = $request->only('organizer_name', 'description', 'address');

            if ($request->hasFile('logo')) {
                if ($user->penyelenggaraProfile->logo_path) {
                    Storage::disk('public')->delete($user->penyelenggaraProfile->logo_path);
                }
                $profileData['logo_path'] = $request->file('logo')->store('penyelenggara/logos', 'public');
            }
            $user->penyelenggaraProfile->update($profileData);
        } elseif (!$user->is_admin && $user->umkmProfile) {
            $request->validate([
                'business_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'business_type' => 'required|string',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
            $profileData = $request->only('business_name', 'description', 'address', 'business_type');

            if ($request->hasFile('logo')) {
                if ($user->umkmProfile->logo_path) {
                    Storage::disk('public')->delete($user->umkmProfile->logo_path);
                }
                $profileData['logo_path'] = $request->file('logo')->store('umkm/logos', 'public');
            }
            $user->umkmProfile->update($profileData);
        }

        return redirect()->route('superadmin.users.manage')->with('success', 'Profil pengguna berhasil diperbarui.');
    }
}
