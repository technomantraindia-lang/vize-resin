import { useState } from 'react';
import { Play, X } from 'lucide-react';

function GuidesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function TdsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="8" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function ColourGridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

const RESOURCES = [
  {
    id: 'guides',
    title: 'Application Guides',
    subtitle: 'Step-by-step support.',
    icon: GuidesIcon,
    link: '#guides',
  },
  {
    id: 'tds',
    title: 'Technical Data Sheets',
    subtitle: 'Key technical information.',
    icon: TdsIcon,
    link: '#tds',
  },
  {
    id: 'colours',
    title: 'Colour Charts',
    subtitle: 'Explore the range.',
    icon: ColourGridIcon,
    link: '#colours',
  },
];

export default function EducationResourcesSection() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="education-section" id="resources" aria-label="Education and Resources">
      <div className="education-container">
        {/* Left Header Block */}
        <div className="education-header-col">
          <div className="education-eyebrow-wrap">
            <span className="education-eyebrow">EDUCATION & RESOURCES</span>
            <span className="education-eyebrow-line" />
          </div>
          <h2 className="education-title">Choose with confidence.</h2>
          <p className="education-subtitle">Guides. Data. Inspiration.</p>
        </div>

        {/* 3 Quick Resource Cards */}
        <div className="education-cards-grid">
          {RESOURCES.map((item) => {
            const IconComponent = item.icon;
            return (
              <a key={item.id} href={item.link} className="education-resource-card">
                <div className="resource-icon-wrap">
                  <IconComponent size={24} strokeWidth={1.75} />
                </div>
                <div className="resource-text-wrap">
                  <h3 className="resource-title">{item.title}</h3>
                  <p className="resource-subtitle">{item.subtitle}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* 4th Card: Video Application Techniques Banner */}
        <div className="education-video-banner" onClick={() => setVideoModalOpen(true)}>
          <img
            src="/process-trowel.jpg"
            alt="Application Techniques"
            className="education-video-bg"
          />
          <div className="education-video-overlay" />
          <div className="education-video-content">
            <button className="video-play-circle" aria-label="Play Application Techniques video">
              <Play size={18} fill="#ffffff" color="#ffffff" className="play-icon-offset" />
            </button>
            <div className="video-banner-text">
              <h3 className="video-banner-title">Application Techniques</h3>
              <p className="video-banner-subtitle">Tips for professional results.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <span className="video-modal-title">Application Techniques • Masterclass</span>
              <button
                className="video-modal-close-btn"
                onClick={() => setVideoModalOpen(false)}
                aria-label="Close video"
              >
                <X size={18} />
              </button>
            </div>
            <div className="video-modal-iframe-wrapper">
              <video
                src="/hero-video.mp4"
                controls
                autoPlay
                className="video-modal-iframe"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
