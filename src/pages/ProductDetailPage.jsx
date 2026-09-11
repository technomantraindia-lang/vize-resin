import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Play,
  X,
  Star,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  ZoomIn,
  Palette,
  Check,
  Search,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import productsData from '../data/products.json';
import { ALL_COLORS, COLOR_CATEGORIES } from '../data/colors';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // 1. Resolve active product based on ID or fallback route
  const product = useMemo(() => {
    if (id) {
      const found = productsData.find((p) => p.id === id);
      if (found) return found;
    }
    const path = location.pathname.toLowerCase();
    if (path.includes('casting')) return productsData.find((p) => p.id === 'cast-max') || productsData[0];
    if (path.includes('coating')) return productsData.find((p) => p.id === 'aspartic-max') || productsData[0];
    if (path.includes('primer')) return productsData.find((p) => p.id === 'primex') || productsData[0];
    if (path.includes('art')) return productsData.find((p) => p.id === 'art-max') || productsData[0];
    return productsData[0];
  }, [id, location.pathname]);

  // 2. Interactive state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('petrol-teal');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'

  // Modals state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isColorCatalogOpen, setIsColorCatalogOpen] = useState(false);

  // Color Catalog Modal filter state
  const [catalogTab, setCatalogTab] = useState('All Shades');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Cart Toast State
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  // Reviews state
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Reset defaults when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSizeId(product.sizes?.[1]?.id || product.sizes?.[0]?.id || '');
      setSelectedColorId(product.samples?.[0]?.id || 'petrol-teal');
      setQuantity(1);
      setActiveTab('details');
      setReviewsList(product.reviews || []);
      setReviewSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  // Selected variant size object
  const selectedSize = useMemo(() => {
    return product.sizes?.find((s) => s.id === selectedSizeId) || null;
  }, [product, selectedSizeId]);

  // Selected color object
  const selectedColor = useMemo(() => {
    return ALL_COLORS.find((c) => c.id === selectedColorId) || ALL_COLORS[0];
  }, [selectedColorId]);

  // Hovered color preview on left main image
  const [hoveredColor, setHoveredColor] = useState(null);

  // Big Color Dropdown on hover state
  const [dropdownCategory, setDropdownCategory] = useState('All');
  const [isColorDropdownHovered, setIsColorDropdownHovered] = useState(false);

  // Active display image on the left side (shows hovered color texture on hover, or product image)
  const activeDisplay = useMemo(() => {
    if (hoveredColor) {
      return {
        src: hoveredColor.image,
        alt: `${hoveredColor.name} metallic finish preview`,
        isColorFinish: true,
        isCutout: false,
        title: hoveredColor.name,
        category: hoveredColor.category || 'Finish Swatch'
      };
    }
    const currentSrc = product.images[selectedImageIndex] || product.images[0];
    const isCutout = currentSrc?.includes('bucket') || (currentSrc?.endsWith('.png') && !currentSrc?.includes('hero') && !currentSrc?.includes('color'));
    return {
      src: currentSrc,
      alt: product.name,
      isColorFinish: false,
      isCutout: isCutout,
      title: product.name,
      category: product.category
    };
  }, [hoveredColor, selectedImageIndex, product]);

  // Filtered colors for big hover dropdown
  const dropdownColors = useMemo(() => {
    if (dropdownCategory === 'All') return ALL_COLORS;
    return ALL_COLORS.filter((c) => c.category.toLowerCase() === dropdownCategory.toLowerCase());
  }, [dropdownCategory]);

  // Filtered colors for catalog modal
  const filteredColors = useMemo(() => {
    return ALL_COLORS.filter((c) => {
      const matchCat = catalogTab === 'All Shades' || c.category.toLowerCase() === catalogTab.toLowerCase();
      const matchSearch = !catalogSearch.trim() ||
        c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        c.desc.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [catalogTab, catalogSearch]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a kit size option first.');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity, true);
    const msg = `Added ${quantity} × ${product.name} (${selectedSize.label} • Color: ${selectedColor.name}) to cart.`;
    setCartSuccessMessage(msg);
    setTimeout(() => setCartSuccessMessage(''), 4000);
  };

  // Handle Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      role: 'Verified Buyer',
      rating: reviewRating,
      date: 'Just now',
      title: 'Customer Review',
      comment: reviewComment.trim(),
    };

    setReviewsList([newReview, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewAuthor('');
      setReviewComment('');
      setReviewSubmitted(false);
    }, 1200);
  };

  // Other products for "More products" row (excluding current)
  const moreProducts = useMemo(() => {
    return productsData.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

  return (
    <div className="vize-exact-pdp-root">
      <Header />

      {/* Cart Feedback Toast */}
      {cartSuccessMessage && (
        <div className="vize-cart-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} className="toast-check-icon" />
          <span>{cartSuccessMessage}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setCartSuccessMessage('')}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="vize-pdp-main-container">
        
        {/* Breadcrumbs */}
        <nav className="vize-pdp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-arrow">›</span>
          <Link to="/resins">Resins</Link>
          <span className="breadcrumb-arrow">›</span>
          <span className="breadcrumb-active">{product.name}</span>
        </nav>

        {/* =========================================================================
            1. PRODUCT GALLERY AND PURCHASE DETAILS (2 Columns)
           ========================================================================= */}
        <section className="vize-pdp-hero-grid" aria-label="Product overview and purchase">
          
          {/* Left Column: Gallery */}
          <div className="vize-pdp-gallery-col">
            <div
              className={`vize-pdp-main-image-card ${activeDisplay.isColorFinish ? 'is-finish-active' : ''}`}
              onClick={() => setIsLightboxOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
              aria-label="Click to enlarge product image"
            >
              <img
                key={activeDisplay.src}
                src={activeDisplay.src}
                alt={activeDisplay.alt}
                className={`vize-pdp-main-img ${activeDisplay.isCutout ? 'is-contain' : ''} ${activeDisplay.isColorFinish ? 'finish-preview dynamic-fade' : ''}`}
              />

              {/* Live Color / Finish Preview Floating Badge on Left Image */}
              {activeDisplay.isColorFinish && (
                <div className="vize-pdp-live-badge">
                  <Sparkles size={12} color="#ffffff" />
                  <span>Previewing Finish: <strong>{activeDisplay.title}</strong></span>
                </div>
              )}

              <div className="vize-pdp-zoom-hint" title="Zoom in">
                <ZoomIn size={18} />
              </div>
            </div>

            {/* Clickable Thumbnails */}
            <div className="vize-pdp-thumbnails-row" role="tablist" aria-label="Product thumbnails">
              {product.images.map((imgSrc, idx) => {
                const isCutout = imgSrc.includes('bucket') || imgSrc.endsWith('.png');
                const isCurrent = !activeDisplay.isColorFinish && selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    className={`vize-pdp-thumb-card ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setHoveredColor(null);
                    }}
                    aria-label={`View product image ${idx + 1}`}
                  >
                    <img
                      src={imgSrc}
                      alt=""
                      className={`vize-pdp-thumb-img ${isCutout ? 'is-contain' : ''}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Purchase Details */}
          <div className="vize-pdp-details-col">
            
            {/* Category Tag */}
            <span className="vize-pdp-category-tag">{product.category}</span>

            {/* Heading: Product Name with Italic Suffix */}
            <h1 className="vize-pdp-title">
              {product.brand || product.name}{' '}
              {product.suffix && <em className="vize-pdp-title-italic">{product.suffix}</em>}
            </h1>

            {/* Tagline / Short Description */}
            <p className="vize-pdp-tagline">{product.tagline}</p>

            {/* Price Row */}
            <div className="vize-pdp-price-row">
              <span className="vize-pdp-currency">{product.currency}</span>
              <span className="vize-pdp-amount">
                {selectedSize ? selectedSize.price.toLocaleString('en-IN') : '—'}
              </span>
            </div>

            {/* Color / Metallic Shade Selector Block with Big Hover Dropdown */}
            <div
              className={`vize-pdp-color-dropdown-wrapper ${isColorDropdownHovered ? 'open' : ''}`}
              onMouseEnter={() => setIsColorDropdownHovered(true)}
              onMouseLeave={() => setIsColorDropdownHovered(false)}
            >
              <div className="vize-pdp-color-header">
                <label className="vize-pdp-select-label">
                  Select Shade / Finish
                </label>
                <span className="vize-pdp-color-hover-hint">
                  Hover to explore shades <ChevronDown size={13} className={`vize-hint-chevron ${isColorDropdownHovered ? 'rotate' : ''}`} />
                </span>
              </div>

              {/* Active Selection Trigger Bar */}
              <button
                type="button"
                className={`vize-pdp-color-trigger-bar ${isColorDropdownHovered ? 'active' : ''}`}
                onClick={() => setIsColorDropdownHovered((prev) => !prev)}
                aria-expanded={isColorDropdownHovered}
                aria-haspopup="listbox"
              >
                <div className="vize-trigger-left">
                  <div className="vize-trigger-thumb-box">
                    <img src={selectedColor.image} alt={selectedColor.name} className="vize-trigger-thumb-img" />
                  </div>
                  <div className="vize-trigger-meta">
                    <strong className="vize-trigger-name">{selectedColor.name}</strong>
                    <span className="vize-trigger-cat">{selectedColor.category} Finish</span>
                  </div>
                </div>
                <div className="vize-trigger-right">
                  <span className="vize-change-tag">Choose Color</span>
                  <ChevronDown size={16} className={`vize-trigger-chevron ${isColorDropdownHovered ? 'rotate' : ''}`} />
                </div>
              </button>

              {/* Big Mega Dropdown on Hover */}
              <div className="vize-pdp-mega-color-dropdown">
                
                {/* Dropdown Top Bar */}
                <div className="vize-dropdown-top-bar">
                  <div className="vize-dropdown-top-tabs">
                    {['All', 'Opaque', 'Metallic', 'Pearl Powder'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`vize-dropdown-tab-pill ${dropdownCategory === cat ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownCategory(cat);
                        }}
                      >
                        {cat} {cat === 'All' ? `(${ALL_COLORS.length})` : ''}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="vize-dropdown-modal-highlight-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsColorDropdownHovered(false);
                      setIsColorCatalogOpen(true);
                    }}
                    title="Open full-screen interactive color catalog"
                  >
                    <Palette size={13} />
                    <span>Catalog Modal ({ALL_COLORS.length})</span>
                  </button>
                </div>

                {/* 3-Column Rectangular Finish Samples Grid */}
                <div className="vize-dropdown-samples-grid">
                  {dropdownColors.map((color) => {
                    const isSelected = selectedColor.id === color.id;
                    const isHovered = hoveredColor?.id === color.id;
                    return (
                      <div
                        key={color.id}
                        className={`vize-dropdown-sample-card ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredColor(color)}
                        onMouseLeave={() => setHoveredColor(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColorId(color.id);
                        }}
                        role="button"
                        tabIndex={0}
                        title={`${color.name} - ${color.desc}`}
                      >
                        <div className="vize-dropdown-sample-img-box">
                          <img
                            src={color.image}
                            alt={`${color.name} finish`}
                            className="vize-dropdown-sample-img"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="vize-dropdown-check-pill">
                              <Check size={11} strokeWidth={3} /> Selected
                            </div>
                          )}
                        </div>
                        <div className="vize-dropdown-sample-info">
                          <span className="vize-dropdown-sample-name">{color.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown Bottom Bar */}
                <div className="vize-dropdown-bottom-bar">
                  <span>Selected: <strong>{selectedColor.name}</strong> ({selectedColor.category})</span>
                  <button
                    type="button"
                    className="vize-dropdown-confirm-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsColorDropdownHovered(false);
                    }}
                  >
                    Done
                  </button>
                </div>

              </div>
            </div>

            {/* Kit Size Variant Selector Dropdown */}
            <div className="vize-pdp-select-block">
              <label htmlFor="kit-size-select" className="vize-pdp-select-label">
                Select kit size
              </label>
              <div className="vize-pdp-select-wrapper">
                <select
                  id="kit-size-select"
                  className="vize-pdp-select"
                  value={selectedSizeId}
                  onChange={(e) => setSelectedSizeId(e.target.value)}
                >
                  <option value="">Choose an option</option>
                  {product.sizes?.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label} ({product.currency} {size.price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <ChevronDown size={17} className="vize-pdp-select-chevron" />
              </div>
            </div>

            {/* Quantity Stepper + Add To Cart Button */}
            <div className="vize-pdp-actions-row">
              <div className="vize-pdp-stepper" aria-label="Quantity selector">
                <button
                  type="button"
                  className="vize-stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="vize-stepper-value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="vize-stepper-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="vize-pdp-add-cart-btn"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>

            {/* Ask a Product Expert Button */}
            <button
              type="button"
              className="vize-pdp-expert-btn"
              onClick={() => setIsExpertModalOpen(true)}
            >
              <MessageSquare size={16} strokeWidth={1.8} />
              <span>Ask a product expert</span>
            </button>

            {/* Technical Data Sheet & Safety Data Sheet Links */}
            <div className="vize-pdp-docs-row">
              {product.tds && (
                <a
                  href={product.tds.url}
                  className="vize-pdp-doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Opening ${product.name} Technical Data Sheet (TDS)...`);
                  }}
                >
                  <span>Technical data sheet</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              {product.tds && product.sds && <span className="vize-doc-sep">|</span>}
              {product.sds && (
                <a
                  href={product.sds.url}
                  className="vize-pdp-doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Opening ${product.name} Safety Data Sheet (SDS)...`);
                  }}
                >
                  <span>Safety data sheet</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>

          </div>
        </section>

        {/* =========================================================================
            2. PRODUCT DETAILS AND REVIEWS TABS
           ========================================================================= */}
        <section className="vize-pdp-tabs-section" aria-label="Product specifications and reviews">
          
          {/* Tab Headers Row */}
          <div className="vize-pdp-tab-headers" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'details'}
              className={`vize-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reviews'}
              className={`vize-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews {reviewsList.length > 0 && `(${reviewsList.length})`}
            </button>
          </div>

          {/* Tab 1: Product Details Content */}
          {activeTab === 'details' && (
            <div className="vize-tab-panel vize-details-grid">
              
              {/* Left Column: About this product & Safety Precautions */}
              <div className="vize-about-col">
                <h2 className="vize-section-subheading">
                  About this <em>product.</em>
                </h2>
                <p className="vize-about-text">{product.aboutText}</p>

                {/* Safety & Handling Precautions */}
                <div className="vize-safety-precautions-card">
                  <div className="vize-safety-header">
                    <ShieldAlert size={17} className="vize-safety-icon" />
                    <h3 className="vize-safety-title">Safety & Handling Precautions</h3>
                  </div>
                  <ul className="vize-safety-list">
                    <li>
                      <strong>Personal Protection:</strong> Wear chemical-resistant nitrile gloves and safety goggles. Apply only in well-ventilated spaces.
                    </li>
                    <li>
                      <strong>Exotherm Warning:</strong> Mix strictly according to the specified TDS ratios. Avoid leaving large resin volumes unattended in deep mixing pails.
                    </li>
                    <li>
                      <strong>Contact First-Aid:</strong> In case of skin/eye contact, flush immediately with soap and plenty of clean water.
                    </li>
                    <li>
                      <strong>Storage & Disposal:</strong> Store sealed between 15°C – 25°C away from direct sunlight, moisture, and open flames. Dispose in accordance with local regulations.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Explore finish samples */}
              <div className="vize-samples-col">
                <div className="vize-samples-header">
                  <h2 className="vize-section-subheading">
                    Explore finish <em>samples.</em>
                  </h2>
                  <button
                    type="button"
                    className="vize-enquire-link"
                    onClick={() => setIsEnquiryModalOpen(true)}
                  >
                    <span>Enquire about samples</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>

                {/* 3 Compact Rectangular Finish Samples */}
                <div className="vize-samples-grid">
                  {product.samples?.map((sample) => {
                    const isSelected = selectedColor.id === sample.id;
                    const isHovered = hoveredColor?.id === sample.id;
                    return (
                      <div
                        key={sample.id}
                        className={`vize-sample-item ${isSelected ? 'active-sample' : ''} ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredColor(sample)}
                        onMouseLeave={() => setHoveredColor(null)}
                        onClick={() => setSelectedColorId(sample.id)}
                        role="button"
                        tabIndex={0}
                        title={`Preview & select ${sample.name} shade`}
                        aria-label={`Select ${sample.name} finish shade`}
                      >
                        <div className="vize-sample-img-box">
                          <img
                            src={sample.image}
                            alt={`${sample.name} finish`}
                            className="vize-sample-img"
                            loading="lazy"
                          />
                          {isSelected && <span className="vize-sample-check-pill">Selected</span>}
                        </div>
                        <span className="vize-sample-name">{sample.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="vize-samples-footer-row">
                  <p className="vize-illustrative-caption">Click a finish to select for your kit</p>
                  <button
                    type="button"
                    className="vize-view-all-colors-inline-link"
                    onClick={() => setIsColorCatalogOpen(true)}
                  >
                    <span>View all 18 metallic shades</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Reviews Content */}
          {activeTab === 'reviews' && (
            <div className="vize-tab-panel vize-reviews-panel">
              <div className="vize-reviews-top-bar">
                <div>
                  <h2 className="vize-section-subheading">
                    Customer <em>reviews.</em>
                  </h2>
                  <p className="vize-reviews-count-text">
                    {reviewsList.length === 0
                      ? 'No reviews yet. Be the first to review this product.'
                      : `Based on ${reviewsList.length} verified review${reviewsList.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <button
                  type="button"
                  className="vize-write-review-btn"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Write a review
                </button>
              </div>

              {reviewsList.length > 0 && (
                <div className="vize-reviews-list">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="vize-review-item-card">
                      <div className="vize-review-item-header">
                        <div>
                          <strong className="vize-review-author">{rev.author}</strong>
                          {rev.role && <span className="vize-review-role"> • {rev.role}</span>}
                        </div>
                        <span className="vize-review-date">{rev.date}</span>
                      </div>
                      <div className="vize-review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? '#8C4830' : 'none'}
                            color="#8C4830"
                          />
                        ))}
                      </div>
                      <h3 className="vize-review-title">{rev.title}</h3>
                      <p className="vize-review-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </section>

      </main>

      {/* =========================================================================
          3. USE DIRECTIONS AND APPLICATION VIDEO (Deep Petrol Teal Section)
         ========================================================================= */}
      <section className="vize-directions-section" aria-label="Application instructions and video">
        <div className="vize-pdp-main-container vize-directions-grid">
          
          {/* Left Column: How to use */}
          <div className="vize-how-to-col">
            <h2 className="vize-teal-heading">
              How to <em>use.</em>
            </h2>

            <div className="vize-steps-list">
              {product.howToUseSteps?.map((step) => (
                <div key={step.num} className="vize-step-row">
                  <span className="vize-step-number">{step.num}</span>
                  <span className="vize-step-desc">{step.text}</span>
                </div>
              ))}
            </div>

            <p className="vize-tds-footnote">
              Follow the product TDS and SDS for full instructions.
            </p>
          </div>

          {/* Right Column: Watch the application */}
          <div className="vize-watch-col">
            <h2 className="vize-teal-heading">
              Watch the <em>application.</em>
            </h2>

            <div
              className="vize-video-preview-card"
              onClick={() => setIsVideoModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsVideoModalOpen(true)}
              aria-label="Play application video"
            >
              <img
                src={product.video?.thumbnail || '/reel-1-thumb.jpg'}
                alt={product.video?.title || 'Application Demonstration'}
                className="vize-video-poster"
                loading="lazy"
              />
              <div className="vize-video-overlay" />
              <button
                type="button"
                className="vize-play-circle"
                aria-label="Play application video"
              >
                <Play size={20} fill="#0D2C33" color="#0D2C33" className="vize-play-icon" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. MORE PRODUCTS
         ========================================================================= */}
      <section className="vize-more-products-section" aria-label="More resin products">
        <div className="vize-pdp-main-container">
          
          {/* Section Header */}
          <div className="vize-more-header">
            <h2 className="vize-more-title">
              More <em>products.</em>
            </h2>
            <Link to="/resins" className="vize-view-all-link">
              <span>View all resins</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* 3 Compact Product Cards */}
          <div className="vize-more-cards-grid">
            {moreProducts.map((item) => (
              <div key={item.id} className="vize-compact-product-card">
                <div className="vize-compact-img-wrap">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="vize-compact-img"
                    loading="lazy"
                  />
                </div>
                <div className="vize-compact-info">
                  <h3 className="vize-compact-name">{item.name}</h3>
                  <Link to={`/product/${item.id}`} className="vize-compact-link">
                    <span>View product</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Minimal Footer */}
      <Footer />

      {/* =========================================================================
          MODALS & LIGHTBOXES
         ========================================================================= */}

      {/* Image Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vize-modal-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image lightbox"
            >
              <X size={24} />
            </button>
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="vize-lightbox-img"
            />
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsVideoModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="vize-video-modal-header">
              <span>{product.video?.title || `${product.name} Application`}</span>
              <button
                type="button"
                className="vize-modal-close"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>
            <div className="vize-video-player-frame">
              <video
                src={product.video?.src || '/hero-video.mp4'}
                controls
                autoPlay
                playsInline
                className="vize-modal-video-tag"
              />
            </div>
          </div>
        </div>
      )}

      {/* Ask a Product Expert Modal */}
      {isExpertModalOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsExpertModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="vize-form-modal-header">
              <h3>Ask a Vize Product Expert</h3>
              <button
                type="button"
                className="vize-modal-close"
                onClick={() => setIsExpertModalOpen(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="vize-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! A Vize chemist/specialist will contact you within 2 business hours.');
                setIsExpertModalOpen(false);
              }}
            >
              <p className="vize-form-intro">
                Need guidance on substrate preparation, coverage, or formulation chemistry for{' '}
                <strong>{product.name}</strong>?
              </p>
              <div className="vize-input-field">
                <label>Your Name</label>
                <input type="text" required placeholder="e.g. Marcus Vance" />
              </div>
              <div className="vize-input-field">
                <label>Email or Phone</label>
                <input type="text" required placeholder="contact@domain.com" />
              </div>
              <div className="vize-input-field">
                <label>Your Project Query / Sq.Ft</label>
                <textarea rows="3" required placeholder="Describe substrate, area size, or finish requirements..." />
              </div>
              <button type="submit" className="vize-submit-btn">
                Send to Product Chemist
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enquire About Samples Modal */}
      {isEnquiryModalOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsEnquiryModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="vize-form-modal-header">
              <h3>Order Certified Physical Finish Samples</h3>
              <button
                type="button"
                className="vize-modal-close"
                onClick={() => setIsEnquiryModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="vize-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Sample kit request received. Our architectural spec team will prepare your custom swatch board.');
                setIsEnquiryModalOpen(false);
              }}
            >
              <p className="vize-form-intro">
                Request physical 100mm × 100mm cured sample swatches for <strong>{product.name}</strong> (Petrol Teal, Copper, Silver).
              </p>
              <div className="vize-input-field">
                <label>Architect / Studio Name</label>
                <input type="text" required placeholder="e.g. Studio Forma" />
              </div>
              <div className="vize-input-field">
                <label>Shipping Address for Swatches</label>
                <textarea rows="2" required placeholder="Delivery address for sample package..." />
              </div>
              <button type="submit" className="vize-submit-btn">
                Request Swatch Palette
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsReviewModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="vize-form-modal-header">
              <h3>Write a Review for {product.name}</h3>
              <button
                type="button"
                className="vize-modal-close"
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="vize-review-success">
                <CheckCircle2 size={32} color="#1b684e" />
                <p>Thank you! Your verified review has been submitted.</p>
              </div>
            ) : (
              <form className="vize-modal-form" onSubmit={handleReviewSubmit}>
                <div className="vize-input-field">
                  <label>Rating</label>
                  <div className="vize-star-picker">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        className="star-btn"
                        onClick={() => setReviewRating(starVal)}
                        aria-label={`Rate ${starVal} stars`}
                      >
                        <Star
                          size={22}
                          fill={starVal <= reviewRating ? '#8C4830' : 'none'}
                          color="#8C4830"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="vize-input-field">
                  <label>Your Name & Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Sterling (Contractor)"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                  />
                </div>

                <div className="vize-input-field">
                  <label>Your Review</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Share your experience with viscosity, self-leveling, and optical clarity..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="vize-submit-btn">
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL MASTER COLOR & METALLIC SHADES CATALOG MODAL
         ========================================================================= */}
      {isColorCatalogOpen && (
        <div
          className="vize-modal-backdrop"
          onClick={() => setIsColorCatalogOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vize-catalog-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="vize-catalog-modal-header">
              <div className="vize-catalog-header-left">
                <div className="vize-catalog-modal-eyebrow">
                  <Sparkles size={14} color="#8C4830" />
                  <span>COLOR & METALLIC FINISH CATALOG</span>
                </div>
                <h3 className="vize-catalog-modal-title">Choose Signature Shade</h3>
                <p className="vize-catalog-modal-subtitle">
                  Select from {ALL_COLORS.length} premium metallic pigments, crystalline swatches, and pearl powders.
                </p>
              </div>
              <button
                type="button"
                className="vize-modal-close"
                onClick={() => setIsColorCatalogOpen(false)}
                aria-label="Close color catalog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="vize-catalog-controls">
              <div className="vize-catalog-tabs">
                {COLOR_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`vize-cat-tab-btn ${catalogTab === cat ? 'active' : ''}`}
                    onClick={() => setCatalogTab(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="vize-catalog-search-wrap">
                <Search size={15} className="catalog-search-icon" />
                <input
                  type="text"
                  className="vize-catalog-search-input"
                  placeholder="Search by color name or tone..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                />
                {catalogSearch && (
                  <button
                    type="button"
                    className="catalog-search-clear"
                    onClick={() => setCatalogSearch('')}
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="vize-catalog-grid">
              {filteredColors.length === 0 ? (
                <div className="vize-catalog-empty">
                  <p>No shades found matching "{catalogSearch}".</p>
                  <button
                    type="button"
                    className="vize-catalog-reset-btn"
                    onClick={() => {
                      setCatalogSearch('');
                      setCatalogTab('All Shades');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredColors.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  const isHovered = hoveredColor?.id === color.id;
                  return (
                    <div
                      key={color.id}
                      className={`vize-catalog-color-card-big ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(9, 26, 32, 0.22) 0%, rgba(9, 26, 32, 0.68) 52%, rgba(9, 26, 32, 0.94) 100%), url("${color.image}")`
                      }}
                      onMouseEnter={() => setHoveredColor(color)}
                      onMouseLeave={() => setHoveredColor(null)}
                      onClick={() => {
                        setSelectedColorId(color.id);
                        setIsColorCatalogOpen(false);
                      }}
                      role="button"
                      tabIndex={0}
                      title={`Select ${color.name} shade`}
                    >
                      <div className="vize-catalog-card-header-row">
                        <span className="vize-catalog-card-cat-badge">{color.category}</span>
                        {isSelected ? (
                          <span className="vize-catalog-card-selected-badge">
                            <Check size={12} strokeWidth={3} /> Selected
                          </span>
                        ) : (
                          <span className="vize-catalog-card-select-btn-pill">Select</span>
                        )}
                      </div>

                      <div className="vize-catalog-card-body">
                        <h4 className="vize-catalog-card-name">{color.name}</h4>
                        <p className="vize-catalog-card-desc">{color.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Bar */}
            <div className="vize-catalog-footer">
              <div className="vize-catalog-active-preview">
                <span className="vize-preview-circle" style={{ backgroundImage: `url("${selectedColor.image}")` }} />
                <span>Selected: <strong>{selectedColor.name}</strong> ({selectedColor.category})</span>
              </div>
              <button
                type="button"
                className="vize-catalog-done-btn"
                onClick={() => setIsColorCatalogOpen(false)}
              >
                Confirm Selection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
