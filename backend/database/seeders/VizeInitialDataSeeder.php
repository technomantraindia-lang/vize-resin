<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VizeInitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        try {
            DB::table('channels')->where('id', 1)->update([
                'name' => 'VIZE Specialty Polymers Official Store',
            ]);
            DB::table('currencies')->where('code', 'INR')->update([
                'name'   => 'Indian Rupee',
                'symbol' => '₹',
            ]);
        } catch (\Exception $e) {
            // ignore if table structure differs
        }

        // 2. Seed Real VIZE Product Categories
        try {
            DB::table('categories')->where('id', '>', 1)->delete();
            DB::table('category_translations')->where('category_id', '>', 1)->delete();

            $categories = [
                ['name' => 'Flooring Resins', 'slug' => 'flooring-resins', 'desc' => 'Pure epoxy primers, screeding systems, stone binders, and decorative metallic floor coats.'],
                ['name' => 'Casting & Art', 'slug' => 'casting-art', 'desc' => 'Water-clear deep pour epoxy casting resin and mirror-gloss protective art coatings.'],
                ['name' => 'Protective Coatings', 'slug' => 'protective-coatings', 'desc' => 'Ultra-fast aliphatic polyaspartic and heavy-duty chemical-resistant polyurethane topcoats.'],
                ['name' => 'Finishing Compounds', 'slug' => 'finishing-compounds', 'desc' => 'Advanced hydrophobic nano silicon coatings and surface defense matrices.'],
            ];

            foreach ($categories as $index => $cat) {
                $catId = $index + 2;
                DB::table('categories')->insert([
                    'id'         => $catId,
                    'position'   => $index + 1,
                    'status'     => 1,
                    'parent_id'  => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('category_translations')->insert([
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
        } catch (\Exception $e) {
            // ignore
        }

        // 3. Seed Initial Videos/Reels for Home Page
        DB::table('vize_videos')->truncate();
        DB::table('vize_videos')->insert([
            [
                'title'      => 'Live-Edge River Table 3-Inch Deep Pour',
                'platform'   => 'mp4',
                'url'        => '/hero-video.mp4',
                'thumbnail'  => '/process-pour.jpg',
                'is_active'  => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title'      => 'Industrial Metallic Marble Floor Coating Application',
                'platform'   => 'mp4',
                'url'        => '/hero-video-2.mp4',
                'thumbnail'  => '/process-trowel.jpg',
                'is_active'  => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title'      => 'Workshop Masterclass Hands-on Live Batch',
                'platform'   => 'mp4',
                'url'        => '/make_the_video_on_this_this_is.mp4',
                'thumbnail'  => '/reel-1-thumb.jpg',
                'is_active'  => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 4. Seed Initial Table Tops & Quotation Leads
        DB::table('vize_table_inquiries')->truncate();
        DB::table('vize_table_tops')->truncate();

        $emeraldTableId = DB::table('vize_table_tops')->insertGetId([
            'name'        => 'Emerald Abyss Boardroom Table',
            'slug'        => 'emerald-abyss-boardroom-table',
            'wood_type'   => 'Black Walnut',
            'dimensions'  => '14ft x 4.5ft x 2.5inch',
            'price'       => 285000.00,
            'status'      => 'Made to Order',
            'image_url'   => '/table-tops/emerald-table.png',
            'description' => 'Massive 14-seater boardroom table featuring bookmatched American Black Walnut with a deep emerald metallic resin canyon channel.',
            'is_featured' => true,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        DB::table('vize_table_tops')->insert([
            [
                'name'        => 'Glacier Blue Live-Edge Dining Table',
                'slug'        => 'glacier-blue-dining-table',
                'wood_type'   => 'Old Teak Wood',
                'dimensions'  => '8ft x 3.5ft x 2inch',
                'price'       => 165000.00,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table-tops/glacier-blue.png',
                'description' => '8-seater dining table crafted from aged seasoned Teak with crystal-clear glacier blue optical resin.',
                'is_featured' => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Amber Gold Waterfall Console Table',
                'slug'        => 'amber-gold-waterfall-console',
                'wood_type'   => 'Sheesham Burl',
                'dimensions'  => '5ft x 1.5ft x 30inch height',
                'price'       => 82000.00,
                'status'      => 'Ready to Ship',
                'image_url'   => '/table-tops/amber-console.png',
                'description' => 'Continuous waterfall edge console table with translucent amber mica river and natural live bark edge.',
                'is_featured' => false,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);

        DB::table('vize_table_inquiries')->insert([
            [
                'table_id'             => $emeraldTableId,
                'customer_name'        => 'Vikram Singhania (Architectural Group)',
                'email'                => 'vikram@singhaniagroup.in',
                'phone'                => '+91 98200 45678',
                'requested_dimensions' => '16ft x 5ft Boardroom Table',
                'wood_preference'      => 'American Walnut',
                'budget'               => '₹3,50,000 - ₹4,00,000',
                'message'              => 'Need a customized emerald metallic river table for our executive corporate boardroom in Bandra Kurla Complex.',
                'status'               => 'Contacted',
                'created_at'           => now()->subDays(2),
                'updated_at'           => now()->subDays(1),
            ],
            [
                'table_id'             => null,
                'customer_name'        => 'Pooja Mehta (Interior Designer)',
                'email'                => 'pooja@mehtadesign.com',
                'phone'                => '+91 98450 12345',
                'requested_dimensions' => '8ft x 4ft Dining Table',
                'wood_preference'      => 'Burma Teak',
                'budget'               => '₹1,80,000',
                'message'              => 'Client requires smoky gray translucent resin with live bark edges.',
                'status'               => 'New',
                'created_at'           => now()->subHours(5),
                'updated_at'           => now()->subHours(5),
            ]
        ]);

        // 5. Seed Colors & Pigments Specialty Formulations
        DB::table('vize_pigments')->truncate();
        DB::table('vize_pigments')->insert([
            [
                'name'         => 'Deep Emerald Pearlescent Mica',
                'slug'         => 'deep-emerald-pearlescent-mica',
                'category'     => 'Mica Pearlescent Powder',
                'hex_color'    => '#059669',
                'opacity'      => 'Semi-Opaque Pearlescent',
                'mixing_ratio' => '2-5% by resin weight',
                'pack_sizes'   => json_encode([
                    ['size' => '50g', 'price' => 299],
                    ['size' => '100g', 'price' => 499],
                    ['size' => '500g', 'price' => 1899],
                    ['size' => '1kg', 'price' => 3499],
                ]),
                'base_price'   => 299.00,
                'stock_status' => 'In Stock',
                'is_combo'     => false,
                'image_url'    => '/pigments/emerald-mica.jpg',
                'description'  => 'Micro-fine 10-60 micron pearlescent mica for mesmerizing river table swirly wave effects.',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Ocean Sapphire Liquid Dispersion',
                'slug'         => 'ocean-sapphire-liquid-dispersion',
                'category'     => 'Liquid Dispersion Paste',
                'hex_color'    => '#0284c7',
                'opacity'      => 'Solid Opaque',
                'mixing_ratio' => '1-3% for solid saturation',
                'pack_sizes'   => json_encode([
                    ['size' => '50g', 'price' => 349],
                    ['size' => '100g', 'price' => 599],
                    ['size' => '500g', 'price' => 2199],
                    ['size' => '1kg', 'price' => 3999],
                ]),
                'base_price'   => 349.00,
                'stock_status' => 'In Stock',
                'is_combo'     => false,
                'image_url'    => '/pigments/ocean-sapphire.jpg',
                'description'  => 'Concentrated liquid epoxy color paste providing streak-free deep oceanic blue solid color.',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Molten Gold Metallic Flake',
                'slug'         => 'molten-gold-metallic-flake',
                'category'     => 'Mica Pearlescent Powder',
                'hex_color'    => '#d97706',
                'opacity'      => 'Semi-Opaque Pearlescent',
                'mixing_ratio' => '2-4% by weight',
                'pack_sizes'   => json_encode([
                    ['size' => '50g', 'price' => 329],
                    ['size' => '100g', 'price' => 549],
                    ['size' => '500g', 'price' => 1999],
                    ['size' => '1kg', 'price' => 3699],
                ]),
                'base_price'   => 329.00,
                'stock_status' => 'In Stock',
                'is_combo'     => false,
                'image_url'    => '/pigments/molten-gold.jpg',
                'description'  => 'Rich metallic luster gold pigment for luxury marble countertops and live edge resin veins.',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Artisan 12-Shade Starter Kit Combo',
                'slug'         => 'artisan-12-shade-starter-kit-combo',
                'category'     => 'Mica Pearlescent Powder',
                'hex_color'    => '#8b5cf6',
                'opacity'      => 'Solid Opaque',
                'mixing_ratio' => 'Custom',
                'pack_sizes'   => json_encode([
                    ['size' => '12x50g Set', 'price' => 2999],
                    ['size' => '12x100g Set', 'price' => 4999],
                ]),
                'base_price'   => 2999.00,
                'stock_status' => 'In Stock',
                'is_combo'     => true,
                'image_url'    => '/pigments/combo-kit.jpg',
                'description'  => 'Complete curation of 12 best-selling metallic, pearlescent, and chameleon color pigments for artists and resin contractors.',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);

        // 6. Seed Bento Showcase Installations matching /our-work
        DB::table('vize_showcase_inquiries')->truncate();
        DB::table('vize_showcase')->truncate();

        $showcase1 = DB::table('vize_showcase')->insertGetId([
            'title'         => '14-ft Emerald Abyss Boardroom Table',
            'slug'          => '14ft-emerald-boardroom-table',
            'client_type'   => 'Corporate Boardroom',
            'layout_span'   => 'col-span-2',
            'category_pill' => 'Live Edge River Table',
            'image_url'     => '/commercial.png',
            'formulation'   => 'VIZE UltraCast 3:1 Deep Pour',
            'hardness'      => '85 Shore D',
            'pour_depth'    => '75 mm single pour',
            'uv_stability'  => 'Class 1 UV Shield',
            'description'   => 'Monolithic 14-seater corporate table engineered with bookmatched American Black Walnut and emerald metallic resin.',
            'sort_order'    => 1,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        DB::table('vize_showcase')->insert([
            [
                'title'         => 'Illuminated Fiber-Optic River Console',
                'slug'          => 'illuminated-fiber-optic-console',
                'client_type'   => 'Residential Luxury',
                'layout_span'   => 'col-span-1',
                'category_pill' => 'Fiber-Optic Resin Art',
                'image_url'     => '/residential.png',
                'formulation'   => 'VIZE CrystalOptics 2:1',
                'hardness'      => '82 Shore D',
                'pour_depth'    => '50 mm pour',
                'uv_stability'  => 'UV Blocker Pro',
                'description'   => 'Custom console embedded with 200+ optical fiber light strands illuminating internal resin canyon.',
                'sort_order'    => 2,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'title'         => 'Metallic Marble Commercial Floor',
                'slug'          => 'metallic-marble-commercial-floor',
                'client_type'   => 'Commercial Showroom',
                'layout_span'   => 'col-span-1',
                'category_pill' => 'Industrial Seamless Flooring',
                'image_url'     => '/commercial.png',
                'formulation'   => 'VIZE PolyShield ESD 100% Solids',
                'hardness'      => '88 Shore D',
                'pour_depth'    => '3 mm self-leveling',
                'uv_stability'  => 'Non-Yellowing Polyaspartic',
                'description'   => 'High-gloss seamless epoxy floor with titanium and charcoal metallic swirls for a 5,000 sq ft luxury auto showroom.',
                'sort_order'    => 3,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);

        DB::table('vize_showcase_inquiries')->insert([
            [
                'showcase_id'          => $showcase1,
                'client_name'          => 'Ananya Deshmukh (Luxury Residences)',
                'email'                => 'ananya@deshmukhvillas.com',
                'phone'                => '+91 97690 99881',
                'project_type'         => '10-Seater Live Edge Dining Table',
                'estimated_dimensions' => '10ft x 4ft',
                'budget_range'         => '₹2,50,000 - ₹3,00,000',
                'specifications'       => 'Looking for a glacier blue crystal clear resin with live edge reclaimed teak.',
                'status'               => 'In Discussion',
                'created_at'           => now()->subDays(1),
                'updated_at'           => now()->subDays(1),
            ]
        ]);

        // 7. Seed Workshops & Batches & Admissions
        DB::table('vize_workshop_admissions')->truncate();
        DB::table('vize_workshop_batches')->truncate();
        DB::table('vize_workshops')->truncate();

        $workshopId = DB::table('vize_workshops')->insertGetId([
            'title'       => '3-Day Epoxy River Table & Industrial Flooring Masterclass',
            'slug'        => '3-day-masterclass-river-tables-flooring',
            'level'       => 'Professional Masterclass',
            'duration'    => '3 Days Intensive (10:00 AM – 6:00 PM)',
            'fee'         => 24999.00,
            'advance_fee' => 5000.00,
            'inclusions'  => json_encode([
                'VIZE Pro Artisan Starter Kit (Resin, Hardeners, Pigments)',
                'Hands-on casting of personal 2ft river table to take home',
                'Govt. & VIZE Certified Master Artisan Diploma',
                'Lunch, High Tea & Safety PPE Kit included',
                'Lifetime Technical Support & Wholesale Contractor Discount'
            ]),
            'description' => 'Comprehensive hands-on training covering deep pour chemistry, mold fabrication, bubble elimination, diamond sanding, ceramic polishing, and metallic floor application.',
            'image_url'   => '/reel-1-thumb.jpg',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        $batch1 = DB::table('vize_workshop_batches')->insertGetId([
            'workshop_id'  => $workshopId,
            'city'         => 'Mumbai',
            'venue'        => 'VIZE Polymer Innovation Center, Andheri East, Mumbai',
            'start_date'   => '2026-11-15',
            'end_date'     => '2026-11-17',
            'total_seats'  => 30,
            'booked_seats' => 24,
            'status'       => 'Filling Fast',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        DB::table('vize_workshop_batches')->insert([
            [
                'workshop_id'  => $workshopId,
                'city'         => 'Bengaluru',
                'venue'        => 'VIZE Experience Hub, Whitefield, Bengaluru',
                'start_date'   => '2026-11-28',
                'end_date'     => '2026-11-30',
                'total_seats'  => 30,
                'booked_seats' => 12,
                'status'       => 'Open',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'workshop_id'  => $workshopId,
                'city'         => 'New Delhi',
                'venue'        => 'VIZE Technical Academy, Okhla Industrial Area, New Delhi',
                'start_date'   => '2026-12-12',
                'end_date'     => '2026-12-14',
                'total_seats'  => 30,
                'booked_seats' => 30,
                'status'       => 'Sold Out',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);

        DB::table('vize_workshop_admissions')->insert([
            [
                'batch_id'       => $batch1,
                'student_name'   => 'Rajesh Sharma',
                'email'          => 'rajesh.sharma@gmail.com',
                'phone'          => '+91 98211 55443',
                'whatsapp'       => '+91 98211 55443',
                'payment_status' => 'Completed',
                'amount_paid'    => 24999.00,
                'notes'          => 'Contractor wanting to start commercial resin flooring business.',
                'created_at'     => now()->subDays(3),
                'updated_at'     => now()->subDays(3),
            ],
            [
                'batch_id'       => $batch1,
                'student_name'   => 'Sneha Patel',
                'email'          => 'sneha.patel@artstudio.in',
                'phone'          => '+91 99090 11223',
                'whatsapp'       => '+91 99090 11223',
                'payment_status' => 'Advance Paid',
                'amount_paid'    => 5000.00,
                'notes'          => 'Woodworker artist looking to master river tables and deep pours.',
                'created_at'     => now()->subDays(1),
                'updated_at'     => now()->subDays(1),
            ],
            [
                'batch_id'       => $batch1,
                'student_name'   => 'Amit Verma',
                'email'          => 'amit.verma88@yahoo.com',
                'phone'          => '+91 97110 33445',
                'whatsapp'       => '+91 97110 33445',
                'payment_status' => 'Pending',
                'amount_paid'    => 0.00,
                'notes'          => 'Requested bank transfer invoice.',
                'created_at'     => now()->subHours(8),
                'updated_at'     => now()->subHours(8),
            ]
        ]);

        // 8. Seed All 11 VIZE Resin Products with full specifications
        DB::table('vize_resins')->truncate();
        
        $resinSlugs = [
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

        $productsJsonPath = base_path('../src/data/products.json');
        if (file_exists($productsJsonPath)) {
            $productsList = json_decode(file_get_contents($productsJsonPath), true);
            $order = 1;
            foreach ($productsList as $prod) {
                if (isset($prod['id']) && in_array($prod['id'], $resinSlugs)) {
                    DB::table('vize_resins')->insert([
                        'sku'                  => $prod['sku'] ?? ('VZ-' . strtoupper(Str::random(5))),
                        'slug'                 => $prod['id'],
                        'name'                 => $prod['name'],
                        'brand'                => $prod['brand'] ?? $prod['name'],
                        'suffix'               => $prod['suffix'] ?? null,
                        'category'             => $prod['category'] ?? 'Flooring Resins',
                        'application_category' => $prod['applicationCategory'] ?? 'General Application',
                        'application_tag'      => $prod['applicationTag'] ?? null,
                        'grade'                => $prod['grade'] ?? null,
                        'chemistry'            => $prod['chemistry'] ?? null,
                        'tagline'              => $prod['tagline'] ?? null,
                        'base_price'           => floatval($prod['basePrice'] ?? 0),
                        'pack_qty'             => $prod['packQty'] ?? '12 KG',
                        'pack_composition'     => $prod['packComposition'] ?? null,
                        'mix_ratio'            => $prod['mixRatio'] ?? '2 : 1',
                        'cure_time'            => $prod['cureTime'] ?? null,
                        'pot_life'             => $prod['potLife'] ?? null,
                        'coverage'             => $prod['coverage'] ?? null,
                        'sqft_coverage'        => intval($prod['sqftCoverage'] ?? 100),
                        'price_per_kg'         => isset($prod['pricePerKg']) ? floatval($prod['pricePerKg']) : null,
                        'in_stock'             => $prod['inStock'] ?? true,
                        'images'               => json_encode($prod['images'] ?? []),
                        'features'             => json_encode($prod['features'] ?? []),
                        'about_text'           => $prod['aboutText'] ?? null,
                        'sort_order'           => $order++,
                        'created_at'           => now(),
                        'updated_at'           => now(),
                    ]);
                }
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
