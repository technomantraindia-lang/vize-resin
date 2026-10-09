import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromApi, resolveImageUrl } from '../utils/api';
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
  ChevronLeft,
  Info,
  Download,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 1. Applications Data with Real Table Top Images
const APPLICATIONS_DATA = [
  {
    id: 'river-tables',
    title: 'Live-Edge River Tables',
    desc: 'Grand statement dining & executive tables.',
    image: '/table top/1N2A7888.jpg',
    longDesc: 'Dramatic translucent azure and turquoise deep-pour river channels cast between organic live-edge timber slabs.',
    recommendedResin: 'Vize SuperCast',
    pourDepth: 'Up to 100mm per single pour'
  },
  {
    id: 'dining-coffee',
    title: 'Freeform & Round Slab Tables',
    desc: 'Sculptural burl slabs with pearl & jade resin.',
    image: '/table top/IMG20230215154153.jpg',
    longDesc: 'Organic cross-cut tree slabs paired with opalescent jade-pearl resin centers and sapphire vein accents on modern metal bases.',
    recommendedResin: 'Vize Cast',
    pourDepth: '20mm – 45mm'
  },
  {
    id: 'side-c-tables',
    title: 'C-Tables & Side Accents',
    desc: 'Modern cantilever ergonomic side pieces.',
    image: '/table top/1N2A8033.jpg',
    longDesc: 'Space-efficient C-frame sofa companions featuring luminous emerald green metallic resin streams.',
    recommendedResin: 'Vize Cast',
    pourDepth: '15mm – 35mm'
  },
  {
    id: 'boardroom-slabs',
    title: 'Executive Conference Slabs',
    desc: 'Large-scale monolithic timber & epoxy works.',
    image: '/table top/IMG20230303141433.jpg',
    longDesc: 'Massive live-edge timber slabs cast with high-clarity UV-stable resin for corporate boardrooms and luxury residences.',
    recommendedResin: 'Vize SuperCast',
    pourDepth: 'Single pour up to 100mm'
  }
];

// 2. Featured Products Data
const CASTING_PRODUCTS = [
  {
    id: 'vize-cast',
    name: 'Vize Cast Max',
    tagline: 'Reliable 3:1 deep pour performance for stunning table tops.',
    image: '/vize-table-top/06-vize-cast-bucket.png',
    price: '₹9,840',
    badge: 'Deep Pour Master',
    specs: '12 KG Pack • 3:1 Ratio • ₹820/KG • 24h Cure',
    link: '/product/vize-cast-max'
  },
  {
    id: 'vize-supercast',
    name: 'Vize EpoWrap Max UV',
    tagline: 'Super clear 3:1 slow-cure formula for deep pours and clearcoats.',
    image: '/vize-table-top/07-vize-supercast-bucket.png',
    price: '₹9,840',
    badge: 'Crystal Clear UV',
    specs: '12 KG Pack • 3:1 Ratio • ₹820/KG • Non-Yellowing',
    link: '/product/vize-epowrap-max'
  },
  {
    id: 'vize-maxart',
    name: 'Vize Coat Max',
    tagline: 'Protective topcoat & art finish for scratch-proof table tops.',
    image: '/vize-table-top/08-vize-maxart-bucket.png',
    price: '₹9,570',
    badge: 'Mirror Gloss Coat',
    specs: '12 KG Pack • 2:1 Ratio • ₹797/KG • High Dome',
    link: '/product/vize-art-max'
  }
];

// 3. The 5-Step Process Data
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
    image: '/table top/1N2A8107.jpg',
    details: 'Allow full cure in temperature-controlled room (22-25°C), demold, progressive sand from 80 to 2000 grit, and buff with Vize CutMax & ShineMax.'
  }
];

// 4. Finish Swatches Categories
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

