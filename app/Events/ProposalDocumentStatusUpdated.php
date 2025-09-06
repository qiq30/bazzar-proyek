<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProposalDocumentStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The event proposal instance.
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
