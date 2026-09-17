import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Calculator,
  Maximize2,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Info,
  Download
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ALL_COLORS } from '../data/colors';

// 1. Applications Data (Matches Screenshot 1)
const APPLICATIONS_DATA = [
  {
    id: 'river-tables',
    title: 'River Tables',
    desc: 'Bold designs that make a statement.',
    image: '/vize-table-top/02-river-tables.png',
    longDesc: 'Dramatic translucent and colored river channels cast between natural live-edge timber slabs.',
    recommendedResin: 'Vize SuperCast',
    pourDepth: 'Up to 100mm per pour'
  },
  {
    id: 'dining-coffee',
    title: 'Dining & Coffee Tables',
    desc: 'Everyday beauty, made to last.',
    image: '/vize-table-top/03-dining-coffee-tables.png',
    longDesc: 'Durable, heat-resistant surfaces combining organic burl timbers with high-gloss epoxy encapsulation.',
    recommendedResin: 'Vize Cast',
    pourDepth: '20mm – 40mm'
  },
  {
    id: 'countertops-bars',
    title: 'Countertops & Bars',
    desc: 'Durable surfaces for modern living.',
    image: '/vize-table-top/04-countertops-bars.png',
    longDesc: 'Seamless, stain-resistant and food-contact safe epoxy coatings for islands, bars, and luxury kitchen tops.',
    recommendedResin: 'Vize Cast + GlassCoat',
    pourDepth: 'Self-leveling 2mm – 5mm'
  },
  {
    id: 'art-object-casting',
    title: 'Art & Object Casting',
    desc: 'Turn ideas into one-of-a-kind pieces.',
    image: '/vize-table-top/05-art-object-casting.png',
    longDesc: 'Crystal-clear encapsulations, botanical embeds, custom sculptures, and geometric resin blocks.',
    recommendedResin: 'Vize MaxArt',
    pourDepth: 'High-clarity precision casting'
  }
];

// 2. Featured Products Data (Matches Screenshot 2)
const CASTING_PRODUCTS = [
  {
    id: 'vize-cast',
    name: 'Vize Cast',
    tagline: 'Reliable performance for stunning table tops.',
    image: '/vize-table-top/06-vize-cast-bucket.png',
    price: '₹3,499',
    badge: 'Standard Pours',
    specs: 'Up to 40mm thickness • 2:1 Ratio • 24h Cure',
    link: '/product/vize-cast'
  },
  {
    id: 'vize-supercast',
    name: 'Vize SuperCast',
    tagline: 'For deeper pours and larger table projects.',
    image: '/vize-table-top/07-vize-supercast-bucket.png',
    price: '₹4,499',
    badge: 'Deep Pour Master',
    specs: 'Single pour up to 100mm • Ultra-low Exotherm • 48-72h Cure',
    link: '/product/vize-supercast'
  },
  {
    id: 'vize-maxart',
    name: 'Vize MaxArt',
    tagline: 'Creative freedom for unique designs and objects.',
    image: '/vize-table-top/08-vize-maxart-bucket.png',
    price: '₹2,499',
    badge: 'High Gloss Art',
    specs: '1:1 Volume Ratio • Self-Doming • UV Stable',
    link: '/product/vize-maxart'
  }
];

