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
            $table->boolean('is_special_offer')->default(false)->after('is_active');
            $table->string('special_offer_title')->nullable()->after('is_special_offer');
            $table->text('special_offer_description')->nullable()->after('special_offer_title');
            $table->date('special_offer_start_date')->nullable()->after('special_offer_description');
            $table->date('special_offer_end_date')->nullable()->after('special_offer_start_date');
            $table->boolean('is_featured')->default(false)->after('special_offer_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internet_packages', function (Blueprint $table) {
            $table->dropColumn([
                'is_special_offer',
                'special_offer_title',
                'special_offer_description',
                'special_offer_start_date',
                'special_offer_end_date',
                'is_featured'
            ]);
        });
    }
};
