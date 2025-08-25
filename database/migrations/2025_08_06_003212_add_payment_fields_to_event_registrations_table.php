<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Ubah enum status untuk mengakomodasi alur pembayaran baru
            $table->string('status')->default('menunggu_pembayaran')->change();

            // Tambahkan kolom baru untuk detail pembayaran
            $table->decimal('total_bayar', 15, 2)->nullable()->after('notes');
            $table->integer('kode_unik')->nullable()->after('total_bayar');
            $table->string('bukti_pembayaran_path')->nullable()->after('kode_unik');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn(['total_bayar', 'kode_unik', 'bukti_pembayaran_path']);

            // Kembalikan enum status ke kondisi semula jika diperlukan
            $table->enum('status', ['registered', 'approved', 'rejected'])->default('registered')->change();
        });
    }
};
