import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  Palette,
  Briefcase,
  Wrench,
  HelpCircle,
  TrendingUp,
  Flame,
  Shield,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import productsData from '../data/products.json';
import { ALL_COLORS } from '../data/colors';

// =============================================================================
// 1. COMPREHENSIVE SEARCH KNOWLEDGE BASE (PRODUCTS, TOOLS, QUESTIONS, PROBLEMS)
// =============================================================================
const EXTENDED_SEARCH_ITEMS = [
  // --- RIVER TABLE & CASTING RESINS ---
  {
    id: 'search-vize-cast',
    type: 'product',
    name: 'Vize Cast (50mm Deep Pour)',
    subtitle: 'Water-Clear Deep Casting Epoxy',
    tagline: 'Best for river tables, live-edge slab furniture and crystal encapsulation (up to 50mm single pour).',
    category: 'Casting & Art',
    price: '₹2,799',
    image: '/logos/Vize Cast Max.png',
    link: '/product/vize-cast',
    keywords: [
      'which resin is best for a river table',
      'resin for river table',
      'river table resin',
      'deep pour epoxy',
      'casting resin',
      'table top resin',
      'epoxy for wood slab',
      'bubbles in resin',
      'zero bubbles',
      'wood casting',
      'furniture resin',
      'clear epoxy',
      'transparent resin'
    ]
  },
  {
    id: 'search-vize-supercast',
    type: 'product',
    name: 'Vize SuperCast (100mm Massive Slab)',
    subtitle: 'Massive Depth Slab Casting Epoxy',
    tagline: 'Designed for single continuous 100mm pours with ultra-low thermal heat buildup and zero shrinkage.',
    category: 'Casting & Art',
    price: '₹3,499',
    image: '/logos/Vize Cast Max.png',
    link: '/product/vize-supercast',
    keywords: [
      '100mm deep pour',
      'thick slab river table',
      'massive timber casting',
      'no exotherm overheating',
      'heavy timber resin',
      'zero bubble deep pour'
    ]
  },
  {
    id: 'search-vize-maxart',
    type: 'product',
    name: 'Vize MaxArt (Art & Craft Resin)',
    subtitle: 'High-Viscosity Art & Craft Epoxy',
    tagline: 'High-dome surface tension formula for epoxy artwork, canvas paintings, geodes and coasters.',
    category: 'Casting & Art',
    price: '₹1,599',
    image: '/logos/Vize Art Max.png',
    link: '/product/vize-maxart',
    keywords: [
      'epoxy resin for artwork',
      'art resin',
      'resin for art',
      'geode resin',
      'craft resin',
      'resin coasters',
      'canvas art epoxy',
      'high dome gloss',
      'pigment holding resin',
      'uv resistant art resin',
      'non yellowing artwork'
    ]
  },

  // --- FLOOR PRIMERS & SUBSTRATE PREP ---
  {
    id: 'search-vize-prime',
    type: 'product',
    name: 'Vize Prime / PrimeX',
    subtitle: 'High-Penetration Concrete Primer & Sealer',
    tagline: 'Deep capillary penetration that seals concrete pores, stops pinhole outgassing and guarantees permanent bond.',
    category: 'Flooring Resins',
    price: '₹3,299',
    image: '/logos/Vize PrimeX PNG.png',
    link: '/product/vize-prime',
    keywords: [
      'primer for concrete floor',
      'floor primer',
      'concrete floor sealer',
      'substrate prep',
      'epoxy primer',
      'uneven concrete floor',
      'pinholes in floor',
      'moisture pinhole outgassing',
      'dusty unsealed substrate',
      'damaged concrete prep',
      'base primer'
    ]
  },

  // --- INDUSTRIAL & HEAVY-DUTY SCREED ---
  {
    id: 'search-vize-polyscreed',
    type: 'product',
    name: 'Vize PolyScreed Max',
    subtitle: '3-Part Heavy-Duty Polyurethane / Epoxy Screed',
    tagline: 'High-compressive mortar engineered for heavy forklift loads, industrial facilities and wet food-processing plants.',
    category: 'Flooring Resins',
    price: '₹4,199',
    image: '/logos/Vize Screed Max PNG.png',
    link: '/product/vize-polyscreed',
    keywords: [
      'heavy-duty industrial flooring',
      'industrial flooring',
      'food-safe resin flooring',
      'food safe flooring',
      'warehouse flooring',
      'forklift traffic floor',
      'factory floor',
      'damaged flooring',
      'uneven concrete floor',
      'concrete repair mortar',
      'thermal shock resistant',
      'dairy beverage plant flooring',
      'haccp certified floor',
      'acid resistant floor'
    ]
  },

  // --- OUTDOOR UV-RESISTANT & STONE CARPET ---
  {
    id: 'search-vize-rockhard',
    type: 'product',
    name: 'Vize RockHard (Stone Carpet Binder)',
    subtitle: 'UV-Aliphatic Stone Carpet Matrix',
    tagline: 'Binds natural quartz pebbles into a seamless, free-draining permeable exterior paving with zero yellowing.',
    category: 'Flooring Resins',
    price: '₹4,899',
    image: '/logos/Vize RockHard PNG.png',
    link: '/product/vize-rock-hard',
    keywords: [
      'resin for outdoor flooring',
      'outdoor uv-resistant coating',
      'outdoor flooring',
      'stone carpet',
      'permeable stone paving',
      'uv-resistant resin',
      'villa driveway',
      'pool deck resin',
      'exterior terrace flooring',
      'non-yellowing clear outdoor resin',
      'pebble binder',
      'standing water drainage'
    ]
  },

  // --- METALLIC DESIGNER FLOORING ---
  {
    id: 'search-vize-marble-metallics',
    type: 'product',
    name: 'Vize Marble Metallics (3D Metallic Epoxy)',
    subtitle: 'High-Gloss 3D Flow Metallic Epoxy',
    tagline: 'Flowable pigment formula creating liquid copper, petrol teal and gold veined floors for luxury commercial spaces.',
    category: 'Flooring Resins',
    price: '₹6,499',
    image: '/logos/Vize EpoWrap Pro.png',
    link: '/product/vize-marble-metallics',
    keywords: [
      'metallic epoxy floor',
      'metallic flooring',
      'metallic finish',
      'liquid gold floor',
      'petrol teal floor',
      'luxury showroom floor',
      '3d marble flow epoxy',
      'seamless designer floor',
      'commercial interior flooring',
      'restaurant flooring',
      'high gloss floor'
    ]
  },

  // --- PROTECTIVE TOPCOATS (POLYASPARTIC & URETHANE) ---
  {
    id: 'search-vize-polyaspartic',
    type: 'product',
    name: 'Vize Aspartic Max (Polyaspartic Topcoat)',
    subtitle: 'Ultra-Fast 2-Part Aliphatic Polyaspartic',
    tagline: '2–4 hour rapid handover topcoat with 100% UV immunity, hot-tire pickup resistance and extreme exterior durability.',
    category: 'Protective Coatings',
    price: '₹5,299',
    image: '/logos/Vize Aspartic Max.png',
    link: '/product/vize-polyaspartic',
    keywords: [
      'outdoor uv-resistant coating',
      'clear protective topcoat',
      'anti-slip flooring',
      'hot-tire resistant',
      'commercial garage floor',
      'rapid return to service floor',
      'polyaspartic coating',
      'automotive showroom',
      'uv stable clear seal'
    ]
  },
  {
    id: 'search-vize-glasscoat',
    type: 'product',
    name: 'Vize GlassCoat / Urethane Max',
    subtitle: '1K High-Hardness Polyurethane Topcoat',
    tagline: 'Self-healing micro-scratch shield providing harsh chemical, acid and oil resistance for high-traffic surfaces.',
    category: 'Protective Coatings',
    price: '₹3,899',
    image: '/logos/Vize UrethaneMax.png',
    link: '/product/vize-glasscoat',
    keywords: [
      'scratch-resistant coating',
      'scratch resistant coating',
      'clear protective topcoat',
      'protective coating',
      'chemical resistant coating',
      'polyurethane topcoat',
      'micro-scratch healing',
      'easy clean floor'
    ]
  },

  // --- CUTTING & POLISHING COMPOUNDS ---
  {
    id: 'search-vize-cutmax',
    type: 'product',
    name: 'Vize CutMax (Step 1 Cutting Compound)',
    subtitle: 'Nano Fast-Cut Surface Restorer',
    tagline: 'Rapidly eliminates 1500-grit sanding marks and restores clarity on river tables and resin surfaces without silicone fillers.',
    category: 'Finishing Compounds',
    price: '₹1,299',
    image: '/logos/Vize Nano PNG.png',
    link: '/product/vize-cutmax',
    keywords: [
      'resin cutting and polishing compound',
      'resin cutting compound',
      'rubbing compound for resin',
      'polishing river table',
      'remove sanding scratches',
      'buffing resin',
      'restoring dull epoxy'
    ]
  },
  {
    id: 'search-vize-shinemax',
    type: 'product',
    name: 'Vize ShineMax (Step 2 Mirror Glaze Polish)',
    subtitle: 'Optical Mirror Glaze Finishing Polish',
    tagline: 'Delivers 95+ GU optical mirror reflections and eliminates holograms and buffer swirls on cured resin.',
    category: 'Finishing Compounds',
    price: '₹1,299',
    image: '/logos/Vize Nano PNG.png',
    link: '/product/vize-shinemax',
    keywords: [
      'resin cutting and polishing compound',
      'mirror glaze polish',
      'final high gloss polish',
      'buffing swirl remover',
      'optical gloss for epoxy table',
      'showroom shine'
    ]
  },

  // --- TOOLS & EQUIPMENT ---
  {
    id: 'tool-spike-roller',
    type: 'tool',
    name: 'Vize Aeration Spike Roller',
    subtitle: 'Air Bubble De-aeration Roller',
    tagline: 'Essential tool to release trapped air bubbles from self-leveling epoxy and resin screeds during pour.',
    category: 'Application Tools',
    price: '₹1,450',
    image: '/tools-banner-bg.png',
    link: '/workshop',
    keywords: [
      'spike roller',
      'bubble release roller',
      'bubbles in resin',
      'de-aeration roller',
      'tool for epoxy floor',
      'spike tool'
    ]
  },
  {
    id: 'tool-floor-grinder',
    type: 'tool',
    name: 'Industrial Diamond Floor Grinder',
    subtitle: 'Substrate Profiling & Grinding System',
    tagline: 'Diamond tooling machinery to profile concrete substrates to CSP-2/3 and remove contaminants.',
    category: 'Application Tools',
    price: 'Contractor Tool',
    image: '/tools-machinery-graphic.png',
    link: '/workshop',
    keywords: [
      'floor grinder',
      'diamond grinder',
      'concrete grinder',
      'surface preparation tool',
      'csp profiling machine',
      'substrate grinder'
    ]
  },
  {
    id: 'tool-mixing-paddle',
    type: 'tool',
    name: 'Helical Heavy-Duty Mixing Paddle',
    subtitle: 'Streak-Free Part A & B Mixing Rod',
    tagline: 'High-shear spiral paddle preventing unmixed pocket swirls in multi-component epoxy resins.',
    category: 'Application Tools',
    price: '₹850',
    image: '/tools-machinery.png',
    link: '/workshop',
    keywords: [
      'mixing paddle',
      'spiral resin mixer',
      'drill paddle for epoxy',
      'mixing tool',
      'stirring rod'
    ]
  },

  // --- PROJECT EXAMPLES & CASE STUDIES ---
  {
    id: 'proj-metallic-commercial',
    type: 'project',
    name: 'Metallic Flow Commercial Interior',
    subtitle: 'Flagship Luxury Commercial Atrium',
    tagline: 'Custom hand-feathered petrol teal & copper pigment veins over flat substrate.',
    category: 'Projects Archive',
    image: '/Metallic Resin Flooring.png',
    link: '/our-work',
    keywords: [
      'metallic flooring',
      'metallic epoxy floor',
      'commercial interior',
      'restaurant flooring',
      'retail store floor',
      'petrol teal copper marble'
    ]
  },
  {
    id: 'proj-industrial-warehouse',
    type: 'project',
    name: 'Industrial Logistics & Heavy Movement',
    subtitle: '22,000 sq.ft Heavy-Duty Facility',
    tagline: 'Forklift point-load certified polyurethane screed with integrated safety lines.',
    category: 'Projects Archive',
    image: '/Industrial Resin Flooring.png',
    link: '/our-work',
    keywords: [
      'warehouse flooring',
      'industrial flooring',
      'heavy-duty industrial flooring',
      'factory floor',
      'forklift resistant floor'
    ]
  },
  {
    id: 'proj-healthcare-clinical',
    type: 'project',
    name: 'Controlled Clinical & Biosafety Labs',
    subtitle: 'ISO Class 5 Cleanroom Floor',
    tagline: 'Hermetically sealed anti-microbial coved floor with zero bacterial harborage joints.',
    category: 'Projects Archive',
    image: '/Bio Safety Lab Critical Non Porous Flooring.png',
    link: '/our-work',
    keywords: [
      'medical flooring',
      'hospital flooring',
      'critical non-porous flooring',
      'clinical space',
      'cleanroom floor',
      'anti-microbial resin'
    ]
  },
  {
    id: 'proj-foodsafe-plant',
    type: 'project',
    name: 'Hygienic Food Processing Facility',
    subtitle: 'HACCP-Certified Dairy & Beverage Plant',
    tagline: 'Thermal-shock resistant textured screed withstanding boiling steam washdowns and organic acids.',
    category: 'Projects Archive',
    image: '/Food Safe Non Porous Flooring.png',
    link: '/our-work',
    keywords: [
      'food-safe resin flooring',
      'food safe flooring',
      'restaurant flooring',
      'dairy processing floor',
      'brewery floor',
      'anti-slip flooring'
    ]
  },
  {
    id: 'proj-flake-showroom',
    type: 'project',
    name: 'High-Traffic Flake Automotive Gallery',
    subtitle: 'Dual-Coat Polyaspartic Broadcast System',
    tagline: '100% Hot-tire pickup immunity with decorative granite texture and slip resistance.',
    category: 'Projects Archive',
    image: '/high traffic flake flooring.png',
    link: '/our-work',
    keywords: [
      'anti-slip flooring',
      'high-traffic flake flooring',
      'automotive showroom',
      'commercial garage floor',
      'hot-tire resistant'
    ]
  },
  {
    id: 'proj-outdoor-terrace',
    type: 'project',
    name: 'Permeable Stone Carpet Villa Terrace',
    subtitle: 'Exterior Driveway & Pool Deck',
    tagline: 'Encapsulated quartz pebbles providing free-draining exterior paving with zero standing puddles.',
    category: 'Projects Archive',
    image: '/cat-flooring.jpg',
    link: '/our-work',
    keywords: [
      'resin for outdoor flooring',
      'outdoor uv-resistant coating',
      'villa terrace',
      'outdoor driveway',
      'pool deck'
    ]
  }
];