// 3. The 5-Step Process Data (Matches Screenshot 2)
const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Plan & Prepare',
    desc: 'Design, source and prepare your timber.',
    image: '/vize-table-top/09-plan-prepare.png',
    details: 'Select kiln-dried wood (<10% moisture), flatten with router sled or planer, clean bark, and build an airtight sealed mold.'
  },
  {
    num: '02',
    title: 'Seal the Wood',
    desc: 'Prepare the surface for a perfect result.',
    image: '/vize-table-top/10-seal-the-wood.png',
    details: 'Brush a thin coat of Vize Cast onto live edges and end grains to lock in moisture and eliminate micro-bubbles during main pour.'
  },
  {
    num: '03',
    title: 'Mix & Pigment',
    desc: 'Combine and add colour or effects.',
    image: '/vize-table-top/11-mix-pigment.png',
    details: 'Accurately weigh Part A & B, blend in metallic mica powder or translucent tint, and stir gently for 4-5 minutes scraping sides.'
  },
  {
    num: '04',
    title: 'Pour & Release Bubbles',
    desc: 'Pour slowly and remove trapped air.',
    image: '/vize-table-top/12-pour-release-bubbles.png',
    details: 'Pour resin slowly in a steady laminar stream into the mold. Pass a heat torch or heat gun lightly over surface to pop rising bubbles.'
  },
  {
    num: '05',
    title: 'Cure & Finish',
    desc: 'Let it cure, then sand and finish to perfection.',
    image: '/vize-table-top/13-cure-finish.png',
    details: 'Allow full cure in temperature-controlled room (22-25°C), demold, progressive sand from 80 to 2000 grit, and buff with Vize CutMax & ShineMax.'
  }
];

// 4. Finish Swatches Categories & Dedicated Table Swatches (Matches Screenshot 3)
const FINISH_CATEGORIES = ['Opaque', 'Metallic', 'Pearl Powder'];

const TABLE_SWATCHES_BY_CAT = {
  Metallic: [
    { id: 'liquid-gold', name: 'Liquid Gold', category: 'Metallic', image: '/vize-table-top/14-liquid-gold.png', desc: '24K reflective gold flakes suspended in crystal resin' },
    { id: 'bronze-vein', name: 'Bronze Vein', category: 'Metallic', image: '/vize-table-top/15-bronze-vein.png', desc: 'Antiqued bronze with veins of warm metallic ember' },
    { id: 'titanium', name: 'Titanium', category: 'Metallic', image: '/vize-table-top/16-titanium.png', desc: 'Gunmetal industrial titanium with deep dimensional flake' },
    { id: 'emerald-spark', name: 'Emerald Spark', category: 'Metallic', image: '/vize-table-top/17-emerald-spark.png', desc: 'Vibrant gemstone green with micro-crystal sparkles' },
    { id: 'ruby-smoke', name: 'Ruby Smoke', category: 'Metallic', image: '/vize-table-top/18-ruby-smoke.png', desc: 'Deep burgundy velvet with smoky amber marbling' },
    { id: 'obsidian', name: 'Obsidian', category: 'Metallic', image: '/vize-table-top/19-obsidian.png', desc: 'Jet-black volcanic glass effect with subtle graphite depth' }
  ],
  Opaque: [
    { id: 'petrol-teal', name: 'Petrol Teal', category: 'Opaque', image: '/colors/Petrol Teal.png', desc: 'Deep oceanic teal with high-gloss metallic flow' },
    { id: 'copper', name: 'Copper', category: 'Opaque', image: '/colors/Copper.png', desc: 'Warm molten copper with rich metallic shimmer' },
    { id: 'deep-blue', name: 'Deep Blue', category: 'Opaque', image: '/colors/Deep Blue.png', desc: 'Royal cobalt blue with midnight swirl gradients' },
    { id: 'silver', name: 'Silver', category: 'Opaque', image: '/colors/Silver.png', desc: 'Pure liquid platinum with brilliant specular highlight' },
    { id: 'pearl', name: 'Pearl', category: 'Opaque', image: '/colors/Pearl.png', desc: 'Lustrous satin pearl with opalescent white undertones' },
    { id: 'charcoal', name: 'Charcoal', category: 'Opaque', image: '/colors/Charcoal.png', desc: 'Smoky industrial dark slate with fine mica sparkles' }
  ],
  'Pearl Powder': [
    { id: 'moonstone', name: 'Moonstone', category: 'Pearl Powder', image: '/colors/Moonstone.png', desc: 'Soft celestial glow with iridescent lavender-white sheen' },
    { id: 'sunburst', name: 'Sunburst', category: 'Pearl Powder', image: '/colors/Sunburst.png', desc: 'Radiant sunrise gold with warm amber dispersion' },
    { id: 'rose-quartz', name: 'Rose Quartz', category: 'Pearl Powder', image: '/colors/Rose Quartz.png', desc: 'Blush pink mineral swirl with gentle pearl luster' },
    { id: 'sapphire-mist', name: 'Sapphire Mist', category: 'Pearl Powder', image: '/colors/Sapphire Mist.png', desc: 'Electric sapphire blue infused with diamond dust mica' },
    { id: 'champagne', name: 'Champagne', category: 'Pearl Powder', image: '/colors/Champagne.png', desc: 'Subtle sparkling beige gold for architectural elegance' },
    { id: 'graphite', name: 'Graphite', category: 'Pearl Powder', image: '/colors/Graphite.png', desc: 'Sleek carbon grey with multi-tonal light reflection' }
  ]
};

