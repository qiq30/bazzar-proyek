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

class UltimateTestSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Menyiapkan data seeder skala besar...');

        // =================================================================
        // == PENGGUNA PENYELENGGARA (EVENT ORGANIZER)
        // =================================================================
        $this->command->info('1. Membuat data Penyelenggara...');
        $eoList = [
            ['Banjarmasin Kreatif', 'eo.kreatif@example.com', 'verified', 'logo_eo_1.png'],
            ['Dinas Koperasi & UMKM', 'dinas.kop@example.com', 'pending', null],
            ['EO Maju Jaya', 'eo.maju@example.com', 'rejected', null],
            ['Borneo Expo Center', 'borneo.expo@example.com', 'verified', 'logo_eo_2.png'],
        ];
        $penyelenggaraProfiles = collect($eoList)->map(function ($eo) {
            $user = User::create(['name' => $eo[0], 'email' => $eo[1], 'password' => Hash::make('password'), 'is_penyelenggara' => true, 'email_verified_at' => now()]);
            return PenyelenggaraProfile::create(['user_id' => $user->id, 'organizer_name' => $eo[0], 'description' => "Deskripsi untuk {$eo[0]}.", 'address' => 'Jl. Pahlawan No. ' . rand(1, 100) . ', Banjarmasin', 'verification_document_path' => 'seeders/doc_placeholder.jpg', 'logo_path' => $eo[3] ? "seeders/{$eo[3]}" : null, 'status' => $eo[2]]);
        });
        $eoVerified1 = $penyelenggaraProfiles[0];
        $eoVerified2 = $penyelenggaraProfiles[3];

        // =================================================================
        // == PENGGUNA UMKM
        // =================================================================
        $this->command->info('2. Membuat data UMKM...');
        $umkmList = [
            ['Mama Zaskia', 'zaskia.kitchen@example.com', 'Zaskia Kitchen', 'Kuliner', 'verified', 'logo_umkm_1.png', true],
            ['Rina Sasirangan', 'rina.sasirangan@example.com', 'Galeri Sasirangan Rina', 'Fashion', 'verified', 'logo_umkm_2.png', true],
            ['Ahmad Purun', 'ahmad.purun@example.com', 'Anyaman Purun Ahmad', 'Kerajinan', 'verified', null, false],
            ['Citra Minuman', 'citra.segar@example.com', 'Es Segar Citra', 'Kuliner', 'pending', 'logo_umkm_3.png', false],
            ['Budi Elektronik', 'budi.servis@example.com', 'Servis HP Kilat', 'Jasa', 'rejected', null, false],
            ['Siti Permata', 'siti.permata@example.com', 'Batu Permata Siti', 'Kerajinan', 'verified', 'logo_umkm_1.png', true],
            ['Joko Amplang', 'joko.amplang@example.com', 'Amplang Kress Joko', 'Kuliner', 'verified', null, true],
            ['Dewi Batik', 'dewi.batik@example.com', 'Batik Banjar Dewi', 'Fashion', 'pending', 'logo_umkm_2.png', false],
        ];
        $umkmProfiles = collect($umkmList)->map(function ($umkm) {
            $user = User::create(['name' => $umkm[0], 'email' => $umkm[1], 'password' => Hash::make('password'), 'is_penyelenggara' => false, 'email_verified_at' => now()]);
            return UmkmProfile::create(['user_id' => $user->id, 'business_name' => $umkm[2], 'description' => "Deskripsi lengkap untuk usaha {$umkm[2]}.", 'address' => 'Jl. Belitung No. ' . rand(1, 200) . ', Banjarmasin', 'business_type' => $umkm[3], 'ktp_path' => 'seeders/ktp_placeholder.jpg', 'logo_path' => $umkm[5] ? "seeders/{$umkm[5]}" : null, 'qris_path' => $umkm[6] ? 'seeders/qris_placeholder.png' : null, 'status' => $umkm[4]]);
        });
        $umkmVerified = $umkmProfiles->where('status', 'verified')->values();

        // =================================================================
        // == DATA PRODUK UNTUK UMKM
        // =================================================================
        $this->command->info('3. Membuat data Produk...');
        Product::insert([
            ['umkm_profile_id' => $umkmVerified[0]->id, 'name' => 'Bingka Kentang', 'price' => 25000, 'description' => 'Kue bingka lembut dengan rasa kentang asli.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[0]->id, 'name' => 'Nasi Kuning Haruan', 'price' => 18000, 'description' => 'Nasi kuning dengan lauk ikan haruan masak habang.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[1]->id, 'name' => 'Kemeja Sasirangan Pria', 'price' => 250000, 'description' => 'Bahan katun primisima, adem dan nyaman.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[1]->id, 'name' => 'Selendang Sasirangan', 'price' => 150000, 'description' => 'Cocok untuk acara formal maupun santai.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[2]->id, 'name' => 'Tas Purun Jinjing', 'price' => 75000, 'description' => 'Tas ramah lingkungan dari anyaman purun.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[3]->id, 'name' => 'Cincin Batu Kecubung', 'price' => 750000, 'description' => 'Batu asli dari Martapura.', 'created_at' => now(), 'updated_at' => now()],
            ['umkm_profile_id' => $umkmVerified[4]->id, 'name' => 'Amplang Ikan Tenggiri 250gr', 'price' => 35000, 'description' => 'Kerupuk amplang renyah dan gurih.', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // =================================================================
        // == DATA EVENT
        // =================================================================
        $this->command->info('4. Membuat data Event...');
        $activeEvent = Event::create([
            'user_id' => $eoVerified1->user_id,
            'nama_event' => 'Festival Kuliner Banua',
            'deskripsi_event' => 'Menampilkan kelezatan masakan khas Kalimantan Selatan.',
            'poster_event' => 'seeders/poster_event_1.jpg',
            'pendaftaran_dibuka' => now()->subDays(10),
            'pendaftaran_ditutup' => now()->addDays(3),
            'tanggal_mulai_acara' => now()->subDays(2),
            'tanggal_selesai_acara' => now()->addDays(2),
            'lokasi_event' => 'Taman Kamboja',
            'biaya_pendaftaran_umkm' => 100000,
            'kuota_umkm' => 15,
            'nama_bank_penyelenggara' => 'BCA',
            'nomor_rekening_penyelenggara' => '9876543210',
            'nama_pemilik_rekening' => $eoVerified1->organizer_name,
            'status_proposal' => 'disetujui',
            'status' => 'active',
            'panitia_pin' => '123456'
        ]);

        $upcomingEvent = Event::create([
            'user_id' => $eoVerified2->user_id,
            'nama_event' => 'Pameran Sasirangan & Kerajinan',
            'deskripsi_event' => 'Pameran terbesar untuk para pengrajin sasirangan.',
            'poster_event' => null,
            // --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ ---
            'pendaftaran_dibuka' => now()->addDays(5), // Pendaftaran dibuka 5 hari dari sekarang
            'pendaftaran_ditutup' => now()->addDays(20),
            'tanggal_mulai_acara' => now()->addDays(25),
            'tanggal_selesai_acara' => now()->addDays(28),
            // --- ▲▲▲ AKHIR PERBAIKAN ▲▲▲ ---
            'lokasi_event' => 'Gedung Sultan Suriansyah',
            'biaya_pendaftaran_umkm' => 200000,
            'kuota_umkm' => 4,
            'nama_bank_penyelenggara' => 'BNI',
            'nomor_rekening_penyelenggara' => '1122334455',
            'nama_pemilik_rekening' => $eoVerified2->organizer_name,
            'status_proposal' => 'disetujui',
            'status' => 'upcoming',
            'panitia_pin' => '654321'
        ]);

        $freeUpcomingEvent = Event::create([
            'user_id' => $eoVerified1->user_id,
            'nama_event' => 'Gebyar UMKM Merdeka',
            'deskripsi_event' => 'Event gratis dalam rangka perayaan hari kemerdekaan.',
            'poster_event' => 'seeders/poster_event_3.jpg',
            'pendaftaran_dibuka' => now()->subDays(5),
            'pendaftaran_ditutup' => now()->addDays(10),
            'tanggal_mulai_acara' => now()->addDays(15),
            'tanggal_selesai_acara' => now()->addDays(17),
            'lokasi_event' => 'Siring 0 KM Banjarmasin',
            'biaya_pendaftaran_umkm' => 0,
            'kuota_umkm' => 100,
            'nama_bank_penyelenggara' => 'Bank Kalsel',
            'nomor_rekening_penyelenggara' => '001234567890',
            'nama_pemilik_rekening' => $eoVerified1->organizer_name,
            'status_proposal' => 'disetujui',
            'status' => 'upcoming',
            'panitia_pin' => '778899'
        ]);

        $finishedEvent = Event::create([
            'user_id' => $eoVerified2->user_id,
            'nama_event' => 'Bazar Buku & Hobi Lawas',
            'deskripsi_event' => 'Event untuk para pecinta buku, komik, dan hobi.',
            'poster_event' => 'seeders/poster_event_4.jpg',
            'pendaftaran_dibuka' => now()->subDays(40),
            'pendaftaran_ditutup' => now()->subDays(31),
            'tanggal_mulai_acara' => now()->subDays(30),
            'tanggal_selesai_acara' => now()->subDays(28),
            'lokasi_event' => 'Aula Kayuh Baimbai',
            'biaya_pendaftaran_umkm' => 50000,
            'kuota_umkm' => 25,
            'nama_bank_penyelenggara' => 'BNI',
            'nomor_rekening_penyelenggara' => '1122334455',
            'nama_pemilik_rekening' => $eoVerified2->organizer_name,
            'status_proposal' => 'disetujui',
            'status' => 'finished',
            'panitia_pin' => '112233'
        ]);

        Event::create([
            'user_id' => $eoVerified1->user_id,
            'nama_event' => 'Banjarmasin Coffee Week 2025',
            'deskripsi_event' => 'Festival kopi terbesar di Banjarmasin.',
            'poster_event' => null,
            'pendaftaran_dibuka' => now()->addDays(10),
            'pendaftaran_ditutup' => now()->addDays(35),
            'tanggal_mulai_acara' => now()->addDays(40),
            'tanggal_selesai_acara' => now()->addDays(42),
            'lokasi_event' => 'Duta Mall Banjarmasin',
            'biaya_pendaftaran_umkm' => 250000,
            'kuota_umkm' => 30,
            'nama_bank_penyelenggara' => 'Bank Mandiri',
            'nomor_rekening_penyelenggara' => '1234567890123',
            'nama_pemilik_rekening' => $eoVerified1->organizer_name,
            'status_proposal' => 'menunggu_persetujuan',
            'status' => null
        ]);

        $rejectedProposal = Event::create([
            'user_id' => $eoVerified2->user_id,
            'nama_event' => 'Festival Musik Indie',
            'deskripsi_event' => 'Acara musik indie lokal.',
            'poster_event' => 'seeders/poster_event_2.jpg',
            'pendaftaran_dibuka' => now()->addDays(20),
            'pendaftaran_ditutup' => now()->addDays(45),
            'tanggal_mulai_acara' => now()->addDays(50),
            'tanggal_selesai_acara' => now()->addDays(50),
            'lokasi_event' => 'Gedung Pemuda',
            'biaya_pendaftaran_umkm' => 500000,
            'kuota_umkm' => 10,
            'nama_bank_penyelenggara' => 'BNI',
            'nomor_rekening_penyelenggara' => '1122334455',
            'nama_pemilik_rekening' => $eoVerified2->organizer_name,
            'status_proposal' => 'ditolak',
            'rejection_reason' => 'Tema acara tidak sesuai dengan fokus platform UMKM.',
            'status' => null
        ]);
        $rejectedProposal->delete();


        // =================================================================
        // == DATA PENDAFTARAN EVENT
        // =================================================================
        $this->command->info('5. Membuat data Pendaftaran Event...');

        // --- Skenario untuk Event Aktif: "Festival Kuliner Banua"
        EventRegistration::create(['event_id' => $activeEvent->id, 'umkm_profile_id' => $umkmVerified[0]->id, 'status' => 'sudah_check_in', 'kode_pendaftaran' => 'BZREVT' . $activeEvent->id . '-A1B2C', 'bukti_pembayaran_path' => 'seeders/bukti_bayar_valid.jpg', 'nomor_stand' => 'A01', 'kode_pin' => '111222', 'payment_due' => now()]);
        EventRegistration::create(['event_id' => $activeEvent->id, 'umkm_profile_id' => $umkmVerified[4]->id, 'status' => 'approved', 'kode_pendaftaran' => 'BZREVT' . $activeEvent->id . '-D3E4F', 'bukti_pembayaran_path' => 'seeders/bukti_bayar_valid.jpg', 'nomor_stand' => 'A02', 'kode_pin' => '222333', 'payment_due' => now()]);
        EventRegistration::create(['event_id' => $activeEvent->id, 'umkm_profile_id' => $umkmVerified[1]->id, 'status' => 'menunggu_pembayaran', 'kode_pendaftaran' => 'BZREVT' . $activeEvent->id . '-X1Y2Z', 'payment_due' => now()->addMinutes(45)]);


        // --- Skenario untuk Event Akan Datang (Kuota Sedikit): "Pameran Sasirangan"
        // Tidak ada pendaftaran karena pendaftarannya belum dibuka

        // --- Skenario untuk Event GRATIS
        EventRegistration::create(['event_id' => $freeUpcomingEvent->id, 'umkm_profile_id' => $umkmVerified[0]->id, 'status' => 'approved', 'kode_pendaftaran' => 'BZREVT' . $freeUpcomingEvent->id . '-T3U4V', 'nomor_stand' => 'M01', 'kode_pin' => '555666', 'payment_due' => now()]);
        EventRegistration::create(['event_id' => $freeUpcomingEvent->id, 'umkm_profile_id' => $umkmVerified[1]->id, 'status' => 'approved', 'kode_pendaftaran' => 'BZREVT' . $freeUpcomingEvent->id . '-W5X6Y', 'nomor_stand' => 'M02', 'kode_pin' => '666777', 'payment_due' => now()]);
        EventRegistration::create(['event_id' => $freeUpcomingEvent->id, 'umkm_profile_id' => $umkmVerified[4]->id, 'status' => 'rejected', 'kode_pendaftaran' => 'BZREVT' . $freeUpcomingEvent->id . '-Z7A8B', 'rejection_reason' => 'Produk tidak sesuai tema acara.', 'payment_due' => now()]);


        // --- Skenario untuk Event Selesai
        EventRegistration::create(['event_id' => $finishedEvent->id, 'umkm_profile_id' => $umkmVerified[2]->id, 'status' => 'sudah_check_in', 'kode_pendaftaran' => 'BZREVT' . $finishedEvent->id . '-C9D0E', 'bukti_pembayaran_path' => 'seeders/bukti_bayar_valid.jpg', 'nomor_stand' => 'H01', 'kode_pin' => '888999', 'payment_due' => now()]);
        EventRegistration::create(['event_id' => $finishedEvent->id, 'umkm_profile_id' => $umkmVerified[3]->id, 'status' => 'sudah_check_in', 'kode_pendaftaran' => 'BZREVT' . $finishedEvent->id . '-F1G2H', 'bukti_pembayaran_path' => 'seeders/bukti_bayar_valid.jpg', 'nomor_stand' => 'H02', 'kode_pin' => '999000', 'payment_due' => now()]);

        $this->command->info('Seeder skala besar berhasil dijalankan!');
    }
}
