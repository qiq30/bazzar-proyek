<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\ProposalSubmitted;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreProposalNotification
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
    public function handle(ProposalSubmitted $event): void
    {
        $admins = User::where('is_admin', true)->get();

        foreach ($admins as $admin) {
            $notification = Notification::create([ // <-- 2. Simpan ke variabel $notification
                'user_id' => $admin->id,
                'type' => get_class($event),
                'data' => [
                    'title' => 'Proposal Baru Diterima!',
                    'message' => "Proposal event '{$event->proposal->nama_event}' dari {$event->proposal->user->name} menunggu persetujuan Anda.",
                    'url' => route('admin.proposals.show', $event->proposal->id),
                ]
            ]);

            // 3. Panggil event broadcast yang baru
            NotificationReceived::dispatch($admin, $notification);
        }
    }
}
