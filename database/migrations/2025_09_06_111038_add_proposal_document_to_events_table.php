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
            // Kolom untuk menyimpan path file proposal PDF
            $table->string('proposal_document_path')->nullable()->after('poster_event');

            // Kolom status untuk verifikasi dokumen tahap 1
            // 'pending_document_verification', 'document_approved', 'document_rejected'
            $table->string('document_verification_status')->default('pending_document_verification')->after('status_proposal');

            // Kolom alasan penolakan khusus untuk dokumen
            $table->text('document_rejection_reason')->nullable()->after('rejection_reason');

            // Membuat beberapa kolom yang ada menjadi nullable untuk mengakomodasi alur wizard
            $table->string('deskripsi_event')->nullable()->change();
            $table->date('pendaftaran_dibuka')->nullable()->change();
            $table->date('pendaftaran_ditutup')->nullable()->change();
            $table->date('tanggal_mulai_acara')->nullable()->change();
            $table->date('tanggal_selesai_acara')->nullable()->change();
            $table->string('lokasi_event')->nullable()->change();
            $table->decimal('biaya_pendaftaran_umkm', 15, 2)->nullable()->change();
            $table->integer('kuota_umkm')->nullable()->change();
            $table->string('nama_bank_penyelenggara')->nullable()->change();
            $table->string('nomor_rekening_penyelenggara')->nullable()->change();
            $table->string('nama_pemilik_rekening')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('proposal_document_path');
            $table->dropColumn('document_verification_status');
            $table->dropColumn('document_rejection_reason');

            // Mengembalikan kolom ke kondisi semula (jika diperlukan)
            $table->text('deskripsi_event')->nullable(false)->change();
            $table->date('pendaftaran_dibuka')->nullable(false)->change();
            $table->date('pendaftaran_ditutup')->nullable(false)->change();
            $table->date('tanggal_mulai_acara')->nullable(false)->change();
            $table->date('tanggal_selesai_acara')->nullable(false)->change();
            $table->string('lokasi_event')->nullable(false)->change();
            $table->decimal('biaya_pendaftaran_umkm', 15, 2)->nullable(false)->change();
            $table->integer('kuota_umkm')->nullable(false)->change();
            $table->string('nama_bank_penyelenggara')->nullable(false)->change();
            $table->string('nomor_rekening_penyelenggara')->nullable(false)->change();
            $table->string('nama_pemilik_rekening')->nullable(false)->change();
        });
    }
};
