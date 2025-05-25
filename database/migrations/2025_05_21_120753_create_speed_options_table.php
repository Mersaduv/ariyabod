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
        Schema::create('speed_options', function (Blueprint $table) {
            $table->id();
            $table->decimal('value', 10, 2); // Speed value (e.g., 1, 10, 100)
            $table->enum('unit', ['kb', 'mb', 'gb']); // Speed unit (KB, MB, GB)
            $table->string('name')->nullable(); // Optional display name for the speed
            $table->text('description')->nullable(); // Optional description
            $table->boolean('is_active')->default(true); // Whether this speed option is active
            $table->integer('display_order')->default(0); // For ordering in UI
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speed_options');
    }
};
