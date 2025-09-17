<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendPasswordResetOtpMail;
use Carbon\Carbon;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => trans('passwords.user'),
            ]);
        }

        // Hapus token/OTP lama jika ada
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Buat OTP
        $otp = rand(100000, 999999);

        // Simpan OTP yang sudah di-hash ke database
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($otp),
            'created_at' => Carbon::now()
        ]);

        // Kirim email berisi OTP
        try {
            Mail::to($request->email)->send(new SendPasswordResetOtpMail($otp));
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => 'Gagal mengirim email OTP. Silakan coba lagi nanti.',
            ]);
        }

        // Alihkan ke halaman input OTP
        return redirect()->route('password.reset')->with('email', $request->email);
    }
}
