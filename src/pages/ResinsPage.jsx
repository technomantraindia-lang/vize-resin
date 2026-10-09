import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ArrowUpRight,
  ChevronDown,
  MessageSquare,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight
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



export default function ResinsPage() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const s = window.location.search;
      if (p === '/casting-art' || s.includes('casting')) return 'Casting & Art';
      if (p === '/coatings' || s.includes('coating')) return 'Protective Coatings';
      if (p === '/flooring-resins' || s.includes('flooring')) return 'Flooring Resins';
    }
    return 'All Materials';
  });
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

    if (location.pathname === '/casting-art' || location.search.includes('casting')) {
      setActiveCategory('Casting & Art');
    } else if (location.pathname === '/coatings' || location.search.includes('coating')) {
      setActiveCategory('Protective Coatings');
    } else if (location.pathname === '/flooring-resins' || location.search.includes('flooring')) {
      setActiveCategory('Flooring Resins');
    } else if (location.pathname === '/resins' || location.pathname === '/products') {
      if (!location.search) {
        setActiveCategory('All Materials');
      }
    }
  }, [location.pathname, location.search]);

  const [liveProducts, setLiveProducts] = useState(productsData);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/vize/products');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setLiveProducts(json.data);
          }
        }
      } catch (e) {
        // Fallback gracefully to products.json
      }
    };
    fetchLiveProducts();
    return () => { isMounted = false; };
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
    return liveProducts
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
          const matchesName = (product.name || '').toLowerCase().includes(query);
          const matchesDesc = (product.tagline || '').toLowerCase().includes(query);
          const matchesTag = (product.applicationTag || '').toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.basePrice ?? a.base_price ?? 0);
        const priceB = Number(b.basePrice ?? b.base_price ?? 0);
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        return 0; // 'featured' retains original catalogue order
      });
  }, [liveProducts, activeCategory, selectedFilters, searchQuery, sortBy]);

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

                {/* Clean, Minimal 3-Column Product Cards Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="vize-resins-cards-grid">
                    {filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        className="vize-resins-product-card"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="vize-resins-card-visual-link"
                          aria-label={`View ${product.name}`}
                        >
                          {Array.isArray(product.images) && product.images.length > 0 && product.images[0].startsWith('/uploads') ? (
                            <div className="vize-logo-card-wrapper flex items-center justify-center p-3">
                              <img src={product.images[0]} alt={product.name} className="max-h-36 object-contain" />
                            </div>
                          ) : (
                            <ProductBucketVisual id={product.id} name={product.name} />
                          )}
                        </Link>

                        <div className="vize-resins-card-info">
                          <div className="vize-resins-tag-box">
                            <span className="vize-resins-app-tag">
                              {product.applicationTag}
                            </span>
                            <span className="vize-resins-cat-tag">
                              {product.category}
                            </span>
                          </div>

                          <h3 className="vize-resins-card-title">
                            <Link to={`/product/${product.id}`} className="vize-resins-title-link">
                              {product.name}
                            </Link>
                          </h3>
                          
                          <p className="vize-resins-card-desc">
                            {product.tagline}
                          </p>

                          <div className="vize-resins-card-footer">
                            <div className="vize-card-price-group">
                              <span className="vize-card-price-lbl">Starting Price</span>
                              <strong className="vize-card-price-val">
                                ₹{Number(product.basePrice ?? product.base_price ?? 0).toLocaleString('en-IN')}
                              </strong>
                            </div>

                            <Link
                              to={`/product/${product.id}`}
                              className="vize-resins-view-link"
                            >
                              <span>View Product</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
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
