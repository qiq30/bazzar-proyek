<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProposalStep1Submitted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Data proposal event yang baru dibuat (tahap 1).
     *
     * @var \App\Models\Event
     */
    public $proposal;

    /**
     * Create a new event instance.
     */
    public function __construct(Event $proposal)
    {
        $this->proposal = $proposal;
    }
}
