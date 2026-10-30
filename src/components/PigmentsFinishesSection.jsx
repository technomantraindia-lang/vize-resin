import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, FileText, ExternalLink, Sparkles, Check, ChevronRight, X } from 'lucide-react';
import ralColors from '../data/ralColors.json';
import pigmentsData from '../data/pigments.json';
import { fetchFromApi, resolveImageUrl } from '../utils/api';

const DEFAULT_PIGMENT_TABS = ['Opaque', 'Metallic', 'Pearl Powder', 'Granual Epoxy', 'RAL Classic Chart (200+)'];

const DEFAULT_SWATCHES = {
  Opaque: [
    { id: 'petrol-teal', name: 'Petrol Teal', hex: '#005f73', image: '/colors/Petrol Teal.png' },
    { id: 'copper', name: 'Copper', hex: '#b87333', image: '/colors/Copper.png' },
    { id: 'deep-blue', name: 'Deep Blue', hex: '#002855', image: '/colors/Deep Blue.png' },
    { id: 'silver', name: 'Silver', hex: '#c0c0c0', image: '/colors/Silver.png' },
    { id: 'pearl', name: 'Pearl', hex: '#f5f5f0', image: '/colors/Pearl.png' },
    { id: 'charcoal', name: 'Charcoal', hex: '#1a1a1a', image: '/colors/Charcoal.png' },
  ],
  Metallic: [
    { id: 'liquid-gold', name: 'Liquid Gold', hex: '#ffd700', image: '/colors/Liquid Gold.png' },
    { id: 'bronze-vein', name: 'Bronze Vein', hex: '#cd7f32', image: '/colors/Bronze Vein.png' },
    { id: 'titanium', name: 'Titanium', hex: '#878681', image: '/colors/Titanium.png' },
    { id: 'emerald-spark', name: 'Emerald Spark', hex: '#2ecc71', image: '/colors/Emerald Spark.png' },
    { id: 'ruby-smoke', name: 'Ruby Smoke', hex: '#8b0000', image: '/colors/Ruby Smoke.png' },
    { id: 'obsidian', name: 'Obsidian', hex: '#1c1c1c', image: '/colors/Obsidian.png' },
  ],
  'Pearl Powder': [
    { id: 'moonstone', name: 'Moonstone', hex: '#e0e6ed', image: '/colors/Moonstone.png' },
    { id: 'sunburst', name: 'Sunburst', hex: '#f39c12', image: '/colors/Sunburst.png' },
    { id: 'rose-quartz', name: 'Rose Quartz', hex: '#f4a6b8', image: '/colors/Rose Quartz.png' },
    { id: 'sapphire-mist', name: 'Sapphire Mist', hex: '#2980b9', image: '/colors/Sapphire Mist.png' },
    { id: 'champagne', name: 'Champagne', hex: '#f7e7ce', image: '/colors/Champagne.png' },
    { id: 'graphite', name: 'Graphite', hex: '#3d3d3d', image: '/colors/Graphite.png' },
  ],
  'Granual Epoxy': [
    { id: 'black-white', name: 'Black & White', hex: '#222222', image: '/colors/granules/black-white-blend.png', preview: '/colors/granules/black-white-blend-preview.jpg', desc: 'High-contrast monochrome flake broadcast' },
    { id: 'gray-blend', name: 'Gray Blend', hex: '#7f8c8d', image: '/colors/granules/gray-blend.png', preview: '/colors/granules/gray-blend-preview.jpg', desc: 'Neutral slate & ash multi-tone composite' },
    { id: 'tan-blend', name: 'Tan Blend', hex: '#d2b48c', image: '/colors/granules/tan-blend.png', preview: '/colors/granules/tan-blend-preview.jpg', desc: 'Warm earth & desert sand mineral blend' },
    { id: 'beige-blend', name: 'Beige Blend', hex: '#f5f5dc', image: '/colors/granules/beige-blend.png', preview: '/colors/granules/beige-blend-preview.jpg', desc: 'Cream & almond architectural flake matrix' },
    { id: 'blue-blend', name: 'Blue Blend', hex: '#1f4e79', image: '/colors/granules/blue-blend.png', preview: '/colors/granules/blue-blend-preview.jpg', desc: 'Cobalt & sapphire showroom polymer flakes' },
    { id: 'red-blend', name: 'Red Blend', hex: '#a93226', image: '/colors/granules/red-blend.png', preview: '/colors/granules/red-blend-preview.jpg', desc: 'Crimson & terracotta accent granules' },
    { id: 'green-blend', name: 'Green Blend', hex: '#27ae60', image: '/colors/granules/green-blend.png', preview: '/colors/granules/green-blend-preview.jpg', desc: 'Forest & olive botanical quartz flake blend' },
    { id: 'blue-gray-blend', name: 'Blue Gray Blend', hex: '#4a607a', image: '/colors/granules/blue-gray-blend.png', preview: '/colors/granules/blue-gray-blend-preview.jpg', desc: 'Steel gray & arctic blue heavy-duty coating' },
  ],
};

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

