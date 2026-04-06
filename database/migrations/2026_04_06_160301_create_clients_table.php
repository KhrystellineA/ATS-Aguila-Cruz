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
    Schema::create('clients', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->nullable()->unique();
        $table->string('phone')->nullable();
        $table->string('referral_code', 10)->unique();
        $table->unsignedInteger('total_points')->default(0);
        $table->unsignedInteger('points_earned')->default(0);
        $table->unsignedInteger('points_redeemed')->default(0);
        $table->boolean('is_expired')->default(false);
        $table->timestamp('last_activity_at')->nullable();
        $table->timestamps();
        $table->index('name');
        $table->index('referral_code');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
