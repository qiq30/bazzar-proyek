<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // database/migrations/xxxx_xx_xx_xxxxxx_add_panitia_pin_to_events_table.php
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('panitia_pin', 6)->nullable()->unique()->after('status');
        });
    }
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('panitia_pin');
        });
    }
};
