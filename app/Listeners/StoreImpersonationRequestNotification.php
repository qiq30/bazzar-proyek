<?php

namespace App\Listeners;

use App\Events\ImpersonationRequested;
use App\Events\NotificationReceived;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreImpersonationRequestNotification
{

    use InteractsWithQueue;

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
    public function handle(ImpersonationRequested $event): void
    {
        $request = $event->impersonationRequest;
        $targetUser = $request->targetUser;
        $superAdmin = $request->superAdmin;

        $notification = Notification::create([
            'user_id' => $targetUser->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => 'Permintaan Akses Akun',
                'message' => "Super Admin '{$superAdmin->name}' meminta izin untuk masuk sebagai Anda.",
                'url'     => route('impersonate.requests.index'),
            ]
        ]);

        NotificationReceived::dispatch($targetUser, $notification);
    }
}