function buildSwatchesFromData(categories) {
  const map = { ...DEFAULT_SWATCHES };
  if (!Array.isArray(categories)) return map;

  categories.forEach((cat) => {
    let tabName = cat.name;
    const norm = (cat.name || '').toLowerCase();
    if (norm.includes('opaque')) tabName = 'Opaque';
    else if (norm.includes('metallic')) tabName = 'Metallic';
    else if (norm.includes('pearl')) tabName = 'Pearl Powder';
    else if (norm.includes('granual') || norm.includes('granule')) tabName = 'Granual Epoxy';

    if (Array.isArray(cat.shades) && cat.shades.length > 0) {
      map[tabName] = cat.shades.map((s) => {
        const rawImg = s.image || s.image_url || `/colors/${s.name}.png`;
        const rawPreview = s.preview || s.preview_url || rawImg;
        return {
          id: s.id || (s.code ? String(s.code).toLowerCase() : String(s.name).toLowerCase().replace(/\s+/g, '-')),
          name: s.name,
          code: s.code || '',
          hex: s.hex || s.hex_color || '#ffd700',
          image: resolveImageUrl(rawImg),
          preview: resolveImageUrl(rawPreview),
          desc: s.desc || s.description || '',
          stockStatus: s.stock_status || 'In Stock',
        };
      });
    }
  });

  return map;
}

