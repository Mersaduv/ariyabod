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
            $table->boolean('has_night_free')->default(false)->after('is_featured');
            $table->time('night_free_start_time')->nullable()->after('has_night_free');
            $table->time('night_free_end_time')->nullable()->after('night_free_start_time');
            $table->float('night_free_speed_mb')->nullable()->after('night_free_end_time');
            $table->json('provinces')->nullable()->after('night_free_speed_mb');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internet_packages', function (Blueprint $table) {
            $table->dropColumn('has_night_free');
            $table->dropColumn('night_free_start_time');
            $table->dropColumn('night_free_end_time');
            $table->dropColumn('night_free_speed_mb');
            $table->dropColumn('provinces');
        });
    }
};
