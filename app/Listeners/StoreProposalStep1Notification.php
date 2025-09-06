<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\ProposalStep1Submitted;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreProposalStep1Notification
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
    public function handle(ProposalStep1Submitted $event): void
    {
        $admins = User::where('is_admin', true)->get();
        $proposal = $event->proposal;

        foreach ($admins as $admin) {
            $notification = Notification::create([
                'user_id' => $admin->id,
                'type' => get_class($event),
                'data' => [
                    'title' => 'Dokumen Proposal Baru Diterima!',
                    'message' => "Proposal event '{$proposal->nama_event}' dari {$proposal->user->name} menunggu verifikasi dokumen Anda.",
                    // URL ini akan mengarahkan admin langsung ke halaman daftar proposal
                    'url' => route('admin.proposals.list'),
                ]
            ]);

            // Panggil event broadcast untuk notifikasi real-time
            NotificationReceived::dispatch($admin, $notification);
        }
    }
}
