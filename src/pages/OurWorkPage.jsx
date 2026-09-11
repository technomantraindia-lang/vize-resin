import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  SlidersHorizontal,
  Layers,
  Shield,
  Building2,
  Factory,
  Hospital,
  Warehouse,
  Flame
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TransformationSection from '../components/TransformationSection';

const APPLICATION_TABS = [
  'All Work',
  'Metallic',
  'Industrial',
  'High-Traffic',
  'Healthcare',
  'Food-Safe',
  'Outdoor'
];

const PROJECTS_DATA = [
  {
    id: 'case-metallic-01',
    category: 'Metallic',
    eyebrow: 'METALLIC RESIN FLOORING',
    title: 'Depth, movement and a seamless finish.',
    tagline: 'Custom hand-feathered petrol teal and liquid copper pigment veins over an ultra-flat concrete substrate for a flagship luxury commercial atrium.',
    application: 'Commercial Interior',
    system: 'Multi-layer Resin',
    finish: 'High Gloss',
    image: '/Metallic Resin Flooring.png',
    area: '4,800 sq.ft',
    location: 'Bandra Kurla Complex, Mumbai',
    highlight: 'Mirror 3D optical flow with scratch-resistant urethane shield'
  },
  {
    id: 'case-industrial-02',
    category: 'Industrial',
    eyebrow: 'INDUSTRIAL RESIN FLOORING',
    title: 'Built for demanding daily movement.',
    tagline: 'High-compressive polyurethane screed and self-leveling mortar engineered to endure 5-ton forklift point-loads, heavy pallet traffic, and daily chemical washdowns.',
    application: 'Industrial Facility',
    system: 'Heavy-Duty Resin',
    finish: 'Smooth Satin',
    image: '/Industrial Resin Flooring.png',
    area: '22,000 sq.ft',
    location: 'Chakan Industrial Zone, Pune',
    highlight: 'Seamless forklift navigation with integrated safety demarcations'
  },
  {
    id: 'case-healthcare-03',
    category: 'Healthcare',
    eyebrow: 'CRITICAL NON-POROUS FLOORING',
    title: 'Controlled surfaces for critical spaces.',
    tagline: 'Hermetically sealed anti-microbial coved floor-to-wall polymer system meeting ISO Class 5 cleanroom standards with zero bacterial harborage joints.',
    application: 'Clinical Space',
    system: 'Seamless Coating',
    finish: 'Easy-Clean',
    image: '/Bio Safety Lab Critical Non Porous Flooring.png',
    area: '6,500 sq.ft',
    location: 'Genome Valley, Hyderabad',
    highlight: 'Zero porosity, thermal shock resistant up to 120°C steam sterilisation'
  },
  {
    id: 'case-foodsafe-04',
    category: 'Food-Safe',
    eyebrow: 'FOOD-GRADE POLYURETHANE',
    title: 'Hygienic protection for processing lines.',
    tagline: 'HACCP-certified thermal-shock resistant poly-screed designed for wet food processing, commercial dairy vats, and acidic beverage production.',
    application: 'Food Processing Plant',
    system: 'Vize PolyScreed 6mm',
    finish: 'Textured Slip-Resistant',
    image: '/Food Safe Non Porous Flooring.png',
    area: '14,000 sq.ft',
    location: 'Khadki, Pune',
    highlight: 'Resistant to lactic acids, oils, and continuous boiling washdowns'
  },
  {
    id: 'case-hightraffic-05',
    category: 'High-Traffic',
    eyebrow: 'DECORATIVE FLAKE SYSTEM',
    title: 'Resilient multi-tone broadcast flooring.',
    tagline: 'High-density vinyl broadcast chips embedded in 100% solids epoxy and locked beneath dual-coat non-yellowing polyaspartic glaze.',
    application: 'Automotive Gallery & Showroom',
    system: 'Multi-Coat Flake Matrix',
    finish: 'Granite Texture',
    image: '/high traffic flake flooring.png',
    area: '8,200 sq.ft',
    location: 'Gurugram, NCR',
    highlight: '100% Hot-tire pickup immunity with high slip resistance'
  },
  {
    id: 'case-outdoor-06',
    category: 'Outdoor',
    eyebrow: 'PERMEABLE STONE CARPET',
    title: 'Natural stone bound in clear UV resin.',
    tagline: 'Encapsulated quartz pebbles providing free-draining exterior paving for luxury villa driveways, pool decks, and garden terraces.',
    application: 'Villa Driveway & Terrace',
    system: 'Vize Rock Hard Aliphatic',
    finish: 'Natural Pebble Permeable',
    image: '/cat-flooring.jpg',
    area: '3,400 sq.ft',
    location: 'Goa Coastal Villa',
    highlight: 'Non-yellowing UV stability with zero standing rainwater puddles'
  }
];

