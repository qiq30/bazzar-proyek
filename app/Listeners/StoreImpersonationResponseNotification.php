<?php

namespace App\Listeners;

use App\Events\ImpersonationRequestResponded;
use App\Events\NotificationReceived;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreImpersonationResponseNotification
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
    public function handle(ImpersonationRequestResponded $event): void
    {
        $request = $event->impersonationRequest;
        $superAdmin = $request->superAdmin;
        $targetUser = $request->targetUser;

        $isApproved = $request->status === 'approved';
        $statusText = $isApproved ? 'menyetujui' : 'menolak';
        $title = $isApproved ? '✅ Permintaan Disetujui' : '❌ Permintaan Ditolak';

        // Jika disetujui, URL akan langsung ke proses 'start' impersonate.
        // Jika ditolak, URL kembali ke halaman manajemen pengguna.
        $url = $isApproved
            ? route('superadmin.impersonate.start', $request->id)
            : route('superadmin.users.manage');

        $message = "Pengguna '{$targetUser->name}' telah {$statusText} permintaan akses Anda.";

        if ($isApproved) {
            $message .= " Klik notifikasi ini untuk masuk sebagai pengguna tersebut.";
        }

        $notification = Notification::create([
            'user_id' => $superAdmin->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => $title,
                'message' => $message,
                'url'     => $url,
            ]
        ]);

        NotificationReceived::dispatch($superAdmin, $notification);
    }
}
