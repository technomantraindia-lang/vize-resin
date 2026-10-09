<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizeOfferController extends Controller
{
    /**
     * Ensure database table exists with discount_percent, target_product_id & applicable_category support.
     */
    protected function ensureTablesAndData()
    {
        try {
            if (!Schema::hasTable('vize_offers')) {
                Schema::create('vize_offers', function ($table) {
                    $table->id();
                    $table->string('title')->nullable();
                    $table->string('badge')->nullable()->default('SPECIAL OFFER');
                    $table->integer('discount_percent')->default(0);
                    $table->string('applicable_category')->default('all'); // all, resins, single_product, pigments, table_tops
                    $table->string('target_product_id')->nullable();
                    $table->text('description')->nullable();
                    $table->longText('custom_fields')->nullable();
                    $table->string('button_text')->default('Shop Now');
                    $table->string('button_link')->default('/resins');
                    $table->string('image_url')->nullable();
                    $table->boolean('is_active')->default(true);
                    $table->integer('sort_order')->default(1);
                    $table->timestamps();
                });
            } else {
                // Inspect actual existing columns in MySQL
                $rawCols = DB::select("SHOW COLUMNS FROM `vize_offers`");
                $existingCols = [];
                foreach ($rawCols as $rc) {
                    $field = is_object($rc) ? ($rc->Field ?? '') : ($rc['Field'] ?? '');
                    if (!empty($field)) {
                        $existingCols[strtolower($field)] = true;
                    }
                }

                // Add any missing columns WITHOUT fragile 'AFTER' clause
                $columnsToAdd = [
                    'title'               => "VARCHAR(255) NULL",
                    'badge'               => "VARCHAR(255) NULL DEFAULT 'SPECIAL OFFER'",
                    'discount_percent'    => "INT DEFAULT 0",
                    'applicable_category' => "VARCHAR(191) DEFAULT 'all'",
                    'target_product_id'   => "VARCHAR(255) NULL",
                    'description'         => "TEXT NULL",
                    'custom_fields'       => "LONGTEXT NULL",
                    'button_text'         => "VARCHAR(255) DEFAULT 'Shop Now'",
                    'button_link'         => "VARCHAR(255) DEFAULT '/resins'",
                    'image_url'           => "VARCHAR(255) NULL",
                    'is_active'           => "TINYINT(1) DEFAULT 1",
                    'sort_order'          => "INT DEFAULT 1",
                ];

                foreach ($columnsToAdd as $col => $sqlType) {
                    if (!isset($existingCols[strtolower($col)])) {
                        try {
                            DB::statement("ALTER TABLE `vize_offers` ADD COLUMN `{$col}` {$sqlType}");
                        } catch (\Throwable $e) {}
                    }
                }

                // Synchronize legacy column names if present
                try {
                    $refreshed = DB::select("SHOW COLUMNS FROM `vize_offers`");
                    $curList = array_map(function ($c) {
                        return strtolower(is_object($c) ? ($c->Field ?? '') : ($c['Field'] ?? ''));
                    }, $refreshed);

                    if (in_array('headline', $curList) && in_array('title', $curList)) {
                        DB::statement("UPDATE `vize_offers` SET `title` = `headline` WHERE (`title` IS NULL OR `title` = '') AND `headline` IS NOT NULL");
                    }
                    if (in_array('discount_badge', $curList) && in_array('badge', $curList)) {
                        DB::statement("UPDATE `vize_offers` SET `badge` = `discount_badge` WHERE (`badge` IS NULL OR `badge` = '') AND `discount_badge` IS NOT NULL");
                    }
                    if (in_array('cta_text', $curList) && in_array('button_text', $curList)) {
                        DB::statement("UPDATE `vize_offers` SET `button_text` = `cta_text` WHERE (`button_text` IS NULL OR `button_text` = '') AND `cta_text` IS NOT NULL");
                    }
                    if (in_array('cta_link', $curList) && in_array('button_link', $curList)) {
                        DB::statement("UPDATE `vize_offers` SET `button_link` = `cta_link` WHERE (`button_link` IS NULL OR `button_link` = '') AND `cta_link` IS NOT NULL");
                    }
                } catch (\Throwable $e) {}
            }

            // Seed clean offers with discount percentage and categories if empty
            if (DB::table('vize_offers')->count() === 0) {
                $rawCols = DB::select("SHOW COLUMNS FROM `vize_offers`");
                $validCols = array_map(function ($c) {
                    return is_object($c) ? ($c->Field ?? '') : ($c['Field'] ?? '');
                }, $rawCols);

                $initialOffers = [
                    [
                        'title'               => 'Up to 15% OFF on All Epoxy Resins & Hardeners',
                        'badge'               => '⚡ 15% OFF',
                        'discount_percent'    => 15,
                        'applicable_category' => 'resins',
                        'target_product_id'   => null,
                        'description'         => 'Direct factory pricing on crystal clear casting resins, deep pour polymers, and commercial floor coatings.',
                        'custom_fields'       => json_encode([
                            ['label' => 'Discount', 'value' => 'Flat 15% Cut in Cart'],
                            ['label' => 'Applicable', 'value' => 'All Resin & Hardener Products'],
                            ['label' => 'Dispatch', 'value' => 'Same-Day Dispatch Across India'],
                        ]),
                        'button_text'         => 'Explore Resins',
                        'button_link'         => '/resins',
                        'image_url'           => '/epowrap-product.jpg',
                        'is_active'           => true,
                        'sort_order'          => 1,
                        'created_at'          => now(),
                        'updated_at'          => now(),
                    ],
                    [
                        'title'               => 'Buy Pigments & Get 10% OFF Colors',
                        'badge'               => '🎨 10% OFF',
                        'discount_percent'    => 10,
                        'applicable_category' => 'pigments',
                        'target_product_id'   => null,
                        'description'         => 'High-dispersion metallic pearl powders and RAL liquid pigment pastes.',
                        'custom_fields'       => json_encode([
                            ['label' => 'Discount', 'value' => '10% Cut on Colors & Pigments'],
                            ['label' => 'Bonus', 'value' => 'Free Shade Swatch Included'],
                        ]),
                        'button_text'         => 'View Color Chart',
                        'button_link'         => '/colors-pigments',
                        'image_url'           => '/cat-casting.jpg',
                        'is_active'           => true,
                        'sort_order'          => 2,
                        'created_at'          => now(),
                        'updated_at'          => now(),
                    ],
                    [
                        'title'               => 'Flat 5% OFF Across Entire Store',
                        'badge'               => '🔥 5% STOREWIDE',
                        'discount_percent'    => 5,
                        'applicable_category' => 'all',
                        'target_product_id'   => null,
                        'description'         => 'Automatic savings on all polymers, tooling, and pigment supplies.',
                        'custom_fields'       => json_encode([
                            ['label' => 'Storewide', 'value' => 'Applies to all products in cart'],
                        ]),
                        'button_text'         => 'Shop All',
                        'button_link'         => '/resins',
                        'image_url'           => '/cat-protective.jpg',
                        'is_active'           => false,
                        'sort_order'          => 3,
                        'created_at'          => now(),
                        'updated_at'          => now(),
                    ]
                ];

                foreach ($initialOffers as $offer) {
                    $cleanOffer = [];
                    foreach ($offer as $k => $v) {
                        if (in_array($k, $validCols)) {
                            $cleanOffer[$k] = $v;
                        }
                    }
                    if (in_array('headline', $validCols) && !isset($cleanOffer['headline'])) {
                        $cleanOffer['headline'] = $offer['title'];
                    }
                    if (in_array('discount_badge', $validCols) && !isset($cleanOffer['discount_badge'])) {
                        $cleanOffer['discount_badge'] = $offer['badge'];
                    }
                    if (in_array('cta_text', $validCols) && !isset($cleanOffer['cta_text'])) {
                        $cleanOffer['cta_text'] = $offer['button_text'];
                    }
                    if (in_array('cta_link', $validCols) && !isset($cleanOffer['cta_link'])) {
                        $cleanOffer['cta_link'] = $offer['button_link'];
                    }
                    if (!empty($cleanOffer)) {
                        DB::table('vize_offers')->insert($cleanOffer);
                    }
                }
            }

            // Restore default resin offer if accidentally deleted during edit route conflict
            $hasResinOffer = DB::table('vize_offers')
                ->where(function ($q) {
                    $q->where('title', 'like', '%Resin%')
                      ->orWhere('badge', 'like', '%15%');
                })
                ->exists();

            if (!$hasResinOffer) {
                $rawCols = DB::select("SHOW COLUMNS FROM `vize_offers`");
                $validCols = array_map(function ($c) {
                    return is_object($c) ? ($c->Field ?? '') : ($c['Field'] ?? '');
                }, $rawCols);

                $resinOffer = [
                    'title'               => 'Up to 15% OFF on All Epoxy Resins & Hardeners',
                    'badge'               => '⚡ 15% OFF',
                    'discount_percent'    => 15,
                    'applicable_category' => 'resins',
                    'target_product_id'   => null,
                    'description'         => 'Direct factory pricing on crystal clear casting resins, deep pour polymers, and commercial floor coatings.',
                    'custom_fields'       => json_encode([
                        ['label' => 'Discount', 'value' => 'Flat 15% Cut in Cart'],
                        ['label' => 'Applicable', 'value' => 'All Resin & Hardener Products'],
                        ['label' => 'Dispatch', 'value' => 'Same-Day Dispatch Across India'],
                    ]),
                    'button_text'         => 'Explore Resins',
                    'button_link'         => '/resins',
                    'image_url'           => '/epowrap-product.jpg',
                    'is_active'           => true,
                    'sort_order'          => 1,
                    'created_at'          => now(),
                    'updated_at'          => now(),
                ];

                $cleanOffer = [];
                foreach ($resinOffer as $k => $v) {
                    if (in_array($k, $validCols)) {
                        $cleanOffer[$k] = $v;
                    }
                }
                if (in_array('headline', $validCols) && !isset($cleanOffer['headline'])) {
                    $cleanOffer['headline'] = $resinOffer['title'];
                }
                if (in_array('discount_badge', $validCols) && !isset($cleanOffer['discount_badge'])) {
                    $cleanOffer['discount_badge'] = $resinOffer['badge'];
                }
                if (in_array('cta_text', $validCols) && !isset($cleanOffer['cta_text'])) {
                    $cleanOffer['cta_text'] = $resinOffer['button_text'];
                }
                if (in_array('cta_link', $validCols) && !isset($cleanOffer['cta_link'])) {
                    $cleanOffer['cta_link'] = $resinOffer['button_link'];
                }
                if (!empty($cleanOffer)) {
                    DB::table('vize_offers')->insert($cleanOffer);
                }
            }

            $this->syncToFrontendJson();
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Helper to parse custom fields from request.
     */
    protected function parseCustomFields(Request $request)
    {
        $keys = $request->input('custom_field_keys', []);
        $values = $request->input('custom_field_values', []);
        $fields = [];

        if (is_array($keys) && is_array($values)) {
            for ($i = 0; $i < count($keys); $i++) {
                $label = trim($keys[$i] ?? '');
                $val = trim($values[$i] ?? '');
                if (!empty($label) || !empty($val)) {
                    $fields[] = [
                        'label' => $label,
                        'value' => $val,
                    ];
                }
            }
        }

        return $fields;
    }

    /**
     * Sync active offers to frontend JSON file for zero-latency cart discount calculation.
     */
    protected function syncToFrontendJson()
    {
        try {
            $offers = DB::table('vize_offers')
                ->where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'desc')
                ->get();

            $output = $offers->map(function ($o) {
                $customFields = [];
                if (!empty($o->custom_fields)) {
                    $customFields = is_string($o->custom_fields)
                        ? json_decode($o->custom_fields, true)
                        : (array) $o->custom_fields;
                }

                // If discount_percent not set, try to parse from title or badge
                $discountPercent = (int) ($o->discount_percent ?? 0);
                if ($discountPercent <= 0) {
                    if (preg_match('/(\d+)\s*%/i', ($o->badge ?? '') . ' ' . ($o->title ?? ''), $m)) {
                        $discountPercent = (int) $m[1];
                    }
                }

                return [
                    'id'                 => 'offer-' . $o->id,
                    'db_id'              => $o->id,
                    'title'              => $o->title ?? $o->headline ?? '',
                    'badge'              => $o->badge ?? $o->badge_text ?? $o->discount_badge ?? 'SPECIAL DEAL',
                    'discountPercent'    => $discountPercent,
                    'applicableCategory' => $o->applicable_category ?? 'all',
                    'targetProductId'    => $o->target_product_id ?? null,
                    'description'        => $o->description ?? '',
                    'customFields'       => is_array($customFields) ? $customFields : [],
                    'buttonText'         => $o->button_text ?? $o->cta_text ?? 'Shop Now',
                    'buttonLink'         => $o->button_link ?? $o->cta_link ?? '/resins',
                    'imageUrl'           => $o->image_url ?? '/epowrap-product.jpg',
                    'isActive'           => (bool) $o->is_active,
                    'sortOrder'          => (int) ($o->sort_order ?? 1),
                ];
            })->values()->all();

            $jsonPath = base_path('../src/data/offers.json');
            $publicJsonPath = base_path('../public/offers.json');

            $encoded = json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            File::put($jsonPath, $encoded);
            File::put($publicJsonPath, $encoded);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Retrieve ONLY Resin formulations for specific resin offer targeting.
     */
    protected function getAvailableProducts()
    {
        return [
            ['id' => 'vize-cast-max', 'name' => 'Vize Cast Max (Deep Pour Casting Resin)'],
            ['id' => 'vize-epowrap', 'name' => 'Vize EpoWrap (Metallic Epoxy Flooring Resin)'],
            ['id' => 'vize-primex', 'name' => 'Vize Primax (2:1 Epoxy Concrete Primer)'],
            ['id' => 'vize-screed-max', 'name' => 'Vize ScreedMax (Heavy-Duty Epoxy Screed)'],
            ['id' => 'vize-rockhard', 'name' => 'Vize RockHard (Stone Carpet Binder Resin)'],
            ['id' => 'vize-epowrap-pro', 'name' => 'Vize EpoWrap Pro (High-Build Intermediate Epoxy)'],
            ['id' => 'vize-epowrap-max', 'name' => 'Vize EpoWrap Max (Crystal Clear Epoxy Topcoat)'],
            ['id' => 'vize-aspartic-max', 'name' => 'Vize Aspartic Max (Fast-Cure Polyaspartic Resin)'],
            ['id' => 'vize-urethane-max', 'name' => 'Vize Urethane Max (Aliphatic Polyurethane Resin)'],
            ['id' => 'vize-art-max', 'name' => 'Vize Art Max (High-Gloss Art & Craft Resin)'],
        ];
    }

    /**
     * Display Offers Manager page.
     */
    public function index(Request $request)
    {
        $this->ensureTablesAndData();

        $offers = DB::table('vize_offers')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        foreach ($offers as $offer) {
            if (!empty($offer->custom_fields)) {
                $offer->custom_fields_array = is_string($offer->custom_fields)
                    ? json_decode($offer->custom_fields, true)
                    : (array) $offer->custom_fields;
            } else {
                $offer->custom_fields_array = [];
            }
        }

        $products = $this->getAvailableProducts();

        return view('admin::vize.offers.index', compact('offers', 'products'));
    }

    /**
     * Store new offer with discount percent & category scope.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $imageUrl = $request->input('image_url');

        if ($request->hasFile('image_file')) {
            $imgFile = $request->file('image_file');
            $imgName = time() . '_offer_' . Str::slug($request->input('title')) . '.' . $imgFile->getClientOriginalExtension();
            $targetDir = base_path('../public/uploads/offers');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $imgFile->move($targetDir, $imgName);
            $imageUrl = '/uploads/offers/' . $imgName;
        }

        if (empty($imageUrl)) {
            $imageUrl = '/epowrap-product.jpg';
        }

        $customFields = $this->parseCustomFields($request);

        // Auto parse discount percent if not provided
        $discountPercent = (int) $request->input('discount_percent', 0);
        if ($discountPercent <= 0) {
            if (preg_match('/(\d+)\s*%/i', $request->input('title') . ' ' . $request->input('badge'), $m)) {
                $discountPercent = (int) $m[1];
            }
        }

        $this->ensureTablesAndData();

        $targetProdId = trim($request->input('target_product_id', ''));
        $applicableCategory = $request->input('applicable_category', 'all');
        if (!empty($targetProdId)) {
            $applicableCategory = 'single_product';
        }

        try {
            // Check real columns in table right now
            $rawCols = DB::select("SHOW COLUMNS FROM `vize_offers`");
            $validCols = array_map(function ($c) {
                return strtolower(is_object($c) ? ($c->Field ?? '') : ($c['Field'] ?? ''));
            }, $rawCols);

            $insertData = [];

            if (in_array('title', $validCols)) {
                $insertData['title'] = $request->input('title');
            }
            if (in_array('badge', $validCols)) {
                $insertData['badge'] = $request->input('badge', 'SPECIAL OFFER');
            }
            if (in_array('discount_percent', $validCols)) {
                $insertData['discount_percent'] = $discountPercent;
            }
            if (in_array('applicable_category', $validCols)) {
                $insertData['applicable_category'] = $applicableCategory;
            }
            if (in_array('target_product_id', $validCols)) {
                $insertData['target_product_id'] = !empty($targetProdId) ? $targetProdId : null;
            }
            if (in_array('description', $validCols)) {
                $insertData['description'] = $request->input('description');
            }
            if (in_array('custom_fields', $validCols)) {
                $insertData['custom_fields'] = json_encode($customFields);
            }
            if (in_array('button_text', $validCols)) {
                $insertData['button_text'] = $request->input('button_text', 'Shop Now');
            }
            if (in_array('button_link', $validCols)) {
                $insertData['button_link'] = $request->input('button_link', '/resins');
            }
            if (in_array('image_url', $validCols)) {
                $insertData['image_url'] = $imageUrl;
            }
            if (in_array('is_active', $validCols)) {
                $insertData['is_active'] = $request->has('is_active') ? true : ($request->input('is_active', 1) ? true : false);
            }
            if (in_array('sort_order', $validCols)) {
                $insertData['sort_order'] = (int) $request->input('sort_order', 1);
            }
            if (in_array('created_at', $validCols)) {
                $insertData['created_at'] = now();
            }
            if (in_array('updated_at', $validCols)) {
                $insertData['updated_at'] = now();
            }

            // Legacy column support
            if (in_array('headline', $validCols) && !isset($insertData['headline'])) {
                $insertData['headline'] = $request->input('title');
            }
            if (in_array('discount_badge', $validCols) && !isset($insertData['discount_badge'])) {
                $insertData['discount_badge'] = $request->input('badge', 'SPECIAL OFFER');
            }
            if (in_array('cta_text', $validCols) && !isset($insertData['cta_text'])) {
                $insertData['cta_text'] = $request->input('button_text', 'Shop Now');
            }
            if (in_array('cta_link', $validCols) && !isset($insertData['cta_link'])) {
                $insertData['cta_link'] = $request->input('button_link', '/resins');
            }

            DB::table('vize_offers')->insert($insertData);

            $this->syncToFrontendJson();
            session()->flash('success', 'Offer created successfully with ' . $discountPercent . '% discount.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save offer: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.offers.index');
    }

    /**
     * Update offer details, discount percent, and custom fields.
     */
    public function update(Request $request, $id)
    {
        $this->ensureTablesAndData();

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $imageUrl = $request->input('image_url');

        if ($request->hasFile('image_file')) {
            $imgFile = $request->file('image_file');
            $imgName = time() . '_offer_' . Str::slug($request->input('title')) . '.' . $imgFile->getClientOriginalExtension();
            $targetDir = base_path('../public/uploads/offers');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $imgFile->move($targetDir, $imgName);
            $imageUrl = '/uploads/offers/' . $imgName;
        }

        $customFields = $this->parseCustomFields($request);

        $discountPercent = (int) $request->input('discount_percent', 0);
        if ($discountPercent <= 0) {
            if (preg_match('/(\d+)\s*%/i', $request->input('title') . ' ' . $request->input('badge'), $m)) {
                $discountPercent = (int) $m[1];
            }
        }

        $targetProdId = trim($request->input('target_product_id', ''));
        $applicableCategory = $request->input('applicable_category', 'all');
        if (!empty($targetProdId)) {
            $applicableCategory = 'single_product';
        }

        try {
            $rawCols = DB::select("SHOW COLUMNS FROM `vize_offers`");
            $validCols = array_map(function ($c) {
                return strtolower(is_object($c) ? ($c->Field ?? '') : ($c['Field'] ?? ''));
            }, $rawCols);

            $updateData = [];

            if (in_array('title', $validCols)) {
                $updateData['title'] = $request->input('title');
            }
            if (in_array('badge', $validCols)) {
                $updateData['badge'] = $request->input('badge', 'SPECIAL OFFER');
            }
            if (in_array('discount_percent', $validCols)) {
                $updateData['discount_percent'] = $discountPercent;
            }
            if (in_array('applicable_category', $validCols)) {
                $updateData['applicable_category'] = $applicableCategory;
            }
            if (in_array('target_product_id', $validCols)) {
                $updateData['target_product_id'] = !empty($targetProdId) ? $targetProdId : null;
            }
            if (in_array('description', $validCols)) {
                $updateData['description'] = $request->input('description');
            }
            if (in_array('custom_fields', $validCols)) {
                $updateData['custom_fields'] = json_encode($customFields);
            }
            if (in_array('button_text', $validCols)) {
                $updateData['button_text'] = $request->input('button_text', 'Shop Now');
            }
            if (in_array('button_link', $validCols)) {
                $updateData['button_link'] = $request->input('button_link', '/resins');
            }
            if (in_array('is_active', $validCols)) {
                $updateData['is_active'] = $request->has('is_active') ? true : ($request->input('is_active', 0) ? true : false);
            }
            if (in_array('updated_at', $validCols)) {
                $updateData['updated_at'] = now();
            }
            if (!empty($imageUrl) && in_array('image_url', $validCols)) {
                $updateData['image_url'] = $imageUrl;
            }

            // Legacy column support
            if (in_array('headline', $validCols) && !isset($updateData['headline'])) {
                $updateData['headline'] = $request->input('title');
            }
            if (in_array('discount_badge', $validCols) && !isset($updateData['discount_badge'])) {
                $updateData['discount_badge'] = $request->input('badge', 'SPECIAL OFFER');
            }
            if (in_array('cta_text', $validCols) && !isset($updateData['cta_text'])) {
                $updateData['cta_text'] = $request->input('button_text', 'Shop Now');
            }
            if (in_array('cta_link', $validCols) && !isset($updateData['cta_link'])) {
                $updateData['cta_link'] = $request->input('button_link', '/resins');
            }

            DB::table('vize_offers')->where('id', $id)->update($updateData);

            $this->syncToFrontendJson();
            session()->flash('success', 'Offer updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.offers.index');
    }

    /**
     * Quick status toggle.
     */
    public function toggleStatus(Request $request, $id)
    {
        try {
            $offer = DB::table('vize_offers')->where('id', $id)->first();
            if ($offer) {
                $newStatus = $request->has('is_active') ? $request->boolean('is_active') : !$offer->is_active;
                DB::table('vize_offers')->where('id', $id)->update([
                    'is_active'  => $newStatus,
                    'updated_at' => now(),
                ]);
                $this->syncToFrontendJson();
                session()->flash('success', 'Offer status updated.');
            }
        } catch (\Exception $e) {
            session()->flash('error', 'Status update failed.');
        }

        return redirect()->route('admin.vize.offers.index');
    }

    /**
     * Delete offer.
     */
    public function destroy($id)
    {
        try {
            DB::table('vize_offers')->where('id', $id)->delete();
            $this->syncToFrontendJson();
            session()->flash('success', 'Offer deleted successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.offers.index');
    }
}