// 5. Table Inspiration Gallery Data (Matches Screenshot 3)
const INSPIRATION_GALLERY = [
  {
    id: 'inspire-1',
    title: 'Walnut & Emerald River Table',
    category: 'River Table',
    image: '/vize-table-top/20-teal-river-dining-table.png',
    layout: 'large',
    desc: 'Custom 10-seater black walnut slab with swirling turquoise emerald river channel.'
  },
  {
    id: 'inspire-2',
    title: 'Obsidian Nebula Round Table',
    category: 'Coffee Table',
    image: '/vize-table-top/21-black-resin-coffee-table.png',
    layout: 'small-top',
    desc: 'Deep cosmic obsidian black metallic resin with fine silver swirl patterns.'
  },
  {
    id: 'inspire-3',
    title: 'Calacatta Epoxy Waterfall Island',
    category: 'Kitchen Countertop',
    image: '/vize-table-top/22-pearl-white-resin-table.png',
    layout: 'small-bottom',
    desc: 'Zero-seam marbleized white and gold resin waterfall edge countertop.'
  },
  {
    id: 'inspire-4',
    title: 'Amber Vein Live-Edge Console',
    category: 'Console Table',
    image: '/vize-table-top/23-amber-live-edge-console.png',
    layout: 'tall-right',
    desc: 'Illuminated warm amber liquid copper river table on blackened steel legs.'
  }
];

