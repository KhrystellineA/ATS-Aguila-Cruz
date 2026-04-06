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
    Schema::create('points_transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('client_id')->constrained()->onDelete('cascade');
        $table->integer('points'); // positive = earned, negative = deducted
        $table->enum('type', ['earned','redeemed','adjustment']);
        $table->string('description')->nullable();
        $table->timestamps();
    });
}
 
public function down(): void
{
    Schema::dropIfExists('points_transactions');
}

};
