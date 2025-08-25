<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Tambahkan kolom baru untuk data E-Ticket
            $table->string('nomor_stand')->nullable()->after('kode_pendaftaran');
            $table->string('kode_pin', 6)->nullable()->after('nomor_stand');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn(['nomor_stand', 'kode_pin']);
        });
    }
};
