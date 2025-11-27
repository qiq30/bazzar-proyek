<?php
// File: app/Listeners/StoreNewRegistrantNotification.php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\PendaftarBaruMenungguKonfirmasi;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreNewRegistrantNotification
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
    public function handle(PendaftarBaruMenungguKonfirmasi $event): void
    {
        $registration = $event->registration;
        $penyelenggara = $registration->event->user; // User penyelenggara event

        // Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $penyelenggara->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Pendaftar Baru!',
                'message' => "{$registration->umkmProfile->business_name} telah mendaftar ke event '{$registration->event->nama_event}' dan menunggu konfirmasi pembayaran Anda.",
                'url'     => route('penyelenggara.pendaftar.verifikasi.show', $registration->hashid),
            ]
        ]);

        // Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($penyelenggara, $notification);
    }
}
