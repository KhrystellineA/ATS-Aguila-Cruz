<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Client extends Model {
    use Notifiable;

    protected $fillable = [
        'name','email','phone','referral_code','pending_referral_code',
        'total_points','points_earned','points_redeemed',
        'is_expired','last_activity_at'
    ];
 
    protected $casts = [
        'is_expired' => 'boolean',
        'last_activity_at' => 'datetime',
    ];
 
    public function referralsAsReferrer() {
        return $this->hasMany(Referral::class, 'referrer_id');
    }
    public function referralsAsReferred() {
        return $this->hasMany(Referral::class, 'referred_client_id');
    }
    public function redemptions() { return $this->hasMany(Redemption::class); }
    public function pointsTransactions() { return $this->hasMany(PointsTransaction::class); }
}
