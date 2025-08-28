<?php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\ProfileStatusUpdated;
use App\Models\Notification;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreProfileStatusNotification
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
    public function handle(ProfileStatusUpdated $event): void
    {
        $profile = $event->profile;
        $user = $profile->user;
        $status = $profile->status;
        $role = $profile instanceof UmkmProfile ? 'umkm' : 'penyelenggara';

        $notificationData = [];

        // --- ▼▼▼ PERUBAHAN DI SINI ▼▼▼ ---
        switch ($status) {
            case 'pending':
                $notificationData = [
                    'title'   => 'Profil Sedang Ditinjau',
                    'message' => 'Terima kasih telah mendaftar. Profil Anda sedang dalam proses verifikasi oleh admin.',
                    'url'     => $role === 'umkm' ? route('dashboard') : route('penyelenggara.dashboard'),
                ];
                break;
            case 'verified':
                $notificationData = [
                    'title'   => 'Verifikasi Berhasil!',
                    'message' => 'Selamat! Profil Anda telah disetujui. Anda sekarang dapat menggunakan semua fitur.',
                    'url'     => $role === 'umkm' ? route('dashboard') : route('penyelenggara.dashboard'),
                ];
                break;
            case 'rejected':
                // Tambahkan alasan penolakan ke dalam pesan notifikasi
                $rejectionReason = $profile->rejection_reason ?? 'Tidak ada alasan yang diberikan.';
                $notificationData = [
                    'title'   => 'Profil Ditolak',
                    'message' => "Mohon perhatian, profil Anda ditolak. Alasan: \"{$rejectionReason}\". Silakan perbarui data Anda dan ajukan ulang.",
                    'url'     => $role === 'umkm' ? route('umkm.profile.setup') : route('penyelenggara.profile.setup'),
                ];
                break;
        }
        // --- ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ ---

        if (!empty($notificationData)) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'type'    => get_class($event),
                'data'    => $notificationData,
            ]);

            // Kirim notifikasi real-time
            NotificationReceived::dispatch($user, $notification);
        }
    }
}