const FINISH_SPECIMENS = [
  {
    id: 'finish-metallic',
    name: 'Metallic Flow',
    desc: 'Liquid gold, petrol teal & bronze swirls with deep mirror reflection.',
    image: '/Metallic Resin Flooring.png',
    tag: 'Luxury Interiors'
  },
  {
    id: 'finish-flake',
    name: 'Flake Texture',
    desc: 'Multi-tonal vinyl chip broadcast for extreme durability and traction.',
    image: '/high traffic flake flooring.png',
    tag: 'Commercial & Garage'
  },
  {
    id: 'finish-stone',
    name: 'Stone Carpet',
    desc: 'Natural quartz pebbles encapsulated in UV-stable aliphatic binder.',
    image: '/cat-flooring.jpg',
    tag: 'Driveways & Terraces'
  },
  {
    id: 'finish-satin',
    name: 'Non-Porous Satin',
    desc: 'Monolithic seamless hygienic coating with smooth low-glare sheen.',
    image: '/Food Safe Non Porous Flooring.png',
    tag: 'Industrial & Clinical'
  }
];

export default function OurWorkPage() {
  const [activeCategory, setActiveCategory] = useState('All Work');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Case Studies
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Consultation Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    approxArea: '',
    location: '',
    requiredFinish: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      // 1. Category tab match
      if (activeCategory !== 'All Work') {
        if (project.category !== activeCategory) return false;
      }

      // 2. Search query match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesEyebrow = project.eyebrow.toLowerCase().includes(query);
        const matchesTagline = project.tagline.toLowerCase().includes(query);
        const matchesApp = project.application.toLowerCase().includes(query);
        const matchesSystem = project.system.toLowerCase().includes(query);
        if (!matchesTitle && !matchesEyebrow && !matchesTagline && !matchesApp && !matchesSystem) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="vize-ourwork-page-root">
      <Header />

      <main className="vize-ourwork-main">
        
        {/* =========================================================================
            1. HERO SECTION ("VIZE PROJECT ARCHIVE" + FRAMED COLLAGE)
           ========================================================================= */}
        <section className="vize-work-hero-section">
          <div className="vize-work-center-frame">
            <div className="vize-work-hero-grid">
              
              {/* Left Column: Heading & CTAs */}
              <div className="vize-work-hero-text-col">
                <span className="vize-work-hero-eyebrow">VIZE PROJECT ARCHIVE</span>
                
                <h1 className="vize-work-hero-title">
                  Surfaces that <br />
                  <em className="vize-work-hero-italic">prove the work.</em>
                </h1>
                
                <p className="vize-work-hero-subtitle">
                  Explore real flooring systems, finishes and transformations created for demanding spaces.
                </p>

                <div className="vize-work-hero-btn-row">
                  <a href="#consultation-form" className="vize-work-btn-primary">
                    <span>Start Your Project</span>
                    <ArrowRight size={16} />
                  </a>

                  <a href="#selected-work" className="vize-work-btn-link">
                    Explore Projects
                  </a>
                </div>
              </div>

              {/* Right Column: Curated Framed Collage with Copper Border */}
              <div className="vize-work-hero-visual-col">
                <div className="vize-work-collage-frame">
                  
                  {/* Big Main Left Image */}
                  <div className="vize-collage-main-box">
                    <img
                      src="/Metallic Resin Flooring.png"
                      alt="Luxury Commercial Reception Metallic Floor"
                      className="vize-collage-img"
                    />
                  </div>

                  {/* Top-Right Secondary Image */}
                  <div className="vize-collage-sub-box top">
                    <img
                      src="/Industrial Resin Flooring.png"
                      alt="High-Gloss Industrial Logistics Facility"
                      className="vize-collage-img"
                    />
                  </div>

                  {/* Bottom-Right Tertiary Image with Floating Badge */}
                  <div className="vize-collage-sub-box bottom">
                    <img
                      src="/high traffic flake flooring.png"
                      alt="High Traffic Vinyl Flake Flooring"
                      className="vize-collage-img"
                    />
                    <div className="vize-collage-floating-badge">
                      <span>PROJECTS / MATERIALS / RESULTS</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            2. EXPLORE BY APPLICATION (FILTER PILLS + LIVE SEARCH BAR)
           ========================================================================= */}
        <section className="vize-work-filter-bar-section">
          <div className="vize-work-center-frame">
            <div className="vize-work-filter-bar-inner">
              
              {/* Left Title & Filter Pills */}
              <div className="vize-work-pills-wrap">
                <span className="vize-work-filter-label">Explore by application</span>
                
                <div className="vize-work-pills-row">
                  {APPLICATION_TABS.map((tab) => {
                    const isActive = activeCategory === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        className={`vize-work-pill-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveCategory(tab)}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Search Box */}
              <div className="vize-work-search-wrapper">
                <Search size={16} className="vize-work-search-icon" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="vize-work-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="vize-work-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3. "SELECTED WORK." (ALTERNATING ZIG-ZAG CASE STUDIES)
           ========================================================================= */}
        <section className="vize-work-selected-section" id="selected-work">
          <div className="vize-work-center-frame">
            
            {/* Section Header */}
            <div className="vize-work-section-header">
              <h2 className="vize-work-section-title">Selected work.</h2>
              <p className="vize-work-section-sub">
                A closer look at the system behind every finished surface.
              </p>
            </div>

            {/* Alternating Zig-Zag Case Study List */}
            {filteredProjects.length > 0 ? (
              <div className="vize-work-cases-stack">
                {filteredProjects.map((project, idx) => {
                  const isImageLeft = idx % 2 === 0;

                  return (
                    <article
                      key={project.id}
                      className={`vize-work-case-item ${isImageLeft ? 'image-left' : 'image-right'}`}
                    >
                      {/* Image Stage */}
                      <div
                        className="vize-case-image-col"
                        onClick={() => setSelectedCaseStudy(project)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="vize-case-img-wrap">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="vize-case-img"
                            loading="lazy"
                          />
                          <div className="vize-case-img-overlay">
                            <span className="vize-case-quickview-pill">
                              <Sparkles size={13} />
                              <span>View Project Details</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Stage */}
                      <div className="vize-case-content-col">
                        <div className="vize-case-eyebrow-row">
                          <span className="vize-case-eyebrow-text">{project.eyebrow}</span>
                          <span className="vize-case-eyebrow-line" />
                        </div>

                        <h3 className="vize-case-title">{project.title}</h3>
                        
                        <p className="vize-case-desc">
                          {project.tagline}
                        </p>

                        {/* 3-Column Specifications Row */}
                        <div className="vize-case-specs-row">
                          <div className="vize-case-spec-cell">
                            <span className="vize-case-spec-lbl">Application</span>
                            <strong className="vize-case-spec-val">{project.application}</strong>
                          </div>

                          <div className="vize-case-spec-cell">
                            <span className="vize-case-spec-lbl">System</span>
                            <strong className="vize-case-spec-val">{project.system}</strong>
                          </div>

                          <div className="vize-case-spec-cell">
                            <span className="vize-case-spec-lbl">Finish</span>
                            <strong className="vize-case-spec-val">{project.finish}</strong>
                          </div>
                        </div>

                        {/* View Case Study CTA Button */}
                        <div className="vize-case-action-row">
                          <button
                            type="button"
                            className="vize-case-study-btn"
                            onClick={() => setSelectedCaseStudy(project)}
                          >
                            <span>View Case Study</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="vize-work-empty-results">
                <p>No projects match your current filter or keyword search.</p>
                <button
                  type="button"
                  className="vize-work-reset-filter-btn"
                  onClick={() => {
                    setActiveCategory('All Work');
                    setSearchQuery('');
                  }}
                >
                  Reset Project Filters
                </button>
              </div>
            )}

          </div>
        </section>

        {/* =========================================================================
            4. "FROM WORN SUBSTRATE TO FINISHED SYSTEM." (BEFORE/AFTER DRAG SLIDER)
           ========================================================================= */}
        <TransformationSection />

        {/* =========================================================================
            5. "THE FINISH IS IN THE DETAILS." (4 TEXTURE SPECIMEN TILES)
           ========================================================================= */}
        <section className="vize-work-finishes-section">
          <div className="vize-work-center-frame">
            
            <div className="vize-finishes-header">
              <h2 className="vize-finishes-title">The finish is in the details.</h2>
            </div>

            <div className="vize-finishes-tiles-grid">
              {FINISH_SPECIMENS.map((specimen) => (
                <div key={specimen.id} className="vize-finish-tile-card">
                  <div className="vize-finish-tile-media">
                    <img
                      src={specimen.image}
                      alt={specimen.name}
                      className="vize-finish-tile-img"
                      loading="lazy"
                    />
                    <div className="vize-finish-tile-gradient" />
                  </div>
                  
                  <div className="vize-finish-tile-footer">
                    <span className="vize-finish-tile-name">{specimen.name}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================================================
            6. "HAVE A SURFACE IN MIND?" (SPLIT TERRACOTTA + DARK FORM CONSULTATION)
           ========================================================================= */}
        <section className="vize-work-consultation-section" id="consultation-form">
          <div className="vize-work-center-frame">
            
            <div className="vize-consult-split-card">
              
              {/* Left Column (Terracotta #8C4830) */}
              <div className="vize-consult-left-col">
                <h3 className="vize-consult-title">Have a surface in mind?</h3>
                <p className="vize-consult-sub">
                  Share your space, application and preferred finish. Our team will help identify the suitable VIZE system.
                </p>

                <div className="vize-consult-btn-row">
                  <a href="#quick-form" className="vize-consult-white-btn">
                    <span>Discuss Your Project</span>
                    <ArrowRight size={15} />
                  </a>

                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="vize-consult-outline-btn">
                    <span>Send Project Photos</span>
                  </a>
                </div>
              </div>

              {/* Right Column (Dark Petrol #07171D Form) */}
              <div className="vize-consult-right-col" id="quick-form">
                {formSubmitted ? (
                  <div className="vize-consult-success-box">
                    <CheckCircle2 size={44} className="vize-consult-success-icon" />
                    <h4 className="vize-consult-success-title">Project Request Received</h4>
                    <p className="vize-consult-success-desc">
                      Thank you. Our technical surface specialist will review your project parameters and contact you within 2 business hours.
                    </p>
                    <button
                      type="button"
                      className="vize-consult-reset-btn"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Submit Another Project
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="vize-consult-form">
                    
                    {/* Row 1: Project Type & Approx Area */}
                    <div className="vize-consult-fields-row">
                      <div className="vize-consult-field">
                        <label>Project Type</label>
                        <div className="vize-consult-select-wrap">
                          <select
                            required
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          >
                            <option value="">Select an option</option>
                            <option value="Commercial Interior">Commercial Interior</option>
                            <option value="Industrial Warehouse">Industrial Warehouse / Logistics</option>
                            <option value="Residential Villa">Residential Villa / Living</option>
                            <option value="Healthcare & Lab">Healthcare / Clinical Lab</option>
                            <option value="Food & Beverage">Food & Beverage Facility</option>
                            <option value="Outdoor Driveway">Outdoor Driveway / Terrace</option>
                          </select>
                          <ChevronDown size={14} className="vize-consult-select-chevron" />
                        </div>
                      </div>

                      <div className="vize-consult-field">
                        <label>Approv. Area</label>
                        <div className="vize-consult-select-wrap">
                          <select
                            required
                            value={formData.approxArea}
                            onChange={(e) => setFormData({ ...formData, approxArea: e.target.value })}
                          >
                            <option value="">Select an option</option>
                            <option value="Under 500 sq.ft">Under 500 sq.ft</option>
                            <option value="500 - 2,000 sq.ft">500 - 2,000 sq.ft</option>
                            <option value="2,000 - 5,000 sq.ft">2,000 - 5,000 sq.ft</option>
                            <option value="5,000 - 15,000 sq.ft">5,000 - 15,000 sq.ft</option>
                            <option value="15,000+ sq.ft">15,000+ sq.ft (Industrial Scale)</option>
                          </select>
                          <ChevronDown size={14} className="vize-consult-select-chevron" />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Location & Required Finish */}
                    <div className="vize-consult-fields-row">
                      <div className="vize-consult-field">
                        <label>Location</label>
                        <div className="vize-consult-select-wrap">
                          <select
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          >
                            <option value="">Select an option</option>
                            <option value="Mumbai & MMR">Mumbai & MMR</option>
                            <option value="Pune & Maharashtra">Pune & Maharashtra</option>
                            <option value="Delhi NCR">Delhi NCR & North India</option>
                            <option value="Bangalore & Karnataka">Bangalore & Karnataka</option>
                            <option value="Hyderabad & Telangana">Hyderabad & Telangana</option>
                            <option value="Chennai & Tamil Nadu">Chennai & Tamil Nadu</option>
                            <option value="Gujarat Industrial Belt">Gujarat Industrial Belt</option>
                            <option value="Other Pan-India">Other Pan-India Location</option>
                          </select>
                          <ChevronDown size={14} className="vize-consult-select-chevron" />
                        </div>
                      </div>

                      <div className="vize-consult-field">
                        <label>Required Finish</label>
                        <div className="vize-consult-select-wrap">
                          <select
                            required
                            value={formData.requiredFinish}
                            onChange={(e) => setFormData({ ...formData, requiredFinish: e.target.value })}
                          >
                            <option value="">Select an option</option>
                            <option value="Metallic Flow (High Gloss)">Metallic Flow (High Gloss 3D)</option>
                            <option value="Flake Texture (Anti-Slip)">Flake Texture (High-Traffic)</option>
                            <option value="Stone Carpet (Permeable)">Stone Carpet (Natural Quartz)</option>
                            <option value="Non-Porous Satin (Hygienic)">Non-Porous Satin (Easy-Clean)</option>
                            <option value="Heavy Duty PolyScreed 6mm">Heavy Duty PolyScreed 6mm</option>
                            <option value="Undecided / Need Guidance">Undecided / Need Expert Guidance</option>
                          </select>
                          <ChevronDown size={14} className="vize-consult-select-chevron" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="vize-consult-action">
                      <button type="submit" className="vize-consult-submit-btn">
                        <span>Get Expert Advice</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* =========================================================================
          7. CASE STUDY DETAIL POPUP MODAL
         ========================================================================= */}
      {selectedCaseStudy && (
        <div
          className="vize-case-modal-backdrop"
          onClick={() => setSelectedCaseStudy(null)}
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
              onClick={() => setSelectedCaseStudy(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="vize-case-modal-media">
              <img
                src={selectedCaseStudy.image}
                alt={selectedCaseStudy.title}
                className="vize-case-modal-img"
              />
            </div>

            <div className="vize-case-modal-content">
              <span className="vize-case-modal-eyebrow">{selectedCaseStudy.eyebrow}</span>
              <h3 className="vize-case-modal-title">{selectedCaseStudy.title}</h3>
              <p className="vize-case-modal-desc">{selectedCaseStudy.tagline}</p>

              <div className="vize-case-modal-matrix">
                <div className="vize-modal-matrix-item">
                  <span>Application</span>
                  <strong>{selectedCaseStudy.application}</strong>
                </div>
                <div className="vize-modal-matrix-item">
                  <span>System Installed</span>
                  <strong>{selectedCaseStudy.system}</strong>
                </div>
                <div className="vize-modal-matrix-item">
                  <span>Finish Specification</span>
                  <strong>{selectedCaseStudy.finish}</strong>
                </div>
                <div className="vize-modal-matrix-item">
                  <span>Project Area</span>
                  <strong>{selectedCaseStudy.area}</strong>
                </div>
              </div>

              <div className="vize-case-modal-highlight-box">
                <Sparkles size={16} className="vize-modal-sparkle" />
                <span><strong>Key Result:</strong> {selectedCaseStudy.highlight}</span>
              </div>

              <div className="vize-case-modal-actions">
                <Link
                  to="/flooring-systems"
                  className="vize-modal-explore-btn"
                  onClick={() => setSelectedCaseStudy(null)}
                >
                  <span>Explore Similar System</span>
                  <ArrowUpRight size={16} />
                </Link>
                <a
                  href="#consultation-form"
                  className="vize-modal-quote-btn"
                  onClick={() => setSelectedCaseStudy(null)}
                >
                  <span>Request Custom Specification</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
