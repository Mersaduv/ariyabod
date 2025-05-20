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
        Schema::table('internet_packages', function (Blueprint $table) {
            $table->boolean('is_night_free')->default(false)->after('has_night_free');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internet_packages', function (Blueprint $table) {
            $table->dropColumn('is_night_free');
        });
    }
};
