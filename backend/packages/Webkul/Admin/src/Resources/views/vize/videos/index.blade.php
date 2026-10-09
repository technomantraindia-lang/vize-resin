<x-admin::layouts>
    <x-slot:title>
        Video &amp; Reels Hub — VIZE Specialty Polymers
    </x-slot>

    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4 mb-6 max-sm:flex-wrap" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white" style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">
                Video &amp; Reels Hub
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1" style="font-size: 0.875rem; color: #4b5563; margin-top: 0.25rem;">
                Manage homepage reels, Instagram videos, YouTube showcases, and MP4 masterclasses by direct links.
            </p>
        </div>

        <div class="flex items-center gap-3">
            <button
                type="button"
                onclick="openAddVideoModal()"
                class="primary-button cursor-pointer font-bold text-sm rounded-lg shadow-sm transition"
                style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 0.6rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.12);"
            >
                <span style="font-size: 1.1rem; font-weight: bold;">+</span> Add Video / Reel
            </button>
        </div>
    </div>

    <!-- Quick Stats Cards (Forced 4-column Grid) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #6b7280; margin: 0;">Total Videos &amp; Reels</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #111827; margin: 0.5rem 0 0 0;">{{ count($videos) }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #059669; margin: 0;">Active on Storefront</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #059669; margin: 0.5rem 0 0 0;">{{ collect($videos)->where('is_active', 1)->count() }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #db2777; margin: 0;">Instagram Reels</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #db2777; margin: 0.5rem 0 0 0;">{{ collect($videos)->where('platform', 'instagram')->count() }}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; margin: 0;">YouTube &amp; Other</p>
            <p style="font-size: 1.75rem; font-weight: 800; color: #2563eb; margin: 0.5rem 0 0 0;">{{ collect($videos)->whereIn('platform', ['youtube', 'facebook', 'vimeo', 'mp4'])->count() }}</p>
        </div>
    </div>

    <!-- Category Filter Tabs -->
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; overflow-x: auto; padding-bottom: 0.5rem;">
        <a
            href="{{ route('admin.vize.videos.index', ['category' => 'all']) }}"
            style="padding: 0.4rem 0.9rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; white-space: nowrap; text-decoration: none; {{ $selectedCategory == 'all' ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #ffffff; border: 1px solid #e2e8f0; color: #475569;' }}"
        >
            All Videos ({{ count($videos) }})
        </a>

        @foreach($categories as $cat)
            @if($cat !== 'All Videos')
                @php
                    $catCount = collect($videos)->where('category', $cat)->count();
                @endphp
                <a
                    href="{{ route('admin.vize.videos.index', ['category' => $cat]) }}"
                    style="padding: 0.4rem 0.9rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; white-space: nowrap; text-decoration: none; {{ $selectedCategory == $cat ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #ffffff; border: 1px solid #e2e8f0; color: #475569;' }}"
                >
                    {{ $cat }} ({{ $catCount }})
                </a>
            @endif
        @endforeach
    </div>

    <!-- Video Catalog Table -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden mb-8" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; margin-bottom: 2rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="padding: 1rem 1.25rem; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0;">
                    Video Reels &amp; Showcase Catalog
                </h2>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">
                    Reels embedded here automatically load live video players on the customer storefront
                </p>
            </div>

            <button
                type="button"
                onclick="openAddVideoModal()"
                class="primary-button cursor-pointer font-bold text-xs rounded-lg shadow-sm transition"
                style="display: inline-flex; align-items: center; gap: 0.4rem; background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; cursor: pointer;"
            >
                <span style="font-size: 1rem; font-weight: bold;">+</span> Add Video / Reel
            </button>
        </div>

        <div class="overflow-x-auto" style="overflow-x: auto;">
            <table class="w-full text-left text-sm" style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.875rem;">
                <thead style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">
                    <tr>
                        <th style="padding: 0.85rem 1.25rem;">Preview / Thumb</th>
                        <th style="padding: 0.85rem 1.25rem;">Title &amp; Source Link</th>
                        <th style="padding: 0.85rem 1.25rem;">Category</th>
                        <th style="padding: 0.85rem 1.25rem;">Platform</th>
                        <th style="padding: 0.85rem 1.25rem;">Badge / Handle</th>
                        <th style="padding: 0.85rem 1.25rem;">Status</th>
                        <th style="padding: 0.85rem 1.25rem; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody style="border-top: 1px solid #f1f5f9;">
                    @forelse ($videos as $video)
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <!-- Thumbnail / Preview -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <div style="width: 72px; height: 50px; border-radius: 0.5rem; overflow: hidden; border: 1px solid #cbd5e1; background-color: #0f172a; position: relative; display: flex; align-items: center; justify-content: center;">
                                    @if(!empty($video->thumbnail))
                                        <img src="{{ $video->thumbnail }}" alt="{{ $video->title }}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
                                    @endif
                                    <span style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9px; padding: 1px 4px; border-radius: 3px; font-weight: bold;">
                                        {{ strtoupper(substr($video->platform, 0, 2)) }}
                                    </span>
                                </div>
                            </td>

                            <!-- Title & Source -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <p style="font-weight: 700; color: #0f172a; margin: 0; font-size: 0.875rem;">
                                    {{ $video->title }}
                                </p>
                                <a href="{{ $video->url }}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: #2563eb; font-family: monospace; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.2rem; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    <span>🔗 {{ $video->url }}</span>
                                </a>
                                @if(!empty($video->embed_url) && $video->embed_url !== $video->url)
                                    <p style="font-size: 0.65rem; color: #94a3b8; font-family: monospace; margin: 0.1rem 0 0 0; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        embed: {{ $video->embed_url }}
                                    </p>
                                @endif
                            </td>

                            <!-- Category -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <span style="display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background-color: #f1f5f9; color: #334155; border: 1px solid #e2e8f0;">
                                    {{ $video->category ?? 'Flooring' }}
                                </span>
                            </td>

                            <!-- Platform Badge -->
                            <td style="padding: 0.85rem 1.25rem;">
                                @if(strtolower($video->platform) === 'instagram')
                                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; background-color: #fdf2f8; color: #db2777; border: 1px solid #fbcfe8;">
                                        📷 Instagram Reel
                                    </span>
                                @elseif(strtolower($video->platform) === 'youtube')
                                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;">
                                        ▶️ YouTube
                                    </span>
                                @elseif(strtolower($video->platform) === 'facebook')
                                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;">
                                        📘 Facebook Reel
                                    </span>
                                @elseif(strtolower($video->platform) === 'vimeo')
                                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; background-color: #ecfeff; color: #0891b2; border: 1px solid #a5f3fc;">
                                        🎬 Vimeo
                                    </span>
                                @else
                                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; background-color: #f8fafc; color: #475569; border: 1px solid #cbd5e1;">
                                        📹 MP4 Video
                                    </span>
                                @endif
                            </td>

                            <!-- Badge / Handle -->
                            <td style="padding: 0.85rem 1.25rem;">
                                @if(!empty($video->badge))
                                    <span style="display: inline-block; font-size: 0.7rem; font-weight: 700; color: #d97706; background-color: #fffbeb; border: 1px solid #fde68a; padding: 0.1rem 0.4rem; border-radius: 0.25rem;">
                                        ★ {{ $video->badge }}
                                    </span>
                                @endif
                                <p style="font-size: 0.7rem; color: #64748b; margin: 0.2rem 0 0 0;">
                                    {{ $video->handle ?? '@vizeresin' }}
                                </p>
                            </td>

                            <!-- Status -->
                            <td style="padding: 0.85rem 1.25rem;">
                                <form action="{{ route('admin.vize.videos.toggle_status', $video->id) }}" method="POST">
                                    @csrf
                                    <button
                                        type="submit"
                                        title="Click to toggle status"
                                        style="font-size: 0.75rem; font-weight: 600; border-radius: 9999px; padding: 0.2rem 0.6rem; cursor: pointer; border: 1px solid; {{ ($video->is_active ?? true) ? 'background-color: #ecfdf5; color: #047857; border-color: #a7f3d0;' : 'background-color: #f1f5f9; color: #64748b; border-color: #cbd5e1;' }}"
                                    >
                                        {{ ($video->is_active ?? true) ? '● Active' : '○ Hidden' }}
                                    </button>
                                </form>
                            </td>

                            <!-- Actions -->
                            <td style="padding: 0.85rem 1.25rem; text-align: right;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;">
                                    <button
                                        type="button"
                                        onclick="openEditVideoModal({{ json_encode($video) }})"
                                        style="color: #b45309; background-color: #fffbeb; border: 1px solid #fde68a; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 0.375rem; cursor: pointer;"
                                    >
                                        ✏️ Edit
                                    </button>

                                    <form action="{{ route('admin.vize.videos.destroy', $video->id) }}" method="POST" onsubmit="return confirm('Remove video &quot;{{ $video->title }}&quot; from showcase?');" style="display: inline;">
                                        @csrf
                                        <button type="submit" style="color: #dc2626; background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0.25rem 0.5rem;">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" style="padding: 3rem; text-align: center; color: #94a3b8;">
                                No video reels added yet. Click <strong>"+ Add Video / Reel"</strong> to add Instagram, YouTube, or MP4 video links.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL 1: Add Video / Reel (With Auto-detection)       -->
    <!-- ==================================================== -->
    <div id="addVideoModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.65); padding: 1rem; backdrop-filter: blur(4px);">
        <div style="background: #ffffff; border-radius: 1rem; max-width: 560px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; max-height: 90vh; overflow-y: auto; padding: 1.5rem;">
            
            <!-- Modal Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">Add Video / Reel</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Paste an Instagram Reel, YouTube link, or direct MP4 video URL</p>
                </div>
                <button type="button" onclick="closeAddVideoModal()" style="color: #94a3b8; background: none; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <form action="{{ route('admin.vize.videos.store') }}" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf

                <!-- Video URL with Live Platform Detector -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <label style="font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase;">Video / Reel Link</label>
                        <span id="detectedPlatformBadge" style="display: none; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.45rem; border-radius: 0.25rem;"></span>
                    </div>
                    <input
                        type="text"
                        id="addVideoUrlInput"
                        name="url"
                        required
                        placeholder="e.g. https://www.instagram.com/reel/DcGpYzNSQvu/ or https://youtu.be/..."
                        oninput="detectVideoPlatform(this.value, 'add')"
                        style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-family: monospace;"
                    >
                    <p style="font-size: 0.7rem; color: #94a3b8; margin: 0.25rem 0 0 0;">
                        Supports Instagram Reels, YouTube Videos &amp; Shorts, Facebook Reels, Vimeo, and MP4 links.
                    </p>
                </div>

                <!-- Title & Category Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Video Title</label>
                        <input type="text" name="title" required placeholder="e.g. Metallic Ocean Pour" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Target Category</label>
                        <select name="category" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-weight: 600;">
                            <option value="Flooring">Flooring</option>
                            <option value="Casting & Art">Casting &amp; Art</option>
                            <option value="Protective Coatings">Protective Coatings</option>
                            <option value="Workshop Masterclass">Workshop Masterclass</option>
                            <option value="General Showcase">General Showcase</option>
                        </select>
                    </div>
                </div>

                <!-- Platform & Badge Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Platform Source</label>
                        <select id="addPlatformSelect" name="platform" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                            <option value="instagram">Instagram Reel</option>
                            <option value="youtube">YouTube Video / Short</option>
                            <option value="facebook">Facebook Reel</option>
                            <option value="mp4">Direct MP4 Video</option>
                            <option value="vimeo">Vimeo</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Badge / Tag (Optional)</label>
                        <input type="text" name="badge" placeholder="e.g. Trending Pour, Masterclass" value="Featured Pour" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Handle / Author & Sort Order -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Handle / Channel</label>
                        <input type="text" name="handle" value="@vizeresin" placeholder="e.g. @vizeresin" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Sort Order</label>
                        <input type="number" name="sort_order" value="1" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Thumbnail & Video File Uploads (Optional) -->
                <div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.6rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 0.2rem;">Cover Thumbnail Image Path / URL</label>
                        <input type="text" id="addThumbnailInput" name="thumbnail" placeholder="Auto-generated or /process-pour.jpg" style="width: 100%; padding: 0.4rem 0.6rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.75rem; font-family: monospace; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.7rem; color: #64748b; margin-bottom: 0.15rem;">— OR Upload Custom Cover Image File (PNG, JPG, WebP)</label>
                        <input type="file" name="thumbnail_file" accept="image/*" style="font-size: 0.75rem; width: 100%;">
                    </div>

                    <div style="border-top: 1px dashed #cbd5e1; padding-top: 0.5rem;">
                        <label style="display: block; font-size: 0.7rem; color: #64748b; margin-bottom: 0.15rem;">— OR Upload Direct MP4 Video File (Max 100MB)</label>
                        <input type="file" name="video_file" accept="video/mp4,video/webm" style="font-size: 0.75rem; width: 100%;">
                    </div>
                </div>

                <!-- Publish Toggle -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" name="is_active" id="add_is_active" value="1" checked style="width: 16px; height: 16px; cursor: pointer;">
                    <label for="add_is_active" style="font-size: 0.875rem; font-weight: 600; color: #1e293b; cursor: pointer;">Publish immediately to live customer storefront</label>
                </div>

                <!-- Footer Buttons -->
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                    <button type="button" onclick="closeAddVideoModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #475569; background: none; border: 1px solid #cbd5e1; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                    <button type="submit" style="background-color: #2563eb; color: #ffffff; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">Save Video Reel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL 2: Edit Video / Reel Details                   -->
    <!-- ==================================================== -->
    <div id="editVideoModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.65); padding: 1rem; backdrop-filter: blur(4px);">
        <div style="background: #ffffff; border-radius: 1rem; max-width: 560px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; max-height: 90vh; overflow-y: auto; padding: 1.5rem;">
            
            <!-- Modal Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">Edit Video / Reel</h3>
                    <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Update link, title, category, or platform options</p>
                </div>
                <button type="button" onclick="closeEditVideoModal()" style="color: #94a3b8; background: none; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <form id="editVideoForm" action="" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf

                <!-- Video URL -->
                <div>
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Video / Reel Link</label>
                    <input
                        type="text"
                        id="editVideoUrlInput"
                        name="url"
                        required
                        oninput="detectVideoPlatform(this.value, 'edit')"
                        style="width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-family: monospace;"
                    >
                </div>

                <!-- Title & Category Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Video Title</label>
                        <input type="text" id="editVideoTitle" name="title" required style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Target Category</label>
                        <select id="editVideoCategory" name="category" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; font-weight: 600;">
                            <option value="Flooring">Flooring</option>
                            <option value="Casting & Art">Casting &amp; Art</option>
                            <option value="Protective Coatings">Protective Coatings</option>
                            <option value="Workshop Masterclass">Workshop Masterclass</option>
                            <option value="General Showcase">General Showcase</option>
                        </select>
                    </div>
                </div>

                <!-- Platform & Badge Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Platform Source</label>
                        <select id="editPlatformSelect" name="platform" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                            <option value="instagram">Instagram Reel</option>
                            <option value="youtube">YouTube Video / Short</option>
                            <option value="facebook">Facebook Reel</option>
                            <option value="mp4">Direct MP4 Video</option>
                            <option value="vimeo">Vimeo</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Badge / Tag</label>
                        <input type="text" id="editVideoBadge" name="badge" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Handle / Author & Sort Order -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Handle / Channel</label>
                        <input type="text" id="editVideoHandle" name="handle" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.25rem;">Sort Order</label>
                        <input type="number" id="editVideoSortOrder" name="sort_order" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Thumbnail -->
                <div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.6rem;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 0.2rem;">Cover Thumbnail Image Path / URL</label>
                        <input type="text" id="editThumbnailInput" name="thumbnail" style="width: 100%; padding: 0.4rem 0.6rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.75rem; font-family: monospace; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.7rem; color: #64748b; margin-bottom: 0.15rem;">— OR Upload New Cover Image File</label>
                        <input type="file" name="thumbnail_file" accept="image/*" style="font-size: 0.75rem; width: 100%;">
                    </div>
                </div>

                <!-- Publish Toggle -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" name="is_active" id="edit_is_active" value="1" style="width: 16px; height: 16px; cursor: pointer;">
                    <label for="edit_is_active" style="font-size: 0.875rem; font-weight: 600; color: #1e293b; cursor: pointer;">Publish on live customer storefront</label>
                </div>

                <!-- Footer Buttons -->
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                    <button type="button" onclick="closeEditVideoModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #475569; background: none; border: 1px solid #cbd5e1; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                    <button type="submit" style="background-color: #2563eb; color: #ffffff; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">💾 Update Reel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- JavaScript Controller -->
    <script>
        function openAddVideoModal() {
            var modal = document.getElementById('addVideoModal');
            if (modal) modal.style.display = 'flex';
        }

        function closeAddVideoModal() {
            var modal = document.getElementById('addVideoModal');
            if (modal) modal.style.display = 'none';
        }

        function openEditVideoModal(video) {
            document.getElementById('editVideoForm').action = '/admin/vize/videos/' + video.id;
            document.getElementById('editVideoTitle').value = video.title || '';
            document.getElementById('editVideoUrlInput').value = video.url || '';
            document.getElementById('editVideoCategory').value = video.category || 'Flooring';
            document.getElementById('editPlatformSelect').value = (video.platform || 'instagram').toLowerCase();
            document.getElementById('editVideoBadge').value = video.badge || '';
            document.getElementById('editVideoHandle').value = video.handle || '@vizeresin';
            document.getElementById('editVideoSortOrder').value = video.sort_order || 0;
            document.getElementById('editThumbnailInput').value = video.thumbnail || '';
            document.getElementById('edit_is_active').checked = video.is_active == 1 || video.is_active == true;

            var modal = document.getElementById('editVideoModal');
            if (modal) modal.style.display = 'flex';
        }

        function closeEditVideoModal() {
            var modal = document.getElementById('editVideoModal');
            if (modal) modal.style.display = 'none';
        }

        // Live URL detector
        function detectVideoPlatform(url, mode) {
            url = url.trim();
            var platformSelect = document.getElementById(mode === 'add' ? 'addPlatformSelect' : 'editPlatformSelect');
            var thumbInput = document.getElementById(mode === 'add' ? 'addThumbnailInput' : 'editThumbnailInput');
            var badge = document.getElementById('detectedPlatformBadge');

            if (!url) {
                if (badge) badge.style.display = 'none';
                return;
            }

            if (/instagram\.com\/(?:p|reel|tv|share\/r)/i.test(url)) {
                if (platformSelect) platformSelect.value = 'instagram';
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.style.backgroundColor = '#fdf2f8';
                    badge.style.color = '#db2777';
                    badge.style.border = '1px solid #fbcfe8';
                    badge.innerText = '✓ Instagram Reel Detected';
                }
            } else if (/(?:youtube\.com\/(?:watch|shorts|embed)|youtu\.be\/)/i.test(url)) {
                if (platformSelect) platformSelect.value = 'youtube';
                var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
                if (ytMatch && thumbInput && (!thumbInput.value || thumbInput.value.includes('img.youtube.com') || thumbInput.value === '')) {
                    thumbInput.value = 'https://img.youtube.com/vi/' + ytMatch[1] + '/hqdefault.jpg';
                }
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.style.backgroundColor = '#fef2f2';
                    badge.style.color = '#dc2626';
                    badge.style.border = '1px solid #fecaca';
                    badge.innerText = '✓ YouTube Video Detected';
                }
            } else if (/facebook\.com\/(?:share\/r|watch|.*\/videos)/i.test(url)) {
                if (platformSelect) platformSelect.value = 'facebook';
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.style.backgroundColor = '#eff6ff';
                    badge.style.color = '#2563eb';
                    badge.style.border = '1px solid #bfdbfe';
                    badge.innerText = '✓ Facebook Reel Detected';
                }
            } else if (/vimeo\.com/i.test(url)) {
                if (platformSelect) platformSelect.value = 'vimeo';
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.style.backgroundColor = '#ecfeff';
                    badge.style.color = '#0891b2';
                    badge.style.border = '1px solid #a5f3fc';
                    badge.innerText = '✓ Vimeo Video Detected';
                }
            } else if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.startsWith('/')) {
                if (platformSelect) platformSelect.value = 'mp4';
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.style.backgroundColor = '#f8fafc';
                    badge.style.color = '#475569';
                    badge.style.border = '1px solid #cbd5e1';
                    badge.innerText = '✓ MP4 Direct Video';
                }
            }
        }
    </script>
</x-admin::layouts>
