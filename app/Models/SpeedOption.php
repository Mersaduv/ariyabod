<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpeedOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'value',
        'unit',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'value' => 'float',
        'display_order' => 'integer',
    ];

    /**
     * Get formatted speed string (e.g. "10 Mbps")
     */
    public function getFormattedSpeedAttribute(): string
    {
        $unitMap = [
            'kb' => 'Kbps',
            'mb' => 'Mbps',
            'gb' => 'Gbps',
        ];

        $displayUnit = $unitMap[$this->unit] ?? $this->unit;
        return $this->value . ' ' . $displayUnit;
    }

    /**
     * Get speed value in Kbps (for calculator)
     */
    public function getSpeedInKbpsAttribute(): float
    {
        // Convert to Kbps: KB/s * 8 = Kbps
        // mb to Kbps: value * 1000 * 8
        // gb to Kbps: value * 1000 * 1000 * 8
        switch ($this->unit) {
            case 'kb':
                return $this->value * 8;
            case 'mb':
                return $this->value * 1000 * 8;
            case 'gb':
                return $this->value * 1000 * 1000 * 8;
            default:
                return $this->value * 8;
        }
    }

    /**
     * Get all active speed options ordered by display_order
     */
    public static function getActiveOptions()
    {
        $options = static::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        // Add the formatted_speed and speed_in_kbps attributes as appended attributes
        foreach ($options as $option) {
            $option->formatted_speed = $option->getFormattedSpeedAttribute();
            $option->speed_in_kbps = $option->getSpeedInKbpsAttribute();
        }

        return $options;
    }
}
