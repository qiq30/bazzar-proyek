<?php

namespace App\Events;

use App\Models\EventRegistration;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RegistrationStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $registration;

    /**
     * Create a new event instance.
     */
    public function __construct(EventRegistration $registration)
    {
        // Muat relasi agar data event tersedia di frontend
        $this->registration = $registration->load('event');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Kirim ke channel privat milik user UMKM yang bersangkutan
        return [
            new PrivateChannel('user.' . $this->registration->umkmProfile->user_id),
        ];
    }
}
