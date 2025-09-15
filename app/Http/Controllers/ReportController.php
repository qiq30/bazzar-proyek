<?php
// File: app/Http/Controllers/ReportController.php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\UmkmProfile;
use App\Models\PenyelenggaraProfile;
use App\Models\Product;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;

class ReportController extends Controller
{
    public function index()
    {
        // === STATISTIK UMKM ===
        $totalUmkm = UmkmProfile::count();
        $verifiedUmkm = UmkmProfile::where('status', 'verified')->count();

        $incompleteUmkmProfiles = User::where('is_penyelenggara', false)
            ->where('is_admin', false)
            ->where('is_super_admin', false)
            ->whereDoesntHave('umkmProfile')
            ->count();

        $incompletePenyelenggaraProfiles = User::where('is_penyelenggara', true)
            ->whereDoesntHave('penyelenggaraProfile')
            ->count();

        $monthlyGrowth = UmkmProfile::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month')
            ->map(function ($item) {
                return $item->count;
            });

        $umkmMonthlyGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('Y-m');
            $umkmMonthlyGrowth[$month] = $monthlyGrowth->get($month, 0);
        }

        $umkmStats = [
            'total' => ['value' => $totalUmkm, 'description' => 'Semua profil UMKM yang pernah dibuat.'],
            'verified' => ['value' => $verifiedUmkm, 'description' => 'Profil yang telah disetujui dan aktif.'],
            'pending' => ['value' => UmkmProfile::where('status', 'pending')->count(), 'description' => 'Profil baru yang menunggu peninjauan.'],
            'rejected' => ['value' => UmkmProfile::where('status', 'rejected')->count(), 'description' => 'Profil yang ditolak saat verifikasi.'],
            'new_last_30_days' => ['value' => UmkmProfile::where('created_at', '>=', Carbon::now()->subDays(30))->count(), 'description' => 'Pendaftar baru dalam sebulan terakhir.'],
            'incomplete_profiles' => ['value' => $incompleteUmkmProfiles, 'description' => 'Pengguna UMKM yang mendaftar tapi belum melengkapi profil.'],
            'by_type' => UmkmProfile::where('status', 'verified')
                ->groupBy('business_type')
                ->selectRaw('business_type, count(*) as total')
                ->pluck('total', 'business_type'),
            'monthly_growth' => $umkmMonthlyGrowth,
        ];

        // === STATISTIK PENYELENGGARA ===
        $penyelenggaraStats = [
            'total' => ['value' => PenyelenggaraProfile::count(), 'description' => 'Total akun penyelenggara event.'],
            'verified' => ['value' => PenyelenggaraProfile::where('status', 'verified')->count(), 'description' => 'Akun yang sudah dapat membuat event.'],
            'pending' => ['value' => PenyelenggaraProfile::where('status', 'pending')->count(), 'description' => 'Akun yang menunggu persetujuan.'],
            'rejected' => ['value' => PenyelenggaraProfile::where('status', 'rejected')->count(), 'description' => 'Akun yang ditolak saat verifikasi.'],
            'incomplete_profiles' => ['value' => $incompletePenyelenggaraProfiles, 'description' => 'Pengguna Penyelenggara yang mendaftar tapi belum melengkapi profil.'],
        ];

        // === STATISTIK EVENT & PARTISIPASI ===
        $totalEvents = Event::whereNotNull('status')->count();
        $totalApprovedRegistrations = EventRegistration::whereIn('status', ['approved', 'sudah_check_in'])->count();
        $eventStats = [
            'total' => ['value' => $totalEvents, 'description' => 'Jumlah event yang sudah diterbitkan.'],
            'active' => ['value' => Event::where('status', 'active')->count(), 'description' => 'Event yang sedang berlangsung saat ini.'],
            'upcoming' => ['value' => Event::where('status', 'upcoming')->count(), 'description' => 'Event yang akan segera dimulai.'],
            'finished' => ['value' => Event::where('status', 'finished')->count(), 'description' => 'Event yang telah selesai dilaksanakan.'],
            'average_registrants_per_event' => ['value' => $totalEvents > 0 ? round($totalApprovedRegistrations / $totalEvents, 1) : 0, 'description' => 'Rata-rata partisipasi UMKM di setiap event.'],
            'participants_per_event' => Event::withCount(['eventRegistrations' => function ($query) {
                $query->whereIn('status', ['approved', 'sudah_check_in']);
            }])->whereNotNull('status')->orderBy('event_registrations_count', 'desc')->limit(10)->get(['nama_event', 'event_registrations_count']),
        ];

        // === STATISTIK KEUANGAN & KONTEN ===
        $financialAndContentStats = [
            'total_revenue' => ['value' => EventRegistration::whereIn('status', ['pembayaran_terkonfirmasi', 'approved', 'sudah_check_in'])->with('event')->get()->sum(function ($reg) {
                return $reg->event->biaya_pendaftaran_umkm ?? 0;
            }), 'description' => 'Dari pendaftaran yang terkonfirmasi.'],
            'total_products' => ['value' => Product::count(), 'description' => 'Total produk yang diunggah oleh UMKM.'],
        ];

        return Inertia::render('Admin/Reports/Index', [
            'umkmStats' => $umkmStats,
            'penyelenggaraStats' => $penyelenggaraStats,
            'eventStats' => $eventStats,
            'financialAndContentStats' => $financialAndContentStats,
        ]);
    }
}
