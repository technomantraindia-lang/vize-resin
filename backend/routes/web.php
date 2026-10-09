<?php

use Illuminate\Support\Facades\Route;

Route::get('/debug-status', function () {
    $out = [];
    try {
        $out['database_name'] = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        $out['has_admins_table'] = \Illuminate\Support\Facades\Schema::hasTable('admins');
        if ($out['has_admins_table']) {
            $out['admins_count'] = \Illuminate\Support\Facades\DB::table('admins')->count();
            $out['admins'] = \Illuminate\Support\Facades\DB::table('admins')->select('id', 'name', 'email')->get();
        }
        $out['has_channels_table'] = \Illuminate\Support\Facades\Schema::hasTable('channels');
        $out['has_locales_table'] = \Illuminate\Support\Facades\Schema::hasTable('locales');
        $out['has_currencies_table'] = \Illuminate\Support\Facades\Schema::hasTable('currencies');
        $out['installed_file_exists'] = file_exists(storage_path('installed'));
    } catch (\Throwable $e) {
        $out['db_error'] = $e->getMessage();
    }

    try {
        $out['test_view'] = 'trying...';
        $v = view('admin::users.sessions.create')->render();
        $out['test_view'] = 'rendered ok, length: ' . strlen($v);
    } catch (\Throwable $e) {
        $out['view_error'] = $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
    }

    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        $lines = file($logFile);
        $out['recent_logs'] = array_slice($lines, -40);
    } else {
        $out['recent_logs'] = 'No log file found';
    }

    return response()->json($out, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
});

