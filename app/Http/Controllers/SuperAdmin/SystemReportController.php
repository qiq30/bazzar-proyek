<?php
// File: app/Http/Controllers/SuperAdmin/SystemReportController.php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Event;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use App\Models\EventRegistration;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // <-- Pastikan ini ada

class SystemReportController extends Controller
{
    public function index()
    {
        // --- ▼▼▼ TAMBAHAN QUERY BARU ▼▼▼ ---
        $monthlyGrowth = User::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month')
            ->map(fn($item) => $item->count);

        $userMonthlyGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('Y-m');
            $userMonthlyGrowth[$month] = $monthlyGrowth->get($month, 0);
        }
        // --- ▲▲▲ AKHIR DARI TAMBAHAN QUERY ---

        $userStats = [
            'total' => User::count(),
            'umkm' => User::where('is_admin', false)->where('is_penyelenggara', false)->where('is_super_admin', false)->count(),
            'penyelenggara' => User::where('is_penyelenggara', true)->count(),
            'admin' => User::where('is_admin', true)->count(),
            'super_admin' => User::where('is_super_admin', true)->count(),
            'new_last_30_days' => User::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'monthly_growth' => $userMonthlyGrowth, // <-- Kirim data baru
        ];

        $profileStats = [
            'umkm_verified' => UmkmProfile::where('status', 'verified')->count(),
            'umkm_pending' => UmkmProfile::where('status', 'pending')->count(),
            'umkm_rejected' => UmkmProfile::where('status', 'rejected')->count(),
            'penyelenggara_verified' => PenyelenggaraProfile::where('status', 'verified')->count(),
            'penyelenggara_pending' => PenyelenggaraProfile::where('status', 'pending')->count(),
            'penyelenggara_rejected' => PenyelenggaraProfile::where('status', 'rejected')->count(),
        ];

        $eventStats = [
            'total_published' => Event::whereNotNull('status')->count(),
            'active' => Event::where('status', 'active')->count(),
            'upcoming' => Event::where('status', 'upcoming')->count(),
            'finished' => Event::where('status', 'finished')->count(),
            'total_proposals' => Event::withTrashed()->count(),
            'proposals_approved' => Event::where('status_proposal', 'disetujui')->count(),
            'proposals_pending' => Event::where('status_proposal', 'menunggu_persetujuan')->count(),
            'proposals_rejected' => Event::onlyTrashed()->where('status_proposal', 'ditolak')->count(),
        ];

        $registrationAndContentStats = [
            'total_registrations' => EventRegistration::count(),
            'approved_registrations' => EventRegistration::whereIn('status', ['approved', 'sudah_check_in'])->count(),
            'total_products' => Product::count(),
            'total_revenue' => EventRegistration::where('status', 'pembayaran_terkonfirmasi')
                ->with('event')
                ->get()
                ->sum(fn($reg) => $reg->event->biaya_pendaftaran_umkm ?? 0),
        ];

        return Inertia::render('SuperAdmin/SystemReport/Index', [
            'userStats' => $userStats,
            'profileStats' => $profileStats,
            'eventStats' => $eventStats,
            'registrationAndContentStats' => $registrationAndContentStats,
        ]);
    }
}
