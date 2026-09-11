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
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import productsData from '../data/products.json';
import { ALL_COLORS } from '../data/colors';

const CASE_STUDIES = [
  {
    id: 'case-metallic-01',
    type: 'project',
    title: 'Depth, movement and a seamless finish.',
    name: 'Metallic Resin Flooring',
    category: 'Projects',
    application: 'Commercial Interior',
    system: 'Multi-layer Resin',
    finish: 'High Gloss',
    image: '/Metallic Resin Flooring.png',
    link: '/our-work'
  },
  {
    id: 'case-industrial-02',
    type: 'project',
    title: 'Built for demanding daily movement.',
    name: 'Industrial Resin Flooring',
    category: 'Projects',
    application: 'Industrial Facility',
    system: 'Heavy-Duty Resin',
    finish: 'Smooth Satin',
    image: '/Industrial Resin Flooring.png',
    link: '/our-work'
  },
  {
    id: 'case-healthcare-03',
    type: 'project',
    title: 'Controlled surfaces for critical spaces.',
    name: 'Critical Non-Porous Flooring',
    category: 'Projects',
    application: 'Clinical Space',
    system: 'Seamless Coating',
    finish: 'Easy-Clean',
    image: '/Bio Safety Lab Critical Non Porous Flooring.png',
    link: '/our-work'
  },
  {
    id: 'case-foodsafe-04',
    type: 'project',
    title: 'Hygienic protection for processing lines.',
    name: 'Food-Grade Polyurethane Screed',
    category: 'Projects',
    application: 'Food Processing Plant',
    system: 'Vize PolyScreed 6mm',
    finish: 'Slip-Resistant',
    image: '/Food Safe Non Porous Flooring.png',
    link: '/our-work'
  },
  {
    id: 'case-hightraffic-05',
    type: 'project',
    title: 'Resilient multi-tone broadcast flooring.',
    name: 'High-Traffic Flake System',
    category: 'Projects',
    application: 'Automotive Showroom',
    system: 'Multi-Coat Flake Matrix',
    finish: 'Granite Texture',
    image: '/high traffic flake flooring.png',
    link: '/our-work'
  },
  {
    id: 'case-outdoor-06',
    type: 'project',
    title: 'Natural stone bound in clear UV resin.',
    name: 'Permeable Stone Carpet',
    category: 'Projects',
    application: 'Driveway & Terrace',
    system: 'Vize RockHard Aliphatic',
    finish: 'Permeable Pebble',
    image: '/cat-flooring.jpg',
    link: '/our-work'
  }
];

const POPULAR_SUGGESTIONS = [
  'Metallic Resin',
  'Vize PrimeX',
  'Stone Carpet',
  'Petrol Teal',
  'Polyaspartic',
  'Industrial Floor',
  'Cast Max',
  'Liquid Gold'
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

  // Combined Search Results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Products
    const products = productsData.map((p) => ({
      id: p.id,
      type: 'product',
      name: p.name,
      subtitle: `${p.brand} ${p.suffix || ''}`,
      tagline: p.tagline,
      category: p.category,
      price: p.basePrice ? `₹${p.basePrice.toLocaleString('en-IN')}` : '',
      image: p.images && p.images[0] ? p.images[0] : '/logos/Vize EpoWrap Pro.png',
      link: `/product/${p.id}`
    }));

    // 2. Colors
    const colors = ALL_COLORS.map((c) => ({
      id: `color-${c.id}`,
      type: 'color',
      name: c.name,
      subtitle: `${c.category} Swatch`,
      tagline: c.desc,
      category: 'Colors & Swatches',
      image: c.image,
      link: '/#finishes'
    }));

    // 3. Projects
    const projects = CASE_STUDIES.map((cs) => ({
      id: cs.id,
      type: 'project',
      name: cs.name,
      subtitle: cs.application,
      tagline: cs.title,
      category: 'Project Archive',
      image: cs.image,
      link: cs.link
    }));

    let allItems = [...products, ...colors, ...projects];

    // Filter by tab
    if (activeTab === 'Products') {
      allItems = allItems.filter((i) => i.type === 'product');
    } else if (activeTab === 'Colors') {
      allItems = allItems.filter((i) => i.type === 'color');
    } else if (activeTab === 'Projects') {
      allItems = allItems.filter((i) => i.type === 'project');
    }

    // Filter by query string
    if (q) {
      allItems = allItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          (item.tagline && item.tagline.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
        );
      });
    }

    return allItems;
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
            placeholder="Search resins, colors, projects, flooring systems..."
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
          {['All', 'Products', 'Colors', 'Projects'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`vize-search-tab-pill ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Products' && <Box size={14} />}
              {tab === 'Colors' && <Palette size={14} />}
              {tab === 'Projects' && <Briefcase size={14} />}
              <span>{tab}</span>
              {activeTab === tab && (
                <span className="vize-search-count-pill">{searchResults.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Suggestions (when search is empty) */}
        {!query && (
          <div className="vize-search-suggestions-block">
            <div className="vize-search-sugg-title">
              <TrendingUp size={14} />
              <span>POPULAR SEARCHES</span>
            </div>
            <div className="vize-search-sugg-chips">
              {POPULAR_SUGGESTIONS.map((item) => (
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
              <p>Try searching for a different keyword like "Epoxy", "Metallic", "Primer", or "Polyurethane".</p>
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
            <span>Click any result to view details</span>
          </div>
          <span className="vize-search-footer-brand">VIZE Speciality Polymers</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