// 5. Hero Featured Inspiration (4 Cards)
const HERO_INSPIRATION = [
  {
    id: 'inspire-hero-1',
    title: 'Azure Horizon River Dining Table',
    category: 'River Dining Table',
    image: '/table top/1N2A7888.jpg',
    images: ['/table top/1N2A7888.jpg', '/table top/1N2A7896.jpg', '/table top/1N2A7895.jpg'],
    layout: 'large',
    desc: 'Custom 8-seater live-edge teak dining table with vibrant turquoise river channel on matte-black X-base.',
    timber: 'Live-Edge Natural Teak',
    dimensions: '8 ft × 3.5 ft × 2 in',
    resin: 'Vize SuperCast Deep Pour (Azure Sky)'
  },
  {
    id: 'inspire-hero-2',
    title: 'Freeform Organic Burl Resin Table',
    category: 'Centerpiece Coffee Table',
    image: '/table top/IMG20230215154153.jpg',
    images: ['/table top/IMG20230215154153.jpg', '/table top/IMG20230204113707.jpg', '/table top/IMG20230208114809.jpg', '/table top/IMG20230211201059.jpg'],
    layout: 'small-top',
    desc: 'Sculptural organic tree slab featuring an opalescent jade-pearl resin core and bronze spider base.',
    timber: 'Cross-Cut Live-Edge Burl Slab',
    dimensions: '42" Diameter × 18" H',
    resin: 'Vize Cast (Opalescent Jade-Pearl)'
  },
  {
    id: 'inspire-hero-3',
    title: 'Smoky Quartz Square Coffee Table',
    category: 'Square Coffee Table',
    image: '/table top/1N2A7964.jpg',
    images: ['/table top/1N2A7964.jpg', '/table top/1N2A7965.jpg'],
    layout: 'small-bottom',
    desc: 'Metallic smoky bronze river stream set in golden hardwood timber.',
    timber: 'Kiln-Dried Timber Slab',
    dimensions: '30" × 30" × 16" H',
    resin: 'Vize Cast (Smoky Bronze)'
  },
  {
    id: 'inspire-hero-4',
    title: 'Emerald Stream C-Frame Side Table',
    category: 'C-Frame Side Table',
    image: '/table top/1N2A8033.jpg',
    images: ['/table top/1N2A8033.jpg', '/table top/1N2A8039.jpg', '/table top/1N2A8051.jpg', '/table top/1N2A8067.jpg'],
    layout: 'tall-right',
    desc: 'Ergonomic cantilever couch table featuring brilliant emerald green resin stream.',
    timber: 'Natural Live-Edge Burl',
    dimensions: '18" × 12" × 24" H',
    resin: 'Vize Cast (Emerald Spark)'
  }
];

// 6. Gallery Categories Filter
const GALLERY_CATEGORIES = [
  'All Designs',
  'Dining & River Tables',
  'Coffee & Round Tables',
  'Side & C-Tables',
  'Executive Desks',
  'Macro Clarity & Edge Details'
];

