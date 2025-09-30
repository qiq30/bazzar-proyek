<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use Carbon\Carbon;

class UpdateEventStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the status of events based on their dates';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting to update event statuses...');

        $now = Carbon::now()->toDateString();

        // Ambil semua event yang belum selesai (untuk efisiensi)
        $events = Event::where('status', '!=', 'finished')->get();

        foreach ($events as $event) {
            $newStatus = '';

            // Tentukan status baru berdasarkan tanggal
            if ($event->tanggal_selesai_acara < $now) {
                $newStatus = 'finished';
            } elseif ($event->tanggal_mulai_acara <= $now && $event->tanggal_selesai_acara >= $now) {
                $newStatus = 'active';
            } elseif ($event->tanggal_mulai_acara > $now) {
                $newStatus = 'upcoming';
            }

            // Jika status yang seharusnya berbeda dengan yang ada di DB, update
            if ($newStatus && $event->status !== $newStatus) {
                $event->status = $newStatus;
                $event->save();
                $this->line("Event '{$event->nama_event}' updated to '{$newStatus}'.");
            }
        }

        $this->info('Event status update completed successfully.');
        return 0;
    }
}
