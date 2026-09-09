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
    thumb: '/reel-1-thumb.jpg',
    duration: '0:45',
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
    thumb: '/reel-2-thumb.jpg',
    duration: '0:58',
    badge: 'Masterclass',
  },
  {
    id: 'reel-3',
    title: 'Flawless High-Gloss Surface Topcoat',
    category: 'Protective Coatings',
    platform: 'Facebook',
    handle: 'Vize Resins Pro',
    url: 'https://www.facebook.com/share/r/1CKSp9sd4G/?mibextid=wwXIfr',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fr%2F1CKSp9sd4G%2F&show_text=0',
    thumb: '/reel-3-thumb.jpg',
    duration: '0:35',
    badge: 'Pro Technique',
  },
];

const CATEGORIES = ['All Videos', 'Flooring', 'Casting & Art', 'Protective Coatings'];

export default function VideoGallerySection() {
  const [activeTab, setActiveTab] = useState('All Videos');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

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
              Explore step-by-step application reels, deep studio pours, and masterclass demonstrations from our laboratory and certified artisans.
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

        {/* Video Cards Grid */}
        <div className="gallery-grid">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="gallery-card">
              {/* Thumbnail + Overlays */}
              <div className="gallery-card-media" onClick={() => setActiveVideoModal(reel)}>
                <img
                  src={reel.thumb}
                  alt={reel.title}
                  className="gallery-card-thumb"
                  loading="lazy"
                />
                
                {/* Gradient overlays */}
                <div className="gallery-media-overlay" />

                {/* Top Badge */}
                <div className="gallery-card-top-bar">
                  <span className="gallery-platform-badge">
                    {reel.platform === 'Instagram' ? (
                      <InstagramIcon size={13} />
                    ) : (
                      <FacebookIcon size={13} />
                    )}
                    <span>{reel.platform} Reel</span>
                  </span>
                  <span className="gallery-pill-feature">
                    <Sparkles size={11} />
                    {reel.badge}
                  </span>
                </div>

                {/* Play Button Trigger */}
                <button
                  type="button"
                  className="gallery-play-btn"
                  aria-label={`Play ${reel.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoModal(reel);
                  }}
                >
                  <Play size={22} fill="#ffffff" color="#ffffff" className="play-icon" />
                </button>

                {/* Card Bottom Meta */}
                <div className="gallery-card-bottom">
                  <span className="gallery-card-category">{reel.category}</span>
                  <h3 className="gallery-card-title">{reel.title}</h3>
                  <div className="gallery-card-footer">
                    <span className="gallery-card-handle">{reel.handle}</span>
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gallery-direct-link"
                      onClick={(e) => e.stopPropagation()}
                      title={`Open on ${reel.platform}`}
                    >
                      <span>Watch</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal / Lightbox */}
      {activeVideoModal && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideoModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div className="video-modal-title-info">
                <span className="video-modal-platform">
                  {activeVideoModal.platform === 'Instagram' ? (
                    <InstagramIcon size={14} />
                  ) : (
                    <FacebookIcon size={14} />
                  )}
                  {activeVideoModal.platform} Reel
                </span>
                <h4 className="video-modal-title">{activeVideoModal.title}</h4>
              </div>
              <button
                type="button"
                className="video-modal-close-btn"
                onClick={() => setActiveVideoModal(null)}
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>

            <div className="video-modal-iframe-wrapper">
              <iframe
                src={activeVideoModal.embedUrl}
                title={activeVideoModal.title}
                className="video-modal-iframe"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="video-modal-footer">
              <a
                href={activeVideoModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-modal-action-btn"
              >
                <span>Open original on {activeVideoModal.platform}</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
