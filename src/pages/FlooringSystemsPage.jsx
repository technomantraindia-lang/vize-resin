import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  MessageSquare,
  X,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Phone
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 8 Signature Flooring Systems faithfully matching the reference design
const FLOORING_SYSTEMS = [
  {
    id: 'metallic-resin',
    num: '01',
    title: 'Metallic Resin Flooring',
    desc: 'Flowing metallic pigments create marble-like patterns and visual depth for decorative interior floors.',
    image: '/Metallic Resin Flooring.png',
    category: 'Decorative & Commercial',
    thickness: '2.0 – 3.5 mm',
    finish: 'High-Gloss Iridescent',
    cure: '24 Hours Foot Traffic',
    applications: 'Automotive Showrooms, Luxury Residences, Art Galleries, Executive Lounges'
  },
  {
    id: 'industrial-resin',
    num: '02',
    title: 'Industrial Resin Flooring',
    desc: 'Seamless resin flooring systems for warehouses, workshops and production spaces, selected around operational needs.',
    image: '/Industrial Resin Flooring.png',
    category: 'Industrial & Warehousing',
    thickness: '3.0 – 5.0 mm',
    finish: 'Gloss / Semi-Gloss Hardened',
    cure: '18 Hours Light Traffic',
    applications: 'Warehouses, Distribution Centers, Assembly Plants, Tooling Workshops'
  },
  {
    id: 'industrial-pu',
    num: '03',
    title: 'Industrial Polyurethane Flooring',
    desc: 'Polyurethane flooring systems for industrial spaces, specified around traffic, cleaning and operating conditions.',
    image: '/Industrial Polyurethane Flooring.png',
    category: 'Specialist & Chemical',
    thickness: '3.0 – 6.0 mm',
    finish: 'Satin Matt / Seamless',
    cure: '12 - 16 Hours Rapid Cure',
    applications: 'Chemical Processing, Aviation Hangars, Production Bays, Beverage Bottling'
  },
  {
    id: 'flake-flooring',
    num: '04',
    title: 'High Traffic Flake Flooring',
    desc: 'Decorative flakes create a textured visual finish for busy commercial spaces, corridors and shared areas.',
    image: '/high traffic flake flooring.png',
    category: 'Decorative & Commercial',
    thickness: '2.0 – 3.0 mm',
    finish: 'Granite Terrazzo / Semi-Gloss',
    cure: '4 - 6 Hours Fast Return',
    applications: 'Commercial Corridors, Luxury Garages, Fitness Centers, Retail Stores'
  },
  {
    id: 'anti-slip-granule',
    num: '05',
    title: 'Anti Abrasive Anti Slip Granule Flooring',
    desc: 'Granule-textured flooring for projects with defined grip and wear requirements. Performance depends on the specified system.',
    image: '/space-industrial.jpg',
    category: 'Industrial & Warehousing',
    thickness: '4.0 – 6.0 mm',
    finish: 'Textured Grip (R11 to R13)',
    cure: '24 Hours Full Load',
    applications: 'Wash Bays, Loading Ramps, Commercial Kitchens, Heavy Engineering'
  },
  {
    id: 'bio-safety-lab',
    num: '06',
    title: 'Bio Safety Lab Critical Non Porous Flooring',
    desc: 'Continuous flooring with coved detailing for laboratory projects requiring controlled cleaning and surface specifications.',
    image: '/Bio Safety Lab Critical Non Porous Flooring.png',
    category: 'Cleanroom & Medical',
    thickness: '3.0 – 4.0 mm',
    finish: 'Ultra-Smooth Non-Porous Gloss',
    cure: '24 Hours Sterile Handover',
    applications: 'Pharmaceutical Labs, Cleanrooms, Bio-Tech Research, Quarantine Facilities'
  },
  {
    id: 'medical-applications',
    num: '07',
    title: 'Medical Applications Flooring (MRI/CT Scan)',
    desc: 'Flooring for diagnostic-room projects, coordinated with facility needs and MRI or CT equipment requirements.',
    image: '/medical Application.png',
    category: 'Cleanroom & Medical',
    thickness: '2.5 – 3.5 mm',
    finish: 'Smooth Stain-Resistant Matt (ESD)',
    cure: '18 Hours Handover',
    applications: 'MRI Suites, CT Scan Rooms, Surgical Theaters, ICU & Diagnostic Centers'
  },
  {
    id: 'food-safe',
    num: '08',
    title: 'Food Safe Non Porous Flooring',
    desc: 'Continuous flooring for food-handling environments, specified around hygiene, cleaning and documented suitability.',
    image: '/Food Safe Non Porous Flooring.png',
    category: 'Specialist & Chemical',
    thickness: '6.0 – 9.0 mm',
    finish: 'Matte Anti-Microbial Screed',
    cure: '12 Hours Return-to-Service',
    applications: 'Dairies, Abattoirs, Bakeries, Food Packaging, Commercial Cold Storage'
  }
];

