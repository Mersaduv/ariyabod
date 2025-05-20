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
            $table->float('after_daily_limit_speed_mb')->nullable()->after('speed_mb');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internet_packages', function (Blueprint $table) {
            $table->dropColumn('after_daily_limit_speed_mb');
        });
    }
};
