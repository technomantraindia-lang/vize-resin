<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizeTableTopController extends Controller
{
    public function index()
    {
        $tables = [];
        $inquiries = [];

        try {
            if (DB::getSchemaBuilder()->hasTable('vize_table_tops')) {
                $tables = DB::table('vize_table_tops')->orderBy('id', 'desc')->get();
            }
            if (DB::getSchemaBuilder()->hasTable('vize_table_inquiries')) {
                $inquiries = DB::table('vize_table_inquiries')->orderBy('id', 'desc')->get();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return view('admin::vize.table_tops.index', compact('tables', 'inquiries'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'category'   => 'nullable|string|max:100',
            'wood_type'  => 'nullable|string|max:100',
            'dimensions' => 'nullable|string|max:100',
            'resin'      => 'nullable|string|max:100',
            'status'     => 'required|string',
        ]);

        $dest1 = public_path('uploads/table-tops');
        $dest2 = base_path('../public/uploads/table-tops');
        File::ensureDirectoryExists($dest1);
        File::ensureDirectoryExists($dest2);

        $images = [];

        // Primary Image File
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($dest1, $filename);
            @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
            $images[] = '/uploads/table-tops/' . $filename;
        }

        // Additional / Multiple Uploaded Files
        $uploadedFiles = [];
        if ($request->hasFile('new_image_files')) {
            $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('new_image_files'));
        }
        if ($request->hasFile('gallery_files')) {
            $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('gallery_files'));
        }

        foreach ($uploadedFiles as $file) {
            if ($file && $file->isValid()) {
                $filename = time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
                $file->move($dest1, $filename);
                @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                $images[] = '/uploads/table-tops/' . $filename;
            }
        }

        // Manual URLs
        if ($request->filled('image_url')) {
            $extraUrls = preg_split('/[\r\n,]+/', $request->input('image_url'));
            foreach ($extraUrls as $url) {
                $trimmed = trim($url);
                if (!empty($trimmed) && !in_array($trimmed, $images)) {
                    $images[] = $trimmed;
                }
            }
        }

        $images = array_values(array_unique(array_filter($images)));
        if (empty($images)) {
            $images = ['/table top/1N2A7888.jpg'];
        }

        $primaryImage = $images[0] ?? '/table top/1N2A7888.jpg';

        $data = [
            'name'        => $request->input('name'),
            'slug'        => Str::slug($request->input('name')) . '-' . rand(100, 999),
            'wood_type'   => $request->input('wood_type', 'Solid Live-Edge Timber'),
            'dimensions'  => $request->input('dimensions', 'Custom Dimensions'),
            'price'       => (float) $request->input('price', 0),
            'status'      => $request->input('status', 'Ready to Ship'),
            'image_url'   => $primaryImage,
            'description' => $request->input('description'),
            'is_featured' => $request->has('is_featured') ? 1 : 0,
            'created_at'  => now(),
            'updated_at'  => now(),
        ];

        try {
            if (Schema::hasColumn('vize_table_tops', 'category')) {
                $data['category'] = $request->input('category', 'Dining & River Tables');
            }
            if (Schema::hasColumn('vize_table_tops', 'resin')) {
                $data['resin'] = $request->input('resin', 'Vize SuperCast');
            }
            if (Schema::hasColumn('vize_table_tops', 'images')) {
                $data['images'] = json_encode($images);
            }

            DB::table('vize_table_tops')->insert($data);

            session()->flash('success', 'Custom table design added successfully with photos.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save table: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.table_tops.index');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'category'   => 'nullable|string|max:100',
            'wood_type'  => 'nullable|string|max:100',
            'dimensions' => 'nullable|string|max:100',
            'resin'      => 'nullable|string|max:100',
            'status'     => 'required|string',
        ]);

        try {
            $existing = DB::table('vize_table_tops')->where('id', $id)->first();
            $dest1 = public_path('uploads/table-tops');
            $dest2 = base_path('../public/uploads/table-tops');
            File::ensureDirectoryExists($dest1);
            File::ensureDirectoryExists($dest2);

            $images = [];

            // 1. Process existing retained images
            if ($request->has('existing_images_json') && $request->input('existing_images_json') !== '') {
                $decoded = json_decode($request->input('existing_images_json'), true);
                if (is_array($decoded)) {
                    foreach ($decoded as $img) {
                        $img = trim($img);
                        if (!empty($img)) $images[] = $img;
                    }
                }
            } elseif ($existing) {
                if (!empty($existing->images)) {
                    $images = json_decode($existing->images, true) ?: [];
                } elseif (!empty($existing->image_url)) {
                    $images = [$existing->image_url];
                }
            }

            // 2. Direct slot replacements
            if ($request->hasFile('replace_files')) {
                foreach ($request->file('replace_files') as $slotIdx => $replaceFile) {
                    if ($replaceFile && $replaceFile->isValid() && isset($images[$slotIdx])) {
                        $filename = time() . '_' . Str::random(6) . '.' . $replaceFile->getClientOriginalExtension();
                        $replaceFile->move($dest1, $filename);
                        @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                        $images[$slotIdx] = '/uploads/table-tops/' . $filename;
                    }
                }
            }

            // 3. New additional uploads
            $uploadedFiles = [];
            if ($request->hasFile('image_file')) {
                $uploadedFiles[] = $request->file('image_file');
            }
            if ($request->hasFile('new_image_files')) {
                $uploadedFiles = array_merge($uploadedFiles, (array) $request->file('new_image_files'));
            }

            foreach ($uploadedFiles as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
                    $file->move($dest1, $filename);
                    @copy($dest1 . '/' . $filename, $dest2 . '/' . $filename);
                    $images[] = '/uploads/table-tops/' . $filename;
                }
            }

            // 4. Any extra manual URLs added
            if ($request->filled('image_url')) {
                $extraUrls = preg_split('/[\r\n,]+/', $request->input('image_url'));
                foreach ($extraUrls as $url) {
                    $trimmed = trim($url);
                    if (!empty($trimmed) && !in_array($trimmed, $images)) {
                        $images[] = $trimmed;
                    }
                }
            }

            $images = array_values(array_unique(array_filter($images)));
            if (empty($images)) {
                $images = ['/table top/1N2A7888.jpg'];
            }

            $primaryImage = $images[0] ?? '/table top/1N2A7888.jpg';

            $updateData = [
                'name'        => $request->input('name'),
                'wood_type'   => $request->input('wood_type', 'Solid Live-Edge Timber'),
                'dimensions'  => $request->input('dimensions', 'Custom Dimensions'),
                'price'       => (float) $request->input('price', 0),
                'status'      => $request->input('status', 'Ready to Ship'),
                'image_url'   => $primaryImage,
                'description' => $request->input('description'),
                'is_featured' => $request->has('is_featured') ? 1 : 0,
                'updated_at'  => now(),
            ];

            if (Schema::hasColumn('vize_table_tops', 'category')) {
                $updateData['category'] = $request->input('category', 'Dining & River Tables');
            }
            if (Schema::hasColumn('vize_table_tops', 'resin')) {
                $updateData['resin'] = $request->input('resin', 'Vize SuperCast');
            }
            if (Schema::hasColumn('vize_table_tops', 'images')) {
                $updateData['images'] = json_encode($images);
            }

            DB::table('vize_table_tops')->where('id', $id)->update($updateData);

            session()->flash('success', 'Table design and photo gallery updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to update table: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.table_tops.index');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        try {
            DB::table('vize_table_tops')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);

            session()->flash('success', 'Table status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed.');
        }

        return redirect()->route('admin.vize.table_tops.index');
    }

    public function updateInquiryStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        try {
            DB::table('vize_table_inquiries')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);
            session()->flash('success', 'Inquiry status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to update inquiry: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.table_tops.index');
    }

    public function destroyInquiry($id)
    {
        try {
            DB::table('vize_table_inquiries')->where('id', $id)->delete();
            session()->flash('success', 'Inquiry record removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to delete inquiry: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.table_tops.index');
    }

    public function destroy($id)
    {
        try {
            DB::table('vize_table_tops')->where('id', $id)->delete();
            session()->flash('success', 'Table design removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.table_tops.index');
    }
}
