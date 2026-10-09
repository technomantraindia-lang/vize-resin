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
        // 1. Home Page Video & Reels
        Schema::create('vize_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('platform')->default('instagram'); // instagram, youtube, mp4
            $table->text('url');
            $table->string('thumbnail')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 2. Table Tops Custom Studio
        Schema::create('vize_table_tops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('wood_type')->nullable(); // Teak, Walnut, Sheesham, Burl, Olive
            $table->string('dimensions')->nullable(); // e.g. 8ft x 3.5ft x 2inch
            $table->decimal('price', 12, 2)->default(0.00);
            $table->string('status')->default('Ready to Ship'); // Ready to Ship, Made to Order, Sold Out
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // 3. Courses & Workshops
        Schema::create('vize_workshops', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('level')->default('Masterclass'); // Beginner, Advanced, Masterclass
            $table->string('duration')->nullable(); // 3 Days Intensive
            $table->decimal('fee', 10, 2)->default(0.00);
            $table->decimal('advance_fee', 10, 2)->default(0.00);
            $table->json('inclusions')->nullable(); // Kit, Certificate, Lunch, etc.
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });

        // 4. Workshop Batches
        Schema::create('vize_workshop_batches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('workshop_id')->nullable();
            $table->string('city'); // Mumbai, Delhi, Bangalore, etc.
            $table->string('venue')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('total_seats')->default(30);
            $table->integer('booked_seats')->default(0);
            $table->string('status')->default('Open'); // Open, Filling Fast, Sold Out
            $table->timestamps();

            $table->foreign('workshop_id')->references('id')->on('vize_workshops')->onDelete('cascade');
        });

        // 5. Student Admissions & Inquiries
        Schema::create('vize_workshop_admissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->string('student_name');
            $table->string('email');
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('payment_status')->default('Pending'); // Pending, Advance Paid, Completed
            $table->decimal('amount_paid', 10, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('batch_id')->references('id')->on('vize_workshop_batches')->onDelete('set null');
        });

        // 6. Custom Table Quotation Inquiries
        Schema::create('vize_table_inquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('table_id')->nullable();
            $table->string('customer_name');
            $table->string('email');
            $table->string('phone');
            $table->string('requested_dimensions')->nullable();
            $table->string('wood_preference')->nullable();
            $table->string('budget')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('New'); // New, Contacted, Quoted, Closed
            $table->timestamps();

            $table->foreign('table_id')->references('id')->on('vize_table_tops')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vize_table_inquiries');
        Schema::dropIfExists('vize_workshop_admissions');
        Schema::dropIfExists('vize_workshop_batches');
        Schema::dropIfExists('vize_workshops');
        Schema::dropIfExists('vize_table_tops');
        Schema::dropIfExists('vize_videos');
    }
};
