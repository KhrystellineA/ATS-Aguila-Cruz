<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model {
    protected $fillable = [
        'referrer_id','referred_client_id','referral_code_used',
        'tattoo_size','points_awarded_to_referrer',
        'points_awarded_to_referred','status'
    ];

    // Check if a new referral can be added (3-visit cap)
    public static function canAdd($referrerId, $referredId, $codeUsed): bool {
        return self::where('referrer_id', $referrerId)
            ->where('referred_client_id', $referredId)
            ->where('referral_code_used', $codeUsed)
            ->count() < 3;
    }

    public function referrer() { return $this->belongsTo(Client::class, 'referrer_id'); }
    public function referredClient() {
        return $this->belongsTo(Client::class, 'referred_client_id');
    }
}
