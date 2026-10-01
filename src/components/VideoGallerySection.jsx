import { useState } from 'react';
import { Play, ExternalLink, X, Sparkles } from 'lucide-react';

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const REELS = [
  {
    id: 'reel-1',
    title: 'Metallic Gold & Ocean Teal Floor Pour',
    category: 'Flooring',
    platform: 'Instagram',
    handle: '@vizeresin',
    url: 'https://www.instagram.com/reel/DcGpYzNSQvu/?igsi=NHd0ZTh0ZmFmanBn',
    embedUrl: 'https://www.instagram.com/reel/DcGpYzNSQvu/embed/',
    badge: 'Trending Pour',
  },
  {
    id: 'reel-2',
    title: 'Deep Casting Olive Wood River Table',
    category: 'Casting & Art',
    platform: 'Instagram',
    handle: '@vizeresin',
    url: 'https://www.instagram.com/reel/DaSM54WxHEp/?igsi=MTRoMHFpMmZ4czA2Ng==',
    embedUrl: 'https://www.instagram.com/reel/DaSM54WxHEp/embed/',
    badge: 'Masterclass',
  },
  {
    id: 'reel-3',
    title: 'Flawless High-Gloss Surface Topcoat',
    category: 'Protective Coatings',
    platform: 'Facebook',
    handle: 'Vize Resins Pro',
    url: 'https://www.facebook.com/share/r/1CKSp9sd4G/?mibextid=wwXIfr',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fr%2F1CKSp9sd4G%2F&show_text=0&width=380',
    badge: 'Pro Technique',
  },
];

const CATEGORIES = ['All Videos', 'Flooring', 'Casting & Art', 'Protective Coatings'];

export default function VideoGallerySection() {
  const [activeTab, setActiveTab] = useState('All Videos');

  const filteredReels = activeTab === 'All Videos'
    ? REELS
    : REELS.filter((r) => r.category === activeTab);

  return (
    <section className="video-gallery-section" id="gallery" aria-label="Video Gallery">
      <div className="video-gallery-container">
        {/* Section Header */}
        <div className="gallery-header">
          <div className="gallery-header-left">
            <div className="gallery-eyebrow-wrap">
              <span className="gallery-eyebrow">VIDEO GALLERY</span>
              <span className="gallery-eyebrow-line" />
            </div>
            <h2 className="gallery-title">
              Craftsmanship in motion.<br />
              <em>Watch real transformations.</em>
            </h2>
          </div>

          <div className="gallery-header-right">
            <p className="gallery-header-desc">
              Live from our social channels. Explore step-by-step application reels, deep studio pours, and masterclasses directly from Instagram & Facebook.
            </p>
            {/* Filter Tabs */}
            <div className="gallery-tabs">
              {CATEGORIES.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`gallery-tab-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Cards Grid with Live Instagram / Facebook Embeds */}
        <div className="gallery-grid gallery-live-embed-grid">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="gallery-card gallery-embed-card">
              <div className="gallery-embed-header">
                <span className="gallery-platform-badge">
                  {reel.platform === 'Instagram' ? (
                    <InstagramIcon size={13} />
                  ) : (
                    <FacebookIcon size={13} />
                  )}
                  <span>{reel.platform} Reel</span>
                </span>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-open-post-btn"
                  title={`Open on ${reel.platform}`}
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Official Social Embed Frame (fetches real live cover automatically) */}
              <div className="gallery-embed-wrapper">
                <iframe
                  src={reel.embedUrl}
                  title={reel.title}
                  className="gallery-social-iframe"
                  scrolling="no"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
