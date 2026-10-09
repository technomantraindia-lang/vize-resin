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
        Schema::create('vize_resins', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('suffix')->nullable();
            $table->string('category')->default('Flooring Resins'); // Flooring Resins, Casting & Art, Protective Coatings, Finishing Compounds
            $table->string('application_category')->nullable(); // Primers & sealers, Screeding systems, Decorative topcoats, etc.
            $table->string('application_tag')->nullable(); // Surface preparation, Metallic finish, Deep Casting
            $table->string('grade')->nullable(); // Industrial Substrate Prep, Live Edge Wood, etc.
            $table->string('chemistry')->nullable(); // 100% Pure Epoxy Primer & Substrate Sealer
            $table->string('tagline')->nullable();
            $table->decimal('base_price', 10, 2)->default(0.00);
            $table->string('pack_qty')->default('12 KG'); // 15 KG, 12 KG, 4 KG, 35 KG, etc.
            $table->string('pack_composition')->nullable(); // Resin – 10 KG, Hardener – 5 KG
            $table->string('mix_ratio')->default('2 : 1'); // 2 : 1, 3 : 1, 1 : 1
            $table->string('cure_time')->nullable(); // 6–8 hrs tack-free
            $table->string('pot_life')->nullable(); // 35 mins @ 25°C
            $table->string('coverage')->nullable(); // ~100 sq.ft / 15kg pack
            $table->integer('sqft_coverage')->default(100);
            $table->decimal('price_per_kg', 10, 2)->nullable();
            $table->boolean('in_stock')->default(true);
            $table->json('images')->nullable();
            $table->json('features')->nullable();
            $table->text('about_text')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vize_resins');
    }
};
