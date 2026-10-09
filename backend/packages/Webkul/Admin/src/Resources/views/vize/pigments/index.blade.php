<x-admin::layouts>
    <x-slot:title>
        Colors, Pigments & Finishes Studio — VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white" style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">
                Colors &amp; Pigments Studio
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1" style="font-size: 0.875rem; color: #4b5563; margin-top: 0.25rem;">
                Manage categories, category fixed pack pricing, and color shade formulations with realistic circular image swatches.
            </p>
        </div>

        <div class="flex items-center gap-3 flex-wrap" style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- Button 1: Add Category -->
            <button
                type="button"
                onclick="openAddCategoryModal()"
                class="cursor-pointer font-semibold rounded-lg text-sm shadow-sm transition"
                style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: #ffffff; color: #1f2937; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
            >
                <span style="font-size: 1.1rem; font-weight: bold; color: #d97706;">+</span> Add Category &amp; Prices
            </button>

            <!-- Button 2: Add Shade Formulation (Prominent) -->
            <button
                type="button"
                onclick="openAddShadeModal()"
                class="primary-button cursor-pointer font-semibold rounded-lg text-sm shadow-sm transition"
                style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 0.6rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.12);"
            >
                <span style="font-size: 1.1rem; font-weight: bold;">+</span> Add Shade Formulation
            </button>
        </div>
    </div>

    <!-- Quick Stats Cards (Forced 4-column Grid) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #6b7280; margin: 0;">Categories</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #111827; margin: 0.5rem 0 0 0;">{{ count($categories) }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #059669; margin: 0;">Total Color Shades</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #059669; margin: 0.5rem 0 0 0;">{{ count($shades) }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #d97706; margin: 0;">With Texture Images</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #d97706; margin: 0.5rem 0 0 0;">{{ collect($shades)->whereNotNull('image_url')->count() }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; margin: 0;">Pricing Model</p>
            <p style="font-size: 1.1rem; font-weight: 800; color: #2563eb; margin: 0.5rem 0 0 0;">Fixed Per Category</p>
        </div>
    </div>

    <!-- Category Filter Tabs -->
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; overflow-x: auto; padding-bottom: 0.5rem;">
        <a
            href="{{ route('admin.vize.pigments.index', ['category' => 'all']) }}"
            style="padding: 0.4rem 0.9rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; white-space: nowrap; text-decoration: none; {{ $selectedCategory == 'all' ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #ffffff; border: 1px solid #e2e8f0; color: #475569;' }}"
        >
            All Categories ({{ count($shades) }})
        </a>

        @foreach($categories as $cat)
            @php
                $catCount = collect($shades)->where('category_slug', $cat->slug)->count();
            @endphp
            <a
                href="{{ route('admin.vize.pigments.index', ['category' => $cat->slug]) }}"
                style="padding: 0.4rem 0.9rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; white-space: nowrap; text-decoration: none; {{ $selectedCategory == $cat->slug ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #ffffff; border: 1px solid #e2e8f0; color: #475569;' }}"
            >
                {{ $cat->name }} ({{ $catCount }})
            </a>
        @endforeach
    </div>

    <!-- Section 1: Color Shades Catalog Table -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-8" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; margin-bottom: 2rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="padding: 1rem 1.25rem; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0;">
                    Color Shades &amp; Circular Swatches
                </h2>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">
                    Images shown here match the exact circular swatches on the customer storefront
                </p>
            </div>

            <!-- Direct "+ Add New Shade" button in the table header -->
            <button
                type="button"
                onclick="openAddShadeModal()"
                class="primary-button cursor-pointer font-bold text-xs rounded-lg shadow-sm transition"
                style="display: inline-flex; align-items: center; gap: 0.4rem; background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; cursor: pointer;"
            >
                <span style="font-size: 1rem; font-weight: bold;">+</span> Add New Shade
            </button>
        </div>

        <div class="overflow-x-auto" style="overflow-x: auto;">
            <table class="w-full text-left text-sm" style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.875rem;">
                <thead style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">
                    <tr>
                        <th style="padding: 0.85rem 1.25rem;">Circle Swatch</th>
                        <th style="padding: 0.85rem 1.25rem;">Shade Formulation</th>
                        <th style="padding: 0.85rem 1.25rem;">Category</th>
                        <th style="padding: 0.85rem 1.25rem;">Category Selling Prices (GST Incl.)</th>
                        <th style="padding: 0.85rem 1.25rem;">Stock</th>
                        <th style="padding: 0.85rem 1.25rem; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody style="border-top: 1px solid #f1f5f9;">
                    @forelse ($shades as $item)
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <!-- Circular Swatch (Matches Frontend Look Exactly) -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm shrink-0 group" style="width: 48px; height: 48px; border-radius: 9999px; overflow: hidden; border: 2px solid #cbd5e1; position: relative; background-color: {{ !empty($item->hex_color) ? $item->hex_color : '#334155' }};">
                                    @if(!empty($item->image_url))
                                        <img
                                            src="{{ $item->image_url }}"
                                            alt="{{ $item->name }}"
                                            style="width: 100%; height: 100%; object-fit: cover;"
                                            onerror="this.style.display='none'"
                                        />
                                    @endif
                                    <!-- Inner glass specular gloss reflection -->
                                    <div style="position: absolute; inset: 0; pointer-events: none; border-radius: 9999px; background: linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, transparent 60%);"></div>
                                </div>
                            </td>

                            <!-- Shade Name & Code -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    @if(!empty($item->hex_color))
                                        <span style="width: 14px; height: 14px; border-radius: 9999px; display: inline-block; border: 1px solid #cbd5e1; flex-shrink: 0; background-color: {{ $item->hex_color }};"></span>
                                    @endif
                                    <div>
                                        <p style="font-weight: 700; color: #0f172a; margin: 0; font-size: 0.875rem;">
                                            {{ $item->name }}
                                        </p>
                                        @if(!empty($item->code))
                                            <span style="display: inline-block; font-size: 0.75rem; font-family: monospace; font-weight: 700; color: #b45309; background-color: #fef3c7; padding: 0.1rem 0.4rem; border-radius: 0.25rem; margin-top: 0.2rem;">{{ $item->code }}</span>
                                        @endif
                                        <p style="font-size: 0.7rem; color: #94a3b8; font-family: monospace; margin: 0.2rem 0 0 0; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            {{ $item->image_url ?? 'Color swatch fallback' }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <!-- Category -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <span style="display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background-color: #f1f5f9; color: #334155; border: 1px solid #e2e8f0;">
                                    {{ $item->category_obj->name ?? ucfirst($item->category_slug) }}
                                </span>
                            </td>

                            <!-- Category Fixed Pack Prices -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                                    @forelse($item->pack_sizes ?? [] as $pack)
                                        <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 0.15rem 0.5rem; border-radius: 0.25rem; font-weight: 500; color: #334155;">
                                            <span style="color: #64748b;">{{ $pack['label'] ?? $pack['weight'] }}:</span>
                                            <strong style="color: #b45309; font-family: monospace;">₹{{ number_format($pack['price'], 2) }}</strong>
                                        </span>
                                    @empty
                                        <span style="font-size: 0.75rem; color: #94a3b8;">Pricing inherited from category</span>
                                    @endforelse
                                </div>
                            </td>

                            <!-- Stock Status -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <form action="{{ route('admin.vize.pigments.update_stock', $item->id) }}" method="POST">
                                    @csrf
                                    <select
                                        name="stock_status"
                                        onchange="this.form.submit()"
                                        style="font-size: 0.75rem; font-weight: 600; border-radius: 9999px; padding: 0.25rem 0.6rem; border: 1px solid #cbd5e1; cursor: pointer;
                                            {{ $item->stock_status == 'In Stock' ? 'background-color: #ecfdf5; color: #047857; border-color: #a7f3d0;' : '' }}
                                            {{ $item->stock_status == 'Low Stock' ? 'background-color: #fffbeb; color: #b45309; border-color: #fde68a;' : '' }}
                                            {{ $item->stock_status == 'Out of Stock' ? 'background-color: #fff1f2; color: #be123c; border-color: #fecdd3;' : '' }}"
                                    >
                                        <option value="In Stock" {{ $item->stock_status == 'In Stock' ? 'selected' : '' }}>● In Stock</option>
                                        <option value="Low Stock" {{ $item->stock_status == 'Low Stock' ? 'selected' : '' }}>● Low Stock</option>
                                        <option value="Out of Stock" {{ $item->stock_status == 'Out of Stock' ? 'selected' : '' }}>● Out of Stock</option>
                                    </select>
                                </form>
                            </td>

                            <!-- Actions -->
                            <td style="padding: 0.85rem 1.25rem; text-align: right;">
                                <form action="{{ route('admin.vize.pigments.shades.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Remove shade {{ $item->name }}?');" style="display: inline;">
                                    @csrf
                                    <button type="submit" style="color: #dc2626; background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0.25rem 0.5rem;">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" style="padding: 2.5rem; text-align: center; color: #94a3b8;">
                                No color shades listed in this category yet. Click <strong>"+ Add New Shade"</strong> to register one.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Section 2: Categories & Fixed Pack Pricing Table -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-8" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; margin-bottom: 2rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="padding: 1rem 1.25rem; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0;">
                    Categories &amp; Fixed Pack Pricing
                </h2>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">
                    Prices set here apply automatically to all color shades within the category
                </p>
            </div>

            <button
                type="button"
                onclick="openAddCategoryModal()"
                style="background-color: #ffffff; border: 1px solid #cbd5e1; color: #1e293b; font-weight: 700; font-size: 0.8rem; padding: 0.45rem 0.9rem; border-radius: 0.5rem; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
            >
                + New Category
            </button>
        </div>

        <div class="overflow-x-auto" style="overflow-x: auto;">
            <table class="w-full text-left text-sm" style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.875rem;">
                <thead style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">
                    <tr>
                        <th style="padding: 0.85rem 1.25rem;">Category Name</th>
                        <th style="padding: 0.85rem 1.25rem;">System Badge</th>
                        <th style="padding: 0.85rem 1.25rem;">Registered Shades</th>
                        <th style="padding: 0.85rem 1.25rem;">Pack Sizes &amp; Fixed Pricing</th>
                        <th style="padding: 0.85rem 1.25rem; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody style="border-top: 1px solid #f1f5f9;">
                    @foreach($categories as $cat)
                        @php
                            $catSizes = json_decode($cat->pack_sizes ?? '[]', true);
                            $shadesInCat = collect($shades)->where('category_slug', $cat->slug)->count();
                        @endphp
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 1rem 1.25rem;">
                                <strong style="color: #0f172a; font-weight: 700; font-size: 0.875rem; display: block;">{{ $cat->name }}</strong>
                                <p style="font-size: 0.75rem; color: #94a3b8; font-family: monospace; margin: 0.15rem 0 0 0;">slug: {{ $cat->slug }}</p>
                                <p style="font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0 0; max-width: 320px;">{{ $cat->subtitle }}</p>
                            </td>

                            <td style="padding: 1rem 1.25rem;">
                                <span style="font-size: 0.75rem; font-weight: 600; background-color: #f8fafc; color: #334155; padding: 0.2rem 0.5rem; border-radius: 0.25rem; border: 1px solid #e2e8f0;">
                                    {{ $cat->badge }}
                                </span>
                            </td>

                            <td style="padding: 1rem 1.25rem;">
                                <span style="font-weight: 800; color: #0f172a; font-size: 0.875rem;">{{ $shadesInCat }}</span>
                                <span style="font-size: 0.75rem; color: #64748b;">shades</span>
                            </td>

                            <td style="padding: 1rem 1.25rem;">
                                <div style="display: flex; flex-col; flex-direction: column; gap: 0.25rem;">
                                    @foreach($catSizes as $sz)
                                        <div style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-weight: 600; color: #334155; width: 90px;">{{ $sz['label'] ?? $sz['weight'] }}:</span>
                                            <strong style="color: #b45309; font-family: monospace;">₹{{ number_format($sz['price'], 2) }}</strong>
                                            <span style="font-size: 0.65rem; color: #94a3b8;">(Incl. GST)</span>
                                        </div>
                                    @endforeach
                                </div>
                            </td>

                            <td style="padding: 1rem 1.25rem; text-align: right;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem;">
                                    <button
                                        type="button"
                                        onclick="openEditCategoryModal({{ $cat->id }}, '{{ addslashes($cat->name) }}', '{{ addslashes($cat->badge) }}', '{{ addslashes($cat->subtitle) }}', {{ $cat->pack_sizes ?? '[]' }})"
                                        style="color: #b45309; background-color: #fffbeb; border: 1px solid #fde68a; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 0.375rem; cursor: pointer;"
                                    >
                                        ✏️ Edit Prices
                                    </button>
                                    <form action="{{ route('admin.vize.pigments.categories.destroy', $cat->id) }}" method="POST" onsubmit="return confirm('Delete category {{ $cat->name }} and all its shades?');" style="display: inline;">
                                        @csrf
                                        <button type="submit" style="color: #dc2626; background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0.25rem 0.5rem;">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 1: Add Category & Set Pack Prices -->
    <!-- ========================================== -->
    <div id="addCategoryModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.65); padding: 1rem; backdrop-filter: blur(4px);">
        <div style="background: #ffffff; border-radius: 1rem; max-width: 520px; width: 100%; padding: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">Add Category &amp; Fixed Pricing</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Define category details and its standard pack selling rates</p>
                </div>
                <button type="button" onclick="closeAddCategoryModal()" style="color: #94a3b8; background: none; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.pigments.categories.store') }}" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Category Name</label>
                    <input type="text" name="name" required placeholder="e.g. Chameleon Shift, Solid Opaque, Metallic" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                </div>

                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">System Badge</label>
                    <input type="text" name="badge" placeholder="e.g. METALLIC FINISH, LIQUID PASTE DISPERSION" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                </div>

                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Subtitle / Technical Note</label>
                    <textarea name="subtitle" rows="2" placeholder="e.g. High-dispersion, UV-stabilized pigments engineered for zero settlement..." style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"></textarea>
                </div>

                <!-- Pack Sizes & Fixed Selling Rates -->
                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #b45309; text-transform: uppercase; margin-bottom: 0.5rem;">Category Pack Sizes &amp; Prices (Incl. 18% GST)</label>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; background-color: #f8fafc; padding: 0.6rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Pack 1 Label</span>
                                <input type="text" name="size_label[]" value="500 Grams" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; box-sizing: border-box;">
                                <input type="hidden" name="size_weight[]" value="500g">
                            </div>
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Selling Price (₹)</span>
                                <input type="number" step="0.01" name="size_price[]" value="513.00" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; font-family: monospace; font-weight: 700; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; background-color: #f8fafc; padding: 0.6rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Pack 2 Label</span>
                                <input type="text" name="size_label[]" value="1 Kilogram" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; box-sizing: border-box;">
                                <input type="hidden" name="size_weight[]" value="1kg">
                            </div>
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Selling Price (₹)</span>
                                <input type="number" step="0.01" name="size_price[]" value="1026.00" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; font-family: monospace; font-weight: 700; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; background-color: #f8fafc; padding: 0.6rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Pack 3 Label (Optional)</span>
                                <input type="text" name="size_label[]" placeholder="5 Kilograms" style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; box-sizing: border-box;">
                                <input type="hidden" name="size_weight[]" value="5kg">
                            </div>
                            <div>
                                <span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Selling Price (₹)</span>
                                <input type="number" step="0.01" name="size_price[]" placeholder="Optional" style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; font-family: monospace; font-weight: 700; box-sizing: border-box;">
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                    <button type="button" onclick="closeAddCategoryModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #475569; background: none; border: 1px solid #cbd5e1; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                    <button type="submit" style="background-color: #d97706; color: #ffffff; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">Save Category</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL 2: Add Color Shade Formulation (Swatches)      -->
    <!-- ==================================================== -->
    <div id="addShadeModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.65); padding: 1rem; backdrop-filter: blur(4px);">
        <div style="background: #ffffff; border-radius: 1rem; max-width: 520px; width: 100%; padding: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">Add Color Shade Formulation</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Provide shade name and image (shown in realistic circle swatch)</p>
                </div>
                <button type="button" onclick="closeAddShadeModal()" style="color: #94a3b8; background: none; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.pigments.shades.store') }}" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Target Category</label>
                    <select name="category_slug" required style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; font-weight: 600; box-sizing: border-box;">
                        @foreach($categories as $cat)
                            <option value="{{ $cat->slug }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Shade Name</label>
                        <input type="text" name="name" required placeholder="e.g. Royal Sapphire, Liquid Gold" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Code (Optional)</label>
                        <input type="text" name="code" placeholder="e.g. RAL 7016, VZ-04" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Hex Swatch Picker -->
                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Hex Color Code (Fallback Color)</label>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="color" id="shadeColorPicker" value="#ffd700" onchange="document.getElementById('shadeHexInput').value = this.value" style="height: 38px; width: 44px; border: 1px solid #cbd5e1; border-radius: 0.375rem; cursor: pointer; padding: 2px;">
                        <input type="text" id="shadeHexInput" name="hex_color" value="#ffd700" onchange="document.getElementById('shadeColorPicker').value = this.value" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.75rem; font-family: monospace; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Shade Image (Uploaded file OR file path) -->
                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Shade Texture Image (For Circle Swatch &amp; Showcase)</label>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                        <div>
                            <span style="font-size: 0.7rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 0.25rem;">Upload Image File (PNG, JPG, WebP)</span>
                            <input type="file" name="image" accept="image/*" style="font-size: 0.75rem; width: 100%;">
                        </div>

                        <div style="text-align: center; font-size: 0.7rem; color: #94a3b8; font-weight: 700;">— OR —</div>

                        <div>
                            <span style="font-size: 0.7rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 0.25rem;">Existing Image Path / URL</span>
                            <input type="text" name="image_url" placeholder="e.g. /colors/Liquid Gold.png or /colors/sample.jpg" style="width: 100%; padding: 0.4rem 0.6rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.75rem; font-family: monospace; box-sizing: border-box;">
                        </div>
                    </div>
                </div>

                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Description / Notes</label>
                    <input type="text" name="description" placeholder="e.g. High-density metallic swirl paste" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                    <button type="button" onclick="closeAddShadeModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #475569; background: none; border: 1px solid #cbd5e1; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                    <button type="submit" style="background-color: #2563eb; color: #ffffff; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">Save Shade Formulation</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 3: Edit Category Prices             -->
    <!-- ========================================== -->
    <div id="editCategoryModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.65); padding: 1rem; backdrop-filter: blur(4px);">
        <div style="background: #ffffff; border-radius: 1rem; max-width: 520px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; display: flex; flex-direction: column; max-height: 88vh;">

            <!-- Modal Header — always visible -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">Edit Category &amp; Prices</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Update pack sizes and their selling prices for this category</p>
                </div>
                <button type="button" onclick="closeEditCategoryModal()" style="color: #94a3b8; background: none; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <form id="editCategoryForm" action="" method="POST" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
                @csrf

                <!-- Scrollable body -->
                <div style="flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem;">

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Category Name</label>
                        <input type="text" id="editCatName" name="name" required style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">System Badge</label>
                        <input type="text" id="editCatBadge" name="badge" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Subtitle / Technical Note</label>
                        <textarea id="editCatSubtitle" name="subtitle" rows="2" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"></textarea>
                    </div>

                    <!-- Dynamic Pack Sizes -->
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #b45309; text-transform: uppercase; margin-bottom: 0.5rem;">Pack Sizes &amp; Prices (Incl. 18% GST)</label>
                        <div id="editPackSizesContainer" style="display: flex; flex-direction: column; gap: 0.6rem;">
                            <!-- Populated by JS -->
                        </div>
                        <button
                            type="button"
                            onclick="addEditPackRow()"
                            style="margin-top: 0.5rem; font-size: 0.75rem; color: #b45309; font-weight: 600; border: 1px dashed #fde68a; border-radius: 0.375rem; padding: 0.4rem 0.75rem; width: 100%; background-color: #fffbeb; cursor: pointer;"
                        >
                            + Add Another Pack Size
                        </button>
                    </div>

                </div>

                <!-- Footer — always pinned at bottom -->
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; background: #ffffff; flex-shrink: 0;">
                    <button type="button" onclick="closeEditCategoryModal()" style="padding: 0.5rem 1.25rem; font-size: 0.875rem; color: #475569; background: none; border: 1px solid #cbd5e1; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                    <button type="submit" style="background-color: #d97706; color: #ffffff; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">💾 Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- JavaScript Controller -->
    <script>
        function openAddShadeModal() {
            var modal = document.getElementById('addShadeModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        function closeAddShadeModal() {
            var modal = document.getElementById('addShadeModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        function openAddCategoryModal() {
            var modal = document.getElementById('addCategoryModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        function closeAddCategoryModal() {
            var modal = document.getElementById('addCategoryModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        function openEditCategoryModal(id, name, badge, subtitle, packSizes) {
            document.getElementById('editCatName').value = name;
            document.getElementById('editCatBadge').value = badge;
            document.getElementById('editCatSubtitle').value = subtitle;

            // Set form action dynamically
            document.getElementById('editCategoryForm').action = '/admin/vize/pigments/categories/' + id;

            // Populate pack sizes
            var container = document.getElementById('editPackSizesContainer');
            container.innerHTML = '';
            var sizes = (typeof packSizes === 'string') ? JSON.parse(packSizes) : packSizes;
            if (sizes && sizes.length > 0) {
                sizes.forEach(function(sz) {
                    container.appendChild(buildPackRow(sz.label || sz.weight || '', sz.price || ''));
                });
            } else {
                container.appendChild(buildPackRow('500 Grams', ''));
                container.appendChild(buildPackRow('1 Kilogram', ''));
            }

            var modal = document.getElementById('editCategoryModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        function closeEditCategoryModal() {
            var modal = document.getElementById('editCategoryModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        function buildPackRow(label, price) {
            var row = document.createElement('div');
            row.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; background-color: #f8fafc; padding: 0.6rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; align-items: end;';
            row.innerHTML =
                '<div>' +
                    '<span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Pack Label</span>' +
                    '<input type="text" name="size_label[]" value="' + label + '" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; box-sizing: border-box;">' +
                    '<input type="hidden" name="size_weight[]" value="' + label.toLowerCase().replace(/ /g,"") + '">' +
                '</div>' +
                '<div>' +
                    '<span style="font-size: 0.65rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.2rem;">Price (₹)</span>' +
                    '<input type="number" step="0.01" name="size_price[]" value="' + price + '" required style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; font-family: monospace; font-weight: 700; box-sizing: border-box;">' +
                '</div>' +
                '<div style="padding-bottom: 2px;">' +
                    '<button type="button" onclick="this.closest(\'div\').parentElement.remove()" style="color: #ef4444; background: none; border: none; font-size: 1.25rem; font-weight: bold; cursor: pointer; padding: 0 0.25rem; line-height: 1;">×</button>' +
                '</div>';
            return row;
        }

        function addEditPackRow() {
            document.getElementById('editPackSizesContainer').appendChild(buildPackRow('', ''));
        }
    </script>
</x-admin::layouts>
