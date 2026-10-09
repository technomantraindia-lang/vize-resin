<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('vize_table_tops')) {
            Schema::table('vize_table_tops', function (Blueprint $table) {
                if (!Schema::hasColumn('vize_table_tops', 'category')) {
                    $table->string('category')->default('Dining & River Tables')->after('slug');
                }
                if (!Schema::hasColumn('vize_table_tops', 'resin')) {
                    $table->string('resin')->default('Vize SuperCast')->after('dimensions');
                }
                if (!Schema::hasColumn('vize_table_tops', 'images')) {
                    $table->json('images')->nullable()->after('image_url');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('vize_table_tops')) {
            Schema::table('vize_table_tops', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('vize_table_tops', 'category')) $columns[] = 'category';
                if (Schema::hasColumn('vize_table_tops', 'resin')) $columns[] = 'resin';
                if (Schema::hasColumn('vize_table_tops', 'images')) $columns[] = 'images';
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
