<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| VIZE Specialty Polymers Unified API Suite
|--------------------------------------------------------------------------
*/

Route::prefix('vize')->group(function () {

    // 1. Status & System Health
    Route::get('/status', function () {
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (\Exception $e) {
            $dbConnected = false;
        }

        return response()->json([
            'success'     => true,
            'application' => 'VIZE Specialty Polymers API Suite',
            'version'     => '1.0.0',
            'database'    => $dbConnected ? 'connected' : 'disconnected',
            'timestamp'   => now()->toIso8601String(),
        ]);
    });

    // 2. Categories
    Route::get('/categories', function () {
        try {
            if (DB::getSchemaBuilder()->hasTable('categories')) {
                $categories = DB::table('categories')
                    ->join('category_translations', 'categories.id', '=', 'category_translations.category_id')
                    ->where('categories.parent_id', 1)
                    ->where('categories.status', 1)
                    ->select('categories.id', 'category_translations.name', 'category_translations.slug', 'category_translations.description')
                    ->orderBy('categories.position', 'asc')
                    ->get();

                if ($categories->isNotEmpty()) {
                    return response()->json(['success' => true, 'data' => $categories]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        // Fallback default VIZE categories
        return response()->json([
            'success' => true,
            'data'    => [
                ['id' => 2, 'name' => 'Flooring Resins', 'slug' => 'flooring-resins'],
                ['id' => 3, 'name' => 'Casting & Art', 'slug' => 'casting-art'],
                ['id' => 4, 'name' => 'Protective Coatings', 'slug' => 'protective-coatings'],
                ['id' => 5, 'name' => 'Finishing Compounds', 'slug' => 'finishing-compounds'],
            ]
        ]);
    });

    // 3. Home Page Videos & Social Reels Hub
    Route::get('/videos', function (Request $request) {
        try {
            if (DB::getSchemaBuilder()->hasTable('vize_videos')) {
                $category = $request->query('category');
                $query = DB::table('vize_videos')->where('is_active', true)->orderBy('sort_order', 'asc')->orderBy('id', 'desc');
                
                if (!empty($category) && $category !== 'All Videos') {
                    $query->where('category', $category);
                }

                $videos = $query->get();

                if ($videos->isNotEmpty()) {
                    $formatted = $videos->map(function ($v) {
                        return [
                            'id'        => 'reel-' . $v->id,
                            'db_id'     => $v->id,
                            'title'     => $v->title,
                            'category'  => $v->category ?? 'Flooring',
                            'platform'  => ucfirst($v->platform ?? 'Instagram'),
                            'handle'    => $v->handle ?? '@vizeresin',
                            'badge'     => $v->badge ?? 'Featured',
                            'url'       => $v->url,
                            'embedUrl'  => $v->embed_url ?? $v->url,
                            'thumbnail' => $v->thumbnail ?? '/process-pour.jpg',
                            'sort_order'=> $v->sort_order,
                        ];
                    });
                    return response()->json(['success' => true, 'data' => $formatted]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        // Default initial video fallback
        $jsonPath = base_path('../src/data/videos.json');
        if (File::exists($jsonPath)) {
            $jsonData = json_decode(File::get($jsonPath), true);
            if (!empty($jsonData)) {
                return response()->json(['success' => true, 'data' => $jsonData]);
            }
        }

        return response()->json([
            'success' => true,
            'data'    => [
                [
                    'id'        => 'reel-1',
                    'title'     => 'Metallic Gold & Ocean Teal Floor Pour',
                    'category'  => 'Flooring',
                    'platform'  => 'Instagram',
                    'handle'    => '@vizeresin',
                    'url'       => 'https://www.instagram.com/reel/DcGpYzNSQvu/?igsi=NHd0ZTh0ZmFmanBn',
                    'embedUrl'  => 'https://www.instagram.com/reel/DcGpYzNSQvu/embed/',
                    'thumbnail' => '/process-pour.jpg',
                    'badge'     => 'Trending Pour',
                ],
                [
                    'id'        => 'reel-2',
                    'title'     => 'Deep Casting Olive Wood River Table',
                    'category'  => 'Casting & Art',
                    'platform'  => 'Instagram',
                    'handle'    => '@vizeresin',
                    'url'       => 'https://www.instagram.com/reel/DaSM54WxHEp/?igsi=MTRoMHFpMmZ4czA2Ng==',
                    'embedUrl'  => 'https://www.instagram.com/reel/DaSM54WxHEp/embed/',
                    'thumbnail' => '/process-trowel.jpg',
                    'badge'     => 'Masterclass',
                ],
                [
                    'id'        => 'reel-3',
                    'title'     => 'Flawless High-Gloss Surface Topcoat',
                    'category'  => 'Protective Coatings',
                    'platform'  => 'Facebook',
                    'handle'    => 'Vize Resins Pro',
                    'url'       => 'https://www.facebook.com/share/r/1CKSp9sd4G/?mibextid=wwXIfr',
                    'embedUrl'  => 'https://www.facebook.com/plugins/video.php?href=' . urlencode('https://www.facebook.com/share/r/1CKSp9sd4G/') . '&show_text=0&width=380',
                    'thumbnail' => '/reel-1-thumb.jpg',
                    'badge'     => 'Pro Technique',
                ],
            ]
        ]);
    });

    Route::post('/videos', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'url'   => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $parsed = \Webkul\Admin\Http\Controllers\VizeVideoController::parseVideoDetails(
            $request->input('url'),
            $request->input('platform'),
            $request->input('thumbnail')
        );

        $id = DB::table('vize_videos')->insertGetId([
            'title'      => $request->input('title'),
            'category'   => $request->input('category', 'Flooring'),
            'platform'   => $parsed['platform'],
            'url'        => $request->input('url'),
            'embed_url'  => $parsed['embed_url'],
            'handle'     => $request->input('handle', '@vizeresin'),
            'badge'      => $request->input('badge', 'Featured Pour'),
            'thumbnail'  => $parsed['thumbnail'],
            'sort_order' => $request->input('sort_order', 0),
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'id' => $id, 'message' => 'Video reel added successfully.'], 201);
    });

    Route::delete('/videos/{id}', function ($id) {
        DB::table('vize_videos')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Video removed successfully.']);
    });

    // 4. Table Tops Custom Studio
    Route::get('/table-tops', function (Request $request) {
        $defaultTableSeeds = [
            [
                'id'          => 1,
                'name'        => 'Ocean 3D Aquatic River Table with Swimming Fish Inlay',
                'title'       => 'Ocean 3D Aquatic River Table with Swimming Fish Inlay',
                'slug'        => 'ocean-3d-aquatic-river-table',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Live-Edge Solid Timber',
                'timber'      => 'Live-Edge Solid Timber',
                'dimensions'  => '7.5 ft × 3.5 ft × 2 in',
                'resin'       => 'Vize SuperCast Deep Pour (Ocean Azure + Wave Effect)',
                'price'       => 0,
                'status'      => 'Made to Order',
                'image_url'   => '/table top/hero.jpg',
                'image'       => '/table top/hero.jpg',
                'images'      => ['/table top/hero.jpg', '/table top/1N2A7888.jpg', '/table top/1N2A7896.jpg'],
                'description' => 'Dynamic oceanic swirl river table featuring handcrafted swimming fish inlays, white wave froth, vibrant sapphire-azure currents, and live-edge timber encapsulation.',
                'desc'        => 'Dynamic oceanic swirl river table featuring handcrafted swimming fish inlays, white wave froth, vibrant sapphire-azure currents, and live-edge timber encapsulation.',
                'is_featured' => true,
            ],
            [
                'id'          => 2,
                'name'        => 'Azure Horizon River Dining Table',
                'title'       => 'Azure Horizon River Dining Table',
                'slug'        => 'azure-horizon-river-dining-table',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Solid Live-Edge Teak',
                'timber'      => 'Solid Live-Edge Teak',
                'dimensions'  => '8 ft × 3.5 ft × 2 in',
                'resin'       => 'Vize SuperCast Deep Pour (Azure Sky)',
                'price'       => 0,
                'status'      => 'Made to Order',
                'image_url'   => '/table top/1N2A7888.jpg',
                'image'       => '/table top/1N2A7888.jpg',
                'images'      => ['/table top/1N2A7888.jpg', '/table top/1N2A7896.jpg', '/table top/1N2A7895.jpg'],
                'description' => 'Grand 8-seater live-edge dining table with brilliant turquoise crystal resin river, precision wood-to-epoxy bond, and matte-black steel X-frame legs.',
                'desc'        => 'Grand 8-seater live-edge dining table with brilliant turquoise crystal resin river, precision wood-to-epoxy bond, and matte-black steel X-frame legs.',
                'is_featured' => true,
            ],
            [
                'id'          => 3,
                'name'        => 'Lilac Pearl Round Live-Edge Coffee Table',
                'title'       => 'Lilac Pearl Round Live-Edge Coffee Table',
                'slug'        => 'lilac-pearl-round-coffee-table',
                'category'    => 'Coffee & Round Tables',
                'wood_type'   => 'Cross-Cut Timber Slab',
                'timber'      => 'Cross-Cut Timber Slab',
                'dimensions'  => '36" Diameter × 18" H',
                'resin'       => 'Vize Cast + Lilac Pearl Powder',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/1N2A7925.jpg',
                'image'       => '/table top/1N2A7925.jpg',
                'images'      => ['/table top/1N2A7925.jpg', '/table top/1N2A7942.jpg', '/table top/1N2A7918.jpg', '/table top/1N2A7920.jpg', '/table top/1N2A7935.jpg'],
                'description' => 'Organic circular cross-cut slab infused with pearlescent lavender swirl resin, satin mirror clear coat, and smooth flush edge contours.',
                'desc'        => 'Organic circular cross-cut slab infused with pearlescent lavender swirl resin, satin mirror clear coat, and smooth flush edge contours.',
                'is_featured' => true,
            ],
            [
                'id'          => 4,
                'name'        => 'Freeform Organic Burl Resin Centerpiece Table',
                'title'       => 'Freeform Organic Burl Resin Centerpiece Table',
                'slug'        => 'freeform-organic-burl-resin-table',
                'category'    => 'Coffee & Round Tables',
                'wood_type'   => 'Cross-Cut Live-Edge Burl Slab',
                'timber'      => 'Cross-Cut Live-Edge Burl Slab',
                'dimensions'  => '42" Diameter × 18" H',
                'resin'       => 'Vize Cast (Opalescent Jade-Pearl & Sapphire Veins)',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/IMG20230215154153.jpg',
                'image'       => '/table top/IMG20230215154153.jpg',
                'images'      => ['/table top/IMG20230215154153.jpg', '/table top/IMG20230204113707.jpg', '/table top/IMG20230208114809.jpg', '/table top/IMG20230211201059.jpg'],
                'description' => 'Sculptural cross-cut organic tree slab featuring an opalescent jade-pearl resin core, natural burl inclusions, lightning-blue fracture fills, and custom bronze spider legs.',
                'desc'        => 'Sculptural cross-cut organic tree slab featuring an opalescent jade-pearl resin core, natural burl inclusions, lightning-blue fracture fills, and custom bronze spider legs.',
                'is_featured' => true,
            ],
            [
                'id'          => 5,
                'name'        => 'Smoky Quartz Square Coffee Table',
                'title'       => 'Smoky Quartz Square Coffee Table',
                'slug'        => 'smoky-quartz-square-coffee-table',
                'category'    => 'Coffee & Round Tables',
                'wood_type'   => 'Hardwood River Slab',
                'timber'      => 'Hardwood River Slab',
                'dimensions'  => '30" × 30" × 16" H',
                'resin'       => 'Vize Cast (Smoky Metallic Bronze)',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/1N2A7964.jpg',
                'image'       => '/table top/1N2A7964.jpg',
                'images'      => ['/table top/1N2A7964.jpg', '/table top/1N2A7965.jpg'],
                'description' => 'Modern square lounge table featuring metallic charcoal bronze river stream, beveled perimeter, and ultra-flat high-gloss epoxy flood coat.',
                'desc'        => 'Modern square lounge table featuring metallic charcoal bronze river stream, beveled perimeter, and ultra-flat high-gloss epoxy flood coat.',
                'is_featured' => false,
            ],
            [
                'id'          => 6,
                'name'        => 'Emerald Stream C-Frame Sofa Table',
                'title'       => 'Emerald Stream C-Frame Sofa Table',
                'slug'        => 'emerald-stream-c-frame-table',
                'category'    => 'Side & C-Tables',
                'wood_type'   => 'Live-Edge Burl Wood',
                'timber'      => 'Live-Edge Burl Wood',
                'dimensions'  => '18" × 12" × 24" H',
                'resin'       => 'Vize Cast (Emerald Spark)',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/1N2A8033.jpg',
                'image'       => '/table top/1N2A8033.jpg',
                'images'      => ['/table top/1N2A8033.jpg', '/table top/1N2A8039.jpg', '/table top/1N2A8051.jpg', '/table top/1N2A8067.jpg'],
                'description' => 'Sleek ergonomic cantilever C-table designed to slide neatly over couch arms, cast with emerald metallic mica flowing along natural wood grain.',
                'desc'        => 'Sleek ergonomic cantilever C-table designed to slide neatly over couch arms, cast with emerald metallic mica flowing along natural wood grain.',
                'is_featured' => false,
            ],
            [
                'id'          => 7,
                'name'        => 'Sapphire Midnight Square Accent Table',
                'title'       => 'Sapphire Midnight Square Accent Table',
                'slug'        => 'sapphire-midnight-square-table',
                'category'    => 'Side & C-Tables',
                'wood_type'   => 'Solid Hardwood Slab',
                'timber'      => 'Solid Hardwood Slab',
                'dimensions'  => '20" × 20" × 20" H',
                'resin'       => 'Vize Cast (Midnight Sapphire)',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/1N2A7986.jpg',
                'image'       => '/table top/1N2A7986.jpg',
                'images'      => ['/table top/1N2A7986.jpg', '/table top/1N2A7987.jpg', '/table top/1N2A7998.jpg', '/table top/1N2A8019.jpg'],
                'description' => 'Deep midnight blue translucent resin channel set in rich brown timber on matte-black geometric legs with seamless fiber encapsulation.',
                'desc'        => 'Deep midnight blue translucent resin channel set in rich brown timber on matte-black geometric legs with seamless fiber encapsulation.',
                'is_featured' => false,
            ],
            [
                'id'          => 8,
                'name'        => 'Monolithic Executive Conference Table',
                'title'       => 'Monolithic Executive Conference Table',
                'slug'        => 'monolithic-executive-conference-table',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Grand Heritage Teak Slabs',
                'timber'      => 'Grand Heritage Teak Slabs',
                'dimensions'  => '10 ft × 4 ft × 2.5 in',
                'resin'       => 'Vize SuperCast Single Deep Pour',
                'price'       => 0,
                'status'      => 'Made to Order',
                'image_url'   => '/table top/IMG20230303141433.jpg',
                'image'       => '/table top/IMG20230303141433.jpg',
                'images'      => ['/table top/IMG20230303141433.jpg', '/table top/IMG20230303141418.jpg', '/table top/IMG20230303141456.jpg'],
                'description' => 'Custom 10-foot boardroom centerpiece with massive twin slabs and illuminated crystal turquoise resin core for luxury executive offices.',
                'desc'        => 'Custom 10-foot boardroom centerpiece with massive twin slabs and illuminated crystal turquoise resin core for luxury executive offices.',
                'is_featured' => false,
            ],
            [
                'id'          => 9,
                'name'        => 'Ocean Marine Blue River Slab',
                'title'       => 'Ocean Marine Blue River Slab',
                'slug'        => 'ocean-marine-blue-river-slab',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Solid Natural Teak Slab',
                'timber'      => 'Solid Natural Teak Slab',
                'dimensions'  => '7 ft × 3 ft × 2.2 in',
                'resin'       => 'Vize SuperCast (Ocean Marine)',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/IMG20230106134803.jpg',
                'image'       => '/table top/IMG20230106134803.jpg',
                'images'      => ['/table top/IMG20230106134803.jpg', '/table top/IMG20230106140805.jpg', '/table top/IMG20230108170006.jpg'],
                'description' => 'Daylight workshop showcase of full-length teak slab featuring multi-toned oceanic blue resin and high-gloss protective finish.',
                'desc'        => 'Daylight workshop showcase of full-length teak slab featuring multi-toned oceanic blue resin and high-gloss protective finish.',
                'is_featured' => false,
            ],
            [
                'id'          => 10,
                'name'        => 'Golden Timber & Turquoise River Dining Table',
                'title'       => 'Golden Timber & Turquoise River Dining Table',
                'slug'        => 'golden-timber-turquoise-river-table',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Golden Honey Hardwood',
                'timber'      => 'Golden Honey Hardwood',
                'dimensions'  => '7.5 ft × 3.2 ft',
                'resin'       => 'Vize SuperCast Deep Pour',
                'price'       => 0,
                'status'      => 'Made to Order',
                'image_url'   => '/table top/IMG20230319124730.jpg',
                'image'       => '/table top/IMG20230319124730.jpg',
                'images'      => ['/table top/IMG20230319124730.jpg', '/table top/IMG20230319122451.jpg'],
                'description' => 'Golden honey wood tones combined with dynamic turquoise resin river during final polish and buffing in workshop studio setting.',
                'desc'        => 'Golden honey wood tones combined with dynamic turquoise resin river during final polish and buffing in workshop studio setting.',
                'is_featured' => false,
            ],
            [
                'id'          => 11,
                'name'        => '45° Chamfer Bevel & Mirror Gloss Clarity',
                'title'       => '45° Chamfer Bevel & Mirror Gloss Clarity',
                'slug'        => '45-deg-chamfer-bevel-clarity',
                'category'    => 'Macro Clarity & Edge Details',
                'wood_type'   => 'Chamfered Live Edge',
                'timber'      => 'Chamfered Live Edge',
                'dimensions'  => 'Macro Close-Up',
                'resin'       => 'Vize Cast + CutMax & ShineMax',
                'price'       => 0,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table top/1N2A8107.jpg',
                'image'       => '/table top/1N2A8107.jpg',
                'images'      => ['/table top/1N2A8107.jpg', '/table top/1N2A8104.jpg', '/table top/1N2A8118.jpg', '/table top/1N2A8144.jpg'],
                'description' => 'Macro lens detail showing zero-bubble optical clarity, hand-buffed 45-degree chamfer edge, and high-gloss scratch-resistant topcoat.',
                'desc'        => 'Macro lens detail showing zero-bubble optical clarity, hand-buffed 45-degree chamfer edge, and high-gloss scratch-resistant topcoat.',
                'is_featured' => false,
            ],
            [
                'id'          => 12,
                'name'        => 'Handcrafted Live-Edge Workshop Creations',
                'title'       => 'Handcrafted Live-Edge Workshop Creations',
                'slug'        => 'handcrafted-live-edge-workshop-creations',
                'category'    => 'Dining & River Tables',
                'wood_type'   => 'Seasoned Hardwood Slabs',
                'timber'      => 'Seasoned Hardwood Slabs',
                'dimensions'  => 'Custom Multi-Scale',
                'resin'       => 'Vize SuperCast & Vize Coat Max',
                'price'       => 0,
                'status'      => 'Made to Order',
                'image_url'   => '/table top/IMG20230131191813.jpg',
                'image'       => '/table top/IMG20230131191813.jpg',
                'images'      => ['/table top/IMG20230131191813.jpg', '/table top/IMG20230131191816.jpg', '/table top/IMG20230227160656.jpg', '/table top/IMG20230228102244.jpg'],
                'description' => 'Bespoke live-edge slabs during precision casting, flattening, leveling, and curing phases at the VIZE studio.',
                'desc'        => 'Bespoke live-edge slabs during precision casting, flattening, leveling, and curing phases at the VIZE studio.',
                'is_featured' => false,
            ]
        ];

        try {
            if (DB::getSchemaBuilder()->hasTable('vize_table_tops')) {
                // Ensure columns exist
                try {
                    DB::statement("ALTER TABLE vize_table_tops ADD COLUMN category VARCHAR(100) NULL DEFAULT 'Dining & River Tables'");
                } catch (\Exception $e) {}
                try {
                    DB::statement("ALTER TABLE vize_table_tops ADD COLUMN resin VARCHAR(100) NULL DEFAULT 'Vize SuperCast Deep Pour'");
                } catch (\Exception $e) {}
                try {
                    DB::statement("ALTER TABLE vize_table_tops ADD COLUMN images LONGTEXT NULL");
                } catch (\Exception $e) {}

                $count = DB::table('vize_table_tops')->count();
                if ($count === 0) {
                    foreach ($defaultTableSeeds as $tSeed) {
                        DB::table('vize_table_tops')->insert([
                            'name'        => $tSeed['name'],
                            'slug'        => $tSeed['slug'],
                            'category'    => $tSeed['category'],
                            'wood_type'   => $tSeed['wood_type'],
                            'dimensions'  => $tSeed['dimensions'],
                            'resin'       => $tSeed['resin'],
                            'price'       => 0,
                            'status'      => $tSeed['status'],
                            'image_url'   => $tSeed['image_url'],
                            'images'      => json_encode($tSeed['images']),
                            'description' => $tSeed['description'],
                            'is_featured' => $tSeed['is_featured'] ? 1 : 0,
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }

                $query = DB::table('vize_table_tops');
                if ($request->has('featured')) {
                    $query->where('is_featured', true);
                }
                $tables = $query->orderBy('id', 'asc')->get();
                if ($tables->isNotEmpty()) {
                    $tables->transform(function ($item) {
                        $imgs = [];
                        if (!empty($item->images)) {
                            $decoded = json_decode($item->images, true);
                            if (is_array($decoded)) $imgs = $decoded;
                        }
                        if (empty($imgs) && !empty($item->image_url)) {
                            $imgs = [$item->image_url];
                        }

                        // Sanitize only broken legacy /table-tops/*.png paths (do NOT override /uploads/table-tops/!)
                        $imgs = array_map(function($img) {
                            if (is_string($img)) {
                                if (strpos($img, '/uploads/') === 0 || strpos($img, '/table top/') === 0 || strpos($img, 'http') === 0) {
                                    return $img;
                                }
                                if (strpos($img, '/table-tops/') === 0) {
                                    if (strpos($img, 'glacier') !== false) return '/table top/1N2A7925.jpg';
                                    if (strpos($img, 'emerald') !== false) return '/table top/1N2A8033.jpg';
                                    return '/table top/1N2A7888.jpg';
                                }
                            }
                            return $img ?: '/table top/1N2A7888.jpg';
                        }, $imgs);

                        if (empty($imgs)) {
                            $imgs = ['/table top/1N2A7888.jpg'];
                        }

                        $item->images = array_values(array_filter($imgs));
                        $item->image = $item->images[0] ?? '/table top/1N2A7888.jpg';
                        $item->category = $item->category ?? 'Dining & River Tables';
                        $item->timber = $item->wood_type ?? 'Live-Edge Timber';
                        $item->resin = $item->resin ?? 'Vize SuperCast Deep Pour';
                        $item->title = $item->name;
                        $item->desc = $item->description;
                        return $item;
                    });
                    return response()->json(['success' => true, 'data' => $tables]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        return response()->json([
            'success' => true,
            'data'    => $defaultTableSeeds
        ]);
    });

    Route::post('/table-tops/inquire', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'customer_name'        => 'required|string|max:150',
            'email'                => 'required|email|max:150',
            'phone'                => 'required|string|max:30',
            'requested_dimensions' => 'nullable|string|max:100',
            'wood_preference'      => 'nullable|string|max:100',
            'budget'               => 'nullable|string|max:100',
            'message'              => 'nullable|string|max:2000',
            'table_id'             => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id = DB::table('vize_table_inquiries')->insertGetId([
            'table_id'             => $request->input('table_id'),
            'customer_name'        => $request->input('customer_name'),
            'email'                => $request->input('email'),
            'phone'                => $request->input('phone'),
            'requested_dimensions' => $request->input('requested_dimensions'),
            'wood_preference'      => $request->input('wood_preference'),
            'budget'               => $request->input('budget'),
            'message'              => $request->input('message'),
            'status'               => 'New',
            'created_at'           => now(),
            'updated_at'           => now(),
        ]);

        return response()->json([
            'success' => true,
            'id'      => $id,
            'message' => 'Your custom table design request has been received. Our Master Craftsman will share 3D concepts and quotation shortly.'
        ], 201);
    });

    // 5. Workshops & Training Courses
    Route::get('/courses', function () {
        try {
            if (Schema::hasTable('vize_courses')) {
                $courses = DB::table('vize_courses')
                    ->where('status', 'Active')
                    ->orderBy('sort_order', 'asc')
                    ->orderBy('id', 'asc')
                    ->get();

                if ($courses->isNotEmpty()) {
                    $formatted = $courses->map(function ($c) {
                        $item = [
                            'id'               => $c->slug,
                            'aliases'          => [$c->slug, Str::slug($c->name)],
                            'name'             => $c->name,
                            'provider'         => $c->provider,
                            'category'         => $c->category,
                            'duration'         => $c->duration,
                            'date'             => $c->date,
                            'location'         => $c->location,
                            'seats'            => $c->seats,
                            'level'            => $c->level,
                            'shortDesc'        => $c->short_desc,
                            'overview'         => $c->overview,
                            'keyHighlight'     => $c->key_highlight,
                            'keyHighlightDesc' => $c->key_highlight_desc,
                            'badge'            => $c->badge,
                            'batchNote'        => $c->batch_note,
                            'image'            => $c->image,
                            'curriculum'       => json_decode($c->curriculum, true) ?: [],
                            'inclusions'       => json_decode($c->inclusions, true) ?: [],
                            'whoCanJoin'       => json_decode($c->who_can_join, true) ?: [],
                            'customFields'     => json_decode($c->custom_fields ?? '[]', true) ?: [],
                        ];

                        if ($c->price) {
                            $item['price'] = (float) $c->price;
                        }

                        $techsOrModules = json_decode($c->techniques_or_modules, true);
                        if (is_array($techsOrModules) && count($techsOrModules) > 0) {
                            if (isset($techsOrModules[0]['num'])) {
                                $item['trainingModules'] = $techsOrModules;
                            } else {
                                $item['flooringTechniques'] = $techsOrModules;
                            }
                        }

                        return $item;
                    });

                    return response()->json($formatted);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        $filePath = base_path('../src/data/courses.json');
        if (File::exists($filePath)) {
            return response()->json(json_decode(File::get($filePath), true));
        }

        return response()->json([], 200);
    });

    Route::get('/workshops', function () {
        try {
            if (Schema::hasTable('vize_courses')) {
                $courses = DB::table('vize_courses')
                    ->where('status', 'Active')
                    ->orderBy('sort_order', 'asc')
                    ->orderBy('id', 'asc')
                    ->get();

                if ($courses->isNotEmpty()) {
                    $formatted = $courses->map(function ($c) {
                        $item = [
                            'id'               => $c->slug,
                            'aliases'          => [$c->slug, Str::slug($c->name)],
                            'name'             => $c->name,
                            'provider'         => $c->provider,
                            'category'         => $c->category,
                            'duration'         => $c->duration,
                            'date'             => $c->date,
                            'location'         => $c->location,
                            'seats'            => $c->seats,
                            'level'            => $c->level,
                            'shortDesc'        => $c->short_desc,
                            'overview'         => $c->overview,
                            'keyHighlight'     => $c->key_highlight,
                            'keyHighlightDesc' => $c->key_highlight_desc,
                            'badge'            => $c->badge,
                            'batchNote'        => $c->batch_note,
                            'image'            => $c->image,
                            'curriculum'       => json_decode($c->curriculum, true) ?: [],
                            'inclusions'       => json_decode($c->inclusions, true) ?: [],
                            'whoCanJoin'       => json_decode($c->who_can_join, true) ?: [],
                            'customFields'     => json_decode($c->custom_fields ?? '[]', true) ?: [],
                            'batches'          => DB::table('vize_workshop_batches')->where('workshop_id', $c->id)->orderBy('start_date', 'asc')->get(),
                        ];

                        if ($c->price) {
                            $item['price'] = (float) $c->price;
                        }

                        $techsOrModules = json_decode($c->techniques_or_modules, true);
                        if (is_array($techsOrModules) && count($techsOrModules) > 0) {
                            if (isset($techsOrModules[0]['num'])) {
                                $item['trainingModules'] = $techsOrModules;
                            } else {
                                $item['flooringTechniques'] = $techsOrModules;
                            }
                        }

                        return $item;
                    });

                    return response()->json(['success' => true, 'data' => $formatted]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        $filePath = base_path('../src/data/courses.json');
        if (File::exists($filePath)) {
            return response()->json(['success' => true, 'data' => json_decode(File::get($filePath), true)]);
        }

        return response()->json(['success' => false, 'message' => 'Workshops data not found.'], 404);
    });

    Route::post('/workshops/admit', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:150',
            'email'        => 'required|email|max:150',
            'phone'        => 'required|string|max:30',
            'whatsapp'     => 'nullable|string|max:30',
            'batch_id'     => 'nullable|integer',
            'notes'        => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id = DB::table('vize_workshop_admissions')->insertGetId([
            'batch_id'       => $request->input('batch_id'),
            'student_name'   => $request->input('student_name'),
            'email'          => $request->input('email'),
            'phone'          => $request->input('phone'),
            'whatsapp'       => $request->input('whatsapp') ?? $request->input('phone'),
            'payment_status' => 'Pending',
            'amount_paid'    => 0.00,
            'notes'          => $request->input('notes'),
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        // Increment booked seat count if batch exists
        if ($request->input('batch_id')) {
            DB::table('vize_workshop_batches')->where('id', $request->input('batch_id'))->increment('booked_seats');
        }

        return response()->json([
            'success' => true,
            'id'      => $id,
            'message' => 'Seat registration inquiry received. Our admissions team will share the workshop itinerary and payment link on WhatsApp.'
        ], 201);
    });

    // 6. Colors & Pigments Catalog & Management API
    Route::get('/pigments', function (Request $request) {
        try {
            if (Schema::hasTable('vize_pigment_categories') && DB::table('vize_pigment_categories')->count() > 0) {
                $categories = DB::table('vize_pigment_categories')->where('is_active', true)->orderBy('sort_order', 'asc')->get();
                $shades = DB::table('vize_pigment_shades')->where('is_active', true)->orderBy('sort_order', 'asc')->get();

                $result = [];
                foreach ($categories as $cat) {
                    $catShades = $shades->where('category_slug', $cat->slug)->map(function ($s) {
                        return [
                            'id'          => $s->code ? Str::slug($s->code) : Str::slug($s->name),
                            'name'        => $s->name,
                            'code'        => $s->code,
                            'hex'         => $s->hex_color,
                            'image'       => $s->image_url,
                            'preview'     => $s->preview_url,
                            'desc'        => $s->description,
                            'stock_status'=> $s->stock_status ?? 'In Stock',
                        ];
                    })->values()->all();

                    $result[] = [
                        'id'       => $cat->slug,
                        'name'     => $cat->name,
                        'slug'     => $cat->slug,
                        'badge'    => $cat->badge,
                        'subtitle' => $cat->subtitle,
                        'sizes'    => json_decode($cat->pack_sizes, true) ?? [],
                        'shades'   => $catShades,
                    ];
                }

                if (!empty($result)) {
                    return response()->json(['success' => true, 'data' => $result]);
                }
            }
        } catch (\Throwable $e) {
            report($e);
        }

        $filePath = base_path('../src/data/pigments.json');
        if (File::exists($filePath)) {
            $data = json_decode(File::get($filePath), true);
            return response()->json(['success' => true, 'data' => $data]);
        }

        return response()->json(['success' => true, 'data' => []]);
    });

    Route::post('/pigments/categories', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:150',
            'badge'    => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:500',
            'sizes'    => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $slug = Str::slug($request->input('name'));
        $sizes = $request->input('sizes', [
            ['id' => '500g', 'label' => '500 Grams', 'price' => 500, 'weight' => '500g'],
            ['id' => '1kg', 'label' => '1 Kilogram', 'price' => 1000, 'weight' => '1kg']
        ]);

        $id = DB::table('vize_pigment_categories')->insertGetId([
            'name'       => $request->input('name'),
            'slug'       => $slug,
            'badge'      => $request->input('badge', strtoupper($request->input('name')) . ' FINISH'),
            'subtitle'   => $request->input('subtitle'),
            'pack_sizes' => json_encode($sizes),
            'sort_order' => DB::table('vize_pigment_categories')->max('sort_order') + 1,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'id' => $id, 'slug' => $slug, 'message' => 'Category created successfully.'], 201);
    });

    Route::post('/pigments/shades', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'category_slug' => 'required|string',
            'name'          => 'required|string|max:150',
            'hex_color'     => 'nullable|string',
            'image_url'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $imageUrl = $request->input('image_url');
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
            $targetDir = base_path('../public/colors/uploads');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $file->move($targetDir, $fileName);
            $imageUrl = '/colors/uploads/' . $fileName;
        }

        $id = DB::table('vize_pigment_shades')->insertGetId([
            'category_slug' => $request->input('category_slug'),
            'name'          => $request->input('name'),
            'code'          => $request->input('code'),
            'hex_color'     => $request->input('hex_color', '#102B30'),
            'image_url'     => $imageUrl ?? ('/colors/' . $request->input('name') . '.png'),
            'preview_url'   => $request->input('preview_url') ?? $imageUrl,
            'description'   => $request->input('description'),
            'stock_status'  => $request->input('stock_status', 'In Stock'),
            'sort_order'    => DB::table('vize_pigment_shades')->where('category_slug', $request->input('category_slug'))->max('sort_order') + 1,
            'is_active'     => true,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        return response()->json(['success' => true, 'id' => $id, 'message' => 'Shade created successfully.'], 201);
    });

    // 7. Showcase & Bento Portfolio Gallery
    Route::get('/showcase', function () {
        try {
            if (DB::getSchemaBuilder()->hasTable('vize_showcase')) {
                $showcases = DB::table('vize_showcase')->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();
                if ($showcases->isNotEmpty()) {
                    return response()->json(['success' => true, 'data' => $showcases]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        $filePath = base_path('../src/data/showcase.json');
        if (File::exists($filePath)) {
            return response()->json(['success' => true, 'data' => json_decode(File::get($filePath), true)]);
        }

        return response()->json(['success' => false, 'message' => 'Showcase data not found.'], 404);
    });

    Route::post('/showcase/inquire', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'client_name'    => 'required|string|max:150',
            'email'          => 'required|email|max:150',
            'phone'          => 'required|string|max:30',
            'project_type'   => 'nullable|string|max:100',
            'specifications' => 'nullable|string|max:2000',
            'showcase_id'    => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id = DB::table('vize_showcase_inquiries')->insertGetId([
            'showcase_id'          => $request->input('showcase_id'),
            'client_name'          => $request->input('client_name'),
            'email'                => $request->input('email'),
            'phone'                => $request->input('phone'),
            'project_type'         => $request->input('project_type', 'Bespoke Project'),
            'estimated_dimensions' => $request->input('estimated_dimensions'),
            'budget_range'         => $request->input('budget_range'),
            'specifications'       => $request->input('specifications'),
            'status'               => 'New',
            'created_at'           => now(),
            'updated_at'           => now(),
        ]);

        return response()->json([
            'success' => true,
            'id'      => $id,
            'message' => 'Your bespoke commission request has been received. Our Master Studio artisan will connect on WhatsApp with material swatches and preliminary 3D rendering.'
        ], 201);
    });

    // 7. Polymer Products & Resins Catalog
    Route::get('/products', function (Request $request) {
        $category = $request->query('category');

        try {
            if (DB::getSchemaBuilder()->hasTable('vize_resins')) {
                $query = DB::table('vize_resins');

                if ($category) {
                    $query->where(function ($q) use ($category) {
                        $q->where('category', $category)
                          ->orWhere('application_category', $category);
                    });
                }

                $resins = $query->orderBy('sort_order', 'asc')->get();

                if ($resins->isNotEmpty()) {
                    $resins->transform(function ($item) {
                        $item->images = json_decode($item->images, true) ?? [];
                        $item->features = json_decode($item->features ?? '[]', true) ?? [];
                        $item->id = $item->slug;
                        $item->brand = $item->brand ?? $item->name;
                        $item->suffix = $item->suffix ?? null;
                        $item->tagline = $item->tagline ?? null;
                        $item->chemistry = $item->chemistry ?? null;
                        $item->coverage = $item->coverage ?? ($item->sqft_coverage ? ($item->sqft_coverage . ' sq.ft') : null);
                        $item->applicationCategory = $item->application_category;
                        $item->applicationTag = $item->application_tag;
                        $item->cureTime = $item->cure_time;
                        $item->potLife = $item->pot_life;
                        $item->mixRatio = $item->mix_ratio;
                        $item->packQty = $item->pack_qty;
                        $item->packComposition = $item->pack_composition;
                        $item->basePrice = $item->base_price;
                        $item->pricePerKg = $item->price_per_kg;
                        $item->tax_rate = isset($item->tax_rate) && $item->tax_rate !== null ? (float) $item->tax_rate : 18.0;
                        $item->taxRate = $item->tax_rate;
                        $item->sqftCoverage = $item->sqft_coverage;
                        $item->inStock = (bool) $item->in_stock;
                        $item->aboutText = $item->about_text;
                        $item->video = !empty($item->video_url) ? [
                            'src'       => $item->video_url,
                            'title'     => $item->video_title ?? 'Product Application Guide',
                            'thumbnail' => $item->video_thumbnail ?? ($item->images[0] ?? '/process-trowel.jpg'),
                        ] : null;
                        return $item;
                    });

                    return response()->json(['success' => true, 'count' => count($resins), 'data' => $resins]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        $filePath = base_path('../src/data/products.json');
        if (File::exists($filePath)) {
            $data = json_decode(File::get($filePath), true);

            if ($category) {
                $filtered = array_values(array_filter($data, function ($item) use ($category) {
                    return (isset($item['category']) && strtolower($item['category']) === strtolower($category))
                        || (isset($item['applicationCategory']) && strtolower($item['applicationCategory']) === strtolower($category));
                }));
                return response()->json(['success' => true, 'count' => count($filtered), 'data' => $filtered]);
            }

            return response()->json(['success' => true, 'count' => count($data), 'data' => $data]);
        }

        return response()->json(['success' => false, 'message' => 'Products data not found.'], 404);
    });

    Route::get('/products/{id}', function ($id) {
        try {
            if (DB::getSchemaBuilder()->hasTable('vize_resins')) {
                $item = DB::table('vize_resins')
                    ->where('slug', $id)
                    ->orWhere('sku', $id)
                    ->orWhere('id', $id)
                    ->first();

                if ($item) {
                    $item->images = json_decode($item->images, true) ?? [];
                    $item->features = json_decode($item->features ?? '[]', true) ?? [];
                    $item->id = $item->slug;
                    $item->brand = $item->brand ?? $item->name;
                    $item->suffix = $item->suffix ?? null;
                    $item->tagline = $item->tagline ?? null;
                    $item->chemistry = $item->chemistry ?? null;
                    $item->coverage = $item->coverage ?? ($item->sqft_coverage ? ($item->sqft_coverage . ' sq.ft') : null);
                    $item->applicationCategory = $item->application_category;
                    $item->applicationTag = $item->application_tag;
                    $item->cureTime = $item->cure_time;
                    $item->potLife = $item->pot_life;
                    $item->mixRatio = $item->mix_ratio;
                    $item->packQty = $item->pack_qty;
                    $item->packComposition = $item->pack_composition;
                    $item->basePrice = $item->base_price;
                    $item->pricePerKg = $item->price_per_kg;
                    $item->tax_rate = isset($item->tax_rate) && $item->tax_rate !== null ? (float) $item->tax_rate : 18.0;
                    $item->taxRate = $item->tax_rate;
                    $item->sqftCoverage = $item->sqft_coverage;
                    $item->inStock = (bool) $item->in_stock;
                    $item->aboutText = $item->about_text;
                    $item->video = !empty($item->video_url) ? [
                        'src'       => $item->video_url,
                        'title'     => $item->video_title ?? 'Product Application Guide',
                        'thumbnail' => $item->video_thumbnail ?? ($item->images[0] ?? '/process-trowel.jpg'),
                    ] : null;

                    return response()->json(['success' => true, 'data' => $item]);
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        $filePath = base_path('../src/data/products.json');
        if (File::exists($filePath)) {
            $data = json_decode(File::get($filePath), true);
            $found = collect($data)->first(function ($p) use ($id) {
                return (isset($p['id']) && strtolower($p['id']) === strtolower($id))
                    || (isset($p['aliases']) && in_array(strtolower($id), array_map('strtolower', $p['aliases'])));
            });

            if ($found) {
                return response()->json(['success' => true, 'data' => $found]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
    });

    // 8. General Inquiries
    Route::post('/inquiries', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:150',
            'email'        => 'required|email|max:150',
            'phone'        => 'nullable|string|max:30',
            'service_type' => 'nullable|string|max:100',
            'message'      => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $inquiryData = [
            'name'         => $request->input('name'),
            'email'        => $request->input('email'),
            'phone'        => $request->input('phone'),
            'service_type' => $request->input('service_type', 'General Inquiry'),
            'message'      => $request->input('message'),
            'created_at'   => now(),
            'updated_at'   => now(),
        ];

        try {
            if (!DB::getSchemaBuilder()->hasTable('vize_inquiries')) {
                DB::statement("CREATE TABLE IF NOT EXISTS vize_inquiries (
                    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(50) NULL,
                    service_type VARCHAR(150) DEFAULT 'General Inquiry',
                    message TEXT NULL,
                    status VARCHAR(50) DEFAULT 'New',
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL
                )");
            }

            DB::table('vize_inquiries')->insert([
                'name'         => $request->input('name'),
                'email'        => $request->input('email'),
                'phone'        => $request->input('phone'),
                'service_type' => $request->input('service_type', 'General Inquiry'),
                'message'      => $request->input('message'),
                'status'       => 'New',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            if (DB::getSchemaBuilder()->hasTable('customer_notes')) {
                DB::table('customer_notes')->insert([
                    'note'       => json_encode($inquiryData),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            report($e);
        }

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been received. Our technical polymer specialist will contact you shortly.',
            'data'    => $inquiryData,
        ], 201);
    });

});
