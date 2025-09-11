<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // <-- 1. Tambahkan ini
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_token' => $googleUser->token,
                    'email_verified_at' => now(),
                ]
            );

            Auth::login($user);

            if ($user->wasRecentlyCreated || (!$user->umkmProfile && !$user->penyelenggaraProfile)) {
                if (!$user->is_penyelenggara && !$user->umkmProfile && !$user->penyelenggaraProfile) {
                    return redirect()->route('auth.google.select-role');
                }
                if (!$user->is_penyelenggara && !$user->umkmProfile) {
                    return redirect()->route('umkm.profile.setup');
                }
                if ($user->is_penyelenggara && !$user->penyelenggaraProfile) {
                    return redirect()->route('penyelenggara.profile.setup');
                }
            }

            if ($user->is_penyelenggara) {
                return redirect()->intended(route('penyelenggara.dashboard'));
            }

            return redirect()->intended(route('umkm.dashboard'));
        } catch (\Throwable $th) {
            // === 2. PERUBAHAN UTAMA DI SINI ===
            // Catat error yang detail ke file log
            Log::error('Google Login Callback Error: ' . $th->getMessage(), [
                'trace' => $th->getTraceAsString()
            ]);

            // Arahkan kembali dengan pesan error yang lebih informatif
            return redirect()->route('login')->with('error', 'Login Google gagal. Silakan coba lagi atau hubungi admin.');
        }
    }

    /**
     * Menampilkan halaman pemilihan peran.
     */
    public function showRoleSelection()
    {
        return Inertia::render('Auth/SelectRole');
    }

    /**
     * Menyimpan peran yang dipilih dan mengarahkan ke setup profil.
     */
    public function saveRole(Request $request)
    {
        $request->validate(['role' => 'required|in:umkm,penyelenggara']);

        $user = Auth::user();

        if ($request->role === 'penyelenggara') {
            $user->is_penyelenggara = true;
            $user->save();
            return redirect()->route('penyelenggara.profile.setup')->with('success', 'Silakan lengkapi profil Penyelenggara Anda.');
        }

        return redirect()->route('umkm.profile.setup')->with('success', 'Silakan lengkapi profil UMKM Anda.');
    }
}