export default function FlooringSystemsPage() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSystemTitle, setConsultSystemTitle] = useState('General Flooring Inquiry');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSystemDetail = (system) => {
    setSelectedSystem(system);
  };

  const openConsultModal = (title) => {
    setConsultSystemTitle(title);
    setFormSubmitted(false);
    setIsConsultModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="vize-flooring-page-root">
      <Header />

      <main className="vize-flooring-main-content">
        {/* =========================================================================
            1. GLORIFIED HERO SECTION (CINEMATIC METALLIC FLOORING BACKGROUND)
           ========================================================================= */}
        <section className="vize-ref-hero-section">
          {/* Majestic Full-Bleed Flooring Image */}
          <div className="vize-ref-hero-bg-frame">
            <img
              src="/Metallic Resin Flooring.png"
              alt="Luxury Metallic Resin Flooring"
              className="vize-ref-hero-bg-img"
            />
            <div className="vize-ref-hero-overlay-gradient" />
          </div>

          <div className="vize-ref-hero-content-container">
            {/* Dark Frosted Glass Card with Headline */}
            <div className="vize-ref-hero-card">
              <span className="vize-ref-hero-eyebrow">VIZE FLOORING SYSTEMS</span>
              <h1 className="vize-ref-hero-title">
                Flooring, for<br />
                <em className="vize-ref-hero-serif-italic">every environment.</em>
              </h1>
              <p className="vize-ref-hero-sub">
                Explore decorative, industrial and specialist flooring systems.
              </p>

              <div className="vize-ref-hero-btn-row">
                <a href="#flooring-types" className="vize-ref-btn-terracotta">
                  Explore flooring types
                </a>
                <button
                  type="button"
                  className="vize-ref-btn-text-link"
                  onClick={() => openConsultModal('Hero Project Inquiry')}
                >
                  <span>Discuss your project</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. BREADCRUMB & SECTION HEADING
           ========================================================================= */}
        <section className="vize-ref-grid-section" id="flooring-types">
          <div className="vize-ref-page-container">
            
            {/* Breadcrumb */}
            <div className="vize-ref-breadcrumbs">
              <Link to="/" className="vize-ref-crumb-link">Home</Link>
              <span className="vize-ref-crumb-sep">/</span>
              <span className="vize-ref-crumb-current">Flooring Systems</span>
            </div>

            {/* Section Header */}
            <div className="vize-ref-section-header">
              <h2 className="vize-ref-section-title">
                Find your <em className="vize-ref-serif-italic">flooring system.</em>
              </h2>
              <p className="vize-ref-section-lead">
                Eight flooring types. Explore the right starting point for your project.
              </p>
            </div>

            {/* =========================================================================
                3. THE 8 GLORIFIED FLOORING CARDS (PANORAMIC CINEMATIC IMAGES)
               ========================================================================= */}
            <div className="vize-ref-cards-grid">
              {FLOORING_SYSTEMS.map((system) => (
                <article key={system.id} className="vize-ref-system-card">
                  {/* Glorified Panoramic Flooring Image Box */}
                  <div
                    className="vize-ref-card-image-box"
                    onClick={() => openSystemDetail(system)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View full details of ${system.title}`}
                  >
                    <img
                      src={system.image}
                      alt={system.title}
                      className="vize-ref-card-img"
                      loading="lazy"
                    />
                    <div className="vize-ref-img-hover-overlay">
                      <span className="vize-ref-expand-badge">
                        <Maximize2 size={15} />
                        <span>Inspect Finish</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Info Body */}
                  <div className="vize-ref-card-body">
                    <span className="vize-ref-card-number">{system.num}</span>
                    <h3
                      className="vize-ref-card-title"
                      onClick={() => openSystemDetail(system)}
                    >
                      {system.title}
                    </h3>
                    <p className="vize-ref-card-desc">{system.desc}</p>
                    <button
                      type="button"
                      className="vize-ref-explore-link"
                      onClick={() => openSystemDetail(system)}
                    >
                      <span>Explore System</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Application Imagery Disclaimer Note */}
            <p className="vize-ref-disclaimer">
              Application imagery is illustrative. Confirm specifications and suitability for your project.
            </p>

          </div>
        </section>

        {/* =========================================================================
            4. BOTTOM CTA BANNER (EXACT TO REFERENCE)
           ========================================================================= */}
        <section className="vize-ref-bottom-cta-section">
          <div className="vize-ref-bottom-cta-container">
            <div className="vize-ref-cta-box">
              <div className="vize-ref-cta-text-area">
                <h3 className="vize-ref-cta-title">Need help choosing a system?</h3>
                <p className="vize-ref-cta-subtitle">
                  Tell us about your space and application requirements.
                </p>
              </div>
              <button
                type="button"
                className="vize-ref-cta-action-btn"
                onClick={() => openConsultModal('General Project Specification')}
              >
                <span>Discuss your project</span>
                <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* =========================================================================
          5. SYSTEM INSPECTION & GLORIFICATION LIGHTBOX MODAL
         ========================================================================= */}
      {selectedSystem && (
        <div
          className="vize-lightbox-backdrop"
          onClick={() => setSelectedSystem(null)}
        >
          <div
            className="vize-lightbox-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="vize-lightbox-close"
              onClick={() => setSelectedSystem(null)}
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {/* High-Resolution Glorified Image Container */}
            <div className="vize-lightbox-media-wrapper">
              <img
                src={selectedSystem.image}
                alt={selectedSystem.title}
                className="vize-lightbox-highres-img"
              />
              <div className="vize-lightbox-media-badge">
                <span>SYSTEM {selectedSystem.num}</span>
                <span>•</span>
                <span>{selectedSystem.category}</span>
              </div>
            </div>

            {/* Modal Specs & Actions */}
            <div className="vize-lightbox-content-area">
              <div className="vize-lightbox-header">
                <span className="vize-lightbox-number">{selectedSystem.num}</span>
                <h2 className="vize-lightbox-title">{selectedSystem.title}</h2>
                <p className="vize-lightbox-desc">{selectedSystem.desc}</p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="vize-lightbox-specs-grid">
                <div className="vize-spec-box">
                  <span className="vize-spec-label">Layer Thickness</span>
                  <strong className="vize-spec-value">{selectedSystem.thickness}</strong>
                </div>
                <div className="vize-spec-box">
                  <span className="vize-spec-label">Surface Finish</span>
                  <strong className="vize-spec-value">{selectedSystem.finish}</strong>
                </div>
                <div className="vize-spec-box">
                  <span className="vize-spec-label">Cure Handover</span>
                  <strong className="vize-spec-value">{selectedSystem.cure}</strong>
                </div>
              </div>

              {/* Ideal Applications Box */}
              <div className="vize-lightbox-app-box">
                <strong className="vize-app-label">Ideal For:</strong>
                <p className="vize-app-text">{selectedSystem.applications}</p>
              </div>

              {/* Action Buttons */}
              <div className="vize-lightbox-actions">
                <button
                  type="button"
                  className="vize-lightbox-primary-btn"
                  onClick={() => {
                    const sysName = selectedSystem.title;
                    setSelectedSystem(null);
                    openConsultModal(sysName);
                  }}
                >
                  <span>Request System Specification</span>
                  <ArrowUpRight size={17} />
                </button>
                <a
                  href={`https://api.whatsapp.com/send?phone=919876543210&text=Hi%20VIZE%20team,%20I%20am%20interested%20in%20System%20${selectedSystem.num}%20(${encodeURIComponent(selectedSystem.title)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vize-lightbox-whatsapp-btn"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Specialist</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. PROJECT CONSULTATION & SPECIFICATION MODAL
         ========================================================================= */}
      {isConsultModalOpen && (
        <div
          className="vize-lightbox-backdrop"
          onClick={() => setIsConsultModalOpen(false)}
        >
          <div
            className="vize-consult-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="vize-lightbox-close"
              onClick={() => setIsConsultModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div className="vize-consult-success-state">
                <div className="vize-success-check-icon">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="vize-success-heading">Consultation Request Received</h3>
                <p className="vize-success-text">
                  Thank you, <strong>{formData.name || 'Valued Client'}</strong>. Our technical engineering team has logged your inquiry for <em>"{consultSystemTitle}"</em>. An applicator specialist will connect with you within 2 business hours.
                </p>
                <button
                  type="button"
                  className="vize-ref-btn-terracotta"
                  onClick={() => setIsConsultModalOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="vize-consult-form-wrap">
                <div className="vize-consult-header">
                  <span className="vize-ref-hero-eyebrow">TECHNICAL CONSULTATION</span>
                  <h3 className="vize-consult-heading">Discuss Your Flooring Project</h3>
                  <p className="vize-consult-sub">
                    Inquiring about: <strong>{consultSystemTitle}</strong>
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="vize-consult-form">
                  <div className="vize-form-row two-col">
                    <div className="vize-form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vivek Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="vize-form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="vize-form-row two-col">
                    <div className="vize-form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="vize-form-group">
                      <label>Estimated Area (Sq. Ft.)</label>
                      <input
                        type="text"
                        placeholder="e.g. 3,500 sq.ft."
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="vize-form-group">
                    <label>Substrate Condition & Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Concrete substrate with minor moisture, heavy forklift traffic, cold room..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="vize-form-actions">
                    <button type="submit" className="vize-modal-submit-btn">
                      <span>Submit Project Inquiry</span>
                      <ArrowUpRight size={17} />
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
