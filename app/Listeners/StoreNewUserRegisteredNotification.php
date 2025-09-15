<?php

namespace App\Listeners;

use App\Events\NewUserRegisteredForVerification;
use App\Events\NotificationReceived;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreNewUserRegisteredNotification
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
    public function handle(NewUserRegisteredForVerification $event): void
    {
        $newUser = $event->user;
        $role = $newUser->is_penyelenggara ? 'Penyelenggara' : 'UMKM';

        // Tentukan URL verifikasi berdasarkan role
        $verificationUrl = $newUser->is_penyelenggara
            ? route('admin.penyelenggara.verification')
            : route('admin.umkm.verification');

        // Ambil semua admin
        $admins = User::where('is_admin', true)->get();

        foreach ($admins as $admin) {
            $notification = Notification::create([
                'user_id' => $admin->id,
                'type'    => get_class($event),
                'data'    => [
                    'title'   => 'Profil Menunggu Verifikasi',
                    'message' => "Profil pengguna '{$newUser->name}' ({$role}) telah diajukan dan menunggu verifikasi Anda.",
                    'url'     => $verificationUrl,
                ]
            ]);

            // Kirim notifikasi real-time ke admin
            NotificationReceived::dispatch($admin, $notification);
        }
    }
}
