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
        // Menambahkan kolom ke tabel profil UMKM
        Schema::table('umkm_profiles', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('status');
        });

        // Menambahkan kolom ke tabel profil Penyelenggara
        Schema::table('penyelenggara_profiles', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('status');
        });

        // Menambahkan kolom ke tabel events (untuk penolakan proposal)
        Schema::table('events', function (Blueprint $table) {
            // INI BAGIAN YANG DIPERBAIKI
            $table->text('rejection_reason')->nullable()->after('status_proposal');
        });

        // Menambahkan kolom ke tabel pendaftaran event (untuk penolakan pembayaran)
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_profiles', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });

        Schema::table('penyelenggara_profiles', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
    }
};
