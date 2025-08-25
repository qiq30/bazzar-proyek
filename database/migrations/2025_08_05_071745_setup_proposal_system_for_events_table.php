<?php
// database/migrations/2025_08_05_071745_setup_proposal_system_for_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Jalankan perintah yang sudah ada dari migrasi sebelumnya agar tidak konflik
        if (!Schema::hasColumn('events', 'user_id')) {
            Schema::table('events', function (Blueprint $table) {
                $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
            });
        }

        // Tambahkan kolom-kolom baru yang diperlukan untuk proposal
        Schema::table('events', function (Blueprint $table) {
            $table->string('poster_event')->after('description')->nullable();
            $table->string('nama_bank_penyelenggara')->after('max_participants')->nullable();
            $table->string('nomor_rekening_penyelenggara')->after('nama_bank_penyelenggara')->nullable();
            $table->string('nama_pemilik_rekening')->after('nomor_rekening_penyelenggara')->nullable();
            $table->enum('status_proposal', ['menunggu_persetujuan', 'disetujui', 'ditolak'])
                ->default('menunggu_persetujuan')
                ->after('nama_pemilik_rekening');
            $table->string('status')->nullable()->change();
        });

        // Ganti nama kolom-kolom lama agar sesuai dengan sistem proposal
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'name')) {
                $table->renameColumn('name', 'nama_event');
            }
            if (Schema::hasColumn('events', 'description')) {
                $table->renameColumn('description', 'deskripsi_event');
            }
            if (Schema::hasColumn('events', 'start_date')) {
                $table->renameColumn('start_date', 'tanggal_mulai');
            }
            if (Schema::hasColumn('events', 'end_date')) {
                $table->renameColumn('end_date', 'tanggal_selesai');
            }
            if (Schema::hasColumn('events', 'location')) {
                $table->renameColumn('location', 'lokasi_event');
            }
            if (Schema::hasColumn('events', 'image_path')) {
                $table->renameColumn('image_path', 'biaya_pendaftaran_umkm');
            }
            if (Schema::hasColumn('events', 'max_participants')) {
                $table->renameColumn('max_participants', 'kuota_umkm');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'poster_event',
                'nama_bank_penyelenggara',
                'nomor_rekening_penyelenggara',
                'nama_pemilik_rekening',
                'status_proposal',
            ]);
            $table->string('status')->nullable(false)->change();
        });

        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('nama_event', 'name');
            $table->renameColumn('deskripsi_event', 'description');
            $table->renameColumn('tanggal_mulai', 'start_date');
            $table->renameColumn('tanggal_selesai', 'end_date');
            $table->renameColumn('lokasi_event', 'location');
            $table->renameColumn('biaya_pendaftaran_umkm', 'image_path');
            $table->renameColumn('kuota_umkm', 'max_participants');
        });
    }
};
