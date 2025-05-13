<?php

namespace Database\Factories;

use App\Models\Visit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visit>
 */
class VisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Visit::class;

    public function definition(): array
    {
        return [
            'ip_address' => $this->faker->ipv4,
            'user_id' => null, // یا 1 برای تست
            'url' => $this->faker->url,
            'visited_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