export default function TableTopsPage() {
  const [activeCategory, setActiveCategory] = useState('Metallic');
  const [selectedSwatch, setSelectedSwatch] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSubject, setConsultSubject] = useState('General Table Project Inquiry');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Calculator state
  const [calcUnits, setCalcUnits] = useState('cm'); // 'cm' or 'inches'
  const [calcLength, setCalcLength] = useState(150);
  const [calcWidth, setCalcWidth] = useState(30); // river width
  const [calcDepth, setCalcDepth] = useState(4); // thickness
  const [calcWasteMargin, setCalcWasteMargin] = useState(10); // % extra

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter swatches by active category
  const filteredSwatches = TABLE_SWATCHES_BY_CAT[activeCategory] || TABLE_SWATCHES_BY_CAT['Metallic'];

  // Calculate resin requirements
  const calculateResin = () => {
    let volumeLiters = 0;
    if (calcUnits === 'cm') {
      // L x W x D in cm3 -> / 1000 = Liters
      volumeLiters = (calcLength * calcWidth * calcDepth) / 1000;
    } else {
      // inches: 1 cubic inch = 0.0163871 Liters
      volumeLiters = calcLength * calcWidth * calcDepth * 0.0163871;
    }
    const withWaste = volumeLiters * (1 + calcWasteMargin / 100);
    // Epoxy resin density approx 1.1 kg/L
    const weightKg = withWaste * 1.1;

    let recommendedSystem = 'Vize Cast';
    const depthInCm = calcUnits === 'cm' ? calcDepth : calcDepth * 2.54;
    if (depthInCm > 4.5) {
      recommendedSystem = 'Vize SuperCast (Deep Pour)';
    } else {
      recommendedSystem = 'Vize Cast (Standard Pour)';
    }

    return {
      liters: withWaste.toFixed(2),
      kg: weightKg.toFixed(2),
      recommendedSystem,
      depthInCm: depthInCm.toFixed(1)
    };
  };

  const calcResult = calculateResin();

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const openConsult = (subject) => {
    setConsultSubject(subject || 'Table Project Inquiry');
    setFormSubmitted(false);
    setIsConsultModalOpen(true);
  };

  return (
    <div className="table-tops-page-root">
      <Header />

      <main>
        {/* =================================================================
            1. HERO SECTION (Matches Screenshot 1 Part 1)
           ================================================================= */}
        <section className="tt-hero-section" aria-label="Table Tops Hero">
          <div className="tt-hero-bg-overlay" />
          <div className="tt-hero-container">
            <div className="tt-hero-content">
              <h1 className="tt-hero-title">
                Table tops,<br />
                <span className="tt-hero-title-italic">cast to last.</span>
              </h1>
              <p className="tt-hero-subtitle">
                Extraordinary tables start with extraordinary resin. Create timeless
                surfaces with VIZE.
              </p>
              <div className="tt-hero-actions">
                <a href="#casting-systems" className="tt-btn-primary">
                  Explore Table Resins <ArrowRight size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="tt-btn-secondary"
                >
                  <Calculator size={16} /> Plan Your Project
                </button>
              </div>
            </div>

            {/* Bottom-right aesthetic brand tagline */}
            <div className="tt-hero-corner-tag">
              <span className="tt-hero-tag-text">NATURAL MATERIALS</span>
              <span className="tt-hero-tag-text">EXTRAORDINARY POSSIBILITIES</span>
              <div className="tt-hero-tag-line" />
            </div>
          </div>
        </section>

        {/* =================================================================
            2. APPLICATIONS SECTION (Matches Screenshot 1 Part 1)
           ================================================================= */}
        <section className="tt-section tt-applications-section" id="applications">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">APPLICATIONS</span>
                <h2 className="tt-section-title">
                  Made for remarkable <span className="tt-title-italic">surfaces.</span>
                </h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  From statement dining tables to functional countertops, VIZE resin
                  helps you create beautiful, durable surfaces for any space.
                </p>
              </div>
            </div>

            <div className="tt-applications-grid">
              {APPLICATIONS_DATA.map((app) => (
                <div
                  key={app.id}
                  className="tt-app-card"
                  onClick={() => setLightboxImage(app)}
                >
                  <div className="tt-app-img-wrapper">
                    <img
                      src={app.image}
                      alt={app.title}
                      className="tt-app-img"
                      loading="lazy"
                    />
                    <div className="tt-app-img-overlay">
                      <span className="tt-app-badge">{app.recommendedResin}</span>
                    </div>
                  </div>
                  <div className="tt-app-content">
                    <h3 className="tt-app-card-title">{app.title}</h3>
                    <p className="tt-app-card-desc">{app.desc}</p>
                    <button
                      type="button"
                      className="tt-app-link-btn"
                      aria-label={`Explore ${app.title}`}
                    >
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            3. FEATURED PRODUCTS (Matches Screenshot 2 Part 2)
           ================================================================= */}
        <section className="tt-section tt-products-section" id="casting-systems">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">FEATURED PRODUCTS</span>
                <h2 className="tt-section-title">Choose your casting system.</h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  Three purpose-built resin systems for exceptional table tops and
                  creative projects.
                </p>
              </div>
            </div>

            <div className="tt-products-grid">
              {CASTING_PRODUCTS.map((prod) => (
                <div key={prod.id} className="tt-product-card">
                  <div className="tt-product-img-box">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="tt-product-bucket-img"
                    />
                  </div>
                  <div className="tt-product-body">
                    <div className="tt-product-head">
                      <h3 className="tt-product-title">{prod.name}</h3>
                      <span className="tt-product-badge">{prod.badge}</span>
                    </div>
                    <p className="tt-product-tagline">{prod.tagline}</p>
                    <p className="tt-product-specs">{prod.specs}</p>
                    <div className="tt-product-footer">
                      <Link to={prod.link} className="tt-product-link">
                        View Product <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            4. THE PROCESS SECTION (Matches Screenshot 2 Part 2)
           ================================================================= */}
        <section className="tt-process-section" id="process">
          <div className="tt-container">
            <div className="tt-section-header tt-header-dark">
              <div className="tt-header-left">
                <span className="tt-eyebrow tt-eyebrow-accent">THE PROCESS</span>
                <h2 className="tt-section-title tt-title-white">
                  From timber to finished table.
                </h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc tt-desc-light">
                  A simple process, extraordinary results. Here's how to bring your
                  table top to life with VIZE.
                </p>
              </div>
            </div>

            <div className="tt-process-grid">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="tt-process-step-card"
                  onClick={() => setLightboxImage(step)}
                >
                  <div className="tt-process-img-box">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="tt-process-step-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="tt-process-step-info">
                    <div className="tt-step-num-title-row">
                      <span className="tt-step-num">{step.num}</span>
                      <div className="tt-step-title-col">
                        <h4 className="tt-step-title">{step.title}</h4>
                        <p className="tt-step-desc">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            5. FINISH EXPLORER SECTION (Matches Screenshot 3 Part 3)
           ================================================================= */}
        <section className="tt-section tt-finishes-section" id="finishes">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">FINISH EXPLORER</span>
                <h2 className="tt-section-title">Find your finish.</h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  Explore a range of striking finishes to bring your vision to life.
                  Colours shown are examples of what can be achieved.
                </p>
              </div>
            </div>

            {/* Segmented Filter Pills */}
            <div className="tt-finish-tabs-wrapper">
              <div className="tt-finish-tabs">
                {FINISH_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`tt-finish-tab-btn ${
                      activeCategory === cat ? 'active' : ''
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 6-Column Swatches Grid */}
            <div className="tt-swatches-grid">
              {filteredSwatches.map((color) => (
                <div
                  key={color.id}
                  className="tt-swatch-card"
                  onClick={() => setSelectedSwatch(color)}
                >
                  <div className="tt-swatch-img-box">
                    <img
                      src={color.image}
                      alt={color.name}
                      className="tt-swatch-img"
                      loading="lazy"
                    />
                    <div className="tt-swatch-hover-hint">
                      <span>Inspect Shade</span>
                    </div>
                  </div>
                  <h4 className="tt-swatch-name">{color.name}</h4>
                </div>
              ))}
            </div>

            {/* RAL Color Chart Callout Banner */}
            <div className="tt-ral-callout-banner">
              <div className="tt-ral-callout-left">
                <span className="tt-ral-callout-tag">ARCHITECTURAL SPECIFICATION</span>
                <h4 className="tt-ral-callout-title">Need custom RAL or industrial shades?</h4>
                <p className="tt-ral-callout-desc">
                  We formulate custom pigment batches matching all 200+ RAL Classic standards with certified UV lightfastness.
                </p>
              </div>
              <div className="tt-ral-callout-right">
                <a
                  href="/ral-colour-chart.pdf"
                  download="RAL-Classic-Colour-Chart-VIZE.pdf"
                  className="tt-ral-download-btn"
                >
                  <Download size={16} />
                  <span>Download RAL PDF Chart</span>
                </a>
                <Link to="/#finishes" className="tt-ral-explore-link">
                  <span>Explore RAL Palette</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            6. TABLE INSPIRATION SECTION (Matches Screenshot 3 Part 3)
           ================================================================= */}
        <section className="tt-section tt-inspiration-section" id="inspiration">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">OUR WORK</span>
                <h2 className="tt-section-title">Table inspiration.</h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  Real projects. Real possibilities. See what makers, designers and
                  homeowners have created with VIZE.
                </p>
              </div>
            </div>

            {/* Asymmetrical Gallery Matching Reference Part 3 */}
            <div className="tt-inspiration-masonry">
              {/* Left Large Column */}
              <div
                className="tt-inspire-card tt-inspire-card-large"
                onClick={() => setLightboxImage(INSPIRATION_GALLERY[0])}
              >
                <img
                  src={INSPIRATION_GALLERY[0].image}
                  alt={INSPIRATION_GALLERY[0].title}
                  className="tt-inspire-img"
                  loading="lazy"
                />
                <div className="tt-inspire-info-overlay">
                  <span className="tt-inspire-category">
                    {INSPIRATION_GALLERY[0].category}
                  </span>
                  <h3 className="tt-inspire-title">{INSPIRATION_GALLERY[0].title}</h3>
                  <p className="tt-inspire-desc">{INSPIRATION_GALLERY[0].desc}</p>
                </div>
              </div>

              {/* Middle 2 Stacked Horizontal Cards */}
              <div className="tt-inspire-col-middle">
                <div
                  className="tt-inspire-card tt-inspire-card-mid"
                  onClick={() => setLightboxImage(INSPIRATION_GALLERY[1])}
                >
                  <img
                    src={INSPIRATION_GALLERY[1].image}
                    alt={INSPIRATION_GALLERY[1].title}
                    className="tt-inspire-img"
                    loading="lazy"
                  />
                  <div className="tt-inspire-info-overlay">
                    <span className="tt-inspire-category">
                      {INSPIRATION_GALLERY[1].category}
                    </span>
                    <h4 className="tt-inspire-title">{INSPIRATION_GALLERY[1].title}</h4>
                  </div>
                </div>

                <div
                  className="tt-inspire-card tt-inspire-card-mid"
                  onClick={() => setLightboxImage(INSPIRATION_GALLERY[2])}
                >
                  <img
                    src={INSPIRATION_GALLERY[2].image}
                    alt={INSPIRATION_GALLERY[2].title}
                    className="tt-inspire-img"
                    loading="lazy"
                  />
                  <div className="tt-inspire-info-overlay">
                    <span className="tt-inspire-category">
                      {INSPIRATION_GALLERY[2].category}
                    </span>
                    <h4 className="tt-inspire-title">{INSPIRATION_GALLERY[2].title}</h4>
                  </div>
                </div>
              </div>

              {/* Right Vertical Tall Column */}
              <div
                className="tt-inspire-card tt-inspire-card-tall"
                onClick={() => setLightboxImage(INSPIRATION_GALLERY[3])}
              >
                <img
                  src={INSPIRATION_GALLERY[3].image}
                  alt={INSPIRATION_GALLERY[3].title}
                  className="tt-inspire-img"
                  loading="lazy"
                />
                <div className="tt-inspire-info-overlay">
                  <span className="tt-inspire-category">
                    {INSPIRATION_GALLERY[3].category}
                  </span>
                  <h3 className="tt-inspire-title">{INSPIRATION_GALLERY[3].title}</h3>
                  <p className="tt-inspire-desc">{INSPIRATION_GALLERY[3].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. GET IN TOUCH CTA BANNER (Matches Screenshot 3 Part 3)
           ================================================================= */}
        <section className="tt-cta-banner-section" aria-label="Get In Touch">
          <div className="tt-cta-banner-container">
            <div className="tt-cta-content-left">
              <span className="tt-cta-eyebrow">GET IN TOUCH</span>
              <h2 className="tt-cta-heading">
                Bring your table idea to life.
              </h2>
            </div>
            <div className="tt-cta-content-right">
              <p className="tt-cta-text">
                Have a project in mind? Our team is here to help you choose the
                right resin system and achieve the best results.
              </p>
              <div className="tt-cta-btn-group">
                <button
                  type="button"
                  onClick={() => openConsult('Resin Expert Advice')}
                  className="tt-cta-btn-expert"
                >
                  Ask a Resin Expert <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="tt-cta-btn-details"
                >
                  Send Project Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          MODAL 1: PROJECT ESTIMATOR & RESIN CALCULATOR
         ================================================================= */}
      {isCalculatorOpen && (
        <div
          className="tt-modal-backdrop"
          onClick={() => setIsCalculatorOpen(false)}
        >
          <div
            className="tt-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tt-modal-header">
              <div>
                <span className="tt-modal-eyebrow">PROJECT PLANNER</span>
                <h3 className="tt-modal-title">Table Resin Estimator</h3>
              </div>
              <button
                type="button"
                className="tt-modal-close-btn"
                onClick={() => setIsCalculatorOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="tt-calculator-body">
              <div className="tt-calc-units-switch">
                <label className="tt-calc-label">Measurement Units:</label>
                <div className="tt-unit-pills">
                  <button
                    type="button"
                    className={`tt-unit-btn ${calcUnits === 'cm' ? 'active' : ''}`}
                    onClick={() => setCalcUnits('cm')}
                  >
                    Centimeters (cm)
                  </button>
                  <button
                    type="button"
                    className={`tt-unit-btn ${calcUnits === 'inches' ? 'active' : ''}`}
                    onClick={() => setCalcUnits('inches')}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>

              <div className="tt-calc-inputs-grid">
                <div className="tt-calc-field">
                  <label>
                    Table / River Length ({calcUnits}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={calcLength}
                    onChange={(e) => setCalcLength(Number(e.target.value))}
                    className="tt-input"
                  />
                </div>
                <div className="tt-calc-field">
                  <label>
                    Average Void / River Width ({calcUnits}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(Number(e.target.value))}
                    className="tt-input"
                  />
                </div>
                <div className="tt-calc-field">
                  <label>
                    Pour Depth / Slab Thickness ({calcUnits}):
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={calcDepth}
                    onChange={(e) => setCalcDepth(Number(e.target.value))}
                    className="tt-input"
                  />
                </div>
                <div className="tt-calc-field">
                  <label>Wood Absorption & Margin (%):</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={calcWasteMargin}
                    onChange={(e) => setCalcWasteMargin(Number(e.target.value))}
                    className="tt-input"
                  />
                </div>
              </div>

              {/* Live Calculation Output Card */}
              <div className="tt-calc-result-box">
                <div className="tt-calc-stat">
                  <span className="tt-calc-stat-label">Estimated Resin Required</span>
                  <span className="tt-calc-stat-val">
                    {calcResult.kg} <span className="tt-calc-unit">kg</span>
                  </span>
                  <span className="tt-calc-stat-sub">({calcResult.liters} Liters volume)</span>
                </div>
                <div className="tt-calc-stat">
                  <span className="tt-calc-stat-label">Recommended Casting System</span>
                  <span className="tt-calc-stat-system">{calcResult.recommendedSystem}</span>
                  <span className="tt-calc-stat-sub">
                    Calibrated for {calcResult.depthInCm}cm single-pour thickness
                  </span>
                </div>
              </div>

              <div className="tt-calc-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsCalculatorOpen(false);
                    openConsult(
                      `Custom Table Quote: ${calcLength}x${calcWidth}x${calcDepth}${calcUnits} (~${calcResult.kg}kg ${calcResult.recommendedSystem})`
                    );
                  }}
                  className="tt-btn-primary"
                >
                  Order This Quantity / Request Custom Quote <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 2: CONSULTATION & PROJECT ASSISTANCE
         ================================================================= */}
      {isConsultModalOpen && (
        <div
          className="tt-modal-backdrop"
          onClick={() => setIsConsultModalOpen(false)}
        >
          <div
            className="tt-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tt-modal-header">
              <div>
                <span className="tt-modal-eyebrow">VIZE TECHNICAL SUPPORT</span>
                <h3 className="tt-modal-title">Table Project Consultation</h3>
              </div>
              <button
                type="button"
                className="tt-modal-close-btn"
                onClick={() => setIsConsultModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {formSubmitted ? (
              <div className="tt-modal-success-box">
                <CheckCircle2 size={48} className="tt-success-icon" />
                <h4>Thank you! Your request has been received.</h4>
                <p>
                  A VIZE resin technical specialist will review your project
                  specifications and contact you within 2-4 business hours with
                  custom batch ratios and pigment recommendations.
                </p>
                <button
                  type="button"
                  className="tt-btn-primary"
                  onClick={() => setIsConsultModalOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="tt-consult-form">
                <div className="tt-form-field">
                  <label>Project Scope / Subject</label>
                  <input
                    type="text"
                    defaultValue={consultSubject}
                    className="tt-input"
                    required
                  />
                </div>
                <div className="tt-form-row">
                  <div className="tt-form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="tt-input"
                      required
                    />
                  </div>
                  <div className="tt-form-field">
                    <label>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="tt-input"
                      required
                    />
                  </div>
                </div>
                <div className="tt-form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="tt-input"
                    required
                  />
                </div>
                <div className="tt-form-field">
                  <label>Timber Species, Dimensions or Questions</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Walnut slab 8ft x 3ft x 2inch, need deep pour teal resin and bubble release guidance..."
                    className="tt-textarea"
                    required
                  />
                </div>
                <button type="submit" className="tt-btn-primary">
                  Submit Project Details <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 3: SWATCH DETAIL / COLOR EXPLORER
         ================================================================= */}
      {selectedSwatch && (
        <div
          className="tt-modal-backdrop"
          onClick={() => setSelectedSwatch(null)}
        >
          <div
            className="tt-modal-dialog tt-swatch-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tt-modal-header">
              <div>
                <span className="tt-modal-eyebrow">PIGMENT & SHADE</span>
                <h3 className="tt-modal-title">{selectedSwatch.name}</h3>
              </div>
              <button
                type="button"
                className="tt-modal-close-btn"
                onClick={() => setSelectedSwatch(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="tt-swatch-detail-body">
              <div className="tt-swatch-large-preview">
                <img src={selectedSwatch.image} alt={selectedSwatch.name} />
              </div>
              <div className="tt-swatch-detail-info">
                <span className="tt-swatch-pill">{selectedSwatch.category} Finish</span>
                <p className="tt-swatch-desc">{selectedSwatch.desc}</p>
                <div className="tt-swatch-compat-box">
                  <h5>Formulation Suitability:</h5>
                  <ul>
                    <li>✓ Compatible with <strong>Vize Cast</strong> & <strong>Vize SuperCast</strong></li>
                    <li>✓ High UV lightfastness with zero pigment fallout</li>
                    <li>✓ Recommended loading ratio: 2% – 5% by total resin weight</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="tt-btn-primary"
                  onClick={() => {
                    setSelectedSwatch(null);
                    openConsult(`Pigment Sample & Kit: ${selectedSwatch.name} (${selectedSwatch.category})`);
                  }}
                >
                  Request Shade Sample <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 4: IMAGE LIGHTBOX
         ================================================================= */}
      {lightboxImage && (
        <div
          className="tt-modal-backdrop tt-lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="tt-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tt-lightbox-close"
              onClick={() => setLightboxImage(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="tt-lightbox-img"
            />
            <div className="tt-lightbox-caption">
              <h4>{lightboxImage.title}</h4>
              <p>{lightboxImage.desc || lightboxImage.details}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
