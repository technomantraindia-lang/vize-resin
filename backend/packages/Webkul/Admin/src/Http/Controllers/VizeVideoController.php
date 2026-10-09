<?php

namespace Webkul\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VizeVideoController extends Controller
{
    /**
     * Ensure database table exists with full schema and default initial seed data.
     */
    protected function ensureTablesAndData()
    {
        try {
            if (!Schema::hasTable('vize_videos')) {
                Schema::create('vize_videos', function ($table) {
                    $table->id();
                    $table->string('title');
                    $table->string('category')->default('Flooring');
                    $table->string('platform')->default('instagram'); // instagram, youtube, facebook, vimeo, mp4
                    $table->text('url');
                    $table->text('embed_url')->nullable();
                    $table->string('handle')->nullable();
                    $table->string('badge')->nullable();
                    $table->string('thumbnail')->nullable();
                    $table->integer('sort_order')->default(0);
                    $table->boolean('is_active')->default(true);
                    $table->timestamps();
                });
            } else {
                // Ensure all new columns exist on existing table
                if (!Schema::hasColumn('vize_videos', 'category')) {
                    Schema::table('vize_videos', function ($table) {
                        $table->string('category')->default('Flooring')->after('title');
                    });
                }
                if (!Schema::hasColumn('vize_videos', 'embed_url')) {
                    Schema::table('vize_videos', function ($table) {
                        $table->text('embed_url')->nullable()->after('url');
                    });
                }
                if (!Schema::hasColumn('vize_videos', 'handle')) {
                    Schema::table('vize_videos', function ($table) {
                        $table->string('handle')->nullable()->after('platform');
                    });
                }
                if (!Schema::hasColumn('vize_videos', 'badge')) {
                    Schema::table('vize_videos', function ($table) {
                        $table->string('badge')->nullable()->after('handle');
                    });
                }
            }

            // Seed default videos and social reels if table is empty
            if (DB::table('vize_videos')->count() === 0) {
                $initialReels = [
                    [
                        'title'      => 'Metallic Gold & Ocean Teal Floor Pour',
                        'category'   => 'Flooring',
                        'platform'   => 'instagram',
                        'handle'     => '@vizeresin',
                        'badge'      => 'Trending Pour',
                        'url'        => 'https://www.instagram.com/reel/DcGpYzNSQvu/?igsi=NHd0ZTh0ZmFmanBn',
                        'embed_url'  => 'https://www.instagram.com/reel/DcGpYzNSQvu/embed/',
                        'thumbnail'  => '/process-pour.jpg',
                        'sort_order' => 1,
                        'is_active'  => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'title'      => 'Deep Casting Olive Wood River Table',
                        'category'   => 'Casting & Art',
                        'platform'   => 'instagram',
                        'handle'     => '@vizeresin',
                        'badge'      => 'Masterclass',
                        'url'        => 'https://www.instagram.com/reel/DaSM54WxHEp/?igsi=MTRoMHFpMmZ4czA2Ng==',
                        'embed_url'  => 'https://www.instagram.com/reel/DaSM54WxHEp/embed/',
                        'thumbnail'  => '/process-trowel.jpg',
                        'sort_order' => 2,
                        'is_active'  => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'title'      => 'Flawless High-Gloss Surface Topcoat',
                        'category'   => 'Protective Coatings',
                        'platform'   => 'facebook',
                        'handle'     => 'Vize Resins Pro',
                        'badge'      => 'Pro Technique',
                        'url'        => 'https://www.facebook.com/share/r/1CKSp9sd4G/?mibextid=wwXIfr',
                        'embed_url'  => 'https://www.facebook.com/plugins/video.php?href=' . urlencode('https://www.facebook.com/share/r/1CKSp9sd4G/') . '&show_text=0&width=380',
                        'thumbnail'  => '/reel-1-thumb.jpg',
                        'sort_order' => 3,
                        'is_active'  => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ];

                foreach ($initialReels as $reel) {
                    DB::table('vize_videos')->insert($reel);
                }

                $this->syncToFrontendJson();
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Smart URL parser: auto-detects platform and generates iframe embed URLs & fallback thumbnails.
     */
    public static function parseVideoDetails($url, $userPlatform = null, $userThumbnail = null)
    {
        $url = trim($url);
        $platform = $userPlatform ? strtolower($userPlatform) : 'mp4';
        $embedUrl = $url;
        $thumbnail = $userThumbnail;

        // 1. Instagram Reel or Post
        if (preg_match('/instagram\.com\/(?:p|reel|tv|share\/r)\/([A-Za-z0-9_-]+)/i', $url, $m)) {
            $code = $m[1];
            $platform = 'instagram';
            $embedUrl = "https://www.instagram.com/reel/{$code}/embed/";
            if (empty($thumbnail)) {
                $thumbnail = '/process-pour.jpg';
            }
        }
        // 2. YouTube Video or Shorts
        elseif (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i', $url, $m)) {
            $ytId = $m[1];
            $platform = 'youtube';
            $embedUrl = "https://www.youtube.com/embed/{$ytId}?autoplay=0&rel=0";
            if (empty($thumbnail)) {
                $thumbnail = "https://img.youtube.com/vi/{$ytId}/hqdefault.jpg";
            }
        }
        // 3. Facebook Reel or Video
        elseif (preg_match('/facebook\.com\/(?:share\/r\/|watch\/\?v=|.*\/videos\/)/i', $url)) {
            $platform = 'facebook';
            // Clean up tracking params for cleaner embed URL
            $cleanUrl = strtok($url, '?');
            $embedUrl = "https://www.facebook.com/plugins/video.php?href=" . urlencode($cleanUrl) . "&show_text=0&width=380";
            if (empty($thumbnail)) {
                $thumbnail = '/reel-1-thumb.jpg';
            }
        }
        // 4. Vimeo
        elseif (preg_match('/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i', $url, $m)) {
            $vimeoId = end($m);
            $platform = 'vimeo';
            $embedUrl = "https://player.vimeo.com/video/{$vimeoId}";
            if (empty($thumbnail)) {
                $thumbnail = '/process-pour.jpg';
            }
        }
        // 5. Direct MP4 / WebM
        else {
            if ($userPlatform) {
                $platform = strtolower($userPlatform);
            } else {
                $platform = 'mp4';
            }
            $embedUrl = $url;
            if (empty($thumbnail)) {
                $thumbnail = '/hero-video-thumb.jpg';
            }
        }

        return [
            'platform'  => $platform,
            'embed_url' => $embedUrl,
            'thumbnail' => $thumbnail,
        ];
    }

    /**
     * Sync active videos to frontend JSON file for high-speed static rendering fallback.
     */
    protected function syncToFrontendJson()
    {
        try {
            $videos = DB::table('vize_videos')
                ->where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'desc')
                ->get();

            $output = $videos->map(function ($v) {
                return [
                    'id'        => 'reel-' . $v->id,
                    'db_id'     => $v->id,
                    'title'     => $v->title,
                    'category'  => $v->category ?? 'Flooring',
                    'platform'  => ucfirst($v->platform),
                    'handle'    => $v->handle ?? '@vizeresin',
                    'badge'     => $v->badge ?? 'Featured',
                    'url'       => $v->url,
                    'embedUrl'  => $v->embed_url ?? $v->url,
                    'thumbnail' => $v->thumbnail ?? '/process-pour.jpg',
                    'sort_order'=> $v->sort_order,
                ];
            })->values()->all();

            $jsonPath = base_path('../src/data/videos.json');
            File::put($jsonPath, json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Display Video & Reels Hub dashboard.
     */
    public function index(Request $request)
    {
        $this->ensureTablesAndData();

        $selectedCategory = $request->query('category', 'all');
        $query = DB::table('vize_videos');

        if ($selectedCategory !== 'all') {
            $query->where('category', $selectedCategory);
        }

        $videos = $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        $categories = [
            'All Videos',
            'Flooring',
            'Casting & Art',
            'Protective Coatings',
            'Workshop Masterclass',
            'General Showcase',
        ];

        return view('admin::vize.videos.index', compact('videos', 'categories', 'selectedCategory'));
    }

    /**
     * Store new video or reel from social link or direct upload.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'url'      => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'platform' => 'nullable|string|max:50',
            'badge'    => 'nullable|string|max:100',
            'handle'   => 'nullable|string|max:100',
        ]);

        $url = $request->input('url', '');
        $thumbnail = $request->input('thumbnail');

        // Handle MP4 / video file upload if provided
        if ($request->hasFile('video_file')) {
            $videoFile = $request->file('video_file');
            $fileName = time() . '_' . Str::slug($request->input('title')) . '.' . $videoFile->getClientOriginalExtension();
            $targetDir = base_path('../public/videos/uploads');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $videoFile->move($targetDir, $fileName);
            $url = '/videos/uploads/' . $fileName;
        }

        // Handle thumbnail image upload if provided
        if ($request->hasFile('thumbnail_file')) {
            $thumbFile = $request->file('thumbnail_file');
            $thumbName = time() . '_thumb_' . Str::slug($request->input('title')) . '.' . $thumbFile->getClientOriginalExtension();
            $targetDir = base_path('../public/videos/thumbnails');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $thumbFile->move($targetDir, $thumbName);
            $thumbnail = '/videos/thumbnails/' . $thumbName;
        }

        if (empty($url)) {
            session()->flash('error', 'Please provide a Video URL link or upload a video file.');
            return redirect()->back()->withInput();
        }

        $parsed = self::parseVideoDetails($url, $request->input('platform'), $thumbnail);

        try {
            DB::table('vize_videos')->insert([
                'title'      => $request->input('title'),
                'category'   => $request->input('category', 'Flooring'),
                'platform'   => $parsed['platform'],
                'url'        => $url,
                'embed_url'  => $parsed['embed_url'],
                'handle'     => $request->input('handle', '@vizeresin'),
                'badge'      => $request->input('badge', 'Featured Pour'),
                'thumbnail'  => $parsed['thumbnail'],
                'sort_order' => $request->input('sort_order', DB::table('vize_videos')->max('sort_order') + 1),
                'is_active'  => $request->has('is_active') ? true : ($request->input('is_active', 1) ? true : false),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->syncToFrontendJson();
            session()->flash('success', 'Video / Reel added to storefront showcase successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to save video: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.videos.index');
    }

    /**
     * Update video or reel details.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url'   => 'required|string',
        ]);

        $url = $request->input('url');
        $thumbnail = $request->input('thumbnail');

        if ($request->hasFile('thumbnail_file')) {
            $thumbFile = $request->file('thumbnail_file');
            $thumbName = time() . '_thumb_' . Str::slug($request->input('title')) . '.' . $thumbFile->getClientOriginalExtension();
            $targetDir = base_path('../public/videos/thumbnails');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }
            $thumbFile->move($targetDir, $thumbName);
            $thumbnail = '/videos/thumbnails/' . $thumbName;
        }

        $parsed = self::parseVideoDetails($url, $request->input('platform'), $thumbnail);

        try {
            $updateData = [
                'title'      => $request->input('title'),
                'category'   => $request->input('category', 'Flooring'),
                'platform'   => $parsed['platform'],
                'url'        => $url,
                'embed_url'  => $parsed['embed_url'],
                'handle'     => $request->input('handle', '@vizeresin'),
                'badge'      => $request->input('badge', 'Featured Pour'),
                'sort_order' => $request->input('sort_order', 0),
                'is_active'  => $request->has('is_active') ? true : ($request->input('is_active', 0) ? true : false),
                'updated_at' => now(),
            ];

            if (!empty($parsed['thumbnail'])) {
                $updateData['thumbnail'] = $parsed['thumbnail'];
            }

            DB::table('vize_videos')->where('id', $id)->update($updateData);

            $this->syncToFrontendJson();
            session()->flash('success', 'Video reel updated successfully.');
        } catch (\Exception $e) {
            session()->flash('error', 'Update failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.videos.index');
    }

    /**
     * Quick status toggle.
     */
    public function toggleStatus(Request $request, $id)
    {
        try {
            $video = DB::table('vize_videos')->where('id', $id)->first();
            if ($video) {
                $newStatus = $request->has('is_active') ? $request->boolean('is_active') : !$video->is_active;
                DB::table('vize_videos')->where('id', $id)->update([
                    'is_active'  => $newStatus,
                    'updated_at' => now(),
                ]);
                $this->syncToFrontendJson();
                session()->flash('success', 'Status updated.');
            }
        } catch (\Exception $e) {
            session()->flash('error', 'Status update failed.');
        }

        return redirect()->route('admin.vize.videos.index');
    }

    /**
     * Remove video from database and sync to frontend.
     */
    public function destroy($id)
    {
        try {
            DB::table('vize_videos')->where('id', $id)->delete();
            $this->syncToFrontendJson();
            session()->flash('success', 'Video removed successfully from showcase.');
        } catch (\Exception $e) {
            session()->flash('error', 'Error deleting video: ' . $e->getMessage());
        }

        return redirect()->route('admin.vize.videos.index');
    }
}
