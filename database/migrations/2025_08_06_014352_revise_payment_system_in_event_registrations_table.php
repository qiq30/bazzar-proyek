<?php
// database/migrations/xxxx_xx_xx_xxxxxx_revise_payment_system_in_event_registrations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Hapus kolom-kolom lama yang tidak digunakan lagi
            $table->dropColumn(['total_bayar', 'kode_unik']);

            // Tambahkan kolom baru untuk kode pendaftaran yang unik
            $table->string('kode_pendaftaran')->unique()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Kembalikan kolom lama jika migrasi di-rollback
            $table->decimal('total_bayar', 15, 2)->nullable();
            $table->integer('kode_unik')->nullable();

            // Hapus kolom baru
            $table->dropColumn('kode_pendaftaran');
        });
    }
};
