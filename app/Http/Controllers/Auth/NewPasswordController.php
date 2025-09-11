<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Menampilkan halaman untuk verifikasi OTP dan input password baru.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // Mengambil email dari session (lebih aman) atau dari request sebagai fallback.
        $email = session('email', $request->query('email'));

        // Jika email tidak ditemukan, kembalikan pengguna ke halaman permintaan reset password.
        if (!$email) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Sesi Anda telah berakhir. Silakan minta tautan reset baru.']);
        }

        return Inertia::render('Auth/VerifyPasswordOtp', [
            'email' => $email,
        ]);
    }

    /**
     * Menangani permintaan untuk mengatur ulang password.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi input dari form
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'otp' => ['required', 'numeric', 'digits:6'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Cari token OTP yang valid (belum kedaluwarsa)
        // Ini lebih efisien karena database yang melakukan filter waktu, bukan PHP.
        $otpRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('created_at', '>', Carbon::now()->subMinutes(10)) // Cari token yang dibuat dalam 10 menit terakhir
            ->first();

        // 3. Verifikasi OTP
        // Jika token tidak ditemukan ATAU hash OTP tidak cocok, gagalkan.
        // Pesan error digeneralisasi untuk keamanan (mencegah user menebak-nebak).
        if (!$otpRecord || !Hash::check($request->otp, $otpRecord->token)) {
            throw ValidationException::withMessages([
                'otp' => 'Kode OTP tidak valid atau telah kedaluwarsa.',
            ]);
        }

        // 4. Gunakan Database Transaction untuk memastikan semua proses berhasil
        // Jika salah satu gagal (misal: update password berhasil tapi hapus token gagal),
        // semua perubahan akan dibatalkan (rollback). Ini menjaga konsistensi data.
        DB::transaction(function () use ($request) {
            // Update password pengguna
            $user = User::where('email', $request->email)->first();
            $user->update([
                'password' => Hash::make($request->password),
            ]);

            // Hapus token dari database setelah berhasil digunakan
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        });

        // 5. Redirect ke halaman login dengan pesan sukses
        return redirect()->route('login')->with('status', 'Password Anda berhasil diatur ulang!');
    }
}