export default function TableTopsPage() {
  const [activeCategory, setActiveCategory] = useState('Metallic');
  const [selectedSwatch, setSelectedSwatch] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All Designs');
  
  // Lightbox state for multi-photo view
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSubject, setConsultSubject] = useState('General Table Project Inquiry');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);
  const [consultFormData, setConsultFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    dimensions: '',
    wood: ''
  });

  // Dynamic DB tables & Casting Products from Laravel backend
  const [liveDbTables, setLiveDbTables] = useState([]);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [castingProducts, setCastingProducts] = useState(CASTING_PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    
    // 1. Fetch Table Tops Designs from Database
    const fetchDbTables = async () => {
      setIsDbLoading(true);
      try {
        const json = await fetchFromApi('/api/vize/table-tops');
        if (json && json.success && Array.isArray(json.data) && isMounted) {
          setLiveDbTables(json.data.map((t) => {
            const rawImgs = (Array.isArray(t.images) && t.images.length > 0)
              ? t.images
              : (t.image_url ? [t.image_url] : ['/table top/1N2A7888.jpg']);
            
            const cleanImgs = rawImgs.map((img) => {
              if (typeof img === 'string') {
                if (img.startsWith('/uploads/')) return resolveImageUrl(img);
                if (img.startsWith('/table top/') || img.startsWith('http') || img.startsWith('data:')) {
                  return img;
                }
                if (img.startsWith('/table-tops/')) {
                  if (img.includes('glacier')) return '/table top/1N2A7925.jpg';
                  if (img.includes('emerald')) return '/table top/1N2A8033.jpg';
                  return '/table top/1N2A7888.jpg';
                }
                }
                return img || '/table top/1N2A7888.jpg';
              });

              return {
                id: `db-table-${t.id}`,
                title: t.name || t.title,
                category: t.category || (t.status === 'Ready to Ship' ? 'Dining & River Tables' : 'Executive Desks'),
                image: cleanImgs[0] || '/table top/1N2A7888.jpg',
                images: cleanImgs,
                desc: t.description || t.desc || `${t.wood_type || 'Live-Edge'} timber slab with crystal optical resin formulation.`,
                timber: t.wood_type || t.timber || 'Solid Live-Edge Timber',
                dimensions: t.dimensions || 'Custom Sizing',
                status: t.status || 'Ready to Ship',
                resin: t.resin || 'Vize SuperCast Deep Pour'
              };
            }));
          }
        } catch (e) {
        console.warn('Failed to fetch table tops from backend:', e);
      } finally {
        if (isMounted) setIsDbLoading(false);
      }
    };

    // 2. Fetch Featured Casting Products from Backend Resins API
    const fetchCastingProducts = async () => {
      try {
        const json = await fetchFromApi('/api/vize/products');
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const matched = [];
          const targetSlugs = ['vize-cast-max', 'vize-epowrap-max', 'vize-art-max'];
            
            targetSlugs.forEach((slugKey) => {
              const found = json.data.find(p => 
                (p.slug && p.slug.toLowerCase().includes(slugKey.replace('vize-', ''))) ||
                (p.id && p.id.toLowerCase().includes(slugKey.replace('vize-', ''))) ||
                (p.name && p.name.toLowerCase().includes(slugKey.replace('vize-', '').replace('-max', '')))
              );

              if (found) {
                const isCast = (found.slug || found.id || found.name).toLowerCase().includes('cast');
                const isEpowrap = (found.slug || found.id || found.name).toLowerCase().includes('epowrap');
                
                const fallbackImg = isCast 
                  ? '/vize-table-top/06-vize-cast-bucket.png' 
                  : (isEpowrap ? '/vize-table-top/07-vize-supercast-bucket.png' : '/vize-table-top/08-vize-maxart-bucket.png');

                const productImg = (found.images && found.images[1]) 
                  ? found.images[1] 
                  : ((found.images && found.images[0]) ? found.images[0] : fallbackImg);

                matched.push({
                  id: found.slug || found.id,
                  name: found.brand || found.name,
                  tagline: found.tagline || (isCast ? 'Reliable 3:1 deep pour performance for stunning table tops.' : (isEpowrap ? 'Super clear 3:1 slow-cure formula for deep pours and clearcoats.' : 'Protective topcoat & art finish for scratch-proof table tops.')),
                  image: productImg,
                  price: `₹${Number(found.basePrice || 9840).toLocaleString('en-IN')}`,
                  badge: isCast ? 'Deep Pour Master' : (isEpowrap ? 'Crystal Clear UV' : 'Mirror Gloss Coat'),
                  specs: `${found.packQty || '12 KG'} Pack • ${found.mixRatio || '3:1'} Ratio • ₹${found.pricePerKg || 820}/KG • ${found.cureTime || '24h Cure'}`,
                  link: `/product/${found.slug || found.id}`
                });
              }
            });

            if (matched.length > 0 && isMounted) {
              setCastingProducts(matched);
            }
          }
        } catch (e) {
        console.warn('Failed to fetch casting products from backend:', e);
      }
    };

    fetchDbTables();
    fetchCastingProducts();
    return () => { isMounted = false; };
  }, []);

  // Body scroll locking when any popup is open
  useEffect(() => {
    const hasModalOpen = !!lightboxItem || isCalculatorOpen || isConsultModalOpen || !!selectedSwatch;
    if (hasModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxItem, isCalculatorOpen, isConsultModalOpen, selectedSwatch]);

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

  // Dynamic Table Tops Collection (Connected strictly to Backend Database ONLY)
  const allDesignsList = useMemo(() => {
    return liveDbTables;
  }, [liveDbTables]);

  // Filter table designs gallery
  const filteredGallery = galleryFilter === 'All Designs'
    ? allDesignsList
    : allDesignsList.filter((item) => item.category === galleryFilter);

  // Open Lightbox by item
  const openLightbox = (item, photoIdx = 0) => {
    const normalizedItem = {
      ...item,
      images: (Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : [item.image || '/table top/1N2A7888.jpg']
    };
    setLightboxItem(normalizedItem);
    setLightboxPhotoIndex(photoIdx);
  };

  // Photos of the currently active table in the Lightbox
  const lightboxPhotos = useMemo(() => {
    if (!lightboxItem) return [];
    if (Array.isArray(lightboxItem.images) && lightboxItem.images.length > 0) {
      return lightboxItem.images;
    }
    return lightboxItem.image ? [lightboxItem.image] : ['/table top/1N2A7888.jpg'];
  }, [lightboxItem]);

  const handlePhotoNext = (e) => {
    e?.stopPropagation();
    if (lightboxPhotos.length <= 1) return;
    setLightboxPhotoIndex((prev) => (prev + 1) % lightboxPhotos.length);
  };

  const handlePhotoPrev = (e) => {
    e?.stopPropagation();
    if (lightboxPhotos.length <= 1) return;
    setLightboxPhotoIndex((prev) => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

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

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingConsult(true);
    try {
      await fetchFromApi('/api/vize/table-tops/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: consultFormData.name,
          email: consultFormData.email,
          phone: consultFormData.phone,
          requested_dimensions: consultFormData.dimensions || 'Custom Specification',
          wood_preference: consultFormData.wood || 'Live-Edge Timber',
          message: `Subject: ${consultSubject} | Details: ${consultFormData.notes}`
        })
      });
    } catch (err) {
      console.warn('Inquiry post notice:', err);
    } finally {
      setIsSubmittingConsult(false);
      setFormSubmitted(true);
    }
  };

  const openConsult = (subject, dimensions = '', wood = '') => {
    setConsultSubject(subject || 'Table Project Inquiry');
    setConsultFormData((prev) => ({
      ...prev,
      dimensions: dimensions || prev.dimensions,
      wood: wood || prev.wood
    }));
    setFormSubmitted(false);
    setIsConsultModalOpen(true);
  };

  return (
    <div className="table-tops-page-root">
      <Header />

      <main>
        {/* =================================================================
            1. HERO SECTION (With hero.jpg full background featuring the swimming fish)
           ================================================================= */}
        <section className="tt-hero-section" aria-label="Table Tops Hero">
          <div className="tt-hero-bg-overlay" />
          <div className="tt-hero-container">
            <div className="tt-hero-content">
              <span className="tt-hero-badge">AUTHENTIC HANDCRAFTED RESIN ARTISTRY</span>
              <h1 className="tt-hero-title">
                Table tops,<br />
                <span className="tt-hero-title-italic">cast to last.</span>
              </h1>
              <p className="tt-hero-subtitle">
                Extraordinary tables start with extraordinary resin. Explore genuine handcrafted
                river tables, 3D aquatic wave inlays, coffee tables, and bespoke live-edge creations crafted with VIZE.
              </p>
              <div className="tt-hero-actions">
                <a href="#designs-gallery" className="tt-btn-primary">
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

            {/* Bottom-right aesthetic brand tagline & fish feature pill */}
            <div className="tt-hero-corner-tag">
              <div 
                className="tt-hero-fish-pill"
                onClick={() => openLightbox({
                  id: 'design-ocean-aquatic-hero',
                  title: 'Ocean 3D Aquatic River Table with Swimming Fish Inlay',
                  category: '3D Aquatic River Table',
                  image: '/table top/hero.jpg',
                  desc: 'Deep metallic azure epoxy river channel featuring handcrafted swimming fish inlays, realistic white wave foam, and natural live-edge timber encapsulation.',
                  timber: 'Solid Live-Edge Timber Slab',
                  dimensions: '7.5 ft × 3.5 ft × 2 in',
                  resin: 'Vize SuperCast Deep Pour (Ocean Azure + Wave Effect)'
                })}
              >
                <span>🐟 3D Swimming Fish Inlay & Wave Pour</span>
                <Maximize2 size={13} />
              </div>
              <span className="tt-hero-tag-text">NATURAL TIMBER</span>
              <span className="tt-hero-tag-text">CRYSTAL CLARITY POLYMER</span>
              <div className="tt-hero-tag-line" />
            </div>
          </div>
        </section>

        {/* =================================================================
            2. APPLICATIONS SECTION (Updated with real table images)
           ================================================================= */}
        <section className="tt-section tt-applications-section" id="applications">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">APPLICATIONS & FORM FACTORS</span>
                <h2 className="tt-section-title">
                  Made for remarkable <span className="tt-title-italic">surfaces.</span>
                </h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  From centerpiece 8-seater dining river tables to space-efficient C-tables
                  and monolithic boardroom slabs, VIZE provides optical clarity and structural resilience.
                </p>
              </div>
            </div>

            <div className="tt-applications-grid">
              {APPLICATIONS_DATA.map((app) => (
                <div
                  key={app.id}
                  className="tt-app-card"
                  onClick={() => openLightbox(app)}
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
            3. FEATURED PRODUCTS
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
                  Three purpose-built resin systems engineered for ultra-low exotherm,
                  zero bubbles, and crystal optical transparency.
                </p>
              </div>
            </div>

            <div className="tt-products-grid">
              {castingProducts.map((prod) => (
                <div key={prod.id} className="tt-product-card">
                  <div className="tt-product-img-box">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="tt-product-bucket-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/vize-table-top/06-vize-cast-bucket.png';
                      }}
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
            4. THE PROCESS SECTION
           ================================================================= */}
        <section className="tt-process-section" id="process">
          <div className="tt-container">
            <div className="tt-section-header tt-header-dark">
              <div className="tt-header-left">
                <span className="tt-eyebrow tt-eyebrow-accent">THE PROCESS</span>
                <h2 className="tt-section-title tt-title-white">
                  From raw timber to mirror finish.
                </h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc tt-desc-light">
                  A proven, professional woodworking and casting methodology that ensures
                  bubble-free clarity, perfect adhesion, and lifetime structural integrity.
                </p>
              </div>
            </div>

            <div className="tt-process-grid">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="tt-process-step-card"
                  onClick={() => openLightbox(step)}
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
            5. FINISH EXPLORER SECTION
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
            6. TABLE TOP DESIGNS & INSPIRATION (SHOWCASING 38 REAL CREATIONS)
           ================================================================= */}
        <section className="tt-section tt-inspiration-section" id="designs-gallery">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="tt-header-left">
                <span className="tt-eyebrow">OUR WORK & REAL CREATIONS</span>
                <h2 className="tt-section-title">Table top designs, <span className="tt-title-italic">crafted with VIZE.</span></h2>
              </div>
              <div className="tt-header-right">
                <p className="tt-section-desc">
                  Real projects. Authentic craftsmanship. Browse genuine dining river tables,
                  round coffee tables, C-tables, and macro edge bevel details created with our crystal resin.
                </p>
              </div>
            </div>

            {/* Featured Hero 4-Card Masonry */}
            <div className="tt-inspiration-masonry">
              {/* Left Large Column */}
              <div
                className="tt-inspire-card tt-inspire-card-large"
                onClick={() => openLightbox(HERO_INSPIRATION[0])}
              >
                <img
                  src={HERO_INSPIRATION[0].image}
                  alt={HERO_INSPIRATION[0].title}
                  className="tt-inspire-img"
                  loading="lazy"
                />
                <div className="tt-inspire-info-overlay">
                  <span className="tt-inspire-category">
                    {HERO_INSPIRATION[0].category}
                  </span>
                  <h3 className="tt-inspire-title">{HERO_INSPIRATION[0].title}</h3>
                  <p className="tt-inspire-desc">{HERO_INSPIRATION[0].desc}</p>
                  <div className="tt-inspire-meta-pills">
                    <span>{HERO_INSPIRATION[0].timber}</span>
                    <span>{HERO_INSPIRATION[0].dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Middle 2 Stacked Cards */}
              <div className="tt-inspire-col-middle">
                <div
                  className="tt-inspire-card tt-inspire-card-mid"
                  onClick={() => openLightbox(HERO_INSPIRATION[1])}
                >
                  <img
                    src={HERO_INSPIRATION[1].image}
                    alt={HERO_INSPIRATION[1].title}
                    className="tt-inspire-img"
                    loading="lazy"
                  />
                  <div className="tt-inspire-info-overlay">
                    <span className="tt-inspire-category">
                      {HERO_INSPIRATION[1].category}
                    </span>
                    <h4 className="tt-inspire-title">{HERO_INSPIRATION[1].title}</h4>
                    <p className="tt-inspire-desc">{HERO_INSPIRATION[1].desc}</p>
                  </div>
                </div>

                <div
                  className="tt-inspire-card tt-inspire-card-mid"
                  onClick={() => openLightbox(HERO_INSPIRATION[2])}
                >
                  <img
                    src={HERO_INSPIRATION[2].image}
                    alt={HERO_INSPIRATION[2].title}
                    className="tt-inspire-img"
                    loading="lazy"
                  />
                  <div className="tt-inspire-info-overlay">
                    <span className="tt-inspire-category">
                      {HERO_INSPIRATION[2].category}
                    </span>
                    <h4 className="tt-inspire-title">{HERO_INSPIRATION[2].title}</h4>
                    <p className="tt-inspire-desc">{HERO_INSPIRATION[2].desc}</p>
                  </div>
                </div>
              </div>

              {/* Right Vertical Tall Column */}
              <div
                className="tt-inspire-card tt-inspire-card-tall"
                onClick={() => openLightbox(HERO_INSPIRATION[3])}
              >
                <img
                  src={HERO_INSPIRATION[3].image}
                  alt={HERO_INSPIRATION[3].title}
                  className="tt-inspire-img"
                  loading="lazy"
                />
                <div className="tt-inspire-info-overlay">
                  <span className="tt-inspire-category">
                    {HERO_INSPIRATION[3].category}
                  </span>
                  <h3 className="tt-inspire-title">{HERO_INSPIRATION[3].title}</h3>
                  <p className="tt-inspire-desc">{HERO_INSPIRATION[3].desc}</p>
                  <div className="tt-inspire-meta-pills">
                    <span>{HERO_INSPIRATION[3].timber}</span>
                    <span>{HERO_INSPIRATION[3].dimensions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Design Catalog Filter & Grid */}
            <div className="tt-gallery-filter-container">
              <div className="tt-gallery-filter-header">
                <div>
                  <span className="tt-filter-sublabel">BROWSE REAL WORKSHOP CREATIONS</span>
                  <h3 className="tt-filter-heading">Table Top Collection</h3>
                </div>
                <div className="tt-gallery-category-pills">
                  {GALLERY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`tt-gallery-pill-btn ${galleryFilter === cat ? 'active' : ''}`}
                      onClick={() => setGalleryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Designs Grid (Exclusively Live Database Tables) */}
              <div className="tt-designs-grid">
                {isDbLoading ? (
                  <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Loading Live Workshop Tables...</p>
                    <p style={{ fontSize: '13px' }}>Connecting to database studio</p>
                  </div>
                ) : filteredGallery.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: '50px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>No Table Designs Found</p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      {galleryFilter !== 'All Designs'
                        ? `No tables listed under "${galleryFilter}". Select "All Designs" or add new designs in the Admin Panel.`
                        : 'No table creations currently published in the database.'}
                    </p>
                  </div>
                ) : (
                  filteredGallery.map((design) => (
                    <div
                      key={design.id}
                      className="tt-design-card"
                      onClick={() => openLightbox(design, 0)}
                    >
                      <div className="tt-design-img-box">
                        <img
                          src={design.image || (design.images && design.images[0]) || '/table top/1N2A7888.jpg'}
                          alt={design.title}
                          className="tt-design-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/table top/1N2A7888.jpg';
                          }}
                        />
                        <div className="tt-design-badge-overlay">
                          <span className="tt-design-cat-badge">{design.category}</span>
                        </div>
                        {design.images && design.images.length > 1 && (
                          <span className="tt-design-photo-badge">
                            📸 {design.images.length} Photos
                          </span>
                        )}
                        <div className="tt-design-hover-zoom">
                          <Maximize2 size={20} />
                          <span>View Details</span>
                        </div>
                      </div>

                      <div className="tt-design-body">
                        <h4 className="tt-design-title">{design.title}</h4>
                        <p className="tt-design-desc">{design.desc}</p>
                        
                        <div className="tt-design-specs-list">
                          {design.timber && (
                            <div className="tt-design-spec-row">
                              <span className="tt-spec-k">Timber:</span>
                              <span className="tt-spec-v">{design.timber}</span>
                            </div>
                          )}
                          {design.dimensions && (
                            <div className="tt-design-spec-row">
                              <span className="tt-spec-k">Dimensions:</span>
                              <span className="tt-spec-v">{design.dimensions}</span>
                            </div>
                          )}
                          {design.resin && (
                            <div className="tt-design-spec-row">
                              <span className="tt-spec-k">Resin:</span>
                              <span className="tt-spec-v tt-spec-resin">{design.resin}</span>
                            </div>
                          )}
                        </div>

                        <div className="tt-design-footer">
                          <button
                            type="button"
                            className="tt-design-inspect-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openLightbox(design, 0);
                            }}
                          >
                            <Eye size={15} />
                            <span>Inspect High-Res</span>
                          </button>
                          <button
                            type="button"
                            className="tt-design-quote-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openConsult(
                                `Quote for Table: ${design.title} (${design.dimensions || ''})`,
                                design.dimensions,
                                design.timber
                              );
                            }}
                          >
                            <span>Enquire</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. GET IN TOUCH CTA BANNER
           ================================================================= */}
        <section className="tt-cta-banner-section" aria-label="Get In Touch">
          <div className="tt-cta-banner-container">
            <div className="tt-cta-content-left">
              <span className="tt-cta-eyebrow">CUSTOM TABLE CONSULTATION</span>
              <h2 className="tt-cta-heading">
                Bring your table idea to life.
              </h2>
            </div>
            <div className="tt-cta-content-right">
              <p className="tt-cta-text">
                Have a custom live-edge slab or bespoke dining table project in mind? Our resin
                engineers will help you select the ideal casting system and pigment formulations.
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
                  Calculate Required Resin
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
                    value={consultSubject}
                    onChange={(e) => setConsultSubject(e.target.value)}
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
                      value={consultFormData.name}
                      onChange={(e) => setConsultFormData({ ...consultFormData, name: e.target.value })}
                      className="tt-input"
                      required
                    />
                  </div>
                  <div className="tt-form-field">
                    <label>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={consultFormData.phone}
                      onChange={(e) => setConsultFormData({ ...consultFormData, phone: e.target.value })}
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
                    value={consultFormData.email}
                    onChange={(e) => setConsultFormData({ ...consultFormData, email: e.target.value })}
                    className="tt-input"
                    required
                  />
                </div>
                <div className="tt-form-field">
                  <label>Timber Species, Dimensions or Specific Questions</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 8ft x 3.5ft Live-Edge Teak dining river table with turquoise SuperCast pour..."
                    value={consultFormData.notes}
                    onChange={(e) => setConsultFormData({ ...consultFormData, notes: e.target.value })}
                    className="tt-textarea"
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmittingConsult} className="tt-btn-primary">
                  {isSubmittingConsult ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Project Details</span>
                      <Send size={16} />
                    </>
                  )}
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
          MODAL 4: INTERACTIVE HIGH-RES LIGHTBOX VIEWER
         ================================================================= */}
      {/* =================================================================
          MODAL 4: INTERACTIVE HIGH-RES LIGHTBOX VIEWER (MULTI-PHOTO)
         ================================================================= */}
      {lightboxItem && (
        <div
          className="tt-modal-backdrop tt-lightbox-backdrop"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="tt-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              className="tt-lightbox-close"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>

            {/* Navigation Arrows (Cycles photos of the active table) */}
            {lightboxPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="tt-lightbox-nav tt-lightbox-prev"
                  onClick={handlePhotoPrev}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  type="button"
                  className="tt-lightbox-nav tt-lightbox-next"
                  onClick={handlePhotoNext}
                  aria-label="Next photo"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Main Active Photo */}
            <div className="tt-lightbox-img-wrapper">
              <img
                src={lightboxPhotos[lightboxPhotoIndex] || lightboxPhotos[0] || '/table top/1N2A7888.jpg'}
                alt={`${lightboxItem.title} - Photo ${lightboxPhotoIndex + 1}`}
                className="tt-lightbox-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/table top/1N2A7888.jpg';
                }}
              />
              <span className="tt-lightbox-counter">
                {lightboxPhotoIndex + 1} / {lightboxPhotos.length}
              </span>
            </div>

            {/* Multiple Photo Thumbnails Strip */}
            {lightboxPhotos.length > 1 && (
              <div className="tt-lightbox-thumbs">
                {lightboxPhotos.map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`tt-lightbox-thumb-btn ${lightboxPhotoIndex === idx ? 'active' : ''}`}
                    onClick={() => setLightboxPhotoIndex(idx)}
                    aria-label={`View photo angle ${idx + 1}`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/table top/1N2A7888.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Table Information, Specs & Quote Action */}
            <div className="tt-lightbox-caption">
              <div className="tt-lightbox-caption-top">
                <span className="tt-lightbox-category">{lightboxItem.category || 'Table Design'}</span>
                <h4 className="tt-lightbox-heading">{lightboxItem.title}</h4>
                <p className="tt-lightbox-desc">{lightboxItem.desc || lightboxItem.details}</p>
              </div>

              <div className="tt-lightbox-meta-grid">
                {lightboxItem.timber && (
                  <div className="tt-lightbox-meta-card">
                    <span className="tt-meta-label">TIMBER SPECIES</span>
                    <span className="tt-meta-value">{lightboxItem.timber}</span>
                  </div>
                )}
                {lightboxItem.dimensions && (
                  <div className="tt-lightbox-meta-card">
                    <span className="tt-meta-label">DIMENSIONS</span>
                    <span className="tt-meta-value">{lightboxItem.dimensions}</span>
                  </div>
                )}
                {lightboxItem.resin && (
                  <div className="tt-lightbox-meta-card">
                    <span className="tt-meta-label">RESIN FORMULATION</span>
                    <span className="tt-meta-value tt-meta-resin">{lightboxItem.resin}</span>
                  </div>
                )}
              </div>

              <div className="tt-lightbox-actions">
                <button
                  type="button"
                  className="tt-btn-primary"
                  onClick={() => {
                    setLightboxItem(null);
                    openConsult(
                      `Inquiry for Table Design: ${lightboxItem.title} (${lightboxItem.dimensions || ''})`,
                      lightboxItem.dimensions,
                      lightboxItem.timber
                    );
                  }}
                >
                  Inquire / Custom Quote for this Design <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
