<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\UmkmController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PanitiaController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\PenyelenggaraController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Auth\RegistrationWizardController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\SuperAdminLoginController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\SuperAdmin\ImpersonateController;
use App\Http\Controllers\ImpersonationApprovalController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SuperAdmin\SystemReportController;
use App\Http\Controllers\Auth\SocialiteController;

// Rute untuk Google OAuth
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('auth.google.callback');

// RUTE WIZARD REGISTRASI
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegistrationWizardController::class, 'showSteps'])->name('register.wizard');

    Route::post('/register-step-1', [RegistrationWizardController::class, 'storeStep1'])
        ->middleware('throttle:5,1')
        ->name('register.wizard.step1');

    Route::post('/register/resend-otp', [RegistrationWizardController::class, 'resendOtp'])
        ->middleware('throttle:1,1') // Batasi 1 request per menit
        ->name('register.resend.otp');

    Route::get('/register/verify-otp', [RegistrationWizardController::class, 'showOtpForm'])
        ->name('register.show.otp');
    Route::post('/register/verify-otp', [RegistrationWizardController::class, 'verifyOtpAndRegister'])
        ->middleware('throttle:5,1')
        ->name('register.verify.otp');

    Route::post('/register-finish', [RegistrationWizardController::class, 'storeFinal'])
        ->middleware('throttle:5,1')
        ->name('register.wizard.finish');
});

// SUPER ADMIN ROUTES
Route::middleware('guest')->group(function () {
    // Gunakan nama rute yang tidak umum untuk membuatnya tersembunyi
    Route::get('/super-secret-login-page', [SuperAdminLoginController::class, 'create'])->name('superadmin.login');
    Route::post('/super-secret-login-page', [SuperAdminLoginController::class, 'store'])->name('superadmin.login.store');
});

Route::middleware(['auth', 'super_admin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');
    // Rute baru untuk halaman hub
    Route::get('/users/hub', [SuperAdminController::class, 'userManagementHub'])->name('users.hub');

    Route::get('/admins', [SuperAdminController::class, 'manageAdmins'])->name('admins.manage');
    Route::post('/admins', [SuperAdminController::class, 'storeAdmin'])->name('admins.store');
    Route::delete('/admins/{admin}', [SuperAdminController::class, 'destroyAdmin'])->name('admins.destroy');

    Route::get('/admins', [SuperAdminController::class, 'manageAdmins'])->name('admins.manage');
    Route::post('/admins', [SuperAdminController::class, 'storeAdmin'])->name('admins.store');
    Route::delete('/admins/{admin}', [SuperAdminController::class, 'destroyAdmin'])->name('admins.destroy');

    // Rute untuk MEMINTA akses impersonate
    Route::post('/impersonate/request/{user}', [ImpersonateController::class, 'request'])->name('impersonate.request');
    // Rute untuk MEMULAI impersonate SETELAH disetujui
    Route::post('/impersonate/stop', [ImpersonateController::class, 'stop'])
        ->middleware('auth') // Pastikan hanya user yang login yang bisa stop
        ->name('impersonate.stop');
    Route::get('/impersonate/start/{impersonationRequest}', [ImpersonateController::class, 'start'])->name('impersonate.start');

    Route::get('/users', [SuperAdminController::class, 'manageUsers'])->name('users.manage');
    Route::get('/users/{user}/edit', [SuperAdminController::class, 'editUserProfile'])->name('users.edit');
    Route::put('/users/{user}', [SuperAdminController::class, 'updateUserProfile'])->name('users.update');

    Route::get('/log-hub', [SuperAdminController::class, 'logHub'])->name('log.hub');
    Route::get('/system-report', [SystemReportController::class, 'index'])->name('system.report');
});




// ADMIN LOGIN ROUTE
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminLoginController::class, 'create'])->name('login');
    Route::post('login', [AdminLoginController::class, 'store'])->name('login.store');
});

// Public Routes (No Authentication)
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/events/{event}/umkm', [PublicController::class, 'umkmDirectory'])->name('public.umkm.directory');
Route::get('/umkm/{umkm}', [PublicController::class, 'umkmDetail'])->name('public.umkm.detail');

