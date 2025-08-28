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

// RUTE WIZARD REGISTRASI DITEMPATKAN DI SINI
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegistrationWizardController::class, 'showSteps'])->name('register.wizard');
    Route::post('/register-step-1', [RegistrationWizardController::class, 'storeStep1'])
        ->middleware('throttle:5,1')
        ->name('register.wizard.step1');
    Route::post('/register-finish', [RegistrationWizardController::class, 'storeFinal'])
        ->middleware('throttle:5,1')
        ->name('register.wizard.finish');
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
    Route::get('/dashboard', [UmkmController::class, 'dashboard'])->name('dashboard');
    // ... rute UMKM lainnya
    Route::get('/profile/setup', [UmkmController::class, 'profileSetup'])->name('umkm.profile.setup');
    Route::post('/profile/setup', [UmkmController::class, 'storeProfile'])->name('umkm.profile.store');
    Route::get('/events', [UmkmController::class, 'events'])->name('umkm.events');
    Route::post('/events/{event}/register', [UmkmController::class, 'startRegistration'])->name('umkm.events.register');
    Route::get('/payment/{registration}', [UmkmController::class, 'showPaymentPage'])->name('umkm.events.pay');
    Route::post('/payment/{registration}', [UmkmController::class, 'uploadPaymentProof'])->name('umkm.events.uploadProof');
    Route::get('/my-tickets', [UmkmController::class, 'myTickets'])->name('umkm.tickets');
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
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/events', [AdminController::class, 'events'])->name('events');
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
});

// Penyelenggara Routes
// Terapkan middleware 'penyelenggara'
Route::middleware(['auth', 'verified', 'penyelenggara'])->prefix('penyelenggara')->name('penyelenggara.')->group(function () {
    Route::get('/dashboard', [PenyelenggaraController::class, 'dashboard'])->name('dashboard');
    // ... rute Penyelenggara lainnya
    Route::get('/profile/setup', [PenyelenggaraController::class, 'createProfile'])->name('profile.setup');
    Route::post('/profile/setup', [PenyelenggaraController::class, 'storeProfile'])->name('profile.store');
    Route::get('/proposal/create', [PenyelenggaraController::class, 'createProposal'])->name('proposal.create');
    Route::post('/proposal', [PenyelenggaraController::class, 'storeProposal'])->name('proposal.store');
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
