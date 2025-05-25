<?php

namespace Database\Seeders;

use App\Models\SpeedOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpeedOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Common internet speeds
        $speedOptions = [
            [
                'value' => 512,
                'unit' => 'kb',
                'name' => 'سرعت پایه',
                'description' => 'سرعت استاندارد برای استفاده عادی',
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'value' => 1,
                'unit' => 'mb',
                'name' => 'سرعت متوسط',
                'description' => 'سرعت مناسب برای استفاده روزانه',
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'value' => 4,
                'unit' => 'mb',
                'name' => 'سرعت بالا',
                'description' => 'سرعت مناسب برای استریم ویدیو',
                'is_active' => true,
                'display_order' => 3,
            ],
            [
                'value' => 8,
                'unit' => 'mb',
                'name' => 'سرعت خیلی بالا',
                'description' => 'سرعت مناسب برای دانلود و استریم HD',
                'is_active' => true,
                'display_order' => 4,
            ],
            [
                'value' => 16,
                'unit' => 'mb',
                'name' => 'سرعت فوق العاده',
                'description' => 'سرعت مناسب برای کاربران حرفه ای',
                'is_active' => true,
                'display_order' => 5,
            ],
            [
                'value' => 1,
                'unit' => 'gb',
                'name' => 'سرعت نامحدود',
                'description' => 'بالاترین سرعت ممکن',
                'is_active' => true,
                'display_order' => 6,
            ],
        ];

        foreach ($speedOptions as $option) {
            SpeedOption::create($option);
        }
    }
}
