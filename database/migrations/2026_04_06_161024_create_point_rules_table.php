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
    Schema::create('point_rules', function (Blueprint $table) {
        $table->id();
        $table->enum('tattoo_size', ['minimalist', 'medium', 'big'])->unique();
        $table->unsignedInteger('points_awarded');
        $table->timestamps();
    });
}
 
public function down(): void
{
    Schema::dropIfExists('point_rules');   
}
};
