<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProposalStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Data proposal, bisa berupa Model atau Array.
     * @var \App\Models\Event|array
     */
    public $proposal;

    /**
     * Create a new event instance.
     * @param \App\Models\Event|array $proposal
     */
    public function __construct($proposal)
    {
        $this->proposal = $proposal;
    }
}
