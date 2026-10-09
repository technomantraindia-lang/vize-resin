<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizeWorkshopController extends Controller
{
    /**
     * Ensure required tables, columns and seed data from courses.json exist.
     */
    protected function ensureTablesAndData()
    {
        try {
            if (!Schema::hasTable('vize_courses')) {
                Schema::create('vize_courses', function ($table) {
                    $table->id();
                    $table->string('slug')->unique();
                    $table->string('name');
                    $table->string('provider')->default('ESSENTIAL ARTWORKS × VIZE');
                    $table->string('category')->default('Metallic & Resin Flooring');
                    $table->string('duration')->nullable();
                    $table->string('date')->nullable();
                    $table->string('location')->nullable();
                    $table->string('seats')->nullable();
                    $table->decimal('price', 10, 2)->nullable();
                    $table->text('level')->nullable();
                    $table->string('badge')->nullable();
                    $table->text('batch_note')->nullable();
                    $table->string('image')->nullable();
                    $table->text('short_desc')->nullable();
                    $table->longText('overview')->nullable();
                    $table->string('key_highlight')->nullable();
                    $table->text('key_highlight_desc')->nullable();
                    $table->longText('curriculum')->nullable();
                    $table->longText('inclusions')->nullable();
                    $table->longText('who_can_join')->nullable();
                    $table->longText('techniques_or_modules')->nullable();
                    $table->longText('custom_fields')->nullable();
                    $table->string('status')->default('Active');
                    $table->integer('sort_order')->default(0);
                    $table->timestamps();
                });
            } else {
                // Ensure custom_fields column exists
                if (!Schema::hasColumn('vize_courses', 'custom_fields')) {
                    Schema::table('vize_courses', function ($table) {
                        $table->longText('custom_fields')->nullable()->after('techniques_or_modules');
                    });
                }
            }

            if (!Schema::hasTable('vize_workshops')) {
                Schema::create('vize_workshops', function ($table) {
                    $table->id();
                    $table->string('title')->default('METALLIC & RESIN FLOORING WORKSHOP');
                    $table->string('slug')->default('epoxy-flooring');
                    $table->text('description')->nullable();
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('vize_workshop_batches')) {
                Schema::create('vize_workshop_batches', function ($table) {
                    $table->id();
                    $table->unsignedBigInteger('workshop_id')->default(1);
                    $table->string('city');
                    $table->string('venue');
                    $table->date('start_date');
                    $table->date('end_date')->nullable();
                    $table->integer('total_seats')->default(30);
                    $table->integer('booked_seats')->default(0);
                    $table->string('status')->default('Open');
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('vize_workshop_admissions')) {
                Schema::create('vize_workshop_admissions', function ($table) {
                    $table->id();
                    $table->unsignedBigInteger('batch_id')->nullable();
                    $table->string('student_name');
                    $table->string('email');
                    $table->string('phone');
                    $table->string('whatsapp')->nullable();
                    $table->string('payment_status')->default('Pending');
                    $table->decimal('amount_paid', 10, 2)->default(0);
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            }

            // Seed initial courses from courses.json if empty
            if (DB::table('vize_courses')->count() === 0) {
                $filePath = base_path('../src/data/courses.json');
                if (File::exists($filePath)) {
                    $coursesJson = json_decode(File::get($filePath), true);
                    if (is_array($coursesJson)) {
                        foreach ($coursesJson as $idx => $c) {
                            $techsOrModules = null;
                            if (!empty($c['flooringTechniques'])) {
                                $techsOrModules = json_encode($c['flooringTechniques']);
                            } elseif (!empty($c['trainingModules'])) {
                                $techsOrModules = json_encode($c['trainingModules']);
                            }

                            $customFields = !empty($c['customFields']) ? json_encode($c['customFields']) : null;

                            DB::table('vize_courses')->insert([
                                'slug'                  => $c['id'] ?? Str::slug($c['name'] ?? 'course-' . ($idx + 1)),
                                'name'                  => $c['name'] ?? 'Untitled Course',
                                'provider'              => $c['provider'] ?? 'ESSENTIAL ARTWORKS',
                                'category'              => $c['category'] ?? 'Resin Training',
                                'duration'              => $c['duration'] ?? '4 Days Technical Training',
                                'date'                  => $c['date'] ?? 'Upcoming Batch',
                                'location'              => $c['location'] ?? 'Menpura, Vadodara, Gujarat',
                                'seats'                 => $c['seats'] ?? 'LIMITED SEATS – ONLY 30 PARTICIPANTS',
                                'price'                 => $c['price'] ?? null,
                                'level'                 => $c['level'] ?? 'Beginners & Professionals',
                                'badge'                 => $c['badge'] ?? null,
                                'batch_note'            => $c['batchNote'] ?? null,
                                'image'                 => $c['image'] ?? '/cat-flooring.jpg',
                                'short_desc'            => $c['shortDesc'] ?? null,
                                'overview'              => $c['overview'] ?? null,
                                'key_highlight'         => $c['keyHighlight'] ?? null,
                                'key_highlight_desc'    => $c['keyHighlightDesc'] ?? null,
                                'curriculum'            => !empty($c['curriculum']) ? json_encode($c['curriculum']) : '[]',
                                'inclusions'            => !empty($c['inclusions']) ? json_encode($c['inclusions']) : '[]',
                                'who_can_join'          => !empty($c['whoCanJoin']) ? json_encode($c['whoCanJoin']) : '[]',
                                'techniques_or_modules' => $techsOrModules,
                                'custom_fields'         => $customFields,
                                'status'                => 'Active',
                                'sort_order'            => $idx,
                                'created_at'            => now(),
                                'updated_at'            => now(),
                            ]);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            report($e);
        }
    }

    /**
     * Synchronize database courses back to src/data/courses.json for static fallback.
     */
    protected function syncToFrontendJson()
    {
        try {
            $courses = DB::table('vize_courses')
                ->where('status', 'Active')
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'asc')
                ->get();

            $formatted = [];
            foreach ($courses as $c) {
                $curriculum = json_decode($c->curriculum, true) ?: [];
                $inclusions = json_decode($c->inclusions, true) ?: [];
                $whoCanJoin = json_decode($c->who_can_join, true) ?: [];
                $techsOrModules = json_decode($c->techniques_or_modules, true);
                $customFields = json_decode($c->custom_fields, true) ?: [];

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
                    'curriculum'       => $curriculum,
                    'inclusions'       => $inclusions,
                    'whoCanJoin'       => $whoCanJoin,
                    'customFields'     => $customFields,
                ];

                if ($c->price) {
                    $item['price'] = (float) $c->price;
                }

                if (is_array($techsOrModules) && count($techsOrModules) > 0) {
                    // Check if it looks like flooring techniques or training modules
                    if (isset($techsOrModules[0]['num'])) {
                        $item['trainingModules'] = $techsOrModules;
                    } else {
                        $item['flooringTechniques'] = $techsOrModules;
                    }
                }

                $formatted[] = $item;
            }

            $filePath = base_path('../src/data/courses.json');
            if (File::exists(dirname($filePath))) {
                File::put($filePath, json_encode($formatted, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }
        } catch (\Exception $e) {
            report($e);
        }
    }

    /**
     * Parse multiline text or array into a clean array of strings.
     */
    protected function parseListInput(Request $request, $fieldName)
    {
        $items = $request->input($fieldName);
        if (is_array($items)) {
            $result = [];
            foreach ($items as $item) {
                $clean = trim($item);
                if (!empty($clean)) {
                    $clean = preg_replace('/^[\s•\-\*]+\s*/u', '', $clean);
                    if (!empty($clean)) {
                        $result[] = $clean;
                    }
                }
            }
            return array_values($result);
        } elseif (is_string($items)) {
            return $this->parseLines($items);
        }
        return [];
    }

    /**
     * Parse multiline text into a clean array of strings.
     */
    protected function parseLines($text)
    {
        if (empty($text)) {
            return [];
        }
        $lines = preg_split('/\r\n|\r|\n/', trim($text));
        $result = [];
        foreach ($lines as $line) {
            $clean = trim($line);
            if (!empty($clean)) {
                $clean = preg_replace('/^[\s•\-\*]+\s*/u', '', $clean);
                if (!empty($clean)) {
                    $result[] = $clean;
                }
            }
        }
        return array_values($result);
    }

    /**
     * Parse multiline techniques or modules from array rows or textarea.
     */
    protected function parseTechniquesOrModulesInput(Request $request)
    {
        $names = $request->input('technique_names', []);
        $descs = $request->input('technique_descs', []);
        $nums  = $request->input('technique_nums', []);

        if (is_array($names) && count($names) > 0) {
            $result = [];
            foreach ($names as $i => $name) {
                $n = trim($name);
                $d = trim($descs[$i] ?? '');
                $num = trim($nums[$i] ?? '');
                if (!empty($n)) {
                    if (!empty($num)) {
                        $result[] = [
                            'num'   => $num,
                            'title' => $n,
                            'desc'  => $d,
                        ];
                    } else {
                        $result[] = [
                            'name' => $n,
                            'desc' => $d,
                        ];
                    }
                }
            }
            if (count($result) > 0) {
                return $result;
            }
        }

        return $this->parseTechniquesOrModules($request->input('techniques_or_modules'));
    }

    /**
     * Parse multiline techniques or modules.
     */
    protected function parseTechniquesOrModules($text)
    {
        if (empty($text)) {
            return null;
        }

        $jsonDecoded = json_decode($text, true);
        if (is_array($jsonDecoded)) {
            return $jsonDecoded;
        }

        $lines = preg_split('/\r\n|\r|\n/', trim($text));
        $result = [];
        $index = 1;

        foreach ($lines as $line) {
            $clean = trim($line);
            if (empty($clean)) continue;

            if (str_contains($clean, ':')) {
                $parts = explode(':', $clean, 2);
                $result[] = [
                    'name' => trim($parts[0]),
                    'desc' => trim($parts[1] ?? ''),
                ];
            } elseif (str_contains($clean, '|')) {
                $parts = explode('|', $clean);
                if (count($parts) >= 3) {
                    $result[] = [
                        'num'   => trim($parts[0]),
                        'title' => trim($parts[1]),
                        'desc'  => trim($parts[2]),
                    ];
                } else {
                    $result[] = [
                        'num'   => str_pad($index, 2, '0', STR_PAD_LEFT),
                        'title' => trim($parts[0]),
                        'desc'  => trim($parts[1] ?? ''),
                    ];
                }
            } else {
                $result[] = [
                    'name' => $clean,
                    'desc' => $clean,
                ];
            }
            $index++;
        }

        return count($result) > 0 ? $result : null;
    }

    /**
     * Parse dynamic custom fields submitted from form.
     */
    protected function parseCustomFields(Request $request)
    {
        $customFields = [];
        $keys = $request->input('custom_field_keys', []);
        $values = $request->input('custom_field_values', []);
        $types = $request->input('custom_field_types', []);

        if (is_array($keys)) {
            foreach ($keys as $i => $key) {
                $k = trim($key);
                $v = trim($values[$i] ?? '');
                $t = trim($types[$i] ?? 'text');
                if (!empty($k)) {
                    $customFields[] = [
                        'key'   => $k,
                        'value' => $v,
                        'type'  => $t,
                    ];
                }
            }
        }

        return count($customFields) > 0 ? json_encode($customFields) : null;
    }

    public function index()
    {
        $this->ensureTablesAndData();

        $courses = [];
        $batches = [];
        $admissions = [];

        try {
            $courses = DB::table('vize_courses')
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'asc')
                ->get();

            // Decode JSON fields for easy display
            $courses->transform(function ($c) {
                $c->curriculum_array = json_decode($c->curriculum, true) ?: [];
                $c->inclusions_array = json_decode($c->inclusions, true) ?: [];
                $c->who_can_join_array = json_decode($c->who_can_join, true) ?: [];
                $c->techniques_or_modules_array = json_decode($c->techniques_or_modules, true) ?: [];
                $c->custom_fields_array = json_decode($c->custom_fields ?? '[]', true) ?: [];
                return $c;
            });

            if (Schema::hasTable('vize_workshop_batches')) {
                $batches = DB::table('vize_workshop_batches')
                    ->leftJoin('vize_courses', 'vize_workshop_batches.workshop_id', '=', 'vize_courses.id')
                    ->select('vize_workshop_batches.*', 'vize_courses.name as workshop_title')
                    ->orderBy('start_date', 'asc')
                    ->get();
            }

            if (Schema::hasTable('vize_workshop_admissions')) {
                $admissions = DB::table('vize_workshop_admissions')
                    ->leftJoin('vize_workshop_batches', 'vize_workshop_admissions.batch_id', '=', 'vize_workshop_batches.id')
                    ->select('vize_workshop_admissions.*', 'vize_workshop_batches.city', 'vize_workshop_batches.start_date')
                    ->orderBy('id', 'desc')
                    ->get();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return view('admin::vize.workshops.index', compact('courses', 'batches', 'admissions'));
    }

    /**
     * Store a newly created Course.
     */
    public function storeCourse(Request $request)
    {
        $this->ensureTablesAndData();

        $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'duration' => 'required|string|max:100',
        ]);

        try {
            $slug = !empty($request->input('slug'))
                ? Str::slug($request->input('slug'))
                : Str::slug($request->input('name'));

            // Ensure unique slug
            $originalSlug = $slug;
            $count = 1;
            while (DB::table('vize_courses')->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            // Handle Image Upload or URL
            $imagePath = $request->input('image_url') ?: '/cat-flooring.jpg';
            if ($request->hasFile('image_file')) {
                $file = $request->file('image_file');
                $fileName = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
                $destination = public_path('uploads/courses');
                if (!File::exists($destination)) {
                    File::makeDirectory($destination, 0755, true);
                }
                $file->move($destination, $fileName);
                $imagePath = '/uploads/courses/' . $fileName;
            }

            $curriculum = $this->parseListInput($request, 'curriculum');
            $inclusions = $this->parseListInput($request, 'inclusions');
            $whoCanJoin = $this->parseListInput($request, 'who_can_join');
            $techsModules = $this->parseTechniquesOrModulesInput($request);
            $customFields = $this->parseCustomFields($request);

            DB::table('vize_courses')->insert([
                'slug'                  => $slug,
                'name'                  => $request->input('name'),
                'provider'              => $request->input('provider') ?: 'ESSENTIAL ARTWORKS × VIZE',
                'category'              => $request->input('category'),
                'duration'              => $request->input('duration'),
                'date'                  => $request->input('date') ?: null,
                'location'              => $request->input('location') ?: null,
                'seats'                 => $request->input('seats') ?: null,
                'price'                 => $request->input('price') ? (float) $request->input('price') : null,
                'level'                 => $request->input('level') ?: null,
                'badge'                 => $request->input('badge') ?: null,
                'batch_note'            => $request->input('batch_note') ?: null,
                'image'                 => $imagePath ?: null,
                'short_desc'            => $request->input('short_desc') ?: null,
                'overview'              => $request->input('overview') ?: null,
                'key_highlight'         => $request->input('key_highlight') ?: null,
                'key_highlight_desc'    => $request->input('key_highlight_desc') ?: null,
                'curriculum'            => json_encode($curriculum),
                'inclusions'            => json_encode($inclusions),
                'who_can_join'          => json_encode($whoCanJoin),
                'techniques_or_modules' => $techsModules ? json_encode($techsModules) : null,
                'custom_fields'         => $customFields,
                'status'                => $request->input('status', 'Active'),
                'sort_order'            => (int) $request->input('sort_order', 0),
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Masterclass Course created and synchronized to storefront successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to create course: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    /**
     * Update an existing Course.
     */
    public function updateCourse(Request $request, $id)
    {
        $this->ensureTablesAndData();

        $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'duration' => 'required|string|max:100',
        ]);

        try {
            $course = DB::table('vize_courses')->where('id', $id)->first();
            if (!$course) {
                session()->flash('error', 'Course record not found.');
                return redirect()->route('admin.vize.workshops.index');
            }

            $slug = !empty($request->input('slug'))
                ? Str::slug($request->input('slug'))
                : $course->slug;

            // Handle Image
            $imagePath = $course->image;
            if ($request->hasFile('image_file')) {
                $file = $request->file('image_file');
                $fileName = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
                $destination = public_path('uploads/courses');
                if (!File::exists($destination)) {
                    File::makeDirectory($destination, 0755, true);
                }
                $file->move($destination, $fileName);
                $imagePath = '/uploads/courses/' . $fileName;
            } elseif ($request->has('image_url')) {
                $imagePath = $request->input('image_url') ?: null;
            }

            $curriculum = $this->parseListInput($request, 'curriculum');
            $inclusions = $this->parseListInput($request, 'inclusions');
            $whoCanJoin = $this->parseListInput($request, 'who_can_join');
            $techsModules = $this->parseTechniquesOrModulesInput($request);
            $customFields = $this->parseCustomFields($request);

            DB::table('vize_courses')->where('id', $id)->update([
                'slug'                  => $slug,
                'name'                  => $request->input('name'),
                'provider'              => $request->input('provider') ?: 'ESSENTIAL ARTWORKS × VIZE',
                'category'              => $request->input('category'),
                'duration'              => $request->input('duration'),
                'date'                  => $request->input('date') ?: null,
                'location'              => $request->input('location') ?: null,
                'seats'                 => $request->input('seats') ?: null,
                'price'                 => $request->input('price') ? (float) $request->input('price') : null,
                'level'                 => $request->input('level') ?: null,
                'badge'                 => $request->input('badge') ?: null,
                'batch_note'            => $request->input('batch_note') ?: null,
                'image'                 => $imagePath ?: null,
                'short_desc'            => $request->input('short_desc') ?: null,
                'overview'              => $request->input('overview') ?: null,
                'key_highlight'         => $request->input('key_highlight') ?: null,
                'key_highlight_desc'    => $request->input('key_highlight_desc') ?: null,
                'curriculum'            => json_encode($curriculum),
                'inclusions'            => json_encode($inclusions),
                'who_can_join'          => json_encode($whoCanJoin),
                'techniques_or_modules' => $techsModules ? json_encode($techsModules) : null,
                'custom_fields'         => $customFields,
                'status'                => $request->input('status', 'Active'),
                'sort_order'            => (int) $request->input('sort_order', $course->sort_order),
                'updated_at'            => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Masterclass Course details updated and synced successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to update course: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    /**
     * Delete a Course.
     */
    public function destroyCourse($id)
    {
        try {
            DB::table('vize_courses')->where('id', $id)->delete();
            $this->syncToFrontendJson();
            session()->flash('success', 'Masterclass Course removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function storeBatch(Request $request)
    {
        $request->validate([
            'city'        => 'required|string|max:100',
            'venue'       => 'required|string|max:255',
            'start_date'  => 'required|date',
            'total_seats' => 'required|integer|min:1',
            'status'      => 'required|string',
        ]);

        try {
            $workshopId = $request->input('workshop_id') ?? (DB::table('vize_courses')->value('id') ?? 1);

            DB::table('vize_workshop_batches')->insert([
                'workshop_id'  => $workshopId,
                'city'         => $request->input('city'),
                'venue'        => $request->input('venue'),
                'start_date'   => $request->input('start_date'),
                'end_date'     => $request->input('end_date') ?? date('Y-m-d', strtotime($request->input('start_date') . ' + 2 days')),
                'total_seats'  => $request->input('total_seats', 30),
                'booked_seats' => 0,
                'status'       => $request->input('status', 'Open'),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            session()->flash('success', 'Workshop training batch scheduled.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to schedule batch: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function updateBatchStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        try {
            DB::table('vize_workshop_batches')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);
            session()->flash('success', 'Batch status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function destroyBatch($id)
    {
        try {
            DB::table('vize_workshop_batches')->where('id', $id)->delete();
            session()->flash('success', 'Batch removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function updateAdmissionStatus(Request $request, $id)
    {
        $request->validate(['payment_status' => 'required|string']);

        try {
            DB::table('vize_workshop_admissions')->where('id', $id)->update([
                'payment_status' => $request->input('payment_status'),
                'updated_at'     => now(),
            ]);
            session()->flash('success', 'Student admission status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function destroyAdmission($id)
    {
        try {
            DB::table('vize_workshop_admissions')->where('id', $id)->delete();
            session()->flash('success', 'Student admission record removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.workshops.index');
    }

    public function exportAttendees($batchId = null)
    {
        $query = DB::table('vize_workshop_admissions')
            ->leftJoin('vize_workshop_batches', 'vize_workshop_admissions.batch_id', '=', 'vize_workshop_batches.id')
            ->select(
                'vize_workshop_admissions.id',
                'vize_workshop_admissions.student_name',
                'vize_workshop_admissions.email',
                'vize_workshop_admissions.phone',
                'vize_workshop_admissions.whatsapp',
                'vize_workshop_admissions.payment_status',
                'vize_workshop_batches.city',
                'vize_workshop_batches.start_date',
                'vize_workshop_admissions.created_at'
            );

        if ($batchId) {
            $query->where('vize_workshop_admissions.batch_id', $batchId);
        }

        $attendees = $query->get();

        $csvHeader = ['ID', 'Student Name', 'Email', 'Phone', 'WhatsApp', 'Payment Status', 'Batch City', 'Batch Date', 'Registration Date'];
        $callback = function () use ($attendees, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($attendees as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->student_name,
                    $row->email,
                    $row->phone,
                    $row->whatsapp,
                    $row->payment_status,
                    $row->city,
                    $row->start_date,
                    $row->created_at
                ]);
            }
            fclose($file);
        };

        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=vize_workshop_attendees_' . date('Y_m_d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        return response()->stream($callback, 200, $headers);
    }
}
