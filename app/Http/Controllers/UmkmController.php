<?php
// app/Http/Controllers/UmkmController.php

namespace App\Http\Controllers;

use App\Events\PendaftarBaruMenungguKonfirmasi;
use App\Events\UmkmQrisUpdated;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Product;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Events\NewUserRegisteredForVerification;

class UmkmController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $umkmProfile = $user->umkmProfile()->with('user')->first();

        $data = [
            'hasProfile' => !is_null($umkmProfile),
            'umkmProfile' => $umkmProfile,
        ];

        if ($umkmProfile) {
            $data['registeredEvents'] = $umkmProfile->events()
                ->orderBy('tanggal_mulai', 'desc')
                ->get();
        } else {
            $data['registeredEvents'] = [];
        }

        return Inertia::render('UMKM/Dashboard', $data);
    }

    public function profileSetup()
    {
        $umkmProfile = Auth::user()->umkmProfile;
        if ($umkmProfile && $umkmProfile->status === 'verified') {
            return redirect()->route('dashboard')->with('info', 'Profil yang sudah terverifikasi tidak dapat diubah.');
        }
        return Inertia::render('UMKM/ProfileSetup', [
            'umkmProfile' => $umkmProfile
        ]);
    }

    // --- ▼▼▼ PERUBAHAN UTAMA DI SINI ▼▼▼ ---
    public function storeProfile(Request $request)
    {
        $user = Auth::user();
        $profile = $user->umkmProfile;

        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'business_type' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            // KTP hanya wajib jika belum ada sama sekali
            'ktp' => [$profile ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        // Pertahankan path file lama jika tidak ada file baru yang diunggah
        $logoPath = $profile->logo_path ?? null;
        if ($request->hasFile('logo')) {
            if ($profile && $profile->logo_path) {
                Storage::disk('public')->delete($profile->logo_path);
            }
            $logoPath = $request->file('logo')->store('umkm/logos', 'public');
        }

        $ktpPath = $profile->ktp_path ?? null;
        if ($request->hasFile('ktp')) {
            if ($profile && $profile->ktp_path) {
                Storage::disk('public')->delete($profile->ktp_path);
            }
            $ktpPath = $request->file('ktp')->store('umkm/ktp', 'public');
        }

        UmkmProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'business_name' => $request->business_name,
                'description' => $request->description,
                'address' => $request->address,
                'business_type' => $request->business_type,
                'logo_path' => $logoPath,
                'ktp_path' => $ktpPath,
                'status' => 'pending', // Selalu set ke pending saat update/create
                'rejection_reason' => null, // Hapus alasan penolakan saat submit ulang
            ]
        );

        NewUserRegisteredForVerification::dispatch($user);

        return redirect()->route('dashboard')->with('success', 'Profile UMKM berhasil disimpan dan diajukan ulang untuk verifikasi!');
    }
    // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

    public function events()
    {
        $umkmProfile = auth()->user()->umkmProfile;
        $umkmProfileId = $umkmProfile?->id;

        $events = Event::withCount(['eventRegistrations' => function ($query) {
            $query->where('status', '!=', 'rejected');
        }])
            ->with(['eventRegistrations' => function ($query) use ($umkmProfileId) {
                if ($umkmProfileId) {
                    $query->where('umkm_profile_id', $umkmProfileId);
                }
            }])
            ->where('status', '!=', 'finished')
            ->orderBy('tanggal_mulai', 'asc')
            ->get();

        $registrationStatus = [];
        if ($umkmProfile) {
            $registrations = $umkmProfile->eventRegistrations()->get();
            foreach ($registrations as $reg) {
                $registrationStatus[$reg->event_id] = [
                    'status' => $reg->status,
                    'id' => $reg->id,
                    'rejection_reason' => $reg->rejection_reason,
                ];
            }
        }

        return Inertia::render('UMKM/EventRegistration', [
            'events' => $events,
            'registrationStatus' => $registrationStatus,
            'hasProfile' => $umkmProfile !== null,
            'isVerified' => $umkmProfile ? $umkmProfile->isVerified() : false,
        ]);
    }

    public function uploadQris()
    {
        $umkmProfile = auth()->user()->umkmProfile;
        return Inertia::render('UMKM/UploadQRIS', ['umkmProfile' => $umkmProfile]);
    }

    public function storeQris(Request $request)
    {
        $request->validate(['qris' => 'required|image|mimes:jpeg,png,jpg|max:2048']);
        $umkmProfile = auth()->user()->umkmProfile;

        if ($umkmProfile->qris_path) {
            Storage::disk('public')->delete($umkmProfile->qris_path);
        }

        $qrisPath = $request->file('qris')->store('umkm/qris', 'public');
        $umkmProfile->update(['qris_path' => $qrisPath]);

        UmkmQrisUpdated::dispatch($umkmProfile);

        return redirect()->route('dashboard')->with('success', 'QRIS berhasil diupload!');
    }

    public function products()
    {
        $umkmProfile = auth()->user()->umkmProfile()->with('products')->first();
        return Inertia::render('UMKM/ProductManagement', ['products' => $umkmProfile->products]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        $umkmProfile = auth()->user()->umkmProfile;
        $imagePath = $request->hasFile('image') ? $request->file('image')->store('products', 'public') : null;
        $umkmProfile->products()->create(array_merge($request->only(['name', 'description', 'price']), ['image_path' => $imagePath]));
        return back()->with('success', 'Produk berhasil ditambahkan!');
    }

    public function updateProduct(Request $request, Product $product)
    {
        if ($product->umkm_profile_id !== auth()->user()->umkmProfile->id) abort(403);
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        $data = $request->only(['name', 'description', 'price']);
        if ($request->hasFile('image')) {
            if ($product->image_path) Storage::disk('public')->delete($product->image_path);
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }
        $product->update($data);
        return back()->with('success', 'Produk berhasil diupdate!');
    }

    public function destroyProduct(Product $product)
    {
        if ($product->umkm_profile_id !== auth()->user()->umkmProfile->id) abort(403);
        if ($product->image_path) Storage::disk('public')->delete($product->image_path);
        $product->delete();
        return back()->with('success', 'Produk berhasil dihapus!');
    }

    // --- ALUR PENDAFTARAN & PEMBAYARAN EVENT ---

    public function startRegistration(Event $event)
    {
        $umkmProfile = auth()->user()->umkmProfile;

        $existingRegistration = EventRegistration::where('event_id', $event->id)
            ->where('umkm_profile_id', $umkmProfile->id)
            ->where('status', '!=', 'rejected')
            ->first();

        if ($existingRegistration && (!$existingRegistration->payment_due || now()->isAfter($existingRegistration->payment_due))) {
            $existingRegistration->delete();
            $existingRegistration = null;
        }

        if ($existingRegistration) {
            return redirect()->route('umkm.events.pay', ['registration' => $existingRegistration->id]);
        }

        $participantCount = $event->eventRegistrations()
            ->where('status', '!=', 'rejected')
            ->count();

        if ($participantCount >= $event->kuota_umkm) {
            return redirect()->route('umkm.events')->with('error', 'Maaf, kuota untuk event ini sudah penuh.');
        }

        $prefix = 'BZREVT' . $event->id . '-';
        $uniqueCode = $prefix . strtoupper(Str::random(5));

        $registration = EventRegistration::updateOrCreate(
            [
                'event_id' => $event->id,
                'umkm_profile_id' => $umkmProfile->id,
            ],
            [
                'status' => 'menunggu_pembayaran',
                'kode_pendaftaran' => $uniqueCode,
                'payment_due' => now()->addHour(),
                'rejection_reason' => null,
            ]
        );

        return redirect()->route('umkm.events.pay', ['registration' => $registration->id]);
    }

    public function showPaymentPage(EventRegistration $registration)
    {
        if ($registration->umkm_profile_id !== auth()->user()->umkmProfile->id) {
            abort(403);
        }

        if ($registration->status === 'menunggu_pembayaran' && $registration->payment_due && now()->isAfter($registration->payment_due)) {
            $registration->delete();
            return redirect()->route('umkm.events')->with('error', 'Waktu pembayaran Anda telah habis. Slot Anda telah dibatalkan. Silakan daftar kembali.');
        }

        $registration->load('event');

        return Inertia::render('UMKM/PaymentPage', [
            'registration' => $registration,
            'event' => $registration->event,
        ]);
    }

    public function uploadPaymentProof(Request $request, EventRegistration $registration)
    {
        if ($registration->umkm_profile_id !== auth()->user()->umkmProfile->id) abort(403);
        $request->validate(['bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048']);

        $buktiPath = $request->file('bukti_pembayaran')->store('payment_proofs', 'public');

        $registration->update([
            'bukti_pembayaran_path' => $buktiPath,
            'status' => 'menunggu_konfirmasi_pembayaran',
            'rejection_reason' => null,
        ]);

        $registration->load('event', 'umkmProfile');

        PendaftarBaruMenungguKonfirmasi::dispatch($registration);

        return redirect()->route('dashboard')->with('success', 'Bukti pembayaran berhasil diunggah. Mohon tunggu konfirmasi dari penyelenggara.');
    }

    public function myTickets()
    {
        $umkmProfile = Auth::user()->umkmProfile;
        if (!$umkmProfile) {
            return redirect()->route('dashboard')->with('error', 'Anda harus melengkapi profil UMKM terlebih dahulu.');
        }
        $tickets = EventRegistration::with(['event', 'umkmProfile'])
            ->where('umkm_profile_id', $umkmProfile->id)
            ->whereIn('status', ['approved', 'sudah_check_in'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('UMKM/MyTickets', [
            'tickets' => $tickets,
        ]);
    }
}
