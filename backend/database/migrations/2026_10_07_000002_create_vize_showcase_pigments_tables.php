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
        // 1. Colors & Pigments Specialty Manager
        Schema::create('vize_pigments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category'); // Powder, Liquid Paste, Alcohol Ink, Metallic, Glow
            $table->string('hex_color')->nullable(); // #FF5733
            $table->string('opacity')->default('Solid Opaque'); // Transparent, Semi-Opaque, Solid Opaque
            $table->string('mixing_ratio')->default('2-5% by weight');
            $table->json('pack_sizes')->nullable(); // [{"size":"50g","price":299},{"size":"100g","price":499},{"size":"500g","price":1899},{"size":"1kg","price":3499}]
            $table->decimal('base_price', 10, 2)->default(299.00);
            $table->string('stock_status')->default('In Stock'); // In Stock, Low Stock, Out of Stock
            $table->boolean('is_combo')->default(false);
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Bento Showcase / Our Work Gallery
        Schema::create('vize_showcase', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('client_type')->default('Commercial'); // Commercial, Residential, Boardroom, Bespoke
            $table->string('layout_span')->default('col-span-1'); // col-span-1, col-span-2 (panoramic)
            $table->string('category_pill')->default('Live Edge River Table');
            $table->string('image_url');
            $table->string('formulation')->nullable(); // VIZE UltraCast 3:1 Deep Pour
            $table->string('hardness')->default('85 Shore D');
            $table->string('pour_depth')->default('75 mm single pour');
            $table->string('uv_stability')->default('Class 1 UV Shield');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 3. Showcase / Bespoke Project Commission Leads
        Schema::create('vize_showcase_inquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('showcase_id')->nullable();
            $table->string('client_name');
            $table->string('email');
            $table->string('phone');
            $table->string('project_type')->nullable(); // Boardroom Table, Wall Art, Countertop
            $table->string('estimated_dimensions')->nullable();
            $table->string('budget_range')->nullable();
            $table->text('specifications')->nullable();
            $table->string('status')->default('New'); // New, In Discussion, Quoted, Closed
            $table->timestamps();

            $table->foreign('showcase_id')->references('id')->on('vize_showcase')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vize_showcase_inquiries');
        Schema::dropIfExists('vize_showcase');
        Schema::dropIfExists('vize_pigments');
    }
};
