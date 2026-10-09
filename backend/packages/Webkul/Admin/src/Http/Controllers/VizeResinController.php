<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class VizeResinController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('vize_resins');

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        $resins = $query->orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();

        // Fetch categories dynamically
        $categories = collect([
            (object)['id' => 1, 'name' => 'Flooring Resins', 'slug' => 'flooring-resins', 'desc' => 'Pure epoxy primers, screeding systems, stone binders, and decorative metallic floor coats.'],
            (object)['id' => 2, 'name' => 'Casting & Art', 'slug' => 'casting-art', 'desc' => 'Water-clear deep pour epoxy casting resin and mirror-gloss protective art coatings.'],
            (object)['id' => 3, 'name' => 'Protective Coatings', 'slug' => 'protective-coatings', 'desc' => 'Ultra-fast aliphatic polyaspartic and heavy-duty chemical-resistant polyurethane topcoats.'],
            (object)['id' => 4, 'name' => 'Finishing Compounds', 'slug' => 'finishing-compounds', 'desc' => 'Advanced hydrophobic nano silicon coatings and surface defense matrices.'],
        ]);

        try {
            if (DB::getSchemaBuilder()->hasTable('categories')) {
                $dbCategories = DB::table('categories')
                    ->join('category_translations', 'categories.id', '=', 'category_translations.category_id')
                    ->where('categories.parent_id', 1)
                    ->select('categories.id', 'category_translations.name', 'category_translations.slug', 'category_translations.description as desc')
                    ->get();

                if ($dbCategories->isNotEmpty()) {
                    $categories = $dbCategories;
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        return view('admin::vize.resins.index', compact('resins', 'categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'category'   => 'required|string|max:100',
            'base_price' => 'required|numeric|min:0',
            'tax_rate'   => 'nullable|numeric|min:0|max:100',
            'pack_qty'   => 'required|string|max:100',
            'mix_ratio'  => 'required|string|max:50',
        ]);

        $slug = Str::slug($request->input('name'));
        $sku = 'VZ-' . strtoupper(Str::random(5));

        // Dual directory support for instant live preview on local Vite and Laravel servers
        $dest1 = public_path('uploads/resins');
        File::ensureDirectoryExists($dest1);

        $dest2 = File::isDirectory(base_path('../public')) ? base_path('../public/uploads/resins') : null;
        if ($dest2) {
            File::ensureDirectoryExists($dest2);
        }

        $images = [];

        // Primary Image File
        if ($request->hasFile('primary_image_file')) {
            $file = $request->file('primary_image_file');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($dest1, $filename);
            if ($dest2) {
                @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
            }
            $images[] = '/uploads/resins/' . $filename;
        } elseif ($request->filled('image_url')) {
            $images[] = trim($request->input('image_url'));
        }

        // Additional / Multiple Uploaded Files
        $uploadedFiles = [];
        if ($request->hasFile('gallery_files')) {
            $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('gallery_files'));
        }
        if ($request->hasFile('new_image_files')) {
            $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('new_image_files'));
        }

        foreach ($uploadedFiles as $file) {
            if ($file && $file->isValid()) {
                $filename = time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
                $file->move($dest1, $filename);
                if ($dest2) {
                    @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                }
                $images[] = '/uploads/resins/' . $filename;
            }
        }

        // Additional gallery URLs
        if ($request->filled('gallery_urls')) {
            $extraUrls = preg_split('/[\r\n,]+/', $request->input('gallery_urls'));
            foreach ($extraUrls as $url) {
                $trimmed = trim($url);
                if (!empty($trimmed) && !in_array($trimmed, $images)) {
                    $images[] = $trimmed;
                }
            }
        }

        $images = array_values(array_unique(array_filter($images)));
        if (empty($images)) {
            $images = ['/rasin-product/Vize PrimeX.png'];
        }

        try {
            DB::table('vize_resins')->insert([
                'sku'                  => $request->input('sku', $sku),
                'slug'                 => $slug,
                'name'                 => $request->input('name'),
                'brand'                => $request->filled('brand') ? $request->input('brand') : $request->input('name'),
                'suffix'               => $request->filled('suffix') ? $request->input('suffix') : null,
                'category'             => $request->input('category'),
                'application_category' => $request->input('category'),
                'application_tag'      => $request->input('application_tag', $request->input('category')),
                'grade'                => $request->input('grade', 'Professional Grade'),
                'chemistry'            => $request->input('chemistry', 'Epoxy Polymer Formulation'),
                'tagline'              => $request->input('tagline', $request->input('mix_ratio') . ' Professional Resin System'),
                'base_price'           => $request->input('base_price'),
                'tax_rate'             => $request->filled('tax_rate') ? (float) $request->input('tax_rate') : 18.00,
                'pack_qty'             => $request->input('pack_qty'),
                'pack_composition'     => $request->input('pack_composition'),
                'mix_ratio'            => $request->input('mix_ratio'),
                'cure_time'            => $request->input('cure_time', '12–16 hrs'),
                'pot_life'             => $request->input('pot_life', '30–45 mins'),
                'coverage'             => $request->input('coverage', '~100 sq.ft'),
                'sqft_coverage'        => (int) $request->input('sqft_coverage', 100),
                'price_per_kg'         => $request->filled('price_per_kg') ? $request->input('price_per_kg') : null,
                'in_stock'             => $request->has('in_stock') ? 1 : 0,
                'images'               => json_encode($images),
                'about_text'           => $request->input('about_text'),
                'sort_order'           => (int) $request->input('sort_order', 1),
                'created_at'           => now(),
                'updated_at'           => now(),
            ]);

            session()->flash('success', 'Resin product created with photos successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to create product: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.resins.index');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'category'   => 'required|string|max:100',
            'base_price' => 'required|numeric|min:0',
            'tax_rate'   => 'nullable|numeric|min:0|max:100',
            'pack_qty'   => 'required|string|max:100',
            'mix_ratio'  => 'required|string|max:50',
        ]);

        try {
            $existing = DB::table('vize_resins')->where('id', $id)->first();
            $dest1 = public_path('uploads/resins');
            File::ensureDirectoryExists($dest1);

            $dest2 = File::isDirectory(base_path('../public')) ? base_path('../public/uploads/resins') : null;
            if ($dest2) {
                File::ensureDirectoryExists($dest2);
            }

            $images = [];

            // 1. Process existing retained images list (user can delete / reorder in visual UI)
            if ($request->has('existing_images_json') && $request->input('existing_images_json') !== '') {
                $decoded = json_decode($request->input('existing_images_json'), true);
                if (is_array($decoded)) {
                    foreach ($decoded as $img) {
                        $img = trim($img);
                        if (!empty($img)) {
                            $images[] = $img;
                        }
                    }
                }
            } elseif ($existing && !empty($existing->images)) {
                $images = json_decode($existing->images, true) ?: [];
            }

            // 2. Direct slot replacements (if user replaced specific photos)
            if ($request->hasFile('replace_files')) {
                foreach ($request->file('replace_files') as $slotIdx => $replaceFile) {
                    if ($replaceFile && $replaceFile->isValid() && isset($images[$slotIdx])) {
                        $filename = time() . '_' . Str::random(6) . '.' . $replaceFile->getClientOriginalExtension();
                        $replaceFile->move($dest1, $filename);
                        if ($dest2) {
                            @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                        }
                        $images[$slotIdx] = '/uploads/resins/' . $filename;
                    }
                }
            }

            // 3. Primary image upload (if new primary file selected)
            if ($request->hasFile('primary_image_file')) {
                $file = $request->file('primary_image_file');
                $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
                $file->move($dest1, $filename);
                if ($dest2) {
                    @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                }
                // Put new primary image at the beginning
                array_unshift($images, '/uploads/resins/' . $filename);
            }

            // 4. New additional gallery files upload
            $uploadedFiles = [];
            if ($request->hasFile('gallery_files')) {
                $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('gallery_files'));
            }
            if ($request->hasFile('new_image_files')) {
                $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('new_image_files'));
            }

            foreach ($uploadedFiles as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
                    $file->move($dest1, $filename);
                    if ($dest2) {
                        @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                    }
                    $images[] = '/uploads/resins/' . $filename;
                }
            }

            // 5. Any extra manual URLs added
            if ($request->filled('gallery_urls')) {
                $extraUrls = preg_split('/[\r\n,]+/', $request->input('gallery_urls'));
                foreach ($extraUrls as $url) {
                    $trimmed = trim($url);
                    if (!empty($trimmed) && !in_array($trimmed, $images)) {
                        $images[] = $trimmed;
                    }
                }
            }

            $images = array_values(array_unique(array_filter($images)));
            if (empty($images)) {
                $images = ['/rasin-product/Vize PrimeX.png'];
            }

            DB::table('vize_resins')->where('id', $id)->update([
                'name'                 => $request->input('name'),
                'brand'                => $request->filled('brand') ? $request->input('brand') : $request->input('name'),
                'suffix'               => $request->filled('suffix') ? $request->input('suffix') : null,
                'category'             => $request->input('category'),
                'application_category' => $request->input('category'),
                'application_tag'      => $request->input('application_tag', $request->input('category')),
                'grade'                => $request->input('grade', 'Professional Grade'),
                'chemistry'            => $request->input('chemistry', 'Epoxy Polymer Formulation'),
                'tagline'              => $request->input('tagline'),
                'base_price'           => $request->input('base_price'),
                'tax_rate'             => $request->filled('tax_rate') ? (float) $request->input('tax_rate') : 18.00,
                'pack_qty'             => $request->input('pack_qty'),
                'pack_composition'     => $request->input('pack_composition'),
                'mix_ratio'            => $request->input('mix_ratio'),
                'cure_time'            => $request->input('cure_time'),
                'pot_life'             => $request->input('pot_life'),
                'coverage'             => $request->input('coverage'),
                'price_per_kg'         => $request->filled('price_per_kg') ? $request->input('price_per_kg') : null,
                'images'               => json_encode($images),
                'about_text'           => $request->input('about_text'),
                'in_stock'             => $request->has('in_stock') ? 1 : 0,
                'updated_at'           => now(),
            ]);

            session()->flash('success', 'Resin product photos and details updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.resins.index');
    }

    public function updateStock(Request $request, $id)
    {
        try {
            $inStock = $request->input('in_stock') == '1' ? 1 : 0;
            DB::table('vize_resins')->where('id', $id)->update([
                'in_stock'   => $inStock,
                'updated_at' => now(),
            ]);

            session()->flash('success', 'Stock status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to update stock: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.resins.index');
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $slug = Str::slug($request->input('name'));
            $desc = $request->input('description', 'VIZE Specialty Polymer category.');

            $catId = DB::table('categories')->insertGetId([
                'position'   => DB::table('categories')->max('position') + 1,
                'status'     => 1,
                'parent_id'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('category_translations')->insert([
                'category_id'      => $catId,
                'locale'           => 'en',
                'name'             => $request->input('name'),
                'slug'             => $slug,
                'description'      => $desc,
                'meta_title'       => $request->input('name') . ' - VIZE Specialty Polymers',
                'meta_description' => $desc,
            ]);

            session()->flash('success', 'New Category added successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to add category: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.resins.index');
    }

    public function destroy($id)
    {
        try {
            DB::table('vize_resins')->where('id', $id)->delete();
            session()->flash('success', 'Resin product removed from catalog.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to delete product: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.resins.index');
    }
}
