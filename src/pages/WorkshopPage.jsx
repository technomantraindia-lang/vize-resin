import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  Wrench,
  ShieldCheck,
  Send,
  ShoppingCart,
  Maximize2,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  Award,
  PackageCheck,
  Truck,
  MapPin,
  Users,
  Coffee,
  Check,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import INITIAL_COURSES from '../data/courses.json';

// 2. Workshop Gallery Steps Data
const GALLERY_DATA = [
  {
    id: 'demo',
    step: 'Demonstration',
    title: 'See the techniques',
    desc: 'Observe precision notch trowel angles, resin viscosity control, and self-levelling flow dynamics under direct technician guidance.',
    image: '/process-trowel.jpg',
    alt: 'Resin technician demonstrating precision notched trowel spreading technique'
  },
  {
    id: 'practice',
    step: 'Practical activity',
    title: 'Practise the process',
    desc: 'Work hands-on with multi-part polymer formulations, pigment mixing matrices, and thermal bubble elimination using torch techniques.',
    image: '/process-pour.jpg',
    alt: 'Workshop participants actively mixing and pouring tinted resin formulation'
  },
  {
    id: 'finish',
    step: 'Finished work',
    title: 'Explore the finish',
    desc: 'Inspect real cured applications, from glass-like optical clarity river tables to heavy-duty monolithic industrial flooring systems.',
    image: '/table top/IMG20230215154153.jpg',
    alt: 'Flawlessly finished live-edge teal river dining table cured with VIZE resin'
  }
];

// 3. Exact 6 Tool Groups from Provided Poster with Real Tool Images
const TOOL_KIT_COMPONENTS = [
  {
    id: 'dual-notch-trowels',
    name: 'Dual-Notch Steel Trowel Set',
    qty: '4 pcs',
    specs: '2 mm / 1.5 mm / 1 mm / 0.5 mm notched blades; stainless steel blades for resin and epoxy.',
    image: '/tools/Dual-notch stainless steel trowel set-2.png'
  },
  {
    id: 'precision-notch-bars',
    name: 'Precision Notch Bars',
    qty: '2 pcs',
    specs: '0.5 mm / 1 mm / 1.5 mm / 2 mm profiles; ultra-thin bars for fine-detail resin work.',
    image: '/tools/Precision stainless steel notch bars-1.png'
  },
  {
    id: 'heavy-duty-trowels',
    name: 'Heavy Duty Notch Trowels',
    qty: '3 pcs',
    specs: '2 mm / 3 mm / 4 mm; blades for self-levelling and flooring applications.',
    image: '/tools/Heavy-Duty Stainless Notched Blades-3.png'
  },
  {
    id: 't-handle-trowel',
    name: 'T-Handle Notch Trowel',
    qty: '1 pc',
    specs: '1.5 mm notched blade with stainless steel T-handle.',
    image: '/tools/Stainless Steel T-Handle Notch Trowel-4.png'
  },
  {
    id: 'mini-detailing-kit',
    name: 'Mini Detailing Kit',
    qty: '3 pcs',
    specs: 'Curved scraper plus two mini multi-notch plates; 2 mm / 1.5 mm / 1 mm / 0.5 mm; for corners and details.',
    image: '/tools/Curved stainless scraper and notched plates-6.png'
  },
  {
    id: 'steel-spike-shoes',
    name: 'Steel Spike Shoes',
    qty: '2 pairs',
    specs: '2 pairs · Screws & straps included',
    image: '/tools/Stainless steel spike shoe plate set-5.png'
  }
];

// 4. Kit Product Definition for Cart Integration
const KIT_PRODUCT = {
  id: 'vize-notch-trowel-kit',
  name: 'Resin Notch Trowel Start Up Kit',
  brand: 'VIZE Professional Tooling',
  category: 'Application Equipment',
  price: 9500,
  currency: '₹',
  images: [
    '/tools/Dual-notch stainless steel trowel set-2.png',
    '/tools/Heavy-Duty Stainless Notched Blades-3.png',
    '/tools/Stainless steel spike shoe plate set-5.png',
    '/tools/Precision stainless steel notch bars-1.png',
    '/tools/Stainless Steel T-Handle Notch Trowel-4.png',
    '/tools/Curved stainless scraper and notched plates-6.png'
  ],
  sizes: [
    {
      id: 'complete-kit',
      label: 'Complete 6-Group Kit (Courier Included)',
      price: 9500,
      weightKg: 5.5
    }
  ]
};

