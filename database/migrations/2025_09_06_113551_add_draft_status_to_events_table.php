<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menambahkan 'draft' ke dalam daftar ENUM untuk kolom status_proposal
        DB::statement("ALTER TABLE events MODIFY COLUMN status_proposal ENUM('draft', 'menunggu_persetujuan', 'disetujui', 'ditolak') NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Mengembalikan daftar ENUM ke kondisi semula jika migrasi di-rollback
        DB::statement("ALTER TABLE events MODIFY COLUMN status_proposal ENUM('menunggu_persetujuan', 'disetujui', 'ditolak') NOT NULL DEFAULT 'menunggu_persetujuan'");
    }
};
