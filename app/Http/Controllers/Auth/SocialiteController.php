<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->with(['prompt' => 'select_account'])->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())->orWhere('email', $googleUser->getEmail())->first();

            if ($user) {
                // Pengguna sudah ada, update data jika perlu
                $user->update([
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(), // Pastikan google_id terisi jika login via email
                    'google_token' => $googleUser->token,
                ]);
            } else {
                // Pengguna baru, buat akun
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'google_token' => $googleUser->token,
                    'password' => Hash::make(Str::random(24)), // Buat password acak
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user);


            // Prioritas 1: Tangani pengguna yang baru dibuat atau yang belum memilih peran.
            // wasRecentlyCreated memastikan ini hanya berlaku untuk registrasi baru.
            if ($user->wasRecentlyCreated || (!$user->is_penyelenggara && !$user->umkmProfile && !$user->penyelenggaraProfile)) {
                return redirect()->route('auth.google.select-role');
            }
            // Prioritas 2: Jika sudah memilih peran Penyelenggara tapi profil belum lengkap.
            else if ($user->is_penyelenggara && !$user->penyelenggaraProfile) {
                return redirect()->route('penyelenggara.profile.setup');
            }
            // Prioritas 3: Jika merupakan UMKM (bukan penyelenggara) tapi profil belum lengkap.
            else if (!$user->is_penyelenggara && !$user->umkmProfile) {
                return redirect()->route('umkm.profile.setup');
            }
            // Prioritas 4 (Default): Jika semua sudah lengkap, arahkan ke dashboard yang sesuai.
            else {
                $home = match (true) {
                    $user->is_super_admin => route('superadmin.dashboard'),
                    $user->is_admin => route('admin.dashboard'),
                    $user->is_penyelenggara => route('penyelenggara.dashboard'),
                    default => route('umkm.dashboard'),
                };
                return redirect()->intended($home);
            }
        } catch (\Throwable $th) {
            Log::error('Google Login Callback Error: ' . $th->getMessage(), [
                'trace' => $th->getTraceAsString()
            ]);

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
