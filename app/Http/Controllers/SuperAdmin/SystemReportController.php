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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class SystemReportController extends Controller
{
    public function index()
    {
        // Tentukan cache key dan durasi
        $cacheKey = 'superadmin_system_report_data';
        $duration = now()->addMinutes(15); // Cache data laporan selama 15 menit

        // Ambil semua data dari cache, atau jalankan kueri jika cache kosong
        $reportData = Cache::remember($cacheKey, $duration, function () {

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

            $incompleteUmkm = User::where('is_penyelenggara', false)
                ->where('is_admin', false)
                ->where('is_super_admin', false)
                ->whereDoesntHave('umkmProfile')
                ->count();

            $incompletePenyelenggara = User::where('is_penyelenggara', true)
                ->whereDoesntHave('penyelenggaraProfile')
                ->count();

            $userStats = [
                'total' => ['value' => User::count(), 'description' => 'Semua akun yang terdaftar di sistem.'],
                'umkm' => User::where('is_admin', false)->where('is_penyelenggara', false)->where('is_super_admin', false)->count(),
                'penyelenggara' => User::where('is_penyelenggara', true)->count(),
                'admin' => User::where('is_admin', true)->count(),
                'super_admin' => User::where('is_super_admin', true)->count(),
                'monthly_growth' => $userMonthlyGrowth,
            ];

            $profileStats = [
                'umkm_verified' => UmkmProfile::where('status', 'verified')->count(),
                'umkm_pending' => UmkmProfile::where('status', 'pending')->count(),
                'umkm_rejected' => UmkmProfile::where('status', 'rejected')->count(),
                'penyelenggara_verified' => PenyelenggaraProfile::where('status', 'verified')->count(),
                'penyelenggara_pending' => PenyelenggaraProfile::where('status', 'pending')->count(),
                'penyelenggara_rejected' => PenyelenggaraProfile::where('status', 'rejected')->count(),
                'umkm_incomplete' => $incompleteUmkm,
                'penyelenggara_incomplete' => $incompletePenyelenggara,
            ];

            $eventStats = [
                'total_published' => ['value' => Event::whereNotNull('status')->count(), 'description' => 'Event yang telah disetujui dan dipublikasikan.'],
                'active' => ['value' => Event::where('status', 'active')->count(), 'description' => 'Event yang sedang berlangsung saat ini.'],
                'finished' => ['value' => Event::where('status', 'finished')->count(), 'description' => 'Event yang telah selesai.'],
                'total_proposals' => ['value' => Event::withTrashed()->count(), 'description' => 'Semua proposal yang pernah diajukan.'],
                'proposals_approved' => ['value' => Event::where('status_proposal', 'disetujui')->count(), 'description' => 'Proposal yang lolos dan siap terbit.'],
                'proposals_pending' => Event::where('status_proposal', 'menunggu_persetujuan')->count(),
                'proposals_rejected' => Event::onlyTrashed()->where('status_proposal', 'ditolak')->count(),
            ];

            $registrationAndContentStats = [
                'total_products' => ['value' => Product::count(), 'description' => 'Produk yang diunggah oleh semua UMKM.'],
                'total_revenue' => ['value' => EventRegistration::whereIn('status', ['pembayaran_terkonfirmasi', 'approved', 'sudah_check_in'])->with('event')->get()->sum(fn($reg) => $reg->event->biaya_pendaftaran_umkm ?? 0), 'description' => 'Estimasi pendapatan dari pendaftaran.'],
            ];

            // Kembalikan semua data sebagai array untuk disimpan di cache
            return [
                'userStats' => $userStats,
                'profileStats' => $profileStats,
                'eventStats' => $eventStats,
                'registrationAndContentStats' => $registrationAndContentStats,
            ];
        });

        // Kirim data (dari cache atau kueri baru) ke view
        return Inertia::render('SuperAdmin/SystemReport/Index', [
            'userStats' => $reportData['userStats'],
            'profileStats' => $reportData['profileStats'],
            'eventStats' => $reportData['eventStats'],
            'registrationAndContentStats' => $reportData['registrationAndContentStats'],
        ]);
    }
}
