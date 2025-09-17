<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, Notification $notification)
    {
        // Pastikan notifikasi ini milik user yang sedang login
        if ($notification->user_id === $request->user()->id) {
            $notification->markAsRead();
        }

        // Redirect ke URL yang ada di data notifikasi, atau kembali ke halaman sebelumnya
        return redirect($notification->data['url'] ?? url()->previous());
    }

    /**
     * Clear all notifications for the authenticated user.
     */
    public function clear(Request $request)
    {
        $request->user()->notifications()->delete();

        return back()->with('success', 'Riwayat notifikasi telah dibersihkan.');
    }
}
