import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Video, Sparkles } from 'lucide-react';
import fallbackReels from '../data/videos.json';

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function YouTubeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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

export default function VideoGallerySection() {
  const [reels, setReels] = useState(fallbackReels || []);
  const [activeTab, setActiveTab] = useState('All Videos');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  // Fetch live video data from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const result = await response.json();
          if (isMounted && result && Array.isArray(result.data) && result.data.length > 0) {
            setReels(result.data);
          }
        }
      } catch (err) {
        // Fallback to bundled JSON
      }
    };

    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute categories dynamically
  const categories = ['All Videos', ...Array.from(new Set(reels.map((r) => r.category).filter(Boolean)))];

  const filteredReels = activeTab === 'All Videos'
    ? reels
    : reels.filter((r) => r.category === activeTab);

  // Update scroll boundaries & active index
  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active card index
    const cardWidth = sliderRef.current.querySelector('.gallery-slider-item')?.offsetWidth || 340;
    const index = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(index, filteredReels.length - 1));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      updateScrollState();
      return () => el.removeEventListener('scroll', updateScrollState);
    }
  }, [filteredReels]);

  // Reset scroll when category changes
  const handleCategoryChange = (tab) => {
    setActiveTab(tab);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.querySelector('.gallery-slider-item')?.offsetWidth || 360;
    sliderRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.querySelector('.gallery-slider-item')?.offsetWidth || 360;
    sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  };

  const scrollToCard = (index) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.querySelector('.gallery-slider-item')?.offsetWidth || 360;
    sliderRef.current.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' });
  };

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
              Live from our social channels. Explore step-by-step application reels, deep studio pours, and masterclasses directly from Instagram, YouTube &amp; Facebook.
            </p>

            {/* Controls Bar: Category Filter Tabs + Navigation Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="gallery-tabs">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleCategoryChange(tab)}
                    className={`gallery-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Slider Navigation Arrows */}
              <div className="gallery-slider-controls">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={!canScrollLeft}
                  className="gallery-nav-btn"
                  title="Previous Videos"
                  aria-label="Previous Video"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={!canScrollRight}
                  className="gallery-nav-btn"
                  title="Next Videos"
                  aria-label="Next Video"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Slider Track Wrap */}
        <div className="video-gallery-slider-wrap">
          <div ref={sliderRef} className="gallery-slider-track">
            {filteredReels.map((reel, idx) => {
              const platformLower = (reel.platform || 'instagram').toLowerCase();
              const isYouTube = platformLower === 'youtube';
              const isFacebook = platformLower === 'facebook';
              const isInstagram = platformLower === 'instagram';
              const isMp4 = platformLower === 'mp4' || (!isYouTube && !isFacebook && !isInstagram && reel.url?.endsWith('.mp4'));

              return (
                <div key={reel.id || reel.db_id || idx} className="gallery-slider-item">
                  <div className="gallery-embed-card">
                    
                    {/* Card Top Header */}
                    <div className="gallery-embed-header">
                      <span
                        className="gallery-platform-badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          color: '#ffffff',
                          background: isInstagram
                            ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                            : isYouTube
                            ? '#dc2626'
                            : isFacebook
                            ? '#1877f2'
                            : '#0284c7',
                        }}
                      >
                        {isInstagram && <InstagramIcon size={13} />}
                        {isYouTube && <YouTubeIcon size={13} />}
                        {isFacebook && <FacebookIcon size={13} />}
                        {isMp4 && <Video size={13} />}
                        <span>{reel.platform} Reel</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {reel.badge && (
                          <span style={{ fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '700' }}>
                            {reel.badge}
                          </span>
                        )}

                        {reel.url && (
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
                        )}
                      </div>
                    </div>

                    {/* Video Player Frame */}
                    <div className="gallery-embed-wrapper">
                      {isMp4 ? (
                        <video
                          controls
                          poster={reel.thumbnail || '/process-pour.jpg'}
                          src={reel.url}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <iframe
                          src={reel.embedUrl || reel.url}
                          title={reel.title || 'VIZE Video Reel'}
                          className="gallery-social-iframe"
                          scrolling="no"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}
                    </div>

                    {/* Card Bottom Meta */}
                    {reel.title && (
                      <div style={{ padding: '0.85rem 1.15rem', background: '#0e171c', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.3 }}>
                          {reel.title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {reel.handle || '@vizeresin'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: '600' }}>
                            {reel.category || 'Flooring'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Pagination Indicator Dots */}
          {filteredReels.length > 1 && (
            <div className="gallery-slider-pagination">
              {filteredReels.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToCard(i)}
                  className={`gallery-dot ${activeIndex === i ? 'active' : ''}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
