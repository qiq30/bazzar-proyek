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
use App\Rules\Recaptcha;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class RegistrationWizardController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'role' => 'required|in:umkm,penyelenggara'
        ]);

        // Buat token unik untuk sesi wizard
        $wizardToken = Str::random(40);

        // Simpan token dan role ke dalam session utama
        $request->session()->put('wizard_token', $wizardToken);
        $request->session()->put('wizard_role', $request->role);

        // Redirect ke halaman wizard dengan token
        return redirect()->route('register.wizard', ['token' => $wizardToken]);
    }

    public function showSteps(Request $request, $token)
    {
        // Validasi token dari URL dengan yang ada di session
        if ($token !== $request->session()->get('wizard_token')) {
            // Jika tidak cocok, arahkan kembali ke halaman utama atau login
            return redirect()->route('home')->with('error', 'Sesi registrasi tidak valid.');
        }

        $role = $request->session()->get('wizard_role', 'umkm');
        $step = (int)$request->query('step', 1);
        $wizardData = $request->session()->get('wizard_data', []);

        if ($step === 2 && (empty($wizardData['step1']) || empty($wizardData['step1_verified']))) {
            return redirect()->route('register.wizard', ['token' => $token, 'step' => 1]);
        }

        return Inertia::render('Auth/RegisterWizard', [
            'role' => $role,
            'initialStep' => $step,
            'wizardData' => $wizardData,
            'token' => $token,
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
            'g-recaptcha-response' => ['required', new Recaptcha],

        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Store registration data and OTP in session
        $request->session()->put('wizard_data.step1', $request->only('name', 'email', 'password', 'role'));
        $request->session()->put('otp_details', [
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(1)
        ]);

        // Send OTP email
        try {
            Mail::to($request->email)->send(new SendOtpMail($otp));
        } catch (\Exception $e) {
            // If email fails, redirect back with an error
            return back()->withErrors(['email' => 'Gagal mengirim email verifikasi. Pastikan anda terhubung ke internet dengan benar.']);
        }

        $request->session()->save();

        // Ambil token dari sesi
        $wizardToken = $request->session()->get('wizard_token');
        Log::info('Session data before redirect:', $request->session()->all()); // Log semua data sesi
        Log::info('Wizard data step1 exists:', ['exists' => $request->session()->has('wizard_data.step1')]); // Cek spesifik
        // Redirect ke OTP verification form DENGAN TOKEN di URL
        return redirect()->route('register.show.otp', ['token' => $wizardToken]) // Tambahkan parameter token
            ->with('email', $request->email); // Tetap flash email untuk fallback jika perlu
    }

    /**
     * Show the OTP verification form.
     */
    public function showOtpForm(Request $request, $token) // Tambahkan $token
    {
        Log::info('Session data on showOtpForm load:', $request->session()->all()); // <-- Kode Anda
        Log::info('Wizard data step1 exists on load:', ['exists' => $request->session()->has('wizard_data.step1')]); // <-- Kode Anda

        // Validasi token sesi (PENTING)
        if ($token !== $request->session()->get('wizard_token')) {
            return redirect()->route('home')->with('error', 'Sesi registrasi tidak valid atau telah kedaluwarsa.');
        }

        // Pastikan pengguna datang dari langkah 1 (cek data sesi)
        if (!$request->session()->has('wizard_data.step1')) {
            return redirect()->route('home')->with('error', 'Silakan mulai registrasi dari awal.');
        }

        // Ambil email dari sesi yang disimpan di step 1
        $emailFromSession = $request->session()->get('wizard_data.step1.email');

        if (!$emailFromSession) {
            return redirect()->route('home')->with('error', 'Email tidak ditemukan dalam sesi registrasi.');
        }

        // Ambil detail OTP dari sesi
        $otpDetails = $request->session()->get('otp_details');

        // Pastikan otpDetails ada dan memiliki expires_at
        $otpExpiryTimestamp = null;
        if ($otpDetails && isset($otpDetails['expires_at']) && $otpDetails['expires_at'] instanceof Carbon) {
            // Ubah Carbon instance menjadi timestamp milidetik untuk JavaScript
            $otpExpiryTimestamp = $otpDetails['expires_at']->valueOf();
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $emailFromSession,
            'token' => $token,
            'initialOtpExpiryTimestamp' => $otpExpiryTimestamp
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
        $wizardToken = $request->session()->get('wizard_token'); // Ambil token

        // Check if session data exists
        if (!$wizardData || !$otpDetails || !$wizardToken) {
            return redirect()->route('home')->withErrors(['otp' => 'Sesi registrasi tidak ditemukan atau telah kedaluwarsa.']);
        }

        // Check if OTP has expired
        if (Carbon::now()->isAfter($otpDetails['expires_at'])) {
            return redirect()->route('register.show.otp')->withErrors(['otp' => 'Kode OTP telah kedaluwarsa.']);
        }

        // Check if OTP is correct
        if ($otpDetails['otp'] != $request->otp) {
            return redirect()->route('register.show.otp')->withErrors(['otp' => 'Kode OTP tidak valid.']);
        }

        // OTP is valid, now proceed to the next step
        $request->session()->forget('otp_details'); // Clear OTP from session
        $request->session()->put('wizard_data.step1_verified', true); // Mark step 1 as verified

        // Redirect to Step 2
        return redirect()->route('register.wizard', ['token' => $wizardToken, 'step' => 2]);
    }


    public function storeFinal(Request $request)
    {
        $step1Data = $request->session()->get('wizard_data.step1');

        if (!$step1Data || !$request->session()->get('wizard_data.step1_verified')) {
            return redirect()->route('home');
        }

        $role = $step1Data['role'];
        if ($role === 'umkm') {
            $request->validate([
                'business_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'business_type' => 'required|string',
                'logo' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Max 2MB
                'ktp' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Max 2MB
            ]);
        } else {
            $request->validate([
                'organizer_name' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'verification_document' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Max 2MB
                'logo' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Max 2MB
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

        // Hapus semua data wizard dari session
        $request->session()->forget(['wizard_data', 'wizard_token', 'wizard_role']);
        $redirectRoute = $user->is_penyelenggara ? 'penyelenggara.dashboard' : 'umkm.dashboard';

        return redirect()->route($redirectRoute)->with('success', 'Registrasi berhasil!');
    }

    public function resendOtp(Request $request)
    {
        $step1Data = $request->session()->get('wizard_data.step1');
        if (!$step1Data) {
            return back()->withErrors(['otp' => 'Sesi Anda telah berakhir, silakan mulai lagi.']);
        }

        $otp = rand(100000, 999999);

        $request->session()->put('otp_details', [
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(1)
        ]);

        try {
            Mail::to($step1Data['email'])->send(new SendOtpMail($otp));
        } catch (\Exception $e) {
            return back()->withErrors(['otp' => 'Gagal mengirim ulang email verifikasi.']);
        }

        return back();
    }
}
