<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@banjarmasinkota.go.id',
            'password' => Hash::make('superadmin123#'), // Ganti dengan password yang kuat
            'is_admin' => false, // Super admin tidak dianggap admin biasa
            'is_penyelenggara' => false,
            'is_super_admin' => true,
            'email_verified_at' => now(),
        ]);
    }
}
