<?php
// File: app/Console/Commands/UpdateEventStatusCommand.php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateEventStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-event-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update event statuses based on current time (upcoming, registration_open, registration_closed, ongoing, finished)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting event status update using mass queries...');

        $now = now();
        $totalUpdated = 0;

        // Kita jalankan kueri ini secara berurutan.
        // Urutan penting agar status event "mengalir" dengan benar dalam satu kali run.

        // 1. Event yang sedang berlangsung (active) -> finished
        // Cek event 'active' yang tanggal selesainya sudah lewat.
        $updated = Event::where('status', 'active')
            ->where('tanggal_selesai_acara', '<', $now)
            ->update(['status' => 'finished']);
        if ($updated > 0) {
            $this->line("{$updated} events updated from 'active' to 'finished'.");
            $totalUpdated += $updated;
        }

        // 2. Event yang registrasinya terbuka/tertutup -> active (sedang berlangsung)
        // Cek event yang (masih 'registration_open' atau 'registration_closed') 
        // namun tanggal mulai acaranya sudah tiba.
        $updated = Event::whereIn('status', ['registration_open', 'registration_closed'])
            ->where('tanggal_mulai_acara', '<=', $now)
            // Pastikan tidak mengubah yang seharusnya sudah 'finished' (jika tanggal selesai juga lewat)
            ->where('tanggal_selesai_acara', '>', $now)
            ->update(['status' => 'active']);
        if ($updated > 0) {
            $this->line("{$updated} events updated to 'active' (ongoing).");
            $totalUpdated += $updated;
        }

        // 3. Event yang 'upcoming' (tanpa registrasi) -> 'active'
        // Event yang 'upcoming' TAPI tidak punya jadwal registrasi,
        // akan langsung 'active' jika tanggal mulai acaranya tiba.
        $updated = Event::where('status', 'upcoming')
            ->whereNull('registration_start') // Tidak ada jadwal registrasi
            ->where('tanggal_mulai_acara', '<=', $now)
            ->where('tanggal_selesai_acara', '>', $now)
            ->update(['status' => 'active']);
        if ($updated > 0) {
            $this->line("{$updated} 'upcoming' events (no registration) updated to 'active'.");
            $totalUpdated += $updated;
        }

        // 4. Event 'registration_open' -> 'registration_closed'
        // Cek event yang 'registration_open' dan tanggal akhir registrasinya sudah lewat.
        $updated = Event::where('status', 'registration_open')
            ->whereNotNull('registration_end')
            ->where('registration_end', '<', $now)
            ->update(['status' => 'registration_closed']);
        if ($updated > 0) {
            $this->line("{$updated} events updated from 'registration_open' to 'registration_closed'.");
            $totalUpdated += $updated;
        }

        // 5. Event 'upcoming' -> 'registration_open'
        // Cek event 'upcoming' yang tanggal mulai registrasinya sudah tiba.
        $updated = Event::where('status', 'upcoming')
            ->whereNotNull('registration_start')
            ->where('registration_start', '<=', $now)
            // Pastikan registrasi belum ditutup (jika tanggal mulai dan selesai sama)
            ->where(function ($query) use ($now) {
                $query->whereNull('registration_end')
                    ->orWhere('registration_end', '>', $now);
            })
            ->update(['status' => 'registration_open']);
        if ($updated > 0) {
            $this->line("{$updated} 'upcoming' events updated to 'registration_open'.");
            $totalUpdated += $updated;
        }

        // 6. (Pembersihan) 'upcoming' -> 'registration_closed'
        // Kasus langka: Event 'upcoming' yang tanggal mulai DAN akhir registrasinya sudah lewat
        // tapi tanggal acaranya belum mulai.
        $updated = Event::where('status', 'upcoming')
            ->whereNotNull('registration_end')
            ->where('registration_end', '<', $now)
            ->where('tanggal_mulai_acara', '>', $now)
            ->update(['status' => 'registration_closed']);
        if ($updated > 0) {
            $this->line("{$updated} 'upcoming' events (missed window) updated to 'registration_closed'.");
            $totalUpdated += $updated;
        }


        $this->info("Event status update complete. {$totalUpdated} total events updated via mass query.");
        Log::info("Scheduled Task: Event status update complete. {$totalUpdated} total events updated.");
    }
}
