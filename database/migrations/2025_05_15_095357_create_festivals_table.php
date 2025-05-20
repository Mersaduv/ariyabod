<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('festivals', function (Blueprint $table) {
            $table->id();
            $table->json('title'); // Multilingual title (fa, en, ps)
            $table->json('description')->nullable(); // Multilingual description
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->string('image')->nullable(); // Main festival image path
            $table->json('additional_images')->nullable(); // Additional festival images paths
            $table->string('color_code')->nullable(); // For styling/theme (e.g. #FFD700 for gold)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('festivals');
    }
};
