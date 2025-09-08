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
    // Konfigurasi jumlah data yang akan di-generate (sudah diperkecil)
    private const JUMLAH_UMKM_BARU = 25; // Dari 250 menjadi 25

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Menyiapkan data seeder skala kecil...');

        // =================================================================
        // == 1. DATA PENYELENGGARA (EVENT ORGANIZER) - DIPERDIKIT
        // =================================================================
        $this->command->info('1. Membuat data Penyelenggara (diperkecil)...');
        $eoList = [
            ['Banjarmasin Kreatif', 'eo.kreatif@example.com', 'verified', 'logo_eo_1.png', 'Jl. Pahlawan No. 12', 'Penyelenggara event terkemuka.'],
            ['Dinas Koperasi & UMKM', 'dinas.kop@example.com', 'pending', null, 'Jl. Gatot Subroto No. 8', 'Lembaga pemerintah.'],
            ['EO Maju Jaya', 'eo.maju@example.com', 'rejected', null, 'Jl. Pramuka No. 45', 'Event organizer yang ditolak.'],
            ['Borneo Expo Center', 'borneo.expo@example.com', 'verified', 'logo_eo_2.png', 'Jl. A. Yani Km. 5', 'Spesialis pameran dan expo.'],
            ['Kalsel Event Management', 'kalsel.em@example.com', 'verified', null, 'Jl. Lambung Mangkurat No. 21', 'Manajemen event profesional.'],
        ];

        $penyelenggaraProfiles = collect($eoList)->map(function ($eo) {
            $user = User::create(['name' => $eo[0], 'email' => $eo[1], 'password' => Hash::make('password'), 'is_penyelenggara' => true, 'email_verified_at' => now(), 'created_at' => Carbon::now()->subMonths(rand(0, 12))]);
            return PenyelenggaraProfile::create(['user_id' => $user->id, 'organizer_name' => $eo[0], 'description' => $eo[5], 'address' => $eo[4], 'verification_document_path' => 'seeders/doc_placeholder.jpg', 'logo_path' => $eo[3] ? "seeders/{$eo[3]}" : null, 'status' => $eo[2]]);
        });
        $allVerifiedEOs = $penyelenggaraProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 2. DATA UMKM (SKALA KECIL & PROSEDURAL)
        // =================================================================
        $this->command->info('2. Membuat data UMKM (' . self::JUMLAH_UMKM_BARU . ' UMKM secara prosedural)...');
        $namaDepan = ['Warung', 'Kedai', 'Toko', 'Lapak', 'Dapur'];
        $namaTengah = ['Mama', 'Abah', 'Berkah', 'Jaya', 'Banua', 'Kreatif'];
        $namaBelakang = ['99', 'BJM', 'Sentosa', 'Food', 'Craft'];
        $kategoriList = ['Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Agribisnis'];

        $umkmProfiles = collect();
        for ($i = 0; $i < self::JUMLAH_UMKM_BARU; $i++) {
            $namaBisnis = collect($namaDepan)->random() . ' ' . collect($namaTengah)->random() . ' ' . collect($namaBelakang)->random();
            $kategori = collect($kategoriList)->random();
            $status = ['verified', 'verified', 'verified', 'pending', 'rejected'][rand(0, 4)];

            $user = User::create([
                'name' => 'Pemilik ' . $namaBisnis,
                'email' => Str::slug($namaBisnis) . '-' . $i . '@example.com',
                'password' => Hash::make('password'),
                'is_penyelenggara' => false,
                'email_verified_at' => now(),
                'created_at' => Carbon::now()->subMonths(rand(0, 24)),
            ]);

            $umkmProfiles->push(UmkmProfile::create([
                'user_id' => $user->id,
                'business_name' => $namaBisnis,
                'description' => "UMKM {$namaBisnis} menyediakan produk dan layanan berkualitas di bidang {$kategori}.",
                'address' => 'Jl. ' . collect(['Belitung', 'Veteran', 'A. Yani'])->random() . ' No. ' . rand(1, 300),
                'business_type' => $kategori,
                'ktp_path' => 'seeders/ktp_placeholder.jpg',
                'logo_path' => (rand(0, 2) == 1) ? 'seeders/logo_umkm_' . rand(1, 3) . '.png' : null,
                'qris_path' => (rand(0, 1) == 1) ? 'seeders/qris_placeholder.png' : null,
                'status' => $status,
            ]));
        }
        $umkmVerified = $umkmProfiles->where('status', 'verified')->values();

        // =================================================================
        // == 3. DATA PRODUK (SKALA KECIL) - DIPERDIKIT
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
        // == 4. DATA EVENT - DIPERDIKIT
        // =================================================================
        $this->command->info('4. Membuat data Event (diperkecil)...');
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
            'Semarak Tahun Baru di Siring 0 KM'
        ];

        foreach ($eventNames as $index => $eventName) {
            $eo = $allVerifiedEOs->random();

            if ($index % 7 == 0) { // Skenario Draft
                Event::create([
                    'user_id' => $eo->user_id,
                    'status_proposal' => 'draft',
                    'nama_event' => $eventName . ' (Konsep Awal)',
                    'deskripsi_event' => 'Deskripsi akan diisi.',
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

            if ($index % 7 == 1) { // Skenario Menunggu Persetujuan
                Event::create([
                    'user_id' => $eo->user_id,
                    'nama_event' => $eventName,
                    'deskripsi_event' => "Proposal lengkap untuk event '{$eventName}'.",
                    'lokasi_event' => collect(['Siring 0 KM', 'Taman Kamboja'])->random(),
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

            $status = ['active', 'upcoming', 'upcoming', 'finished', 'finished'][rand(0, 4)];
            $eventData = [
                'user_id' => $eo->user_id,
                'nama_event' => $eventName,
                'deskripsi_event' => "Event meriah untuk para UMKM dan masyarakat Banjarmasin.",
                'poster_event' => 'seeders/poster_event_' . rand(1, 4) . '.jpg',
                'lokasi_event' => collect(['Siring 0 KM', 'Taman Kamboja', 'Duta Mall'])->random(),
                'biaya_pendaftaran_umkm' => (rand(0, 3) == 0) ? 0 : rand(5, 25) * 10000,
                'kuota_umkm' => rand(30, 100),
                'nama_bank_penyelenggara' => ['Bank Kalsel', 'BRI', 'BCA'][rand(0, 2)],
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
            EventRegistration::insert($chunk);
        }

        $this->command->info('🎉 SEEDER SKALA KECIL BERHASIL DIJALANKAN! 🎉');
        $this->command->info('📊 RINGKASAN DATA:');
        $this->command->info('- Penyelenggara: ' . PenyelenggaraProfile::count());
        $this->command->info('- UMKM: ' . UmkmProfile::count());
        $this->command->info('- Produk: ' . Product::count());
        $this->command->info('- Event: ' . Event::count());
        $this->command->info('- Registrasi Event: ' . EventRegistration::count());
        $this->command->info('✅ Data siap untuk development dan testing ringan.');
    }
}
