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
    Schema::create('redemptions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('client_id')->constrained()->onDelete('cascade');
        $table->foreignId('reward_id')->constrained()->onDelete('cascade');
        $table->unsignedInteger('points_used');
        $table->json('contact_info')->nullable();
        $table->enum('status', ['pending','approved','rejected','used'])->default('pending');
        $table->timestamp('approved_at')->nullable();
        $table->timestamp('used_at')->nullable();
        $table->timestamps();
    });
}
 
public function down(): void
{
    Schema::dropIfExists('redemptions');
}

};
