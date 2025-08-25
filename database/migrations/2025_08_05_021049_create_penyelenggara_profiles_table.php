<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_penyelenggara_profiles_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penyelenggara_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('organizer_name');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('verification_document_path'); // e.g., KTP or business license
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penyelenggara_profiles');
    }
};
