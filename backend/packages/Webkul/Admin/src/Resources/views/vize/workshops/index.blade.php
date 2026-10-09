<x-admin::layouts>
    <x-slot:title>
        Courses & Workshops Hub - VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span>🎓</span> Courses & Workshops Hub
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage curriculum, schedule batches, add & delete existing or dynamic custom fields, track student leads, and synchronize live with the storefront.
            </p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
            <a
                href="{{ route('admin.vize.workshops.export_attendees') }}"
                class="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
                📥 Export Attendee Roll (CSV)
            </a>

            <button
                type="button"
                onclick="openAddBatchModal()"
                class="flex items-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                style="background-color: #059669; color: #ffffff;"
            >
                <span class="text-lg font-bold">+</span> Schedule Batch
            </button>

            <button
                type="button"
                onclick="openAddCourseModal()"
                class="primary-button flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                style="background-color: #2563eb; color: #ffffff;"
            >
                <span class="text-lg font-bold">+</span> Add New Course
            </button>
        </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-blue-600">Active Courses</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($courses) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-gray-500">Scheduled Batches</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($batches) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-emerald-600">Total Enrolled</p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">{{ count($admissions) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-amber-600">Filling Fast Batches</p>
            <p class="mt-2 text-2xl font-bold text-amber-600">{{ collect($batches)->where('status', 'Filling Fast')->count() }}</p>
        </div>
    </div>

    <!-- Section Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-6 text-sm font-semibold flex-wrap">
        <button
            type="button"
            onclick="showWorkshopTab('courses')"
            id="tab-btn-courses"
            class="pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold transition"
        >
            🎓 Training Courses & Masterclasses ({{ count($courses) }})
        </button>
        <button
            type="button"
            onclick="showWorkshopTab('batches')"
            id="tab-btn-batches"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            📅 Scheduled Batches & Quotas ({{ count($batches) }})
        </button>
        <button
            type="button"
            onclick="showWorkshopTab('admissions')"
            id="tab-btn-admissions"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            👥 Student Registrations & Leads ({{ count($admissions) }})
        </button>
    </div>

    <!-- =========================================================================
         TAB 1: TRAINING COURSES & MASTERCLASSES
         ========================================================================= -->
    <div id="tab-workshop-courses" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        @forelse ($courses as $c)
            <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <!-- Image Banner & Badges -->
                    <div class="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                            src="{{ $c->image ?: '/cat-flooring.jpg' }}"
                            alt="{{ $c->name }}"
                            class="w-full h-full object-cover"
                            onerror="this.src='/cat-flooring.jpg'"
                        >
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
                            <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-sm" style="background-color: #2563eb; color: #fff;">
                                {{ $c->category }}
                            </span>
                            @if ($c->badge)
                                <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-sm" style="background-color: #f59e0b; color: #fff;">
                                    {{ $c->badge }}
                                </span>
                            @endif
                        </div>

                        <div class="absolute top-3 right-3">
                            <span class="text-xs font-bold px-2 py-1 rounded-full {{ $c->status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white' }}" style="{{ $c->status === 'Active' ? 'background-color: #10b981; color: #fff;' : 'background-color: #6b7280; color: #fff;' }}">
                                {{ $c->status }}
                            </span>
                        </div>

                        <div class="absolute bottom-3 left-3 right-3 text-white">
                            <span class="text-xs font-medium opacity-90 block">⏱ {{ $c->duration }}</span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5">
                        <div class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                            {{ $c->provider }}
                        </div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2">
                            {{ $c->name }}
                        </h3>

                        @if ($c->key_highlight)
                            <div class="mb-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                <span>⚡</span>
                                <span class="truncate">{{ $c->key_highlight }}</span>
                            </div>
                        @endif

                        <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                            {{ $c->short_desc ?: $c->overview }}
                        </p>

                        <!-- Key Metadata Chips -->
                        <div class="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                            @if ($c->date)
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-400">📅</span>
                                    <span class="font-medium truncate">{{ $c->date }}</span>
                                </div>
                            @endif
                            @if ($c->location)
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-400">📍</span>
                                    <span class="truncate">{{ $c->location }}</span>
                                </div>
                            @endif
                            @if ($c->seats)
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-400">💺</span>
                                    <span class="truncate">{{ $c->seats }}</span>
                                </div>
                            @endif
                            @if ($c->price)
                                <div class="flex items-center gap-2 text-emerald-600 font-bold">
                                    <span>💰</span>
                                    <span>₹{{ number_format($c->price) }}</span>
                                </div>
                            @endif
                        </div>

                        <!-- Summary Counts & Custom Fields Pill -->
                        <div class="flex gap-2 flex-wrap text-xs text-gray-500 mb-2">
                            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                📚 {{ count($c->curriculum_array) }} Topics
                            </span>
                            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                🎁 {{ count($c->inclusions_array) }} Inclusions
                            </span>
                            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                🎯 {{ count($c->who_can_join_array) }} Audience
                            </span>
                            @if (count($c->custom_fields_array) > 0)
                                <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                                    ✨ {{ count($c->custom_fields_array) }} Custom Fields
                                </span>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                    <span class="text-xs font-mono text-gray-400">/{{ $c->slug }}</span>
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            onclick='openEditCourseModal(@json($c))'
                            class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition cursor-pointer"
                        >
                            ✏️ Edit Course
                        </button>
                        
                        <form action="{{ route('admin.vize.workshops.courses.destroy', $c->id) }}" method="POST" onsubmit="return confirm('Delete course &quot;{{ $c->name }}&quot;? This will permanently remove it from both Admin Panel and Storefront.');" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer">
                                🗑️ Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                No courses found. Click "+ Add New Course" to create the first curriculum module.
            </div>
        @endforelse
    </div>

    <!-- =========================================================================
         TAB 2: SCHEDULED BATCHES & QUOTAS
         ========================================================================= -->
    <div id="tab-workshop-batches" class="hidden grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        @forelse ($batches as $batch)
            <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            📍 {{ $batch->city }}
                        </span>
                        <form action="{{ route('admin.vize.workshops.batches.update_status', $batch->id) }}" method="POST" class="inline">
                            @csrf
                            <select
                                name="status"
                                onchange="this.form.submit()"
                                class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                    {{ $batch->status == 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}
                                    {{ $batch->status == 'Filling Fast' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}
                                    {{ $batch->status == 'Sold Out' ? 'bg-rose-50 text-rose-700 border-rose-200' : '' }}"
                            >
                                <option value="Open" {{ $batch->status == 'Open' ? 'selected' : '' }}>Open</option>
                                <option value="Filling Fast" {{ $batch->status == 'Filling Fast' ? 'selected' : '' }}>Filling Fast</option>
                                <option value="Sold Out" {{ $batch->status == 'Sold Out' ? 'selected' : '' }}>Sold Out</option>
                            </select>
                        </form>
                    </div>

                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">
                        {{ date('M d, Y', strtotime($batch->start_date)) }} — {{ date('M d, Y', strtotime($batch->end_date ?? $batch->start_date)) }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        🎓 {{ $batch->workshop_title ?? 'Masterclass Training' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ $batch->venue }}</p>

                    <!-- Seats Progress Bar -->
                    <div class="mb-3">
                        <div class="flex justify-between text-xs font-semibold mb-1">
                            <span class="text-gray-600 dark:text-gray-300">Seats Reserved</span>
                            <span class="text-gray-900 dark:text-white">{{ $batch->booked_seats }} / {{ $batch->total_seats }} Seats</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            @php
                                $percent = min(100, round(($batch->booked_seats / max(1, $batch->total_seats)) * 100));
                            @endphp
                            <div class="h-full bg-blue-600 rounded-full" style="width: {{ $percent }}%"></div>
                        </div>
                    </div>
                </div>

                <div class="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                    <span class="text-gray-500">Max {{ $batch->total_seats }} Seats Quota</span>
                    <div class="flex gap-2 items-center">
                        <a href="{{ route('admin.vize.workshops.export_attendees', $batch->id) }}" class="text-blue-600 hover:underline font-medium">Export CSV &rarr;</a>
                        <form action="{{ route('admin.vize.workshops.batches.destroy', $batch->id) }}" method="POST" onsubmit="return confirm('Delete this batch schedule?');" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-500 hover:text-red-700 ml-2 cursor-pointer">🗑️ Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                No workshop batches scheduled yet. Click "+ Schedule Batch" to open registration.
            </div>
        @endforelse
    </div>

    <!-- =========================================================================
         TAB 3: STUDENT REGISTRATIONS & LEADS
         ========================================================================= -->
    <div id="tab-workshop-admissions" class="hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-8">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-base">Student Registrations & Admission Inquiries</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Live student inquiries and workshop admissions submitted from your storefront.</p>
            </div>
            <a href="{{ route('admin.vize.workshops.export_attendees') }}" class="text-xs font-semibold text-blue-600 hover:underline">
                Download Roll CSV ↗
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Student Name</th>
                        <th class="px-5 py-3.5">Contact (Phone / WhatsApp)</th>
                        <th class="px-5 py-3.5">Batch & City</th>
                        <th class="px-5 py-3.5">Payment Status</th>
                        <th class="px-5 py-3.5">Registration Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($admissions as $student)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                {{ $student->student_name }}
                                <span class="text-xs text-gray-400 block font-normal">{{ $student->email }}</span>
                            </td>
                            <td class="px-5 py-4 text-xs font-mono">
                                <div>📞 {{ $student->phone }}</div>
                                <div><a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $student->whatsapp ?? $student->phone) }}" target="_blank" class="text-emerald-600 hover:underline font-medium">💬 {{ $student->whatsapp ?? $student->phone }} (WhatsApp ↗)</a></div>
                            </td>
                            <td class="px-5 py-4 text-xs">
                                <span class="font-semibold text-gray-800 dark:text-gray-200">{{ $student->city ?? 'Direct Inquiry' }}</span>
                                <span class="text-gray-400 block mt-0.5">{{ $student->start_date ? date('M d, Y', strtotime($student->start_date)) : 'Upcoming' }}</span>
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.workshops.admissions.update_status', $student->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="payment_status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $student->payment_status == 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}
                                            {{ $student->payment_status == 'Advance Paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : '' }}
                                            {{ $student->payment_status == 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}"
                                    >
                                        <option value="Pending" {{ $student->payment_status == 'Pending' ? 'selected' : '' }}>Pending</option>
                                        <option value="Advance Paid" {{ $student->payment_status == 'Advance Paid' ? 'selected' : '' }}>Advance Paid</option>
                                        <option value="Completed" {{ $student->payment_status == 'Completed' ? 'selected' : '' }}>Completed</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500">
                                {{ date('M d, Y H:i', strtotime($student->created_at)) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.workshops.admissions.destroy', $student->id) }}" method="POST" onsubmit="return confirm('Delete this admission record?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                        🗑️ Remove
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-8 text-center text-gray-400">
                                No student registrations recorded yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         ADD COURSE MODAL (WITH FIELD DELETION & DYNAMIC ROWS)
         ========================================================================= -->
    <div
        id="addCourseModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 960px; height: 90vh; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <!-- Sticky Header -->
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 8px; margin: 0;">
                        <span>🎓</span> Create Masterclass Training Course
                    </h3>
                    <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0 0;">Add or delete any existing field, curriculum topic, inclusion, module, or dynamic custom field.</p>
                </div>
                <button type="button" onclick="closeAddCourseModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <!-- Form Wrapper with Internal Scroll -->
            <form action="{{ route('admin.vize.workshops.courses.store') }}" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf

                <!-- Scrollable Body Content -->
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 20px;">
                    
                    <!-- Section 1: Identification & Categorization -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
                            <span>📌</span> Course Overview & Identification
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Course Title *</label>
                                <input type="text" name="name" required placeholder="e.g. METALLIC & RESIN FLOORING WORKSHOP" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                            </div>

                            <div id="wrapper_add_course_slug">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Course Slug / ID</label>
                                    <button type="button" onclick="clearField('add_course_slug')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_slug" name="slug" placeholder="e.g. epoxy-flooring (auto-generated if empty)" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                            </div>

                            <div id="wrapper_add_course_provider">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Training Provider</label>
                                    <button type="button" onclick="clearField('add_course_provider')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_provider" name="provider" value="ESSENTIAL ARTWORKS × VIZE" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
                                <select name="category" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                    <option value="Metallic & Resin Flooring">Metallic & Resin Flooring</option>
                                    <option value="Resin Casting & Table Making">Resin Casting & Table Making</option>
                                    <option value="Artistry & Creative Casting">Artistry & Creative Casting</option>
                                    <option value="Industrial Floor Screeds">Industrial Floor Screeds</option>
                                    <option value="Countertop & Doming">Countertop & Doming</option>
                                </select>
                            </div>

                            <div id="wrapper_add_course_badge">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Badge Tag</label>
                                    <button type="button" onclick="clearField('add_course_badge')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_badge" name="badge" placeholder="e.g. 22nd – 25th Oct 2026 · Vadodara" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Logistics & Schedule Details -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
                            <span>🗓️</span> Duration, Logistics & Pricing
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Duration *</label>
                                <input type="text" name="duration" required placeholder="e.g. 4 Days Technical + Hands-on Training" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_add_course_date">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Batch Dates</label>
                                    <button type="button" onclick="clearField('add_course_date')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_date" name="date" placeholder="e.g. 22nd – 25th October 2026" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_add_course_seats">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Seats Quota Notice</label>
                                    <button type="button" onclick="clearField('add_course_seats')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_seats" name="seats" placeholder="e.g. LIMITED SEATS – ONLY 30 PARTICIPANTS" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_location">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Studio / Factory Venue</label>
                                    <button type="button" onclick="clearField('add_course_location')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_location" name="location" placeholder="e.g. Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_add_course_price">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Course Fee (₹ INR)</label>
                                    <button type="button" onclick="clearField('add_course_price')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="number" step="0.01" id="add_course_price" name="price" placeholder="e.g. 15000" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-3" id="wrapper_add_course_level">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Target Skill Level & Audience</label>
                                    <button type="button" onclick="clearField('add_course_level')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_level" name="level" placeholder="e.g. Contractors • Interior Designers • Architects • Entrepreneurs • Beginners" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Visuals & Highlight Ribbons -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
                            <span>🖼️</span> Visuals, Highlights & Summary
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="wrapper_add_course_image_url">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Image URL</label>
                                    <button type="button" onclick="clearField('add_course_image_url')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Clear</button>
                                </div>
                                <input type="text" id="add_course_image_url" name="image_url" placeholder="e.g. /cat-flooring.jpg or /table top/hero.jpg" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Or Upload Image File</label>
                                <input type="file" name="image_file" accept="image/*" class="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_key_highlight">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Key Highlight Ribbon Title</label>
                                    <button type="button" onclick="clearField('add_course_key_highlight')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_key_highlight" name="key_highlight" placeholder="e.g. LIVE PRACTICAL TRAINING + EQUIPMENT EXPOSURE" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_key_highlight_desc">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Key Highlight Callout Description</label>
                                    <button type="button" onclick="clearField('add_course_key_highlight_desc')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="add_course_key_highlight_desc" name="key_highlight_desc" rows="2" placeholder="Describe practical bay exposure, machine handling, or master technique..." class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_short_desc">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Card Short Description (1-2 sentences)</label>
                                    <button type="button" onclick="clearField('add_course_short_desc')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="add_course_short_desc" name="short_desc" rows="2" placeholder="Short description displayed directly on the course catalogue card..." class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_overview">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Complete Course Overview</label>
                                    <button type="button" onclick="clearField('add_course_overview')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="add_course_overview" name="overview" rows="3" placeholder="Full comprehensive description shown inside the course details modal..." class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_add_course_batch_note">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Seat Booking / Batch Note</label>
                                    <button type="button" onclick="clearField('add_course_batch_note')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="add_course_batch_note" name="batch_note" placeholder="e.g. Block your seat for the upcoming batch · LIMITED SEATS ONLY" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 4: Interactive Lists with Individual Item Deletion (Add Modal) -->
                    <div style="background: #f9fafb; padding: 18px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 14px 0; display: flex; align-items: center; gap: 6px;">
                            <span>📋</span> Interactive Lists & Item Deletion
                        </h4>
                        
                        <!-- 4.1 Curriculum Topics List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">📚 Curriculum Topics</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ on any row to delete that individual topic</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('add_curriculum_container', 'add_curriculum_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('add_curriculum_container', 'curriculum[]', 'Topic name or practice bay...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Topic</button>
                                </div>
                            </div>
                            <div id="add_curriculum_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="add_curriculum_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No topics. Click "+ Add Topic" to add one.</div>
                        </div>

                        <!-- 4.2 Inclusions List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">🎁 Inclusions & Hospitality</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any inclusion item</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('add_inclusions_container', 'add_inclusions_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('add_inclusions_container', 'inclusions[]', 'e.g. Lunch, Pick-up, Certificate...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Inclusion</button>
                                </div>
                            </div>
                            <div id="add_inclusions_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="add_inclusions_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No inclusions. Click "+ Add Inclusion" to add one.</div>
                        </div>

                        <!-- 4.3 Who Can Join List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">🎯 Who Can Join / Target Profiles</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any target profile</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('add_who_can_join_container', 'add_who_can_join_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('add_who_can_join_container', 'who_can_join[]', 'e.g. Contractors, Architects, Beginners...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Profile</button>
                                </div>
                            </div>
                            <div id="add_who_can_join_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="add_who_can_join_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No audience points. Click "+ Add Profile" to add one.</div>
                        </div>

                        <!-- 4.4 Specific Techniques or Modules -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">💡 Techniques or Training Modules</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any individual module/technique card</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('add_techniques_container', 'add_techniques_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addTechniqueRow('add_techniques_container')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Module</button>
                                </div>
                            </div>
                            <div id="add_techniques_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="add_techniques_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No modules. Click "+ Add Module" to add one.</div>
                        </div>
                    </div>

                    <!-- Section 5: Dynamic Custom Fields (Add / Delete freely) -->
                    <div style="background: #f9fafb; padding: 18px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: gap: 8px;">
                            <div>
                                <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0; display: flex; align-items: center; gap: 6px;">
                                    <span>✨</span> Dynamic Custom Fields & Extra Details
                                </h4>
                                <p style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">Add and delete any custom field (Trainer Bio, Brochure Link, Prerequisites, Kit specs, etc.)</p>
                            </div>
                            <button
                                type="button"
                                onclick="addCustomFieldRow('add')"
                                style="padding: 6px 14px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"
                            >
                                <span style="font-size: 14px; font-weight: bold;">+</span> Add Custom Field
                            </button>
                        </div>

                        <div id="add_custom_fields_container" style="display: flex; flex-direction: column; gap: 10px;"></div>
                        <div id="add_custom_fields_empty" style="padding: 14px; border: 1px dashed #d1d5db; border-radius: 8px; text-align: center; font-size: 12px; color: #9ca3af; background: #ffffff;">
                            No custom fields added yet. Click <strong style="color: #2563eb;">"+ Add Custom Field"</strong> to attach any custom specification.
                        </div>
                    </div>

                    <!-- Section 6: Status & Sorting -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Course Status</label>
                                <select name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                    <option value="Active">Active (Visible on Storefront)</option>
                                    <option value="Draft">Draft (Hidden)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Display Sort Order</label>
                                <input type="number" name="sort_order" value="0" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sticky Pinned Action Footer -->
                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <div style="font-size: 12px; color: #6b7280;">
                        <span>✨ Live synchronization with storefront Workshop page</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button type="button" onclick="closeAddCourseModal()" style="padding: 9px 18px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="padding: 10px 24px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.35);">
                            Publish Course to Storefront
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    <!-- =========================================================================
         EDIT COURSE MODAL (WITH COMPLETE FIELD & SECTION DELETION CONTROLS)
         ========================================================================= -->
    <div
        id="editCourseModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 960px; height: 90vh; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <!-- Sticky Header -->
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 8px; margin: 0;">
                        <span>✏️</span> Edit Masterclass Training Course
                    </h3>
                    <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0 0;">Update, add, or delete any course field, topic, inclusion, module, or custom detail.</p>
                </div>
                <button type="button" onclick="closeEditCourseModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <!-- Form Wrapper with Internal Scroll -->
            <form id="editCourseForm" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf

                <!-- Scrollable Body Content -->
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 20px;">
                    
                    <!-- Section 1: Identification & Categorization -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
                            <span>📌</span> Course Overview & Identification
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Course Title *</label>
                                <input type="text" id="edit_course_name" name="name" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                            </div>

                            <div id="wrapper_edit_course_slug">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Course Slug / ID</label>
                                    <button type="button" onclick="clearField('edit_course_slug')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_slug" name="slug" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                            </div>

                            <div id="wrapper_edit_course_provider">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Training Provider</label>
                                    <button type="button" onclick="clearField('edit_course_provider')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_provider" name="provider" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
                                <select id="edit_course_category" name="category" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                    <option value="Metallic & Resin Flooring">Metallic & Resin Flooring</option>
                                    <option value="Resin Casting & Table Making">Resin Casting & Table Making</option>
                                    <option value="Artistry & Creative Casting">Artistry & Creative Casting</option>
                                    <option value="Industrial Floor Screeds">Industrial Floor Screeds</option>
                                    <option value="Countertop & Doming">Countertop & Doming</option>
                                </select>
                            </div>

                            <div id="wrapper_edit_course_badge">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Badge Tag</label>
                                    <button type="button" onclick="clearField('edit_course_badge')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_badge" name="badge" placeholder="e.g. 22nd – 25th Oct 2026 · Vadodara" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Logistics & Schedule Details -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
                            <span>🗓️</span> Duration, Logistics & Pricing
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Duration *</label>
                                <input type="text" id="edit_course_duration" name="duration" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_edit_course_date">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Batch Dates</label>
                                    <button type="button" onclick="clearField('edit_course_date')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_date" name="date" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_edit_course_seats">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Seats Quota Notice</label>
                                    <button type="button" onclick="clearField('edit_course_seats')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_seats" name="seats" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_location">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Studio / Factory Venue</label>
                                    <button type="button" onclick="clearField('edit_course_location')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_location" name="location" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div id="wrapper_edit_course_price">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Course Fee (₹ INR)</label>
                                    <button type="button" onclick="clearField('edit_course_price')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="number" step="0.01" id="edit_course_price" name="price" placeholder="Optional" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-3" id="wrapper_edit_course_level">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Target Skill Level & Audience</label>
                                    <button type="button" onclick="clearField('edit_course_level')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_level" name="level" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Visuals & Highlight Ribbons -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <div class="flex justify-between items-center mb-3">
                            <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0; display: flex; align-items: center; gap: 6px;">
                                <span>🖼️</span> Visuals, Highlights & Summary
                            </h4>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="wrapper_edit_course_image_url">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Image URL</label>
                                    <button type="button" onclick="clearField('edit_course_image_url')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Clear</button>
                                </div>
                                <input type="text" id="edit_course_image_url" name="image_url" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Replace Image File</label>
                                <input type="file" name="image_file" accept="image/*" class="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_key_highlight">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Key Highlight Ribbon Title</label>
                                    <button type="button" onclick="clearField('edit_course_key_highlight')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_key_highlight" name="key_highlight" placeholder="e.g. LIVE PRACTICAL TRAINING" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_key_highlight_desc">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Key Highlight Callout Description</label>
                                    <button type="button" onclick="clearField('edit_course_key_highlight_desc')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="edit_course_key_highlight_desc" name="key_highlight_desc" rows="2" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_short_desc">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Card Short Description (1-2 sentences)</label>
                                    <button type="button" onclick="clearField('edit_course_short_desc')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="edit_course_short_desc" name="short_desc" rows="2" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_overview">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Complete Course Overview</label>
                                    <button type="button" onclick="clearField('edit_course_overview')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <textarea id="edit_course_overview" name="overview" rows="3" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                            </div>

                            <div class="md:col-span-2" id="wrapper_edit_course_batch_note">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-semibold text-gray-700 uppercase">Seat Booking / Batch Note</label>
                                    <button type="button" onclick="clearField('edit_course_batch_note')" class="text-rose-500 hover:text-rose-700 text-[11px] font-normal cursor-pointer">✕ Delete Field</button>
                                </div>
                                <input type="text" id="edit_course_batch_note" name="batch_note" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Section 4: Interactive Lists with Individual Item Deletion (Curriculum, Inclusions, Who Can Join) -->
                    <div style="background: #f9fafb; padding: 18px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0 0 14px 0; display: flex; align-items: center; gap: 6px;">
                            <span>📋</span> Interactive Lists & Item Deletion
                        </h4>
                        
                        <!-- 4.1 Curriculum Topics List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">📚 Curriculum Topics</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any individual topic</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('edit_curriculum_container', 'edit_curriculum_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('edit_curriculum_container', 'curriculum[]', 'Topic name or practice bay...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Topic</button>
                                </div>
                            </div>
                            <div id="edit_curriculum_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="edit_curriculum_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No topics. Click "+ Add Topic" to add one.</div>
                        </div>

                        <!-- 4.2 Inclusions List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">🎁 Inclusions & Hospitality</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any inclusion item</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('edit_inclusions_container', 'edit_inclusions_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('edit_inclusions_container', 'inclusions[]', 'e.g. Lunch, Pick-up, Certificate...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Inclusion</button>
                                </div>
                            </div>
                            <div id="edit_inclusions_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="edit_inclusions_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No inclusions. Click "+ Add Inclusion" to add one.</div>
                        </div>

                        <!-- 4.3 Who Can Join List -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 14px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">🎯 Who Can Join / Target Profiles</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any target profile</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('edit_who_can_join_container', 'edit_who_can_join_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addListItemRow('edit_who_can_join_container', 'who_can_join[]', 'e.g. Contractors, Architects, Beginners...')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Profile</button>
                                </div>
                            </div>
                            <div id="edit_who_can_join_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="edit_who_can_join_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No audience points. Click "+ Add Profile" to add one.</div>
                        </div>

                        <!-- 4.4 Specific Techniques or Modules -->
                        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase;">💡 Techniques or Training Modules</label>
                                    <span style="font-size: 11px; color: #6b7280; display: block;">Click 🗑️ to delete any individual module/technique card</span>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button type="button" onclick="clearListContainer('edit_techniques_container', 'edit_techniques_empty')" style="padding: 4px 10px; font-size: 11px; color: #ef4444; background: #fee2e2; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Clear All</button>
                                    <button type="button" onclick="addTechniqueRow('edit_techniques_container')" style="padding: 4px 12px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Module</button>
                                </div>
                            </div>
                            <div id="edit_techniques_container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div id="edit_techniques_empty" style="display: none; padding: 10px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; border-radius: 6px;">No modules. Click "+ Add Module" to add one.</div>
                        </div>
                    </div>

                    <!-- Section 5: Dynamic Custom Fields (Add / Delete freely) -->
                    <div style="background: #f9fafb; padding: 18px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: gap: 8px;">
                            <div>
                                <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin: 0; display: flex; align-items: center; gap: 6px;">
                                    <span>✨</span> Dynamic Custom Fields & Extra Details
                                </h4>
                                <p style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">Add and delete any custom field with 1 click</p>
                            </div>
                            <button
                                type="button"
                                onclick="addCustomFieldRow('edit')"
                                style="padding: 6px 14px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"
                            >
                                <span style="font-size: 14px; font-weight: bold;">+</span> Add Custom Field
                            </button>
                        </div>

                        <div id="edit_custom_fields_container" style="display: flex; flex-direction: column; gap: 10px;"></div>
                        <div id="edit_custom_fields_empty" style="padding: 14px; border: 1px dashed #d1d5db; border-radius: 8px; text-align: center; font-size: 12px; color: #9ca3af; background: #ffffff;">
                            No custom fields added yet. Click <strong style="color: #2563eb;">"+ Add Custom Field"</strong> to attach any custom specification.
                        </div>
                    </div>

                    <!-- Section 6: Status & Sorting -->
                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6;">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Course Status</label>
                                <select id="edit_course_status" name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                                    <option value="Active">Active (Visible on Storefront)</option>
                                    <option value="Draft">Draft (Hidden)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Display Sort Order</label>
                                <input type="number" id="edit_course_sort_order" name="sort_order" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sticky Pinned Action Footer -->
                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <div style="font-size: 12px; color: #6b7280;">
                        <span>✨ Live synchronization with storefront Workshop page</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button type="button" onclick="closeEditCourseModal()" style="padding: 9px 18px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="padding: 10px 24px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.35);">
                            Save Changes & Sync Storefront
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    <!-- =========================================================================
         SCHEDULE BATCH MODAL
         ========================================================================= -->
    <div
        id="addBatchModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 580px; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0;">Schedule Workshop Batch</h3>
                <button type="button" onclick="closeAddBatchModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.workshops.batches.store') }}" method="POST" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Training Course</label>
                        <select name="workshop_id" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                            @foreach ($courses as $c)
                                <option value="{{ $c->id }}">{{ $c->name }} ({{ $c->duration }})</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">City Location</label>
                            <input type="text" name="city" required placeholder="e.g. Vadodara / Mumbai / Bangalore" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Seat Limit (Quota)</label>
                            <input type="number" name="total_seats" value="30" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Venue Address</label>
                        <input type="text" name="venue" required placeholder="e.g. Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Start Date</label>
                            <input type="date" name="start_date" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Batch Status</label>
                            <select name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                                <option value="Open">Open</option>
                                <option value="Filling Fast">Filling Fast</option>
                                <option value="Sold Out">Sold Out</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-shrink: 0;">
                    <button type="button" onclick="closeAddBatchModal()" style="padding: 8px 16px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 9px 20px; background: #059669; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        Publish Batch Schedule
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Tab & Modal Scripts -->
    <script>
        function showWorkshopTab(tabName) {
            document.getElementById('tab-workshop-courses').classList.toggle('hidden', tabName !== 'courses');
            document.getElementById('tab-workshop-batches').classList.toggle('hidden', tabName !== 'batches');
            document.getElementById('tab-workshop-admissions').classList.toggle('hidden', tabName !== 'admissions');

            const btnCourses = document.getElementById('tab-btn-courses');
            const btnBatches = document.getElementById('tab-btn-batches');
            const btnAdmissions = document.getElementById('tab-btn-admissions');

            const activeClass = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold transition';
            const inactiveClass = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition';

            btnCourses.className = tabName === 'courses' ? activeClass : inactiveClass;
            btnBatches.className = tabName === 'batches' ? activeClass : inactiveClass;
            btnAdmissions.className = tabName === 'admissions' ? activeClass : inactiveClass;
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function clearField(inputId) {
            const el = document.getElementById(inputId);
            if (el) {
                const prev = el.value;
                el.value = '';
                el.placeholder = '(Field deleted / omitted from storefront)';
                el.style.borderColor = '#ef4444';
                el.style.backgroundColor = '#fff5f5';
                
                setTimeout(() => {
                    if (el.value === '') {
                        el.style.borderColor = '#d1d5db';
                        el.style.backgroundColor = '#ffffff';
                    }
                }, 1200);
            }
        }

        function clearListContainer(containerId, emptyId) {
            const container = document.getElementById(containerId);
            const emptyState = document.getElementById(emptyId);
            if (container) {
                container.innerHTML = '';
            }
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }

        function addListItemRow(containerId, inputName, placeholderText = '', initialVal = '') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const emptyId = containerId.replace('_container', '_empty');
            const emptyState = document.getElementById(emptyId);
            if (emptyState) emptyState.style.display = 'none';

            const rowId = 'row_' + Math.random().toString(36).substr(2, 9);
            const row = document.createElement('div');
            row.id = rowId;
            row.style.cssText = 'display: grid; grid-template-columns: 1fr 34px; gap: 8px; align-items: center;';

            row.innerHTML = `
                <input type="text" name="${inputName}" value="${escapeHtml(initialVal)}" required placeholder="${placeholderText}" style="width: 100%; padding: 7px 10px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff;">
                <button type="button" onclick="removeRow('${rowId}', '${containerId}', '${emptyId}')" style="background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; width: 34px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px;" title="Delete item">
                    🗑️
                </button>
            `;

            container.appendChild(row);
        }

        function addTechniqueRow(containerId, num = '', name = '', desc = '') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const emptyId = containerId.replace('_container', '_empty');
            const emptyState = document.getElementById(emptyId);
            if (emptyState) emptyState.style.display = 'none';

            const rowId = 'tech_row_' + Math.random().toString(36).substr(2, 9);
            const row = document.createElement('div');
            row.id = rowId;
            row.style.cssText = 'display: grid; grid-template-columns: 60px 1.5fr 2.5fr 34px; gap: 8px; align-items: center; background: #f9fafb; padding: 8px 10px; border-radius: 6px; border: 1px solid #e5e7eb;';

            row.innerHTML = `
                <input type="text" name="technique_nums[]" value="${escapeHtml(num)}" placeholder="01" style="width: 100%; padding: 6px 8px; font-size: 11px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; text-align: center; font-weight: 600;">
                <input type="text" name="technique_names[]" value="${escapeHtml(name)}" required placeholder="Module Title" style="width: 100%; padding: 6px 8px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-weight: 600;">
                <input type="text" name="technique_descs[]" value="${escapeHtml(desc)}" placeholder="Description" style="width: 100%; padding: 6px 8px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff;">
                <button type="button" onclick="removeRow('${rowId}', '${containerId}', '${emptyId}')" style="background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; width: 34px; height: 30px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px;" title="Delete module">
                    🗑️
                </button>
            `;

            container.appendChild(row);
        }

        function removeRow(rowId, containerId, emptyId) {
            const row = document.getElementById(rowId);
            if (row) row.remove();

            const container = document.getElementById(containerId);
            const emptyState = document.getElementById(emptyId);
            if (container && container.children.length === 0 && emptyState) {
                emptyState.style.display = 'block';
            }
        }

        function addCustomFieldRow(modalType, fieldData = null) {
            const containerId = modalType === 'edit' ? 'edit_custom_fields_container' : 'add_custom_fields_container';
            const emptyId = modalType === 'edit' ? 'edit_custom_fields_empty' : 'add_custom_fields_empty';
            const container = document.getElementById(containerId);
            const emptyState = document.getElementById(emptyId);

            if (emptyState) emptyState.style.display = 'none';

            const rowId = 'cf_row_' + Math.random().toString(36).substr(2, 9);
            const keyVal = fieldData && fieldData.key ? fieldData.key : '';
            const valVal = fieldData && fieldData.value ? fieldData.value : '';
            const typeVal = fieldData && fieldData.type ? fieldData.type : 'text';

            const row = document.createElement('div');
            row.id = rowId;
            row.style.cssText = 'display: grid; grid-template-columns: 2fr 1.2fr 3fr 34px; gap: 8px; align-items: center; background: #ffffff; padding: 10px 12px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.03);';

            row.innerHTML = `
                <div>
                    <input type="text" name="custom_field_keys[]" value="${escapeHtml(keyVal)}" required placeholder="Field Name (e.g. Trainer Bio, Kit Link)" style="width: 100%; padding: 7px 10px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-weight: 600;">
                </div>
                <div>
                    <select name="custom_field_types[]" style="width: 100%; padding: 7px 8px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff;">
                        <option value="text" ${typeVal === 'text' ? 'selected' : ''}>Text / Info</option>
                        <option value="multiline" ${typeVal === 'multiline' ? 'selected' : ''}>Multiline Desc</option>
                        <option value="badge" ${typeVal === 'badge' ? 'selected' : ''}>Highlight Badge</option>
                        <option value="link" ${typeVal === 'link' ? 'selected' : ''}>Link / URL</option>
                    </select>
                </div>
                <div>
                    <input type="text" name="custom_field_values[]" value="${escapeHtml(valVal)}" required placeholder="Field Content / Value" style="width: 100%; padding: 7px 10px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff;">
                </div>
                <div style="text-align: center;">
                    <button type="button" onclick="removeRow('${rowId}', '${containerId}', '${emptyId}')" style="background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; width: 34px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px;" title="Delete this custom field">
                        🗑️
                    </button>
                </div>
            `;

            container.appendChild(row);
        }

        function initAddCourseDefaults() {
            // Populate starter topics if empty
            const currContainer = document.getElementById('add_curriculum_container');
            if (currContainer && currContainer.children.length === 0) {
                const defaultTopics = [
                    'Substrate preparation & diamond grinding',
                    'Metallic Flooring: 3D marble flows & pigments',
                    'Flake Flooring: Commercial broadcast matrix',
                    'Complete Tools & Equipment handling'
                ];
                defaultTopics.forEach(t => addListItemRow('add_curriculum_container', 'curriculum[]', 'Curriculum topic...', t));
            }

            // Populate starter inclusions if empty
            const incContainer = document.getElementById('add_inclusions_container');
            if (incContainer && incContainer.children.length === 0) {
                const defaultInclusions = [
                    'Hands-on Live Practical Bay Training',
                    'Training with Official Certification',
                    'Pickup & Drop from Vadodara Station',
                    'Lunch & Refreshments Provided'
                ];
                defaultInclusions.forEach(inc => addListItemRow('add_inclusions_container', 'inclusions[]', 'Inclusion item...', inc));
            }

            // Populate starter who can join if empty
            const whoContainer = document.getElementById('add_who_can_join_container');
            if (whoContainer && whoContainer.children.length === 0) {
                const defaultAudience = [
                    'Contractors & Applicators',
                    'Interior Designers & Architects',
                    'Entrepreneurs starting resin brand',
                    'Beginners wanting complete mastery'
                ];
                defaultAudience.forEach(a => addListItemRow('add_who_can_join_container', 'who_can_join[]', 'Target profile...', a));
            }
        }

        function openAddCourseModal() {
            initAddCourseDefaults();
            const m = document.getElementById('addCourseModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeAddCourseModal() {
            const m = document.getElementById('addCourseModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        function openEditCourseModal(course) {
            const form = document.getElementById('editCourseForm');
            form.action = "{{ url('admin/vize/workshops/courses') }}/" + course.id;

            document.getElementById('edit_course_name').value = course.name || '';
            document.getElementById('edit_course_slug').value = course.slug || '';
            document.getElementById('edit_course_provider').value = course.provider || 'ESSENTIAL ARTWORKS × VIZE';
            document.getElementById('edit_course_category').value = course.category || 'Metallic & Resin Flooring';
            document.getElementById('edit_course_badge').value = course.badge || '';
            document.getElementById('edit_course_duration').value = course.duration || '';
            document.getElementById('edit_course_date').value = course.date || '';
            document.getElementById('edit_course_seats').value = course.seats || '';
            document.getElementById('edit_course_location').value = course.location || '';
            document.getElementById('edit_course_price').value = course.price || '';
            document.getElementById('edit_course_level').value = course.level || '';
            document.getElementById('edit_course_image_url').value = course.image || '';
            document.getElementById('edit_course_key_highlight').value = course.key_highlight || '';
            document.getElementById('edit_course_key_highlight_desc').value = course.key_highlight_desc || '';
            document.getElementById('edit_course_short_desc').value = course.short_desc || '';
            document.getElementById('edit_course_overview').value = course.overview || '';
            document.getElementById('edit_course_batch_note').value = course.batch_note || '';
            document.getElementById('edit_course_status').value = course.status || 'Active';
            document.getElementById('edit_course_sort_order').value = course.sort_order || 0;

            // Populate Curriculum List Rows with individual delete buttons
            const currContainer = document.getElementById('edit_curriculum_container');
            currContainer.innerHTML = '';
            const currList = Array.isArray(course.curriculum_array) ? course.curriculum_array : [];
            if (currList.length > 0) {
                document.getElementById('edit_curriculum_empty').style.display = 'none';
                currList.forEach(item => addListItemRow('edit_curriculum_container', 'curriculum[]', 'Curriculum topic...', item));
            } else {
                document.getElementById('edit_curriculum_empty').style.display = 'block';
            }

            // Populate Inclusions List Rows with individual delete buttons
            const incContainer = document.getElementById('edit_inclusions_container');
            incContainer.innerHTML = '';
            const incList = Array.isArray(course.inclusions_array) ? course.inclusions_array : [];
            if (incList.length > 0) {
                document.getElementById('edit_inclusions_empty').style.display = 'none';
                incList.forEach(item => addListItemRow('edit_inclusions_container', 'inclusions[]', 'Inclusion / hospitality item...', item));
            } else {
                document.getElementById('edit_inclusions_empty').style.display = 'block';
            }

            // Populate Who Can Join List Rows with individual delete buttons
            const whoContainer = document.getElementById('edit_who_can_join_container');
            whoContainer.innerHTML = '';
            const whoList = Array.isArray(course.who_can_join_array) ? course.who_can_join_array : [];
            if (whoList.length > 0) {
                document.getElementById('edit_who_can_join_empty').style.display = 'none';
                whoList.forEach(item => addListItemRow('edit_who_can_join_container', 'who_can_join[]', 'Target profile / requirement...', item));
            } else {
                document.getElementById('edit_who_can_join_empty').style.display = 'block';
            }

            // Populate Techniques or Modules List Rows with individual delete buttons
            const techContainer = document.getElementById('edit_techniques_container');
            techContainer.innerHTML = '';
            const techList = Array.isArray(course.techniques_or_modules_array) ? course.techniques_or_modules_array : [];
            if (techList.length > 0) {
                document.getElementById('edit_techniques_empty').style.display = 'none';
                techList.forEach(item => {
                    const num = item.num || '';
                    const title = item.title || item.name || '';
                    const desc = item.desc || '';
                    addTechniqueRow('edit_techniques_container', num, title, desc);
                });
            } else {
                document.getElementById('edit_techniques_empty').style.display = 'block';
            }

            // Populate Dynamic Custom Fields Rows with individual delete buttons
            const customContainer = document.getElementById('edit_custom_fields_container');
            customContainer.innerHTML = '';
            const customFieldsList = Array.isArray(course.custom_fields_array) ? course.custom_fields_array : [];
            if (customFieldsList.length > 0) {
                document.getElementById('edit_custom_fields_empty').style.display = 'none';
                customFieldsList.forEach(cf => addCustomFieldRow('edit', cf));
            } else {
                document.getElementById('edit_custom_fields_empty').style.display = 'block';
            }

            const m = document.getElementById('editCourseModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeEditCourseModal() {
            const m = document.getElementById('editCourseModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        function openAddBatchModal() {
            const m = document.getElementById('addBatchModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeAddBatchModal() {
            const m = document.getElementById('addBatchModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAddCourseModal();
                closeEditCourseModal();
                closeAddBatchModal();
            }
        });
    </script>
</x-admin::layouts>
