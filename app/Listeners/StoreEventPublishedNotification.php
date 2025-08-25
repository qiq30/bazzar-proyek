<?php

namespace App\Listeners;

use App\Events\EventPublished;
use App\Events\NotificationReceived;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreEventPublishedNotification
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
    public function handle(EventPublished $event): void
    {
        $publishedEvent = $event->event;
        $penyelenggara = $publishedEvent->user;

        // 1. Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $penyelenggara->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Event Diterbitkan!',
                'message' => "Kabar baik! Event Anda '{$publishedEvent->nama_event}' telah berhasil diterbitkan dan sekarang dapat dilihat oleh publik.",
                'url'     => route('penyelenggara.proposals.show', $publishedEvent->id),
            ]
        ]);

        // 2. Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($penyelenggara, $notification);
    }
}
