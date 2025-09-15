<?php
// File: app/Listeners/StoreProposalStatusNotification.php

namespace App\Listeners;

use App\Events\NotificationReceived;
use App\Events\ProposalStatusUpdated;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StoreProposalStatusNotification
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(ProposalStatusUpdated $event): void
    {
        $proposal = $event->proposal;
        $penyelenggara = $proposal->user;
        $isApproved = $proposal->status_proposal === 'disetujui';

        $message = '';
        if ($isApproved) {
            $message = "Proposal Anda untuk event '{$proposal->nama_event}' telah disetujui oleh admin. Anda sekarang bisa menerbitkannya.";
        } else {
            $rejectionReason = $proposal->rejection_reason ?? 'Tidak ada alasan spesifik.';
            $message = "Proposal Anda untuk event '{$proposal->nama_event}' telah ditolak. Alasan: \"{$rejectionReason}\"";
        }

        // Buat notifikasi di database
        $notification = Notification::create([
            'user_id' => $penyelenggara->id,
            'type'    => get_class($event),
            'data'    => [
                'title'   => $isApproved ? 'Proposal Disetujui!' : 'Proposal Ditolak',
                'message' => $message, // Gunakan pesan yang sudah dimodifikasi
                'url'     => route('penyelenggara.proposals.show', $proposal->id),
            ]
        ]);

        // Kirim event broadcast ke frontend untuk update real-time
        NotificationReceived::dispatch($penyelenggara, $notification);
    }
}
