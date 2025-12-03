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
use Illuminate\Support\Facades\Cache;

class ReportController extends Controller
{
    public function index()
    {
        // Tentukan cache key dan durasi
        $cacheKey = 'admin_report_data';
        $duration = now()->addMinutes(15); // Cache data laporan selama 15 menit

        // Ambil semua data dari cache, atau jalankan kueri jika cache kosong
        $reportData = Cache::remember($cacheKey, $duration, function () {
            return $this->getReportData();
        });

        // Kirim data (dari cache atau kueri baru) ke view
        return Inertia::render('Admin/Reports/Index', [
            'umkmStats' => $reportData['umkmStats'],
            'penyelenggaraStats' => $reportData['penyelenggaraStats'],
            'eventStats' => $reportData['eventStats'],
            'financialAndContentStats' => $reportData['financialAndContentStats'],
        ]);
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'pdf');
        $reportData = $this->getReportData();

        if ($format === 'pdf') {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('reports.admin_pdf', $reportData);
            return $pdf->download('laporan-admin-' . now()->format('Y-m-d') . '.pdf');
        } elseif ($format === 'excel') {
            return $this->exportCsv($reportData);
        }

        abort(404);
    }

    private function getReportData()
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

        return [
            'umkmStats' => $umkmStats,
            'penyelenggaraStats' => $penyelenggaraStats,
            'eventStats' => $eventStats,
            'financialAndContentStats' => $financialAndContentStats,
        ];
    }

    private function exportCsv($data)
    {
        $fileName = 'laporan-admin-' . now()->format('Y-m-d') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            // UMKM Stats
            fputcsv($file, ['STATISTIK UMKM']);
            fputcsv($file, ['Metric', 'Value', 'Description']);
            fputcsv($file, ['Total UMKM', $data['umkmStats']['total']['value'], $data['umkmStats']['total']['description']]);
            fputcsv($file, ['Verified', $data['umkmStats']['verified']['value'], $data['umkmStats']['verified']['description']]);
            fputcsv($file, ['Pending', $data['umkmStats']['pending']['value'], $data['umkmStats']['pending']['description']]);
            fputcsv($file, ['Rejected', $data['umkmStats']['rejected']['value'], $data['umkmStats']['rejected']['description']]);
            fputcsv($file, ['New (Last 30 Days)', $data['umkmStats']['new_last_30_days']['value'], $data['umkmStats']['new_last_30_days']['description']]);
            fputcsv($file, ['Incomplete Profiles', $data['umkmStats']['incomplete_profiles']['value'], $data['umkmStats']['incomplete_profiles']['description']]);
            fputcsv($file, []);

            // Penyelenggara Stats
            fputcsv($file, ['STATISTIK PENYELENGGARA']);
            fputcsv($file, ['Metric', 'Value', 'Description']);
            fputcsv($file, ['Total Penyelenggara', $data['penyelenggaraStats']['total']['value'], $data['penyelenggaraStats']['total']['description']]);
            fputcsv($file, ['Verified', $data['penyelenggaraStats']['verified']['value'], $data['penyelenggaraStats']['verified']['description']]);
            fputcsv($file, ['Pending', $data['penyelenggaraStats']['pending']['value'], $data['penyelenggaraStats']['pending']['description']]);
            fputcsv($file, ['Rejected', $data['penyelenggaraStats']['rejected']['value'], $data['penyelenggaraStats']['rejected']['description']]);
            fputcsv($file, ['Incomplete Profiles', $data['penyelenggaraStats']['incomplete_profiles']['value'], $data['penyelenggaraStats']['incomplete_profiles']['description']]);
            fputcsv($file, []);

            // Event Stats
            fputcsv($file, ['STATISTIK EVENT']);
            fputcsv($file, ['Metric', 'Value', 'Description']);
            fputcsv($file, ['Total Events', $data['eventStats']['total']['value'], $data['eventStats']['total']['description']]);
            fputcsv($file, ['Active', $data['eventStats']['active']['value'], $data['eventStats']['active']['description']]);
            fputcsv($file, ['Upcoming', $data['eventStats']['upcoming']['value'], $data['eventStats']['upcoming']['description']]);
            fputcsv($file, ['Finished', $data['eventStats']['finished']['value'], $data['eventStats']['finished']['description']]);
            fputcsv($file, ['Avg Registrants/Event', $data['eventStats']['average_registrants_per_event']['value'], $data['eventStats']['average_registrants_per_event']['description']]);
            fputcsv($file, []);

            // Financial Stats
            fputcsv($file, ['STATISTIK KEUANGAN & KONTEN']);
            fputcsv($file, ['Metric', 'Value', 'Description']);
            fputcsv($file, ['Total Revenue', 'Rp ' . number_format($data['financialAndContentStats']['total_revenue']['value'], 0, ',', '.'), $data['financialAndContentStats']['total_revenue']['description']]);
            fputcsv($file, ['Total Products', $data['financialAndContentStats']['total_products']['value'], $data['financialAndContentStats']['total_products']['description']]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
