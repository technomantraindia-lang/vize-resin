<x-admin::layouts>
    <x-slot:title>
        VIZE Command Center — Specialty Polymers Admin
    </x-slot>

    @pushOnce('styles')
        <style>
            @media (min-width: 1024px) {
                .vize-5-cols-grid {
                    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
                }
            }
            @media (min-width: 1280px) {
                .vize-span-2 {
                    grid-column: span 2 / span 2 !important;
                }
            }
        </style>
    @endPushOnce

    <!-- Top Hero Header -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div class="grid gap-1">
            <div class="flex items-center gap-3">
                <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    VIZE Command Center
                </h1>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Store Active
                </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
                Logged in as <strong class="text-gray-700 dark:text-gray-200">{{ auth()->guard('admin')->user()->name }}</strong> &bull; VIZE Specialty Polymers Executive Storefront & CRM Overview
            </p>
        </div>

        <!-- Quick Store Preview & Date Filters -->
        <div class="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
            <a
                href="http://localhost:5173"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
                title="Open live customer website in new tab"
            >
                <span>Live Website</span>
                <span class="text-xs">&nearr;</span>
            </a>

            <v-dashboard-filters>
                <div class="flex gap-1.5">
                    <div class="shimmer h-[38px] w-[130px] rounded-md"></div>
                    <div class="shimmer h-[38px] w-[130px] rounded-md"></div>
                </div>
            </v-dashboard-filters>
        </div>
    </div>

    <!-- ⚡ 1. QUICK CREATOR ACTIONS DOCK -->
    <div
        class="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"
        style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
    >
        <div class="flex items-center justify-between gap-4 flex-wrap" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300" style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 12px; color: #374151;">
                <span style="color: #f59e0b; font-size: 16px; font-weight: 900;">&bull;</span>
                <span>Quick Actions</span>
            </div>

            <div class="flex items-center gap-2 flex-wrap" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <a
                    href="{{ route('admin.vize.resins.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #2563eb; font-weight: 800; font-size: 13px;">+</span> Resin Product
                </a>

                <a
                    href="{{ route('admin.vize.pigments.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #db2777; font-weight: 800; font-size: 13px;">+</span> New Color Shade
                </a>

                <a
                    href="{{ route('admin.vize.table_tops.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #059669; font-weight: 800; font-size: 13px;">+</span> Table Top
                </a>

                <a
                    href="{{ route('admin.vize.workshops.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #7c3aed; font-weight: 800; font-size: 13px;">+</span> Schedule Batch
                </a>

                <a
                    href="{{ route('admin.vize.videos.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #dc2626; font-weight: 800; font-size: 13px;">+</span> Upload Reel
                </a>

                <a
                    href="{{ route('admin.vize.offers.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background-color: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;"
                >
                    <span style="color: #d97706; font-weight: 800; font-size: 13px;">+</span> Offer Popup
                </a>

                <a
                    href="{{ route('admin.vize.customers.index') }}"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition shadow-xs"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background-color: #f59e0b; color: #091a20; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; border: 1px solid #d97706;"
                >
                    <span>View All Leads CRM</span> &rarr;
                </a>
            </div>
        </div>
    </div>

    <!-- 📊 2. TOP 5 EXECUTIVE METRIC CARDS (REAL DATA) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 vize-5-cols-grid gap-3.5 mb-6 w-full">
        <!-- Card 1: Resin Products -->
        <a href="{{ route('admin.vize.resins.index') }}" class="group block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-blue-500 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Resin Products</span>
                <span class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-sm font-black">&infin;</span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {{ $vizeStats['resins_count'] }}
            </p>
            <p class="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <span>&bull;</span> {{ $vizeStats['resins_in_stock'] }} In Stock &bull; Active
            </p>
        </a>

        <!-- Card 2: Pigments & Swatches -->
        <a href="{{ route('admin.vize.pigments.index') }}" class="group block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-pink-500 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pigments & RAL</span>
                <span class="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center text-sm font-black">&#9684;</span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {{ $vizeStats['shades_count'] }}
            </p>
            <p class="text-xs font-semibold text-gray-500 mt-1">
                Across {{ $vizeStats['categories_count'] }} Finish Groups
            </p>
        </a>

        <!-- Card 3: Table Tops Studio -->
        <a href="{{ route('admin.vize.table_tops.index') }}" class="group block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-amber-500 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Table Studio</span>
                <span class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-sm font-black">&#9646;</span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {{ $vizeStats['tables_count'] }}
            </p>
            <p class="text-xs font-semibold text-gray-500 mt-1">
                <span class="text-emerald-600 font-bold">{{ $vizeStats['tables_ready'] }} Ready</span> &bull; {{ $vizeStats['tables_custom'] }} Custom
            </p>
        </a>

        <!-- Card 4: Workshops & Academy -->
        <a href="{{ route('admin.vize.workshops.index') }}" class="group block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-purple-500 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Academy Batches</span>
                <span class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center text-sm font-black">&#9733;</span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {{ $vizeStats['batches_count'] }}
            </p>
            <p class="text-xs font-semibold text-blue-600 mt-1">
                {{ $vizeStats['admissions_count'] }} Enrolled Students
            </p>
        </a>

        <!-- Card 5: Inquiries & Quotes CRM -->
        <a href="{{ route('admin.vize.customers.index') }}" class="group block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-emerald-500 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Leads & Quotes</span>
                <span class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-sm font-black">&#9993;</span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {{ $vizeStats['total_leads_count'] }}
            </p>
            <p class="text-xs font-semibold text-emerald-600 mt-1">
                Direct WhatsApp &amp; Forms
            </p>
        </a>
    </div>

    <!-- 🛒 3. DIRECT ONLINE CART ORDERS & BILLING (OVERALL DETAILS) -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs p-4 mb-6 w-full">
        <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Direct Online Cart Orders &amp; Billing</span>
            </h2>
            <span class="text-xs text-gray-400">Web Checkout Pipeline</span>
        </div>

        <!-- Bagisto Default Over-all details included cleanly -->
        @include('admin::dashboard.over-all-details')
    </div>

    <!-- 🌟 4. MAIN COMMAND TWO-COLUMN GRID -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">

        <!-- ==================== LEFT TWO COLUMNS (SPAN 2) ==================== -->
        <div class="xl:col-span-2 vize-span-2 space-y-6">

            <!-- MODULE 1: LIVE INQUIRIES & LEADS FEED (CRM) -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>Live Inquiries &amp; Quotation Requests</span>
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                {{ $recentLeads->count() }} Recent
                            </span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-0.5">High-value customer requests for custom river tables, workshop admissions, and architectural projects.</p>
                    </div>

                    <a href="{{ route('admin.vize.customers.index') }}" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                        View All in CRM &rarr;
                    </a>
                </div>

                <div class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse($recentLeads as $lead)
                        <div class="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase" style="background-color: {{ $lead->type_bg }}; color: {{ $lead->type_color }};">
                                        {{ $lead->type }}
                                    </span>
                                    <strong class="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {{ $lead->name }}
                                    </strong>
                                    <span class="text-[11px] text-gray-400">
                                        &bull; {{ \Carbon\Carbon::parse($lead->created_at)->diffForHumans() }}
                                    </span>
                                </div>

                                <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
                                    {{ $lead->details ?: 'General inquiry requested via website.' }}
                                </p>

                                <div class="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-mono">
                                    <span>&#9993; {{ $lead->email }}</span>
                                    @if(!empty($lead->phone))
                                        <span>&#9742; {{ $lead->phone }}</span>
                                    @endif
                                </div>
                            </div>

                            <!-- Fast Contact Actions -->
                            <div class="flex items-center gap-2 shrink-0">
                                @if(!empty($lead->phone))
                                    @php
                                        $cleanPhone = preg_replace('/[^0-9]/', '', $lead->phone);
                                        if (strlen($cleanPhone) === 10) {
                                            $cleanPhone = '91' . $cleanPhone;
                                        }
                                    @endphp
                                    <a
                                        href="https://wa.me/{{ $cleanPhone }}?text=Hello%20{{ urlencode($lead->name) }},%20thank%20you%20for%20contacting%20VIZE%20Specialty%20Polymers.%20We%20received%20your%20inquiry%20regarding%20{{ urlencode($lead->type) }}."
                                        target="_blank"
                                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                                        title="Chat directly on WhatsApp"
                                    >
                                        <span class="font-bold">&#9742;</span> WhatsApp
                                    </a>
                                @endif

                                <span class="px-2 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {{ $lead->status }}
                                </span>
                            </div>
                        </div>
                    @empty
                        <div class="p-8 text-center text-gray-400 text-xs">
                            No recent customer inquiries logged.
                        </div>
                    @endforelse
                </div>
            </div>

            <!-- MODULE 2: RESIN PRODUCTS CATALOG HEALTH -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>Resin Formulations &amp; Real Stock Status</span>
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                {{ $vizeStats['resins_count'] }} Formulations Active
                            </span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-0.5">Real-time inventory of official VIZE epoxy, polyaspartic, and polyurethane products.</p>
                    </div>

                    <a href="{{ route('admin.vize.resins.index') }}" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                        Manage Resins &rarr;
                    </a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-800">
                                <th class="p-3">Product Name</th>
                                <th class="p-3">Category</th>
                                <th class="p-3">Base Price</th>
                                <th class="p-3">Pack Qty</th>
                                <th class="p-3">Status</th>
                                <th class="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            @forelse($recentResins as $resin)
                                <tr class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                                    <td class="p-3 font-bold text-gray-900 dark:text-white">
                                        {{ $resin->name }}
                                        @if(!empty($resin->suffix))
                                            <span class="text-gray-400 font-normal">({{ $resin->suffix }})</span>
                                        @endif
                                    </td>
                                    <td class="p-3 text-gray-500">{{ $resin->category }}</td>
                                    <td class="p-3 font-bold text-blue-600">₹{{ number_format($resin->base_price, 2) }}</td>
                                    <td class="p-3 text-gray-500">{{ $resin->pack_qty }}</td>
                                    <td class="p-3">
                                        @if($resin->in_stock)
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                In Stock
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                                Out of Stock
                                            </span>
                                        @endif
                                    </td>
                                    <td class="p-3 text-right">
                                        <a href="{{ route('admin.vize.resins.index') }}" class="font-bold text-blue-600 hover:text-blue-800">
                                            Edit &rarr;
                                        </a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="p-4 text-center text-gray-400">No resin products registered.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- ==================== RIGHT COLUMN (SPAN 1) ==================== -->
        <div class="space-y-6">

            <!-- WIDGET A: WORKSHOP BATCHES & OCCUPANCY -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs p-4">
                <div class="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>🎓 Workshop Batches</span>
                    </h3>
                    <a href="{{ route('admin.vize.workshops.index') }}" class="text-xs font-bold text-blue-600 hover:text-blue-800">
                        Manage &rarr;
                    </a>
                </div>

                <div class="space-y-3.5">
                    @forelse($upcomingBatches as $batch)
                        @php
                            $pct = round(($batch->booked_seats / max(1, $batch->total_seats)) * 100);
                            $barColor = $pct >= 90 ? 'bg-rose-500' : ($pct >= 70 ? 'bg-amber-500' : 'bg-blue-600');
                        @endphp
                        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-xs font-bold text-gray-900 dark:text-white">{{ $batch->city }}</strong>
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold {{ $batch->status === 'Sold Out' ? 'bg-rose-100 text-rose-800' : ($batch->status === 'Filling Fast' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800') }}">
                                    {{ $batch->status }}
                                </span>
                            </div>

                            <p class="text-[11px] text-gray-500 truncate mb-2">
                                {{ \Carbon\Carbon::parse($batch->start_date)->format('M d') }} - {{ \Carbon\Carbon::parse($batch->end_date)->format('M d, Y') }}
                            </p>

                            <div class="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                                <span>Seats Booked:</span>
                                <strong>{{ $batch->booked_seats }} / {{ $batch->total_seats }} ({{ $pct }}%)</strong>
                            </div>

                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div class="{{ $barColor }} h-1.5 rounded-full" style="width: {{ min(100, $pct) }}%;"></div>
                            </div>
                        </div>
                    @empty
                        <p class="text-xs text-gray-400 text-center py-4">No batches scheduled.</p>
                    @endforelse
                </div>
            </div>

            <!-- WIDGET B: TABLE TOPS STUDIO STATUS -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs p-4">
                <div class="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>🪵 Table Tops Studio</span>
                    </h3>
                    <a href="{{ route('admin.vize.table_tops.index') }}" class="text-xs font-bold text-blue-600 hover:text-blue-800">
                        View &rarr;
                    </a>
                </div>

                <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-900">
                        <span class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">Ready to Ship</span>
                        <strong class="text-xl font-black text-emerald-800 dark:text-emerald-300">{{ $vizeStats['tables_ready'] }}</strong>
                    </div>

                    <div class="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-100 dark:border-amber-900">
                        <span class="text-xs text-amber-700 dark:text-amber-400 font-semibold block">Made to Order</span>
                        <strong class="text-xl font-black text-amber-800 dark:text-amber-300">{{ $vizeStats['tables_custom'] }}</strong>
                    </div>
                </div>
            </div>

            <!-- WIDGET C: MARKETING & POPUPS HUB -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs p-4">
                <div class="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                        ⚡ Marketing &amp; Engagement
                    </h3>
                    <a href="{{ route('admin.vize.offers.index') }}" class="text-xs font-bold text-blue-600 hover:text-blue-800">
                        Offers &rarr;
                    </a>
                </div>

                <div class="space-y-2 text-xs">
                    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                        <span class="text-gray-600 dark:text-gray-300">Active Website Popups</span>
                        <strong class="text-emerald-600 font-bold">{{ $vizeStats['offers_count'] }} Live</strong>
                    </div>

                    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                        <span class="text-gray-600 dark:text-gray-300">Featured Video Reels</span>
                        <strong class="text-purple-600 font-bold">{{ $vizeStats['videos_count'] }} Active</strong>
                    </div>
                </div>
            </div>

            <!-- WIDGET D: STORE STATS ACCORDION -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
                <div class="p-3 border-b border-gray-100 dark:border-gray-800">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Web Traffic &amp; Order Chart
                    </h3>
                </div>
                <div class="p-3">
                    @include('admin::dashboard.total-sales')
                </div>
            </div>

            <!-- WIDGET E: TOP ORDERED PRODUCTS & BEST SELLERS -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
                @include('admin::dashboard.top-selling-products')
            </div>

            <!-- WIDGET F: TOP CUSTOMERS BY SALES VOLUME -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
                @include('admin::dashboard.top-customers')
            </div>

        </div>
    </div>

    @pushOnce('scripts')
        <script
            type="module"
            src="{{ bagisto_asset('js/chart.js') }}"
        >
        </script>

        <script
            type="text/x-template"
            id="v-dashboard-filters-template"
        >
            <div class="flex gap-1.5">
                <x-admin::flat-picker.date class="!w-[130px]" ::allow-input="false">
                    <input
                        class="flex min-h-[38px] w-full rounded-md border px-3 py-1.5 text-xs text-gray-600 transition-all hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400"
                        v-model="filters.start"
                        placeholder="@lang('admin::app.dashboard.index.start-date')"
                    />
                </x-admin::flat-picker.date>

                <x-admin::flat-picker.date class="!w-[130px]" ::allow-input="false">
                    <input
                        class="flex min-h-[38px] w-full rounded-md border px-3 py-1.5 text-xs text-gray-600 transition-all hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400"
                        v-model="filters.end"
                        placeholder="@lang('admin::app.dashboard.index.end-date')"
                    />
                </x-admin::flat-picker.date>
            </div>
        </script>

        <script type="module">
            app.component('v-dashboard-filters', {
                template: '#v-dashboard-filters-template',

                data() {
                    return {
                        filters: {
                            channel: '',
                            start: "{{ $startDate->format('Y-m-d') }}",
                            end: "{{ $endDate->format('Y-m-d') }}",
                        }
                    }
                },

                watch: {
                    filters: {
                        handler() {
                            this.$emitter.emit('reporting-filter-updated', this.filters);
                        },
                        deep: true
                    }
                },
            });
        </script>
    @endPushOnce
</x-admin::layouts>