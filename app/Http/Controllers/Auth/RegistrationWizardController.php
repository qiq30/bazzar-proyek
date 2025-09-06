<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use App\Events\NewUserRegisteredForVerification;
use App\Events\ProfileStatusUpdated; // <-- 1. TAMBAHKAN IMPORT INI

class RegistrationWizardController extends Controller
{
    // ... method showSteps dan storeStep1 tidak berubah ...
    public function showSteps(Request $request)
    {
        $role = $request->query('role', 'umkm');
        if (!in_array($role, ['umkm', 'penyelenggara'])) {
            $role = 'umkm';
        }

        return Inertia::render('Auth/RegisterWizard', [
            'role' => $role,
            'initialStep' => (int)$request->query('step', 1),
            'wizardData' => $request->session()->get('wizard_data', []),
        ]);
    }

    public function storeStep1(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:umkm,penyelenggara',
        ]);

        $request->session()->put('wizard_data.step1', $request->only('name', 'email', 'password', 'role'));

        return redirect()->route('register.wizard', ['role' => $request->role, 'step' => 2]);
    }


    public function storeFinal(Request $request)
    {
        // --- Bagian Validasi dan Pembuatan User (Tidak perlu diubah) ---
        $step1Data = $request->session()->get('wizard_data.step1');
        if (!$step1Data) {
            return redirect()->route('register.wizard');
        }
        $role = $step1Data['role'];
        if ($role === 'umkm') {
            $request->validate([
                'business_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'business_type' => 'required|string',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'ktp' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
        } else {
            $request->validate([
                'organizer_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'verification_document' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
        }
        $user = User::create([
            'name' => $step1Data['name'],
            'email' => $step1Data['email'],
            'password' => Hash::make($step1Data['password']),
            'is_penyelenggara' => $role === 'penyelenggara',
        ]);
        $profile = null;
        if ($role === 'umkm') {
            $logoPath = $request->hasFile('logo') ? $request->file('logo')->store('umkm/logos', 'public') : null;
            $ktpPath = $request->file('ktp')->store('umkm/ktp', 'public');
            $profile = UmkmProfile::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'description' => $request->description,
                'address' => $request->address,
                'business_type' => $request->business_type,
                'logo_path' => $logoPath,
                'ktp_path' => $ktpPath,
                'status' => 'pending'
            ]);
        } else {
            $logoPath = $request->hasFile('logo') ? $request->file('logo')->store('penyelenggara/logos', 'public') : null;
            $docPath = $request->file('verification_document')->store('penyelenggara/documents', 'public');
            $profile = PenyelenggaraProfile::create([
                'user_id' => $user->id,
                'organizer_name' => $request->organizer_name,
                'description' => $request->description,
                'address' => $request->address,
                'logo_path' => $logoPath,
                'verification_document_path' => $docPath,
                'status' => 'pending'
            ]);
        }
        event(new Registered($user));

        NewUserRegisteredForVerification::dispatch($user);
        ProfileStatusUpdated::dispatch($profile);
        Auth::login($user);

        $request->session()->forget('wizard_data');
        $redirectRoute = $user->is_penyelenggara ? 'penyelenggara.dashboard' : 'umkm.dashboard';

        return redirect()->route($redirectRoute)->with('success', 'Registrasi berhasil!');
    }
}
