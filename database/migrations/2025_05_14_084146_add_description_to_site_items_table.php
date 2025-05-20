<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('site_items', function (Blueprint $table) {
            $table->json('description')->nullable()->after('title');
        });
    }

    public function down()
    {
        Schema::table('site_items', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
