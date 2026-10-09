<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VizeShowcaseController extends Controller
{
    public function index()
    {
        $projects = [];
        $inquiries = [];

        try {
            if (DB::getSchemaBuilder()->hasTable('vize_showcase')) {
                $projects = DB::table('vize_showcase')->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();
            }
            if (DB::getSchemaBuilder()->hasTable('vize_showcase_inquiries')) {
                $inquiries = DB::table('vize_showcase_inquiries')->orderBy('id', 'desc')->get();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return view('admin::vize.showcase.index', compact('projects', 'inquiries'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'client_type' => 'required|string|max:100',
            'image_url'   => 'required|string|max:255',
        ]);

        try {
            DB::table('vize_showcase')->insert([
                'title'         => $request->input('title'),
                'slug'          => Str::slug($request->input('title')) . '-' . rand(100, 999),
                'client_type'   => $request->input('client_type'),
                'layout_span'   => $request->input('layout_span', 'col-span-1'),
                'category_pill' => $request->input('category_pill', 'Live Edge River Table'),
                'image_url'     => $request->input('image_url'),
                'formulation'   => $request->input('formulation', 'VIZE UltraCast 3:1 Deep Pour'),
                'hardness'      => $request->input('hardness', '85 Shore D'),
                'pour_depth'    => $request->input('pour_depth', '75 mm single pour'),
                'uv_stability'  => $request->input('uv_stability', 'Class 1 UV Shield'),
                'description'   => $request->input('description'),
                'sort_order'    => (int) $request->input('sort_order', 1),
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            session()->flash('success', 'Bento showcase project added successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save showcase project: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.showcase.index');
    }

    public function updateInquiryStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        try {
            DB::table('vize_showcase_inquiries')->where('id', $id)->update([
                'status'     => $request->input('status'),
                'updated_at' => now(),
            ]);
            session()->flash('success', 'Commission lead status updated.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.showcase.index');
    }

    public function destroyInquiry($id)
    {
        try {
            DB::table('vize_showcase_inquiries')->where('id', $id)->delete();
            session()->flash('success', 'Commission inquiry removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.showcase.index');
    }

    public function destroy($id)
    {
        try {
            DB::table('vize_showcase')->where('id', $id)->delete();
            session()->flash('success', 'Showcase project removed.');
        } catch (\Exception $e) {
            session()->flash('error', 'Delete failed.');
        }

        return redirect()->route('admin.vize.showcase.index');
    }
}
