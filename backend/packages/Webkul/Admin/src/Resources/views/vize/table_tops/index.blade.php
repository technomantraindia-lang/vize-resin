<x-admin::layouts>
    <x-slot:title>
        Table Tops Studio & Custom Quotations - VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                Table Tops Studio
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Showcase handcrafted table designs, manage multiple photos per creation, and track custom quotation inquiries.
            </p>
        </div>

        <button
            type="button"
            onclick="openAddTableModal()"
            class="primary-button flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
            <span class="text-lg font-bold">+</span> Add New Table Design
        </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-gray-500">Live Table Designs</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($tables) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-emerald-600">Ready to Ship</p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">{{ collect($tables)->where('status', 'Ready to Ship')->count() }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-blue-600">Made to Order</p>
            <p class="mt-2 text-2xl font-bold text-blue-600">{{ collect($tables)->where('status', 'Made to Order')->count() }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-amber-600">Quotation Inquiries</p>
            <p class="mt-2 text-2xl font-bold text-amber-600">{{ count($inquiries) }}</p>
        </div>
    </div>

    <!-- Section Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-6 text-sm font-semibold">
        <button type="button" onclick="showTableTab('catalog')" id="tab-btn-catalog" class="pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 cursor-pointer">
            🪵 Table Designs Catalog ({{ count($tables) }})
        </button>
        <button type="button" onclick="showTableTab('leads')" id="tab-btn-leads" class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 cursor-pointer">
            💬 Custom Quotation Leads ({{ count($inquiries) }})
        </button>
    </div>

    <!-- Tab 1: Table Designs Grid -->
    <div id="tab-table-catalog" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        @forelse ($tables as $table)
            @php
                $tableImages = [];
                if (!empty($table->images)) {
                    $decoded = json_decode($table->images, true);
                    if (is_array($decoded)) $tableImages = $decoded;
                }
                if (empty($tableImages) && !empty($table->image_url)) {
                    $tableImages = [$table->image_url];
                }
                $coverImage = count($tableImages) > 0 ? $tableImages[0] : '/table top/1N2A7888.jpg';
                $photoCount = count($tableImages);
            @endphp
            <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between transition hover:shadow-md">
                <div>
                    <!-- Photo Display with Status Badge & Photo Counter -->
                    <div class="h-48 w-full rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3.5 relative group border border-gray-200 dark:border-gray-700" style="position: relative; height: 12rem; overflow: hidden;">
                        <img src="{{ $coverImage }}" alt="{{ $table->name }}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='/table top/1N2A7888.jpg'">
                        
                        <!-- Top-Left Category Badge -->
                        <span style="position: absolute; top: 10px; left: 10px; z-index: 10; background-color: rgba(17, 24, 39, 0.85); color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none;">
                            {{ $table->category ?? 'Dining & River Tables' }}
                        </span>

                        <!-- Top-Right Status Badge -->
                        <span style="position: absolute; top: 10px; right: 10px; z-index: 10; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none; {{ $table->status == 'Ready to Ship' ? 'background-color: #059669;' : ($table->status == 'Made to Order' ? 'background-color: #2563eb;' : 'background-color: #e11d48;') }}">
                            {{ $table->status }}
                        </span>

                        @if($photoCount > 1)
                            <!-- Bottom-Right Photo Count Badge -->
                            <span style="position: absolute; bottom: 10px; right: 10px; z-index: 10; background-color: rgba(0, 0, 0, 0.8); color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.4); pointer-events: none; backdrop-filter: blur(4px);">
                                📸 {{ $photoCount }} Photos
                            </span>
                        @endif
                    </div>

                    <!-- Title & Custom Note -->
                    <div class="flex items-start justify-between gap-2 mb-1">
                        <h3 class="font-bold text-gray-900 dark:text-white text-base leading-tight">{{ $table->name }}</h3>
                        <span class="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded whitespace-nowrap">Bespoke Quote</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{{ $table->description ?? 'Handcrafted live-edge timber slab paired with crystal clear optical polymer formulation.' }}</p>

                    <!-- Technical Specs Box -->
                    <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg mb-3 border border-gray-100 dark:border-gray-800">
                        <div>
                            <span class="text-gray-400 block uppercase font-medium text-[10px]">Timber Species</span>
                            <span class="font-semibold text-gray-800 dark:text-gray-200 truncate block">{{ $table->wood_type ?? 'Live-Edge Timber' }}</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block uppercase font-medium text-[10px]">Dimensions</span>
                            <span class="font-semibold text-gray-800 dark:text-gray-200 truncate block">{{ $table->dimensions ?? 'Custom Sizing' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions: Status, Edit, Delete -->
                <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 gap-2">
                    <form action="{{ route('admin.vize.table_tops.update_status', $table->id) }}" method="POST" class="inline">
                        @csrf
                        <select
                            name="status"
                            onchange="this.form.submit()"
                            class="text-xs font-semibold rounded-lg px-2.5 py-1 border border-gray-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:border-gray-300"
                        >
                            <option value="Ready to Ship" {{ $table->status == 'Ready to Ship' ? 'selected' : '' }}>Ready to Ship</option>
                            <option value="Made to Order" {{ $table->status == 'Made to Order' ? 'selected' : '' }}>Made to Order</option>
                            <option value="Sold Out" {{ $table->status == 'Sold Out' ? 'selected' : '' }}>Sold Out</option>
                        </select>
                    </form>

                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            onclick="openEditTableModal({{ $table->id }})"
                            class="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        >
                            ✏️ Edit & Photos
                        </button>

                        <form action="{{ route('admin.vize.table_tops.destroy', $table->id) }}" method="POST" onsubmit="return confirm('Delete this table design?');" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-xs text-red-500 hover:text-red-700 font-semibold p-1 transition cursor-pointer">
                                🗑️ Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                No table designs created yet. Click "+ Add New Table Design" to list your first live-edge river table.
            </div>
        @endforelse
    </div>

    <!-- Tab 2: Customer Quotation Inquiries Table -->
    <div id="tab-table-leads" class="hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-8">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Client & Contact</th>
                        <th class="px-5 py-3.5">Req. Dimensions</th>
                        <th class="px-5 py-3.5">Wood & Budget</th>
                        <th class="px-5 py-3.5">Message / Note</th>
                        <th class="px-5 py-3.5">Status</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($inquiries as $inquiry)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-900 dark:text-white">{{ $inquiry->customer_name }}</p>
                                <p class="text-xs text-gray-500">
                                    {{ $inquiry->email }} • 
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inquiry->phone) }}?text={{ urlencode('Hello ' . $inquiry->customer_name . ', regarding your table design quotation request with VIZE Specialty Polymers...') }}" target="_blank" class="text-emerald-600 font-mono font-semibold hover:underline inline-flex items-center gap-1">
                                        <span>💬</span> {{ $inquiry->phone }} (WhatsApp ↗)
                                    </a>
                                </p>
                            </td>
                            <td class="px-5 py-4 text-xs font-mono text-gray-800 dark:text-gray-200">{{ $inquiry->requested_dimensions ?? 'Custom Sizing' }}</td>
                            <td class="px-5 py-4 text-xs">
                                <span class="font-medium text-gray-800 dark:text-gray-200">{{ $inquiry->wood_preference ?? 'Live-Edge Timber' }}</span>
                                <span class="text-gray-400 block mt-0.5">{{ $inquiry->budget ?? 'Bespoke Quote' }}</span>
                            </td>
                            <td class="px-5 py-4 text-xs max-w-xs truncate text-gray-500">{{ $inquiry->message ?? 'Custom river table inquiry.' }}</td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.table_tops.inquiries.update_status', $inquiry->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $inquiry->status == 'New' ? 'bg-sky-50 text-sky-700 border-sky-200' : '' }}
                                            {{ $inquiry->status == 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}
                                            {{ $inquiry->status == 'Quoted' ? 'bg-purple-50 text-purple-700 border-purple-200' : '' }}
                                            {{ $inquiry->status == 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}"
                                    >
                                        <option value="New" {{ $inquiry->status == 'New' ? 'selected' : '' }}>New</option>
                                        <option value="Contacted" {{ $inquiry->status == 'Contacted' ? 'selected' : '' }}>Contacted</option>
                                        <option value="Quoted" {{ $inquiry->status == 'Quoted' ? 'selected' : '' }}>Quoted</option>
                                        <option value="Closed" {{ $inquiry->status == 'Closed' ? 'selected' : '' }}>Closed</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.table_tops.inquiries.destroy', $inquiry->id) }}" method="POST" onsubmit="return confirm('Delete this inquiry?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-medium p-1 transition cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-12 text-center text-gray-400">
                                No custom table design inquiries received yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add Table Modal -->
    <div id="addTableModal" onclick="if(event.target === this) closeTableModal('addTableModal')" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6" style="overscroll-behavior: contain;">
        <div class="min-h-full flex items-center justify-center py-6">
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto" style="overscroll-behavior: contain;">
                
                <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add Table Design Creation</h3>
                        <p class="text-xs text-gray-400">Add table specifications and upload multiple high-resolution photos.</p>
                    </div>
                    <button type="button" onclick="closeTableModal('addTableModal')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer p-1">&times;</button>
                </div>

                <form id="addTableForm" action="{{ route('admin.vize.table_tops.store') }}" method="POST" enctype="multipart/form-data" class="space-y-3.5">
                    @csrf
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Table Title</label>
                        <input type="text" name="name" required placeholder="e.g. Glacier Blue Live-Edge River Dining Table" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Category</label>
                            <select name="category" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                <option value="Dining & River Tables">Dining & River Tables</option>
                                <option value="Coffee & Round Tables">Coffee & Round Tables</option>
                                <option value="Side & C-Tables">Side & C-Tables</option>
                                <option value="Executive Desks">Executive Desks</option>
                                <option value="Macro Clarity & Edge Details">Macro Clarity & Edge Details</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Inventory Status</label>
                            <select name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                <option value="Ready to Ship">Ready to Ship</option>
                                <option value="Made to Order" selected>Made to Order</option>
                                <option value="Sold Out">Sold Out</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Timber Species</label>
                            <input type="text" name="wood_type" required placeholder="e.g. Old Teak Wood, Black Walnut" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Dimensions</label>
                            <input type="text" name="dimensions" required placeholder="e.g. 8ft × 3.5ft × 2in" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Resin Formulation</label>
                            <input type="text" name="resin" value="Vize SuperCast Deep Pour" placeholder="e.g. Vize SuperCast" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <!-- Photo Upload Section (Multiple Supported) -->
                    <div class="p-3.5 bg-slate-50 dark:bg-gray-800/80 rounded-xl border border-blue-200 dark:border-gray-700 space-y-3">
                        <div class="flex items-center justify-between">
                            <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                                📸 Table Photos & Image Gallery (Multiple Allowed)
                            </label>
                            <span class="text-[10px] text-gray-500">⚡ Auto-compressed for web</span>
                        </div>

                        <div>
                            <label class="block text-[10px] font-semibold text-gray-500 uppercase mb-1">+ Select Photos from Device (Multiple)</label>
                            <input 
                                type="file" 
                                name="new_image_files[]" 
                                multiple 
                                accept="image/*" 
                                onchange="previewAddTablePhotos(this)"
                                class="w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-900"
                            >
                            <div id="add_table_photos_preview" class="flex flex-wrap gap-2 mt-2"></div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-semibold text-gray-500 uppercase mb-1">+ Or Enter Photo URLs (1 per line)</label>
                            <textarea name="image_url" rows="2" placeholder="/table top/1N2A7888.jpg&#10;/table top/1N2A7896.jpg" class="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono"></textarea>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Description & Craftsmanship Details</label>
                        <textarea name="description" rows="2.5" placeholder="Describe wood grain contours, river channel color swirl, bevel edge, and optical gloss finish..." class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                    </div>

                    <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onclick="closeTableModal('addTableModal')" class="px-4 py-2 text-sm text-gray-600 cursor-pointer">Cancel</button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">Save Table Design</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Table Modal (With Visual Multi-Photo Manager) -->
    <div id="editTableModal" onclick="if(event.target === this) closeTableModal('editTableModal')" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6" style="overscroll-behavior: contain;">
        <div class="min-h-full flex items-center justify-center py-6">
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto" style="overscroll-behavior: contain;">
                
                <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white" id="editTableModalTitle">Edit Table Design</h3>
                        <p class="text-xs text-gray-400">Manage table specifications and add, replace, or reorder photos.</p>
                    </div>
                    <button type="button" onclick="closeTableModal('editTableModal')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer p-1">&times;</button>
                </div>

                <form id="editTableForm" method="POST" enctype="multipart/form-data" class="space-y-4">
                    @csrf
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Table Title</label>
                        <input type="text" name="name" id="edit_table_name" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Category</label>
                            <select name="category" id="edit_table_category" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                <option value="Dining & River Tables">Dining & River Tables</option>
                                <option value="Coffee & Round Tables">Coffee & Round Tables</option>
                                <option value="Side & C-Tables">Side & C-Tables</option>
                                <option value="Executive Desks">Executive Desks</option>
                                <option value="Macro Clarity & Edge Details">Macro Clarity & Edge Details</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Inventory Status</label>
                            <select name="status" id="edit_table_status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                <option value="Ready to Ship">Ready to Ship</option>
                                <option value="Made to Order">Made to Order</option>
                                <option value="Sold Out">Sold Out</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Timber Species</label>
                            <input type="text" name="wood_type" id="edit_table_wood" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Dimensions</label>
                            <input type="text" name="dimensions" id="edit_table_dimensions" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Resin Formulation</label>
                            <input type="text" name="resin" id="edit_table_resin" placeholder="e.g. Vize SuperCast" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <!-- Multiple Photo Gallery Manager -->
                    <div class="p-4 bg-slate-50 dark:bg-gray-800/80 rounded-xl border border-blue-200 dark:border-gray-700 space-y-3">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                                    <span>📸</span> Table Photos & Gallery
                                </h4>
                                <p class="text-[11px] text-gray-500">First image is the primary cover. Use Replace, Delete, or Make Cover on any card.</p>
                            </div>
                            <span id="edit_table_gallery_badge" class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                0 Photos
                            </span>
                        </div>

                        <!-- Hidden JSON input for retained/reordered images -->
                        <input type="hidden" name="existing_images_json" id="edit_table_images_json" value="[]">

                        <!-- Photo Cards Grid -->
                        <div id="edit_table_gallery_cards" class="grid grid-cols-2 sm:grid-cols-3 gap-3"></div>

                        <!-- Container for dynamic slot replacement file inputs -->
                        <div id="edit_table_replace_inputs" class="hidden"></div>

                        <!-- Add More Photos Section -->
                        <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <div>
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    + Upload Additional Photos from Device
                                </label>
                                <input 
                                    type="file" 
                                    name="new_image_files[]" 
                                    id="edit_table_new_files" 
                                    multiple 
                                    accept="image/*" 
                                    onchange="previewEditTableUploads(this)"
                                    class="w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-900"
                                >
                                <div id="edit_table_new_files_preview" class="flex flex-wrap gap-2 mt-2"></div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    + Or Add Photo by URL / File Path
                                </label>
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="edit_table_add_url_input" 
                                        placeholder="e.g. /table top/1N2A7888.jpg" 
                                        class="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                                        onkeydown="if(event.key==='Enter'){event.preventDefault(); addPhotoUrlToTableEdit();}"
                                    >
                                    <button 
                                        type="button" 
                                        onclick="addPhotoUrlToTableEdit()" 
                                        class="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                                    >
                                        + Add Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Description & Craftsmanship Details</label>
                        <textarea name="description" id="edit_table_description" rows="2.5" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                    </div>

                    <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onclick="closeTableModal('editTableModal')" class="px-4 py-2 text-sm text-gray-600 cursor-pointer">Cancel</button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        window.allTablesData = @json(collect($tables)->keyBy('id'));
        let currentTableEditImages = [];

        function showTableTab(tabName) {
            document.getElementById('tab-table-catalog').classList.toggle('hidden', tabName !== 'catalog');
            document.getElementById('tab-table-leads').classList.toggle('hidden', tabName !== 'leads');

            const btnCatalog = document.getElementById('tab-btn-catalog');
            const btnLeads = document.getElementById('tab-btn-leads');

            if (tabName === 'catalog') {
                btnCatalog.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold cursor-pointer';
                btnLeads.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold cursor-pointer';
            } else {
                btnCatalog.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold cursor-pointer';
                btnLeads.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold cursor-pointer';
            }
        }

        function openAddTableModal() {
            document.body.style.overflow = 'hidden';
            document.getElementById('addTableModal').classList.remove('hidden');
        }

        function openEditTableModal(tableId) {
            const table = window.allTablesData[tableId];
            if (!table) return;

            document.body.style.overflow = 'hidden';

            document.getElementById('editTableModalTitle').innerText = 'Edit: ' + table.name;
            document.getElementById('editTableForm').action = '/admin/vize/table-tops/' + table.id;

            document.getElementById('edit_table_name').value = table.name || '';
            document.getElementById('edit_table_category').value = table.category || 'Dining & River Tables';
            document.getElementById('edit_table_status').value = table.status || 'Ready to Ship';
            document.getElementById('edit_table_wood').value = table.wood_type || '';
            document.getElementById('edit_table_dimensions').value = table.dimensions || '';
            document.getElementById('edit_table_resin').value = table.resin || 'Vize SuperCast Deep Pour';
            document.getElementById('edit_table_description').value = table.description || '';

            // Parse images array
            currentTableEditImages = [];
            try {
                if (Array.isArray(table.images)) {
                    currentTableEditImages = [...table.images];
                } else if (typeof table.images === 'string') {
                    const parsed = JSON.parse(table.images);
                    if (Array.isArray(parsed)) currentTableEditImages = parsed;
                } else if (table.image_url) {
                    currentTableEditImages = [table.image_url];
                }
            } catch (e) {
                currentTableEditImages = table.image_url ? [table.image_url] : [];
            }

            currentTableEditImages = currentTableEditImages.filter(img => typeof img === 'string' && img.trim().length > 0);

            // Reset inputs & previews
            const replaceContainer = document.getElementById('edit_table_replace_inputs');
            if (replaceContainer) replaceContainer.innerHTML = '';
            const fileInput = document.getElementById('edit_table_new_files');
            if (fileInput) fileInput.value = '';
            const previewContainer = document.getElementById('edit_table_new_files_preview');
            if (previewContainer) previewContainer.innerHTML = '';
            const urlInput = document.getElementById('edit_table_add_url_input');
            if (urlInput) urlInput.value = '';

            renderEditTableGallery();

            document.getElementById('editTableModal').classList.remove('hidden');
        }

        function closeTableModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('hidden');

            const anyOpen = document.querySelectorAll('#addTableModal:not(.hidden), #editTableModal:not(.hidden)');
            if (anyOpen.length === 0) {
                document.body.style.overflow = '';
            }
        }

        function renderEditTableGallery() {
            const container = document.getElementById('edit_table_gallery_cards');
            const badge = document.getElementById('edit_table_gallery_badge');
            const hiddenInput = document.getElementById('edit_table_images_json');

            hiddenInput.value = JSON.stringify(currentTableEditImages);
            badge.innerText = currentTableEditImages.length + (currentTableEditImages.length === 1 ? ' Photo' : ' Photos');

            if (currentTableEditImages.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 text-xs">
                        No photos currently attached. Upload new photos or enter URLs below.
                    </div>
                `;
                return;
            }

            container.innerHTML = currentTableEditImages.map((imgUrl, index) => {
                const isPrimary = index === 0;
                const fileName = imgUrl.split('/').pop() || 'photo.jpg';
                return `
                    <div class="relative group border ${isPrimary ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'} rounded-lg p-2 flex flex-col items-center justify-between shadow-xs transition">
                        <!-- Top Header: Badge + Delete button -->
                        <div class="w-full flex items-center justify-between mb-1.5">
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isPrimary ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}">
                                ${isPrimary ? '⭐ Cover #1' : '#' + (index + 1)}
                            </span>
                            <button 
                                type="button" 
                                onclick="deleteTableEditImage(${index})" 
                                class="text-red-500 hover:text-red-700 hover:bg-red-50 px-1.5 py-0.5 rounded transition text-xs font-bold cursor-pointer"
                                title="Delete this photo"
                            >
                                🗑️ Delete
                            </button>
                        </div>

                        <!-- Image Preview Box -->
                        <div class="w-full h-20 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden mb-1.5 p-1">
                            <img id="table_card_preview_${index}" src="${imgUrl}" alt="Photo ${index + 1}" class="max-w-full max-h-full object-cover" onerror="this.src='/table top/1N2A7888.jpg'">
                        </div>

                        <!-- Filename label -->
                        <p class="text-[10px] text-gray-400 truncate w-full text-center font-mono mb-2" title="${imgUrl}">
                            ${fileName}
                        </p>

                        <!-- Bottom Controls -->
                        <div class="w-full flex flex-col gap-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                            <div class="flex items-center justify-between gap-1">
                                <button 
                                    type="button" 
                                    onclick="triggerReplaceTableSlot(${index})" 
                                    class="text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition cursor-pointer"
                                >
                                    🔄 Replace
                                </button>

                                ${!isPrimary ? `
                                    <button 
                                        type="button" 
                                        onclick="setPrimaryTableImage(${index})" 
                                        class="text-[10px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded transition cursor-pointer"
                                    >
                                        ⭐ Cover
                                    </button>
                                ` : '<span class="text-[10px] text-amber-600 font-bold">Main Cover</span>'}

                                <div class="flex items-center gap-0.5">
                                    ${index > 0 ? `
                                        <button type="button" onclick="moveTableImage(${index}, -1)" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer" title="Move Left">◀</button>
                                    ` : ''}
                                    ${index < currentTableEditImages.length - 1 ? `
                                        <button type="button" onclick="moveTableImage(${index}, 1)" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer" title="Move Right">▶</button>
                                    ` : ''}
                                </div>
                            </div>
                            <div id="table_slot_replaced_note_${index}" class="text-[9px] text-emerald-600 font-semibold hidden text-center truncate"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function triggerReplaceTableSlot(index) {
            let input = document.getElementById('replace_table_slot_' + index);
            if (!input) {
                const container = document.getElementById('edit_table_replace_inputs');
                input = document.createElement('input');
                input.type = 'file';
                input.name = 'replace_files[' + index + ']';
                input.id = 'replace_table_slot_' + index;
                input.accept = 'image/*';
                input.onchange = function() {
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const imgElem = document.getElementById('table_card_preview_' + index);
                            if (imgElem) imgElem.src = e.target.result;
                            const noteElem = document.getElementById('table_slot_replaced_note_' + index);
                            if (noteElem) {
                                noteElem.innerText = '✓ Replaced with ' + file.name;
                                noteElem.classList.remove('hidden');
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                container.appendChild(input);
            }
            input.click();
        }

        function deleteTableEditImage(index) {
            currentTableEditImages.splice(index, 1);
            const container = document.getElementById('edit_table_replace_inputs');
            if (container) container.innerHTML = '';
            renderEditTableGallery();
        }

        function setPrimaryTableImage(index) {
            if (index > 0 && index < currentTableEditImages.length) {
                const item = currentTableEditImages.splice(index, 1)[0];
                currentTableEditImages.unshift(item);
                const container = document.getElementById('edit_table_replace_inputs');
                if (container) container.innerHTML = '';
                renderEditTableGallery();
            }
        }

        function moveTableImage(index, direction) {
            const target = index + direction;
            if (target >= 0 && target < currentTableEditImages.length) {
                const item = currentTableEditImages.splice(index, 1)[0];
                currentTableEditImages.splice(target, 0, item);
                const container = document.getElementById('edit_table_replace_inputs');
                if (container) container.innerHTML = '';
                renderEditTableGallery();
            }
        }

        function addPhotoUrlToTableEdit() {
            const input = document.getElementById('edit_table_add_url_input');
            const val = (input.value || '').trim();
            if (!val) return;
            if (!currentTableEditImages.includes(val)) {
                currentTableEditImages.push(val);
                renderEditTableGallery();
            }
            input.value = '';
        }

        function previewAddTablePhotos(input) {
            const container = document.getElementById('add_table_photos_preview');
            container.innerHTML = '';
            if (!input.files || input.files.length === 0) return;

            Array.from(input.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const chip = document.createElement('div');
                    chip.className = 'border border-blue-300 rounded-lg p-1.5 bg-blue-50/60 flex items-center gap-2 shadow-xs';
                    chip.innerHTML = `
                        <img src="${e.target.result}" class="w-8 h-8 object-cover bg-white rounded border border-gray-200">
                        <div class="text-[11px] leading-tight">
                            <p class="font-bold text-gray-800 truncate max-w-[120px]">${file.name}</p>
                            <p class="text-[10px] text-blue-600">${(file.size / 1024).toFixed(0)} KB (Ready to upload)</p>
                        </div>
                    `;
                    container.appendChild(chip);
                };
                reader.readAsDataURL(file);
            });
        }

        function previewEditTableUploads(input) {
            const container = document.getElementById('edit_table_new_files_preview');
            container.innerHTML = '';
            if (!input.files || input.files.length === 0) return;

            Array.from(input.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const chip = document.createElement('div');
                    chip.className = 'border border-blue-300 rounded-lg p-1.5 bg-blue-50/60 flex items-center gap-2 shadow-xs';
                    chip.innerHTML = `
                        <img src="${e.target.result}" class="w-8 h-8 object-cover bg-white rounded border border-gray-200">
                        <div class="text-[11px] leading-tight">
                            <p class="font-bold text-gray-800 truncate max-w-[120px]">${file.name}</p>
                            <p class="text-[10px] text-blue-600">${(file.size / 1024).toFixed(0)} KB (Ready to upload)</p>
                        </div>
                    `;
                    container.appendChild(chip);
                };
                reader.readAsDataURL(file);
            });
        }

        // Auto Image Compression: Scales high-res camera photos down to web standards (max 1920px) to prevent PostTooLargeException
        async function compressImageFile(file, maxDimension = 1920, quality = 0.85) {
            if (!file || !file.type || !file.type.startsWith('image/')) return file;
            if (file.type === 'image/svg+xml' || file.size < 350 * 1024) return file;

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        try {
                            let width = img.naturalWidth || img.width;
                            let height = img.naturalHeight || img.height;

                            if (width <= 0 || height <= 0) return resolve(file);

                            if (width > maxDimension || height > maxDimension) {
                                if (width > height) {
                                    height = Math.round((height * maxDimension) / width);
                                    width = maxDimension;
                                } else {
                                    width = Math.round((width * maxDimension) / height);
                                    height = maxDimension;
                                }
                            }

                            const canvas = document.createElement('canvas');
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = 'high';
                            ctx.drawImage(img, 0, 0, width, height);

                            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                            canvas.toBlob((blob) => {
                                if (blob && blob.size < file.size) {
                                    const baseName = file.name.replace(/\.[^/.]+$/, "");
                                    const ext = mimeType === 'image/jpeg' ? '.jpg' : '.png';
                                    const optimizedFile = new File([blob], baseName + ext, {
                                        type: mimeType,
                                        lastModified: Date.now()
                                    });
                                    resolve(optimizedFile);
                                } else {
                                    resolve(file);
                                }
                            }, mimeType, quality);
                        } catch (err) {
                            resolve(file);
                        }
                    };
                    img.onerror = () => resolve(file);
                    img.src = e.target.result;
                };
                reader.onerror = () => resolve(file);
                reader.readAsDataURL(file);
            });
        }

        async function processFormWithOptimizedImages(form) {
            if (form.dataset.submitting === 'true') return;
            form.dataset.submitting = 'true';

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center gap-1.5">
                        <svg class="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Optimizing & Saving...</span>
                    </span>
                `;
            }

            try {
                const fileInputs = form.querySelectorAll('input[type="file"]');
                for (const input of fileInputs) {
                    if (input.files && input.files.length > 0 && window.DataTransfer) {
                        const dt = new DataTransfer();
                        for (let i = 0; i < input.files.length; i++) {
                            const compressed = await compressImageFile(input.files[i]);
                            dt.items.add(compressed);
                        }
                        input.files = dt.files;
                    }
                }
            } catch (err) {
                console.warn('Optimization warning:', err);
            }

            form.submit();
        }

        document.addEventListener('DOMContentLoaded', function() {
            const addForm = document.getElementById('addTableForm');
            if (addForm) {
                addForm.addEventListener('submit', function(e) {
                    if (this.dataset.submitting !== 'true') {
                        e.preventDefault();
                        processFormWithOptimizedImages(this);
                    }
                });
            }

            const editForm = document.getElementById('editTableForm');
            if (editForm) {
                editForm.addEventListener('submit', function(e) {
                    if (this.dataset.submitting !== 'true') {
                        e.preventDefault();
                        processFormWithOptimizedImages(this);
                    }
                });
            }
        });

        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeTableModal('addTableModal');
                closeTableModal('editTableModal');
            }
        });
    </script>
</x-admin::layouts>
