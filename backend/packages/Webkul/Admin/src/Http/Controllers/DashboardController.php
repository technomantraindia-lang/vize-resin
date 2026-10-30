<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Webkul\Admin\Helpers\Dashboard;

class DashboardController extends Controller
{
    /**
     * Request param functions
     *
     * @var array
     */
    protected $typeFunctions = [
        'over-all' => 'getOverAllStats',
        'today' => 'getTodayStats',
        'stock-threshold-products' => 'getStockThresholdProducts',
        'total-sales' => 'getSalesStats',
        'top-selling-products' => 'getTopSellingProducts',
        'top-customers' => 'getTopCustomers',
    ];

    /**
     * Create a controller instance.
     *
     * @return void
     */
    public function __construct(protected Dashboard $dashboardHelper) {}

    /**
     * Dashboard page.
     *
     * @return View|JsonResponse
     */
    public function index()
    {
        // 1. Core VIZE Metrics
        $vizeStats = [
            'resins_count'       => Schema::hasTable('vize_resins') ? DB::table('vize_resins')->count() : 0,
            'resins_in_stock'    => Schema::hasTable('vize_resins') ? DB::table('vize_resins')->where('in_stock', 1)->count() : 0,
            'shades_count'       => Schema::hasTable('vize_pigment_shades') ? DB::table('vize_pigment_shades')->count() : 0,
            'categories_count'   => Schema::hasTable('vize_pigment_categories') ? DB::table('vize_pigment_categories')->count() : 0,
            'tables_count'       => Schema::hasTable('vize_table_tops') ? DB::table('vize_table_tops')->count() : 0,
            'tables_ready'       => Schema::hasTable('vize_table_tops') ? DB::table('vize_table_tops')->where('status', 'Ready to Ship')->count() : 0,
            'tables_custom'      => Schema::hasTable('vize_table_tops') ? DB::table('vize_table_tops')->where('status', 'Made to Order')->count() : 0,
            'batches_count'      => Schema::hasTable('vize_workshop_batches') ? DB::table('vize_workshop_batches')->count() : 0,
            'admissions_count'   => Schema::hasTable('vize_workshop_admissions') ? DB::table('vize_workshop_admissions')->count() : 0,
            'offers_count'       => Schema::hasTable('vize_offers') ? DB::table('vize_offers')->where('is_active', 1)->count() : 0,
            'videos_count'       => Schema::hasTable('vize_videos') ? DB::table('vize_videos')->where('is_active', 1)->count() : 0,
            'total_leads_count'  => 0,
        ];

        // 2. Aggregate Recent High-Value Leads & Inquiries
        $recentLeads = collect();

        // Custom Table Design Inquiries
        if (Schema::hasTable('vize_table_inquiries')) {
            $tableLeads = DB::table('vize_table_inquiries')
                ->orderBy('created_at', 'desc')
                ->limit(6)
                ->get()
                ->map(function ($item) {
                    return (object)[
                        'type'        => 'Custom Table Quote',
                        'type_color'  => '#d97706',
                        'type_bg'     => '#fef3c7',
                        'name'        => $item->customer_name,
                        'phone'       => $item->phone,
                        'email'       => $item->email,
                        'details'     => trim(($item->requested_dimensions ? 'Size: ' . $item->requested_dimensions . ' · ' : '') . ($item->wood_preference ? 'Wood: ' . $item->wood_preference : '')),
                        'status'      => $item->status ?? 'New',
                        'created_at'  => $item->created_at,
                    ];
                });
            $recentLeads = $recentLeads->merge($tableLeads);
            $vizeStats['total_leads_count'] += DB::table('vize_table_inquiries')->count();
        }

        // Workshop Admissions & Student Inquiries
        if (Schema::hasTable('vize_workshop_admissions')) {
            $workshopLeads = DB::table('vize_workshop_admissions')
                ->orderBy('created_at', 'desc')
                ->limit(6)
                ->get()
                ->map(function ($item) {
                    return (object)[
                        'type'        => 'Academy Masterclass',
                        'type_color'  => '#2563eb',
                        'type_bg'     => '#dbeafe',
                        'name'        => $item->student_name,
                        'phone'       => $item->phone ?? $item->whatsapp,
                        'email'       => $item->email,
                        'details'     => 'Paid: ₹' . number_format($item->amount_paid, 0) . ' (' . ($item->payment_status ?? 'Pending') . ')',
                        'status'      => $item->payment_status ?? 'Pending',
                        'created_at'  => $item->created_at,
                    ];
                });
            $recentLeads = $recentLeads->merge($workshopLeads);
            $vizeStats['total_leads_count'] += DB::table('vize_workshop_admissions')->count();
        }

        // Showcase / Commercial Project Inquiries
        if (Schema::hasTable('vize_showcase_inquiries')) {
            $showcaseLeads = DB::table('vize_showcase_inquiries')
                ->orderBy('created_at', 'desc')
                ->limit(6)
                ->get()
                ->map(function ($item) {
                    return (object)[
                        'type'        => 'Commercial Project',
                        'type_color'  => '#059669',
                        'type_bg'     => '#d1fae5',
                        'name'        => $item->client_name,
                        'phone'       => $item->phone,
                        'email'       => $item->email,
                        'details'     => trim(($item->project_type ? 'Type: ' . $item->project_type . ' · ' : '') . ($item->budget_range ? 'Budget: ' . $item->budget_range : '')),
                        'status'      => $item->status ?? 'New',
                        'created_at'  => $item->created_at,
                    ];
                });
            $recentLeads = $recentLeads->merge($showcaseLeads);
            $vizeStats['total_leads_count'] += DB::table('vize_showcase_inquiries')->count();
        }

        // Contact Us & General Consultation Inquiries
        if (Schema::hasTable('vize_inquiries')) {
            $contactLeads = DB::table('vize_inquiries')
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get()
                ->map(function ($item) {
                    $detailsParts = [];
                    if (!empty($item->service_type)) {
                        $detailsParts[] = $item->service_type;
                    }
                    if (!empty($item->message)) {
                        $detailsParts[] = \Illuminate\Support\Str::limit($item->message, 80);
                    }
                    return (object)[
                        'type'        => 'Contact Us Form',
                        'type_color'  => '#7c3aed',
                        'type_bg'     => '#f3e8ff',
                        'name'        => $item->name,
                        'phone'       => $item->phone,
                        'email'       => $item->email,
                        'details'     => implode(' · ', $detailsParts) ?: 'General website consultation request',
                        'status'      => $item->status ?? 'New',
                        'created_at'  => $item->created_at,
                    ];
                });
            $recentLeads = $recentLeads->merge($contactLeads);
            $vizeStats['total_leads_count'] += DB::table('vize_inquiries')->count();
        }

        $recentLeads = $recentLeads->sortByDesc('created_at')->take(10)->values();

        // 3. Upcoming Workshop Batches with Seat Capacity
        $upcomingBatches = collect();
        if (Schema::hasTable('vize_workshop_batches')) {
            $upcomingBatches = DB::table('vize_workshop_batches')
                ->orderBy('start_date', 'asc')
                ->limit(4)
                ->get();
        }

        // 4. Recent Resin Products Catalog Snapshot
        $recentResins = collect();
        if (Schema::hasTable('vize_resins')) {
            $recentResins = DB::table('vize_resins')
                ->orderBy('id', 'desc')
                ->limit(6)
                ->get();
        }

        return view('admin::dashboard.index')->with([
            'startDate'       => $this->dashboardHelper->getStartDate(),
            'endDate'         => $this->dashboardHelper->getEndDate(),
            'vizeStats'       => $vizeStats,
            'recentLeads'     => $recentLeads,
            'upcomingBatches' => $upcomingBatches,
            'recentResins'    => $recentResins,
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function stats()
    {
        $stats = $this->dashboardHelper->{$this->resolveTypeFunction()}();

        return response()->json([
            'statistics' => $stats,
            'date_range' => $this->dashboardHelper->getDateRange(),
        ]);
    }

    /**
     * Resolve the requested type into a valid function name.
     *
     * @return string
     */
    protected function resolveTypeFunction()
    {
        $type = request()->query('type');

        if (
            ! is_string($type)
            || ! array_key_exists($type, $this->typeFunctions)
        ) {
            abort(404);
        }

        return $this->typeFunctions[$type];
    }
}
