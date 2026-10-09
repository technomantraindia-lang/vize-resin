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
        Schema::table('vize_resins', function (Blueprint $table) {
            if (!Schema::hasColumn('vize_resins', 'video_url')) {
                $table->string('video_url')->nullable()->after('images');
            }
            if (!Schema::hasColumn('vize_resins', 'video_title')) {
                $table->string('video_title')->nullable()->after('video_url');
            }
            if (!Schema::hasColumn('vize_resins', 'video_thumbnail')) {
                $table->string('video_thumbnail')->nullable()->after('video_title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vize_resins', function (Blueprint $table) {
            if (Schema::hasColumn('vize_resins', 'video_url')) {
                $table->dropColumn('video_url');
            }
            if (Schema::hasColumn('vize_resins', 'video_title')) {
                $table->dropColumn('video_title');
            }
            if (Schema::hasColumn('vize_resins', 'video_thumbnail')) {
                $table->dropColumn('video_thumbnail');
            }
        });
    }
};
