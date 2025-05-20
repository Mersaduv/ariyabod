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
        Schema::create('festival_internet_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('festival_id')->constrained()->onDelete('cascade');
            $table->foreignId('internet_package_id')->constrained()->onDelete('cascade');
            $table->boolean('is_special_price')->default(false); // Flag to indicate if this package has a special price during this festival
            $table->integer('festival_price')->nullable(); // Special festival price, if applicable
            $table->timestamps();

            // Ensure a package can't be added to the same festival multiple times
            $table->unique(['festival_id', 'internet_package_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('festival_internet_package');
    }
};
