<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Client;
use App\Models\Setting;

class FlagExpiredClients extends Command
{
    protected $signature = 'clients:flag-expired';
    protected $description = 'Flag client accounts inactive for over 1 year';

    public function handle(): void
    {
        $days = (int) (Setting::where('key', 'expiration_days')->value('value') ?? 365);
        $cutoff = now()->subDays($days);

        $count = Client::where('is_expired', false)
            ->where('last_activity_at', '<', $cutoff)
            ->update(['is_expired' => true]);

        $this->info("Flagged {$count} expired client(s).");
    }
}
