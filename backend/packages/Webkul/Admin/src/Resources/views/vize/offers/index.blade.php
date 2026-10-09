<x-admin::layouts>
    <x-slot:title>
        Offers &amp; Site Popups — VIZE
    </x-slot>

    <!-- Header Section -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.5rem;">🎁</span>
                <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                    Site Offers &amp; Popups
                </h1>
            </div>
            <p style="font-size: 0.875rem; color: #64748b; margin-top: 0.35rem;">
                Create deals and announcements with custom fields. If multiple offers are active, they become <strong>slideable</strong> with next/prev buttons on the website popup!
            </p>
        </div>

        <div>
            <button
                type="button"
                onclick="openAddOfferModal()"
                style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: #ffffff; border: none; padding: 0.65rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);"
            >
                <span style="font-size: 1.1rem; font-weight: 900;">+</span> Create New Offer
            </button>
        </div>
    </div>

    <!-- Active Offers Carousel Summary Alert -->
    @php
        $activeOffers = collect($offers)->where('is_active', 1)->values();
    @endphp

    @if(count($activeOffers) > 0)
        <div style="background: #0f172a; border-radius: 0.75rem; padding: 1.15rem 1.25rem; margin-bottom: 1.5rem; color: #ffffff; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border: 1px solid #1e293b;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 1.6rem;">🎠</span>
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 0.68rem; font-weight: 800; background-color: #10b981; color: #ffffff; padding: 0.15rem 0.55rem; border-radius: 9999px; text-transform: uppercase;">
                            {{ count($activeOffers) }} {{ count($activeOffers) == 1 ? 'OFFER ACTIVE' : 'OFFERS ACTIVE (SLIDEABLE)' }}
                        </span>
                        <span style="font-size: 0.75rem; color: #94a3b8;">Visitors see them in a slideable popup</span>
                    </div>
                    <p style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin: 0.25rem 0 0 0;">
                        {{ $activeOffers[0]->title ?? $activeOffers[0]->headline }}
                        @if(count($activeOffers) > 1)
                            <span style="font-size: 0.8rem; color: #fbbf24; font-weight: 600;">+ {{ count($activeOffers) - 1 }} more offers in carousel</span>
                        @endif
                    </p>
                </div>
            </div>

            <button
                type="button"
                onclick='previewOfferData(@json($activeOffers[0]))'
                style="background: #ffffff; color: #0f172a; border: none; padding: 0.45rem 1rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 700; cursor: pointer;"
            >
                👁️ Preview Popup
            </button>
        </div>
    @else
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 0.75rem; padding: 0.85rem 1.25rem; margin-bottom: 1.5rem; color: #92400e; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
            <span>⚠️ No offer is currently active. Activate one or more offers below to show them on the website.</span>
        </div>
    @endif

    <!-- Simple Offers Table -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 2rem;">
        <div style="padding: 1rem 1.25rem; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
            <h2 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0;">
                All Offers ({{ count($offers) }})
            </h2>
            <button
                type="button"
                onclick="openAddOfferModal()"
                style="background-color: #2563eb; color: #ffffff; border: none; padding: 0.4rem 0.85rem; border-radius: 0.375rem; font-weight: 700; font-size: 0.78rem; cursor: pointer;"
            >
                + Add Offer
            </button>
        </div>

        <div style="overflow-x: auto;">
            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.875rem;">
                <thead style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">
                    <tr>
                        <th style="padding: 0.85rem 1.25rem; width: 70px;">Image</th>
                        <th style="padding: 0.85rem 1.25rem;">Offer &amp; Custom Fields</th>
                        <th style="padding: 0.85rem 1.25rem;">Badge Tag</th>
                        <th style="padding: 0.85rem 1.25rem;">Button &amp; Link</th>
                        <th style="padding: 0.85rem 1.25rem; text-align: center;">Active on Site</th>
                        <th style="padding: 0.85rem 1.25rem; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($offers as $offer)
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <!-- Image -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle;">
                                <div style="width: 60px; height: 45px; border-radius: 0.375rem; overflow: hidden; background: #0f172a; border: 1px solid #e2e8f0;">
                                    <img src="{{ $offer->image_url ?? '/epowrap-product.jpg' }}" alt="" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/epowrap-product.jpg'" />
                                </div>
                            </td>

                            <!-- Offer Details & Custom Fields -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle; max-width: 320px;">
                                <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem; line-height: 1.3;">
                                    {{ $offer->title ?? $offer->headline }}
                                </div>
                                @if(!empty($offer->description))
                                    <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">
                                        {{ $offer->description }}
                                    </div>
                                @endif

                                <!-- Custom Fields Pills -->
                                @if(!empty($offer->custom_fields_array) && count($offer->custom_fields_array) > 0)
                                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem;">
                                        @foreach($offer->custom_fields_array as $cf)
                                            <span style="font-size: 0.7rem; background-color: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 0.15rem 0.45rem; border-radius: 0.25rem;">
                                                <strong style="color: #0284c7;">{{ $cf['label'] ?? '' }}:</strong> {{ $cf['value'] ?? '' }}
                                            </span>
                                        @endforeach
                                    </div>
                                @endif
                            </td>

                            <!-- Badge & Discount Cut -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle;">
                                <span style="display: inline-block; font-size: 0.72rem; font-weight: 800; background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 0.2rem 0.6rem; border-radius: 9999px;">
                                    {{ $offer->badge ?? $offer->badge_text ?? $offer->discount_badge ?? 'OFFER' }}
                                </span>
                                @if(!empty($offer->discount_percent) && $offer->discount_percent > 0)
                                    <div style="font-size: 0.72rem; font-weight: 700; color: #16a34a; margin-top: 0.3rem;">
                                        @if(($offer->applicable_category ?? '') === 'single_product' && !empty($offer->target_product_id))
                                            🎯 {{ $offer->discount_percent }}% cut on {{ $offer->target_product_id }}
                                        @else
                                            ✂️ {{ $offer->discount_percent }}% cut on {{ ucfirst($offer->applicable_category ?? 'all') }}
                                        @endif
                                    </div>
                                @endif
                            </td>

                            <!-- Button & Link -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle;">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #1e293b;">
                                    {{ $offer->button_text ?? $offer->cta_text ?? 'Shop Now' }}
                                </div>
                                <div style="font-size: 0.72rem; color: #94a3b8;">
                                    {{ $offer->button_link ?? $offer->cta_link ?? '/resins' }}
                                </div>
                            </td>

                            <!-- Status Toggle -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle; text-align: center;">
                                <form method="POST" action="{{ route('admin.vize.offers.toggle_status', $offer->id) }}" style="display: inline-block; margin: 0;">
                                    @csrf
                                    <input type="hidden" name="is_active" value="{{ $offer->is_active ? '0' : '1' }}">
                                    <button
                                        type="submit"
                                        style="cursor: pointer; padding: 0.35rem 0.8rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 800; border: none; {{ $offer->is_active ? 'background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;' : 'background-color: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;' }}"
                                        title="Click to toggle offer on or off in site popup"
                                    >
                                        {{ $offer->is_active ? '● LIVE ON SITE' : '○ OFF' }}
                                    </button>
                                </form>
                            </td>

                            <!-- Actions -->
                            <td style="padding: 1rem 1.25rem; vertical-align: middle; text-align: right;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.4rem;">
                                    <button
                                        type="button"
                                        onclick='previewOfferData(@json($offer))'
                                        style="background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; padding: 0.35rem 0.65rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;"
                                    >
                                        👁️ Preview
                                    </button>

                                    <button
                                        type="button"
                                        onclick='openEditOfferModal(@json($offer))'
                                        style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 0.35rem 0.65rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;"
                                    >
                                        ✏️ Edit
                                    </button>

                                    <form method="POST" action="{{ route('admin.vize.offers.destroy', $offer->id) }}" onsubmit="return confirm('Delete this offer?');" style="display: inline-block; margin: 0;">
                                        @csrf
                                        <button
                                            type="submit"
                                            style="background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 0.35rem 0.65rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;"
                                        >
                                            🗑️
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" style="padding: 3rem 1rem; text-align: center; color: #64748b;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎁</div>
                                <div style="font-weight: 700; color: #0f172a;">No Offers Created</div>
                                <p style="font-size: 0.8rem; color: #64748b; margin: 0.25rem 0 1rem 0;">
                                    Create offers like "Up to 15% OFF" or "Buy 2 Get 1 Free".
                                </p>
                                <button
                                    type="button"
                                    onclick="openAddOfferModal()"
                                    style="background-color: #2563eb; color: #ffffff; border: none; padding: 0.5rem 1.25rem; border-radius: 0.375rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;"
                                >
                                    + Create First Offer
                                </button>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- ================= ADD OFFER MODAL ================= -->
    <div id="addOfferModal" style="display: none; position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 9999; align-items: center; justify-content: center; padding: 1.5rem;">
        <div style="background: #ffffff; border-radius: 0.75rem; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            <div style="padding: 1.25rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">Create New Offer</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Add title, badge, and custom details</p>
                </div>
                <button type="button" onclick="closeAddOfferModal()" style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748b;">&times;</button>
            </div>

            <form method="POST" action="{{ route('admin.vize.offers.store') }}" enctype="multipart/form-data" style="padding: 1.25rem;">
                @csrf
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Offer Deal Title -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Offer Headline / Deal *
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Up to 15% OFF on Epoxy Resins or Buy 2 Get 1 Free"
                            required
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-weight: 600;"
                        />
                    </div>

                    <!-- Badge Tag -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Offer Tag / Badge
                        </label>
                        <input
                            type="text"
                            name="badge"
                            value="⚡ 15% OFF"
                            placeholder="e.g. 15% OFF, BUY 2 GET 1 FREE, SPECIAL DEAL"
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Short Details / Description
                        </label>
                        <textarea
                            name="description"
                            rows="2"
                            placeholder="e.g. Direct factory price on all clear casting and metallic floor resins."
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                        ></textarea>
                    </div>

                    <!-- Discount % Cut & Category Scope -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 0.75rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                            <div>
                                <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                    Cart Discount % Cut (e.g. 10 or 15)
                                </label>
                                <input
                                    type="number"
                                    name="discount_percent"
                                    value="15"
                                    min="0"
                                    max="90"
                                    placeholder="15"
                                    style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.375rem; border: 1px solid #86efac; font-size: 0.875rem; font-weight: 800; color: #166534; box-sizing: border-box; background: #fff;"
                                />
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                    Applies Cut To
                                </label>
                                <select
                                    name="applicable_category"
                                    id="add_applicable_category"
                                    onchange="handleCategoryChange('add')"
                                    style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.375rem; border: 1px solid #86efac; font-size: 0.85rem; font-weight: 700; color: #166534; box-sizing: border-box; background: #fff;"
                                >
                                    <option value="resins">🧪 Resin &amp; Hardener Products</option>
                                    <option value="single_product">🎯 Single Particular Resin (Select Below)</option>
                                    <option value="pigments">🎨 Colors &amp; Pigments</option>
                                    <option value="table_tops">🪵 Table Tops Studio</option>
                                    <option value="all">🛍️ All Products Across Store</option>
                                </select>
                            </div>
                        </div>

                        <!-- Target Specific Resin Product Dropdown (Always visible) -->
                        <div id="add_target_product_wrapper" style="margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed #86efac;">
                            <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                🎯 Specific Resin Product (Select one resin to discount ONLY that product):
                            </label>
                            <select
                                name="target_product_id"
                                id="add_target_product_id"
                                onchange="handleProductChange('add')"
                                style="width: 100%; padding: 0.6rem 0.75rem; border-radius: 0.375rem; border: 1.5px solid #22c55e; font-size: 0.875rem; font-weight: 700; color: #0f172a; box-sizing: border-box; background: #fff;"
                            >
                                <option value="">✨ None (Apply to all products in group selected above)</option>
                                @if(isset($products) && is_array($products))
                                    @foreach($products as $prod)
                                        <option value="{{ $prod['id'] }}">🧪 {{ $prod['name'] }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <div style="font-size: 0.72rem; color: #15803d; margin-top: 0.35rem; line-height: 1.4;">
                                • Choose one resin above (e.g. <strong>Vize Cast Max</strong>) to cut discount <strong>ONLY on that product</strong>.<br/>
                                • Leave as <em>None</em> to cut discount across the entire group.
                            </div>
                        </div>
                    </div>

                    <!-- Custom Fields Section -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.85rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div>
                                <span style="font-size: 0.8rem; font-weight: 800; color: #0f172a;">Custom Fields (Extra Offer Details)</span>
                                <p style="font-size: 0.7rem; color: #64748b; margin: 0.1rem 0 0 0;">Add any custom perks like Valid On, Minimum Order, Free Gift, Delivery, etc.</p>
                            </div>
                            <button
                                type="button"
                                onclick="addCustomFieldRow('add_custom_fields_container')"
                                style="background: #0f172a; color: #ffffff; border: none; padding: 0.3rem 0.65rem; border-radius: 0.375rem; font-size: 0.72rem; font-weight: 700; cursor: pointer;"
                            >
                                + Add Field
                            </button>
                        </div>

                        <div id="add_custom_fields_container" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <!-- Initial sample row -->
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input
                                    type="text"
                                    name="custom_field_keys[]"
                                    placeholder="Label (e.g. Valid On)"
                                    style="width: 45%; padding: 0.45rem 0.65rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; box-sizing: border-box;"
                                />
                                <input
                                    type="text"
                                    name="custom_field_values[]"
                                    placeholder="Value (e.g. All 10L Bulk Packs)"
                                    style="flex: 1; padding: 0.45rem 0.65rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; box-sizing: border-box;"
                                />
                                <button type="button" onclick="this.parentElement.remove()" style="color: #ef4444; font-size: 1.2rem; cursor: pointer; background: none; border: none; padding: 0 4px;">&times;</button>
                            </div>
                        </div>
                    </div>

                    <!-- Button Label & Link -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                                Button Text
                            </label>
                            <input
                                type="text"
                                name="button_text"
                                value="Shop Now"
                                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                            />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                                Target Page Link
                            </label>
                            <select
                                name="button_link"
                                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; background: #fff;"
                            >
                                <option value="/resins">Resins Catalog (/resins)</option>
                                <option value="/colors-pigments">Colors &amp; Pigments (/colors-pigments)</option>
                                <option value="/table-tops">Table Tops (/table-tops)</option>
                                <option value="/workshop">Workshops (/workshop)</option>
                                <option value="/contact">Contact Us (/contact)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Image Upload -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Banner Image
                        </label>
                        <input
                            type="text"
                            name="image_url"
                            value="/epowrap-product.jpg"
                            placeholder="/epowrap-product.jpg or upload below"
                            style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; margin-bottom: 0.35rem; box-sizing: border-box;"
                        />
                        <input type="file" name="image_file" accept="image/*" style="font-size: 0.75rem;" />
                    </div>

                    <!-- Active Switch -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <span style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Active in website popup</span>
                            <p style="font-size: 0.7rem; color: #64748b; margin: 0.1rem 0 0 0;">Multiple active offers become slideable in the popup</p>
                        </div>
                        <input type="checkbox" name="is_active" value="1" checked style="width: 18px; height: 18px; accent-color: #2563eb; cursor: pointer;" />
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
                    <button type="button" onclick="closeAddOfferModal()" style="padding: 0.5rem 1rem; border: 1px solid #cbd5e1; background: #fff; border-radius: 0.375rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; color: #475569;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 0.5rem 1.25rem; border: none; background: #2563eb; color: #fff; border-radius: 0.375rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                        Save &amp; Publish
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ================= EDIT OFFER MODAL ================= -->
    <div id="editOfferModal" style="display: none; position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 9999; align-items: center; justify-content: center; padding: 1.5rem;">
        <div style="background: #ffffff; border-radius: 0.75rem; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            <div style="padding: 1.25rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">Edit Offer</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Update details &amp; custom fields</p>
                </div>
                <button type="button" onclick="closeEditOfferModal()" style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748b;">&times;</button>
            </div>

            <form id="editOfferForm" method="POST" action="" enctype="multipart/form-data" style="padding: 1.25rem;">
                @csrf
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Offer Deal Title -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Offer Headline / Deal *
                        </label>
                        <input
                            type="text"
                            id="edit_title"
                            name="title"
                            required
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-weight: 600;"
                        />
                    </div>

                    <!-- Badge Tag -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Offer Tag / Badge
                        </label>
                        <input
                            type="text"
                            id="edit_badge"
                            name="badge"
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Short Details / Description
                        </label>
                        <textarea
                            id="edit_description"
                            name="description"
                            rows="2"
                            style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                        ></textarea>
                    </div>

                    <!-- Discount % Cut & Category Scope -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 0.75rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                            <div>
                                <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                    Cart Discount % Cut (e.g. 10 or 15)
                                </label>
                                <input
                                    type="number"
                                    id="edit_discount_percent"
                                    name="discount_percent"
                                    min="0"
                                    max="90"
                                    placeholder="15"
                                    style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.375rem; border: 1px solid #86efac; font-size: 0.875rem; font-weight: 800; color: #166534; box-sizing: border-box; background: #fff;"
                                />
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                    Applies Cut To
                                </label>
                                <select
                                    id="edit_applicable_category"
                                    name="applicable_category"
                                    onchange="handleCategoryChange('edit')"
                                    style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.375rem; border: 1px solid #86efac; font-size: 0.85rem; font-weight: 700; color: #166534; box-sizing: border-box; background: #fff;"
                                >
                                    <option value="resins">🧪 Resin &amp; Hardener Products</option>
                                    <option value="single_product">🎯 Single Particular Resin (Select Below)</option>
                                    <option value="pigments">🎨 Colors &amp; Pigments</option>
                                    <option value="table_tops">🪵 Table Tops Studio</option>
                                    <option value="all">🛍️ All Products Across Store</option>
                                </select>
                            </div>
                        </div>

                        <!-- Target Specific Resin Product Dropdown (Always visible) -->
                        <div id="edit_target_product_wrapper" style="margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed #86efac;">
                            <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">
                                🎯 Specific Resin Product (Select one resin to discount ONLY that product):
                            </label>
                            <select
                                id="edit_target_product_id"
                                name="target_product_id"
                                onchange="handleProductChange('edit')"
                                style="width: 100%; padding: 0.6rem 0.75rem; border-radius: 0.375rem; border: 1.5px solid #22c55e; font-size: 0.875rem; font-weight: 700; color: #0f172a; box-sizing: border-box; background: #fff;"
                            >
                                <option value="">✨ None (Apply to all products in group selected above)</option>
                                @if(isset($products) && is_array($products))
                                    @foreach($products as $prod)
                                        <option value="{{ $prod['id'] }}">🧪 {{ $prod['name'] }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <div style="font-size: 0.72rem; color: #15803d; margin-top: 0.35rem; line-height: 1.4;">
                                • Choose one resin above (e.g. <strong>Vize Cast Max</strong>) to cut discount <strong>ONLY on that product</strong>.<br/>
                                • Leave as <em>None</em> to cut discount across the entire group.
                            </div>
                        </div>
                    </div>

                    <!-- Custom Fields Section -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.85rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div>
                                <span style="font-size: 0.8rem; font-weight: 800; color: #0f172a;">Custom Fields (Extra Offer Details)</span>
                                <p style="font-size: 0.7rem; color: #64748b; margin: 0.1rem 0 0 0;">Add or modify custom fields</p>
                            </div>
                            <button
                                type="button"
                                onclick="addCustomFieldRow('edit_custom_fields_container')"
                                style="background: #0f172a; color: #ffffff; border: none; padding: 0.3rem 0.65rem; border-radius: 0.375rem; font-size: 0.72rem; font-weight: 700; cursor: pointer;"
                            >
                                + Add Field
                            </button>
                        </div>

                        <div id="edit_custom_fields_container" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <!-- Populated dynamically -->
                        </div>
                    </div>

                    <!-- Button Label & Link -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                                Button Text
                            </label>
                            <input
                                type="text"
                                id="edit_button_text"
                                name="button_text"
                                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;"
                            />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                                Target Page Link
                            </label>
                            <select
                                id="edit_button_link"
                                name="button_link"
                                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; background: #fff;"
                            >
                                <option value="/resins">Resins Catalog (/resins)</option>
                                <option value="/colors-pigments">Colors &amp; Pigments (/colors-pigments)</option>
                                <option value="/table-tops">Table Tops (/table-tops)</option>
                                <option value="/workshop">Workshops (/workshop)</option>
                                <option value="/contact">Contact Us (/contact)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Image Upload -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                            Banner Image URL
                        </label>
                        <input
                            type="text"
                            id="edit_image_url"
                            name="image_url"
                            style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; margin-bottom: 0.35rem; box-sizing: border-box;"
                        />
                        <input type="file" name="image_file" accept="image/*" style="font-size: 0.75rem;" />
                    </div>

                    <!-- Active Switch -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Show this offer as popup on site</span>
                        <input type="checkbox" id="edit_is_active" name="is_active" value="1" style="width: 18px; height: 18px; accent-color: #2563eb; cursor: pointer;" />
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
                    <button type="button" onclick="closeEditOfferModal()" style="padding: 0.5rem 1rem; border: 1px solid #cbd5e1; background: #fff; border-radius: 0.375rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; color: #475569;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 0.5rem 1.25rem; border: none; background: #2563eb; color: #fff; border-radius: 0.375rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                        Update Offer
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ================= LIVE PREVIEW MODAL ================= -->
    <div id="livePreviewModal" style="display: none; position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.8); backdrop-filter: blur(6px); z-index: 10000; align-items: center; justify-content: center; padding: 1.5rem;">
        <div style="position: relative; width: 100%; max-width: 440px;">
            <div style="background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 1.25rem; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); color: #fff;">
                <!-- Close preview -->
                <button
                    type="button"
                    onclick="closeLivePreviewModal()"
                    style="position: absolute; top: 0.75rem; right: 0.75rem; width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;"
                >
                    &times;
                </button>

                <!-- Image Banner -->
                <div id="previewImageWrapper" style="width: 100%; height: 180px; background-color: #1e293b; overflow: hidden; position: relative;">
                    <img id="previewImage" src="/epowrap-product.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/epowrap-product.jpg'" />
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, #0f172a 10%, transparent 90%);"></div>
                    <div style="position: absolute; top: 0.75rem; left: 0.75rem;">
                        <span id="previewBadge" style="background: #f59e0b; color: #000; font-size: 0.7rem; font-weight: 900; padding: 0.2rem 0.6rem; border-radius: 9999px; text-transform: uppercase;">
                            ⚡ 15% OFF
                        </span>
                    </div>
                </div>

                <!-- Text, Custom Fields & Button -->
                <div style="padding: 1.25rem 1.5rem;">
                    <h3 id="previewTitle" style="font-size: 1.3rem; font-weight: 800; color: #ffffff; line-height: 1.3; margin: 0 0 0.4rem 0;">
                        Up to 15% OFF on All Epoxy Resins
                    </h3>
                    <p id="previewDescription" style="font-size: 0.85rem; color: #94a3b8; line-height: 1.4; margin: 0 0 1rem 0;">
                        Direct factory price on all clear casting and metallic floor resins.
                    </p>

                    <!-- Preview Custom Fields Container -->
                    <div id="previewCustomFields" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.6rem 0.85rem; margin-bottom: 1.25rem; font-size: 0.78rem;">
                        <!-- Injected dynamically -->
                    </div>

                    <button
                        type="button"
                        id="previewButton"
                        style="width: 100%; background: #2563eb; color: #fff; border: none; padding: 0.85rem; border-radius: 0.65rem; font-size: 0.95rem; font-weight: 800; cursor: pointer;"
                    >
                        Shop Now →
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        function closeAddOfferModal() {
            document.getElementById('addOfferModal').style.display = 'none';
        }

        function handleCategoryChange(mode) {
            const catSelect = document.getElementById(mode + '_applicable_category');
            const prodSelect = document.getElementById(mode + '_target_product_id');
            const wrapper = document.getElementById(mode + '_target_product_wrapper');
            if (catSelect && catSelect.value === 'single_product') {
                if (wrapper) wrapper.style.backgroundColor = '#ecfdf5';
                if (prodSelect && !prodSelect.value && prodSelect.options.length > 1) {
                    prodSelect.selectedIndex = 1;
                }
            } else {
                if (wrapper) wrapper.style.backgroundColor = 'transparent';
                if (prodSelect) prodSelect.value = '';
            }
        }

        function handleProductChange(mode) {
            const prodSelect = document.getElementById(mode + '_target_product_id');
            const catSelect = document.getElementById(mode + '_applicable_category');
            const wrapper = document.getElementById(mode + '_target_product_wrapper');
            if (prodSelect && prodSelect.value) {
                if (catSelect) catSelect.value = 'single_product';
                if (wrapper) wrapper.style.backgroundColor = '#ecfdf5';
            } else {
                if (catSelect && catSelect.value === 'single_product') {
                    catSelect.value = 'resins';
                }
                if (wrapper) wrapper.style.backgroundColor = 'transparent';
            }
        }

        function addCustomFieldRow(containerId, label = '', value = '') {
            const container = document.getElementById(containerId);
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.gap = '0.5rem';
            row.style.alignItems = 'center';
            row.innerHTML = `
                <input
                    type="text"
                    name="custom_field_keys[]"
                    value="${label ? escapeHtml(label) : ''}"
                    placeholder="Label (e.g. Valid Till)"
                    style="width: 45%; padding: 0.45rem 0.65rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; box-sizing: border-box;"
                />
                <input
                    type="text"
                    name="custom_field_values[]"
                    value="${value ? escapeHtml(value) : ''}"
                    placeholder="Value (e.g. Sunday Midnight)"
                    style="flex: 1; padding: 0.45rem 0.65rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.8rem; box-sizing: border-box;"
                />
                <button type="button" onclick="this.parentElement.remove()" style="color: #ef4444; font-size: 1.2rem; cursor: pointer; background: none; border: none; padding: 0 4px;">&times;</button>
            `;
            container.appendChild(row);
        }

        function escapeHtml(str) {
            return String(str).replace(/"/g, '&quot;');
        }

        function openAddOfferModal() {
            document.getElementById('addOfferModal').style.display = 'flex';
        }

        function openEditOfferModal(offer) {
            const form = document.getElementById('editOfferForm');
            form.action = '{{ url("admin/vize/offers") }}/' + offer.id + '/update';

            document.getElementById('edit_title').value = offer.title || offer.headline || '';
            document.getElementById('edit_badge').value = offer.badge || offer.badge_text || offer.discount_badge || 'SPECIAL OFFER';
            document.getElementById('edit_description').value = offer.description || '';
            document.getElementById('edit_discount_percent').value = (offer.discount_percent !== undefined && offer.discount_percent !== null) ? offer.discount_percent : 0;
            
            const targetProd = offer.target_product_id || '';
            document.getElementById('edit_target_product_id').value = targetProd;

            if (targetProd || offer.applicable_category === 'single_product') {
                document.getElementById('edit_applicable_category').value = 'single_product';
                const wrapper = document.getElementById('edit_target_product_wrapper');
                if (wrapper) wrapper.style.backgroundColor = '#ecfdf5';
            } else {
                document.getElementById('edit_applicable_category').value = offer.applicable_category || 'resins';
                const wrapper = document.getElementById('edit_target_product_wrapper');
                if (wrapper) wrapper.style.backgroundColor = 'transparent';
            }

            document.getElementById('edit_button_text').value = offer.button_text || offer.cta_text || 'Shop Now';
            document.getElementById('edit_button_link').value = offer.button_link || offer.cta_link || '/resins';
            document.getElementById('edit_image_url').value = offer.image_url || '';
            document.getElementById('edit_is_active').checked = !!offer.is_active;

            // Populate custom fields
            const container = document.getElementById('edit_custom_fields_container');
            container.innerHTML = '';
            
            let customFields = offer.custom_fields_array || [];
            if (typeof customFields === 'string') {
                try { customFields = JSON.parse(customFields); } catch(e) { customFields = []; }
            }

            if (Array.isArray(customFields) && customFields.length > 0) {
                customFields.forEach(cf => {
                    addCustomFieldRow('edit_custom_fields_container', cf.label || cf.name, cf.value);
                });
            } else {
                addCustomFieldRow('edit_custom_fields_container', '', '');
            }

            document.getElementById('editOfferModal').style.display = 'flex';
        }

        function closeEditOfferModal() {
            document.getElementById('editOfferModal').style.display = 'none';
        }

        function previewOfferData(offer) {
            document.getElementById('previewTitle').textContent = offer.title || offer.headline || 'Special Offer';
            let badgeText = offer.badge || offer.badge_text || offer.discount_badge || 'SPECIAL DEAL';
            if (offer.discount_percent > 0 && !badgeText.includes('%')) {
                badgeText = '⚡ ' + offer.discount_percent + '% OFF • ' + badgeText;
            }
            document.getElementById('previewBadge').textContent = badgeText;
            document.getElementById('previewDescription').textContent = offer.description || '';
            document.getElementById('previewButton').textContent = (offer.button_text || offer.cta_text || 'Shop Now') + ' →';

            if (offer.image_url) {
                document.getElementById('previewImage').src = offer.image_url;
                document.getElementById('previewImageWrapper').style.display = 'block';
            } else {
                document.getElementById('previewImageWrapper').style.display = 'none';
            }

            // Preview custom fields
            const cfContainer = document.getElementById('previewCustomFields');
            let customFields = offer.custom_fields_array || offer.customFields || [];
            if (typeof customFields === 'string') {
                try { customFields = JSON.parse(customFields); } catch(e) { customFields = []; }
            }

            if (Array.isArray(customFields) && customFields.length > 0) {
                cfContainer.style.display = 'block';
                cfContainer.innerHTML = customFields.map(cf => `
                    <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                        <span style="color: #94a3b8; font-weight: 600;">• ${cf.label || cf.name}:</span>
                        <span style="color: #ffffff; font-weight: 700;">${cf.value}</span>
                    </div>
                `).join('');
            } else {
                cfContainer.style.display = 'none';
            }

            document.getElementById('livePreviewModal').style.display = 'flex';
        }

        function closeLivePreviewModal() {
            document.getElementById('livePreviewModal').style.display = 'none';
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAddOfferModal();
                closeEditOfferModal();
                closeLivePreviewModal();
            }
        });
    </script>
</x-admin::layouts>
