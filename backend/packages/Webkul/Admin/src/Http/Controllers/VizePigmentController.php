<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizePigmentController extends Controller
{
    /**
     * Ensure database tables exist and are seeded.
     */
    protected function ensureTablesAndData()
    {
        try {
            if (!Schema::hasTable('vize_pigment_categories')) {
                Schema::create('vize_pigment_categories', function ($table) {
                    $table->id();
                    $table->string('name');
                    $table->string('slug')->unique();
                    $table->string('badge')->nullable();
                    $table->text('subtitle')->nullable();
                    $table->json('pack_sizes')->nullable();
                    $table->integer('sort_order')->default(0);
                    $table->boolean('is_active')->default(true);
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('vize_pigment_shades')) {
                Schema::create('vize_pigment_shades', function ($table) {
                    $table->id();
                    $table->string('category_slug');
                    $table->string('name');
                    $table->string('code')->nullable();
                    $table->string('hex_color')->nullable();
                    $table->string('image_url')->nullable();
                    $table->string('preview_url')->nullable();
                    $table->text('description')->nullable();
                    $table->integer('sort_order')->default(0);
                    $table->string('stock_status')->default('In Stock');
                    $table->boolean('is_active')->default(true);
                    $table->timestamps();
                });
            }

            // Seed if empty
            if (DB::table('vize_pigment_categories')->count() === 0) {
                $jsonPath = base_path('../src/data/pigments.json');
                if (File::exists($jsonPath)) {
                    $initialData = json_decode(File::get($jsonPath), true);
                    foreach ($initialData as $catIndex => $cat) {
                        DB::table('vize_pigment_categories')->insert([
                            'name'       => $cat['name'],
                            'slug'       => $cat['slug'] ?? Str::slug($cat['name']),
                            'badge'      => $cat['badge'] ?? null,
                            'subtitle'   => $cat['subtitle'] ?? null,
                            'pack_sizes' => json_encode($cat['sizes'] ?? []),
                            'sort_order' => $catIndex,
                            'is_active'  => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        foreach ($cat['shades'] ?? [] as $shadeIndex => $sh) {
                            DB::table('vize_pigment_shades')->insert([
                                'category_slug' => $cat['slug'] ?? Str::slug($cat['name']),
                                'name'          => $sh['name'],
                                'code'          => $sh['code'] ?? null,
                                'hex_color'     => $sh['hex'] ?? null,
                                'image_url'     => $sh['image'] ?? null,
                                'preview_url'   => $sh['preview'] ?? null,
                                'description'   => $sh['desc'] ?? null,
                                'sort_order'    => $shadeIndex,
                                'stock_status'  => 'In Stock',
                                'is_active'     => true,
                                'created_at'    => now(),
                                'updated_at'    => now(),
                            ]);
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Sync database state to frontend json fallback file.
     */
    protected function syncToFrontendJson()
    {
        try {
            $categories = DB::table('vize_pigment_categories')->orderBy('sort_order', 'asc')->get();
            $shades = DB::table('vize_pigment_shades')->orderBy('sort_order', 'asc')->get();

            $output = [];
            foreach ($categories as $cat) {
                $catShades = $shades->where('category_slug', $cat->slug)->map(function ($s) {
                    return [
                        'id'      => $s->code ? Str::slug($s->code) : Str::slug($s->name),
                        'name'    => $s->name,
                        'code'    => $s->code,
                        'hex'     => $s->hex_color,
                        'image'   => $s->image_url,
                        'preview' => $s->preview_url,
                        'desc'    => $s->description,
                    ];
                })->values()->all();

                $output[] = [
                    'id'       => $cat->slug,
                    'name'     => $cat->name,
                    'slug'     => $cat->slug,
                    'badge'    => $cat->badge,
                    'subtitle' => $cat->subtitle,
                    'sizes'    => json_decode($cat->pack_sizes, true) ?? [],
                    'shades'   => $catShades,
                ];
            }

            $jsonPath = base_path('../src/data/pigments.json');
            File::put($jsonPath, json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Admin view for managing categories, fixed pricing, and shades with image circles.
     */
    public function index(Request $request)
    {
        $this->ensureTablesAndData();

        $selectedCategory = $request->query('category', 'all');

        $categories = DB::table('vize_pigment_categories')->orderBy('sort_order', 'asc')->get();

        $query = DB::table('vize_pigment_shades');
        if ($selectedCategory !== 'all') {
            $query->where('category_slug', $selectedCategory);
        }
        $shades = $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        // Attach category pack prices to each shade for transparent display
        $categoriesBySlug = $categories->keyBy('slug');
        foreach ($shades as $sh) {
            $sh->category_obj = $categoriesBySlug->get($sh->category_slug);
            $sh->pack_sizes = $sh->category_obj ? json_decode($sh->category_obj->pack_sizes, true) : [];
        }

        return view('admin::vize.pigments.index', compact('categories', 'shades', 'selectedCategory'));
    }

    /**
     * Store new category with its fixed pack sizes & prices.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:150',
            'badge'    => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:500',
        ]);

        $slug = Str::slug($request->input('name'));

        // Build pack sizes from inputs
        $sizes = [];
        $sizeLabels = $request->input('size_label', []);
        $sizeWeights = $request->input('size_weight', []);
        $sizePrices = $request->input('size_price', []);

        foreach ($sizeLabels as $i => $label) {
            if (!empty($label) && isset($sizePrices[$i])) {
                $sizes[] = [
                    'id'     => Str::slug($sizeWeights[$i] ?? $label),
                    'label'  => trim($label),
                    'weight' => trim($sizeWeights[$i] ?? $label),
                    'price'  => floatval($sizePrices[$i]),
                ];
            }
        }

        // If no custom sizes supplied, add default 500g and 1kg
        if (empty($sizes)) {
            $sizes = [
                ['id' => '500g', 'label' => '500 Grams', 'weight' => '500g', 'price' => 500.00],
                ['id' => '1kg', 'label' => '1 Kilogram', 'weight' => '1kg', 'price' => 1000.00],
            ];
        }

        try {
            DB::table('vize_pigment_categories')->insert([
                'name'       => $request->input('name'),
                'slug'       => $slug,
                'badge'      => $request->input('badge', strtoupper($request->input('name')) . ' FINISH'),
                'subtitle'   => $request->input('subtitle'),
                'pack_sizes' => json_encode($sizes),
                'sort_order' => DB::table('vize_pigment_categories')->max('sort_order') + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Category with fixed pack pricing created successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save category: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.pigments.index');
    }

    /**
     * Update category & prices.
     */
    public function updateCategory(Request $request, $id)
    {
        $request->validate([
            'name'     => 'required|string|max:150',
            'badge'    => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:500',
        ]);

        $sizes = [];
        $sizeLabels = $request->input('size_label', []);
        $sizeWeights = $request->input('size_weight', []);
        $sizePrices = $request->input('size_price', []);

        foreach ($sizeLabels as $i => $label) {
            if (!empty($label) && isset($sizePrices[$i])) {
                $sizes[] = [
                    'id'     => Str::slug($sizeWeights[$i] ?? $label),
                    'label'  => trim($label),
                    'weight' => trim($sizeWeights[$i] ?? $label),
                    'price'  => floatval($sizePrices[$i]),
                ];
            }
        }

        try {
            DB::table('vize_pigment_categories')->where('id', $id)->update([
                'name'       => $request->input('name'),
                'badge'      => $request->input('badge'),
                'subtitle'   => $request->input('subtitle'),
                'pack_sizes' => json_encode($sizes),
                'updated_at' => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Category pricing updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.pigments.index');
    }

    /**
     * Delete category.
     */
    public function destroyCategory($id)
    {
        try {
            $cat = DB::table('vize_pigment_categories')->where('id', $id)->first();
            if ($cat) {
                DB::table('vize_pigment_shades')->where('category_slug', $cat->slug)->delete();
                DB::table('vize_pigment_categories')->where('id', $id)->delete();
                $this->syncToFrontendJson();
                session()->flash('success', 'Category and its shades removed successfully.');
            }
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.pigments.index');
    }

    /**
     * Store new color shade under a particular category.
     */
    public function storeShade(Request $request)
    {
        $request->validate([
            'category_slug' => 'required|string',
            'name'          => 'required|string|max:150',
            'hex_color'     => 'nullable|string|max:30',
        ]);

        $imageUrl = $request->input('image_url');

        // Handle file upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
            
            // Save to frontend public/colors directory directly if possible, or public uploads
            $targetDir = base_path('../public/colors/uploads');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $file->move($targetDir, $fileName);
            $imageUrl = '/colors/uploads/' . $fileName;
        }

        if (empty($imageUrl)) {
            $imageUrl = '/colors/' . $request->input('name') . '.png';
        }

        try {
            DB::table('vize_pigment_shades')->insert([
                'category_slug' => $request->input('category_slug'),
                'name'          => $request->input('name'),
                'code'          => $request->input('code'),
                'hex_color'     => $request->input('hex_color', '#102B30'),
                'image_url'     => $imageUrl,
                'preview_url'   => $request->input('preview_url') ?? $imageUrl,
                'description'   => $request->input('description'),
                'stock_status'  => $request->input('stock_status', 'In Stock'),
                'sort_order'    => DB::table('vize_pigment_shades')->where('category_slug', $request->input('category_slug'))->max('sort_order') + 1,
                'is_active'     => true,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Color shade added with image swatch successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save shade: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.pigments.index', ['category' => $request->input('category_slug')]);
    }

    /**
     * Update shade.
     */
    public function updateShade(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:150',
        ]);

        $updateData = [
            'name'         => $request->input('name'),
            'code'         => $request->input('code'),
            'hex_color'    => $request->input('hex_color'),
            'description'  => $request->input('description'),
            'stock_status' => $request->input('stock_status', 'In Stock'),
            'updated_at'   => now(),
        ];

        if ($request->has('category_slug')) {
            $updateData['category_slug'] = $request->input('category_slug');
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
            $targetDir = base_path('../public/colors/uploads');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $file->move($targetDir, $fileName);
            $updateData['image_url'] = '/colors/uploads/' . $fileName;
            $updateData['preview_url'] = '/colors/uploads/' . $fileName;
        } elseif ($request->filled('image_url')) {
            $updateData['image_url'] = $request->input('image_url');
        }

        try {
            DB::table('vize_pigment_shades')->where('id', $id)->update($updateData);
            $this->syncToFrontendJson();
            session()->flash('success', 'Shade formulation updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.pigments.index');
    }

    /**
     * Delete shade.
     */
    public function destroyShade($id)
    {
        try {
            DB::table('vize_pigment_shades')->where('id', $id)->delete();
            $this->syncToFrontendJson();
            session()->flash('success', 'Shade formulation removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.pigments.index');
    }

    /**
     * Update stock status quickly from table dropdown.
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate(['stock_status' => 'required|string']);

        try {
            DB::table('vize_pigment_shades')->where('id', $id)->update([
                'stock_status' => $request->input('stock_status'),
                'updated_at'   => now(),
            ]);
            $this->syncToFrontendJson();
            session()->flash('success', 'Stock status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.pigments.index');
    }
}
