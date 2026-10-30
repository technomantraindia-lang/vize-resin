<x-admin::layouts>
    <x-slot:title>
        Customers & Leads CRM Hub - VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span>👥</span> Customers & Leads CRM Hub
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Unified management for registered store accounts, contractor trade groups, workshop leads, table commissions, and product reviews.
            </p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
            <a
                href="{{ route('admin.vize.customers.export') }}"
                class="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
                📥 Export Customers (CSV)
            </a>

            <button
                type="button"
                onclick="openAddGroupModal()"
                class="flex items-center gap-2 cursor-pointer bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
                🏷️ + Add Trade Group
            </button>

            <button
                type="button"
                onclick="openAddCustomerModal()"
                class="primary-button flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                style="background-color: #2563eb; color: #ffffff;"
            >
                <span class="text-lg font-bold">+</span> Add Customer
            </button>
        </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-blue-600">Store Accounts</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($customers) }}</p>
            <p class="text-[11px] text-gray-500 mt-1">{{ collect($customers)->where('status', 1)->count() }} Active Users</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-emerald-600">Workshop Leads</p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">{{ count($workshopAdmissions) }}</p>
            <p class="text-[11px] text-gray-500 mt-1">Masterclass Registrations</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-amber-600">Table Commissions</p>
            <p class="mt-2 text-2xl font-bold text-amber-600">{{ count($tableInquiries) }}</p>
            <p class="text-[11px] text-gray-500 mt-1">Bespoke Studio Requests</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-purple-600">Site Inquiries</p>
            <p class="mt-2 text-2xl font-bold text-purple-600">{{ count($generalInquiries) }}</p>
            <p class="text-[11px] text-gray-500 mt-1">Technical Consultations</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-rose-600">Product Reviews</p>
            <p class="mt-2 text-2xl font-bold text-rose-600">{{ count($reviews) }}</p>
            <p class="text-[11px] text-gray-500 mt-1">{{ collect($reviews)->where('status', 'approved')->count() }} Approved</p>
        </div>
    </div>

    <!-- Live Filter & Search Box -->
    <div class="mb-5 flex justify-between items-center gap-4 flex-wrap">
        <div class="relative flex-1 min-w-[280px]">
            <input
                type="text"
                id="crmSearchInput"
                onkeyup="filterCrmTables()"
                placeholder="🔍 Search across customers, leads, phones, emails, cities..."
                class="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            >
            <span class="absolute left-3.5 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
            ⚡ Direct 1-Click WhatsApp, Call & Email actions enabled
        </div>
    </div>

    <!-- Section Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-6 text-sm font-semibold flex-wrap">
        <button
            type="button"
            onclick="showCrmTab('customers')"
            id="tab-btn-customers"
            class="pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold transition"
        >
            👤 Store Accounts ({{ count($customers) }})
        </button>
        <button
            type="button"
            onclick="showCrmTab('workshops')"
            id="tab-btn-workshops"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            🎓 Workshop Leads ({{ count($workshopAdmissions) }})
        </button>
        <button
            type="button"
            onclick="showCrmTab('tables')"
            id="tab-btn-tables"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            🪵 Table Commissions ({{ count($tableInquiries) }})
        </button>
        <button
            type="button"
            onclick="showCrmTab('inquiries')"
            id="tab-btn-inquiries"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            💬 Site Consultations ({{ count($generalInquiries) }})
        </button>
        <button
            type="button"
            onclick="showCrmTab('reviews')"
            id="tab-btn-reviews"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            ⭐ Product Reviews ({{ count($reviews) }})
        </button>
        <button
            type="button"
            onclick="showCrmTab('groups')"
            id="tab-btn-groups"
            class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition"
        >
            🏷️ Trade Groups ({{ count($customerGroups) }})
        </button>
    </div>


    <!-- =========================================================================
         TAB 1: STORE CUSTOMERS & ACCOUNTS
         ========================================================================= -->
    <div id="tab-crm-customers" class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-customers">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-6 py-4">Customer Name & Email</th>
                        <th class="px-6 py-4">Phone & 1-Click WhatsApp</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($customers as $cust)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-6 py-4">
                                <div 
                                    class="customer-row-trigger group/cust relative inline-flex items-center gap-3 cursor-pointer select-none"
                                    data-customer-id="{{ $cust->id }}"
                                    onmouseenter="handleCustomerHover(this, {{ $cust->id }})"
                                    onmouseleave="handleCustomerLeave()"
                                    onclick="toggleCustomerPinned(this, {{ $cust->id }})"
                                >
                                    <!-- Initial Avatar Badge -->
                                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm flex-shrink-0 group-hover/cust:scale-105 transition-transform">
                                        {{ strtoupper(substr($cust->first_name ?: 'U', 0, 1)) }}
                                    </div>
                                    
                                    <div>
                                        <div class="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 group-hover/cust:text-blue-600 transition">
                                            <span>{{ $cust->first_name }} {{ $cust->last_name }}</span>
                                            <!-- Dropdown Hover Badge Indicator -->
                                            <button
                                                type="button"
                                                onclick="event.stopPropagation(); toggleCustomerPinned(this.closest('.customer-row-trigger'), {{ $cust->id }});"
                                                class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/80 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-800 transition shadow-2xs cursor-pointer"
                                                title="Click to lock open / Hover to preview customer dossier"
                                            >
                                                <span>Details</span>
                                                <svg class="w-3.5 h-3.5 text-blue-600 transition-transform group-hover/cust:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                            <span class="text-blue-600 hover:underline">✉️ {{ $cust->email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-xs font-mono">
                                @if ($cust->phone)
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">📞 {{ $cust->phone }}</div>
                                    <div class="mt-1">
                                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $cust->phone) }}" target="_blank" class="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:underline bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                            💬 WhatsApp
                                        </a>
                                    </div>
                                @else
                                    <span class="text-gray-400">No phone provided</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onclick="openEditCustomerModal({{ $cust->id }})"
                                        class="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <form action="{{ route('admin.vize.customers.destroy', $cust->id) }}" method="POST" onsubmit="return confirm('Delete customer {{ $cust->first_name }} {{ $cust->last_name }}?');" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer" title="Delete customer">
                                            🗑️
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3" class="px-6 py-10 text-center text-gray-400">
                                No registered customer accounts yet. Click <strong>"+ Add Customer"</strong> to create the first profile.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         TAB 2: WORKSHOP REGISTRATIONS & LEADS
         ========================================================================= -->
    <div id="tab-crm-workshops" class="hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-workshops">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Student Name & Contact</th>
                        <th class="px-5 py-3.5">Batch / City</th>
                        <th class="px-5 py-3.5">Course Name</th>
                        <th class="px-5 py-3.5">Payment Status</th>
                        <th class="px-5 py-3.5">Registration Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($workshopAdmissions as $student)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                <div>{{ $student->student_name }}</div>
                                <span class="text-xs text-gray-400 block font-normal">{{ $student->email }}</span>
                                <div class="mt-1 flex items-center gap-2">
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $student->whatsapp ?? $student->phone) }}" target="_blank" class="text-emerald-600 font-semibold hover:underline text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        💬 WhatsApp ↗
                                    </a>
                                    <a href="tel:{{ $student->phone }}" class="text-xs text-gray-600 hover:underline">📞 {{ $student->phone }}</a>
                                </div>
                            </td>
                            <td class="px-5 py-4 text-xs">
                                <span class="font-bold text-gray-800 dark:text-gray-200">📍 {{ $student->batch_city ?? 'Direct Inquiry' }}</span>
                                <span class="text-gray-400 block mt-0.5">{{ $student->batch_date ? date('M d, Y', strtotime($student->batch_date)) : 'Upcoming' }}</span>
                            </td>
                            <td class="px-5 py-4 text-xs font-semibold text-blue-600">
                                {{ $student->course_title ?? 'Masterclass Training' }}
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
                                <form action="{{ route('admin.vize.workshops.admissions.destroy', $student->id) }}" method="POST" onsubmit="return confirm('Delete admission record?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                        🗑️ Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-8 text-center text-gray-400">
                                No workshop student registrations recorded yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         TAB 3: BESPOKE TABLE TOP INQUIRIES
         ========================================================================= -->
    <div id="tab-crm-tables" class="hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-tables">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Client & Contact</th>
                        <th class="px-5 py-3.5">Table Model / Preference</th>
                        <th class="px-5 py-3.5">Requested Specs & Dimensions</th>
                        <th class="px-5 py-3.5">Budget</th>
                        <th class="px-5 py-3.5">Status</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($tableInquiries as $inq)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                <div>{{ $inq->customer_name }}</div>
                                <span class="text-xs text-gray-400 block font-normal">{{ $inq->email }}</span>
                                <div class="mt-1">
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inq->phone) }}" target="_blank" class="text-emerald-600 font-semibold hover:underline text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        💬 WhatsApp: {{ $inq->phone }}
                                    </a>
                                </div>
                            </td>
                            <td class="px-5 py-4 text-xs font-semibold text-blue-600">
                                {{ $inq->table_model_name ?? 'Custom Live-Edge Commission' }}
                                <span class="text-gray-500 block font-normal">Wood: {{ $inq->wood_preference ?: 'Natural Timber' }}</span>
                            </td>
                            <td class="px-5 py-4 text-xs">
                                <div><strong>📐 Dimensions:</strong> {{ $inq->requested_dimensions ?: 'Custom' }}</div>
                                @if ($inq->message)
                                    <div class="text-gray-500 line-clamp-2 mt-0.5 italic">"{{ $inq->message }}"</div>
                                @endif
                            </td>
                            <td class="px-5 py-4 text-xs font-bold text-emerald-600">
                                {{ $inq->budget ?: 'Custom Quotation' }}
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.table_tops.inquiries.update_status', $inq->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $inq->status == 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}
                                            {{ $inq->status == 'In Design' ? 'bg-blue-50 text-blue-700 border-blue-200' : '' }}
                                            {{ $inq->status == 'Contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : '' }}
                                            {{ $inq->status == 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}"
                                    >
                                        <option value="New" {{ $inq->status == 'New' ? 'selected' : '' }}>New</option>
                                        <option value="Contacted" {{ $inq->status == 'Contacted' ? 'selected' : '' }}>Contacted</option>
                                        <option value="In Design" {{ $inq->status == 'In Design' ? 'selected' : '' }}>In Design</option>
                                        <option value="Completed" {{ $inq->status == 'Completed' ? 'selected' : '' }}>Completed</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.table_tops.inquiries.destroy', $inq->id) }}" method="POST" onsubmit="return confirm('Delete this table inquiry?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                        🗑️ Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-8 text-center text-gray-400">
                                No custom table commission requests yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         TAB 4: SITE CONSULTATION & CONTACT INQUIRIES
         ========================================================================= -->
    <div id="tab-crm-inquiries" class="hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-inquiries">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Name & Email</th>
                        <th class="px-5 py-3.5">Phone & WhatsApp</th>
                        <th class="px-5 py-3.5">Service Type</th>
                        <th class="px-5 py-3.5">Message / Inquiry Details</th>
                        <th class="px-5 py-3.5">Status</th>
                        <th class="px-5 py-3.5">Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($generalInquiries as $ginq)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                <div>{{ $ginq->name }}</div>
                                <a href="mailto:{{ $ginq->email }}" class="text-xs text-blue-600 hover:underline font-normal">{{ $ginq->email }}</a>
                            </td>
                            <td class="px-5 py-4 text-xs font-mono">
                                @if ($ginq->phone)
                                    <div>📞 {{ $ginq->phone }}</div>
                                    <div class="mt-1">
                                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $ginq->phone) }}" target="_blank" class="text-emerald-600 font-semibold hover:underline text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            💬 WhatsApp
                                        </a>
                                    </div>
                                @else
                                    <span class="text-gray-400">N/A</span>
                                @endif
                            </td>
                            <td class="px-5 py-4 text-xs font-semibold text-indigo-600">
                                {{ $ginq->service_type ?: 'General Inquiry' }}
                            </td>
                            <td class="px-5 py-4 text-xs max-w-md">
                                <p class="text-gray-700 dark:text-gray-300">{{ $ginq->message }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.customers.inquiries.update_status', $ginq->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $ginq->status == 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}
                                            {{ $ginq->status == 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : '' }}
                                            {{ $ginq->status == 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}"
                                    >
                                        <option value="New" {{ $ginq->status == 'New' ? 'selected' : '' }}>New</option>
                                        <option value="In Progress" {{ $ginq->status == 'In Progress' ? 'selected' : '' }}>In Progress</option>
                                        <option value="Resolved" {{ $ginq->status == 'Resolved' ? 'selected' : '' }}>Resolved</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500">
                                {{ date('M d, Y', strtotime($ginq->created_at)) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.customers.inquiries.destroy', $ginq->id) }}" method="POST" onsubmit="return confirm('Delete this inquiry?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                        🗑️
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-5 py-8 text-center text-gray-400">
                                No general website consultation inquiries recorded yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         TAB 5: PRODUCT REVIEWS
         ========================================================================= -->
    <div id="tab-crm-reviews" class="hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-reviews">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Reviewer Name</th>
                        <th class="px-5 py-3.5">Rating</th>
                        <th class="px-5 py-3.5">Title & Feedback</th>
                        <th class="px-5 py-3.5">Display Status</th>
                        <th class="px-5 py-3.5">Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($reviews as $rev)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                {{ $rev->name }}
                            </td>
                            <td class="px-5 py-4 text-amber-500 font-bold">
                                {{ str_repeat('★', $rev->rating) }}{{ str_repeat('☆', 5 - $rev->rating) }}
                                <span class="text-xs text-gray-500 font-normal">({{ $rev->rating }}/5)</span>
                            </td>
                            <td class="px-5 py-4 text-xs max-w-md">
                                <div class="font-bold text-gray-900 dark:text-white mb-0.5">{{ $rev->title }}</div>
                                <p class="text-gray-600 dark:text-gray-400">{{ $rev->comment }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.customers.reviews.update_status', $rev->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $rev->status == 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}
                                            {{ $rev->status == 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}
                                            {{ $rev->status == 'disapproved' ? 'bg-rose-50 text-rose-700 border-rose-200' : '' }}"
                                    >
                                        <option value="approved" {{ $rev->status == 'approved' ? 'selected' : '' }}>Approved (Visible)</option>
                                        <option value="pending" {{ $rev->status == 'pending' ? 'selected' : '' }}>Pending</option>
                                        <option value="disapproved" {{ $rev->status == 'disapproved' ? 'selected' : '' }}>Disapproved</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500">
                                {{ date('M d, Y', strtotime($rev->created_at)) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.customers.reviews.destroy', $rev->id) }}" method="POST" onsubmit="return confirm('Delete review?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                        🗑️ Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-8 text-center text-gray-400">
                                No customer product reviews submitted yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         TAB 6: TRADE GROUPS & DISCOUNT TIERS
         ========================================================================= -->
    <div id="tab-crm-groups" class="hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-10">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-base">Trade Groups & Pricing Tiers</h3>
                <p class="text-xs text-gray-500">Group customers for customized trade discounts (e.g. Contractors 15%, Distributors 25%).</p>
            </div>
            <button
                type="button"
                onclick="openAddGroupModal()"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                style="background-color: #2563eb; color: #fff;"
            >
                + Add Trade Group
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300" id="table-groups">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-5 py-3.5">Group ID</th>
                        <th class="px-5 py-3.5">Group Name</th>
                        <th class="px-5 py-3.5">Code Identifier</th>
                        <th class="px-5 py-3.5">Created Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($customerGroups as $grp)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4 font-mono text-xs text-gray-400">
                                #{{ $grp->id }}
                            </td>
                            <td class="px-5 py-4 font-bold text-gray-900 dark:text-white">
                                {{ $grp->name }}
                            </td>
                            <td class="px-5 py-4 font-mono text-xs text-indigo-600">
                                {{ $grp->code }}
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500">
                                {{ date('M d, Y', strtotime($grp->created_at)) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                @if (!in_array($grp->code, ['general', 'guest']))
                                    <form action="{{ route('admin.vize.customers.groups.destroy', $grp->id) }}" method="POST" onsubmit="return confirm('Delete group &quot;{{ $grp->name }}&quot;?');" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                            🗑️ Remove
                                        </button>
                                    </form>
                                @else
                                    <span class="text-xs text-gray-400">System Default</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-5 py-8 text-center text-gray-400">
                                No custom groups found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>


    <!-- =========================================================================
         ADD CUSTOMER MODAL
         ========================================================================= -->
    <div
        id="addCustomerModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span>👤</span> Create Store Customer Account
                </h3>
                <button type="button" onclick="closeAddCustomerModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.customers.store') }}" method="POST" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 16px;">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">First Name *</label>
                            <input type="text" name="first_name" required placeholder="e.g. Rahul" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Last Name</label>
                            <input type="text" name="last_name" placeholder="e.g. Sharma" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address *</label>
                        <input type="email" name="email" required placeholder="e.g. rahul@example.com" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                            <input type="text" name="phone" placeholder="e.g. +91 98765 43210" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Trade Group</label>
                            <select name="customer_group_id" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                                @foreach ($customerGroups as $grp)
                                    <option value="{{ $grp->id }}">{{ $grp->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Company / Studio Name</label>
                            <input type="text" name="company_name" placeholder="e.g. Apex Floors LLP" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN (For Tax Credit)</label>
                            <input type="text" name="gstin" placeholder="e.g. 27AAAAA0000A1Z5" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Registered Trade / Profession</label>
                        <input type="text" name="registered_role" placeholder="e.g. Epoxy Contractor, Designer / Architect, Artisan / Maker" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Status</label>
                            <select name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                                <option value="1">Active</option>
                                <option value="0">Inactive / Suspended</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Password (Optional)</label>
                            <input type="password" name="password" placeholder="Default: vize@123456" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Internal Notes (Optional)</label>
                        <textarea name="notes" rows="2" placeholder="e.g. Vadodara flooring applicator / requested bulk discount" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                    </div>
                </div>

                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-shrink: 0;">
                    <button type="button" onclick="closeAddCustomerModal()" style="padding: 8px 16px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 9px 20px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.35);">
                        Save Customer Account
                    </button>
                </div>
            </form>
        </div>
    </div>


    <!-- =========================================================================
         EDIT CUSTOMER MODAL
         ========================================================================= -->
    <div
        id="editCustomerModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span>✏️</span> Edit Customer Account
                </h3>
                <button type="button" onclick="closeEditCustomerModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <form id="editCustomerForm" method="POST" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 16px;">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">First Name *</label>
                            <input type="text" id="edit_cust_first_name" name="first_name" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Last Name</label>
                            <input type="text" id="edit_cust_last_name" name="last_name" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address *</label>
                        <input type="email" id="edit_cust_email" name="email" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                            <input type="text" id="edit_cust_phone" name="phone" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Trade Group</label>
                            <select id="edit_cust_group_id" name="customer_group_id" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                                @foreach ($customerGroups as $grp)
                                    <option value="{{ $grp->id }}">{{ $grp->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Company / Studio Name</label>
                            <input type="text" id="edit_cust_company_name" name="company_name" placeholder="e.g. Apex Floors LLP" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN (For Tax Credit)</label>
                            <input type="text" id="edit_cust_gstin" name="gstin" placeholder="e.g. 27AAAAA0000A1Z5" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Registered Trade / Profession</label>
                        <input type="text" id="edit_cust_registered_role" name="registered_role" placeholder="e.g. Epoxy Contractor, Designer / Architect, Artisan / Maker" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Status</label>
                            <select id="edit_cust_status" name="status" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                                <option value="1">Active</option>
                                <option value="0">Inactive / Suspended</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Reset Password</label>
                            <input type="password" name="password" placeholder="Leave empty to keep unchanged" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Internal Notes</label>
                        <textarea id="edit_cust_notes" name="notes" rows="2" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm"></textarea>
                    </div>
                </div>

                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-shrink: 0;">
                    <button type="button" onclick="closeEditCustomerModal()" style="padding: 8px 16px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 9px 20px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        Update Account
                    </button>
                </div>
            </form>
        </div>
    </div>


    <!-- =========================================================================
         ADD TRADE GROUP MODAL
         ========================================================================= -->
    <div
        id="addGroupModal"
        class="hidden"
        style="position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px 16px;"
    >
        <div
            style="width: 100%; max-width: 480px; max-height: 90vh; display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; border: 1px solid #e5e7eb;"
        >
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #ffffff; flex-shrink: 0;">
                <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0;">Add Trade Group</h3>
                <button type="button" onclick="closeAddGroupModal()" style="background: transparent; border: none; font-size: 26px; line-height: 1; font-weight: 700; color: #9ca3af; cursor: pointer; padding: 4px 8px; border-radius: 6px;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.customers.groups.store') }}" method="POST" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
                @csrf
                <div style="padding: 24px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Group Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Master Applicator (20% Trade)" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 uppercase mb-1">Group Code Identifier *</label>
                        <input type="text" name="code" required placeholder="e.g. master-applicator" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-mono">
                    </div>
                </div>

                <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-shrink: 0;">
                    <button type="button" onclick="closeAddGroupModal()" style="padding: 8px 16px; border: 1px solid #d1d5db; background: #ffffff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 9px 20px; background: #4f46e5; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        Create Group
                    </button>
                </div>
            </form>
        </div>
    </div>


    <!-- JavaScript Controls -->
    <script>
        const VIZE_CUSTOMERS = @json($customers->keyBy('id'));

        function ensureCardInBody() {
            let card = document.getElementById('vizeGlobalCustomerCard');
            if (card && card.parentElement !== document.body) {
                document.body.appendChild(card);
            }
            return card;
        }

        // Guarantee card is attached directly to body
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureCardInBody);
        } else {
            ensureCardInBody();
        }

        function showCrmTab(tabName) {
            const tabs = ['customers', 'workshops', 'tables', 'inquiries', 'reviews', 'groups'];
            tabs.forEach(t => {
                const el = document.getElementById('tab-crm-' + t);
                const btn = document.getElementById('tab-btn-' + t);
                if (el) el.classList.toggle('hidden', t !== tabName);
                if (btn) {
                    if (t === tabName) {
                        btn.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold transition';
                    } else {
                        btn.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold transition';
                    }
                }
            });
        }

        function filterCrmTables() {
            const query = (document.getElementById('crmSearchInput').value || '').toLowerCase();
            const tableIds = ['table-customers', 'table-workshops', 'table-tables', 'table-inquiries', 'table-reviews', 'table-groups'];

            tableIds.forEach(tblId => {
                const table = document.getElementById(tblId);
                if (!table) return;
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        function openAddCustomerModal() {
            const m = document.getElementById('addCustomerModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeAddCustomerModal() {
            const m = document.getElementById('addCustomerModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        function openEditCustomerModal(custOrId) {
            const cust = (typeof custOrId === 'object' && custOrId !== null)
                ? custOrId
                : ((typeof VIZE_CUSTOMERS !== 'undefined' && VIZE_CUSTOMERS[custOrId]) ? VIZE_CUSTOMERS[custOrId] : null);

            if (!cust) {
                console.error('Customer not found for edit:', custOrId);
                return;
            }

            const form = document.getElementById('editCustomerForm');
            form.action = "{{ url('admin/vize/customers') }}/" + cust.id;

            document.getElementById('edit_cust_first_name').value = cust.first_name || '';
            document.getElementById('edit_cust_last_name').value = cust.last_name || '';
            document.getElementById('edit_cust_email').value = cust.email || '';
            document.getElementById('edit_cust_phone').value = cust.phone || '';
            if (document.getElementById('edit_cust_extra_phone')) {
                document.getElementById('edit_cust_extra_phone').value = cust.extra_phone || '';
            }
            document.getElementById('edit_cust_group_id').value = cust.customer_group_id || 1;
            document.getElementById('edit_cust_status').value = cust.status ? '1' : '0';
            document.getElementById('edit_cust_company_name').value = cust.company_name || '';
            document.getElementById('edit_cust_gstin').value = cust.gstin || '';
            document.getElementById('edit_cust_registered_role').value = cust.registered_role || '';
            document.getElementById('edit_cust_notes').value = cust.notes || '';

            const m = document.getElementById('editCustomerModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeEditCustomerModal() {
            const m = document.getElementById('editCustomerModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        function openAddGroupModal() {
            const m = document.getElementById('addGroupModal');
            m.classList.remove('hidden');
            m.style.display = 'flex';
        }

        function closeAddGroupModal() {
            const m = document.getElementById('addGroupModal');
            m.classList.add('hidden');
            m.style.display = 'none';
        }

        // =====================================================================
        // CUSTOMER HOVER DROPDOWN CONTROLS
        // =====================================================================
        let customerCardTimer = null;
        let currentCust = null;
        let isCardPinned = false;

        function handleCustomerHover(triggerEl, custOrId) {
            if (customerCardTimer) clearTimeout(customerCardTimer);
            if (isCardPinned) return;
            showCustomerCard(triggerEl, custOrId);
        }

        function handleCustomerLeave() {
            if (isCardPinned) return;
            if (customerCardTimer) clearTimeout(customerCardTimer);
            customerCardTimer = setTimeout(() => {
                closeCustomerCard();
            }, 350);
        }

        function keepCustomerCard() {
            if (customerCardTimer) clearTimeout(customerCardTimer);
        }

        function closeCustomerCard() {
            isCardPinned = false;
            currentCust = null;
            const card = document.getElementById('vizeGlobalCustomerCard');
            if (card) {
                card.style.display = 'none';
            }
        }

        function toggleCustomerPinned(triggerEl, custOrId) {
            if (customerCardTimer) clearTimeout(customerCardTimer);
            const custId = (typeof custOrId === 'object' && custOrId !== null) ? custOrId.id : custOrId;
            
            if (isCardPinned && currentCust && currentCust.id == custId) {
                closeCustomerCard();
            } else {
                isCardPinned = true;
                showCustomerCard(triggerEl, custId);
            }
        }

        function showCustomerCard(triggerEl, custOrId) {
            const cust = (typeof custOrId === 'object' && custOrId !== null)
                ? custOrId
                : ((typeof VIZE_CUSTOMERS !== 'undefined' && VIZE_CUSTOMERS[custOrId]) ? VIZE_CUSTOMERS[custOrId] : null);

            if (!cust) {
                console.error("Vize Customer data not found:", custOrId);
                return;
            }
            currentCust = cust;

            const card = ensureCardInBody();
            if (!card) return;

            const rect = triggerEl.getBoundingClientRect();
            const initials = (((cust.first_name || 'U')[0] || '') + ((cust.last_name || '')[0] || '')).toUpperCase() || 'U';
            const fullName = ((cust.first_name || '') + ' ' + (cust.last_name || '')).trim() || 'Valued Customer';
            const statusPill = cust.status 
                ? '<span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:#047857; background:#d1fae5; padding:2px 8px; border-radius:9999px;"><span style="width:6px; height:6px; border-radius:9999px; background:#10b981;"></span>Active</span>'
                : '<span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:#6b7280; background:#f3f4f6; padding:2px 8px; border-radius:9999px;">Inactive</span>';

            const roleBadge = cust.registered_role || cust.group_name || 'Speciality Polymer Partner';
            const tradeGroup = cust.group_name || 'General (Retail)';
            const company = cust.company_name || 'Individual / Studio';
            const gstin = cust.gstin ? `<span style="font-family:monospace; font-weight:600; color:#1e293b; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${cust.gstin}</span>` : '<span style="color:#94a3b8; font-style:italic;">B2C / Not Provided</span>';
            const phone = cust.phone || null;
            const extraPhone = cust.extra_phone || null;
            const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
            const regDate = cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

            // Top Pin Header bar
            const pinHeaderHtml = isCardPinned ? `
                <div style="background: #eff6ff; padding: 7px 12px; border-radius: 10px; font-size: 11px; font-weight: 700; color: #1d4ed8; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border: 1px solid #bfdbfe;">
                    <span style="display: flex; align-items: center; gap: 5px;">📌 <span>Dossier Pinned Open &bull; Click anywhere outside to close</span></span>
                    <button type="button" onclick="closeCustomerCard()" style="background: #dbeafe; border: none; font-weight: 800; color: #1e40af; border-radius: 6px; padding: 2px 7px; cursor: pointer; font-size: 11px;">✕ Close</button>
                </div>
            ` : `
                <div style="background: #f8fafc; padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 600; color: #64748b; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border: 1px solid #e2e8f0;">
                    <span style="display: flex; align-items: center; gap: 4px;">💡 <span>Click customer row to pin this dossier open</span></span>
                    <button type="button" onclick="closeCustomerCard()" style="background: transparent; border: none; font-weight: 700; color: #94a3b8; cursor: pointer; font-size: 12px;">✕</button>
                </div>
            `;

            // 1. Saved Addresses ("his addreses")
            let addressesHtml = '';
            const addrs = cust.saved_addresses || cust.addresses || [];
            if (addrs && addrs.length > 0) {
                const addrItems = addrs.map((a, i) => {
                    const tag = a.default_address ? '⭐ Default / Primary Site' : `📍 Delivery Site #${i + 1}`;
                    const parts = [a.address, a.city, a.state, a.postcode].filter(Boolean);
                    const sitePhone = a.phone && a.phone !== phone ? `<div style="font-size: 11px; color: #475569; margin-top: 3px; font-family: monospace;">📞 Site Phone: ${a.phone}</div>` : '';
                    return `
                        <div style="padding: 9px 12px; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                            <div style="font-size: 10px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.04em;">${tag}</div>
                            <div style="font-size: 12px; font-weight: 600; color: #1e293b; margin-top: 2px; line-height: 1.35;">${parts.join(', ')}</div>
                            ${sitePhone}
                        </div>
                    `;
                }).join('');

                addressesHtml = `
                    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                            🏡 Saved Addresses (${addrs.length})
                        </div>
                        <div style="background: #f8fafc; padding: 8px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            ${addrItems}
                        </div>
                    </div>
                `;
            } else {
                addressesHtml = `
                    <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">🏡 Saved Addresses</div>
                        <div style="font-size: 12px; color: #94a3b8; font-style: italic;">No saved addresses on file</div>
                    </div>
                `;
            }

            // 2. Orders History ("his orders")
            let ordersHtml = '';
            const ords = cust.customer_orders || [];
            if (ords && ords.length > 0) {
                const ordItems = ords.map(ord => {
                    const statusColor = ord.status === 'completed' ? '#059669' : (ord.status === 'processing' ? '#2563eb' : '#d97706');
                    const statusBg = ord.status === 'completed' ? '#ecfdf5' : (ord.status === 'processing' ? '#eff6ff' : '#fffbeb');
                    const ordDate = ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                    const items = (ord.items || []).map(it => `
                        <div style="font-size: 11px; color: #334155; margin-top: 2px;">
                            &bull; <strong>${it.qty_ordered || 1}x</strong> ${it.name} <span style="color:#64748b;">(₹${Number(it.total || 0).toLocaleString('en-IN')})</span>
                        </div>
                    `).join('');

                    return `
                        <div style="padding: 10px 12px; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 12px; font-weight: 800; color: #0f172a; font-family: monospace;">Order #${ord.increment_id || ord.id}</div>
                                <span style="font-size: 10px; font-weight: 700; color: ${statusColor}; background: ${statusBg}; padding: 2px 7px; border-radius: 6px; text-transform: capitalize;">${ord.status}</span>
                            </div>
                            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                                ${ordDate} &bull; <strong style="color: #047857;">₹${Number(ord.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                            </div>
                            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                                ${items || '<div style="font-size:11px; color:#94a3b8;">No item details</div>'}
                            </div>
                        </div>
                    `;
                }).join('');

                ordersHtml = `
                    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                            <span>📦 Order History (${ords.length})</span>
                            <span style="font-size: 11px; font-weight: 800; color: #059669;">Total: ₹${Number(cust.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style="background: #f8fafc; padding: 8px; border-radius: 12px; border: 1px solid #e2e8f0; max-height: 180px; overflow-y: auto;">
                            ${ordItems}
                        </div>
                    </div>
                `;
            } else {
                ordersHtml = `
                    <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">📦 Orders History</div>
                        <div style="font-size: 12px; color: #94a3b8; font-style: italic;">No orders placed yet &bull; Lifetime spend: ₹0.00</div>
                    </div>
                `;
            }

            // 3. Saved Cart Items ("his saved cards item etc")
            let cartHtml = '';
            const cartObj = cust.saved_cart;
            if (cartObj && cartObj.items && cartObj.items.length > 0) {
                const cartItemsList = cartObj.items.map(ci => `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding: 5px 0; border-bottom: 1px solid #fef3c7;">
                        <div style="font-weight: 600; color: #1e293b; max-width: 260px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                            ${ci.quantity || 1}x ${ci.name}
                        </div>
                        <div style="font-weight: 700; color: #b45309; font-family: monospace;">
                            ₹${Number(ci.total || ci.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                `).join('');

                cartHtml = `
                    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                            <span>🛒 Saved Cart Items (${cartObj.items.length})</span>
                            <span style="font-size: 11px; font-weight: 800; color: #b45309;">₹${Number(cartObj.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style="background: #fffbeb; padding: 8px 12px; border-radius: 12px; border: 1px solid #fef3c7;">
                            ${cartItemsList}
                        </div>
                    </div>
                `;
            } else {
                cartHtml = `
                    <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">🛒 Saved Cart Items</div>
                        <div style="font-size: 12px; color: #94a3b8; font-style: italic;">Cart is currently empty</div>
                    </div>
                `;
            }

            // 4. Extra numbers & Phone details ("his extra numbers")
            let phoneSectionHtml = `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 500;">Primary Phone:</span>
                    <span style="color: #1e293b; font-weight: 600; font-family: monospace;">
                        ${phone ? '📞 ' + phone : '<span style="color:#94a3b8; font-style:italic;">No phone provided</span>'}
                    </span>
                </div>
            `;

            if (extraPhone) {
                phoneSectionHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-top: 4px;">
                        <span style="color: #64748b; font-weight: 500;">Extra / Alternate Phone:</span>
                        <span style="color: #4338ca; font-weight: 700; font-family: monospace; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                            📱 ${extraPhone}
                        </span>
                    </div>
                `;
            }

            let notesHtml = '';
            if (cust.notes) {
                notesHtml = `
                    <div style="padding: 10px 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 10px;">
                        <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">📝 Internal Notes</div>
                        <div style="font-size: 12px; color: #334155; font-style: italic; line-height: 1.4;">"${cust.notes}"</div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="padding: 20px;">
                    ${pinHeaderHtml}

                    <!-- Top Bar with Avatar, Name, Status -->
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 800; font-size: 17px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(37,99,235,0.4); flex-shrink: 0;">
                                ${initials}
                            </div>
                            <div>
                                <div style="font-size: 16px; font-weight: 800; color: #0f172a; line-height: 1.2;">
                                    ${fullName}
                                </div>
                                <div style="font-size: 11px; color: #64748b; margin-top: 3px; font-family: monospace;">
                                    Customer ID: #${cust.id} &bull; Registered ${regDate}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                            ${statusPill}
                            <span style="font-size: 10px; color: #2563eb; font-weight: 600;">✓ Verified Member</span>
                        </div>
                    </div>

                    <!-- Trade & Company Profile -->
                    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                            <span style="color: #64748b; font-weight: 500;">Trade Tier & Discount:</span>
                            <span style="font-weight: 700; color: #059669; font-size: 12px;">
                                🏷️ ${tradeGroup}
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                            <span style="color: #64748b; font-weight: 500;">Registered Role:</span>
                            <span style="font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 2px 8px; border-radius: 6px; font-size: 11px; max-width: 220px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                ${roleBadge}
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                            <span style="color: #64748b; font-weight: 500;">Company / Studio:</span>
                            <span style="font-weight: 600; color: #1e293b; font-size: 12px; max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                🏢 ${company}
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                            <span style="color: #64748b; font-weight: 500;">GSTIN (B2B Tax Credit):</span>
                            <div>${gstin}</div>
                        </div>
                    </div>

                    <!-- Contact & Extra Phone Numbers -->
                    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                            <span style="color: #64748b; font-weight: 500;">Email Address:</span>
                            <a href="mailto:${cust.email}" style="color: #2563eb; font-weight: 600; font-family: monospace; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                                ✉️ ${cust.email}
                            </a>
                        </div>
                        ${phoneSectionHtml}
                        ${phone ? `
                        <a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(cust.first_name)},%20this%20is%20VIZE%20Specialty%20Polymers." target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 12px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 8px; font-weight: 700; font-size: 12px; text-decoration: none; margin-top: 4px; transition: background 0.15s;" onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='#ecfdf5'">
                            <span>💬 1-Click WhatsApp Direct</span>
                        </a>` : ''}
                    </div>

                    <!-- Saved Addresses ("his addreses") -->
                    ${addressesHtml}

                    <!-- Orders History ("his orders") -->
                    ${ordersHtml}

                    <!-- Saved Cart Items ("his saved cards item etc") -->
                    ${cartHtml}

                    ${notesHtml}

                    <!-- Bottom Actions -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
                        <button type="button" onclick="closeCustomerCard(); openEditCustomerModal(${cust.id})" style="flex: 1; padding: 8px 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 4px rgba(37,99,235,0.25);">
                            <span>✏️</span> Edit Customer
                        </button>
                        <a href="mailto:${cust.email}" style="padding: 8px 14px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 12px; text-decoration: none; cursor: pointer;">
                            ✉️ Email
                        </a>
                        <button type="button" onclick="closeCustomerCard()" style="padding: 8px 10px; background: transparent; color: #94a3b8; border: none; font-size: 13px; font-weight: 700; cursor: pointer;" title="Close dropdown">
                            ✕
                        </button>
                    </div>
                </div>
            `;

            // Calculate position
            card.style.position = 'fixed';
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';

            const cardWidth = 440;
            const cardHeight = card.offsetHeight || 500;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let left = rect.left;
            if (left + cardWidth > viewportWidth - 20) {
                left = Math.max(16, viewportWidth - cardWidth - 20);
            }
            if (left < 16) left = 16;

            let top = rect.bottom + 6;
            if (top + cardHeight > viewportHeight - 16) {
                if (rect.top - cardHeight - 6 > 16) {
                    top = rect.top - cardHeight - 6;
                } else {
                    top = Math.max(16, viewportHeight - cardHeight - 16);
                }
            }
            if (top < 10) top = 10;

            card.style.top = top + 'px';
            card.style.left = left + 'px';
        }

        // Close dropdown on outside click
        document.addEventListener('click', function(e) {
            const card = document.getElementById('vizeGlobalCustomerCard');
            if (!card || card.style.display === 'none') return;
            if (!card.contains(e.target) && !e.target.closest('.customer-row-trigger')) {
                closeCustomerCard();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCustomerCard();
                closeAddCustomerModal();
                closeEditCustomerModal();
                closeAddGroupModal();
            }
        });
    </script>

    <!-- Global Floating Customer Info Dropdown Card -->
    <div
        id="vizeGlobalCustomerCard"
        style="display: none; position: fixed; z-index: 9999999; width: 440px; max-width: 94vw; max-height: 85vh; overflow-y: auto; background: #ffffff; border-radius: 18px; box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; pointer-events: auto; font-family: inherit;"
        onmouseenter="keepCustomerCard()"
        onmouseleave="handleCustomerLeave()"
    ></div>
</x-admin::layouts>
