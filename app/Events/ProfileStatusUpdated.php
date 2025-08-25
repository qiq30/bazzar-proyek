<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProfileStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $profile;

    /**
     * Create a new event instance.
     * @param \App\Models\UmkmProfile|\App\Models\PenyelenggaraProfile $profile
     */
    public function __construct($profile)
    {
        $this->profile = $profile;
    }
}
