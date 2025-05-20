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
        Schema::create('internet_packages', function (Blueprint $table) {
            $table->id();
            $table->json('title')->nullable();
            $table->enum('type', ['unlimited', 'volume_fixed', 'volume_daily']); // نوع بسته
            $table->integer('price'); // قیمت به افغانی
            $table->integer('duration_days'); // مدت اعتبار به روز
            $table->json('speed_slots')->nullable(); // سرعت‌ها در زمان‌های مختلف (برای بسته‌های نامحدود)
            $table->integer('total_volume_gb')->nullable(); // حجم کلی (برای حجمی‌ها)
            $table->integer('daily_limit_gb')->nullable(); // حجم روزانه (برای حجمی محدود)
            $table->integer('speed_mb')->nullable(); // سرعت ثابت برای حجمی‌ها
            $table->boolean('is_active')->default(true); // فعال یا غیرفعال
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internet_packages');
    }
};
