<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InternetPackage;

class InternetPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            // ✅ بسته‌های نامحدود (Unlimited)
            [
                'title' => [
                    'en' => 'Ultra Jet 1',
                    'fa' => 'اولترا جت ۱',
                    'ps' => 'اولترا جټ ۱'
                ],
                'type' => 'unlimited',
                'price' => 990,
                'duration_days' => 30,
                'speed_slots' => [
                    ['from' => '07:00', 'to' => '06:00', 'speed_mb' => 1.5],
                    ['from' => '06:00', 'to' => '18:00', 'speed_mb' => 2.0],
                ],
                'is_active' => true,
            ],
            [
                'title' => [
                    'en' => 'Ultra Jet 4',
                    'fa' => 'اولترا جت ۴',
                    'ps' => 'اولترا جټ ۴'
                ],
                'type' => 'unlimited',
                'price' => 2990,
                'duration_days' => 30,
                'speed_slots' => [
                    ['from' => '07:00', 'to' => '06:00', 'speed_mb' => 5.5],
                    ['from' => '06:00', 'to' => '18:00', 'speed_mb' => 6.5],
                ],
                'is_active' => true,
            ],

            // ✅ بسته حجمی (ثابت – بدون محدودیت روزانه)
            [
                'title' => [
                    'en' => 'Volume 300 GB - 90 Days',
                    'fa' => '۳۰۰ گیگابایت - ۹۰ روز',
                    'ps' => '۳۰۰ جی بی - ۹۰ ورځی'
                ],
                'type' => 'volume_fixed',
                'price' => 2400,
                'duration_days' => 90,
                'total_volume_gb' => 300,
                'speed_mb' => 6,
                'is_active' => true,
            ],
            [
                'title' => [
                    'en' => 'Volume 90 GB - 30 Days',
                    'fa' => '۹۰ گیگابایت - ۳۰ روز',
                    'ps' => '۹۰ جی بی - ۳۰ ورځی'
                ],
                'type' => 'volume_fixed',
                'price' => 780,
                'duration_days' => 30,
                'total_volume_gb' => 90,
                'speed_mb' => 3,
                'is_active' => true,
            ],

            // ✅ بسته حجمی روزانه (محدود)
            [
                'title' => [
                    'en' => 'Daily Volume 450 GB (15 GB/day)',
                    'fa' => '۴۵۰ گیگابایت - روزانه ۱۵ گیگ',
                    'ps' => '۴۵۰ جی بی - هر ورځ ۱۵ جی بی'
                ],
                'type' => 'volume_daily',
                'price' => 3500,
                'duration_days' => 30,
                'daily_limit_gb' => 15,
                'speed_mb' => 6,
                'is_active' => true,
            ],
            [
                'title' => [
                    'en' => 'Daily Volume 120 GB (4 GB/day)',
                    'fa' => '۱۲۰ گیگابایت - روزانه ۴ گیگ',
                    'ps' => '۱۲۰ جی بی - هر ورځ ۴ جی بی'
                ],
                'type' => 'volume_daily',
                'price' => 1100,
                'duration_days' => 30,
                'daily_limit_gb' => 4,
                'speed_mb' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $data) {
            InternetPackage::create($data);
        }
    }
}
