<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointRule extends Model
{
    protected $fillable = [
        'tattoo_size',
        'points_awarded',
    ];

    protected $casts = [
        'points_awarded' => 'integer',
    ];

    protected $table = 'point_rules';
}