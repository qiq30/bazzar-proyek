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
    // Konfigurasi jumlah data yang akan di-generate
    private const JUMLAH_UMKM_BARU = 250;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Menyiapkan data seeder skala SUPER besar...');

        // =================================================================
        // == 1. DATA PENYELENGGARA (EVENT ORGANIZER)
        // =================================================================
        $this->command->info('1. Membuat data Penyelenggara (diperbanyak)...');
        $eoList = [
            ['Banjarmasin Kreatif', 'eo.kreatif@example.com', 'verified', 'logo_eo_1.png', 'Jl. Pahlawan No. 12', 'Penyelenggara event terkemuka dengan fokus pada industri kreatif dan budaya.'],
            ['Dinas Koperasi & UMKM', 'dinas.kop@example.com', 'pending', null, 'Jl. Gatot Subroto No. 8', 'Lembaga pemerintah yang mendukung pengembangan UMKM di Banjarmasin.'],
            ['EO Maju Jaya', 'eo.maju@example.com', 'rejected', null, 'Jl. Pramuka No. 45', 'Event organizer yang sedang dalam proses verifikasi.'],
            ['Borneo Expo Center', 'borneo.expo@example.com', 'verified', 'logo_eo_2.png', 'Jl. A. Yani Km. 5', 'Spesialis pameran dan expo skala besar di Kalimantan.'],
            ['Kalsel Event Management', 'kalsel.em@example.com', 'verified', null, 'Jl. Lambung Mangkurat No. 21', 'Manajemen event profesional untuk berbagai acara korporat dan publik.'],
            ['Riverfront Organizer', 'river.org@example.com', 'pending', null, 'Jl. Siring Tendean', 'Fokus pada event outdoor dan festival di area siring dan sungai.'],
            ['Youth Creative Hub', 'youth.hub@example.com', 'verified', 'logo_eo_1.png', 'Jl. Brigjen Hasan Basri', 'Inkubator dan penyelenggara acara untuk para pemuda kreatif Banua.'],
            ['Bazar Rakyat Foundation', 'bazar.rakyat@example.com', 'verified', null, 'Jl. Kelayan B No. 77', 'Yayasan nirlaba yang sering mengadakan bazar murah untuk rakyat.'],
            ['Martapura Event Plus', 'martapura.event@example.com', 'verified', 'logo_eo_3.png', 'Jl. Pangeran Hidayatullah', 'EO yang berbasis di Martapura, ahli dalam pameran batu permata dan religi.'],
            ['Festival Kota Organizer', 'festkota.org@example.com', 'verified', 'logo_eo_2.png', 'Jl. Pierre Tendean No. 15', 'Mengelola berbagai festival kota tahunan di Banjarmasin.'],
            ['Komunitas Wadai Banjar', 'wadai.bjm@example.com', 'verified', null, 'Jl. Veteran No. 99', 'Komunitas pencinta kue tradisional yang aktif mengadakan festival kuliner.'],
            ['Craft & Art Promoter', 'craftart.promo@example.com', 'verified', 'logo_eo_1.png', 'Jl. Kayutangi No. 44', 'Promotor khusus untuk pameran kerajinan tangan dan seni lokal.'],
            ['Banjarbaru Digital Expo', 'bb.digital@example.com', 'verified', 'logo_eo_3.png', 'Jl. Panglima Batur, Banjarbaru', 'Penyelenggara pameran teknologi dan ekonomi digital di Banjarbaru.'],
            ['South Borneo Convention', 'sb.convention@example.com', 'verified', null, 'Jl. A. Yani Km. 11', 'Menyediakan layanan MICE (Meeting, Incentive, Convention, and Exhibition).'],
            ['Pasar Malam Entertainment', 'pasarmalam.ent@example.com', 'verified', null, 'Jl. Lingkar Selatan', 'Spesialis hiburan rakyat dan pasar malam keliling.'],
        ];

        $penyelenggaraProfiles = collect($eoList)->map(function ($eo) {
            $user = User::create(['name' => $eo[0], 'email' => $eo[1], 'password' => Hash::make('password'), 'is_penyelenggara' => true, 'email_verified_at' => now(), 'created_at' => Carbon::now()->subMonths(rand(0, 12))]);
            return PenyelenggaraProfile::create(['user_id' => $user->id, 'organizer_name' => $eo[0], 'description' => $eo[5], 'address' => $eo[4], 'verification_document_path' => 'seeders/doc_placeholder.jpg', 'logo_path' => $eo[3] ? "seeders/{$eo[3]}" : null, 'status' => $eo[2]]);
        });
        $allVerifiedEOs = $penyelenggaraProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 2. DATA UMKM (SKALA SANGAT BESAR & PROSEDURAL)
        // =================================================================
        $this->command->info('2. Membuat data UMKM (' . self::JUMLAH_UMKM_BARU . ' UMKM secara prosedural)...');
        $namaDepan = ['Warung', 'Kedai', 'Toko', 'Lapak', 'Dapur', 'Gerai', 'Galeri', 'Butik', 'Sanggar', 'Bengkel', 'Studio'];
        $namaTengah = ['Mama', 'Abah', 'Acil', 'Amang', 'Kakak', 'Ading', 'Berkah', 'Jaya', 'Maju', 'Lestari', 'Sumber', 'Rizky', 'Banua', 'Borneo', 'Kreatif', 'Mandiri'];
        $namaBelakang = ['99', 'BJM', 'Kalsel', 'Sentosa', 'Collection', 'Food', 'Craft', 'Project', 'Express', 'Center'];
        $kategoriList = ['Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Agribisnis', 'Teknologi'];

        $umkmProfiles = collect();
        for ($i = 0; $i < self::JUMLAH_UMKM_BARU; $i++) {
            $namaBisnis = collect($namaDepan)->random() . ' ' . collect($namaTengah)->random() . ' ' . collect($namaBelakang)->random();
            $kategori = collect($kategoriList)->random();
            $status = ['verified', 'verified', 'verified', 'pending', 'rejected'][rand(0, 4)]; // Lebih banyak verified

            $user = User::create([
                'name' => 'Pemilik ' . $namaBisnis,
                'email' => Str::slug($namaBisnis) . '-' . $i . '@example.com', // ✨ FIX DI SINI ✨
                'password' => Hash::make('password'),
                'is_penyelenggara' => false,
                'email_verified_at' => now(),
                'created_at' => Carbon::now()->subMonths(rand(0, 24)),
            ]);

            $umkmProfiles->push(UmkmProfile::create([
                'user_id' => $user->id,
                'business_name' => $namaBisnis,
                'description' => "UMKM {$namaBisnis} menyediakan produk dan layanan berkualitas di bidang {$kategori}.",
                'address' => 'Jl. ' . collect(['Belitung', 'Veteran', 'A. Yani', 'Sultan Adam', 'Kayutangi', 'Pramuka'])->random() . ' No. ' . rand(1, 300),
                'business_type' => $kategori,
                'ktp_path' => 'seeders/ktp_placeholder.jpg',
                'logo_path' => (rand(0, 2) == 1) ? 'seeders/logo_umkm_' . rand(1, 3) . '.png' : null,
                'qris_path' => (rand(0, 1) == 1) ? 'seeders/qris_placeholder.png' : null,
                'status' => $status,
            ]));
        }
        $umkmVerified = $umkmProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 3. DATA PRODUK (SKALA BESAR)
        // =================================================================
        $this->command->info('3. Membuat data Produk (dengan variasi lebih banyak)...');
        $productPools = [
            'Kuliner' => ['Soto Banjar Komplit', 'Nasi Kuning Haruan', 'Lontong Orari Spesial', 'Bingka Kentang Bakar', 'Amplang Ikan Tenggiri Super', 'Es Sirup Markisa Khas Banjar', 'Apam Barabai Manis', 'Kue Lapis Legit', 'Dodol Kandangan', 'Gangan Asam Patin', 'Ketupat Kandangan', 'Iwak Papuyu Baubar', 'Mandai Goreng Crispy', 'Teh Herbal Dayak', 'Kopi Khas Pegunungan Meratus', 'Paket Nasi Kotak Ekonomis', 'Jus Buah Naga Segar', 'Pentol Kuah Pedas'],
            'Fashion' => ['Kain Sasirangan Motif Naga', 'Baju Kurung Modern', 'Kopiah Hitam Beludru Premium', 'Selendang Batik Banjar Tulis', 'Gamis Sasirangan Elegan', 'Kaos Oleh-oleh Bekantan', 'Sarung Tenun Pagatan', 'Jaket Bomber Sasirangan', 'Daster Sasirangan Adem', 'Hijab Voal Motif Khas Kalimantan', 'Peci Rotan Anyaman Tangan', 'Rompi Ecoprint Daun Jati', 'Tas Selempang Kulit Sintetis'],
            'Kerajinan' => ['Tas Anyaman Purun Jumbo', 'Cincin Batu Kecubung Asli', 'Miniatur Perahu Jukung', 'Tikar Rotan Kalimantan', 'Gantungan Kunci Bekantan', 'Patung Kayu Ulin', 'Gelang Batu Akik', 'Hiasan Dinding Talawang', 'Topi Laung Khas Banjar', 'Vas Bunga dari Gerabah', 'Dompet Kulit Ikan Pari', 'Kotak Tisu Anyaman Bambu', 'Lampu Hias dari Batok Kelapa'],
            'Jasa' => ['Jasa Jahit Gaun Pesta', 'Cuci Sepatu Premium (Deep Clean)', 'Servis AC 1 PK (termasuk isi freon)', 'Paket Katering 100 Porsi', 'Jasa Desain Logo Usaha Profesional', 'Paket Laundry Kiloan', 'Les Privat Matematika SMA', 'Jasa Fotografi Produk UMKM', 'Jasa Pembuatan Website Sederhana', 'Servis Laptop dan Komputer', 'Jasa Antar Jemput Barang Dalam Kota'],
            'Agribisnis' => ['Bibit Pohon Ulin Unggul', 'Madu Kelulut Asli Meratus', 'Pupuk Organik Kompos', 'Paket Sayuran Hidroponik Segar', 'Telur Ayam Kampung Organik', 'Ikan Nila Segar per Kg', 'Beras Lokal Unus Mayang'],
            'Teknologi' => ['Paket Hosting Website UMKM', 'Jasa Instalasi CCTV', 'Pembuatan Aplikasi Kasir Android', 'Perbaikan Printer dan Komputer', 'Jasa Desain Grafis untuk Medsos'],
        ];

        $products = [];
        foreach ($umkmVerified as $umkm) {
            if (isset($productPools[$umkm->business_type])) {
                $productCount = rand(3, min(7, count($productPools[$umkm->business_type])));
                $selectedProducts = collect($productPools[$umkm->business_type])->random($productCount)->unique();
                foreach ($selectedProducts as $productName) {
                    $products[] = ['umkm_profile_id' => $umkm->id, 'name' => $productName, 'price' => rand(15, 350) * 1000, 'description' => "Produk andalan dari {$umkm->business_name}, dibuat dengan bahan berkualitas tinggi dan resep turun-temurun.", 'created_at' => $umkm->created_at->addDays(rand(1, 30)), 'updated_at' => $umkm->created_at->addDays(rand(31, 60))];
                }
            }
        }
        Product::insert($products);

        // =================================================================
        // == 4. DATA EVENT (DENGAN LOGIKA PROPOSAL & NAMA YANG LEBIH BAIK)
        // =================================================================
        $this->command->info('4. Membuat data Event (dengan logika proposal dan nama yang lebih baik)...');
        $eventNames = [
            'Festival Kuliner Baiman Vol. 4',
            'Banjarmasin Craft Week 2025',
            'Gebyar Sasirangan Banua Tahunan',
            'Pasar Terapung Expo Modern',
            'Ramadhan Fair Sabilal Muhtadin',
            'Bazar UMKM Merdeka HUT RI',
            'Pameran Batu Permata Martapura Internasional',
            'Pesta Wadai 40 Macam Khas Banjar',
            'Sunday Market Siring Tendean',
            'Banjarmasin Food Truck Festival',
            'Pameran Ekonomi Kreatif Kalsel',
            'Night Market Kayutangi',
            'Festival Kopi Nusantara Banjarmasin',
            'Borneo Handicraft Expo',
            'Pameran Fashion Muslimah Terkini',
            'Bazar Buku Murah dan Hobi',
            'Festival Anak Sholeh Banua',
            'Gelar Produk Halal Kalimantan',
            'Pameran Otomotif & Aksesoris Lokal',
            'Banjarbaru Creative Fest',
            'South Borneo Music Festival',
            'Pekan Budaya Kalimantan Selatan',
            'Banjarmasin Tempo Doeloe Fest',
            'Expo Properti & Perbankan Kalsel',
            'Pesta Durian Lokal Banua',
            'Kejuaraan E-Sports Banjarmasin',
            'Kontes Modifikasi Motor Lokal',
            'Festival Layang-layang Hias Sungai Martapura',
            'Pameran Tanaman Hias & Agribisnis',
            'Job Fair Terbesar Banjarmasin 2025',
            'Bazar Sembako Murah Akhir Tahun',
            'Festival Teater dan Seni Pertunjukan',
            'Kalsel Book Fair',
            'Parade Band Indie Borneo',
            'Gelar Inovasi Teknologi Tepat Guna',
            'Pameran Pernikahan Tradisional & Modern',
            'Kompetisi Memasak Chef Banua',
            'Lomba Fotografi Pesona Banjarmasin',
            'Pesta Rakyat Pesisir Pantai',
            'Semarak Tahun Baru di Siring 0 KM'
        ];

        foreach ($eventNames as $index => $eventName) {
            $eo = $allVerifiedEOs->random();

            // Skenario 1: Proposal Tahap 1, masih DRAFT. Nama event normal, status 'draft'.
            if ($index % 7 == 0) {
                Event::create([
                    'user_id' => $eo->user_id,
                    'status_proposal' => 'draft',
                    'nama_event' => $eventName . ' (Konsep Awal)', // Nama event wajar
                    'deskripsi_event' => 'Deskripsi event akan segera diisi setelah konsep disetujui.',
                    'lokasi_event' => 'Akan ditentukan',
                    'tanggal_mulai_acara' => now()->addYear(),
                    'tanggal_selesai_acara' => now()->addYear()->addDay(),
                    'kuota_umkm' => 0,
                    'pendaftaran_dibuka' => now()->addYear(),
                    'pendaftaran_ditutup' => now()->addYear(),
                    'nama_bank_penyelenggara' => 'Akan ditentukan',
                    'nomor_rekening_penyelenggara' => '0000000000',
                    'nama_pemilik_rekening' => 'Akan ditentukan',
                ]);
                continue;
            }

            // Skenario 2: Proposal diajukan, menunggu persetujuan. Nama event normal, status 'menunggu_persetujuan'.
            if ($index % 7 == 1) {
                Event::create([
                    'user_id' => $eo->user_id,
                    'nama_event' => $eventName, // Nama event wajar
                    'deskripsi_event' => "Proposal lengkap untuk penyelenggaraan event '{$eventName}'. Mengajak para UMKM terbaik untuk bergabung dalam perayaan kreativitas dan usaha lokal.",
                    'lokasi_event' => collect(['Siring 0 KM', 'Taman Kamboja', 'Duta Mall', 'Q-Mall Banjarbaru'])->random(),
                    'tanggal_mulai_acara' => now()->addDays(rand(45, 90)),
                    'tanggal_selesai_acara' => now()->addDays(rand(91, 100)),
                    'status_proposal' => 'menunggu_persetujuan',
                    'proposal_document_path' => 'seeders/proposal_placeholder.pdf',
                    'kuota_umkm' => rand(20, 50),
                    'pendaftaran_dibuka' => now()->addDays(rand(15, 30)),
                    'pendaftaran_ditutup' => now()->addDays(rand(31, 44)),
                    'nama_bank_penyelenggara' => 'Bank Kalsel Syariah',
                    'nomor_rekening_penyelenggara' => '0210012345678',
                    'nama_pemilik_rekening' => $eo->organizer_name,
                ]);
                continue;
            }

            // Skenario Sisanya: Proposal sudah disetujui, menjadi event normal dengan status beragam.
            $status = ['active', 'upcoming', 'upcoming', 'finished', 'finished'][rand(0, 4)];

            $eventData = [
                'user_id' => $eo->user_id,
                'nama_event' => $eventName,
                'deskripsi_event' => "Event meriah untuk para UMKM dan masyarakat Banjarmasin. Menampilkan produk terbaik dari {$umkmVerified->random()->business_name} dan puluhan UMKM lainnya. Jangan sampai ketinggalan!",
                'poster_event' => 'seeders/poster_event_' . rand(1, 4) . '.jpg',
                'lokasi_event' => collect(['Siring 0 KM', 'Taman Kamboja', 'Duta Mall', 'Gedung Sultan Suriansyah', 'Lapangan Murjani Banjarbaru'])->random(),
                'biaya_pendaftaran_umkm' => (rand(0, 3) == 0) ? 0 : rand(5, 25) * 10000,
                'kuota_umkm' => rand(30, 100),
                'nama_bank_penyelenggara' => ['Bank Kalsel', 'BRI', 'Mandiri', 'BCA'][rand(0, 3)],
                'nomor_rekening_penyelenggara' => rand(1000000000, 9999999999),
                'nama_pemilik_rekening' => $eo->organizer_name,
                'panitia_pin' => rand(111111, 999999),
                'status_proposal' => 'disetujui',
                'status' => $status,
                'proposal_document_path' => 'seeders/proposal_placeholder.pdf',
            ];

            if ($status === 'finished') {
                $eventData['tanggal_selesai_acara'] = now()->subDays(rand(10, 180));
                $eventData['tanggal_mulai_acara'] = $eventData['tanggal_selesai_acara']->copy()->subDays(rand(2, 5));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(5, 10));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            } elseif ($status === 'active') {
                $eventData['tanggal_mulai_acara'] = now()->subDays(rand(1, 2));
                $eventData['tanggal_selesai_acara'] = now()->addDays(rand(3, 7));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(1, 2));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            } else { // upcoming
                $eventData['tanggal_mulai_acara'] = now()->addDays(rand(20, 90));
                $eventData['tanggal_selesai_acara'] = $eventData['tanggal_mulai_acara']->copy()->addDays(rand(2, 5));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(5, 10));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            }
            Event::create($eventData);
        }

        // =================================================================
        // == 5. DATA PENDAFTARAN EVENT
        // =================================================================
        $this->command->info('5. Membuat data Pendaftaran Event (SANGAT diperbanyak)...');
        $registrations = [];
        $allEvents = Event::where('status_proposal', 'disetujui')->get();

        foreach ($allEvents as $event) {
            if (!$event->pendaftaran_dibuka || $event->pendaftaran_dibuka->isFuture()) {
                continue;
            }
            if ($umkmVerified->isEmpty()) continue;

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
                // Jika event sudah selesai, lebih banyak yang sudah check-in
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
            EventRegistration::insert($chunk);
        }

        $this->command->info('🎉 SEEDER SKALA SUPER BESAR BERHASIL DIJALANKAN! 🎉');
        $this->command->info('📊 RINGKASAN DATA:');
        $this->command->info('- Penyelenggara: ' . PenyelenggaraProfile::count());
        $this->command->info('- UMKM: ' . UmkmProfile::count());
        $this->command->info('- Produk: ' . Product::count());
        $this->command->info('- Event: ' . Event::count());
        $this->command->info('- Registrasi Event: ' . EventRegistration::count());
        $this->command->info('✅ Data siap untuk testing yang komprehensif dan konsisten!');
    }
}
