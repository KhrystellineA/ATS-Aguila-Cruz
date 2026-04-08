<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Models\Client;
use App\Models\PointRule;
use App\Services\PointsService;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index()
    {
        $referrals = Referral::with(['referrer', 'referredClient'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($referrals);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'referrer_id' => 'required|exists:clients,id',
            'referred_client_id' => 'required|exists:clients,id',
            'referral_code_used' => 'required|string',
            'tattoo_size' => 'required|in:minimalist,medium,big',
        ]);

        // Enforce 3-visit cap
        if (!Referral::canAdd($data['referrer_id'], $data['referred_client_id'], $data['referral_code_used'])) {
            return response()->json(['message' => '3-visit cap reached for this referrer-code pair.'], 422);
        }

        $points = PointRule::where('tattoo_size', $data['tattoo_size'])
            ->value('points_awarded');

        $referrer = Client::find($data['referrer_id']);
        $referred = Client::find($data['referred_client_id']);
        $pointsService = app(PointsService::class);

        $pointsService->award($referrer, $points, 'Referral reward: '.$data['tattoo_size']);
        $pointsService->award($referred, $points, 'Referred visit: '.$data['tattoo_size']);

        $referral = Referral::create([
            ...$data,
            'points_awarded_to_referrer' => $points,
            'points_awarded_to_referred' => $points,
            'status' => 'completed',
        ]);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'referral_created',
            'target_type' => 'Referral',
            'target_id' => $referral->id,
            'payload' => [
                'referrer_id' => $referrer->id,
                'referred_client_id' => $referred->id,
                'referral_code_used' => $data['referral_code_used'],
                'tattoo_size' => $data['tattoo_size'],
                'points_awarded' => $points,
            ],
        ]);

        return response()->json($referral->load(['referrer', 'referredClient']), 201);
    }

    public function show(Referral $referral)
    {
        return response()->json($referral->load(['referrer', 'referredClient']));
    }

    public function update(Request $request, Referral $referral)
    {
        $data = $request->validate([
            'referrer_id' => 'sometimes|required|exists:clients,id',
            'referred_client_id' => 'sometimes|required|exists:clients,id',
            'referral_code_used' => 'sometimes|required|string',
            'tattoo_size' => 'sometimes|required|in:minimalist,medium,big',
            'status' => 'sometimes|required|in:pending,completed',
        ]);

        $referral->update($data);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'referral_updated',
            'target_type' => 'Referral',
            'target_id' => $referral->id,
            'payload' => ['changes' => $data],
        ]);

        return response()->json($referral->load(['referrer', 'referredClient']));
    }

    public function destroy(Referral $referral)
    {
        // Audit log before deletion
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'referral_deleted',
            'target_type' => 'Referral',
            'target_id' => $referral->id,
            'payload' => [
                'referrer_id' => $referral->referrer_id,
                'referred_client_id' => $referral->referred_client_id,
                'referral_code_used' => $referral->referral_code_used,
            ],
        ]);

        $referral->delete();

        return response()->json(['message' => 'Referral deleted']);
    }
}