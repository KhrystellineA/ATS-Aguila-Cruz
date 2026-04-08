<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\PointRule;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user (single admin — no role column needed)
        User::firstOrCreate(
            ['email' => 'ian@tats.com'],
            [
                'name' => 'Ian Monteza',
                'password' => Hash::make('change-me-in-prod'),
            ]
        );

        // Default point rules
        foreach (['minimalist'=>50, 'medium'=>100, 'big'=>250] as $size => $pts) {
            PointRule::create([
                'tattoo_size' => $size,
                'points_awarded' => $pts,
            ]);
        }

        // Default settings
        Setting::create(['key' => 'expiration_days', 'value' => '365']);
        Setting::create(['key' => 'notifications_enabled', 'value' => 'true']);
    }
}