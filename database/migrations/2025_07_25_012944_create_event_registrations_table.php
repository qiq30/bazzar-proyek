<?php
// database/migrations/xxxx_xx_xx_create_event_registrations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('umkm_profile_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['registered', 'approved', 'rejected'])->default('registered');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Prevent duplicate registrations
            $table->unique(['event_id', 'umkm_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
