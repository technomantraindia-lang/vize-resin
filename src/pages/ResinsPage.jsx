import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowUpRight,
  ChevronDown,
  MessageSquare,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Layers,
  Flame,
  Droplets
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductBucketVisual from '../components/ProductBucketVisual';
import productsData from '../data/products.json';

const CATEGORY_TABS = [
  'All Materials',
  'Flooring Resins',
  'Casting & Art',
  'Protective Coatings',
  'Finishing Compounds'
];

const APPLICATION_FILTERS = [
  'Primers & sealers',
  'Screeding systems',
  'Stone binders',
  'Decorative topcoats',
  'Protective topcoats',
  'Casting & art',
  'Finishing compounds'
];

// Rich technical specs for the hover-extension drawer
const MATERIAL_SPECS = {
  'vize-prime': {
    chemistry: '100% Pure Epoxy Primer & Substrate Sealer',
    cure: '6–8 hrs tack-free',
    potLife: '35 mins @ 25°C',
    coverage: '~250 sq.ft / 5kg kit',
    grade: 'Industrial Substrate Prep',
    features: ['Penetrates porous concrete pores', 'Eliminates pinhole outgassing', 'Extreme mechanical interlock bond']
  },
  'vize-polyscreed': {
    chemistry: '3-Part High-Load Epoxy Levelling Screed',
    cure: '12–16 hrs full cure',
    potLife: '40 mins mortar mix',
    coverage: '50 sq.ft @ 3mm depth',
    grade: 'Heavy Industrial Mortar',
    features: ['Withstands heavy forklift loads', 'Repairs deep concrete spalls', 'Zero-shrinkage monolithic cure']
  },
  'vize-rock-hard': {
    chemistry: 'UV-Aliphatic Stone Carpet Matrix',
    cure: '12–18 hrs foot traffic',
    potLife: '30 mins open time',
    coverage: 'Binds 75kg stone / 5kg',
    grade: 'Exterior & Interior Paving',
    features: ['100% UV-stable non-yellowing', 'Permeable water drainage matrix', 'Firmly encapsulates natural pebbles']
  },
  'vize-marble-metallics': {
    chemistry: 'High-Gloss 3D Self-Leveling Metallic Epoxy',
    cure: '8–12 hrs walk-on',
    potLife: '45 mins vein styling',
    coverage: '~150 sq.ft / 15kg pack',
    grade: 'Luxury Retail & Showrooms',
    features: ['Mirror glass reflective gloss', 'Deep iridescent fluid veins', 'Seamless hygienic designer floor']
  },
  'vize-marble-slowpro': {
    chemistry: 'Extended Pot-Life Designer Metallic Epoxy',
    cure: '18–24 hrs slow cure',
    potLife: '60+ mins extended open time',
    coverage: '~150 sq.ft / 15kg pack',
    grade: 'Artisan Floor Masters',
    features: ['Ample time for complex veins', 'Zero premature gelling during pour', 'Ultra-deep color cell dispersion']
  },
  'vize-polyaspartic': {
    chemistry: 'Ultra-Fast 2-Part Aliphatic Polyaspartic',
    cure: '2–4 hrs rapid handover',
    potLife: '20 mins fast set',
    coverage: '~350 sq.ft / 5kg kit',
    grade: 'Commercial Exterior Topcoat',
    features: ['4-Hour rapid return to service', '100% UV & weather proof', 'Superior hot-tire pickup resistance']
  },
  'vize-glasscoat': {
    chemistry: '1K High-Hardness Polyurethane Topcoat',
    cure: '6–8 hrs tack-free',
    potLife: 'Single-component ready',
    coverage: '~380 sq.ft / 4kg can',
    grade: 'Scratch & Chemical Shield',
    features: ['Zero ratio mixing errors', 'Micro-scratch self healing', 'Resistant to harsh acids and oils']
  },
  'vize-cast': {
    chemistry: 'Water-Clear Deep Casting Epoxy (50mm)',
    cure: '24–36 hrs demold',
    potLife: '90 mins low exotherm',
    coverage: '50mm single pour depth',
    grade: 'River Tables & Wood Casts',
    features: ['Self-degassing zero bubbles', 'Zero odor 100% solids matrix', 'Diamond crystal transparency']
  },
  'vize-supercast': {
    chemistry: 'Massive Depth Slab Casting Epoxy (100mm)',
    cure: '48–72 hrs controlled cure',
    potLife: '180 mins continuous pour',
    coverage: '100mm single deep pour',
    grade: 'Heavy Timber Architecture',
    features: ['Ultra-low thermal heat buildup', 'No warping or shrink tension', 'Museum preservation clarity']
  },
  'vize-maxart': {
    chemistry: 'High-Viscosity Art & Craft Epoxy',
    cure: '12–16 hrs cured',
    potLife: '45 mins pattern work',
    coverage: '~25 sq.ft / 1.5kg kit',
    grade: 'Resin Art & Coasters',
    features: ['High dome surface tension', 'Vibrant metallic pigment hold', 'HNA UV inhibitors against yellowing']
  },
  'vize-cutmax': {
    chemistry: 'Step 1 Heavy Fast-Cut Nano Compound',
    cure: 'Instant buffing',
    potLife: 'Water-based nano emulsion',
    coverage: 'Removes 1500-grit scratches',
    grade: 'Surface Restorer',
    features: ['Rapidly removes sanding marks', 'No silicone or filler mask', 'Low-dust clean wiping']
  },
  'vize-shinemax': {
    chemistry: 'Step 2 Optical Mirror Glaze Polish',
    cure: 'Instant showroom shine',
    potLife: 'Ultra-fine finishing cream',
    coverage: '95+ GU Optical Gloss',
    grade: 'Final High-Gloss Finish',
    features: ['Removes holograms & buffer swirls', 'Showroom reflection clarity', 'Safe on cured epoxy & poly']
  }
};

