<?php

namespace Database\Seeders;

use App\Models\Visit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VisitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $dates = collect([
            now()->subDays(0),
            now()->subDays(1),
            now()->subDays(2),
            now()->subWeek(),
            now()->subWeeks(2),
            now()->subMonth(),
            now()->subMonths(2),
            now()->subYear(),
        ]);

        foreach ($dates as $date) {
            Visit::factory()->count(rand(3, 7))->create([
                'visited_at' => $date,
            ]);
        }
    }
}