const POPULAR_SEARCH_EXAMPLES = [
  'Which resin is best for a river table?',
  'Epoxy resin for artwork',
  'Outdoor UV-resistant coating',
  'Primer for concrete floor',
  'Heavy-duty industrial flooring',
  'Food-safe resin flooring',
  'Anti-slip flooring',
  'Metallic epoxy floor',
  'Clear protective topcoat',
  'Resin cutting and polishing compound'
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveTab('All');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ===========================================================================
  // 2. SMART SEARCH & RELEVANCE FILTERING ENGINE
  // ===========================================================================
  const searchResults = useMemo(() => {
    const rawQuery = query.trim().toLowerCase();
    
    // Clean stop words and punctuation for smart intent matching
    const searchTokens = rawQuery
      .replace(/[?.,!/\\()"-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !['which', 'what', 'the', 'for', 'best', 'and', 'how', 'with', 'are', 'can', 'you'].includes(t));

    // Colors data converted to search items
    const colorItems = ALL_COLORS.map((c) => ({
      id: `color-${c.id}`,
      type: 'color',
      name: c.name,
      subtitle: `${c.category} Swatch`,
      tagline: c.desc,
      category: 'Colors & Swatches',
      image: c.image,
      link: '/#finishes',
      keywords: [
        c.name.toLowerCase(),
        c.category.toLowerCase(),
        'metallic finish',
        'finish or colour',
        'swatch',
        'pigment',
        'colour',
        'color'
      ]
    }));

    const allCorpus = [...EXTENDED_SEARCH_ITEMS, ...colorItems];

    // Filter by tab first
    let tabFiltered = allCorpus;
    if (activeTab === 'Products') {
      tabFiltered = allCorpus.filter((i) => i.type === 'product');
    } else if (activeTab === 'Colors') {
      tabFiltered = allCorpus.filter((i) => i.type === 'color');
    } else if (activeTab === 'Projects') {
      tabFiltered = allCorpus.filter((i) => i.type === 'project');
    } else if (activeTab === 'Tools') {
      tabFiltered = allCorpus.filter((i) => i.type === 'tool');
    }

    if (!rawQuery) {
      return tabFiltered;
    }

    // Score each item based on token and phrase matches
    const scoredResults = tabFiltered.map((item) => {
      let score = 0;
      const nameLower = item.name.toLowerCase();
      const subtitleLower = (item.subtitle || '').toLowerCase();
      const taglineLower = (item.tagline || '').toLowerCase();
      const categoryLower = (item.category || '').toLowerCase();
      const keywords = item.keywords || [];

      // 1. Direct exact phrase match in keywords (Highest weight)
      if (keywords.some((kw) => kw.includes(rawQuery) || rawQuery.includes(kw))) {
        score += 80;
      }

      // 2. Direct exact phrase match in name or subtitle
      if (nameLower.includes(rawQuery)) score += 60;
      if (subtitleLower.includes(rawQuery)) score += 40;
      if (taglineLower.includes(rawQuery)) score += 30;

      // 3. Token-by-token matching
      searchTokens.forEach((token) => {
        if (nameLower.includes(token)) score += 20;
        if (subtitleLower.includes(token)) score += 15;
        if (taglineLower.includes(token)) score += 10;
        if (categoryLower.includes(token)) score += 8;

        if (keywords.some((kw) => kw.includes(token))) {
          score += 18;
        }
      });

      return { ...item, score };
    });

    // Return items with positive score, sorted by relevance
    return scoredResults
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, activeTab]);

  const handleItemClick = (link) => {
    onClose();
    if (link.startsWith('/#')) {
      if (window.location.pathname === '/') {
        const id = link.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(link);
      }
    } else {
      navigate(link);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="vize-search-modal-backdrop" onClick={onClose}>
      <div
        className="vize-search-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Site Search"
      >
        {/* Search Header Bar */}
        <div className="vize-search-header-bar">
          <Search size={22} className="vize-search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="vize-search-main-input"
            placeholder="Search products, applications or flooring solutions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="vize-search-clear-btn"
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              aria-label="Clear Search Input"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            className="vize-search-modal-close-btn"
            onClick={onClose}
            aria-label="Close search modal"
          >
            <span className="vize-esc-badge">ESC</span>
          </button>
        </div>

        {/* Filter Tabs Bar */}
        <div className="vize-search-tabs-bar">
          {['All', 'Products', 'Colors', 'Projects', 'Tools'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`vize-search-tab-pill ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Products' && <Box size={14} />}
              {tab === 'Colors' && <Palette size={14} />}
              {tab === 'Projects' && <Briefcase size={14} />}
              {tab === 'Tools' && <Wrench size={14} />}
              <span>{tab}</span>
              {activeTab === tab && (
                <span className="vize-search-count-pill">{searchResults.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Example Queries (when search is empty or just started) */}
        {!query && (
          <div className="vize-search-suggestions-block">
            <div className="vize-search-sugg-title">
              <TrendingUp size={14} />
              <span>POPULAR SEARCHES & QUESTIONS</span>
            </div>
            <div className="vize-search-sugg-chips">
              {POPULAR_SEARCH_EXAMPLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="vize-search-sugg-chip"
                  onClick={() => {
                    setQuery(item);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                >
                  <Search size={12} />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="vize-search-results-list">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item.id}
                className="vize-search-result-item"
                onClick={() => handleItemClick(item.link)}
              >
                {/* Thumbnail Image */}
                <div className="vize-search-item-img-box">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="vize-search-item-img"
                    onError={(e) => {
                      e.target.src = '/logos/Vize EpoWrap Pro.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="vize-search-item-info">
                  <div className="vize-search-item-top-row">
                    <span className="vize-search-item-category">{item.category}</span>
                    {item.price && (
                      <span className="vize-search-item-price">{item.price}</span>
                    )}
                  </div>
                  <h4 className="vize-search-item-name">{item.name}</h4>
                  <p className="vize-search-item-tagline">{item.tagline}</p>
                </div>

                {/* Action Arrow */}
                <div className="vize-search-item-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))
          ) : (
            <div className="vize-search-no-results">
              <Search size={32} className="vize-search-empty-icon" />
              <h4>No matches found for "{query}"</h4>
              <p>Try searching for questions like <em>"river table"</em>, <em>"concrete primer"</em>, <em>"food safe flooring"</em>, or <em>"UV resistant coating"</em>.</p>
              <button
                type="button"
                className="vize-search-reset-btn"
                onClick={() => {
                  setQuery('');
                  setActiveTab('All');
                }}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="vize-search-modal-footer">
          <div className="vize-search-footer-shortcuts">
            <span>Press <kbd>ESC</kbd> to close</span>
            <span>•</span>
            <span>Click any result to jump directly to solution</span>
          </div>
          <span className="vize-search-footer-brand">VIZE Speciality Polymers</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
