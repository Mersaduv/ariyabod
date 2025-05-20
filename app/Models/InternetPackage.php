<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternetPackage extends Model
{
    use HasFactory;

    public const TYPE_UNLIMITED = 'unlimited';
    public const TYPE_VOLUME_FIXED = 'volume_fixed';
    public const TYPE_VOLUME_DAILY = 'volume_daily';

    protected $fillable = [
        'title',
        'type',
        'price',
        'duration_days',
        'speed_slots',
        'total_volume_gb',
        'daily_limit_gb',
        'speed_mb',
        'after_daily_limit_speed_mb',
        'is_active',
        'is_special_offer',
        'special_offer_title',
        'special_offer_description',
        'special_offer_start_date',
        'special_offer_end_date',
        'is_featured',
        'has_night_free',
        'is_night_free',
        'night_free_start_time',
        'night_free_end_time',
        'night_free_speed_mb',
        'provinces',
        'province',
    ];

    protected $casts = [
        'title' => 'array',
        'speed_slots' => 'array',
        'is_active' => 'boolean',
        'is_special_offer' => 'boolean',
        'special_offer_start_date' => 'date',
        'special_offer_end_date' => 'date',
        'is_featured' => 'boolean',
        'has_night_free' => 'boolean',
        'is_night_free' => 'boolean',
        'night_free_start_time' => 'datetime',
        'night_free_end_time' => 'datetime',
        'night_free_speed_mb' => 'float',
        'provinces' => 'array',
    ];

    public static function getTypeOptions(): array
    {
        return [
            self::TYPE_UNLIMITED => ['en' => 'Unlimited', 'fa' => 'نامحدود', 'ps' => 'نامحدود'],
            self::TYPE_VOLUME_FIXED => ['en' => 'Fixed Volume', 'fa' => 'حجمی بدون محدودیت روزانه', 'ps' => 'د ټاکلې اندازې بنډل'],
            self::TYPE_VOLUME_DAILY => ['en' => 'Daily Volume', 'fa' => 'حجمی با محدودیت روزانه', 'ps' => 'د ورځنۍ اندازې بنډل'],
        ];
    }

    /**
     * The festivals that belong to the internet package.
     */
    public function festivals()
    {
        return $this->belongsToMany(Festival::class)
            ->withPivot('is_special_price', 'festival_price')
            ->withTimestamps();
    }

    /**
     * Get active festivals associated with this package.
     */
    public function activeFestivals()
    {
        $today = now()->format('Y-m-d');
        return $this->festivals()
            ->where('is_active', true)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today);
    }

    // Check if a special offer is currently active based on dates
    public function isSpecialOfferActive(): bool
    {
        if (!$this->is_special_offer) {
            return false;
        }

        if ($this->special_offer_start_date && $this->special_offer_end_date) {
            $today = now()->startOfDay();
            return $today->between(
                $this->special_offer_start_date->startOfDay(),
                $this->special_offer_end_date->endOfDay()
            );
        }

        return false;
    }
}
