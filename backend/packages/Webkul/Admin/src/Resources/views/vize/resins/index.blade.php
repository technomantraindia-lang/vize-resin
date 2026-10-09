<x-admin::layouts>
    <x-slot:title>
        Resin Products & Categories - VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                Resin Products
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your resin products, pricing, technical specifications, and photos.
            </p>
        </div>

        <div class="flex items-center gap-3">
            <button
                type="button"
                onclick="openAddCategoryModal()"
                class="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
                <span class="font-bold">+</span> Add Category
            </button>

            <button
                type="button"
                onclick="openAddResinModal()"
                class="primary-button flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
                <span class="text-lg font-bold">+</span> Add Resin Product
            </button>
        </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-gray-500">Total Resin Products</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($resins) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-emerald-600">Active In Stock</p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">{{ collect($resins)->where('in_stock', 1)->count() }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-blue-600">Total Categories</p>
            <p class="mt-2 text-2xl font-bold text-blue-600">{{ count($categories) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-purple-600">Out of Stock</p>
            <p class="mt-2 text-2xl font-bold text-purple-600">{{ collect($resins)->where('in_stock', 0)->count() }}</p>
        </div>
    </div>

    <!-- Section Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-6 text-sm font-semibold">
        <button type="button" onclick="showResinTab('products')" id="tab-btn-products" class="pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 cursor-pointer">
            🛍️ All Resin Products ({{ count($resins) }})
        </button>
        <button type="button" onclick="showResinTab('categories')" id="tab-btn-categories" class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 cursor-pointer">
            🗂️ Categories & Groups ({{ count($categories) }})
        </button>
    </div>

    <!-- TAB 1: Resin Products Table -->
    <div id="tab-content-products" class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    <tr>
                        <th class="px-5 py-3.5">Product & Photos</th>
                        <th class="px-5 py-3.5">Category</th>
                        <th class="px-5 py-3.5">Pack & Price</th>
                        <th class="px-5 py-3.5">Mix Ratio & Pot Life</th>
                        <th class="px-5 py-3.5">Cure Time & Coverage</th>
                        <th class="px-5 py-3.5">Stock Status</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($resins as $item)
                        @php
                            $images = json_decode($item->images ?? '[]', true);
                            $thumb = is_array($images) && count($images) > 0 ? $images[0] : '/rasin-product/Vize PrimeX.png';
                            $imgCount = is_array($images) ? count($images) : 1;
                            $svgPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f5f9' rx='8'/%3E%3Cpath d='M20 18h20v4H20zm-2 6h24l-3 22H21z' fill='%230284c7' opacity='0.75'/%3E%3Crect x='24' y='28' width='12' height='4' rx='2' fill='white'/%3E%3C/svg%3E";
                        @endphp
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="relative w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 shrink-0 p-1 flex items-center justify-center">
                                        <img src="{{ $thumb }}" alt="{{ $item->name }}" class="max-w-full max-h-full object-contain" onerror="this.onerror=null; this.src='{{ $svgPlaceholder }}';">
                                        @if($imgCount > 1)
                                            <span class="absolute bottom-0 right-0 bg-black/70 text-[9px] text-white font-bold px-1 rounded-tl">
                                                +{{ $imgCount - 1 }}
                                            </span>
                                        @endif
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-900 dark:text-white">
                                            {{ $item->name }}
                                            @if(!empty($item->suffix))
                                                <span class="text-xs text-amber-600 italic font-normal">({{ $item->suffix }})</span>
                                            @endif
                                        </p>
                                        <p class="text-xs text-gray-400 font-mono">{{ $item->sku }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    📁 {{ $item->category }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1 truncate max-w-xs">{{ $item->application_tag ?? $item->tagline }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <p class="font-bold text-blue-600 text-sm">₹{{ number_format($item->base_price, 2) }}</p>
                                <div class="flex items-center gap-1.5 mt-0.5">
                                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        {{ isset($item->tax_rate) ? round($item->tax_rate) : 18 }}% GST
                                    </span>
                                    <span class="text-xs text-gray-600 dark:text-gray-300 font-medium">{{ $item->pack_qty }}</span>
                                </div>
                                @if($item->pack_composition)
                                    <p class="text-[10px] text-gray-400 mt-0.5">{{ $item->pack_composition }}</p>
                                @endif
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                    Ratio: {{ $item->mix_ratio }}
                                </span>
                                <p class="text-xs text-gray-500 mt-1">Pot Life: {{ $item->pot_life ?? 'N/A' }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ $item->cure_time ?? 'N/A' }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ $item->coverage ?? ($item->sqft_coverage . ' sq.ft') }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.resins.stock', $item->id) }}" method="POST" class="inline-block">
                                    @csrf
                                    <input type="hidden" name="in_stock" value="{{ $item->in_stock ? 0 : 1 }}">
                                    <button type="submit" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer {{ $item->in_stock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' }}">
                                        <span class="w-1.5 h-1.5 rounded-full {{ $item->in_stock ? 'bg-emerald-500' : 'bg-red-500' }}"></span>
                                        {{ $item->in_stock ? 'In Stock' : 'Out of Stock' }}
                                    </button>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <a href="http://localhost:5173/product/{{ $item->slug }}" target="_blank" class="text-xs text-gray-500 hover:text-blue-600 transition font-medium" title="View on Storefront">
                                        👁️ View
                                    </a>
                                    <button
                                        type="button"
                                        onclick="openEditModal({{ $item->id }})"
                                        class="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded transition cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <form action="{{ route('admin.vize.resins.delete', $item->id) }}" method="POST" onsubmit="return confirm('Remove {{ $item->name }} from products?');" class="inline-block">
                                        @csrf
                                        <button type="submit" class="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition cursor-pointer">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-10 text-gray-400">
                                No resin products found. Click "+ Add Resin Product" above to create one.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- TAB 2: Categories Management Table -->
    <div id="tab-content-categories" class="hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/40">
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white">Active Product Categories</h3>
                <p class="text-xs text-gray-500">The categories for organizing and filtering resins on the storefront.</p>
            </div>
            <button
                type="button"
                onclick="openAddCategoryModal()"
                class="primary-button text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md cursor-pointer"
            >
                + Add Category
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3">Category Name</th>
                        <th class="px-5 py-3">URL Slug</th>
                        <th class="px-5 py-3">Description</th>
                        <th class="px-5 py-3">Assigned Products</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @foreach ($categories as $cat)
                        @php
                            $assignedCount = collect($resins)->where('category', $cat->name)->count();
                        @endphp
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-bold text-gray-900 dark:text-white">
                                📁 {{ $cat->name }}
                            </td>
                            <td class="px-5 py-4 font-mono text-xs text-gray-400">
                                {{ $cat->slug }}
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500 max-w-md">
                                {{ $cat->desc ?? 'VIZE Polymer Category' }}
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold {{ $assignedCount > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500' }}">
                                    {{ $assignedCount }} Products
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- Edit Product Modal (Scrollable Container with Overlay Lock) -->
    <div id="editResinModal" onclick="if(event.target === this) closeResinModal('editResinModal')" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6" style="overscroll-behavior: contain;">
        <div class="min-h-full flex items-center justify-center py-6">
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto" style="overscroll-behavior: contain;">
                
                <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white" id="editModalTitle">Edit Resin Product</h3>
                        <p class="text-xs text-gray-400">Update product information, technical specifications, and manage photos.</p>
                    </div>
                    <button type="button" onclick="closeResinModal('editResinModal')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer p-1">&times;</button>
                </div>

                <form id="editResinForm" method="POST" enctype="multipart/form-data" class="space-y-4">
                    @csrf
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Product Name</label>
                            <input type="text" name="name" id="edit_name" required class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Suffix (Optional)</label>
                            <input type="text" name="suffix" id="edit_suffix" placeholder="e.g. Pro, Prime" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Category</label>
                            <select name="category" id="edit_category" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                @foreach ($categories as $cat)
                                    <option value="{{ $cat->name }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Base Price (₹ INR)</label>
                            <input type="number" step="0.01" name="base_price" id="edit_base_price" required class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1 flex items-center justify-between">
                                <span>GST / Tax Rate</span>
                                <span class="text-[10px] text-blue-600 font-bold lowercase">at checkout</span>
                            </label>
                            <select name="tax_rate" id="edit_tax_rate" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                <option value="18">18% GST (Standard Resins)</option>
                                <option value="12">12% GST (Pigments & Topcoats)</option>
                                <option value="5">5% GST (Concessional / Basic)</option>
                                <option value="28">28% GST (Specialty Polymers)</option>
                                <option value="0">0% (Tax Exempt)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pack Size (e.g. 15 KG, 12 KG)</label>
                            <input type="text" name="pack_qty" id="edit_pack_qty" required class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pack Composition</label>
                            <input type="text" name="pack_composition" id="edit_pack_composition" placeholder="e.g. Resin – 10 KG, Hardener – 5 KG" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Mix Ratio</label>
                            <input type="text" name="mix_ratio" id="edit_mix_ratio" required placeholder="2 : 1" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pot Life</label>
                            <input type="text" name="pot_life" id="edit_pot_life" placeholder="35 mins @ 25°C" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Cure Time</label>
                            <input type="text" name="cure_time" id="edit_cure_time" placeholder="6–8 hrs tack-free" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Coverage Area</label>
                            <input type="text" name="coverage" id="edit_coverage" placeholder="~100 sq.ft / 15kg pack" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Tagline / Subtitle</label>
                            <input type="text" name="tagline" id="edit_tagline" placeholder="2:1 Pure Epoxy Concrete Primer" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <!-- Product Photos Manager -->
                    <div class="p-4 bg-slate-50 dark:bg-gray-800/80 rounded-xl border border-blue-200 dark:border-gray-700 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                                    <span>📸</span> Product Photos & Image Gallery
                                </h4>
                                <p class="text-[11px] text-gray-500">First image is the primary cover. Use Delete, Replace, or Make Cover on any image card.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span id="edit_gallery_count_badge" class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    0 Photos
                                </span>
                                <button type="button" onclick="clearAllEditImages()" class="text-[11px] text-red-600 hover:text-red-800 font-semibold px-2 py-0.5 bg-red-50 hover:bg-red-100 rounded transition cursor-pointer">
                                    🗑️ Clear All
                                </button>
                            </div>
                        </div>

                        <!-- Hidden input to transmit retained/reordered images -->
                        <input type="hidden" name="existing_images_json" id="edit_existing_images_json" value="[]">

                        <!-- Visual Thumbnail Cards Grid -->
                        <div id="edit_gallery_cards_container" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <!-- Dynamically populated via JS -->
                        </div>

                        <!-- Container for hidden slot replacement file inputs -->
                        <div id="edit_replace_inputs_container" class="hidden"></div>

                        <!-- Add More Photos Options -->
                        <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <!-- 1. File Upload (Multiple supported) -->
                            <div>
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    + Upload New Photos from Device
                                </label>
                                <input 
                                    type="file" 
                                    name="new_image_files[]" 
                                    id="edit_new_image_files" 
                                    multiple 
                                    accept="image/*" 
                                    onchange="previewNewUploads(this, 'edit_new_files_preview')"
                                    class="w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-900"
                                >
                                <div id="edit_new_files_preview" class="flex flex-wrap gap-2 mt-2"></div>
                            </div>

                            <!-- 2. Add via URL -->
                            <div>
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    + Or Add Photo by URL / File Path
                                </label>
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="edit_add_url_input" 
                                        placeholder="e.g. /rasin-product/Vize PrimeX.png" 
                                        class="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                                        onkeydown="if(event.key==='Enter'){event.preventDefault(); addPhotoUrlToEdit();}"
                                    >
                                    <button 
                                        type="button" 
                                        onclick="addPhotoUrlToEdit()" 
                                        class="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                                    >
                                        + Add Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">About This Product (Description)</label>
                        <textarea name="about_text" id="edit_about_text" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="in_stock" id="edit_in_stock" value="1" class="rounded border-gray-300 text-blue-600">
                        <label for="edit_in_stock" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Available In Stock</label>
                    </div>

                    <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onclick="closeResinModal('editResinModal')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Product Modal (Scrollable Container with Overlay Lock) -->
    <div id="addResinModal" onclick="if(event.target === this) closeResinModal('addResinModal')" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6" style="overscroll-behavior: contain;">
        <div class="min-h-full flex items-center justify-center py-6">
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto" style="overscroll-behavior: contain;">
                
                <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add New Resin Product</h3>
                        <p class="text-xs text-gray-400">Fill in product information, choose category, and add photos.</p>
                    </div>
                    <button type="button" onclick="closeResinModal('addResinModal')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer p-1">&times;</button>
                </div>

                <form id="addResinForm" action="{{ route('admin.vize.resins.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
                    @csrf
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Product Name</label>
                            <input type="text" name="name" required placeholder="e.g. Vize DeepCast" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Suffix (Optional)</label>
                            <input type="text" name="suffix" placeholder="e.g. Pro, Max, Prime" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Choose Category</label>
                            <select name="category" required class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium">
                                @foreach ($categories as $cat)
                                    <option value="{{ $cat->name }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Base Price (₹ INR)</label>
                            <input type="number" step="0.01" name="base_price" required placeholder="6264" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1 flex items-center justify-between">
                                <span>GST / Tax Rate</span>
                                <span class="text-[10px] text-blue-600 font-bold lowercase">at checkout</span>
                            </label>
                            <select name="tax_rate" id="add_tax_rate" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                <option value="18" selected>18% GST (Standard Resins)</option>
                                <option value="12">12% GST (Pigments & Topcoats)</option>
                                <option value="5">5% GST (Concessional / Basic)</option>
                                <option value="28">28% GST (Specialty Polymers)</option>
                                <option value="0">0% (Tax Exempt)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pack Size (e.g. 15 KG, 12 KG)</label>
                            <input type="text" name="pack_qty" required placeholder="15 KG" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pack Composition</label>
                            <input type="text" name="pack_composition" placeholder="e.g. Resin – 10 KG, Hardener – 5 KG" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Mix Ratio</label>
                            <input type="text" name="mix_ratio" value="2 : 1" required class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Pot Life</label>
                            <input type="text" name="pot_life" value="35 mins @ 25°C" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Cure Time</label>
                            <input type="text" name="cure_time" value="6–8 hrs tack-free" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Coverage Area</label>
                            <input type="text" name="coverage" value="~100 sq.ft / 15kg pack" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Tagline / Subtitle</label>
                            <input type="text" name="tagline" placeholder="2:1 Pure Epoxy Concrete Primer" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                        </div>
                    </div>

                    <!-- Product Photos Section -->
                    <div class="p-4 bg-slate-50 dark:bg-gray-800/80 rounded-xl border border-blue-200 dark:border-gray-700 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                                    <span>📸</span> Product Photos & Image Gallery
                                </h4>
                                <p class="text-[11px] text-gray-500">Upload primary cover photo and additional gallery photos.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1.5">
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">Primary Cover Photo</label>
                                <input type="file" name="primary_image_file" accept="image/*" class="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-white dark:bg-gray-900">
                                <input type="text" name="image_url" placeholder="Or URL e.g. /rasin-product/Vize PrimeX.png" class="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
                            </div>

                            <div class="space-y-1.5">
                                <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">Additional Gallery Photos</label>
                                <input 
                                    type="file" 
                                    name="gallery_files[]" 
                                    multiple 
                                    accept="image/*" 
                                    onchange="previewNewUploads(this, 'add_gallery_files_preview')"
                                    class="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-white dark:bg-gray-900"
                                >
                                <textarea name="gallery_urls" rows="2" placeholder="Or additional URLs (1 per line) e.g.&#10;/rasin-product/primex-bucket.png" class="w-full px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono"></textarea>
                            </div>
                        </div>
                        <div id="add_gallery_files_preview" class="flex flex-wrap gap-2"></div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">About This Product (Description)</label>
                        <textarea name="about_text" rows="3" placeholder="Describe the application steps, chemical benefits, and gloss finish..." class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="in_stock" id="add_in_stock" value="1" checked class="rounded border-gray-300 text-blue-600">
                        <label for="add_in_stock" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Available In Stock</label>
                    </div>

                    <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onclick="closeResinModal('addResinModal')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">Create Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Category Modal (Scrollable Container with Overlay Lock) -->
    <div id="addCategoryModal" onclick="if(event.target === this) closeResinModal('addCategoryModal')" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6" style="overscroll-behavior: contain;">
        <div class="min-h-full flex items-center justify-center py-6">
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto" style="overscroll-behavior: contain;">
                
                <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add New Category</h3>
                    <button type="button" onclick="closeResinModal('addCategoryModal')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer p-1">&times;</button>
                </div>

                <form action="{{ route('admin.vize.resins.categories.store') }}" method="POST" class="space-y-4">
                    @csrf
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Category Name</label>
                        <input type="text" name="name" required placeholder="e.g. Flooring Resins, Protective Coatings" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Short Description</label>
                        <textarea name="description" rows="2" placeholder="Describe the purpose of this category group..." class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                    </div>

                    <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onclick="closeResinModal('addCategoryModal')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        window.allResinsData = @json($resins->keyBy('id'));
        let currentEditImages = [];

        function showResinTab(tabName) {
            document.getElementById('tab-content-products').classList.toggle('hidden', tabName !== 'products');
            document.getElementById('tab-content-categories').classList.toggle('hidden', tabName !== 'categories');

            const btnProducts = document.getElementById('tab-btn-products');
            const btnCategories = document.getElementById('tab-btn-categories');

            if (tabName === 'products') {
                btnProducts.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold cursor-pointer';
                btnCategories.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold cursor-pointer';
            } else {
                btnProducts.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold cursor-pointer';
                btnCategories.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold cursor-pointer';
            }
        }

        function openAddResinModal() {
            document.body.style.overflow = 'hidden';
            document.getElementById('addResinModal').classList.remove('hidden');
        }

        function openAddCategoryModal() {
            document.body.style.overflow = 'hidden';
            document.getElementById('addCategoryModal').classList.remove('hidden');
        }

        function closeResinModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('hidden');
            
            // Check if any other modal is still open
            const anyOpen = document.querySelectorAll('#editResinModal:not(.hidden), #addResinModal:not(.hidden), #addCategoryModal:not(.hidden)');
            if (anyOpen.length === 0) {
                document.body.style.overflow = '';
            }
        }

        function renderEditGallery() {
            const container = document.getElementById('edit_gallery_cards_container');
            const badge = document.getElementById('edit_gallery_count_badge');
            const hiddenInput = document.getElementById('edit_existing_images_json');

            hiddenInput.value = JSON.stringify(currentEditImages);
            badge.innerText = currentEditImages.length + (currentEditImages.length === 1 ? ' Photo' : ' Photos');

            if (currentEditImages.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 text-xs">
                        No photos currently attached. Upload new photos or enter URLs below.
                    </div>
                `;
                return;
            }

            container.innerHTML = currentEditImages.map((imgUrl, index) => {
                const isPrimary = index === 0;
                const fileName = imgUrl.split('/').pop() || 'photo.png';
                return `
                    <div class="relative group border ${isPrimary ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'} rounded-lg p-2 flex flex-col items-center justify-between shadow-xs transition">
                        <!-- Top Header: Badge + Delete button -->
                        <div class="w-full flex items-center justify-between mb-1.5">
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isPrimary ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}">
                                ${isPrimary ? '⭐ Cover #1' : '#' + (index + 1)}
                            </span>
                            <button 
                                type="button" 
                                onclick="deleteEditImage(${index})" 
                                class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-1.5 py-0.5 rounded transition text-xs font-bold cursor-pointer"
                                title="Delete this photo"
                            >
                                🗑️ Delete
                            </button>
                        </div>

                        <!-- Image Preview Box -->
                        <div class="w-full h-20 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden mb-1.5 p-1">
                            <img id="card_img_preview_${index}" src="${imgUrl}" alt="Photo ${index + 1}" class="max-w-full max-h-full object-contain" onerror="this.src='/rasin-product/Vize PrimeX.png'">
                        </div>

                        <!-- Filename label -->
                        <p class="text-[10px] text-gray-400 truncate w-full text-center font-mono mb-2" title="${imgUrl}">
                            ${fileName}
                        </p>

                        <!-- Bottom Controls: Replace, Make Cover, Reorder -->
                        <div class="w-full flex flex-col gap-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                            <div class="flex items-center justify-between gap-1">
                                <button 
                                    type="button" 
                                    onclick="triggerReplaceSlot(${index})" 
                                    class="text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition cursor-pointer"
                                    title="Choose a new file to replace this photo"
                                >
                                    🔄 Replace
                                </button>

                                ${!isPrimary ? `
                                    <button 
                                        type="button" 
                                        onclick="setPrimaryEditImage(${index})" 
                                        class="text-[10px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded transition cursor-pointer"
                                    >
                                        ⭐ Cover
                                    </button>
                                ` : '<span class="text-[10px] text-amber-600 font-bold">Main Cover</span>'}

                                <div class="flex items-center gap-0.5">
                                    ${index > 0 ? `
                                        <button type="button" onclick="moveEditImage(${index}, -1)" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 rounded text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer" title="Move Left">◀</button>
                                    ` : ''}
                                    ${index < currentEditImages.length - 1 ? `
                                        <button type="button" onclick="moveEditImage(${index}, 1)" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 rounded text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer" title="Move Right">▶</button>
                                    ` : ''}
                                </div>
                            </div>
                            <div id="slot_replaced_note_${index}" class="text-[9px] text-emerald-600 font-semibold hidden text-center truncate"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function triggerReplaceSlot(index) {
            let input = document.getElementById('replace_slot_file_' + index);
            if (!input) {
                const container = document.getElementById('edit_replace_inputs_container');
                input = document.createElement('input');
                input.type = 'file';
                input.name = 'replace_files[' + index + ']';
                input.id = 'replace_slot_file_' + index;
                input.accept = 'image/*';
                input.onchange = function() {
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const imgElem = document.getElementById('card_img_preview_' + index);
                            if (imgElem) imgElem.src = e.target.result;
                            const noteElem = document.getElementById('slot_replaced_note_' + index);
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

        function deleteEditImage(index) {
            currentEditImages.splice(index, 1);
            const container = document.getElementById('edit_replace_inputs_container');
            if (container) container.innerHTML = '';
            renderEditGallery();
        }

        function clearAllEditImages() {
            if (confirm('Remove all photos from this product?')) {
                currentEditImages = [];
                const container = document.getElementById('edit_replace_inputs_container');
                if (container) container.innerHTML = '';
                renderEditGallery();
            }
        }

        function setPrimaryEditImage(index) {
            if (index > 0 && index < currentEditImages.length) {
                const item = currentEditImages.splice(index, 1)[0];
                currentEditImages.unshift(item);
                const container = document.getElementById('edit_replace_inputs_container');
                if (container) container.innerHTML = '';
                renderEditGallery();
            }
        }

        function moveEditImage(index, direction) {
            const target = index + direction;
            if (target >= 0 && target < currentEditImages.length) {
                const item = currentEditImages.splice(index, 1)[0];
                currentEditImages.splice(target, 0, item);
                const container = document.getElementById('edit_replace_inputs_container');
                if (container) container.innerHTML = '';
                renderEditGallery();
            }
        }

        function addPhotoUrlToEdit() {
            const input = document.getElementById('edit_add_url_input');
            const val = (input.value || '').trim();
            if (!val) return;
            if (!currentEditImages.includes(val)) {
                currentEditImages.push(val);
                renderEditGallery();
            }
            input.value = '';
        }

        function previewNewUploads(input, previewContainerId) {
            const container = document.getElementById(previewContainerId);
            container.innerHTML = '';
            if (!input.files || input.files.length === 0) return;

            Array.from(input.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const chip = document.createElement('div');
                    chip.className = 'relative border border-blue-300 rounded-lg p-1.5 bg-blue-50/60 dark:bg-blue-950/30 flex items-center gap-2 shadow-xs';
                    chip.innerHTML = `
                        <img src="${e.target.result}" class="w-8 h-8 object-contain bg-white rounded border border-gray-200">
                        <div class="text-[11px] leading-tight">
                            <p class="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[110px]">${file.name}</p>
                            <p class="text-[10px] text-blue-600 dark:text-blue-400">${(file.size / 1024).toFixed(0)} KB (Ready to upload)</p>
                        </div>
                    `;
                    container.appendChild(chip);
                };
                reader.readAsDataURL(file);
            });
        }

        function openEditModal(resinOrId) {
            let resin = resinOrId;
            if (typeof resinOrId === 'number' || typeof resinOrId === 'string') {
                resin = window.allResinsData[resinOrId];
            }
            if (!resin) return;

            document.body.style.overflow = 'hidden';

            document.getElementById('editModalTitle').innerText = 'Edit: ' + resin.name;
            document.getElementById('editResinForm').action = '/admin/vize/resins/' + resin.id;

            document.getElementById('edit_name').value = resin.name || '';
            document.getElementById('edit_suffix').value = resin.suffix || '';
            document.getElementById('edit_category').value = resin.category || 'Flooring Resins';
            document.getElementById('edit_base_price').value = resin.base_price || 0;
            
            const editTaxSelect = document.getElementById('edit_tax_rate');
            if (editTaxSelect) {
                const curTax = (resin.tax_rate !== undefined && resin.tax_rate !== null) ? parseFloat(resin.tax_rate) : 18;
                const matchOpt = Array.from(editTaxSelect.options).find(o => parseFloat(o.value) === curTax);
                if (!matchOpt) {
                    const opt = document.createElement('option');
                    opt.value = curTax;
                    opt.text = curTax + '% GST (Custom)';
                    editTaxSelect.appendChild(opt);
                }
                editTaxSelect.value = curTax.toString();
            }

            document.getElementById('edit_pack_qty').value = resin.pack_qty || '';
            document.getElementById('edit_pack_composition').value = resin.pack_composition || '';
            document.getElementById('edit_mix_ratio').value = resin.mix_ratio || '2 : 1';
            document.getElementById('edit_pot_life').value = resin.pot_life || '';
            document.getElementById('edit_cure_time').value = resin.cure_time || '';
            document.getElementById('edit_coverage').value = resin.coverage || '';
            document.getElementById('edit_tagline').value = resin.tagline || '';
            document.getElementById('edit_about_text').value = resin.about_text || '';
            document.getElementById('edit_in_stock').checked = Boolean(resin.in_stock);

            // Parse images array
            currentEditImages = [];
            try {
                if (Array.isArray(resin.images)) {
                    currentEditImages = [...resin.images];
                } else if (typeof resin.images === 'string') {
                    const parsed = JSON.parse(resin.images);
                    if (Array.isArray(parsed)) currentEditImages = parsed;
                }
            } catch (e) {
                currentEditImages = [];
            }

            // Filter out empty items
            currentEditImages = currentEditImages.filter(img => typeof img === 'string' && img.trim().length > 0);

            // Reset inputs & previews
            const replaceContainer = document.getElementById('edit_replace_inputs_container');
            if (replaceContainer) replaceContainer.innerHTML = '';
            const fileInput = document.getElementById('edit_new_image_files');
            if (fileInput) fileInput.value = '';
            const previewContainer = document.getElementById('edit_new_files_preview');
            if (previewContainer) previewContainer.innerHTML = '';
            const urlInput = document.getElementById('edit_add_url_input');
            if (urlInput) urlInput.value = '';

            renderEditGallery();

            document.getElementById('editResinModal').classList.remove('hidden');
        }

        // Close modal on Escape key
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeResinModal('editResinModal');
                closeResinModal('addResinModal');
                closeResinModal('addCategoryModal');
            }
        });

        // High-Speed Image Optimizer: Compresses photos in parallel to web-ready JPEG (max 1400px, 80% quality)
        async function compressImageFile(file, maxDimension = 1400, quality = 0.82) {
            if (!file || !file.type || !file.type.startsWith('image/')) {
                return file;
            }
            // If already compact (< 250 KB) or SVG, preserve original
            if (file.type === 'image/svg+xml' || file.size < 250 * 1024) {
                return file;
            }

            return new Promise((resolve) => {
                const timer = setTimeout(() => resolve(file), 3000); // 3s safety timeout
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        try {
                            clearTimeout(timer);
                            let width = img.naturalWidth || img.width;
                            let height = img.naturalHeight || img.height;

                            if (width <= 0 || height <= 0) {
                                return resolve(file);
                            }

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

                            // JPEG conversion provides 80-90% size reduction compared to lossless PNG
                            const targetMime = 'image/jpeg';
                            canvas.toBlob((blob) => {
                                if (blob && blob.size < file.size) {
                                    const baseName = file.name.replace(/\.[^/.]+$/, "");
                                    const optimizedFile = new File([blob], baseName + '.jpg', {
                                        type: targetMime,
                                        lastModified: Date.now()
                                    });
                                    resolve(optimizedFile);
                                } else {
                                    resolve(file);
                                }
                            }, targetMime, quality);
                        } catch (err) {
                            clearTimeout(timer);
                            resolve(file);
                        }
                    };
                    img.onerror = function() {
                        clearTimeout(timer);
                        resolve(file);
                    };
                    img.src = e.target.result;
                };
                reader.onerror = function() {
                    clearTimeout(timer);
                    resolve(file);
                };
                reader.readAsDataURL(file);
            });
        }

        async function processFormWithOptimizedImages(form) {
            if (form.dataset.submitting === 'true') return;
            form.dataset.submitting = 'true';

            const submitBtn = form.querySelector('button[type="submit"]');
            const updateStatus = (text) => {
                if (!submitBtn) return;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center gap-1.5">
                        <svg class="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>${text}</span>
                    </span>
                `;
            };

            updateStatus('Optimizing photos...');

            try {
                const fileInputs = form.querySelectorAll('input[type="file"]');
                for (const input of fileInputs) {
                    if (input.files && input.files.length > 0 && window.DataTransfer) {
                        const filesList = Array.from(input.files);
                        // Compress all photos in parallel
                        const compressedList = await Promise.all(
                            filesList.map(f => compressImageFile(f))
                        );
                        const dt = new DataTransfer();
                        compressedList.forEach(f => dt.items.add(f));
                        input.files = dt.files;
                    }
                }
            } catch (err) {
                console.warn('File optimization warning:', err);
            }

            updateStatus('Saving & Updating...');
            form.submit();
        }

        // Attach submit interceptors
        document.addEventListener('DOMContentLoaded', function() {
            const editForm = document.getElementById('editResinForm');
            if (editForm) {
                editForm.addEventListener('submit', function(e) {
                    if (this.dataset.submitting !== 'true') {
                        e.preventDefault();
                        processFormWithOptimizedImages(this);
                    }
                });
            }

            const addForm = document.getElementById('addResinForm');
            if (addForm) {
                addForm.addEventListener('submit', function(e) {
                    if (this.dataset.submitting !== 'true') {
                        e.preventDefault();
                        processFormWithOptimizedImages(this);
                    }
                });
            }
        });
    </script>
</x-admin::layouts>
