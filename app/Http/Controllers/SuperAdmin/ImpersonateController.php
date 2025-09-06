<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ImpersonationRequest;
use App\Events\ImpersonationRequested;
use Carbon\Carbon;

class ImpersonateController extends Controller
{
    /**
     * Meminta izin untuk impersonasi user lain.
     */
    public function request(User $user) // <-- UBAH NAMA METHOD DAN PARAMETER
    {
        $superAdmin = Auth::user();

        // Cek apakah ada permintaan yang masih pending
        $existingRequest = ImpersonationRequest::where('super_admin_id', $superAdmin->id)
            ->where('target_user_id', $user->id)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->first();

        if ($existingRequest) {
            return back()->with('error', 'Anda sudah memiliki permintaan akses yang pending untuk pengguna ini.');
        }

        // Buat permintaan baru di database
        $impersonationRequest = ImpersonationRequest::create([
            'super_admin_id' => $superAdmin->id,
            'target_user_id' => $user->id,
            'status' => 'pending',
            'expires_at' => Carbon::now()->addMinutes(15), // Permintaan berlaku 15 menit
        ]);

        // Load relasi untuk dikirim via event
        $impersonationRequest->load('superAdmin', 'targetUser');

        // Picu event untuk notifikasi ke target user
        ImpersonationRequested::dispatch($impersonationRequest);

        return back()->with('success', 'Permintaan akses telah dikirim ke ' . $user->name);
    }

    /**
     * Mulai proses impersonasi SETELAH disetujui.
     */
    public function start(ImpersonationRequest $impersonationRequest)
    {
        // Validasi: Pastikan yang mengakses adalah super admin yang meminta
        // dan statusnya sudah 'approved'
        if ($impersonationRequest->super_admin_id !== Auth::id() || $impersonationRequest->status !== 'approved') {
            abort(403, 'Akses Ditolak.');
        }

        // --- ▼▼▼ PERBAIKAN UTAMA DI SINI ▼▼▼ ---

        // 1. Simpan ID super admin sebelum sesi berubah.
        $superAdminId = Auth::id();
        $targetUser = $impersonationRequest->targetUser;

        // 2. Hapus permintaan setelah data penting disimpan.
        $impersonationRequest->delete();

        // 3. Login sebagai pengguna target. Ini akan me-regenerasi sesi.
        Auth::login($targetUser);

        // 4. Setelah sesi baru dibuat, simpan ID super admin ke dalamnya.
        session(['impersonate_by' => $superAdminId]);

        // --- ▲▲▲ AKHIR DARI PERBAIKAN ▲▲▲ ---

        // Logika redirect setelah berhasil login
        $home = match (true) {
            $targetUser->is_admin => route('admin.dashboard'),
            $targetUser->is_penyelenggara => route('penyelenggara.dashboard'),
            default => route('umkm.dashboard'),
        };

        return redirect($home)->with('success', 'Anda sekarang masuk sebagai ' . $targetUser->name);
    }


    /**
     * Hentikan proses impersonasi dan kembali ke akun asli.
     */
    public function stop()
    {
        $superAdminId = session('impersonate_by');

        if (!$superAdminId) {
            return redirect()->route('home');
        }

        Auth::loginUsingId($superAdminId);
        session()->forget('impersonate_by');

        return redirect()->route('superadmin.dashboard')->with('success', 'Berhasil kembali ke akun Super Admin.');
    }
}
