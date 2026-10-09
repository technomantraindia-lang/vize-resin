import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ralColors from '../data/ralColors.json';
import { fetchFromApi, resolveImageUrl } from '../utils/api';

const RAL_GROUPS = [
  'All',
  'Yellows',
  'Oranges',
  'Reds',
  'Violets',
  'Blues',
  'Greens',
  'Greys',
  'Browns',
  'Whites & Blacks'
];

// The 5 official categories matching the signature finishes showcase & price list
const PIGMENT_CATEGORIES = [
  {
    id: 'opaque',
    name: 'Opaque',
    badge: 'SOLID OPAQUE DISPERSION',
    subtitle: 'High-coverage liquid dispersion paste for solid opaque color bases, deep marbling and solid slabs.',
    shades: [
      { id: 'petrol-teal', name: 'Petrol Teal', hex: '#005f73', image: '/colors/Petrol Teal.png' },
      { id: 'copper', name: 'Copper', hex: '#b87333', image: '/colors/Copper.png' },
      { id: 'deep-blue', name: 'Deep Blue', hex: '#002855', image: '/colors/Deep Blue.png' },
      { id: 'silver', name: 'Silver', hex: '#c0c0c0', image: '/colors/Silver.png' },
      { id: 'pearl', name: 'Pearl', hex: '#f5f5f0', image: '/colors/Pearl.png' },
      { id: 'charcoal', name: 'Charcoal', hex: '#1a1a1a', image: '/colors/Charcoal.png' }
    ],
    sizes: [
      { id: '500g', label: '500 Grams', price: 513.00, weight: '500g' },
      { id: '1kg', label: '1 Kilogram', price: 1026.00, weight: '1kg' }
    ]
  },
  {
    id: 'metallic',
    name: 'Metallic',
    badge: 'METALLIC FINISH',
    subtitle: 'High-dispersion, UV-stabilized pigments engineered for zero settlement in deep castings & metallic flooring screeds.',
    shades: [
      { id: 'liquid-gold', name: 'Liquid Gold', hex: '#ffd700', image: '/colors/Liquid Gold.png' },
      { id: 'bronze-vein', name: 'Bronze Vein', hex: '#cd7f32', image: '/colors/Bronze Vein.png' },
      { id: 'titanium', name: 'Titanium', hex: '#878681', image: '/colors/Titanium.png' },
      { id: 'emerald-spark', name: 'Emerald Spark', hex: '#2ecc71', image: '/colors/Emerald Spark.png' },
      { id: 'ruby-smoke', name: 'Ruby Smoke', hex: '#8b0000', image: '/colors/Ruby Smoke.png' },
      { id: 'obsidian', name: 'Obsidian', hex: '#1c1c1c', image: '/colors/Obsidian.png' }
    ],
    sizes: [
      { id: '500g', label: '500 Grams', price: 1568.40, weight: '500g' },
      { id: '1kg', label: '1 Kilogram', price: 3079.80, weight: '1kg' }
    ]
  },
  {
    id: 'pearl-powder',
    name: 'Pearl Powder',
    badge: 'PEARL & MICA POWDER',
    subtitle: 'Cosmetic-grade celestial mica shimmer powder. Zero pigment settlement across 72h deep castings.',
    shades: [
      { id: 'moonstone', name: 'Moonstone', hex: '#e0e6ed', image: '/colors/Moonstone.png' },
      { id: 'sunburst', name: 'Sunburst', hex: '#f39c12', image: '/colors/Sunburst.png' },
      { id: 'rose-quartz', name: 'Rose Quartz', hex: '#f4a6b8', image: '/colors/Rose Quartz.png' },
      { id: 'sapphire-mist', name: 'Sapphire Mist', hex: '#2980b9', image: '/colors/Sapphire Mist.png' },
      { id: 'champagne', name: 'Champagne', hex: '#f7e7ce', image: '/colors/Champagne.png' },
      { id: 'graphite', name: 'Graphite', hex: '#3d3d3d', image: '/colors/Graphite.png' }
    ],
    sizes: [
      { id: '500g', label: '500 Grams', price: 769.95, weight: '500g' },
      { id: '1kg', label: '1 Kilogram', price: 1539.90, weight: '1kg' }
    ]
  },
  {
    id: 'granual-epoxy',
    name: 'Granual Epoxy',
    badge: 'GRANUAL EPOXY SYSTEM',
    subtitle: 'Textured • Durable • Decorative multi-blend vinyl polymer flakes broadcast into 100% solids epoxy for slip-resistant floors.',
    shades: [
      { id: 'black-white', name: 'Black & White', hex: '#222222', image: '/colors/granules/black-white-blend.png', preview: '/colors/granules/black-white-blend-preview.jpg', desc: 'High-contrast monochrome flake broadcast' },
      { id: 'gray-blend', name: 'Gray Blend', hex: '#7f8c8d', image: '/colors/granules/gray-blend.png', preview: '/colors/granules/gray-blend-preview.jpg', desc: 'Neutral slate & ash multi-tone composite' },
      { id: 'tan-blend', name: 'Tan Blend', hex: '#d2b48c', image: '/colors/granules/tan-blend.png', preview: '/colors/granules/tan-blend-preview.jpg', desc: 'Warm earth & desert sand mineral blend' },
      { id: 'beige-blend', name: 'Beige Blend', hex: '#f5f5dc', image: '/colors/granules/beige-blend.png', preview: '/colors/granules/beige-blend-preview.jpg', desc: 'Cream & almond architectural flake matrix' },
      { id: 'blue-blend', name: 'Blue Blend', hex: '#1f4e79', image: '/colors/granules/blue-blend.png', preview: '/colors/granules/blue-blend-preview.jpg', desc: 'Cobalt & sapphire showroom polymer flakes' },
      { id: 'red-blend', name: 'Red Blend', hex: '#a93226', image: '/colors/granules/red-blend.png', preview: '/colors/granules/red-blend-preview.jpg', desc: 'Crimson & terracotta accent granules' },
      { id: 'green-blend', name: 'Green Blend', hex: '#27ae60', image: '/colors/granules/green-blend.png', preview: '/colors/granules/green-blend-preview.jpg', desc: 'Forest & olive botanical quartz flake blend' },
      { id: 'blue-gray-blend', name: 'Blue Gray Blend', hex: '#34495e', image: '/colors/granules/blue-gray-blend.png', preview: '/colors/granules/blue-gray-blend-preview.jpg', desc: 'Steel gray & arctic blue heavy-duty coating' }
    ],
    sizes: [
      { id: '1kg', label: '1 Kilogram', price: 1250.00, weight: '1kg' },
      { id: '5kg', label: '5 Kilograms', price: 5750.00, weight: '5kg' },
      { id: '25kg', label: '25 Kilograms', price: 26500.00, weight: '25kg' }
    ]
  },
  {
    id: 'ral',
    name: 'RAL Classic Chart (200+)',
    badge: 'OFFICIAL RAL CLASSIC SPEC',
    subtitle: 'Standardized European industrial RAL color matchings with 100% non-fading aliphatic UV permanence.',
    shades: [
      { id: 'ral-7016', code: 'RAL 7016', name: 'Anthracite grey', hex: '#383E42', group: 'Greys' },
      { id: 'ral-5002', code: 'RAL 5002', name: 'Ultramarine blue', hex: '#20214F', group: 'Blues' },
      { id: 'ral-9005', code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A', group: 'Whites & Blacks' },
      { id: 'ral-9010', code: 'RAL 9010', name: 'Pure white', hex: '#F7FBF5', group: 'Whites & Blacks' },
      { id: 'ral-3020', code: 'RAL 3020', name: 'Traffic red', hex: '#CC0605', group: 'Reds' },
      { id: 'ral-6005', code: 'RAL 6005', name: 'Moss green', hex: '#2F4538', group: 'Greens' }
    ],
    sizes: [
      { id: '500g', label: '500 Grams', price: 513.00, weight: '500g' },
      { id: '1kg', label: '1 Kilogram', price: 1026.00, weight: '1kg' }
    ]
  }
];

export default function PigmentsOrderSection() {
  const { addToCart } = useCart();

  // Dynamic Categories State (Initializes with default categories, synced from backend API)
  const [categories, setCategories] = useState(PIGMENT_CATEGORIES);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(1);
  const currentCategory = categories[activeCategoryIndex] || categories[0] || PIGMENT_CATEGORIES[0];

  // Selected Swatch & Pack Size State
  const [selectedSwatch, setSelectedSwatch] = useState(currentCategory.shades[0]);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);
  const [selectedSize, setSelectedSize] = useState(currentCategory.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Visual Color Dropdown State for RAL category
  const [isRalDropdownOpen, setIsRalDropdownOpen] = useState(false);
  const [ralSearchQuery, setRalSearchQuery] = useState('');
  const [selectedRalGroup, setSelectedRalGroup] = useState('All');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRalDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch dynamic categories, pack prices, and shades from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadBackendPigments() {
      try {
        const json = await fetchFromApi('/api/vize/pigments');
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const formattedCategories = json.data.map((cat) => ({
            ...cat,
            shades: Array.isArray(cat.shades)
              ? cat.shades.map((s) => ({
                  ...s,
                  image: (s.image && typeof s.image === 'string') ? s.image.trim() : '',
                  preview: (s.preview && typeof s.preview === 'string') ? s.preview.trim() : (s.image || ''),
                }))
              : []
          }));
          setCategories(formattedCategories);
          const activeIdx = formattedCategories.length > 1 ? 1 : 0;
          setActiveCategoryIndex(activeIdx);
          const activeCat = formattedCategories[activeIdx] || formattedCategories[0];
          if (activeCat?.shades?.length > 0) {
            setSelectedSwatch(activeCat.shades[0]);
          }
          if (activeCat?.sizes?.length > 0) {
            setSelectedSize(activeCat.sizes[0]);
          }
        }
        } catch (err) {
        // Fallback gracefully to local dataset
      }
    }

    loadBackendPigments();
    return () => { isMounted = false; };
  }, []);

  // Filtered RAL colors for visual dropdown
  const filteredRalColors = useMemo(() => {
    return ralColors.filter((color) => {
      const matchesGroup = selectedRalGroup === 'All' || color.group === selectedRalGroup;
      const q = ralSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        color.code.toLowerCase().includes(q) ||
        color.name.toLowerCase().includes(q) ||
        color.hex.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [selectedRalGroup, ralSearchQuery]);

  // Switch Category Tab cleanly
  const handleCategoryChange = (index) => {
    setActiveCategoryIndex(index);
    const newCategory = categories[index];
    if (newCategory?.shades?.length > 0) {
      setSelectedSwatch(newCategory.shades[0]);
    }
    if (newCategory?.sizes?.length > 0) {
      setSelectedSize(newCategory.sizes[0]);
    }
    setHoveredSwatch(null);
    setQuantity(1);
    setIsRalDropdownOpen(false);
  };

  // Preview displayed on right banner (hovered or selected)
  const currentPreview = hoveredSwatch || selectedSwatch || currentCategory.shades[0];

  // Total Price calculation (GST inclusive)
  const totalPrice = (selectedSize.price * quantity).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Display name formatted for shade
  const shadeDisplayName = selectedSwatch.code
    ? `${selectedSwatch.code} — ${selectedSwatch.name}`
    : selectedSwatch.name;

  // Add item to shopping cart
  const handleAddToCart = () => {
    const cartProduct = {
      id: `${currentCategory.id}-${selectedSwatch.id}`,
      name: `${currentCategory.name} — ${shadeDisplayName}`,
      brand: 'VIZE Specialty Polymers',
      category: currentCategory.name,
      images: [selectedSwatch.image || '/colors/Liquid Gold.png'],
      currency: '₹'
    };

    const sizeObj = {
      id: selectedSize.id,
      label: `${selectedSize.label} (GST Incl.)`,
      price: selectedSize.price,
      weight: selectedSize.weight
    };

    const colorObj = {
      id: selectedSwatch.id,
      name: shadeDisplayName,
      hex: selectedSwatch.hex,
      image: selectedSwatch.image || ''
    };

    addToCart(cartProduct, sizeObj, colorObj, quantity, true);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  return (
    <section className="pigments-section pigments-order-root" id="order-pigments" aria-label="Order Pigments and Colors">
      <div className="pigments-container">

        {/* 1. Header Block (Matching clean signature finish style) */}
        <div className="pigments-header-top">
          <div className="pigments-eyebrow-wrap">
            <span className="pigments-eyebrow">ORDER DIRECTLY BY CATEGORY</span>
            <span className="pigments-eyebrow-line" />
          </div>

          <div className="pigments-title-row">
            <h2 className="pigments-title">
              Select Category &amp;<br />
              Order Pigments.
            </h2>

            {/* Quick Value & Trust Badges */}
            <div className="pigments-order-header-badges">
              <div className="pigments-order-badge-pill">
                <ShieldCheck size={15} />
                <span>Fixed Rate per Category</span>
              </div>
              <div className="pigments-order-badge-pill">
                <Truck size={15} />
                <span>All Prices Incl. 18% GST · 24h Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Category Underline Tabs (Exact match with user's screenshot) */}
        <div className="pigments-tabs">
          {categories.map((cat, idx) => {
            const isRal = cat.id === 'ral' || cat.slug === 'ral' || (cat.name && cat.name.includes('RAL'));
            return (
              <button
                key={cat.id || cat.slug || idx}
                type="button"
                onClick={() => handleCategoryChange(idx)}
                className={`pigments-tab-btn ${activeCategoryIndex === idx ? 'active' : ''} ${
                  isRal ? 'ral-tab-highlight' : ''
                }`}
              >
                {cat.name}
                {isRal && <span className="ral-tab-badge">200+ Shades</span>}
              </button>
            );
          })}
        </div>

        {/* 3. The 2-Column Showcase Grid */}
        <div className="pigments-grid">

          {/* Left Column: Swatches + Visual Color Dropdown + Technical Note */}
          <div className="pigments-info-col">

            {/* Row of quick circular swatches (exactly 6 items, perfectly fits in 1 clean row) */}
            <div className="pigments-swatches-row">
              {currentCategory.shades.map((swatch) => {
                const isSelected = selectedSwatch.id === swatch.id;
                const isHovered = hoveredSwatch?.id === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setSelectedSwatch(swatch)}
                    onMouseEnter={() => setHoveredSwatch(swatch)}
                    onMouseLeave={() => setHoveredSwatch(null)}
                    className={`pigment-swatch-item ${isSelected ? 'selected' : ''} ${
                      isHovered ? 'hovered' : ''
                    }`}
                    title={`${swatch.code ? `${swatch.code} ` : ''}${swatch.name}`}
                    aria-label={`Select ${swatch.name} finish`}
                  >
                    <div
                      className="pigment-swatch-circle"
                      style={{ backgroundColor: swatch.hex || '#1e293b' }}
                    >
                      {swatch.image ? (
                        <img
                          src={resolveImageUrl(swatch.image)}
                          alt={swatch.name}
                          className="swatch-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="swatch-inner-gloss" />
                    </div>
                    <span className="pigment-swatch-label">
                      {swatch.code ? swatch.code : swatch.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Visual Color Dropdown for complete 200+ RAL chart (Shows real color swatches, NOT just names!) */}
            {currentCategory.id === 'ral' && (
              <div className="order-ral-dropdown-container" ref={dropdownRef}>
                <div className="order-ral-dropdown-header-label">
                  <span>Browse &amp; Pick from 200+ RAL Colors:</span>
                  <span className="order-ral-count-label">216 Shades</span>
                </div>

                {/* Dropdown Trigger Button (Shows visual color, not just name) */}
                <button
                  type="button"
                  onClick={() => setIsRalDropdownOpen(!isRalDropdownOpen)}
                  className={`order-ral-dropdown-trigger ${isRalDropdownOpen ? 'open' : ''}`}
                  aria-expanded={isRalDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <div
                    className="order-ral-trigger-swatch"
                    style={{ backgroundColor: selectedSwatch.hex }}
                  >
                    <div className="swatch-inner-gloss" />
                  </div>

                  <div className="order-ral-trigger-info">
                    <span className="order-ral-trigger-code">{selectedSwatch.code || 'RAL Classic'}</span>
                    <strong className="order-ral-trigger-name">{selectedSwatch.name}</strong>
                    <span className="order-ral-trigger-group">{selectedSwatch.group || 'Industrial Standard'} Series</span>
                  </div>

                  <div className="order-ral-trigger-action">
                    <span>{isRalDropdownOpen ? 'Close' : 'View Colors'}</span>
                    <ChevronDown
                      size={15}
                      className={`order-ral-trigger-icon ${isRalDropdownOpen ? 'rotated' : ''}`}
                    />
                  </div>
                </button>

                {/* Dropdown Popover of Visual Color Cards */}
                {isRalDropdownOpen && (
                  <div className="order-ral-dropdown-menu">
                    {/* Search & Group Filter Bar */}
                    <div className="order-ral-menu-toolbar">
                      <div className="order-ral-menu-search">
                        <Search size={14} className="order-ral-search-icon" />
                        <input
                          type="text"
                          placeholder="Search code or color name (e.g. 7016, Blue, Jet)..."
                          value={ralSearchQuery}
                          onChange={(e) => setRalSearchQuery(e.target.value)}
                          className="order-ral-menu-input"
                          autoFocus
                        />
                        {ralSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setRalSearchQuery('')}
                            className="order-ral-clear-btn"
                            title="Clear search"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {/* Color Group Filter Pills */}
                      <div className="order-ral-menu-groups">
                        {RAL_GROUPS.map((grp) => (
                          <button
                            key={grp}
                            type="button"
                            onClick={() => setSelectedRalGroup(grp)}
                            className={`order-ral-grp-pill ${selectedRalGroup === grp ? 'active' : ''}`}
                          >
                            {grp}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visual Color Grid — Every single item displays its actual color swatch! */}
                    <div className="order-ral-menu-grid">
                      {filteredRalColors.map((color) => {
                        const isSelected = selectedSwatch.code === color.code;
                        return (
                          <button
                            key={color.code}
                            type="button"
                            onClick={() => {
                              setSelectedSwatch({
                                id: color.code.toLowerCase().replace(/\s+/g, '-'),
                                code: color.code,
                                name: color.name,
                                hex: color.hex,
                                group: color.group,
                                page: color.page
                              });
                              setIsRalDropdownOpen(false);
                            }}
                            className={`order-ral-color-card ${isSelected ? 'selected' : ''}`}
                            title={`${color.code} - ${color.name} (${color.hex})`}
                          >
                            <div
                              className="order-ral-card-swatch"
                              style={{ backgroundColor: color.hex }}
                            >
                              <div className="swatch-inner-gloss" />
                              {isSelected && (
                                <div className="order-ral-card-check">
                                  <Check size={12} />
                                </div>
                              )}
                            </div>
                            <div className="order-ral-card-text">
                              <span className="order-ral-card-code">{color.code}</span>
                              <span className="order-ral-card-name">{color.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filteredRalColors.length === 0 && (
                      <div className="order-ral-empty-state">
                        <span>No RAL shades match &quot;{ralSearchQuery}&quot; in {selectedRalGroup}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setRalSearchQuery('');
                            setSelectedRalGroup('All');
                          }}
                          className="order-ral-reset-btn"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Subtle Technical Note */}
            <div className="pigments-category-note">
              <Sparkles size={16} className="note-sparkle" />
              <span>
                {currentCategory.id === 'granual-epoxy'
                  ? 'Textured • Durable • Decorative multi-blend vinyl polymer flakes broadcast into 100% solids epoxy for slip-resistant floors.'
                  : currentCategory.subtitle}
              </span>
            </div>
          </div>

          {/* Right Column: Wide Panoramic Live Texture Showcase Banner */}
          <div className="pigments-banner-col">
            <div className="pigments-banner-card">
              {currentCategory.id === 'ral' ? (
                <div
                  className="pigments-banner-img dynamic-fade"
                  style={{
                    backgroundColor: currentPreview.hex,
                    backgroundImage: `
                      radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.45) 0%, transparent 45%),
                      radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.35) 0%, transparent 50%),
                      linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 60%)
                    `,
                    height: '100%',
                    width: '100%'
                  }}
                />
              ) : (
                <img
                  key={currentPreview.id}
                  src={resolveImageUrl(currentPreview.preview || currentPreview.image)}
                  alt={`${currentPreview.name} pigment resin texture`}
                  className={`pigments-banner-img dynamic-fade ${currentCategory.id === 'granual-epoxy' ? 'granule-banner-fit' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <div className="pigments-banner-overlay">
                <div className="pigments-active-name-badge">
                  <span className="pigments-badge-category">
                    {currentCategory.badge}
                  </span>
                  <span className="pigments-badge-name">
                    {currentPreview.code ? `${currentPreview.code} — ${currentPreview.name}` : currentPreview.name}
                  </span>
                </div>

                {currentCategory.id === 'granual-epoxy' ? (
                  <div className="granules-active-blend-badge">
                    <div className="granule-mini-swatch">
                      <img src={resolveImageUrl(currentPreview.image)} alt={currentPreview.name} />
                    </div>
                    <div className="granule-mini-info">
                      <span className="granule-feature-pill">Textured • Durable • Decorative</span>
                      <span className="granule-blend-sub">{currentPreview.desc || 'Broadcast Polymer Flake Matrix'}</span>
                    </div>
                  </div>
                ) : (
                  <span className="pigments-banner-caption">
                    COLOUR CREATES<br />
                    EMOTION.
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 4. Sleek Minimal Order Console (Docked cleanly beneath the visual showcase) */}
        <div className="pigments-order-dock">

          {/* Left: Active Selection Summary */}
          <div className="order-dock-selected">
            <div
              className="order-dock-swatch-thumb"
              style={{ backgroundColor: selectedSwatch.hex || '#1e293b' }}
            >
              {selectedSwatch.image ? (
                <img
                  src={resolveImageUrl(selectedSwatch.image)}
                  alt={selectedSwatch.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <div className="order-dock-item-text">
              <span className="order-dock-sub">Selected Shade</span>
              <strong className="order-dock-title">{shadeDisplayName}</strong>
              <span className="order-dock-cat-tag">{currentCategory.name} Finish</span>
            </div>
          </div>

          {/* Middle: Pack Size Selector */}
          <div className="order-dock-packs">
            <span className="order-dock-sub">Select Pack Size (Fixed Category Rate):</span>
            <div className="order-dock-pack-pills">
              {currentCategory.sizes.map((sz) => {
                const isSelected = selectedSize.id === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`order-dock-pill ${isSelected ? 'active' : ''}`}
                  >
                    <span className="dock-pill-label">{sz.label}</span>
                    <strong className="dock-pill-price">₹{sz.price.toLocaleString('en-IN')}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Price Calculation, Stepper & Action Buttons */}
          <div className="order-dock-actions">
            <div className="order-dock-price-group">
              <span className="order-dock-sub">Total (GST Incl.)</span>
              <span className="order-dock-price-val">₹{totalPrice}</span>
            </div>

            {/* Quantity Stepper */}
            <div className="order-dock-qty-stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="dock-qty-btn"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="dock-qty-val">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="dock-qty-btn"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`order-dock-cart-btn ${isAdded ? 'success' : ''}`}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* WhatsApp Direct Order Button */}
            <a
              href={`https://wa.me/919909988776?text=${encodeURIComponent(
                `Hello VIZE, I want to order: ${currentCategory.name} - Shade "${shadeDisplayName}" (Pack: ${selectedSize.label}, Quantity: ${quantity}, Total: ₹${totalPrice}). Please confirm courier dispatch.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="order-dock-wa-btn"
              title="Direct WhatsApp Order"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* 5. Dispatch & Delivery Transparency Note */}
        <div className="order-dock-footer-note">
          <div className="dock-note-item">
            <Truck size={14} />
            <span>Dispatches within 24 hours via Express Cargo</span>
          </div>
          <div className="dock-note-item">
            <ShieldCheck size={14} />
            <span>Standard Courier: Gujarat ₹75/kg · Rest of India ₹110/kg</span>
          </div>
          <div className="dock-note-item">
            <Sparkles size={14} />
            <span>Minimum order billing: ₹350</span>
          </div>
        </div>

      </div>
    </section>
  );
}
