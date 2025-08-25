<?php
// File: app/Events/ProposalSubmitted.php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Hapus "implements ShouldBroadcast" dari sini
class ProposalSubmitted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Data proposal event yang baru dibuat.
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

    // Fungsi broadcastOn() dihapus sepenuhnya.
}
