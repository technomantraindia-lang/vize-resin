<x-admin::layouts>
    <x-slot:title>
        Bento Showcase & Project Commissions - VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                Bento Showcase Studio
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage architectural bento case studies, panoramic spans, engineering parameters, and client commission leads.
            </p>
        </div>

        <button
            type="button"
            onclick="document.getElementById('addShowcaseModal').classList.remove('hidden')"
            class="primary-button flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
            <span class="text-lg font-bold">+</span> Add Showcase Project
        </button>
    </div>

    <!-- Quick Stats Cards (Minimalist Metric Layout) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-gray-500">Showcase Installations</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ count($projects) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-blue-600">Commission Leads</p>
            <p class="mt-2 text-2xl font-bold text-blue-600">{{ count($inquiries) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase text-emerald-600">Panoramic Feature Spans</p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">{{ collect($projects)->where('layout_span', 'col-span-2')->count() }}</p>
        </div>
    </div>

    <!-- Interactive Section Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-6 text-sm font-semibold">
        <button type="button" onclick="showTab('projects')" id="tab-btn-projects" class="pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2">
            Gallery Bento Projects ({{ count($projects) }})
        </button>
        <button type="button" onclick="showTab('inquiries')" id="tab-btn-inquiries" class="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2">
            Commission Inquiries & Leads ({{ count($inquiries) }})
        </button>
    </div>

    <!-- Tab 1: Bento Projects Grid/Table -->
    <div id="tab-projects" class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    <tr>
                        <th class="px-5 py-3.5">Image & Title</th>
                        <th class="px-5 py-3.5">Bento Layout Span</th>
                        <th class="px-5 py-3.5">Category & Sector</th>
                        <th class="px-5 py-3.5">Formulation Specs</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($projects as $proj)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 shrink-0">
                                        <img src="{{ $proj->image_url }}" alt="{{ $proj->title }}" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900 dark:text-white">{{ $proj->title }}</p>
                                        <p class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{{ $proj->description }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4">
                                @if($proj->layout_span == 'col-span-2')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                        Panoramic (2-Col Span)
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        Standard (1-Col)
                                    </span>
                                @endif
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                    {{ $proj->category_pill }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">{{ $proj->client_type }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ $proj->formulation }}</p>
                                <div class="flex gap-2 text-[10px] text-gray-500 mt-1">
                                    <span>{{ $proj->hardness }}</span> • <span>{{ $proj->pour_depth }}</span> • <span>{{ $proj->uv_stability }}</span>
                                </div>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.showcase.destroy', $proj->id) }}" method="POST" onsubmit="return confirm('Delete this showcase project?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-medium p-1 transition">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-5 py-12 text-center text-gray-400">
                                No showcase installations added yet. Click "+ Add Showcase Project" to add your first project.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Tab 2: Commission Inquiries -->
    <div id="tab-inquiries" class="hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    <tr>
                        <th class="px-5 py-3.5">Client & Contact</th>
                        <th class="px-5 py-3.5">Project Scope & Type</th>
                        <th class="px-5 py-3.5">Dimensions & Budget</th>
                        <th class="px-5 py-3.5">Status</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($inquiries as $inq)
                        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-900 dark:text-white">{{ $inq->client_name }}</p>
                                <p class="text-xs text-gray-500">{{ $inq->email }} • <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inq->phone) }}" target="_blank" class="text-emerald-600 font-mono hover:underline">{{ $inq->phone }} (WhatsApp ↗)</a></p>
                            </td>
                            <td class="px-5 py-4">
                                <span class="font-medium text-gray-800 dark:text-gray-200">{{ $inq->project_type ?? 'Bespoke River Table' }}</span>
                                <p class="text-xs text-gray-400 mt-0.5">{{ $inq->specifications }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <p class="text-xs font-mono text-gray-800 dark:text-gray-200">{{ $inq->estimated_dimensions ?? 'Custom size' }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">Budget: {{ $inq->budget_range ?? '₹1,00,000+' }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <form action="{{ route('admin.vize.showcase.inquiries.update_status', $inq->id) }}" method="POST" class="inline">
                                    @csrf
                                    <select
                                        name="status"
                                        onchange="this.form.submit()"
                                        class="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer
                                            {{ $inq->status == 'New' ? 'bg-sky-50 text-sky-700 border-sky-200' : '' }}
                                            {{ $inq->status == 'In Discussion' ? 'bg-amber-50 text-amber-700 border-amber-200' : '' }}
                                            {{ $inq->status == 'Quoted' ? 'bg-purple-50 text-purple-700 border-purple-200' : '' }}
                                            {{ $inq->status == 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '' }}"
                                    >
                                        <option value="New" {{ $inq->status == 'New' ? 'selected' : '' }}>New</option>
                                        <option value="In Discussion" {{ $inq->status == 'In Discussion' ? 'selected' : '' }}>In Discussion</option>
                                        <option value="Quoted" {{ $inq->status == 'Quoted' ? 'selected' : '' }}>Quoted</option>
                                        <option value="Closed" {{ $inq->status == 'Closed' ? 'selected' : '' }}>Closed</option>
                                    </select>
                                </form>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <form action="{{ route('admin.vize.showcase.inquiries.destroy', $inq->id) }}" method="POST" onsubmit="return confirm('Delete this inquiry?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-medium p-1 transition">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-5 py-12 text-center text-gray-400">
                                No commission inquiries received yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add Showcase Project Modal -->
    <div id="addShowcaseModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Add Bento Showcase Project</h3>
                <button type="button" onclick="document.getElementById('addShowcaseModal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form action="{{ route('admin.vize.showcase.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Project Title</label>
                    <input type="text" name="title" required placeholder="e.g. 14-ft Emerald Boardroom River Table" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Bento Span</label>
                        <select name="layout_span" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                            <option value="col-span-1">Standard (1 Column Card)</option>
                            <option value="col-span-2">Panoramic (2 Column Feature Span)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Sector / Type</label>
                        <select name="client_type" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                            <option value="Commercial">Commercial</option>
                            <option value="Residential">Residential</option>
                            <option value="Corporate Boardroom">Corporate Boardroom</option>
                            <option value="Hospitality & Bar">Hospitality & Bar</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Category Badge Pill</label>
                        <input type="text" name="category_pill" value="Live Edge River Table" required class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Sort Order</label>
                        <input type="number" name="sort_order" value="1" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">High-Res Image Path</label>
                    <input type="text" name="image_url" required placeholder="/our-work/emerald-boardroom.png" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Resin Formulation Used</label>
                    <input type="text" name="formulation" value="VIZE UltraCast 3:1 Deep Pour" class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div>
                        <label class="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Hardness</label>
                        <input type="text" name="hardness" value="85 Shore D" class="w-full px-2 py-1.5 text-xs rounded border border-gray-300">
                    </div>
                    <div>
                        <label class="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Pour Depth</label>
                        <input type="text" name="pour_depth" value="75 mm single pour" class="w-full px-2 py-1.5 text-xs rounded border border-gray-300">
                    </div>
                    <div>
                        <label class="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">UV Stability</label>
                        <input type="text" name="uv_stability" value="Class 1 UV Shield" class="w-full px-2 py-1.5 text-xs rounded border border-gray-300">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Engineering Description</label>
                    <textarea name="description" rows="2" placeholder="Describe the mold preparation, casting technique, and ceramic finishing..." class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"></textarea>
                </div>

                <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button type="button" onclick="document.getElementById('addShowcaseModal').classList.add('hidden')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Publish to Bento Gallery</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            document.getElementById('tab-projects').classList.toggle('hidden', tabName !== 'projects');
            document.getElementById('tab-inquiries').classList.toggle('hidden', tabName !== 'inquiries');

            const btnProjects = document.getElementById('tab-btn-projects');
            const btnInquiries = document.getElementById('tab-btn-inquiries');

            if (tabName === 'projects') {
                btnProjects.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold';
                btnInquiries.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold';
            } else {
                btnProjects.className = 'pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center gap-2 font-semibold';
                btnInquiries.className = 'pb-3 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 font-semibold';
            }
        }
    </script>
</x-admin::layouts>
