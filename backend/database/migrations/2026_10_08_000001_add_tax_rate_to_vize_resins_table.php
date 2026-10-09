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
            if (!Schema::hasColumn('vize_resins', 'tax_rate')) {
                $table->decimal('tax_rate', 5, 2)->default(18.00)->after('base_price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vize_resins', function (Blueprint $table) {
            if (Schema::hasColumn('vize_resins', 'tax_rate')) {
                $table->dropColumn('tax_rate');
            }
        });
    }
};
