<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PenyelenggaraProfile;
use App\Models\UmkmProfile;
use App\Models\Event;
use App\Models\Product;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UltimateTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Menyiapkan data seeder skala kecil...');

        // =================================================================
        // == 0. DATA ADMIN
        // =================================================================
        $this->command->info('0. Membuat data Admin...');
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]);
        }

        // =================================================================
        // == 1. DATA PENYELENGGARA (EVENT ORGANIZER) - KONSISTEN
        // =================================================================
        $this->command->info('1. Membuat data Penyelenggara (konsisten)...');
        $eoList = [
            ['Banjarmasin Kreatif', 'eo.kreatif@example.com', 'verified', 'logo_eo_1.png', 'Jl. Pahlawan No. 12', 'Penyelenggara event terkemuka.'],
            ['Dinas Koperasi & UMKM', 'dinas.kop@example.com', 'pending', null, 'Jl. Gatot Subroto No. 8', 'Lembaga pemerintah.'],
            ['EO Maju Jaya', 'eo.maju@example.com', 'rejected', null, 'Jl. Pramuka No. 45', 'Event organizer yang ditolak.'],
            ['Borneo Expo Center', 'borneo.expo@example.com', 'verified', 'logo_eo_2.png', 'Jl. A. Yani Km. 5', 'Spesialis pameran dan expo.'],
            ['Kalsel Event Management', 'kalsel.em@example.com', 'verified', null, 'Jl. Lambung Mangkurat No. 21', 'Manajemen event profesional.'],
        ];

        $penyelenggaraProfiles = collect($eoList)->map(function ($eo) {
            $user = User::firstOrCreate(
                ['email' => $eo[1]],
                ['name' => $eo[0], 'password' => Hash::make('password'), 'is_penyelenggara' => true, 'email_verified_at' => now(), 'created_at' => Carbon::now()->subMonths(rand(0, 12))]
            );
            return PenyelenggaraProfile::firstOrCreate(
                ['user_id' => $user->id],
                ['organizer_name' => $eo[0], 'description' => $eo[5], 'address' => $eo[4], 'verification_document_path' => 'seeders/doc_placeholder.jpg', 'logo_path' => $eo[3] ? "seeders/{$eo[3]}" : null, 'status' => $eo[2]]
            );
        });
        $allVerifiedEOs = $penyelenggaraProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 2. DATA UMKM (KONSISTEN)
        // =================================================================
        $this->command->info('2. Membuat data UMKM (konsisten)...');
        $umkmList = [
            ['Warung Mama Berkah BJM', 'warung.berkah@example.com', 'verified', 'Kuliner', 'Jl. Belitung No. 101', 'seeders/logo_umkm_1.png', 'seeders/qris_placeholder.png'],
            ['Toko Jaya Craft Sentosa', 'toko.jaya.craft@example.com', 'verified', 'Kerajinan', 'Jl. A. Yani No. 25', null, null],
            ['Dapur Banua Food 99', 'dapur.banua@example.com', 'verified', 'Kuliner', 'Jl. Veteran No. 88', 'seeders/logo_umkm_2.png', null],
            ['Lapak Kreatif Fashion', 'lapak.kreatif@example.com', 'pending', 'Fashion', 'Jl. Pramuka No. 12', null, 'seeders/qris_placeholder.png'],
            ['Kedai Abah Sentosa', 'kedai.abah@example.com', 'rejected', 'Kuliner', 'Jl. Sutoyo S. No. 34', 'seeders/logo_umkm_3.png', null],
            ['Sasirangan Banua Style', 'sasirangan.banua@example.com', 'verified', 'Fashion', 'Jl. Kampung Melayu No. 5', 'seeders/logo_umkm_1.png', 'seeders/qris_placeholder.png'],
            ['Agribisnis Meratus Hijau', 'agri.meratus@example.com', 'verified', 'Agribisnis', 'Jl. HKSN No. 77', null, 'seeders/qris_placeholder.png'],
            ['Jasa Bersih Kinclong', 'jasa.kinclong@example.com', 'pending', 'Jasa', 'Jl. Adhyaksa No. 19', null, null],
        ];

        $umkmProfiles = collect($umkmList)->map(function ($umkm) {
            $user = User::firstOrCreate(
                ['email' => $umkm[1]],
                [
                    'name' => 'Pemilik ' . $umkm[0],
                    'password' => Hash::make('password'),
                    'is_penyelenggara' => false,
                    'email_verified_at' => now(),
                    'created_at' => Carbon::now()->subMonths(rand(0, 24)),
                ]
            );

            return UmkmProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'business_name' => $umkm[0],
                    'description' => "UMKM {$umkm[0]} menyediakan produk dan layanan berkualitas di bidang {$umkm[3]}.",
                    'address' => $umkm[4],
                    'business_type' => $umkm[3],
                    'ktp_path' => 'seeders/ktp_placeholder.jpg',
                    'logo_path' => $umkm[5],
                    'qris_path' => $umkm[6],
                    'status' => $umkm[2],
                ]
            );
        });
        $umkmVerified = $umkmProfiles->where('status', 'verified')->values();


        // =================================================================
        // == 3. DATA PRODUK (SKALA KECIL)
        // =================================================================
        $this->command->info('3. Membuat data Produk (diperkecil)...');
        $productPools = [
            'Kuliner' => ['Soto Banjar Komplit', 'Nasi Kuning Haruan', 'Lontong Orari Spesial', 'Bingka Kentang Bakar', 'Amplang Ikan Tenggiri Super'],
            'Fashion' => ['Kain Sasirangan Motif Naga', 'Baju Kurung Modern', 'Kopiah Hitam Premium', 'Gamis Sasirangan Elegan', 'Kaos Oleh-oleh Bekantan'],
            'Kerajinan' => ['Tas Anyaman Purun', 'Cincin Batu Kecubung', 'Miniatur Perahu Jukung', 'Tikar Rotan Kalimantan', 'Gantungan Kunci Bekantan'],
            'Jasa' => ['Jasa Jahit Gaun Pesta', 'Cuci Sepatu Premium', 'Servis AC 1 PK', 'Paket Katering 100 Porsi', 'Jasa Desain Logo Usaha'],
            'Agribisnis' => ['Bibit Pohon Ulin Unggul', 'Madu Kelulut Asli Meratus', 'Pupuk Organik Kompos', 'Paket Sayuran Hidroponik'],
        ];

        $products = [];
        foreach ($umkmVerified as $umkm) {
            if (isset($productPools[$umkm->business_type])) {
                $productCount = rand(2, min(4, count($productPools[$umkm->business_type])));
                $selectedProducts = collect($productPools[$umkm->business_type])->random($productCount)->unique();
                foreach ($selectedProducts as $productName) {
                    $products[] = ['umkm_profile_id' => $umkm->id, 'name' => $productName, 'price' => rand(15, 350) * 1000, 'description' => "Produk andalan dari {$umkm->business_name}.", 'created_at' => $umkm->created_at->addDays(rand(1, 30)), 'updated_at' => $umkm->created_at->addDays(rand(31, 60))];
                }
            }
        }
        Product::insert($products);

        // =================================================================
        // == 4. DATA EVENT - DIPERBANYAK
        // =================================================================
        $this->command->info('4. Membuat data Event (diperbanyak)...');
        $eventNames = [
            'Festival Kuliner Baiman Vol. 4',
            'Banjarmasin Craft Week 2025',
            'Gebyar Sasirangan Banua Tahunan',
            'Ramadhan Fair Sabilal Muhtadin',
            'Bazar UMKM Merdeka HUT RI',
            'Sunday Market Siring Tendean',
            'Pameran Ekonomi Kreatif Kalsel',
            'Night Market Kayutangi',
            'Job Fair Terbesar Banjarmasin 2025',
            'Semarak Tahun Baru di Siring 0 KM',
            'Pekan Raya Banjarmasin 2025',
            'Festival Kopi & Senja di Tepi Sungai',
            'Bazar Buku dan Literasi Banua',
            'Kompetisi E-Sports & UMKM Gaming',
        ];

        $locations = [
            'Siring 0 KM' => ['latitude' => -3.3170, 'longitude' => 114.5912],
            'Taman Kamboja' => ['latitude' => -3.3220, 'longitude' => 114.5900],
            'Duta Mall' => ['latitude' => -3.323358, 'longitude' => 114.603555],
        ];

        foreach ($eventNames as $index => $eventName) {
            $eo = $allVerifiedEOs->random();
            $lokasi = array_rand($locations);
            $coords = $locations[$lokasi];


            if ($index % 7 == 0) { // Skenario Konsep Awal (Step 1 Submitted)
                Event::firstOrCreate(
                    ['nama_event' => $eventName . ' (Konsep Awal)'],
                    [
                        'user_id' => $eo->user_id,
                        'status_proposal' => 'draft',
                        'status' => null, // Status belum aktif
                        'document_verification_status' => 'pending_document_verification', // Menunggu verifikasi dokumen admin
                        'proposal_document_path' => 'seeders/proposal_placeholder.pdf',
                        'deskripsi_event' => 'Deskripsi akan diisi setelah dokumen disetujui.',
                        'lokasi_event' => 'Akan ditentukan',
                        'latitude' => null,
                        'longitude' => null,
                        'tanggal_mulai_acara' => now()->addYear(),
                        'tanggal_selesai_acara' => now()->addYear()->addDay(),
                        'kuota_umkm' => 0,
                        'pendaftaran_dibuka' => now()->addYear(),
                        'pendaftaran_ditutup' => now()->addYear(),
                        'nama_bank_penyelenggara' => 'Akan ditentukan',
                        'nomor_rekening_penyelenggara' => '0000000000',
                        'nama_pemilik_rekening' => 'Akan ditentukan',
                    ]
                );
                continue;
            }

            if ($index % 7 == 1) { // Skenario Menunggu Persetujuan (Step 2 Submitted)
                Event::firstOrCreate(
                    ['nama_event' => $eventName],
                    [
                        'user_id' => $eo->user_id,
                        'deskripsi_event' => "Proposal lengkap untuk event '{$eventName}'.",
                        'lokasi_event' => $lokasi,
                        'latitude' => $coords['latitude'],
                        'longitude' => $coords['longitude'],
                        'tanggal_mulai_acara' => now()->addDays(rand(45, 90)),
                        'tanggal_selesai_acara' => now()->addDays(rand(91, 100)),
                        'status_proposal' => 'menunggu_persetujuan',
                        'status' => null, // Status belum aktif
                        'document_verification_status' => 'document_approved', // Dokumen sudah disetujui
                        'proposal_document_path' => 'seeders/proposal_placeholder.pdf',
                        'kuota_umkm' => rand(20, 50),
                        'pendaftaran_dibuka' => now()->addDays(rand(15, 30)),
                        'pendaftaran_ditutup' => now()->addDays(rand(31, 44)),
                        'nama_bank_penyelenggara' => 'Bank Kalsel Syariah',
                        'nomor_rekening_penyelenggara' => '0210012345678',
                        'nama_pemilik_rekening' => $eo->organizer_name,
                    ]
                );
                continue;
            }

            // Tentukan tipe event dasar
            $type = ['active', 'future', 'future', 'finished', 'finished'][rand(0, 4)];

            $eventData = [
                'user_id' => $eo->user_id,
                'nama_event' => $eventName,
                'deskripsi_event' => "Event meriah untuk para UMKM dan masyarakat Banjarmasin.",
                'poster_event' => collect(['🎉', '🎤', '🎨', '🍲', '👗', '🎵', '🏆', '🎪', '🛍️', '🎭'])->random(),
                'lokasi_event' => $lokasi,
                'latitude' => $coords['latitude'],
                'longitude' => $coords['longitude'],
                'biaya_pendaftaran_umkm' => (rand(0, 3) == 0) ? 0 : rand(5, 25) * 10000,
                'kuota_umkm' => rand(30, 100),
                'nama_bank_penyelenggara' => ['Bank Kalsel', 'BRI', 'BCA'][rand(0, 2)],
                'nomor_rekening_penyelenggara' => rand(1000000000, 9999999999),
                'nama_pemilik_rekening' => $eo->organizer_name,
                'panitia_pin' => rand(111111, 999999),
                'status_proposal' => 'disetujui',
                'document_verification_status' => 'document_approved', // Dokumen sudah disetujui
                'proposal_document_path' => 'seeders/proposal_placeholder.pdf',
            ];

            if ($type === 'finished') {
                // Event selesai: End Date < Now
                $eventData['status'] = 'finished';
                $eventData['tanggal_selesai_acara'] = now()->subDays(rand(1, 30));
                $eventData['tanggal_mulai_acara'] = $eventData['tanggal_selesai_acara']->copy()->subDays(rand(2, 5));

                // Pendaftaran pasti sudah tutup
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(5, 10));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            } elseif ($type === 'active') {
                // Event aktif: Start <= Now < End
                $eventData['status'] = 'active';
                $eventData['tanggal_mulai_acara'] = now()->subDays(rand(0, 2));
                $eventData['tanggal_selesai_acara'] = now()->addDays(rand(1, 5));

                // Pendaftaran biasanya sudah tutup saat event mulai
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(1, 3));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(7, 14));
            } else { // future (upcoming)
                // Event akan datang: Start > Now
                $eventData['tanggal_mulai_acara'] = now()->addDays(rand(10, 60));
                $eventData['tanggal_selesai_acara'] = $eventData['tanggal_mulai_acara']->copy()->addDays(rand(2, 5));

                // Tentukan status pendaftaran
                $randScenario = rand(1, 3);
                if ($randScenario == 1) {
                    // Registration Open: Open <= Now < Close
                    $eventData['status'] = 'registration_open';
                    $eventData['pendaftaran_dibuka'] = now()->subDays(rand(1, 5));
                    $eventData['pendaftaran_ditutup'] = now()->addDays(rand(5, 10));
                } elseif ($randScenario == 2) {
                    // Registration Upcoming (Not yet open): Open > Now
                    $eventData['status'] = 'upcoming';
                    $eventData['pendaftaran_dibuka'] = now()->addDays(rand(1, 5));
                    $eventData['pendaftaran_ditutup'] = $eventData['pendaftaran_dibuka']->copy()->addDays(rand(7, 14));
                } else {
                    // Registration Closed: Close < Now
                    $eventData['status'] = 'registration_closed';
                    $eventData['pendaftaran_dibuka'] = now()->subDays(rand(15, 20));
                    $eventData['pendaftaran_ditutup'] = now()->subDays(rand(1, 5));
                }
            }
            Event::firstOrCreate(
                ['nama_event' => $eventName],
                $eventData
            );
        }

        // =================================================================
        // == 5. DATA PENDAFTARAN EVENT
        // =================================================================
        $this->command->info('5. Membuat data Pendaftaran Event (diperkecil)...');
        $registrations = [];
        $allEvents = Event::where('status_proposal', 'disetujui')->get();

        foreach ($allEvents as $event) {
            if (!$event->pendaftaran_dibuka || $event->pendaftaran_dibuka->isFuture() || $umkmVerified->isEmpty()) {
                continue;
            }
            $limit = min($event->kuota_umkm, $umkmVerified->count());
            if ($limit < 1) continue;

            $numParticipants = rand(max(1, floor($limit * 0.7)), $limit);
            $participants = $umkmVerified->random($numParticipants);
            if ($participants instanceof UmkmProfile) $participants = collect([$participants]);

            foreach ($participants as $umkm) {
                $registrationEndDate = $event->pendaftaran_ditutup->isPast() ? $event->pendaftaran_ditutup : now();
                $diffInSeconds = $registrationEndDate->diffInSeconds($event->pendaftaran_dibuka);
                $randomSeconds = ($diffInSeconds > 0) ? rand(0, $diffInSeconds) : 0;
                $createdAt = $event->pendaftaran_dibuka->copy()->addSeconds($randomSeconds);

                $statusPool = ['approved', 'menunggu_pembayaran', 'pembayaran_terkonfirmasi', 'rejected', 'sudah_check_in'];
                if ($event->status === 'finished') {
                    $statusPool = ['sudah_check_in', 'sudah_check_in', 'sudah_check_in', 'approved', 'rejected'];
                } elseif ($event->status === 'active') {
                    $statusPool = ['sudah_check_in', 'approved', 'approved', 'rejected'];
                }
                $status = collect($statusPool)->random();

                $registrationData = [
                    'event_id' => $event->id,
                    'umkm_profile_id' => $umkm->id,
                    'status' => $status,
                    'kode_pendaftaran' => 'BZREVT' . strtoupper(Str::random(8)),
                    'bukti_pembayaran_path' => null,
                    'nomor_stand' => null,
                    'kode_pin' => null,
                    'created_at' => $createdAt,
                    'payment_due' => $createdAt->copy()->addHours(24),
                    'updated_at' => $createdAt->copy()->addHours(rand(1, 23)),
                ];

                if (!in_array($status, ['menunggu_pembayaran', 'rejected'])) {
                    $registrationData['bukti_pembayaran_path'] = 'seeders/bukti_bayar_valid.jpg';
                }
                if (in_array($status, ['approved', 'sudah_check_in', 'pembayaran_terkonfirmasi'])) {
                    $registrationData['nomor_stand'] = chr(rand(65, 70)) . '-' . rand(1, 20);
                }
                if (in_array($status, ['approved', 'sudah_check_in'])) {
                    $registrationData['kode_pin'] = rand(111111, 999999);
                }
                $registrations[] = $registrationData;
            }
        }

        foreach (array_chunk($registrations, 500) as $chunk) {
            EventRegistration::upsert(
                $chunk,
                ['event_id', 'umkm_profile_id'],
                ['status', 'kode_pendaftaran', 'bukti_pembayaran_path', 'nomor_stand', 'kode_pin', 'payment_due', 'updated_at']
            );
        }

        $this->command->info('SEEDER SKALA KECIL BERHASIL DIJALANKAN! ');
        $this->command->info('RINGKASAN DATA:');
        $this->command->info('- Penyelenggara: ' . PenyelenggaraProfile::count());
        $this->command->info('- UMKM: ' . UmkmProfile::count());
        $this->command->info('- Produk: ' . Product::count());
        $this->command->info('- Event: ' . Event::count());
        $this->command->info('- Registrasi Event: ' . EventRegistration::count());
        $this->command->info('Data siap untuk development dan testing ringan.');
    }
}
