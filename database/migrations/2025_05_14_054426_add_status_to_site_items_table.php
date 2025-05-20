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
        Schema::table('site_items', function (Blueprint $table) {
            $table->boolean('status')->default(true)->after('image'); // یا after('link') بسته به جای دلخواه
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_items', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
