<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizeCustomerController extends Controller
{
    /**
     * Ensure customer helper tables and default groups exist.
     */
    protected function ensureTablesAndData()
    {
        try {
            // 1. Ensure general inquiries table exists
            if (!Schema::hasTable('vize_inquiries')) {
                Schema::create('vize_inquiries', function ($table) {
                    $table->id();
                    $table->string('name');
                    $table->string('email');
                    $table->string('phone')->nullable();
                    $table->string('service_type')->default('General Inquiry');
                    $table->text('message')->nullable();
                    $table->string('status')->default('New');
                    $table->timestamps();
                });
            }

            // 2. Ensure default customer groups exist if table exists
            if (Schema::hasTable('customer_groups')) {
                $defaultGroups = [
                    ['name' => 'General (Retail)', 'code' => 'general'],
                    ['name' => 'Contractor & Applicator (15% Trade)', 'code' => 'contractor'],
                    ['name' => 'Resin Artist & Woodworker (10% Trade)', 'code' => 'artist'],
                    ['name' => 'Architect & Interior Designer (15% Trade)', 'code' => 'architect'],
                    ['name' => 'Wholesale Distributor (25% Bulk)', 'code' => 'wholesale'],
                ];
                foreach ($defaultGroups as $group) {
                    if (!DB::table('customer_groups')->where('code', $group['code'])->exists()) {
                        DB::table('customer_groups')->insert([
                            'name'            => $group['name'],
                            'code'            => $group['code'],
                            'is_user_defined' => 1,
                            'created_at'      => now(),
                            'updated_at'      => now(),
                        ]);
                    }
                }
            }

            // 3. Ensure customers table helper columns exist
            if (Schema::hasTable('customers')) {
                if (!Schema::hasColumn('customers', 'company_name')) {
                    Schema::table('customers', function ($table) {
                        $table->string('company_name')->nullable()->after('last_name');
                    });
                }
                if (!Schema::hasColumn('customers', 'gstin')) {
                    Schema::table('customers', function ($table) {
                        $table->string('gstin', 50)->nullable()->after('company_name');
                    });
                }
                if (!Schema::hasColumn('customers', 'registered_role')) {
                    Schema::table('customers', function ($table) {
                        $table->string('registered_role', 100)->nullable()->after('gstin');
                    });
                }
                if (!Schema::hasColumn('customers', 'notes')) {
                    Schema::table('customers', function ($table) {
                        $table->text('notes')->nullable()->after('password');
                    });
                }
            }
        } catch (\Exception $e) {
            report($e);
        }
    }

    /**
     * Display unified Customer & Leads CRM Hub.
     */
    public function index()
    {
        $this->ensureTablesAndData();

        $customers = [];
        $workshopAdmissions = [];
        $tableInquiries = [];
        $generalInquiries = [];
        $reviews = [];
        $customerGroups = [];

        try {
            // 1. Registered Customers
            if (Schema::hasTable('customers')) {
                $query = DB::table('customers')
                    ->leftJoin('customer_groups', 'customers.customer_group_id', '=', 'customer_groups.id')
                    ->select(
                        'customers.*',
                        'customer_groups.name as group_name',
                        'customer_groups.code as group_code'
                    )
                    ->orderBy('customers.id', 'desc');

                $customers = $query->get();

                // Attach order statistics if orders table exists
                if (Schema::hasTable('orders')) {
                    $orderStats = DB::table('orders')
                        ->select(
                            'customer_id',
                            DB::raw('COUNT(id) as total_orders'),
                            DB::raw('SUM(grand_total) as total_spent')
                        )
                        ->groupBy('customer_id')
                        ->get()
                        ->keyBy('customer_id');

                    $customers->transform(function ($c) use ($orderStats) {
                        $stat = $orderStats->get($c->id);
                        $c->total_orders = $stat ? (int) $stat->total_orders : 0;
                        $c->total_spent = $stat ? (float) $stat->total_spent : 0.0;
                        return $c;
                    });
                }

                // Attach customer addresses if addresses table exists
                if (Schema::hasTable('addresses') && $customers->isNotEmpty()) {
                    $addresses = DB::table('addresses')
                        ->whereIn('customer_id', $customers->pluck('id'))
                        ->orderBy('default_address', 'desc')
                        ->get()
                        ->groupBy('customer_id');

                    $customers->transform(function ($c) use ($addresses) {
                        $custAddrs = $addresses->get($c->id, collect());
                        $c->addresses = $custAddrs;
                        $c->saved_addresses = $custAddrs;
                        $c->primary_address = $custAddrs->first();
                        return $c;
                    });
                }

                // Attach customer order history with items if orders table exists
                if (Schema::hasTable('orders') && $customers->isNotEmpty()) {
                    $customerOrders = DB::table('orders')
                        ->whereIn('customer_id', $customers->pluck('id'))
                        ->orderBy('id', 'desc')
                        ->get();

                    $orderIds = $customerOrders->pluck('id');
                    $orderItems = (Schema::hasTable('order_items') && $orderIds->isNotEmpty())
                        ? DB::table('order_items')->whereIn('order_id', $orderIds)->get()->groupBy('order_id')
                        : collect();

                    $customerOrders->transform(function ($ord) use ($orderItems) {
                        $ord->items = $orderItems->get($ord->id, collect());
                        return $ord;
                    });

                    $groupedOrders = $customerOrders->groupBy('customer_id');

                    $customers->transform(function ($c) use ($groupedOrders) {
                        $c->customer_orders = $groupedOrders->get($c->id, collect());
                        return $c;
                    });
                }

                // Attach active saved cart items if cart table exists
                if (Schema::hasTable('cart') && $customers->isNotEmpty()) {
                    $activeCarts = DB::table('cart')
                        ->whereIn('customer_id', $customers->pluck('id'))
                        ->where('is_active', 1)
                        ->get();

                    $cartIds = $activeCarts->pluck('id');
                    $cartItems = (Schema::hasTable('cart_items') && $cartIds->isNotEmpty())
                        ? DB::table('cart_items')->whereIn('cart_id', $cartIds)->get()->groupBy('cart_id')
                        : collect();

                    $activeCarts->transform(function ($crt) use ($cartItems) {
                        $crt->items = $cartItems->get($crt->id, collect());
                        return $crt;
                    });

                    $groupedCarts = $activeCarts->keyBy('customer_id');

                    $customers->transform(function ($c) use ($groupedCarts) {
                        $c->saved_cart = $groupedCarts->get($c->id, null);
                        return $c;
                    });
                }
            }

            // 2. Workshop Registrations & Leads
            if (Schema::hasTable('vize_workshop_admissions')) {
                $workshopAdmissions = DB::table('vize_workshop_admissions')
                    ->leftJoin('vize_workshop_batches', 'vize_workshop_admissions.batch_id', '=', 'vize_workshop_batches.id')
                    ->leftJoin('vize_courses', 'vize_workshop_batches.workshop_id', '=', 'vize_courses.id')
                    ->select(
                        'vize_workshop_admissions.*',
                        'vize_workshop_batches.city as batch_city',
                        'vize_workshop_batches.start_date as batch_date',
                        'vize_courses.name as course_title'
                    )
                    ->orderBy('vize_workshop_admissions.id', 'desc')
                    ->get();
            }

            // 3. Custom Table Top Studio Inquiries
            if (Schema::hasTable('vize_table_inquiries')) {
                $tableInquiries = DB::table('vize_table_inquiries')
                    ->leftJoin('vize_table_tops', 'vize_table_inquiries.table_id', '=', 'vize_table_tops.id')
                    ->select(
                        'vize_table_inquiries.*',
                        'vize_table_tops.name as table_model_name'
                    )
                    ->orderBy('vize_table_inquiries.id', 'desc')
                    ->get();
            }

            // 4. General Site Contact Inquiries
            if (Schema::hasTable('vize_inquiries')) {
                $generalInquiries = DB::table('vize_inquiries')
                    ->orderBy('id', 'desc')
                    ->get();
            }

            // 5. Product Ratings & Reviews
            if (Schema::hasTable('product_reviews')) {
                $reviews = DB::table('product_reviews')
                    ->orderBy('id', 'desc')
                    ->get();
            }

            // 6. Customer Groups
            if (Schema::hasTable('customer_groups')) {
                $customerGroups = DB::table('customer_groups')
                    ->orderBy('id', 'asc')
                    ->get();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return view('admin::vize.customers.index', compact(
            'customers',
            'workshopAdmissions',
            'tableInquiries',
            'generalInquiries',
            'reviews',
            'customerGroups'
        ));
    }

    /**
     * Store a newly created Customer.
     */
    public function storeCustomer(Request $request)
    {
        $this->ensureTablesAndData();

        $request->validate([
            'first_name' => 'required|string|max:100',
            'email'      => 'required|email|max:150|unique:customers,email',
            'phone'      => 'nullable|string|max:30',
        ]);

        try {
            $groupId = $request->input('customer_group_id') ?: (DB::table('customer_groups')->value('id') ?? 1);
            $password = $request->input('password') ? Hash::make($request->input('password')) : Hash::make('vize@123456');

            DB::table('customers')->insert([
                'first_name'        => $request->input('first_name'),
                'last_name'         => $request->input('last_name') ?: '',
                'company_name'      => $request->input('company_name') ?: null,
                'gstin'             => $request->input('gstin') ?: null,
                'registered_role'   => $request->input('registered_role') ?: null,
                'email'             => $request->input('email'),
                'phone'             => $request->input('phone') ?: null,
                'extra_phone'       => $request->input('extra_phone') ?: null,
                'customer_group_id' => $groupId,
                'status'            => (int) $request->input('status', 1),
                'is_verified'       => 1,
                'password'          => $password,
                'notes'             => $request->input('notes') ?: null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            session()->flash('success', 'Customer account created successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to create customer: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Update an existing Customer.
     */
    public function updateCustomer(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'email'      => 'required|email|max:150|unique:customers,email,' . $id,
        ]);

        try {
            $data = [
                'first_name'        => $request->input('first_name'),
                'last_name'         => $request->input('last_name') ?: '',
                'company_name'      => $request->input('company_name') ?: null,
                'gstin'             => $request->input('gstin') ?: null,
                'registered_role'   => $request->input('registered_role') ?: null,
                'email'             => $request->input('email'),
                'phone'             => $request->input('phone') ?: null,
                'extra_phone'       => $request->input('extra_phone') ?: null,
                'customer_group_id' => $request->input('customer_group_id'),
                'status'            => (int) $request->input('status', 1),
                'updated_at'        => now(),
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->input('password'));
            }

            if (Schema::hasColumn('customers', 'notes')) {
                $data['notes'] = $request->input('notes') ?: null;
            }

            DB::table('customers')->where('id', $id)->update($data);
            session()->flash('success', 'Customer details updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Delete a Customer record.
     */
    public function destroyCustomer($id)
    {
        try {
            DB::table('customers')->where('id', $id)->delete();
            session()->flash('success', 'Customer record deleted.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Store Customer Group.
     */
    public function storeGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:50|unique:customer_groups,code',
        ]);

        try {
            DB::table('customer_groups')->insert([
                'name'       => $request->input('name'),
                'code'       => Str::slug($request->input('code')),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            session()->flash('success', 'Customer group added.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to add group: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Delete Customer Group.
     */
    public function destroyGroup($id)
    {
        try {
            DB::table('customer_groups')->where('id', $id)->delete();
            session()->flash('success', 'Customer group removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Update Product Review status.
     */
    public function updateReviewStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        try {
            DB::table('product_reviews')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);

            session()->flash('success', 'Review status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Delete Product Review.
     */
    public function destroyReview($id)
    {
        try {
            DB::table('product_reviews')->where('id', $id)->delete();
            session()->flash('success', 'Review removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Update General Inquiry status.
     */
    public function updateInquiryStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        try {
            DB::table('vize_inquiries')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);

            session()->flash('success', 'Inquiry status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Delete General Inquiry.
     */
    public function destroyInquiry($id)
    {
        try {
            DB::table('vize_inquiries')->where('id', $id)->delete();
            session()->flash('success', 'Inquiry record deleted.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.customers.index');
    }

    /**
     * Export all Customers to CSV.
     */
    public function exportCustomers()
    {
        $customers = DB::table('customers')
            ->leftJoin('customer_groups', 'customers.customer_group_id', '=', 'customer_groups.id')
            ->select(
                'customers.id',
                'customers.first_name',
                'customers.last_name',
                'customers.email',
                'customers.phone',
                'customer_groups.name as group_name',
                'customers.status',
                'customers.created_at'
            )
            ->get();

        $csvHeader = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Customer Group', 'Status', 'Registered Date'];

        $callback = function () use ($customers, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($customers as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->first_name,
                    $row->last_name,
                    $row->email,
                    $row->phone,
                    $row->group_name ?? 'General',
                    $row->status ? 'Active' : 'Inactive',
                    $row->created_at
                ]);
            }
            fclose($file);
        };

        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=vize_customers_' . date('Y_m_d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        return response()->stream($callback, 200, $headers);
    }
}