// Authentication Routes (Laravel Breeze)
require __DIR__ . '/auth.php';

// UMKM Routes (Authenticated Users)
// Terapkan middleware 'umkm'
Route::middleware(['auth', 'verified', 'umkm'])->group(function () {
    Route::get('/dashboard', [UmkmController::class, 'dashboard'])->name('umkm.dashboard');
    Route::get('/profile/setup', [UmkmController::class, 'profileSetup'])->name('umkm.profile.setup');
    Route::post('/profile/setup', [UmkmController::class, 'storeProfile'])->name('umkm.profile.store');
    Route::get('/events', [UmkmController::class, 'events'])->name('umkm.events');
    Route::post('/events/{event}/register', [UmkmController::class, 'startRegistration'])->name('umkm.events.register');
    Route::get('/payment/{registration}', [UmkmController::class, 'showPaymentPage'])->name('umkm.events.pay');
    Route::post('/payment/{registration}', [UmkmController::class, 'uploadPaymentProof'])->name('umkm.events.uploadProof');
    Route::get('/my-tickets', [UmkmController::class, 'myTickets'])->name('umkm.tickets');
    Route::get('/my-tickets/{registration}/download', [UmkmController::class, 'downloadTicket'])->name('umkm.tickets.download');
    Route::get('/qris/upload', [UmkmController::class, 'uploadQris'])->name('umkm.qris.upload');
    Route::post('/qris/upload', [UmkmController::class, 'storeQris'])->name('umkm.qris.store');
    Route::get('/products', [UmkmController::class, 'products'])->name('umkm.products');
    Route::post('/products', [UmkmController::class, 'storeProduct'])->name('umkm.products.store');
    Route::post('/products/{product}', [UmkmController::class, 'updateProduct'])->name('umkm.products.update');
    Route::delete('/products/{product}', [UmkmController::class, 'destroyProduct'])->name('umkm.products.destroy');
});

// Profile Routes (Default Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('/notifications', [NotificationController::class, 'clear'])->name('notifications.clear');

    Route::get('/impersonate-requests', [ImpersonationApprovalController::class, 'index'])->name('impersonate.requests.index');
    Route::post('/impersonate-requests/{impersonationRequest}/respond', [ImpersonationApprovalController::class, 'respond'])->name('impersonate.requests.respond');

    Route::get('/auth/google/select-role', [SocialiteController::class, 'showRoleSelection'])->name('auth.google.select-role');
    Route::post('/auth/google/save-role', [SocialiteController::class, 'saveRole'])->name('auth.google.save-role');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/events', [AdminController::class, 'events'])->name('events');

    Route::get('/proposals/document-review/{event}', [AdminController::class, 'showDocumentReview'])->name('proposals.document.review');
    Route::post('/proposals/document-review/{event}/approve', [AdminController::class, 'approveDocument'])->name('proposals.document.approve');
    Route::post('/proposals/document-review/{event}/reject', [AdminController::class, 'rejectDocument'])->name('proposals.document.reject');


    Route::put('/events/{event}', [AdminController::class, 'updateEvent'])->name('events.update');
    Route::delete('/events/{event}', [AdminController::class, 'destroyEvent'])->name('events.destroy');
    Route::get('/events/{event}/participants', [AdminController::class, 'eventParticipants'])->name('events.participants');
    Route::post('/registrations/{registration}/approve', [AdminController::class, 'approveRegistration'])->name('registrations.approve');
    Route::post('/registrations/{registration}/reject', [AdminController::class, 'rejectRegistration'])->name('registrations.reject');
    Route::get('/proposals', [AdminController::class, 'listProposals'])->name('proposals.list');
    Route::get('/proposals/{event}', [AdminController::class, 'showProposal'])->name('proposals.show');
    Route::post('/proposals/{event}/approve', [AdminController::class, 'approveProposal'])->name('proposals.approve');
    Route::post('/proposals/{event}/reject', [AdminController::class, 'rejectProposal'])->name('proposals.reject');
    Route::get('/events/publish', [AdminController::class, 'showPublishForm'])->name('events.publish.form');
    Route::post('/events/publish', [AdminController::class, 'storeEventFromProposal'])->name('events.publish.store');
    Route::get('/umkm/verification', [AdminController::class, 'umkmVerification'])->name('umkm.verification');
    Route::post('/umkm/{umkm}/verify', [AdminController::class, 'verifyUmkm'])->name('umkm.verify');
    Route::post('/umkm/{umkm}/reject', [AdminController::class, 'rejectUmkm'])->name('umkm.reject');
    Route::post('/registrations/{registration}/finalize', [AdminController::class, 'finalizeRegistration'])->name('registrations.finalize');
    Route::get('/penyelenggara/verification', [AdminController::class, 'penyelenggaraVerification'])->name('penyelenggara.verification');
    Route::post('/penyelenggara/{penyelenggara}/verify', [AdminController::class, 'verifyPenyelenggara'])->name('penyelenggara.verify');
    Route::post('/penyelenggara/{penyelenggara}/reject', [AdminController::class, 'rejectPenyelenggara'])->name('penyelenggara.reject');
    Route::delete('/proposals/{id}/force-delete', [AdminController::class, 'permanentlyDeleteProposal'])->name('proposals.forceDelete');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index'); // <-- TAMBAHKAN INI
});

