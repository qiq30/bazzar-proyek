<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\RegistrationStatusUpdated;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StorePaymentConfirmedNotification
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
    public function handle(RegistrationStatusUpdated $event): void
    {
        $registration = $event->registration;

        // Hanya kirim notifikasi jika statusnya adalah 'pembayaran_terkonfirmasi'
        if ($registration->status === 'pembayaran_terkonfirmasi') {
            $umkmUser = $registration->umkmProfile->user;

            // Buat notifikasi di database
            $notification = Notification::create([
                'user_id' => $umkmUser->id,
                'type'    => get_class($event),
                'data'    => [
                    'title'   => 'Pembayaran Dikonfirmasi!',
                    'message' => "Kabar baik! Pembayaran Anda untuk event '{$registration->event->nama_event}' telah dikonfirmasi oleh penyelenggara dan menunggu persetujuan final dari admin.",
                    'url'     => route('umkm.events'), // Arahkan ke halaman daftar event
                ]
            ]);

            // Kirim event broadcast ke frontend untuk update real-time
            NotificationReceived::dispatch($umkmUser, $notification);
        }
    }
}
