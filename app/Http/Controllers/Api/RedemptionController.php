<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Redemption;
use App\Models\Reward;
use App\Models\Client;
use App\Services\PointsService;
use App\Models\AuditLog;
use App\Notifications\RedemptionApproved;
use App\Notifications\RedemptionRejected;
use Illuminate\Http\Request;

class RedemptionController extends Controller
{
    public function index()
    {
        $redemptions = Redemption::with(['client', 'reward'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($redemptions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'reward_id' => 'required|exists:rewards,id',
            'contact_info' => 'required|array',
            'contact_info.email' => 'sometimes|email',
            'contact_info.phone' => 'sometimes|string',
        ]);

        $client = Client::find($data['client_id']);
        $reward = Reward::find($data['reward_id']);

        if ($client->total_points < $reward->points_required) {
            return response()->json(['message' => 'Insufficient points'], 422);
        }

        $redemption = Redemption::create([
            'client_id' => $data['client_id'],
            'reward_id' => $data['reward_id'],
            'points_used' => $reward->points_required,
            'contact_info' => $data['contact_info'],
            'status' => 'pending',
        ]);

        return response()->json($redemption, 201);
    }

    public function show(Redemption $redemption)
    {
        return response()->json($redemption->load(['client', 'reward']));
    }

    public function update(Request $request, Redemption $redemption)
    {
        $data = $request->validate([
            'status' => 'sometimes|required|in:pending,approved,rejected,used',
        ]);

        $redemption->update($data);

        return response()->json($redemption->load(['client', 'reward']));
    }

    public function destroy(Redemption $redemption)
    {
        $redemption->delete();

        return response()->json(['message' => 'Redemption deleted']);
    }

    public function approve(Request $request, Redemption $redemption)
    {
        if ($redemption->status !== 'pending') {
            return response()->json(['message' => 'Only pending redemptions can be approved'], 422);
        }

        $client = $redemption->client;
        $reward = $redemption->reward;

        // Deduct points
        $pointsService = app(PointsService::class);
        $pointsService->deduct($client, $reward->points_required, 'Redemption: '.$reward->name);

        // Update redemption
        $redemption->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'redemption_approved',
            'target_type' => 'Redemption',
            'target_id' => $redemption->id,
            'payload' => [
                'client_id' => $client->id,
                'reward_id' => $reward->id,
                'points_used' => $reward->points_required,
            ],
        ]);

        // Send notification
        if ($client->email) {
            $client->notify(new RedemptionApproved($client, $redemption));
        }

        return response()->json($redemption->load(['client', 'reward']));
    }

    public function reject(Request $request, Redemption $redemption)
    {
        if ($redemption->status !== 'pending') {
            return response()->json(['message' => 'Only pending redemptions can be rejected'], 422);
        }

        $redemption->update([
            'status' => 'rejected',
        ]);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'redemption_rejected',
            'target_type' => 'Redemption',
            'target_id' => $redemption->id,
            'payload' => [
                'client_id' => $redemption->client_id,
                'reward_id' => $redemption->reward_id,
            ],
        ]);

        // Send notification
        if ($redemption->client->email) {
            $redemption->client->notify(new RedemptionRejected($redemption->client, $redemption));
        }

        return response()->json($redemption->load(['client', 'reward']));
    }

    public function markUsed(Request $request, Redemption $redemption)
    {
        if ($redemption->status !== 'approved') {
            return response()->json(['message' => 'Only approved redemptions can be marked as used'], 422);
        }

        $redemption->update([
            'status' => 'used',
            'used_at' => now(),
        ]);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'redemption_marked_used',
            'target_type' => 'Redemption',
            'target_id' => $redemption->id,
            'payload' => [
                'client_id' => $redemption->client_id,
                'reward_id' => $redemption->reward_id,
            ],
        ]);

        return response()->json($redemption->load(['client', 'reward']));
    }
}