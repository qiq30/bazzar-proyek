<?php

namespace App\Events;

use App\Models\ImpersonationRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ImpersonationRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $impersonationRequest;

    /**
     * Create a new event instance.
     */
    public function __construct(ImpersonationRequest $impersonationRequest)
    {
        $this->impersonationRequest = $impersonationRequest;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
