<?php

namespace App\Events;

use App\Models\UmkmProfile;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UmkmQrisUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The UMKM Profile instance.
     *
     * @var \App\Models\UmkmProfile
     */
    public $umkmProfile;

    /**
     * Create a new event instance.
     */
    public function __construct(UmkmProfile $umkmProfile)
    {
        $this->umkmProfile = $umkmProfile;
    }
}
