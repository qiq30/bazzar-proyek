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
    public function run(): void
    {
        $this->command->info('Menyiapkan data seeder skala SUPER besar...');

        // =================================================================
        // == 1. DATA PENYELENGGARA (EVENT ORGANIZER)
        // =================================================================
        $this->command->info('1. Membuat data Penyelenggara...');
        $eoList = [
            ['Banjarmasin Kreatif', 'eo.kreatif@example.com', 'verified', 'logo_eo_1.png', 'Jl. Pahlawan No. 12'],
            ['Dinas Koperasi & UMKM', 'dinas.kop@example.com', 'pending', null, 'Jl. Gatot Subroto No. 8'],
            ['EO Maju Jaya', 'eo.maju@example.com', 'rejected', null, 'Jl. Pramuka No. 45'],
            ['Borneo Expo Center', 'borneo.expo@example.com', 'verified', 'logo_eo_2.png', 'Jl. A. Yani Km. 5'],
            ['Kalsel Event Management', 'kalsel.em@example.com', 'verified', null, 'Jl. Lambung Mangkurat No. 21'],
            ['Riverfront Organizer', 'river.org@example.com', 'pending', null, 'Jl. Siring Tendean'],
            ['Youth Creative Hub', 'youth.hub@example.com', 'verified', 'logo_eo_1.png', 'Jl. Brigjen Hasan Basri'],
            ['Bazar Rakyat Foundation', 'bazar.rakyat@example.com', 'verified', null, 'Jl. Kelayan B No. 77'],
            ['Martapura Event Plus', 'martapura.event@example.com', 'verified', 'logo_eo_3.png', 'Jl. Pangeran Hidayatullah'],
            ['Festival Kota Organizer', 'festkota.org@example.com', 'verified', 'logo_eo_2.png', 'Jl. Pierre Tendean No. 15'],
            ['Komunitas Wadai Bjm', 'wadai.bjm@example.com', 'verified', null, 'Jl. Veteran No. 99'],
            ['Craft & Art Promoter', 'craftart.promo@example.com', 'verified', 'logo_eo_1.png', 'Jl. Kayutangi No. 44'],
        ];

        $penyelenggaraProfiles = collect($eoList)->map(function ($eo) {
            $user = User::create(['name' => $eo[0], 'email' => $eo[1], 'password' => Hash::make('password'), 'is_penyelenggara' => true, 'email_verified_at' => now(), 'created_at' => Carbon::now()->subMonths(rand(0, 12))]);
            return PenyelenggaraProfile::create(['user_id' => $user->id, 'organizer_name' => $eo[0], 'description' => "Penyelenggara event berpengalaman di Banjarmasin, fokus pada event UMKM dan budaya.", 'address' => $eo[4], 'verification_document_path' => 'seeders/doc_placeholder.jpg', 'logo_path' => $eo[3] ? "seeders/{$eo[3]}" : null, 'status' => $eo[2]]);
        });
        $allVerifiedEOs = $penyelenggaraProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 2. DATA UMKM (SKALA BESAR)
        // =================================================================
        $this->command->info('2. Membuat data UMKM (SANGAT diperbanyak)...');
        $umkmList = [
            // Kuliner
            ['Warung Mama Zaskia', 'zaskia.kitchen@example.com', 'Zaskia Kitchen', 'Kuliner', 'verified', 'logo_umkm_1.png', true],
            ['Amplang Amang Joko', 'joko.amplang@example.com', 'Amplang Kress Amang Joko', 'Kuliner', 'verified', null, true],
            ['Es Teler Acil Ida', 'ida.segar@example.com', 'Es Segar Acil Ida', 'Kuliner', 'pending', 'logo_umkm_3.png', false],
            ['Soto Banjar Bang Amat', 'soto.amat@example.com', 'Soto Bajar Bang Amat', 'Kuliner', 'verified', 'logo_umkm_1.png', true],
            ['Lontong Orari Acil Ijah', 'lontong.ijah@example.com', 'Lontong Orari Acil Ijah', 'Kuliner', 'verified', null, true],
            ['Wadai Banua', 'wadai.banua@example.com', 'Wadai Banua Mama', 'Kuliner', 'verified', 'logo_umkm_1.png', true],
            ['Pentol Bakar 99', 'pentol99@example.com', 'Pentol Bakar 99', 'Kuliner', 'verified', 'logo_umkm_3.png', true],
            ['Ketupat Kandangan Ibu Sari', 'sari.ketupat@example.com', 'Warung Ketupat Kandangan', 'Kuliner', 'verified', null, false],
            ['Kopi Lokal Borneo', 'kopiborneo@example.com', 'Borneo Coffee Roasters', 'Kuliner', 'verified', 'logo_umkm_1.png', true],
            ['Catering Dapur Bunda', 'catering.bunda@example.com', 'Dapur Bunda Catering', 'Kuliner', 'verified', null, true],
            // Fashion
            ['Sasirangan Rina', 'rina.sasirangan@example.com', 'Galeri Sasirangan Rina', 'Fashion', 'verified', 'logo_umkm_2.png', true],
            ['Batik Banjar Dewi', 'dewi.batik@example.com', 'Batik Banjar Collection', 'Fashion', 'pending', 'logo_umkm_2.png', false],
            ['Peci Martapura H. Udin', 'peci.udin@example.com', 'Peci Haji Martapura', 'Fashion', 'verified', 'logo_umkm_2.png', true],
            ['Kaos Desain Banjar', 'kaos.banjar@example.com', 'Banjar T-Shirt Co.', 'Fashion', 'verified', null, false],
            ['Hijab Al-Zahra', 'hijab.zahra@example.com', 'Al-Zahra Scarf', 'Fashion', 'verified', 'logo_umkm_2.png', true],
            ['Tas Kulit Mandau', 'taskulit.mandau@example.com', 'Mandau Leatherworks', 'Fashion', 'rejected', null, false],
            // Kerajinan
            ['Anyaman Purun Ahmad', 'ahmad.purun@example.com', 'Ahmad Purun Craft', 'Kerajinan', 'verified', null, false],
            ['Permata Siti', 'siti.permata@example.com', 'Batu Permata Siti', 'Kerajinan', 'verified', 'logo_umkm_1.png', true],
            ['Jukung Miniatur Kai', 'kai.jukung@example.com', 'Jukung Miniatur Banjar', 'Kerajinan', 'verified', null, true],
            ['Ukiran Kayu Ulin', 'ukiran.ulin@example.com', 'Ulin Wood Carving', 'Kerajinan', 'verified', null, true],
            ['Gerabah Sungai Jingah', 'gerabah.jingah@example.com', 'Gerabah Klasik Jingah', 'Kerajinan', 'pending', null, false],
            ['Tikar Rotan Lestari', 'tikar.lestari@example.com', 'Lestari Rotan Weaving', 'Kerajinan', 'verified', 'logo_umkm_1.png', true],
            // Jasa
            ['Jahit Kilat Bu Rita', 'rita.jahit@example.com', 'Jahit Ekspres Mama Rita', 'Jasa', 'verified', null, false],
            ['Cuci Sepatu BJM', 'cuci.sepatu@example.com', 'BJM Shoe Clean', 'Jasa', 'verified', 'logo_umkm_3.png', true],
            ['Servis AC Dingin Banar', 'servis.ac@example.com', 'Servis Dingin Banar', 'Jasa', 'verified', null, true],
            ['Desain Grafis Kreatif', 'desain.kreatif@example.com', 'Kreatif Design Studio', 'Jasa', 'verified', 'logo_umkm_3.png', false],
            ['Les Privat Cerdas', 'les.cerdas@example.com', 'Bimbel Cerdas Banua', 'Jasa', 'pending', null, false],
            ['Laundry Wangi', 'laundry.wangi@example.com', 'Wangi Laundry Express', 'Jasa', 'verified', 'logo_umkm_3.png', true],
        ];

        $umkmProfiles = collect($umkmList)->map(function ($umkm) {
            $user = User::create(['name' => $umkm[0], 'email' => $umkm[1], 'password' => Hash::make('password'), 'is_penyelenggara' => false, 'email_verified_at' => now(), 'created_at' => Carbon::now()->subMonths(rand(0, 18))]);
            return UmkmProfile::create(['user_id' => $user->id, 'business_name' => $umkm[2], 'description' => "UMKM {$umkm[2]} menyediakan produk dan layanan berkualitas khas Banua.", 'address' => 'Jl. ' . collect(['Belitung', 'Veteran', 'A. Yani', 'Sultan Adam', 'Kayutangi'])->random() . ' No. ' . rand(1, 300), 'business_type' => $umkm[3], 'ktp_path' => 'seeders/ktp_placeholder.jpg', 'logo_path' => $umkm[5] ? "seeders/{$umkm[5]}" : null, 'qris_path' => $umkm[6] ? 'seeders/qris_placeholder.png' : null, 'status' => $umkm[4]]);
        });
        $umkmVerified = $umkmProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 3. DATA PRODUK (SKALA BESAR)
        // =================================================================
        $this->command->info('3. Membuat data Produk (SANGAT diperbanyak)...');
        $productPools = [
            'Kuliner' => ['Soto Banjar Komplit', 'Nasi Kuning Haruan', 'Lontong Orari Spesial', 'Bingka Kentang Bakar', 'Amplang Ikan Tenggiri Super', 'Es Sirup Markisa Khas Banjar', 'Apam Barabai Manis', 'Kue Lapis Legit', 'Dodol Kandangan', 'Gangan Asam Patin'],
            'Fashion' => ['Kain Sasirangan Motif Naga', 'Baju Kurung Modern', 'Kopiah Hitam Beludru Premium', 'Selendang Batik Banjar Tulis', 'Gamis Sasirangan Elegan', 'Kaos Oleh-oleh Bekantan', 'Sarung Tenun Pagatan', 'Jaket Bomber Sasirangan'],
            'Kerajinan' => ['Tas Anyaman Purun Jumbo', 'Cincin Batu Kecubung Asli', 'Miniatur Perahu Jukung', 'Tikar Rotan Kalimantan', 'Gantungan Kunci Bekantan', 'Patung Kayu Ulin', 'Gelang Batu Akik', 'Hiasan Dinding Talawang'],
            'Jasa' => ['Jasa Jahit Gaun Pesta', 'Cuci Sepatu Premium (Deep Clean)', 'Servis AC 1 PK (termasuk isi freon)', 'Paket Katering 100 Porsi', 'Jasa Desain Logo Usaha Profesional', 'Paket Laundry Kiloan', 'Les Privat Matematika SMA'],
        ];

        $products = [];
        foreach ($umkmVerified as $umkm) {
            if (isset($productPools[$umkm->business_type])) {
                $selectedProducts = collect($productPools[$umkm->business_type])->random(rand(3, 7))->unique();
                foreach ($selectedProducts as $productName) {
                    $products[] = ['umkm_profile_id' => $umkm->id, 'name' => $productName, 'price' => rand(15, 250) * 1000, 'description' => "Produk andalan dari {$umkm->business_name}, dibuat dengan bahan berkualitas.", 'created_at' => now(), 'updated_at' => now()];
                }
            }
        }
        Product::insert($products);

        // =================================================================
        // == 4. DATA EVENT (JUMLAH MAKSIMAL & TANGGAL KONSISTEN)
        // =================================================================
        $this->command->info('4. Membuat data Event (SANGAT diperbanyak)...');
        // FIX: Jumlah nama event dikembalikan ke versi banyak dan ditambah
        $eventNames = [
            'Festival Kuliner Baiman Vol. 3',
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
            'South Borneo Music Festival'
        ];

        foreach ($eventNames as $eventName) {
            $eo = $allVerifiedEOs->random();
            $status = ['active', 'upcoming', 'finished'][rand(0, 2)];

            // LOGIC KONSISTEN: Logika pembuatan tanggal yang sudah benar tetap dipertahankan
            $eventData = [
                'user_id' => $eo->user_id,
                'nama_event' => $eventName,
                'deskripsi_event' => "Event meriah untuk para UMKM dan masyarakat Banjarmasin.",
                'poster_event' => 'seeders/poster_event_' . rand(1, 4) . '.jpg',
                'lokasi_event' => collect(['Siring 0 KM', 'Taman Kamboja', 'Duta Mall', 'Gedung Sultan Suriansyah'])->random(),
                'biaya_pendaftaran_umkm' => (rand(0, 3) == 0) ? 0 : rand(5, 20) * 10000,
                'kuota_umkm' => rand(25, 80),
                'nama_bank_penyelenggara' => 'Bank Kalsel',
                'nomor_rekening_penyelenggara' => '001234567890',
                'nama_pemilik_rekening' => $eo->organizer_name,
                'status_proposal' => 'disetujui',
                'status' => $status,
                'panitia_pin' => rand(111111, 999999),
            ];

            if ($status === 'finished') {
                $eventData['tanggal_selesai_acara'] = now()->subDays(rand(10, 180));
                $eventData['tanggal_mulai_acara'] = $eventData['tanggal_selesai_acara']->copy()->subDays(rand(2, 5));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(5, 10));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            } elseif ($status === 'active') {
                $eventData['tanggal_mulai_acara'] = now()->subDays(rand(1, 3));
                $eventData['tanggal_selesai_acara'] = now()->addDays(rand(3, 7));
                $eventData['pendaftaran_dibuka'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(10, 20));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_selesai_acara']->copy()->subDays(rand(1, 2));
            } else { // upcoming
                $eventData['tanggal_mulai_acara'] = now()->addDays(rand(20, 90));
                $eventData['tanggal_selesai_acara'] = $eventData['tanggal_mulai_acara']->copy()->addDays(rand(2, 5));
                $eventData['pendaftaran_ditutup'] = $eventData['tanggal_mulai_acara']->copy()->subDays(rand(5, 10));
                $eventData['pendaftaran_dibuka'] = $eventData['pendaftaran_ditutup']->copy()->subDays(rand(10, 20));
            }
            Event::create($eventData);
        }

        // =================================================================
        // == 5. DATA PENDAFTARAN EVENT (SKALA BESAR & TANGGAL KONSISTEN)
        // =================================================================
        $this->command->info('5. Membuat data Pendaftaran Event (SANGAT diperbanyak)...');
        $registrations = [];
        $allEvents = Event::where('status', '!=', 'draft')->get();

        foreach ($allEvents as $event) {
            if ($event->pendaftaran_dibuka->isFuture()) {
                continue;
            }
            if ($umkmVerified->isEmpty()) continue;

            $limit = min($event->kuota_umkm, $umkmVerified->count());
            if ($limit < 1) continue;

            $numParticipants = rand(max(1, floor($limit * 0.5)), $limit);
            $participants = $umkmVerified->random($numParticipants);
            if ($participants instanceof UmkmProfile) $participants = collect([$participants]);

            foreach ($participants as $umkm) {
                // LOGIC KONSISTEN: Pembuatan tanggal created_at dan payment_due yang sudah benar tetap dipertahankan
                $registrationEndDate = $event->pendaftaran_ditutup->isPast() ? $event->pendaftaran_ditutup : now();
                $diffInSeconds = $registrationEndDate->diffInSeconds($event->pendaftaran_dibuka);
                $randomSeconds = ($diffInSeconds > 0) ? rand(0, $diffInSeconds) : 0;
                $createdAt = $event->pendaftaran_dibuka->copy()->addSeconds($randomSeconds);

                $status = collect(['approved', 'menunggu_pembayaran', 'pembayaran_terkonfirmasi', 'rejected', 'sudah_check_in'])->random();

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

                if (in_array($status, ['approved', 'sudah_check_in', 'pembayaran_terkonfirmasi', 'menunggu_konfirmasi_pembayaran'])) {
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

        foreach (array_chunk($registrations, 200) as $chunk) {
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
