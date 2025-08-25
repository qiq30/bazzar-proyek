<?php
// File: app/Listeners/StoreRegistrationFinalizedNotification.php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\RegistrationFinalized;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreRegistrationFinalizedNotification
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
    public function handle(RegistrationFinalized $event): void
    {
        $registration = $event->registration;
        $umkmUser = $registration->umkmProfile->user; // User UMKM yang bersangkutan

        // Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $umkmUser->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Pendaftaran Berhasil! 🎟️',
                'message' => "Selamat! Pendaftaran Anda untuk event '{$registration->event->nama_event}' telah disetujui. E-Ticket Anda sudah tersedia.",
                'url'     => route('umkm.tickets'),
            ]
        ]);

        // Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($umkmUser, $notification);
    }
}