export default function PigmentsFinishesSection() {
  const [swatchesMap, setSwatchesMap] = useState(() => buildSwatchesFromData(pigmentsData));
  const [tabsList, setTabsList] = useState(DEFAULT_PIGMENT_TABS);
  const [activeTab, setActiveTab] = useState('Metallic');
  const [selectedSwatch, setSelectedSwatch] = useState(() => {
    const initialMetallic = buildSwatchesFromData(pigmentsData)['Metallic'] || DEFAULT_SWATCHES['Metallic'];
    return initialMetallic[0];
  });
  const [hoveredSwatch, setHoveredSwatch] = useState(null);

  // RAL Chart specific state
  const [selectedRalGroup, setSelectedRalGroup] = useState('All');
  const [ralSearchQuery, setRalSearchQuery] = useState('');
  const [selectedRalColor, setSelectedRalColor] = useState(ralColors[45] || ralColors[0]); // Default to RAL 3003 Ruby red
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Fetch live categories and shades from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadLivePigments() {
      try {
        const json = await fetchFromApi('/api/vize/pigments');
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const newMap = buildSwatchesFromData(json.data);
          const dynamicTabs = [];

          json.data.forEach((cat) => {
            const isRal = cat.id === 'ral' || cat.slug === 'ral' || (cat.name && cat.name.includes('RAL'));
            if (isRal) return;

            let tabName = cat.name;
            const norm = (cat.name || '').toLowerCase();
            if (norm.includes('opaque')) tabName = 'Opaque';
            else if (norm.includes('metallic')) tabName = 'Metallic';
            else if (norm.includes('pearl')) tabName = 'Pearl Powder';
            else if (norm.includes('granual') || norm.includes('granule')) tabName = 'Granual Epoxy';

            if (!dynamicTabs.includes(tabName)) {
              dynamicTabs.push(tabName);
            }
          });

          if (!dynamicTabs.includes('RAL Classic Chart (200+)')) {
            dynamicTabs.push('RAL Classic Chart (200+)');
          }

          setTabsList(dynamicTabs);
          setSwatchesMap(newMap);

          setActiveTab((curTab) => {
            const currentList = newMap[curTab] || [];
            if (currentList.length > 0) {
              setSelectedSwatch((curSelected) => {
                const found = currentList.find((s) => s.id === curSelected?.id || s.name === curSelected?.name);
                return found || currentList[0];
              });
            }
            return curTab;
          });
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    loadLivePigments();
    return () => { isMounted = false; };
  }, []);

  const isRalMode = activeTab === 'RAL Classic Chart (200+)';

  // Filtered RAL colors based on search and group
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

  const swatches = swatchesMap[activeTab] || swatchesMap['Metallic'] || swatchesMap['Opaque'] || [];
  const currentPreview = hoveredSwatch || selectedSwatch || swatches[0] || {};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'RAL Classic Chart (200+)') {
      const list = swatchesMap[tab] || [];
      if (list.length > 0) {
        setSelectedSwatch(list[0]);
      }
    }
    setHoveredSwatch(null);
  };

  return (
    <section className="pigments-section" id="finishes" aria-label="Pigments & Finishes">
      <div className="pigments-container">
        {/* Header Block with Quick PDF Download Link */}
        <div className="pigments-header-top">
          <div className="pigments-eyebrow-wrap">
            <span className="pigments-eyebrow">PIGMENTS & FINISHES</span>
            <span className="pigments-eyebrow-line" />
          </div>

          <div className="pigments-title-row">
            <h2 className="pigments-title">
              Find your<br />
              signature finish.
            </h2>

            {/* Quick Action Pill for RAL PDF */}
            <div className="pigments-pdf-quick-action">
              <a
                href="/ral-colour-chart.pdf"
                download="RAL-Classic-Colour-Chart-VIZE.pdf"
                className="pigments-pdf-btn"
                title="Download complete 4-page official RAL Classic colour chart PDF"
              >
                <Download size={16} />
                <span>Download RAL Colour Chart (PDF)</span>
              </a>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="pigments-pdf-view-btn"
                title="Preview PDF Chart in interactive viewer"
              >
                <FileText size={16} />
                <span>View Full Chart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Sub-tabs */}
        <div className="pigments-tabs">
          {tabsList.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`pigments-tab-btn ${activeTab === tab ? 'active' : ''} ${
                tab.includes('RAL') ? 'ral-tab-highlight' : ''
              }`}
            >
              {tab}
              {tab.includes('RAL') && <span className="ral-tab-badge">200+ Shades</span>}
            </button>
          ))}
        </div>

        {/* =================================================================
            VIEW 1: SIGNATURE VIZE RESIN FINISHES (Opaque, Metallic, Pearl)
           ================================================================= */}
        {!isRalMode ? (
          <div className="pigments-grid">
            {/* Left Column: Swatches */}
            <div className="pigments-info-col">
              <div className="pigments-swatches-row">
                {swatches.map((swatch) => {
                  const isSelected = selectedSwatch?.id === swatch.id;
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
                      title={swatch.name}
                      aria-label={`Select ${swatch.name} finish`}
                    >
                      <div
                        className="pigment-swatch-circle"
                        style={{ backgroundColor: swatch.hex || '#cbd5e1' }}
                      >
                        <img
                          src={swatch.image}
                          alt={swatch.name}
                          className="swatch-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.opacity = '0';
                          }}
                        />
                        <div className="swatch-inner-gloss" />
                      </div>
                      <span className="pigment-swatch-label">{swatch.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pigments-category-note">
                <Sparkles size={16} className="note-sparkle" />
                <span>
                  {activeTab === 'Granual Epoxy'
                    ? 'Textured • Durable • Decorative multi-blend vinyl polymer flakes and quartz granules broadcast into 100% solids epoxy for slip-resistant, impact-proof floors.'
                    : 'High-dispersion, UV-stabilized pigments engineered for zero settlement in deep castings & metallic flooring screeds.'}
                </span>
              </div>
            </div>

            {/* Right Column: Dynamic Live Preview Texture Banner */}
            <div className="pigments-banner-col">
              <div
                className="pigments-banner-card"
                style={{
                  backgroundColor: currentPreview?.hex || '#0b1519',
                  background: currentPreview?.hex
                    ? `radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.45) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.4) 0%, transparent 50%), linear-gradient(135deg, ${currentPreview.hex} 0%, #0b1519 100%)`
                    : '#0b1519'
                }}
              >
                <img
                  key={currentPreview.id || currentPreview.name}
                  src={currentPreview.preview || currentPreview.image}
                  alt={`${currentPreview.name} pigment resin texture`}
                  className={`pigments-banner-img dynamic-fade ${activeTab === 'Granual Epoxy' ? 'granule-banner-fit' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="pigments-banner-overlay">
                  <div className="pigments-active-name-badge">
                    <span className="pigments-badge-category">
                      {activeTab === 'Granual Epoxy' ? 'GRANUAL EPOXY SYSTEM' : activeTab}
                    </span>
                    <span className="pigments-badge-name">{currentPreview.name}</span>
                  </div>

                  {activeTab === 'Granual Epoxy' ? (
                    <div className="granules-active-blend-badge">
                      <div className="granule-mini-swatch" style={{ backgroundColor: currentPreview.hex || '#222' }}>
                        <img
                          src={currentPreview.image}
                          alt={currentPreview.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
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
        ) : (
          /* =================================================================
              VIEW 2: RAL CLASSIC INTERACTIVE COLOR CHART (200+ SHADES)
             ================================================================= */
          <div className="ral-explorer-container">
            {/* Top Toolbar: Search & Group Filter */}
            <div className="ral-toolbar">
              <div className="ral-search-box">
                <Search size={18} className="ral-search-icon" />
                <input
                  type="text"
                  placeholder="Search RAL code or shade name (e.g. 7016, Ultramarine, Jet Black)..."
                  value={ralSearchQuery}
                  onChange={(e) => setRalSearchQuery(e.target.value)}
                  className="ral-search-input"
                />
                {ralSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRalSearchQuery('')}
                    className="ral-clear-btn"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Color Group Filter Pills */}
              <div className="ral-groups-scroll">
                {RAL_GROUPS.map((grp) => {
                  const count =
                    grp === 'All'
                      ? ralColors.length
                      : ralColors.filter((c) => c.group === grp).length;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedRalGroup(grp)}
                      className={`ral-group-pill ${selectedRalGroup === grp ? 'active' : ''}`}
                    >
                      {grp} <span className="ral-group-count">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RAL Explorer Main Grid */}
            <div className="ral-layout-grid">
              {/* Left Column: Swatches Matrix */}
              <div className="ral-swatches-matrix-wrap">
                <div className="ral-matrix-info-bar">
                  <span>
                    Showing <strong>{filteredRalColors.length}</strong> of {ralColors.length} standard industrial RAL shades
                  </span>
                  <span className="ral-guidance-note">
                    * Exact formulation batch matching available for all systems
                  </span>
                </div>

                <div className="ral-swatches-grid">
                  {filteredRalColors.length > 0 ? (
                    filteredRalColors.map((color) => {
                      const isSelected = selectedRalColor.code === color.code;
                      return (
                        <button
                          key={color.code}
                          type="button"
                          onClick={() => setSelectedRalColor(color)}
                          className={`ral-swatch-card ${isSelected ? 'selected' : ''}`}
                          title={`${color.code} - ${color.name} (${color.hex})`}
                          aria-label={`Select ${color.code} ${color.name}`}
                        >
                          <div
                            className="ral-swatch-color-box"
                            style={{ backgroundColor: color.hex }}
                          >
                            <div className="ral-swatch-specular" />
                            {isSelected && (
                              <div className="ral-swatch-check">
                                <Check size={14} />
                              </div>
                            )}
                          </div>
                          <div className="ral-swatch-details">
                            <span className="ral-swatch-code">{color.code}</span>
                            <span className="ral-swatch-name">{color.name}</span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="ral-no-results">
                      <p>No RAL shades matching &quot;{ralSearchQuery}&quot; in group &quot;{selectedRalGroup}&quot;.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setRalSearchQuery('');
                          setSelectedRalGroup('All');
                        }}
                        className="ral-reset-btn"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Resin Simulation & Color Spec Card */}
              <div className="ral-preview-col">
                <div className="ral-spec-card">
                  {/* Fluid High-Gloss Simulation Preview */}
                  <div
                    className="ral-simulation-screen"
                    style={{
                      backgroundColor: selectedRalColor.hex,
                      backgroundImage: `
                        radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.45) 0%, transparent 45%),
                        radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.35) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 60%)
                      `
                    }}
                  >
                    <div className="ral-sim-glass-layer" />
                    
                    <div className="ral-sim-badge">
                      <span className="ral-sim-brand">VIZE POLYMER PIGMENT</span>
                      <h3 className="ral-sim-code">{selectedRalColor.code}</h3>
                      <p className="ral-sim-name">{selectedRalColor.name}</p>
                    </div>

                    <div className="ral-sim-badge-bottom">
                      <span className="ral-hex-badge">{selectedRalColor.hex}</span>
                      <span className="ral-page-ref">PDF Chart: Page {selectedRalColor.page}</span>
                    </div>
                  </div>

                  {/* Specification Breakdown */}
                  <div className="ral-spec-body">
                    <div className="ral-spec-row">
                      <span className="ral-spec-label">Color Series:</span>
                      <span className="ral-spec-val">{selectedRalColor.group} Series</span>
                    </div>
                    <div className="ral-spec-row">
                      <span className="ral-spec-label">Hex Equivalent:</span>
                      <span className="ral-spec-val">
                        <code>{selectedRalColor.hex}</code>
                      </span>
                    </div>
                    <div className="ral-spec-row">
                      <span className="ral-spec-label">Compatible Systems:</span>
                      <span className="ral-spec-val">Vize Cast, SuperCast, Polyaspartic & Floor Screed</span>
                    </div>
                    <div className="ral-spec-row">
                      <span className="ral-spec-label">UV Stability:</span>
                      <span className="ral-spec-val highlight-green">Grade A (Non-Fading Aliphatic)</span>
                    </div>

                    {/* Actions */}
                    <div className="ral-spec-actions">
                      <Link
                        to={`/contact`}
                        className="ral-order-btn"
                        title={`Request custom pigment match for ${selectedRalColor.code} ${selectedRalColor.name}`}
                      >
                        <span>Request Custom RAL Batch</span>
                        <ChevronRight size={16} />
                      </Link>

                      <a
                        href="/ral-colour-chart.pdf"
                        download="RAL-Classic-Colour-Chart-VIZE.pdf"
                        className="ral-download-outline-btn"
                      >
                        <Download size={15} />
                        <span>Download 4-Page PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL: INTERACTIVE PDF CHART VIEWER
           ================================================================= */}
        {isPdfModalOpen && (
          <div className="ral-pdf-modal-backdrop" onClick={() => setIsPdfModalOpen(false)}>
            <div className="ral-pdf-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="ral-pdf-modal-header">
                <div className="ral-pdf-modal-title-wrap">
                  <FileText size={20} className="ral-pdf-modal-icon" />
                  <div>
                    <h3 className="ral-pdf-modal-title">RAL Classic Colour Chart (Official Specification)</h3>
                    <p className="ral-pdf-modal-sub">Complete 4-Page Reference Guide for Industrial & Architectural Polymer Formulations</p>
                  </div>
                </div>

                <div className="ral-pdf-modal-btns">
                  <a
                    href="/ral-colour-chart.pdf"
                    download="RAL-Classic-Colour-Chart-VIZE.pdf"
                    className="ral-modal-download-btn"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(false)}
                    className="ral-modal-close-btn"
                    aria-label="Close PDF Viewer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="ral-pdf-modal-body">
                <iframe
                  src="/ral-colour-chart.pdf#toolbar=1&navpanes=0&scrollbar=1"
                  title="RAL Classic Colour Chart PDF"
                  className="ral-pdf-iframe"
                />
              </div>

              <div className="ral-pdf-modal-footer">
                <span>The colours depicted are for guidance. The finished cured polymer colour may vary slightly depending on substrate depth & light angle.</span>
                <Link
                  to="/contact"
                  className="ral-modal-consult-link"
                  onClick={() => setIsPdfModalOpen(false)}
                >
                  Consult a Lab Engineer <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
