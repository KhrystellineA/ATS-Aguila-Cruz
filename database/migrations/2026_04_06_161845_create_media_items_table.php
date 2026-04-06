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
    Schema::create('media_items', function (Blueprint $table) {
        $table->id();
        $table->string('section'); // e.g. 'hero', 'about', 'gallery'
        $table->string('file_path');
        $table->string('alt_text')->nullable();
        $table->unsignedInteger('sort_order')->default(0);
        $table->timestamps();
    });
}
 
public function down(): void
{
    Schema::dropIfExists('media_items');
}

};
