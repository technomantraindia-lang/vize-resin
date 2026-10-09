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
                        <th class="px-5 py-3.5">Customer Name & Email</th>
                        <th class="px-5 py-3.5">Phone & 1-Click WhatsApp</th>
                        <th class="px-5 py-3.5">Trade Group</th>
                        <th class="px-5 py-3.5">Orders & Spend</th>
                        <th class="px-5 py-3.5">Account Status</th>
                        <th class="px-5 py-3.5">Registered Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($customers as $cust)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4">
                                <div class="font-bold text-gray-900 dark:text-white">
                                    {{ $cust->first_name }} {{ $cust->last_name }}
                                </div>
                                <a href="mailto:{{ $cust->email }}" class="text-xs text-blue-600 hover:underline">
                                    ✉️ {{ $cust->email }}
                                </a>
                            </td>
                            <td class="px-5 py-4 text-xs font-mono">
                                @if ($cust->phone)
                                    <div>📞 {{ $cust->phone }}</div>
                                    <div class="mt-1">
                                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $cust->phone) }}" target="_blank" class="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            💬 WhatsApp
                                        </a>
                                    </div>
                                @else
                                    <span class="text-gray-400">No phone provided</span>
                                @endif
                            </td>
                            <td class="px-5 py-4">
                                <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    {{ $cust->group_name ?? 'General (Retail)' }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-xs">
                                <div class="font-semibold text-gray-900 dark:text-white">
                                    📦 {{ $cust->total_orders ?? 0 }} Orders
                                </div>
                                <div class="text-emerald-600 font-bold">
                                    ₹{{ number_format($cust->total_spent ?? 0, 2) }}
                                </div>
                            </td>
                            <td class="px-5 py-4">
                                <span class="text-xs font-bold px-2 py-1 rounded-full {{ $cust->status ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600' }}">
                                    {{ $cust->status ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-xs text-gray-500">
                                {{ date('M d, Y', strtotime($cust->created_at)) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onclick='openEditCustomerModal(@json($cust))'
                                        class="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md border border-blue-200 transition cursor-pointer"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <form action="{{ route('admin.vize.customers.destroy', $cust->id) }}" method="POST" onsubmit="return confirm('Delete customer {{ $cust->first_name }} {{ $cust->last_name }}?');" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer">
                                            🗑️
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-5 py-10 text-center text-gray-400">
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

        function openEditCustomerModal(cust) {
            const form = document.getElementById('editCustomerForm');
            form.action = "{{ url('admin/vize/customers') }}/" + cust.id;

            document.getElementById('edit_cust_first_name').value = cust.first_name || '';
            document.getElementById('edit_cust_last_name').value = cust.last_name || '';
            document.getElementById('edit_cust_email').value = cust.email || '';
            document.getElementById('edit_cust_phone').value = cust.phone || '';
            document.getElementById('edit_cust_group_id').value = cust.customer_group_id || 1;
            document.getElementById('edit_cust_status').value = cust.status ? '1' : '0';
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

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAddCustomerModal();
                closeEditCustomerModal();
                closeAddGroupModal();
            }
        });
    </script>
</x-admin::layouts>