// Penyelenggara Routes
Route::middleware(['auth', 'verified', 'penyelenggara'])->prefix('penyelenggara')->name('penyelenggara.')->group(function () {
    Route::get('/dashboard', [PenyelenggaraController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile/setup', [PenyelenggaraController::class, 'createProfile'])->name('profile.setup');
    Route::post('/profile/setup', [PenyelenggaraController::class, 'storeProfile'])->name('profile.store');

    // Rute untuk menampilkan wizard (bisa untuk step 1 atau step 2)
    Route::get('/proposal/wizard/{event?}', [PenyelenggaraController::class, 'proposalWizard'])->name('proposal.wizard');
    // Rute untuk menyimpan data dari step 1 (upload dokumen)
    Route::post('/proposal/wizard/step1', [PenyelenggaraController::class, 'storeProposalStep1'])->name('proposal.wizard.step1');
    // Rute untuk menyimpan data dari step 2 (detail event) - nama diubah agar jelas
    Route::post('/proposal/wizard/step2/{event}', [PenyelenggaraController::class, 'storeProposalStep2'])->name('proposal.wizard.step2');
    Route::get('/proposal/download-template', [PenyelenggaraController::class, 'downloadTemplate'])->name('proposal.template.download');

    Route::get('/verifikasi-pendaftar', [PenyelenggaraController::class, 'listVerifikasi'])->name('pendaftar.verifikasi.list');
    Route::get('/verifikasi-pendaftar/{registration}', [PenyelenggaraController::class, 'showVerifikasi'])->name('pendaftar.verifikasi.show');
    Route::post('/verifikasi-pendaftar/{registration}/confirm', [PenyelenggaraController::class, 'confirmPayment'])->name('pendaftar.verifikasi.confirm');
    Route::post('/verifikasi-pendaftar/{registration}/reject', [PenyelenggaraController::class, 'rejectPayment'])->name('pendaftar.verifikasi.reject');
    Route::post('/verifikasi-pendaftar/{registration}/assign-stand', [PenyelenggaraController::class, 'assignStandNumber'])->name('pendaftar.verifikasi.assignStand');
    Route::get('/proposals/{event}', [PenyelenggaraController::class, 'showProposal'])->name('proposals.show')->withTrashed();
});

// PANITIA ROUTES
Route::prefix('panitia')->name('panitia.')->group(function () {
    Route::get('/', [PanitiaController::class, 'showPinLogin'])->name('login.show');
    Route::post('/', [PanitiaController::class, 'handlePinLogin'])->name('login.handle');
    Route::post('/logout', [PanitiaController::class, 'handleLogout'])->name('logout');
    Route::middleware('web')->group(function () {
        Route::get('/dashboard', [PanitiaController::class, 'showDashboard'])->name('dashboard');
        Route::post('/{event}/search', [PanitiaController::class, 'search'])->name('search');
        Route::post('/check-in/{registration}', [PanitiaController::class, 'processCheckIn'])->name('processCheckIn');
    });
});
