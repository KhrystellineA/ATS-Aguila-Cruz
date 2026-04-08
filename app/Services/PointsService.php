<?php

namespace App\Services;

use App\Models\Client;
use App\Models\PointsTransaction;
use App\Models\AuditLog;

class PointsService
{
    public function award(Client $client, int $points, string $description): void
    {
        $client->increment('total_points', $points);
        $client->increment('points_earned', $points);
        $client->update([
            'last_activity_at' => now(),
            'is_expired' => false,
        ]);

        PointsTransaction::create([
            'client_id' => $client->id,
            'points' => $points,
            'type' => 'earned',
            'description' => $description,
        ]);
    }

    public function deduct(Client $client, int $points, string $description): void
    {
        $client->decrement('total_points', $points);
        $client->increment('points_redeemed', $points);
        $client->update(['last_activity_at' => now()]);

        PointsTransaction::create([
            'client_id' => $client->id,
            'points' => -$points,
            'type' => 'redeemed',
            'description' => $description,
        ]);
    }

    public function adjust(Client $client, int $points, string $reason, int $adminId): void
    {
        $client->increment('total_points', $points);

        PointsTransaction::create([
            'client_id' => $client->id,
            'points' => $points,
            'type' => 'adjustment',
            'description' => $reason,
        ]);

        AuditLog::create([
            'admin_user_id' => $adminId,
            'action' => 'points_adjustment',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => [
                'points' => $points,
                'reason' => $reason,
            ],
        ]);
    }
}