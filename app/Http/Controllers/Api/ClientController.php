<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\PointRule;
use App\Services\ReferralCodeService;
use App\Services\PointsService;
use App\Models\AuditLog;
use App\Notifications\CodeChangeApproved;
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
            'referral_code' => 'nullable|string|max:7|unique:clients',
        ]);

        $referralCodeService = app(ReferralCodeService::class);
        
        // Use provided code or auto-generate
        if (empty($data['referral_code'])) {
            $code = $referralCodeService->generate();
        } else {
            $code = strtoupper($data['referral_code']);
            // Validate format
            if (!$referralCodeService->validate($code)) {
                return response()->json(['message' => 'Invalid referral code format. Use 3-4 letters + 3 digits (e.g. ABC123)'], 422);
            }
            // Validate uniqueness
            if (!$referralCodeService->isUnique($code)) {
                return response()->json(['message' => 'Referral code is already taken'], 422);
            }
        }

        $points = PointRule::where('tattoo_size', $data['tattoo_size'])
            ->value('points_awarded');

        $client = Client::create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'tattoo_size' => $data['tattoo_size'],
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
            'payload' => ['name' => $client->name, 'referral_code' => $code],
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

    public function approveCodeChange(Request $request, Client $client)
    {
        if (!$client->pending_referral_code) {
            return response()->json(['message' => 'No pending code change'], 422);
        }

        $referralCodeService = app(ReferralCodeService::class);
        $newCode = strtoupper($client->pending_referral_code);

        // Re-validate uniqueness (in case it changed since request)
        if (!$referralCodeService->isUnique($newCode, $client->id)) {
            $client->update(['pending_referral_code' => null]);
            return response()->json(['message' => 'Code is no longer available'], 422);
        }

        $oldCode = $client->referral_code;
        $client->update([
            'referral_code' => $newCode,
            'pending_referral_code' => null,
        ]);

        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'code_change_approved',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => ['old_code' => $oldCode, 'new_code' => $newCode],
        ]);

        // Send notification
        if ($client->email) {
            $client->notify(new CodeChangeApproved($client, $oldCode, $newCode));
        }

        return response()->json(['message' => 'Code change approved', 'client' => $client]);
    }

    public function rejectCodeChange(Request $request, Client $client)
    {
        if (!$client->pending_referral_code) {
            return response()->json(['message' => 'No pending code change'], 422);
        }

        $rejectedCode = $client->pending_referral_code;
        $client->update(['pending_referral_code' => null]);

        AuditLog::create([
            'admin_user_id' => auth()->id() ?? 1,
            'action' => 'code_change_rejected',
            'target_type' => 'Client',
            'target_id' => $client->id,
            'payload' => ['rejected_code' => $rejectedCode],
        ]);

        return response()->json(['message' => 'Code change rejected']);
    }
}