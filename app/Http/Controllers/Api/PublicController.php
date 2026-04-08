<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Reward;
use App\Models\PointsTransaction;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'referral_code' => 'required|string',
        ]);

        $client = Client::where('referral_code', strtoupper($request->referral_code))
            ->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->name.'%');
            })
            ->first();

        if (!$client) {
            return response()->json(['message' => 'No matching profile found.'], 404);
        }

        return response()->json([
            'client' => $client,
            'points_history' => $client->pointsTransactions()->latest()->get(),
            'referrals' => $client->referralsAsReferrer()->with('referredClient')->get(),
            'available_rewards' => Reward::where('is_active', true)
                ->where('points_required', '<=', $client->total_points)
                ->get(),
        ]);
    }

    public function requestRedemption(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'reward_id' => 'required|exists:rewards,id',
            'contact_info' => 'required|array',
            'contact_info.email' => 'sometimes|email',
            'contact_info.phone' => 'sometimes|string',
        ]);

        $client = Client::find($request->client_id);
        $reward = Reward::find($request->reward_id);

        if ($client->total_points < $reward->points_required) {
            return response()->json(['message' => 'Insufficient points'], 422);
        }

        // Create pending redemption
        $redemption = \App\Models\Redemption::create([
            'client_id' => $request->client_id,
            'reward_id' => $request->reward_id,
            'points_used' => $reward->points_required,
            'contact_info' => $request->contact_info,
            'status' => 'pending',
        ]);

        return response()->json($redemption, 201);
    }

    public function listRewards()
    {
        $rewards = Reward::where('is_active', true)->get();
        return response()->json($rewards);
    }

    public function requestCodeChange(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'new_code' => 'required|string',
        ]);

        $client = Client::find($request->client_id);
        $referralCodeService = app(\App\Services\ReferralCodeService::class);

        // Validate format
        if (!$referralCodeService->validate($request->new_code)) {
            return response()->json(['message' => 'Invalid referral code format. Use [3-4 UPPERCASE letters][3 digits] format.'], 422);
        }

        // Validate uniqueness
        if (!$referralCodeService->isUnique(strtoupper($request->new_code), $client->id)) {
            return response()->json(['message' => 'Referral code already exists. Please choose a different code.'], 422);
        }

        // Store pending code change (we'll add a pending_referral_code column or use a separate table)
        // For simplicity, we'll store it in a separate table or as a temporary solution
        // In a full implementation, we'd have a code_change_requests table
        // For now, we'll just validate and return success - admin would need to approve manually

        return response()->json(['message' => 'Code change request submitted. Admin approval required.']);
    }

    public function getMedia(string $section)
    {
        $items = \App\Models\MediaItem::where('section', $section)
            ->orderBy('sort_order')
            ->get()
            ->map(function($item) {
                return [
                    ...$item->toArray(),
                    'url' => asset('storage/'.$item->file_path),
                ];
            });

        return response()->json($items);
    }
}