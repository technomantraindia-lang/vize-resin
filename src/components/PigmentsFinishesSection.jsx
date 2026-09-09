import { useState } from 'react';

const PIGMENT_TABS = ['Opaque', 'Metallic', 'Pearl Powder'];

const SWATCHES = {
  Opaque: [
    { id: 'petrol-teal', name: 'Petrol Teal', image: '/colors/Petrol Teal.png' },
    { id: 'copper', name: 'Copper', image: '/colors/Copper.png' },
    { id: 'deep-blue', name: 'Deep Blue', image: '/colors/Deep Blue.png' },
    { id: 'silver', name: 'Silver', image: '/colors/Silver.png' },
    { id: 'pearl', name: 'Pearl', image: '/colors/Pearl.png' },
    { id: 'charcoal', name: 'Charcoal', image: '/colors/Charcoal.png' },
  ],
  Metallic: [
    { id: 'liquid-gold', name: 'Liquid Gold', image: '/colors/Liquid Gold.png' },
    { id: 'bronze-vein', name: 'Bronze Vein', image: '/colors/Bronze Vein.png' },
    { id: 'titanium', name: 'Titanium', image: '/colors/Titanium.png' },
    { id: 'emerald-spark', name: 'Emerald Spark', image: '/colors/Emerald Spark.png' },
    { id: 'ruby-smoke', name: 'Ruby Smoke', image: '/colors/Ruby Smoke.png' },
    { id: 'obsidian', name: 'Obsidian', image: '/colors/Obsidian.png' },
  ],
  'Pearl Powder': [
    { id: 'moonstone', name: 'Moonstone', image: '/colors/Moonstone.png' },
    { id: 'sunburst', name: 'Sunburst', image: '/colors/Sunburst.png' },
    { id: 'rose-quartz', name: 'Rose Quartz', image: '/colors/Rose Quartz.png' },
    { id: 'sapphire-mist', name: 'Sapphire Mist', image: '/colors/Sapphire Mist.png' },
    { id: 'champagne', name: 'Champagne', image: '/colors/Champagne.png' },
    { id: 'graphite', name: 'Graphite', image: '/colors/Graphite.png' },
  ],
};

export default function PigmentsFinishesSection() {
  const [activeTab, setActiveTab] = useState('Opaque');
  const [selectedSwatch, setSelectedSwatch] = useState(SWATCHES['Opaque'][0]);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);

  const swatches = SWATCHES[activeTab] || SWATCHES['Opaque'];
  const currentPreview = hoveredSwatch || selectedSwatch || swatches[0];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedSwatch(SWATCHES[tab][0]);
    setHoveredSwatch(null);
  };

  return (
    <section className="pigments-section" id="finishes" aria-label="Pigments & Finishes">
      <div className="pigments-container">
        <div className="pigments-grid">
          {/* Left Column: Title, Tabs, Swatches */}
          <div className="pigments-info-col">
            <div className="pigments-eyebrow-wrap">
              <span className="pigments-eyebrow">PIGMENTS & FINISHES</span>
              <span className="pigments-eyebrow-line" />
            </div>

            <h2 className="pigments-title">
              Find your<br />
              signature finish.
            </h2>

            {/* Category Sub-tabs */}
            <div className="pigments-tabs">
              {PIGMENT_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`pigments-tab-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Swatches Row */}
            <div className="pigments-swatches-row">
              {swatches.map((swatch) => {
                const isSelected = selectedSwatch.id === swatch.id;
                const isHovered = hoveredSwatch?.id === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setSelectedSwatch(swatch)}
                    onMouseEnter={() => setHoveredSwatch(swatch)}
                    onMouseLeave={() => setHoveredSwatch(null)}
                    className={`pigment-swatch-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                    title={swatch.name}
                    aria-label={`Select ${swatch.name} finish`}
                  >
                    <div className="pigment-swatch-circle">
                      <img
                        src={swatch.image}
                        alt={swatch.name}
                        className="swatch-img"
                        loading="lazy"
                      />
                      <div className="swatch-inner-gloss" />
                    </div>
                    <span className="pigment-swatch-label">{swatch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Live Preview Texture Banner */}
          <div className="pigments-banner-col">
            <div className="pigments-banner-card">
              <img
                key={currentPreview.image}
                src={currentPreview.image}
                alt={`${currentPreview.name} pigment resin texture`}
                className="pigments-banner-img dynamic-fade"
              />
              <div className="pigments-banner-overlay">
                <div className="pigments-active-name-badge">
                  <span className="pigments-badge-category">{activeTab}</span>
                  <span className="pigments-badge-name">{currentPreview.name}</span>
                </div>
                <span className="pigments-banner-caption">
                  COLOUR CREATES<br />
                  EMOTION.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

