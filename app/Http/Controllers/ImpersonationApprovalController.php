<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImpersonationRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Events\ImpersonationRequestResponded;

class ImpersonationApprovalController extends Controller
{
    /**
     * Menampilkan halaman untuk merespons permintaan impersonasi.
     */
    public function index()
    {
        $user = Auth::user();
        $pendingRequest = ImpersonationRequest::where('target_user_id', $user->id)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->with('superAdmin')
            ->first();

        // Tentukan dashboard route berdasarkan peran pengguna
        $dashboardRoute = 'umkm.dashboard'; // Default untuk UMKM
        if ($user->is_penyelenggara) {
            $dashboardRoute = 'penyelenggara.dashboard';
        }

        return Inertia::render('Impersonate/ImpersonationRequests', [
            'pendingRequest' => $pendingRequest,
            'dashboardRoute' => $dashboardRoute,
        ]);
    }

    /**
     * Merespons permintaan impersonasi (menyetujui atau menolak).
     */
    public function respond(Request $request, ImpersonationRequest $impersonationRequest)
    {
        // Validasi
        $request->validate([
            'decision' => 'required|in:approve,reject',
        ]);

        // Pastikan permintaan ini ditujukan untuk user yang sedang login
        if ($impersonationRequest->target_user_id !== Auth::id()) {
            abort(403, 'Akses Ditolak.');
        }

        // Update status permintaan
        $impersonationRequest->status = $request->decision === 'approve' ? 'approved' : 'rejected';
        $impersonationRequest->save();

        // Muat relasi untuk dikirim via event
        $impersonationRequest->load('superAdmin', 'targetUser');

        // Picu event untuk notifikasi ke Super Admin
        ImpersonationRequestResponded::dispatch($impersonationRequest);

        $message = $request->decision === 'approve' ? 'Anda telah menyetujui permintaan akses.' : 'Anda telah menolak permintaan akses.';

        return redirect()->route('impersonate.requests.index')->with('success', $message);
    }
}
