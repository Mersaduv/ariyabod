<?php

namespace Database\Seeders;

use App\Models\Visit;
use Carbon\Carbon;
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
            Carbon::now(),
            Carbon::now()->subHours(2),
            Carbon::now()->subHours(4),
            Carbon::now()->subDays(1),
            Carbon::now()->subDays(2),
            Carbon::now()->subWeek(),
            Carbon::now()->subWeeks(2),
            Carbon::now()->subMonth(),
            Carbon::now()->subMonths(2),
            Carbon::now()->subYear(),
        ]);

        foreach ($dates as $date) {
            Visit::factory()->count(rand(3, 7))->create([
                'visited_at' => $date,
            ]);
        }
    }
}
