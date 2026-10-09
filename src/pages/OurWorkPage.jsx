import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Shield,
  MapPin,
  Film,
  Check
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TransformationSection from '../components/TransformationSection';
import INITIAL_SHOWCASE from '../data/showcase.json';

const FILTER_TABS = [
  { id: 'all', label: 'All Works' },
  { id: 'flooring', label: 'Resin Flooring' },
  { id: 'tables', label: 'Custom Tables' },
  { id: 'industrial', label: 'Industrial & Labs' },
  { id: 'videos', label: '🎬 Video Reels' }
];

const FINISH_SPECIMENS = [
  {
    id: 'finish-metallic',
    name: 'Metallic 3D Flow',
    image: '/Metallic Resin Flooring.png',
    tag: 'Luxury Interiors'
  },
  {
    id: 'finish-flake',
    name: 'Granite Flake Matrix',
    image: '/high traffic flake flooring.png',
    tag: 'Commercial High-Traffic'
  },
  {
    id: 'finish-deep-cast',
    name: 'Crystal Deep Pour',
    image: '/table top/1N2A7896.jpg',
    tag: 'Live Edge River Tables'
  },
  {
    id: 'finish-screed',
    name: 'Hygienic Cleanroom Screed',
    image: '/Bio Safety Lab Critical Non Porous Flooring.png',
    tag: 'Pharma & Food Plants'
  }
];

