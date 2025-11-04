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

        $updated = Event::where('status', 'active')
            ->where('tanggal_selesai_acara', '<', $now)
            ->update(['status' => 'finished']);
        if ($updated > 0) {
            $this->line("{$updated} events updated from 'active' to 'finished'.");
            $totalUpdated += $updated;
        }

        $updated = Event::whereIn('status', ['registration_open', 'registration_closed'])
            ->where('tanggal_mulai_acara', '<=', $now)
            // Pastikan tidak mengubah yang seharusnya sudah 'finished' (jika tanggal selesai juga lewat)
            ->where('tanggal_selesai_acara', '>', $now)
            ->update(['status' => 'active']);
        if ($updated > 0) {
            $this->line("{$updated} events updated to 'active' (ongoing).");
            $totalUpdated += $updated;
        }

        $updated = Event::where('status', 'upcoming')
            ->whereNull('pendaftaran_dibuka')
            ->where('tanggal_mulai_acara', '<=', $now)
            ->where('tanggal_selesai_acara', '>', $now)
            ->update(['status' => 'active']);
        if ($updated > 0) {
            $this->line("{$updated} 'upcoming' events (no registration) updated to 'active'.");
            $totalUpdated += $updated;
        }

        $updated = Event::where('status', 'registration_open')
            ->whereNotNull('pendaftaran_ditutup')
            ->where('pendaftaran_ditutup', '<', $now)
            ->update(['status' => 'registration_closed']);
        if ($updated > 0) {
            $this->line("{$updated} events updated from 'registration_open' to 'registration_closed'.");
            $totalUpdated += $updated;
        }

        $updated = Event::where('status', 'upcoming')
            ->whereNotNull('pendaftaran_dibuka')
            ->where('pendaftaran_dibuka', '<=', $now)
            // Pastikan registrasi belum ditutup (jika tanggal mulai dan selesai sama)
            ->where(function ($query) use ($now) {
                $query->whereNull('pendaftaran_ditutup')
                    ->orWhere('pendaftaran_ditutup', '>', $now);
            })
            ->update(['status' => 'registration_open']);
        if ($updated > 0) {
            $this->line("{$updated} 'upcoming' events updated to 'registration_open'.");
            $totalUpdated += $updated;
        }

        $updated = Event::where('status', 'upcoming')
            ->whereNotNull('pendaftaran_ditutup')
            ->where('pendaftaran_ditutup', '<', $now)
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
