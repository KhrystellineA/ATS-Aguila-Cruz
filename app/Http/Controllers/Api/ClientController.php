<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\PointRule;
use App\Services\ReferralCodeService;
use App\Services\PointsService;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::withCount(['referralsAsReferrer', 'referralsAsReferred'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients',
            'phone' => 'nullable|string',
            'tattoo_size' => 'required|in:minimalist,medium,big',
        ]);

        $referralCodeService = app(ReferralCodeService::class);
        $code = $referralCodeService->generate();

        $points = PointRule::where('tattoo_size', $data['tattoo_size'])
            ->value('points_awarded');

        $client = Client::create([
            ...$data,
            'referral_code' => $code,
            'last_activity_at' => now(),
        ]);

        $pointsService = app(PointsService::class);
        $pointsService->award($client, $points, 'Initial tattoo: '.$data['tattoo_size']);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'client_created',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => ['name' => $client->name],
        ]);

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client->load([
            'referralsAsReferrer.referredClient',
            'referralsAsReferred.referrer',
            'redemptions.reward',
            'pointsTransactions'
        ]));
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|nullable|email|unique:clients,email,'.$client->id,
            'phone' => 'sometimes|nullable|string',
        ]);

        $client->update($data);

        // Audit log
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'client_updated',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => ['changes' => $data],
        ]);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        // Audit log before deletion
        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'client_deleted',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => ['name' => $client->name],
        ]);

        $client->delete();

        return response()->json(['message' => 'Client deleted']);
    }

    public function adjustPoints(Request $request, Client $client)
    {
        $data = $request->validate([
            'points' => 'required|integer',
            'reason' => 'required|string',
        ]);

        $pointsService = app(PointsService::class);
        $adminId = auth()->id() ?? 1;
        $pointsService->adjust($client, $data['points'], $data['reason'], $adminId);

        // Refresh client
        $client->refresh();

        return response()->json($client);
    }

    public function dashboardStats()
    {
        return response()->json([
            'total_clients' => Client::count(),
            'total_points_awarded' => Client::sum('points_earned'),
            'total_points_redeemed' => Client::sum('points_redeemed'),
            'top_referrers' => Client::withCount('referralsAsReferrer')
                ->orderByDesc('referrals_as_referrer_count')
                ->limit(10)
                ->get(['id', 'name', 'referral_code', 'referrals_as_referrer_count']),
            'recent_referrals' => \App\Models\Referral::with(['referrer', 'referredClient'])
                ->latest()
                ->limit(10)
                ->get(),
            'recent_redemptions' => \App\Models\Redemption::with(['client', 'reward'])
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }
}