export default function OurWorkPage() {
  const [showcaseProjects, setShowcaseProjects] = useState(INITIAL_SHOWCASE);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    const fetchShowcaseData = async () => {
      try {
        const response = await fetch('/api/showcase');
        if (response.ok) {
          const liveData = await response.json();
          if (isMounted && Array.isArray(liveData) && liveData.length > 0) {
            setShowcaseProjects(liveData);
          }
        }
      } catch (err) {
        // Fallback to bundled JSON
      }
    };

    fetchShowcaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return showcaseProjects.filter((item) => {
      if (activeTab === 'flooring' && item.category !== 'Resin Flooring') return false;
      if (activeTab === 'tables' && item.category !== 'Custom Tables') return false;
      if (activeTab === 'industrial' && item.category !== 'Industrial Facilities') return false;
      if (activeTab === 'videos' && !item.hasVideo) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const locMatch = item.location?.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        const subcatMatch = item.subcategory?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        if (!titleMatch && !locMatch && !catMatch && !subcatMatch && !descMatch) {
          return false;
        }
      }
      return true;
    });
  }, [showcaseProjects, activeTab, searchQuery]);

  return (
    <div className="vize-ourwork-page-root">
      <Header />

      <main className="vize-ourwork-main">
        {/* =========================================================================
            1. HERO SECTION (IMAGE BACKGROUND & CLEAN DESIGN)
           ========================================================================= */}
        <section className="vize-cinematic-hero-section">
          {/* Background Image */}
          <div className="vize-cinematic-video-wrapper">
            <img
              src="/commercial.png"
              alt="VIZE Showcase Archive"
              className="vize-cinematic-bg-video"
            />
            <div className="vize-cinematic-scrim-overlay" />
          </div>

          {/* Hero Content Overlay */}
          <div className="vize-cinematic-hero-content">
            <div className="vize-work-center-frame">
              
              {/* Top Status Row */}
              <div className="vize-cinematic-top-bar">
                <div className="vize-cinematic-badge">
                  <span className="vize-live-dot" />
                  <span>PROJECT ARCHIVE & SHOWCASE</span>
                </div>
              </div>

              {/* Main Headline & Narrative */}
              <div className="vize-cinematic-main-text">
                <h1 className="vize-cinematic-title">Surfaces & Works.</h1>
                <p className="vize-cinematic-desc">
                  A curated portfolio of seamless resin floors, handcrafted live-edge river tables, 
                  and high-performance industrial surfaces engineered with certified VIZE polymer systems.
                </p>

                <div className="vize-cinematic-actions">
                  <a href="#consultation-form" className="vize-cinematic-btn-primary">
                    <span>Commission a Project</span>
                    <ArrowRight size={15} />
                  </a>
                  <a href="#showcase-gallery" className="vize-cinematic-btn-ghost">
                    <span>Explore Gallery ↓</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            2. MINIMAL FILTER BAR & SEARCH
           ========================================================================= */}
        <section className="vize-work-minimal-filter-bar" id="showcase-gallery">
          <div className="vize-work-center-frame">
            <div className="vize-minimal-filter-inner">
              
              {/* Filter Tabs */}
              <div className="vize-minimal-tabs-wrap">
                {FILTER_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`vize-minimal-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="vize-minimal-search-wrap">
                <Search size={15} className="vize-minimal-search-icon" />
                <input
                  type="text"
                  placeholder="Search works or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="vize-minimal-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="vize-minimal-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INNOVATIVE EDITORIAL BENTO SHOWCASE GRID
           ========================================================================= */}
        <section className="vize-work-gallery-section">
          <div className="vize-work-center-frame">
            
            {filteredProjects.length > 0 ? (
              <div className="vize-innovative-bento-grid">
                {filteredProjects.map((project, idx) => {
                  // Dynamic Bento layout pattern: items 0 and 3 span 2 columns
                  const isSpanWide = (idx % 6 === 0) || (idx % 6 === 3);
                  const cardVariantClass = isSpanWide ? 'vize-bento-span-2' : 'vize-bento-standard';

                  return (
                    <article
                      key={project.id}
                      className={`vize-bento-card ${cardVariantClass}`}
                      onClick={() => setSelectedProject(project)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedProject(project);
                      }}
                    >
                      {/* Bento Media Stage */}
                      <div className="vize-bento-media">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="vize-bento-img"
                          loading="lazy"
                        />
                        <div className="vize-bento-scrim" />
                        
                        {/* Top Floating Badges */}
                        <div className="vize-bento-top-badges">
                          <span className="vize-bento-category-tag">
                            {project.category} • {project.subcategory}
                          </span>
                          {project.hasVideo && (
                            <span className="vize-bento-video-badge">
                              <Film size={11} />
                              <span>4K Reel</span>
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="vize-bento-hover-cta">
                          <span className="vize-bento-pill-btn">
                            <span>Explore Formulation</span>
                            <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>

                      {/* Bento Card Content */}
                      <div className="vize-bento-body">
                        <div className="vize-bento-meta-row">
                          <span className="vize-bento-loc">
                            <MapPin size={12} className="vize-loc-pin" />
                            <span>{project.location}</span>
                          </span>
                          <span className="vize-bento-area">{project.area}</span>
                        </div>

                        <h3 className="vize-bento-title">
                          {project.title}
                        </h3>
                        
                        <p className="vize-bento-tagline">
                          {project.tagline}
                        </p>

                        {/* Specs / Formula Chips Bar */}
                        <div className="vize-bento-footer">
                          <div className="vize-bento-chips">
                            {project.productsUsed?.slice(0, 2).map((p, pIdx) => (
                              <span key={pIdx} className="vize-bento-chip">
                                {p.name.replace('VIZE ', '')}
                              </span>
                            ))}
                            {project.stats?.['Hardness'] && (
                              <span className="vize-bento-chip-metric">
                                {project.stats['Hardness']}
                              </span>
                            )}
                            {project.stats?.['Pour Depth'] && (
                              <span className="vize-bento-chip-metric">
                                {project.stats['Pour Depth']}
                              </span>
                            )}
                          </div>

                          <span className="vize-bento-link">
                            <span>Specs</span>
                            <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="vize-work-empty-results">
                <p>No projects match your filter or keyword search.</p>
                <button
                  type="button"
                  className="vize-work-reset-filter-btn"
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}

          </div>
        </section>

        {/* =========================================================================
            4. BEFORE / AFTER TRANSFORMATION SLIDER
           ========================================================================= */}
        <TransformationSection />

        {/* =========================================================================
            5. MINIMAL FINISH SPECIMENS
           ========================================================================= */}
        <section className="vize-work-minimal-finishes">
          <div className="vize-work-center-frame">
            <div className="vize-minimal-finishes-head">
              <span className="vize-finishes-eyebrow">TACTILE RESIN FINISHES</span>
              <h2 className="vize-finishes-title">The finish is in the details.</h2>
            </div>

            <div className="vize-minimal-finishes-grid">
              {FINISH_SPECIMENS.map((specimen) => (
                <div key={specimen.id} className="vize-minimal-finish-item">
                  <div className="vize-minimal-finish-media">
                    <img
                      src={specimen.image}
                      alt={specimen.name}
                      className="vize-minimal-finish-img"
                      loading="lazy"
                    />
                    <div className="vize-minimal-finish-gradient" />
                    <div className="vize-minimal-finish-info">
                      <span className="vize-minimal-finish-tag">{specimen.tag}</span>
                      <h4 className="vize-minimal-finish-name">{specimen.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. MINIMAL COMMISSION BANNER
           ========================================================================= */}
        <section className="vize-work-minimal-cta-section" id="consultation-form">
          <div className="vize-work-center-frame">
            <div className="vize-minimal-cta-banner">
              <div className="vize-minimal-cta-content">
                <span className="vize-minimal-cta-eyebrow">COMMISSION & CONSULTATION</span>
                <h3 className="vize-minimal-cta-title">Commission your next surface.</h3>
                <p className="vize-minimal-cta-desc">
                  Discuss your space parameters, dimensions, and preferred resin system with our technical specialists.
                </p>
              </div>

              <div className="vize-minimal-cta-actions">
                <a
                  href="https://wa.me/919876543210?text=Hi%20VIZE%20team%2C%20I%20would%20like%20to%20discuss%20a%20new%20resin%20project%20and%20share%20site%20photos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vize-minimal-cta-primary-btn"
                >
                  <span>Share Project on WhatsApp</span>
                  <ArrowRight size={15} />
                </a>
                <Link to="/contact" className="vize-minimal-cta-secondary-btn">
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* =========================================================================
          7. CASE STUDY & VIDEO DEEP-DIVE MODAL
         ========================================================================= */}
      {selectedProject && (
        <div
          className="vize-case-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="vize-case-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="vize-case-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Media */}
            <div className="vize-case-modal-media">
              {selectedProject.hasVideo && selectedProject.video ? (
                <video
                  src={selectedProject.video}
                  className="vize-case-modal-video"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="vize-case-modal-img"
                />
              )}
            </div>

            <div className="vize-case-modal-content">
              <div className="vize-modal-tags-row">
                <span className="vize-case-modal-eyebrow">{selectedProject.category} • {selectedProject.subcategory}</span>
                <span className="vize-case-modal-location">
                  <MapPin size={12} />
                  <span>{selectedProject.location}</span>
                </span>
              </div>

              <h3 className="vize-case-modal-title">{selectedProject.title}</h3>
              <p className="vize-case-modal-desc">{selectedProject.description}</p>

              {/* Products Applied */}
              <div className="vize-modal-products-section">
                <h4 className="vize-modal-section-heading">
                  <Layers size={14} />
                  <span>VIZE Products Applied</span>
                </h4>
                <div className="vize-modal-products-grid">
                  {selectedProject.productsUsed?.map((p, idx) => (
                    <Link
                      key={idx}
                      to={p.link || '/products'}
                      className="vize-modal-product-card"
                      onClick={() => setSelectedProject(null)}
                    >
                      <div className="vize-modal-prod-info">
                        <strong className="vize-modal-prod-name">{p.name}</strong>
                        <span className="vize-modal-prod-role">{p.role}</span>
                      </div>
                      <ArrowUpRight size={14} className="vize-modal-prod-arrow" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Engineering Parameters */}
              <div className="vize-modal-specs-section">
                <h4 className="vize-modal-section-heading">
                  <Shield size={14} />
                  <span>Engineering Specs</span>
                </h4>
                <div className="vize-case-modal-matrix">
                  <div className="vize-modal-matrix-item">
                    <span>Client Scope</span>
                    <strong>{selectedProject.client}</strong>
                  </div>
                  <div className="vize-modal-matrix-item">
                    <span>Project Area / Dimensions</span>
                    <strong>{selectedProject.area}</strong>
                  </div>
                  <div className="vize-modal-matrix-item">
                    <span>Execution Turnaround</span>
                    <strong>{selectedProject.turnaround}</strong>
                  </div>
                  {Object.entries(selectedProject.stats || {}).map(([key, val]) => (
                    <div key={key} className="vize-modal-matrix-item">
                      <span>{key}</span>
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="vize-case-modal-actions">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20VIZE%20team%2C%20I%20am%20interested%20in%20a%20specification%20similar%20to%20${encodeURIComponent(selectedProject.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vize-modal-explore-btn"
                >
                  <span>Request Custom Quotation</span>
                  <ArrowRight size={15} />
                </a>
                <button
                  type="button"
                  className="vize-modal-quote-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  Close Showcase
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
