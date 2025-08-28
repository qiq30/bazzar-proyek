<?php

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
        Schema::table('events', function (Blueprint $table) {
            // 1. Ganti nama kolom tanggal yang sudah ada
            $table->renameColumn('tanggal_mulai', 'tanggal_mulai_acara');
            $table->renameColumn('tanggal_selesai', 'tanggal_selesai_acara');

            // 2. Tambahkan kolom baru untuk jadwal pendaftaran
            $table->date('pendaftaran_dibuka')->nullable()->after('poster_event');
            $table->date('pendaftaran_ditutup')->nullable()->after('pendaftaran_dibuka');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Kembalikan nama kolom ke semula jika migrasi di-rollback
            $table->renameColumn('tanggal_mulai_acara', 'tanggal_mulai');
            $table->renameColumn('tanggal_selesai_acara', 'tanggal_selesai');

            // Hapus kolom yang baru ditambahkan
            $table->dropColumn(['pendaftaran_dibuka', 'pendaftaran_ditutup']);
        });
    }
};
