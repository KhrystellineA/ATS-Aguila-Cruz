<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Redemption extends Model
{
    protected $fillable = [
        'client_id',
        'reward_id',
        'points_used',
        'contact_info',
        'status',
        'approved_at',
        'used_at',
    ];

    protected $casts = [
        'contact_info' => 'array',
        'approved_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }
}