<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',
        'title',
        'description',
        'link',
        'image',
        'status',
        'order',
        'button_text'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'button_text' => 'array',
    ];
}
