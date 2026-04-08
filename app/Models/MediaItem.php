<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $fillable = [
        'section',
        'file_path',
        'alt_text',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected $table = 'media_items';

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }
}