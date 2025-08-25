<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\PaymentRejected;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StorePaymentRejectedNotification
{
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

        // Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $umkmUser->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Pembayaran Ditolak',
                'message' => "Mohon perhatian, pembayaran Anda untuk event '{$registration->event->nama_event}' ditolak. Silakan unggah ulang bukti bayar yang valid.",
                'url'     => route('umkm.events.pay', $registration->id),
            ]
        ]);

        // Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($umkmUser, $notification);
    }
}
