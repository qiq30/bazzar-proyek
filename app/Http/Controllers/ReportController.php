<?php
// File: app/Http/Controllers/ReportController.php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use App\Models\Product;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\DB; // <-- TAMBAHKAN INI
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        // === STATISTIK UMKM ===
        $totalUmkm = UmkmProfile::count();
        $verifiedUmkm = UmkmProfile::where('status', 'verified')->count();

        // --- ▼▼▼ TAMBAHAN QUERY BARU ▼▼▼ ---
        $monthlyGrowth = UmkmProfile::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month') // Menggunakan bulan sebagai key
            ->map(function ($item) {
                return $item->count; // Hanya mengambil count
            });

        // Memastikan semua 6 bulan terakhir ada datanya (meskipun 0)
        $umkmMonthlyGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('Y-m');
            $umkmMonthlyGrowth[$month] = $monthlyGrowth->get($month, 0);
        }
        // --- ▲▲▲ AKHIR DARI TAMBAHAN QUERY ---

        $umkmStats = [
            'total' => $totalUmkm,
            'verified' => $verifiedUmkm,
            'pending' => UmkmProfile::where('status', 'pending')->count(),
            'rejected' => UmkmProfile::where('status', 'rejected')->count(),
            'by_type' => UmkmProfile::where('status', 'verified')
                ->groupBy('business_type')
                ->selectRaw('business_type, count(*) as total')
                ->pluck('total', 'business_type'),
            'new_last_30_days' => UmkmProfile::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'monthly_growth' => $umkmMonthlyGrowth, // <-- DATA BARU UNTUK GRAFIK
        ];

        // === STATISTIK PENYELENGGARA ===
        $penyelenggaraStats = [
            'total' => PenyelenggaraProfile::count(),
            'verified' => PenyelenggaraProfile::where('status', 'verified')->count(),
            'pending' => PenyelenggaraProfile::where('status', 'pending')->count(),
            'rejected' => PenyelenggaraProfile::where('status', 'rejected')->count(),
        ];

        // === STATISTIK EVENT & PARTISIPASI ===
        $totalEvents = Event::whereNotNull('status')->count();
        $totalApprovedRegistrations = EventRegistration::whereIn('status', ['approved', 'sudah_check_in'])->count();
        $eventStats = [
            'total' => $totalEvents,
            'active' => Event::where('status', 'active')->count(),
            'upcoming' => Event::where('status', 'upcoming')->count(),
            'finished' => Event::where('status', 'finished')->count(),
            'participants_per_event' => Event::withCount(['eventRegistrations' => function ($query) {
                $query->whereIn('status', ['approved', 'sudah_check_in']);
            }])->whereNotNull('status')->orderBy('event_registrations_count', 'desc')->limit(10)->get(['nama_event', 'event_registrations_count']),
            'average_registrants_per_event' => $totalEvents > 0 ? round($totalApprovedRegistrations / $totalEvents, 1) : 0,
        ];

        // === STATISTIK KEUANGAN & KONTEN ===
        $financialAndContentStats = [
            'total_revenue' => EventRegistration::where('status', 'pembayaran_terkonfirmasi')
                ->with('event')
                ->get()
                ->sum(function ($reg) {
                    return $reg->event->biaya_pendaftaran_umkm ?? 0;
                }),
            'total_products' => Product::count(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'umkmStats' => $umkmStats,
            'penyelenggaraStats' => $penyelenggaraStats,
            'eventStats' => $eventStats,
            'financialAndContentStats' => $financialAndContentStats,
        ]);
    }
}