export default function WorkshopPage() {
  const { addToCart } = useCart();
  
  // Dynamic Courses State (initialized from courses.json, dynamically loaded when backend is live)
  const [coursesList, setCoursesList] = useState(INITIAL_COURSES);

  // Kit Quantity State
  const [kitQty, setKitQty] = useState(1);
  const [isKitAdded, setIsKitAdded] = useState(false);

  // Modal States
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: 'METALLIC & RESIN FLOORING WORKSHOP',
    preferredLocation: 'Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)',
    message: ''
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  // Dynamic Backend Courses Fetch (when backend API /api/courses is live)
  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCoursesList(data);
          }
        }
      } catch {
        // Graceful fallback to static courses.json data
      }
    };
    fetchLiveCourses();
  }, []);

  // Set Page Title and SEO Meta
  useEffect(() => {
    document.title = 'Resin Workshops & Training Courses | ESSENTIAL ARTWORKS × VIZE';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard accessibility for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCourseModal(null);
        setActiveLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add Complete Kit to Cart Handler
  const handleAddKitToCart = () => {
    addToCart(KIT_PRODUCT, KIT_PRODUCT.sizes[0], null, kitQty, true);
    setIsKitAdded(true);
    setTimeout(() => setIsKitAdded(false), 2400);
  };

  // Select Course and Scroll to Enquiry Form
  const handleSelectCourseForEnquiry = (courseName) => {
    setEnquiryForm((prev) => ({
      ...prev,
      courseInterest: courseName
    }));
    if (selectedCourseModal) {
      setSelectedCourseModal(null);
    }
    setTimeout(() => {
      scrollToSection('enquiry-section');
    }, 150);
  };

  // Handle Enquiry Form Submission
  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;

    const generatedId = `VIZE-WS-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnquiryId(generatedId);
    setEnquirySubmitted(true);
  };

  return (
    <div className="vize-ws-root">
      <Header />

      <main className="vize-ws-main">
        {/* =================================================================
            1. HERO — COURSES FIRST
            ================================================================= */}
        <section className="vize-ws-hero" aria-labelledby="workshop-hero-title">
          <div className="vize-ws-container">
            <div className="vize-ws-hero-grid">
              <div className="vize-ws-hero-copy">
                <span className="vize-ws-eyebrow">ESSENTIAL ARTWORKS × VIZE WORKSHOPS</span>
                <h1 id="workshop-hero-title" className="vize-ws-hero-title">
                  Learn the craft.
                  <span className="vize-ws-hero-italic">Create with confidence.</span>
                </h1>
                <p className="vize-ws-hero-desc">
                  Master professional metallic & resin flooring, luxury deep-cast timber tables, and high-gloss art with hands-on industrial equipment exposure.
                </p>
                <div className="vize-ws-hero-actions">
                  <button
                    type="button"
                    onClick={() => scrollToSection('course-catalogue')}
                    className="vize-ws-btn-primary"
                    id="btn-hero-explore-courses"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('equipment-kit')}
                    className="vize-ws-btn-secondary"
                    id="btn-hero-shop-toolkit"
                  >
                    <span>Shop Tool Kit</span>
                    <Wrench size={16} />
                  </button>
                </div>
              </div>

              <div className="vize-ws-hero-visual">
                <div className="vize-ws-hero-img-frame">
                  <img
                    src="/processes.JPG"
                    alt="VIZE polymer workshop demonstration in progress"
                    className="vize-ws-hero-img"
                    loading="eager"
                  />
                  <div className="vize-ws-hero-badge">
                    <Sparkles className="vize-ws-hero-badge-icon" size={20} />
                    <div className="vize-ws-hero-badge-text">
                      <strong>Live Practical Training</strong> · Real equipment & site-level exposure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. COURSE CATALOGUE
            ================================================================= */}
        <section
          id="course-catalogue"
          className="vize-ws-courses-section"
          aria-labelledby="course-catalogue-heading"
        >
          <div className="vize-ws-container">
            <div className="vize-ws-section-header">
              <span className="vize-ws-section-eyebrow">PROFESSIONAL CURRICULUM</span>
              <h2 id="course-catalogue-heading" className="vize-ws-section-title">
                Technical Training & Certification Programs
              </h2>
              <p className="vize-ws-section-subtext">
                Technique-driven masterclasses designed for contractors, interior designers, architects, furniture makers & creative entrepreneurs.
              </p>
            </div>

            <div className="vize-ws-courses-grid">
              {coursesList.map((course) => (
                <article key={course.id} className="vize-ws-course-card">
                  <div className="vize-ws-course-img-wrap">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="vize-ws-course-img"
                      loading="lazy"
                    />
                    <span className="vize-ws-course-badge">
                      {course.badge || course.category}
                    </span>
                    <span className="vize-ws-course-duration">{course.duration}</span>
                  </div>

                  <div className="vize-ws-course-content">
                    <span className="vize-ws-course-provider">
                      {course.provider || 'ESSENTIAL ARTWORKS × VIZE'}
                    </span>
                    <h3 className="vize-ws-course-name">{course.name}</h3>
                    <p className="vize-ws-course-desc">{course.shortDesc}</p>

                    {/* Key Highlight Banner */}
                    {course.keyHighlight && (
                      <div className="vize-ws-card-highlight-ribbon">
                        <Zap size={14} className="vize-ws-highlight-icon" />
                        <span>{course.keyHighlight}</span>
                      </div>
                    )}

                    {/* Flooring Techniques Chips */}
                    {course.flooringTechniques && (
                      <div className="vize-ws-techniques-chips">
                        <span className="vize-ws-chips-label">Techniques Covered:</span>
                        <div className="vize-ws-chips-list">
                          {course.flooringTechniques.map((t, idx) => (
                            <span key={idx} className="vize-ws-tech-chip">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Training Modules Summary Pill */}
                    {course.trainingModules && (
                      <div className="vize-ws-modules-summary-pill">
                        <Layers size={13} />
                        <span>12 Technical Modules · CNC & Optic Fiber Table</span>
                      </div>
                    )}

                    <ul className="vize-ws-course-highlights">
                      {course.curriculum.slice(0, 3).map((item, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} className="vize-ws-highlight-check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="vize-ws-course-actions">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseModal(course)}
                        className="vize-ws-btn-view-course"
                        id={`btn-view-${course.id}`}
                      >
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectCourseForEnquiry(course.name)}
                        className="vize-ws-btn-enquire-course"
                        id={`btn-enquire-${course.id}`}
                      >
                        <span>Enquire</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* =================================================================
            3. WORKSHOP GALLERY AND INFORMATION
            ================================================================= */}
        <section className="vize-ws-gallery-section" aria-labelledby="gallery-heading">
          <div className="vize-ws-container">
            <div className="vize-ws-section-header">
              <span className="vize-ws-section-eyebrow">LEARNING EXPERIENCE</span>
              <h2 id="gallery-heading" className="vize-ws-section-title">
                Inside the workshop.
              </h2>
              <p className="vize-ws-section-subtext">
                From precision surface preparation to flawless high-gloss buffing, experience step-by-step masterclass training.
              </p>
            </div>

            <div className="vize-ws-gallery-grid">
              {GALLERY_DATA.map((item, index) => (
                <div key={item.id} className="vize-ws-gallery-item">
                  <div
                    className="vize-ws-gallery-img-box"
                    onClick={() => setActiveLightboxImage(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Enlarge photo: ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveLightboxImage(item);
                      }
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="vize-ws-gallery-img"
                      loading="lazy"
                    />
                    <span className="vize-ws-gallery-step-tag">
                      0{index + 1} · {item.step}
                    </span>
                    <div className="vize-ws-gallery-zoom-badge" title="Click to view full image">
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  <div className="vize-ws-gallery-info">
                    <h3 className="vize-ws-gallery-title">{item.title}</h3>
                    <p className="vize-ws-gallery-text">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            4. SHOP THE COMPLETE EQUIPMENT KIT
            ================================================================= */}
        <section
          id="equipment-kit"
          className="vize-ws-kit-section"
          aria-labelledby="kit-heading"
        >
          <div className="vize-ws-container">
            <div className="vize-ws-section-header">
              <span className="vize-ws-section-eyebrow">PROFESSIONAL TOOLING</span>
              <h2 id="kit-heading" className="vize-ws-section-title">
                Professional tools. One complete kit.
              </h2>
              <p className="vize-ws-section-subtext">
                Precision notched trowels, bars, detailing scrapers, and spike shoes engineered for flawless resin application.
              </p>
            </div>

            {/* Single Bordered Cream Panel */}
            <div className="vize-ws-kit-panel">
              {/* Top Section: Product Name, Price, Quantity, Add to Cart */}
              <div className="vize-ws-kit-header">
                <div className="vize-ws-kit-header-info">
                  <span className="vize-ws-kit-tag">
                    <PackageCheck size={14} />
                    <span>Complete 6-Group Equipment Suite</span>
                  </span>
                  <h3 className="vize-ws-kit-name">Resin Notch Trowel Start Up Kit</h3>
                  <div className="vize-ws-kit-price-row">
                    <span className="vize-ws-kit-price">₹9,500</span>
                    <span className="vize-ws-kit-courier-badge">
                      <Truck size={14} />
                      <span>Courier included</span>
                    </span>
                  </div>
                  <p className="vize-ws-kit-notice">
                    <Info size={13} />
                    <span>Complete equipment set as supplied. Components are sold together as one system.</span>
                  </p>
                </div>

                <div className="vize-ws-kit-purchase-col">
                  {/* Quantity Control */}
                  <div className="vize-ws-qty-control" aria-label="Kit quantity selector">
                    <button
                      type="button"
                      onClick={() => setKitQty((q) => Math.max(1, q - 1))}
                      className="vize-ws-qty-btn"
                      aria-label="Decrease quantity"
                      disabled={kitQty <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="vize-ws-qty-val" aria-live="polite">
                      {kitQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKitQty((q) => q + 1)}
                      className="vize-ws-qty-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add Kit to Cart Action */}
                  <button
                    type="button"
                    onClick={handleAddKitToCart}
                    className={`vize-ws-btn-add-kit ${isKitAdded ? 'added' : ''}`}
                    id="btn-add-complete-kit"
                  >
                    {isKitAdded ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        <span>Add Kit to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Middle Section: Included Equipment Subheading */}
              <div className="vize-ws-components-heading-wrap">
                <h4 className="vize-ws-components-heading">
                  What&apos;s Included In This Complete Kit
                </h4>
                <span className="vize-ws-components-sub">All 6 Tool Groups Included</span>
              </div>

              {/* Bottom Section: 6 Component Cards in 3x2 Grid */}
              <div className="vize-ws-components-grid">
                {TOOL_KIT_COMPONENTS.map((comp) => (
                  <div key={comp.id} className="vize-ws-comp-card">
                    <div
                      className="vize-ws-comp-img-box"
                      onClick={() =>
                        setActiveLightboxImage({
                          image: comp.image,
                          title: comp.name,
                          step: comp.qty,
                          desc: comp.specs,
                          alt: comp.name
                        })
                      }
                      role="button"
                      tabIndex={0}
                      aria-label={`Enlarge photo: ${comp.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveLightboxImage({
                            image: comp.image,
                            title: comp.name,
                            step: comp.qty,
                            desc: comp.specs,
                            alt: comp.name
                          });
                        }
                      }}
                    >
                      <img
                        src={comp.image}
                        alt={comp.name}
                        className="vize-ws-comp-img"
                        loading="lazy"
                      />
                      <span className="vize-ws-comp-qty-badge">{comp.qty}</span>
                      <div className="vize-ws-comp-zoom-hint" title="Click to view full image">
                        <Maximize2 size={15} />
                      </div>
                    </div>
                    <div className="vize-ws-comp-info">
                      <h5 className="vize-ws-comp-name">{comp.name}</h5>
                      <p className="vize-ws-comp-specs">{comp.specs}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. COURSE ENQUIRY CALLOUT
            ================================================================= */}
        <section
          id="enquiry-section"
          className="vize-ws-enquiry-section"
          aria-labelledby="enquiry-heading"
        >
          <div className="vize-ws-container">
            <div className="vize-ws-enquiry-panel">
              {/* Left Column: Heading & Information */}
              <div className="vize-ws-enquiry-left">
                <div>
                  <span className="vize-ws-enquiry-eyebrow">COURSE ADMISSIONS</span>
                  <h2 id="enquiry-heading" className="vize-ws-enquiry-title">
                    Ready to learn with VIZE?
                  </h2>
                  <p className="vize-ws-enquiry-sub">
                    Ask about available courses, custom crew training, and upcoming workshop dates.
                  </p>
                </div>

                <div className="vize-ws-enquiry-perks">
                  <div className="vize-ws-enquiry-perk-item">
                    <CheckCircle2 size={16} />
                    <span>Direct guidance from senior polymer specialists</span>
                  </div>
                  <div className="vize-ws-enquiry-perk-item">
                    <CheckCircle2 size={16} />
                    <span>All raw chemicals, tooling, and safety gear provided in-studio</span>
                  </div>
                  <div className="vize-ws-enquiry-perk-item">
                    <CheckCircle2 size={16} />
                    <span>Practical certification & lifetime technical formulation support</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Reactive Form */}
              <div className="vize-ws-enquiry-right">
                {enquirySubmitted ? (
                  <div className="vize-ws-enquiry-success">
                    <div className="vize-ws-success-icon">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="vize-ws-success-title">Enquiry Received</h3>
                    <p className="vize-ws-success-text">
                      Thank you, <strong>{enquiryForm.name}</strong>! Your workshop enquiry for{' '}
                      <strong>{enquiryForm.courseInterest}</strong> has been logged under reference{' '}
                      <code>{enquiryId}</code>. Our team will contact you shortly with upcoming batch schedules.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEnquirySubmitted(false);
                        setEnquiryForm({
                          name: '',
                          email: '',
                          phone: '',
                          courseInterest: 'METALLIC & RESIN FLOORING WORKSHOP',
                          preferredLocation: 'Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)',
                          message: ''
                        });
                      }}
                      className="vize-ws-btn-reset-form"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="vize-ws-form">
                    <div className="vize-ws-form-row">
                      <div className="vize-ws-form-group">
                        <label htmlFor="ws-name">Full Name *</label>
                        <input
                          id="ws-name"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={enquiryForm.name}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="vize-ws-form-group">
                        <label htmlFor="ws-phone">Phone / WhatsApp *</label>
                        <input
                          id="ws-phone"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={enquiryForm.phone}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="vize-ws-form-row">
                      <div className="vize-ws-form-group">
                        <label htmlFor="ws-email">Email Address</label>
                        <input
                          id="ws-email"
                          type="email"
                          placeholder="name@example.com"
                          value={enquiryForm.email}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="vize-ws-form-group">
                        <label htmlFor="ws-course">Course of Interest</label>
                        <select
                          id="ws-course"
                          value={enquiryForm.courseInterest}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, courseInterest: e.target.value })
                          }
                        >
                          {coursesList.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.badge || c.duration})
                            </option>
                          ))}
                          <option value="Resin Notch Trowel Start Up Kit">
                            Resin Notch Trowel Start Up Kit (₹9,500 Full Tool Set)
                          </option>
                          <option value="General Workshop Guidance">
                            General Workshop & Career Guidance
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="vize-ws-form-group">
                      <label htmlFor="ws-location">Preferred Studio / Training Hub</label>
                      <select
                        id="ws-location"
                        value={enquiryForm.preferredLocation}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, preferredLocation: e.target.value })
                        }
                      >
                        <option value="Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)">
                          Menpura, Vadodara, Gujarat (Main Factory & Workshop Hub)
                        </option>
                        <option value="Mumbai & Pune Studio (HQ - MIDC Tech Park)">
                          Mumbai & Pune Studio (HQ - MIDC Tech Park)
                        </option>
                        <option value="Delhi NCR Experience Hub (Gurugram)">
                          Delhi NCR Experience Hub (Gurugram)
                        </option>
                        <option value="Bengaluru Logistics Center">
                          Bengaluru Logistics Center
                        </option>
                        <option value="On-Site Contractor Crew Training">
                          On-Site Contractor Crew Training
                        </option>
                      </select>
                    </div>

                    <div className="vize-ws-form-group">
                      <label htmlFor="ws-message">Questions or Specific Requirements</label>
                      <textarea
                        id="ws-message"
                        rows={3}
                        placeholder="Tell us about your background (contractor, designer, woodworker, beginner) or what you want to achieve..."
                        value={enquiryForm.message}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, message: e.target.value })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className="vize-ws-btn-submit-enquiry"
                      id="btn-submit-workshop-enquiry"
                    >
                      <Send size={16} />
                      <span>Enquire / Block Your Seat</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          COURSE DETAIL MODAL
          ================================================================= */}
      {selectedCourseModal && (
        <div
          className="vize-ws-modal-backdrop"
          onClick={() => setSelectedCourseModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-course-title"
        >
          <div
            className="vize-ws-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vize-ws-modal-close"
              onClick={() => setSelectedCourseModal(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="vize-ws-modal-hero">
              <img
                src={selectedCourseModal.image}
                alt={selectedCourseModal.name}
                className="vize-ws-modal-hero-img"
              />
              <div className="vize-ws-modal-hero-overlay">
                <span className="vize-ws-modal-eyebrow">
                  {selectedCourseModal.provider || 'ESSENTIAL ARTWORKS × VIZE'} · {selectedCourseModal.category}
                </span>
                <h3 id="modal-course-title" className="vize-ws-modal-title">
                  {selectedCourseModal.name}
                </h3>
              </div>
            </div>

            <div className="vize-ws-modal-body">
              {/* Batch Banner */}
              {selectedCourseModal.date && (
                <div className="vize-ws-modal-batch-banner">
                  <div className="vize-ws-batch-item">
                    <Calendar size={15} className="vize-ws-batch-icon" />
                    <span><strong>Dates:</strong> {selectedCourseModal.date}</span>
                  </div>
                  {selectedCourseModal.location && (
                    <div className="vize-ws-batch-item">
                      <MapPin size={15} className="vize-ws-batch-icon" />
                      <span><strong>Venue:</strong> {selectedCourseModal.location}</span>
                    </div>
                  )}
                  {selectedCourseModal.seats && (
                    <div className="vize-ws-batch-item highlight-seats">
                      <Users size={15} className="vize-ws-batch-icon" />
                      <span><strong>Seats:</strong> {selectedCourseModal.seats}</span>
                    </div>
                  )}
                </div>
              )}

              <p className="vize-ws-modal-desc">{selectedCourseModal.overview}</p>

              {/* Key Highlight Callout */}
              {selectedCourseModal.keyHighlight && (
                <div className="vize-ws-modal-highlight-box">
                  <div className="vize-ws-modal-highlight-tag">
                    <Zap size={16} />
                    <span>{selectedCourseModal.keyHighlight}</span>
                  </div>
                  <p className="vize-ws-modal-highlight-text">
                    {selectedCourseModal.keyHighlightDesc || selectedCourseModal.overview}
                  </p>
                </div>
              )}

              {/* Meta Bar */}
              <div className="vize-ws-modal-meta-bar">
                <div className="vize-ws-modal-meta-item">
                  <span className="vize-ws-meta-label">Duration</span>
                  <span className="vize-ws-meta-val">{selectedCourseModal.duration}</span>
                </div>
                <div className="vize-ws-modal-meta-item">
                  <span className="vize-ws-meta-label">Target Audience</span>
                  <span className="vize-ws-meta-val">{selectedCourseModal.level}</span>
                </div>
                <div className="vize-ws-modal-meta-item">
                  <span className="vize-ws-meta-label">Delivery Format</span>
                  <span className="vize-ws-meta-val">Hands-On Technical + Site Exposure</span>
                </div>
                <div className="vize-ws-modal-meta-item">
                  <span className="vize-ws-meta-label">Certification</span>
                  <span className="vize-ws-meta-val">Official Certification Included</span>
                </div>
              </div>

              {/* Specific: Flooring Techniques Section */}
              {selectedCourseModal.flooringTechniques && (
                <div className="vize-ws-modal-section-full">
                  <h4 className="vize-ws-modal-section-title">
                    <Layers size={16} />
                    <span>Flooring Techniques Covered</span>
                  </h4>
                  <div className="vize-ws-modal-techniques-grid">
                    {selectedCourseModal.flooringTechniques.map((tech, idx) => (
                      <div key={idx} className="vize-ws-tech-card">
                        <div className="vize-ws-tech-card-header">
                          <span className="vize-ws-tech-num">0{idx + 1}</span>
                          <h5 className="vize-ws-tech-title">{tech.name}</h5>
                        </div>
                        <p className="vize-ws-tech-desc">{tech.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific: 12 Modules Grid for Table Casting */}
              {selectedCourseModal.trainingModules && (
                <div className="vize-ws-modal-section-full">
                  <div className="vize-ws-modal-modules-header">
                    <h4 className="vize-ws-modal-section-title">
                      <Award size={16} />
                      <span>12-Module Technical Training Program</span>
                    </h4>
                    <span className="vize-ws-motto-tag">LEARN THE ART.</span>
                  </div>
                  <div className="vize-ws-modal-modules-grid">
                    {selectedCourseModal.trainingModules.map((module) => (
                      <div
                        key={module.num}
                        className={`vize-ws-module-card ${
                          module.title.includes('Optic Fiber') ? 'featured' : ''
                        }`}
                      >
                        <span className="vize-ws-module-num">{module.num}</span>
                        <div className="vize-ws-module-info">
                          <h5 className="vize-ws-module-title">{module.title}</h5>
                          <p className="vize-ws-module-desc">{module.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum and Inclusions Grid */}
              <div className="vize-ws-modal-grid">
                <div className="vize-ws-modal-section-box">
                  <h4 className="vize-ws-modal-section-title">
                    <Award size={16} />
                    <span>Detailed Curriculum & Practice</span>
                  </h4>
                  <ul className="vize-ws-modal-list">
                    {selectedCourseModal.curriculum.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="vize-ws-modal-section-box">
                  <h4 className="vize-ws-modal-section-title">
                    <ShieldCheck size={16} />
                    <span>Training Includes & Hospitality</span>
                  </h4>
                  <ul className="vize-ws-modal-list">
                    {selectedCourseModal.inclusions.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Who Can Join Box */}
              {selectedCourseModal.whoCanJoin && (
                <div className="vize-ws-modal-section-box vize-ws-audience-box">
                  <h4 className="vize-ws-modal-section-title">
                    <Users size={16} />
                    <span>Who Can Join?</span>
                  </h4>
                  <div className="vize-ws-audience-tags">
                    {selectedCourseModal.whoCanJoin.map((aud, idx) => (
                      <div key={idx} className="vize-ws-audience-item">
                        <CheckCircle2 size={13} />
                        <span>{aud}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Custom Fields Section */}
              {selectedCourseModal.customFields && selectedCourseModal.customFields.length > 0 && (
                <div className="vize-ws-modal-section-full" style={{ marginTop: '1.25rem' }}>
                  <h4 className="vize-ws-modal-section-title">
                    <Sparkles size={16} />
                    <span>Additional Course Specifications & Information</span>
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                    {selectedCourseModal.customFields.map((cf, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(241, 245, 249, 0.7)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb' }}>
                          {cf.key}
                        </span>
                        {cf.type === 'link' ? (
                          <a
                            href={cf.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7', textDecoration: 'underline', wordBreak: 'break-all' }}
                          >
                            {cf.value} ↗
                          </a>
                        ) : cf.type === 'badge' ? (
                          <span style={{ display: 'inline-block', alignSelf: 'flex-start', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {cf.value}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                            {cf.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="vize-ws-modal-footer">
                <p className="vize-ws-modal-disclaimer">
                  {selectedCourseModal.batchNote}
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCourseForEnquiry(selectedCourseModal.name)}
                  className="vize-ws-btn-primary"
                >
                  <span>Block Your Seat / Enquire</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          IMAGE LIGHTBOX MODAL
          ================================================================= */}
      {activeLightboxImage && (
        <div
          className="vize-ws-modal-backdrop"
          onClick={() => setActiveLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="vize-ws-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vize-ws-modal-close"
              onClick={() => setActiveLightboxImage(null)}
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <div className="vize-ws-lightbox-img-wrap">
              <img
                src={activeLightboxImage.image}
                alt={activeLightboxImage.alt}
                className="vize-ws-lightbox-img"
              />
            </div>
            <div className="vize-ws-lightbox-caption">
              <h4 className="vize-ws-lightbox-title">
                {activeLightboxImage.step} — {activeLightboxImage.title}
              </h4>
              <p className="vize-ws-lightbox-desc">{activeLightboxImage.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          6. SHARED FOOTER
          ================================================================= */}
      <Footer />
    </div>
  );
}