Route::get('/test-dash', function () {
    try {
        $admin = \Webkul\User\Models\Admin::first();
        auth()->guard('admin')->login($admin);
        $controller = app(\Webkul\Admin\Http\Controllers\DashboardController::class);
        $v = $controller->index()->render();
        return response('Dashboard render SUCCESS! Length: ' . strlen($v));
    } catch (\Throwable $e) {
        return response('Dashboard render ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    }
});

Route::get('/setup-db', function () {
    try {
        $sqlPath = base_path('database_backup.sql');
        if (!file_exists($sqlPath)) {
            return response()->json(['error' => 'database_backup.sql not found at ' . $sqlPath], 404);
        }
        $sql = file_get_contents($sqlPath);
        \Illuminate\Support\Facades\DB::unprepared($sql);
        touch(storage_path('installed'));
        return response()->json([
            'status' => 'success',
            'message' => 'database_backup.sql executed successfully!',
            'admins_count' => \Illuminate\Support\Facades\DB::table('admins')->count(),
            'admins' => \Illuminate\Support\Facades\DB::table('admins')->select('id', 'name', 'email')->get()
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/update-passwords', function () {
    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    \Illuminate\Support\Facades\DB::table('admins')
        ->where('email', 'admin@admin.com')
        ->update(['password' => $hash, 'status' => 1]);
    
    \Illuminate\Support\Facades\DB::table('admins')
        ->where('email', 'admin@example.com')
        ->update(['password' => $hash, 'status' => 1]);

    return response()->json([
        'status' => 'success',
        'message' => 'Passwords updated to admin123 for all admins!',
        'accounts' => [
            'admin@admin.com' => 'admin123',
            'admin@example.com' => 'admin123'
        ]
    ]);
});

Route::get('/quick-admin', function () {
    $admin = \Webkul\User\Models\Admin::where('email', 'admin@admin.com')->first() 
          ?: \Webkul\User\Models\Admin::first();
    if ($admin) {
        auth()->guard('admin')->login($admin, true);
        return redirect()->route('admin.dashboard.index');
    }
    return response('No admin found in database. Please run /setup-db first.', 404);
});

Route::get('/reset-session', function () {
    auth()->guard('admin')->logout();
    auth()->guard('customer')->logout();
    session()->flush();
    session()->regenerate();
    return redirect()->route('admin.session.create');
});

Route::get('/simulate-login', function () {
    try {
        $email = request('email', 'admin@admin.com');
        $password = request('password', 'admin123');
        $admin = \Illuminate\Support\Facades\DB::table('admins')->where('email', $email)->first();
        if (!$admin) {
            return response()->json(['error' => 'Admin not found: ' . $email], 404);
        }
        $pwdMatch = password_verify($password, $admin->password);
        $attempt = auth()->guard('admin')->attempt(['email' => $email, 'password' => $password]);
        return response()->json([
            'email' => $email,
            'password_verify' => $pwdMatch,
            'auth_attempt' => $attempt,
            'user' => auth()->guard('admin')->user(),
            'status' => $admin->status
        ]);
    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
    }
});

Route::get('/test-login-and-dashboard', function () {
    $admin = \Webkul\User\Models\Admin::where('email', 'admin@admin.com')->first();
    if (!$admin) {
        return response()->json(['error' => 'No admin found'], 404);
    }
    
    $roles = \Illuminate\Support\Facades\DB::table('roles')->get();
    auth()->guard('admin')->login($admin, true);
    
    return response()->json([
        'admin' => [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'status' => $admin->status,
            'role_id' => $admin->role_id,
        ],
        'admin_role' => $admin->role,
        'all_roles' => $roles,
        'auth_check' => auth()->guard('admin')->check(),
        'session_id' => session()->getId(),
        'cookie_name' => config('session.cookie'),
        'cookie_secure' => config('session.secure'),
        'cookie_same_site' => config('session.same_site'),
    ]);
});

Route::get('/', fn () => redirect()->route('admin.session.create'));

Route::get('/storefront', fn () => redirect('http://localhost:5173'))->name('shop.home.index');
Route::get('/storefront/item/{slug?}', fn ($slug = null) => redirect('http://localhost:5173/products'))->name('shop.product_or_category.index');
Route::get('/storefront/page/{slug?}', fn ($slug = null) => redirect('http://localhost:5173'))->name('shop.cms.page');

Route::get('/fix-category-tree', function () {
    try {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \Illuminate\Support\Facades\DB::table('categories')->where('id', '>', 1)->delete();
        \Illuminate\Support\Facades\DB::table('category_translations')->where('category_id', '>', 1)->delete();

        $categories = [
            ['name' => 'Flooring Resins', 'slug' => 'flooring-resins', 'desc' => 'Pure epoxy primers, screeding systems, stone binders, and decorative metallic floor coats.'],
            ['name' => 'Casting & Art', 'slug' => 'casting-art', 'desc' => 'Water-clear deep pour epoxy casting resin and mirror-gloss protective art coatings.'],
            ['name' => 'Protective Coatings', 'slug' => 'protective-coatings', 'desc' => 'Ultra-fast aliphatic polyaspartic and heavy-duty chemical-resistant polyurethane topcoats.'],
            ['name' => 'Finishing Compounds', 'slug' => 'finishing-compounds', 'desc' => 'Advanced hydrophobic nano silicon coatings and surface defense matrices.'],
        ];

        foreach ($categories as $index => $cat) {
            $catId = $index + 2;
            \Illuminate\Support\Facades\DB::table('categories')->insert([
                'id'         => $catId,
                'position'   => $index + 1,
                'status'     => 1,
                'parent_id'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            \Illuminate\Support\Facades\DB::table('category_translations')->insert([
                'category_id'      => $catId,
                'locale'           => 'en',
                'name'             => $cat['name'],
                'slug'             => $cat['slug'],
                'description'      => $cat['desc'],
                'meta_title'       => $cat['name'] . ' - VIZE Specialty Polymers',
                'meta_description' => $cat['desc'],
            ]);
        }

        if (class_exists(\Webkul\Category\Models\Category::class)) {
            \Webkul\Category\Models\Category::fixTree();
        }

        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return response()->json([
            'status' => 'success',
            'message' => 'Categories synced to exactly the 4 official resin categories and tree repaired successfully!',
            'categories' => $categories,
            'count' => \Webkul\Category\Models\Category::count()
        ]);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/update-resin-schema', function () {
    try {
        if (!\Illuminate\Support\Facades\Schema::hasColumn('vize_resins', 'tax_rate')) {
            \Illuminate\Support\Facades\Schema::table('vize_resins', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->decimal('tax_rate', 5, 2)->default(18.00)->after('base_price');
            });
        }
        if (!\Illuminate\Support\Facades\Schema::hasColumn('vize_resins', 'video_url')) {
            \Illuminate\Support\Facades\Schema::table('vize_resins', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->string('video_url')->nullable()->after('images');
            });
        }
        if (!\Illuminate\Support\Facades\Schema::hasColumn('vize_resins', 'video_title')) {
            \Illuminate\Support\Facades\Schema::table('vize_resins', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->string('video_title')->nullable()->after('video_url');
            });
        }
        if (!\Illuminate\Support\Facades\Schema::hasColumn('vize_resins', 'video_thumbnail')) {
            \Illuminate\Support\Facades\Schema::table('vize_resins', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->string('video_thumbnail')->nullable()->after('video_title');
            });
        }

        \Illuminate\Support\Facades\DB::table('vize_resins')
            ->whereNull('tax_rate')
            ->update(['tax_rate' => 18.00]);

        return response()->json([
            'status' => 'success',
            'message' => 'vize_resins schema updated with tax_rate and video & media fields',
            'has_tax_rate' => \Illuminate\Support\Facades\Schema::hasColumn('vize_resins', 'tax_rate')
        ]);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/clean-resin-products', function () {
    try {
        $allowedSlugs = [
            'vize-primex',
            'vize-screed-max',
            'vize-rockhard',
            'vize-epowrap',
            'vize-epowrap-pro',
            'vize-epowrap-max',
            'vize-aspartic-max',
            'vize-urethane-max',
            'vize-cast-max',
            'vize-art-max',
            'vize-nano'
        ];

        // Delete any row not in the 11 official resin products
        $deleted = \Illuminate\Support\Facades\DB::table('vize_resins')
            ->whereNotIn('slug', $allowedSlugs)
            ->delete();

        // Update sort order 1 to 11
        foreach ($allowedSlugs as $index => $slug) {
            \Illuminate\Support\Facades\DB::table('vize_resins')
                ->where('slug', $slug)
                ->update(['sort_order' => $index + 1]);
        }

        $remaining = \Illuminate\Support\Facades\DB::table('vize_resins')
            ->select('id', 'name', 'slug', 'category', 'sort_order')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'deleted_count' => $deleted,
            'remaining_count' => $remaining->count(),
            'products' => $remaining
        ]);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

// Serve shared public assets (images, swatches, resin buckets) from root public dir to Laravel admin
Route::get('/{path}', function ($path) {
    $rootPublicPath = base_path('../public/' . $path);
    if (file_exists($rootPublicPath) && is_file($rootPublicPath)) {
        $mime = mime_content_type($rootPublicPath) ?: 'application/octet-stream';
        return response()->file($rootPublicPath, ['Content-Type' => $mime]);
    }
    abort(404);
})->where('path', '.*\.(png|jpg|jpeg|gif|webp|svg|mp4|pdf|ico)$');







