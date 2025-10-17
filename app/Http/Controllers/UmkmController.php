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
use App\Events\ProfileStatusUpdated;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Rules\RecaptchaV2;
use Illuminate\Support\Facades\URL;

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
                ->orderBy('tanggal_mulai_acara', 'desc')
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
            return redirect()->route('umkm.dashboard')->with('info', 'Profil yang sudah terverifikasi tidak dapat diubah.');
        }
        return Inertia::render('UMKM/ProfileSetup', [
            'umkmProfile' => $umkmProfile
        ]);
    }

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
            'ktp' => [$profile ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

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

        $updatedProfile = UmkmProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'business_name' => $request->business_name,
                'description' => $request->description,
                'address' => $request->address,
                'business_type' => $request->business_type,
                'logo_path' => $logoPath,
                'ktp_path' => $ktpPath,
                'status' => 'pending',
                'rejection_reason' => null,
            ]
        );

        NewUserRegisteredForVerification::dispatch($user);
        ProfileStatusUpdated::dispatch($updatedProfile);

        return redirect()->route('umkm.dashboard')->with('success', 'Profile UMKM berhasil disimpan dan diajukan ulang untuk verifikasi!');
    }

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
            ->whereDate('pendaftaran_ditutup', '>=', now())
            ->orderBy('tanggal_mulai_acara', 'asc')
            ->get();

        $registrationStatus = [];
        if ($umkmProfile) {
            $registrations = $umkmProfile->eventRegistrations()->get();
            foreach ($registrations as $reg) {
                // Mengirim hashid, bukan id biasa
                $registrationStatus[$reg->event_id] = [
                    'status' => $reg->status,
                    'id' => $reg->hashid, // Menggunakan hashid accessor
                    'rejection_reason' => $reg->rejection_reason,
                ];
            }
        }

        return Inertia::render('UMKM/EventRegistration', [
            'events' => $events,
            'registrationStatus' => $registrationStatus,
            'hasProfile' => $umkmProfile !== null,
            'isVerified' => $umkmProfile ? $umkmProfile->isVerified() : false,
            'serverTime' => now('Asia/Makassar')->toIso8601String(),
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

        return redirect()->route('umkm.dashboard')->with('success', 'QRIS berhasil diupload!');
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

    public function startRegistration(Request $request, Event $event)
    {
        $request->validate([
            'payment_confirmation' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) use ($event) {
                    if ((int) $value != (int) $event->biaya_pendaftaran_umkm) {
                        $fail('Jumlah konfirmasi tidak sesuai dengan biaya pendaftaran.');
                    }
                },
            ],
            'g-recaptcha-response' => ['required', new RecaptchaV2],
        ]);

        if (!Carbon::now()->between($event->pendaftaran_dibuka, $event->pendaftaran_ditutup->endOfDay())) {
            return redirect()->route('umkm.events')->with('error', 'Pendaftaran untuk event ini sedang tidak dibuka.');
        }

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
            return redirect()->route('umkm.events.pay', ['registration' => $existingRegistration]);
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
        // Mengirim seluruh objek $registration agar Laravel bisa mengambil hashid-nya
        return redirect()->route('umkm.events.pay', ['registration' => $registration]);
    }


    public function showPaymentPage(EventRegistration $registration)
    {
        if ($registration->umkm_profile_id !== auth()->user()->umkmProfile->id) {
            abort(403);
        }

        if ($registration->status === 'menunggu_pembayaran' && $registration->payment_due && Carbon::now()->isAfter($registration->payment_due)) {
            $registration->delete();
            return redirect()->route('umkm.events')->with('error', 'Waktu pembayaran Anda telah habis. Slot Anda telah dibatalkan. Silakan daftar kembali.');
        }

        $registration->load('event');

        return Inertia::render('UMKM/PaymentPage', [
            'registration' => $registration,
            'event' => $registration->event,
            'serverTime' => now()->toIso8601String(),
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

        return redirect()->route('umkm.dashboard')->with('success', 'Bukti pembayaran berhasil diunggah. Mohon tunggu konfirmasi dari penyelenggara.');
    }

    public function myTickets()
    {
        $umkmProfile = Auth::user()->umkmProfile;
        if (!$umkmProfile) {
            return redirect()->route('umkm.dashboard')->with('error', 'Anda harus melengkapi profil UMKM terlebih dahulu.');
        }
        $tickets = EventRegistration::with(['event', 'umkmProfile'])
            ->where('umkm_profile_id', $umkmProfile->id)
            ->whereIn('status', ['approved', 'sudah_check_in'])
            ->orderBy('created_at', 'desc')
            ->get();

        $tickets->each(function ($ticket) {
            $ticket->qr_code_svg = base64_encode(
                QrCode::format('svg')
                    ->size(150)
                    ->errorCorrection('H')
                    ->generate($ticket->kode_pendaftaran)
            );

            $ticket->signed_download_url = URL::temporarySignedRoute(
                'umkm.tickets.download',
                now()->addHour(),
                ['registration' => $ticket->id]
            );
        });

        return Inertia::render('UMKM/MyTickets', [
            'tickets' => $tickets,
        ]);
    }


    public function downloadTicket(EventRegistration $registration)
    {
        if ($registration->umkm_profile_id !== auth()->user()->umkmProfile->id) {
            abort(403);
        }

        $registration->load(['event', 'umkmProfile']);

        $qrCode = base64_encode(
            QrCode::format('svg')
                ->size(150)
                ->errorCorrection('H')
                ->generate($registration->kode_pendaftaran)
        );

        $logoPath = public_path('images/logo-banjarmasin.png');
        $logoData = base64_encode(file_get_contents($logoPath));
        $logoBase64 = 'data:image/png;base64,' . $logoData;

        $data = [
            'registration' => $registration,
            'qrCode'       => $qrCode,
            'logoBase64'   => $logoBase64,
        ];

        $fileName = 'e-ticket-' . \Illuminate\Support\Str::slug($registration->event->nama_event) . '.pdf';

        $pdf = PDF::loadView('pdf.ticket', $data);

        return $pdf->download($fileName);
    }
}
