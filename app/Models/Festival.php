<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Festival extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'is_active',
        'is_featured',
        'image',
        'additional_images',
        'color_code',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'additional_images' => 'array',
    ];

    /**
     * The internet packages that belong to the festival.
     */
    public function internetPackages(): BelongsToMany
    {
        return $this->belongsToMany(InternetPackage::class)
            ->withPivot('is_special_price', 'festival_price')
            ->withTimestamps();
    }

    /**
     * Check if the festival is currently active based on dates.
     */
    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $today = now()->startOfDay();
        return $today->between($this->start_date, $this->end_date);
    }

    /**
     * Get the remaining days for the festival.
     */
    public function getRemainingDaysAttribute(): int
    {
        if ($this->end_date < now()) {
            return 0;
        }
        return now()->diffInDays($this->end_date, false);
    }
}
