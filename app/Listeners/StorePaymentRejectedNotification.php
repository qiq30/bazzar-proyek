<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\PaymentRejected;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StorePaymentRejectedNotification
{

    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentRejected $event): void
    {
        $registration = $event->registration;
        $umkmUser = $registration->umkmProfile->user;

        $rejectionReason = $registration->rejection_reason ?? 'Tidak ada alasan spesifik.';
        $message = "Mohon perhatian, pembayaran Anda untuk event '{$registration->event->nama_event}' ditolak. Alasan: \"{$rejectionReason}\". Silakan unggah ulang bukti bayar yang valid.";

        // Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $umkmUser->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Pembayaran Ditolak',
                'message' => $message, // Gunakan pesan yang sudah dimodifikasi
                'url' => route('umkm.events.pay', ['registration' => $registration]),
            ]
        ]);

        // Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($umkmUser, $notification);
    }
}