export default function ResinsPage() {
  const [activeCategory, setActiveCategory] = useState('All Materials');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [expertFormSubmitted, setExpertFormSubmitted] = useState(false);
  const [expertFormData, setExpertFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'General Flooring / Resin Inquiry',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter Toggle Handler
  const toggleFilter = (filterName) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName)
        ? prev.filter((f) => f !== filterName)
        : [...prev, filterName]
    );
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        // 1. Category Tab match
        if (activeCategory !== 'All Materials') {
          if (product.category !== activeCategory) return false;
        }

        // 2. Application checkbox filters match
        if (selectedFilters.length > 0) {
          if (!selectedFilters.includes(product.applicationCategory)) {
            return false;
          }
        }

        // 3. Search query match
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesDesc = product.tagline?.toLowerCase().includes(query);
          const matchesTag = product.applicationTag?.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-low') return a.basePrice - b.basePrice;
        if (sortBy === 'price-high') return b.basePrice - a.basePrice;
        return 0; // 'featured' retains original catalogue order
      });
  }, [activeCategory, selectedFilters, searchQuery, sortBy]);

  const handleExpertSubmit = (e) => {
    e.preventDefault();
    setExpertFormSubmitted(true);
  };

  return (
    <div className="vize-resins-page-root">
      <Header />

      <main className="vize-resins-main-container">
        {/* =========================================================================
            1. BREADCRUMBS
           ========================================================================= */}
        <div className="vize-resins-breadcrumbs-wrap">
          <div className="vize-resins-center-frame">
            <div className="vize-resins-breadcrumbs">
              <Link to="/" className="vize-resins-crumb-link">Home</Link>
              <span className="vize-resins-crumb-sep">/</span>
              <span className="vize-resins-crumb-current">Resins</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. HERO BANNER WITH RIGHT FLUID ART CUTOUT
           ========================================================================= */}
        <section className="vize-resins-hero-section">
          <div className="vize-resins-center-frame">
            <div className="vize-resins-hero-grid">
              <div className="vize-resins-hero-text-col">
                <span className="vize-resins-hero-eyebrow">
                  VIZE INDUSTRIAL FLOORING & RESIN SYSTEMS
                </span>
                <h1 className="vize-resins-hero-heading">
                  The right material. <em className="vize-resins-hero-italic">Every step.</em>
                </h1>
                <p className="vize-resins-hero-sub">
                  Epoxy, polyaspartic and surface solutions for your next project.
                </p>
              </div>

              <div className="vize-resins-hero-visual-col">
                <div className="vize-resins-hero-cutout-frame">
                  <img
                    src="/Metallic Resin Flooring.png"
                    alt="Vize Specialty Polymer Resin Surface"
                    className="vize-resins-cutout-img"
                  />
                  <div className="vize-resins-cutout-glow" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. CATEGORY TABS ROW
           ========================================================================= */}
        <section className="vize-resins-tabs-section">
          <div className="vize-resins-center-frame">
            <div className="vize-resins-tabs-row">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`vize-resins-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategory(tab)}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MAIN CATALOG LAYOUT (SIDEBAR + 3-COLUMN PRODUCT GRID)
           ========================================================================= */}
        <section className="vize-resins-catalog-section">
          <div className="vize-resins-center-frame">
            <div className="vize-resins-layout-grid">
              
              {/* ===== LEFT SIDEBAR: FILTERS & NEED HELP CARD ===== */}
              <aside className="vize-resins-sidebar">
                <div className="vize-resins-filter-group">
                  <h3 className="vize-resins-sidebar-title">Refine by application</h3>
                  <div className="vize-resins-checkbox-list">
                    {APPLICATION_FILTERS.map((filter) => {
                      const isChecked = selectedFilters.includes(filter);
                      return (
                        <label key={filter} className="vize-resins-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilter(filter)}
                            className="vize-resins-custom-checkbox"
                          />
                          <span className="vize-resins-checkbox-text">{filter}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Need Help Choosing Card */}
                <div className="vize-resins-help-card">
                  <div className="vize-resins-help-icon">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="vize-resins-help-title">Need help choosing?</h4>
                  <button
                    type="button"
                    className="vize-resins-help-btn"
                    onClick={() => {
                      setExpertFormSubmitted(false);
                      setIsExpertModalOpen(true);
                    }}
                  >
                    <span>Ask an expert</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </aside>

              {/* ===== RIGHT CONTENT: SEARCH BAR & 3-COL PRODUCT GRID ===== */}
              <div className="vize-resins-products-area">
                
                {/* Search & Sort Controls Bar */}
                <div className="vize-resins-controls-bar">
                  <div className="vize-resins-search-wrapper">
                    <Search size={16} className="vize-resins-search-icon" />
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="vize-resins-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="vize-resins-search-clear"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="vize-resins-controls-right">
                    <span className="vize-resins-materials-count">
                      {filteredProducts.length} materials
                    </span>
                    <div className="vize-resins-sort-select-wrap">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="vize-resins-sort-select"
                      >
                        <option value="featured">Featured</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                      <ChevronDown size={14} className="vize-resins-sort-chevron" />
                    </div>
                  </div>
                </div>

                {/* 3-Column Product Cards Grid with Full-Row Expansion on Hover */}
                {filteredProducts.length > 0 ? (
                  <div className="vize-resins-cards-container">
                    {Array.from({ length: Math.ceil(filteredProducts.length / 3) }).map((_, rowIndex) => {
                      const rowProducts = filteredProducts.slice(rowIndex * 3, rowIndex * 3 + 3);

                      return (
                        <div key={rowIndex} className="vize-resins-cards-row">
                          {rowProducts.map((product, colIndex) => {
                            const specs = MATERIAL_SPECS[product.id] || {
                              chemistry: product.tagline || 'High-performance chemical resin matrix',
                              cure: '6–8 hrs tack-free',
                              potLife: '30 mins work time',
                              coverage: 'Covers ~200 sq.ft',
                              grade: product.category,
                              features: ['100% Solid formulation', 'Seamless monolithic cure', 'Professional grade']
                            };

                            return (
                              <article
                                key={product.id}
                                className={`vize-resins-product-card col-${colIndex}`}
                              >
                                {/* Default Normal Card Face */}
                                <div className="vize-card-normal-face">
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="vize-resins-card-visual-link"
                                    aria-label={`View ${product.name}`}
                                  >
                                    <ProductBucketVisual id={product.id} name={product.name} />
                                  </Link>

                                  <div className="vize-resins-card-info">
                                    <h3 className="vize-resins-card-title">
                                      <Link to={`/product/${product.id}`} className="vize-resins-title-link">
                                        {product.name}
                                      </Link>
                                    </h3>
                                    
                                    <p className="vize-resins-card-desc">
                                      {product.tagline}
                                    </p>

                                    <div className="vize-resins-tag-box">
                                      <span className="vize-resins-app-tag">
                                        {product.applicationTag}
                                      </span>
                                    </div>

                                    <div className="vize-resins-card-action">
                                      <Link
                                        to={`/product/${product.id}`}
                                        className="vize-resins-view-link"
                                      >
                                        <span>View product</span>
                                        <ArrowUpRight size={14} />
                                      </Link>
                                    </div>
                                  </div>
                                </div>

                                {/* =========================================================================
                                    FULL-ROW EXPANDED HOVER BANNER (TAKES FULL 3-COLUMN WIDTH)
                                    - Col 0 (Left Card): Expands to the right across all 3 cards
                                    - Col 1 (Middle Card): Expands outwards to both left & right
                                    - Col 2 (Right Card): Expands to the left across all 3 cards
                                    - Layout: Left side = Image/Logo | Right side = Rich Info & Specs
                                   ========================================================================= */}
                                <div className={`vize-card-fullrow-expanded expand-from-col-${colIndex}`}>
                                  
                                  {/* Left Visual Column */}
                                  <div className="vize-fullrow-visual-col">
                                    <div className="vize-fullrow-logo-stage">
                                      <ProductBucketVisual id={product.id} name={product.name} />
                                    </div>
                                    <div className="vize-fullrow-badges-row">
                                      <span className="vize-fullrow-app-badge">{product.applicationTag}</span>
                                      <span className="vize-fullrow-cat-badge">{product.category}</span>
                                    </div>
                                  </div>

                                  {/* Right Detailed Info Column */}
                                  <div className="vize-fullrow-info-col">
                                    <div className="vize-fullrow-top-bar">
                                      <span className="vize-fullrow-eyebrow">
                                        <Sparkles size={13} className="vize-drawer-sparkle" />
                                        MATERIAL SPECIFICATIONS
                                      </span>
                                      <span className="vize-fullrow-grade-tag">{specs.grade}</span>
                                    </div>

                                    <div className="vize-fullrow-heading-group">
                                      <h3 className="vize-fullrow-title">{product.name}</h3>
                                      <p className="vize-fullrow-chemistry">{specs.chemistry}</p>
                                    </div>

                                    {/* 4-Stat Micro Matrix */}
                                    <div className="vize-fullrow-specs-matrix">
                                      <div className="vize-fullrow-spec-item">
                                        <div className="vize-spec-label-row">
                                          <Clock size={13} />
                                          <span>CURE TIME</span>
                                        </div>
                                        <strong>{specs.cure}</strong>
                                      </div>

                                      <div className="vize-fullrow-spec-item">
                                        <div className="vize-spec-label-row">
                                          <Droplets size={13} />
                                          <span>POT LIFE</span>
                                        </div>
                                        <strong>{specs.potLife}</strong>
                                      </div>

                                      <div className="vize-fullrow-spec-item">
                                        <div className="vize-spec-label-row">
                                          <Layers size={13} />
                                          <span>COVERAGE</span>
                                        </div>
                                        <strong>{specs.coverage}</strong>
                                      </div>

                                      <div className="vize-fullrow-spec-item">
                                        <div className="vize-spec-label-row">
                                          <ShieldCheck size={13} />
                                          <span>APPLICATION</span>
                                        </div>
                                        <strong>{product.applicationTag}</strong>
                                      </div>
                                    </div>

                                    {/* Key Advantages Checklist */}
                                    <div className="vize-fullrow-advantages">
                                      <span className="vize-fullrow-adv-title">Key Advantages:</span>
                                      <ul className="vize-fullrow-adv-list">
                                        {specs.features.map((feature, fi) => (
                                          <li key={fi}>
                                            <Check size={14} className="vize-benefit-check" />
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Bottom Footer Bar with Price and CTA Button */}
                                    <div className="vize-fullrow-bottom-bar">
                                      <div className="vize-fullrow-price-block">
                                        <span className="vize-fullrow-price-lbl">Starting Pack Price</span>
                                        <strong className="vize-fullrow-price-amt">
                                          ₹{product.basePrice.toLocaleString('en-IN')}
                                        </strong>
                                      </div>

                                      <Link
                                        to={`/product/${product.id}`}
                                        className="vize-fullrow-cta-btn"
                                      >
                                        <span>View Full Product Details</span>
                                        <ArrowRight size={15} />
                                      </Link>
                                    </div>
                                  </div>

                                </div>

                              </article>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="vize-resins-no-results">
                    <p>No materials matched your filter criteria.</p>
                    <button
                      type="button"
                      className="vize-resins-reset-btn"
                      onClick={() => {
                        setActiveCategory('All Materials');
                        setSelectedFilters([]);
                        setSearchQuery('');
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            5. TOOLS & MACHINERY SECTION AT BOTTOM (MATCHING REFERENCE)
           ========================================================================= */}
        <section className="vize-resins-tools-section">
          <div className="vize-resins-center-frame vize-resins-tools-relative">
            <div className="vize-resins-tools-container">
              
              {/* Left Content: Headline, Bullets & CTA */}
              <div className="vize-resins-tools-text-col">
                <h2 className="vize-resins-tools-headline">
                  Tools for <em className="vize-resins-tools-italic">every stage.</em>
                </h2>
                <h3 className="vize-resins-tools-subhead">
                  Vize Tools & Machinery
                </h3>
                <p className="vize-resins-tools-bullets">
                  Spiked shoes • Rollers • Mixing paddles • Sanding supplies<br />
                  Floor grinders • Scarifiers • Mixing machines
                </p>
                <Link to="/workshop" className="vize-resins-tools-btn">
                  <span>Explore workshop</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* =========================================================================
          6. "ASK AN EXPERT" CONSULTATION MODAL
         ========================================================================= */}
      {isExpertModalOpen && (
        <div
          className="vize-resins-modal-backdrop"
          onClick={() => setIsExpertModalOpen(false)}
        >
          <div
            className="vize-resins-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="vize-resins-modal-close"
              onClick={() => setIsExpertModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {expertFormSubmitted ? (
              <div className="vize-resins-modal-success">
                <CheckCircle2 size={48} className="vize-success-green-icon" />
                <h3 className="vize-success-modal-title">Consultation Requested</h3>
                <p className="vize-success-modal-desc">
                  Thank you, <strong>{expertFormData.name || 'Valued Client'}</strong>. Our polymer chemical specialists will review your requirements and reach out within 2 hours.
                </p>
                <button
                  type="button"
                  className="vize-resins-modal-done-btn"
                  onClick={() => setIsExpertModalOpen(false)}
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <div className="vize-resins-modal-form-wrap">
                <span className="vize-resins-modal-eyebrow">APPLICATION ADVISORY</span>
                <h3 className="vize-resins-modal-title">Ask a Polymer Specialist</h3>
                <p className="vize-resins-modal-sub">
                  Tell us about your project or substrate conditions for dosage and material recommendations.
                </p>

                <form onSubmit={handleExpertSubmit} className="vize-resins-form">
                  <div className="vize-resins-form-row">
                    <div className="vize-resins-field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vivek Sharma"
                        value={expertFormData.name}
                        onChange={(e) => setExpertFormData({ ...expertFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="vize-resins-field">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={expertFormData.phone}
                        onChange={(e) => setExpertFormData({ ...expertFormData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="vize-resins-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="contact@domain.com"
                      value={expertFormData.email}
                      onChange={(e) => setExpertFormData({ ...expertFormData, email: e.target.value })}
                    />
                  </div>

                  <div className="vize-resins-field">
                    <label>Project Details / Substrate Type</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Concrete workshop floor with minor moisture, need heavy forklift screed..."
                      value={expertFormData.notes}
                      onChange={(e) => setExpertFormData({ ...expertFormData, notes: e.target.value })}
                    />
                  </div>

                  <div className="vize-resins-modal-actions">
                    <button type="submit" className="vize-resins-submit-btn">
                      <span>Submit Request</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
