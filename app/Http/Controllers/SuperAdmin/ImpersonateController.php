<?php

namespace App\http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonateController extends Controller
{
    /**
     * Mulai proses impersonasi user lain.
     */
    public function start(User $user)
    {
        // Pastikan hanya super admin yang bisa melakukan ini
        if (!session()->has('impersonate_by')) {
            session(['impersonate_by' => Auth::id()]);
        }

        Auth::login($user);

        $home = match (true) {
            $user->is_admin => route('admin.dashboard'),
            $user->is_penyelenggara => route('penyelenggara.dashboard'),
            default => route('dashboard'), // Default untuk UMKM
        };

        return redirect($home)->with('success', 'Anda sekarang masuk sebagai ' . $user->name);
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
