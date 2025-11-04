<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\UpdateEventStatusCommand;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


/*
|--------------------------------------------------------------------------
| Command Scheduling
|--------------------------------------------------------------------------
|
| Di sinilah Anda mendaftarkan tugas-tugas (commands) yang akan dijalankan
| secara otomatis oleh Laravel.
|
*/

// 2. Ganti 'events:update-status' dengan class command yang benar
//    dan ubah dari daily() (sekali sehari) menjadi hourly() (setiap jam)
//    agar status lebih cepat ter-update.
Schedule::command(UpdateEventStatusCommand::class)->hourly();
