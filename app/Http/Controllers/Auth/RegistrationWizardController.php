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
use App\Events\ProfileStatusUpdated;

// Import tambahan untuk OTP
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;


class RegistrationWizardController extends Controller
{
    public function showSteps(Request $request)
    {
        $role = $request->query('role', 'umkm');
        if (!in_array($role, ['umkm', 'penyelenggara'])) {
            $role = 'umkm';
        }

        $step = (int)$request->query('step', 1);
        $wizardData = $request->session()->get('wizard_data', []);

        // Jika pengguna mencoba mengakses step 2 tanpa menyelesaikan step 1 (dan verifikasi OTP),
        // paksa kembali ke step 1.
        if ($step === 2 && (empty($wizardData['step1']) || empty($wizardData['step1_verified']))) {
            return redirect()->route('register.wizard', ['role' => $role, 'step' => 1]);
        }

        return Inertia::render('Auth/RegisterWizard', [
            'role' => $role,
            'initialStep' => $step,
            'wizardData' => $wizardData,
        ]);
    }

    /**
     * Store step 1 data, generate OTP, send email, and redirect to OTP form.
     */
    public function storeStep1(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:umkm,penyelenggara',
        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Store registration data and OTP in session
        $request->session()->put('wizard_data.step1', $request->only('name', 'email', 'password', 'role'));
        $request->session()->put('otp_details', [
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10) // OTP valid for 10 minutes
        ]);

        // Send OTP email
        try {
            Mail::to($request->email)->send(new SendOtpMail($otp));
        } catch (\Exception $e) {
            // If email fails, redirect back with an error
            return back()->withErrors(['email' => 'Gagal mengirim email verifikasi. Pastikan konfigurasi SMTP Anda benar.']);
        }

        // Redirect to OTP verification form
        return redirect()->route('register.show.otp')->with('email', $request->email);
    }

    /**
     * Show the OTP verification form.
     */
    public function showOtpForm(Request $request)
    {
        // Make sure user comes from step 1
        if (!$request->session()->has('wizard_data.step1')) {
            return redirect()->route('register.wizard');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $request->session()->get('wizard_data.step1.email')
        ]);
    }

    /**
     * Verify OTP and create the user if valid.
     */
    public function verifyOtpAndRegister(Request $request)
    {
        $request->validate(['otp' => 'required|numeric|digits:6']);

        $wizardData = $request->session()->get('wizard_data.step1');
        $otpDetails = $request->session()->get('otp_details');

        // Check if session data exists
        if (!$wizardData || !$otpDetails) {
            return redirect()->route('register.wizard')->withErrors(['otp' => 'Sesi registrasi tidak ditemukan atau telah kedaluwarsa.']);
        }

        // Check if OTP has expired
        if (Carbon::now()->isAfter($otpDetails['expires_at'])) {
            return redirect()->route('register.show.otp')->withErrors(['otp' => 'Kode OTP telah kedaluwarsa.']);
        }

        // Check if OTP is correct
        if ($otpDetails['otp'] != $request->otp) {
            return redirect()->route('register.show.otp')->withErrors(['otp' => 'Kode OTP tidak valid.']);
        }

        // --- OTP is valid, now proceed to the next step ---
        $request->session()->forget('otp_details'); // Clear OTP from session
        $request->session()->put('wizard_data.step1_verified', true); // Mark step 1 as verified

        // Redirect to Step 2
        return redirect()->route('register.wizard', ['role' => $wizardData['role'], 'step' => 2]);
    }


    public function storeFinal(Request $request)
    {
        // --- Bagian Validasi dan Pembuatan User (Tidak perlu diubah) ---
        $step1Data = $request->session()->get('wizard_data.step1');

        // Ensure user has verified OTP for step 1
        if (!$step1Data || !$request->session()->get('wizard_data.step1_verified')) {
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
            'email_verified_at' => now(), // Mark email as verified
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

    public function resendOtp(Request $request)
    {
        // Pastikan data step 1 ada di session
        $step1Data = $request->session()->get('wizard_data.step1');
        if (!$step1Data) {
            // Jika tidak ada sesi, tidak bisa lanjut
            return back()->withErrors(['otp' => 'Sesi Anda telah berakhir, silakan mulai lagi.']);
        }

        // Generate OTP baru
        $otp = rand(100000, 999999);

        // Update session dengan OTP dan waktu kedaluwarsa yang baru
        $request->session()->put('otp_details', [
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        // Kirim ulang email OTP
        try {
            Mail::to($step1Data['email'])->send(new SendOtpMail($otp));
        } catch (\Exception $e) {
            return back()->withErrors(['otp' => 'Gagal mengirim ulang email verifikasi.']);
        }

        // Kembali ke halaman sebelumnya (halaman OTP)
        return back();
    }
}
