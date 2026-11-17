import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  UploadCloud,
  HelpCircle,
  Building,
  Headphones,
  Truck
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchFromApi } from '../utils/api';

const INQUIRY_TYPES = [
  { id: 'tables', label: '🪵 Table & Live Edge Pour', desc: 'Deep pour, casting resins & live-edge calculations' },
  { id: 'flooring', label: '🏢 Flooring & Industrial', desc: 'Metallic, commercial screed & PU flooring systems' },
  { id: 'art-casting', label: '🎨 Art, Molds & Pigments', desc: 'Art resin, mica powders & small-scale casting' },
  { id: 'wholesale', label: '🤝 Contractor / Wholesale', desc: 'Bulk drums, contractor pricing & certification' }
];

const CORPORATE_CENTERS = [
  {
    city: 'Central Chemical Hub',
    region: 'Official Operational Facility',
    company: 'VIZE Specialty Polymers',
    address: 'Central Chemical Hub, Ahmedabad, Gujarat, India - 382445',
    email: 'support@vizeresin.com',
    services: 'Formulation Quality Labs • Automated Batch Packaging • Direct Factory Dispatch'
  },
  {
    city: 'Pan-India Fulfillment',
    region: 'Nationwide Logistics Network',
    company: 'Delhivery Surface Express',
    address: '19,000+ PIN Codes Covered Across All States & Union Territories',
    email: 'tracking@vizeresin.com',
    services: '1-2 Days (Gujarat/West) • 2-3 Days (Metros) • 3-4 Days (Pan-India)'
  },
  {
    city: 'Corporate Desk',
    region: 'Commercial & Statutory Desk',
    company: 'VIZE Specialty Polymers',
    address: 'GST Registered • B2B Input Tax Credit Available • 256-Bit SSL Secured',
    email: 'contact@vizeresin.com',
    services: '18% GST Invoicing • Chemical TDS/MSDS Support • PhonePe Verified Merchant'
  }
];

const FAQS_DATA = [
  {
    q: 'How fast do you dispatch resin orders?',
    a: 'Standard 1kg to 15kg kits are dispatched within 24 hours via air express (2-3 business days delivery across India). Bulk contractor drums (30kg – 200kg) are shipped through specialized surface logistics with tracking.'
  },
  {
    q: 'Can you help calculate the exact resin quantity for my table or floor?',
    a: 'Yes! You can either use our interactive calculator on the Table Tops page, or send your slab dimensions (Length × Width × Thickness) in the form above. Our chemical engineers will provide an exact volume, weight, and exotherm safety recommendation.'
  },
  {
    q: 'Do you provide physical color swatches and samples?',
    a: 'Absolutely. We offer 100g trial pigment jars and cured physical resin puck samples for all 18 signature metallic and pearl shades so you can test color saturation in your natural lighting before ordering.'
  },
  {
    q: 'What technical documentation is provided with products?',
    a: 'Every VIZE product comes with fully certified Technical Data Sheets (TDS), Safety Data Sheets (SDS), VOC Compliance reports, and detailed application guidelines.'
  },
  {
    q: 'Do you offer custom formulations for extreme temperatures or outdoor UV use?',
    a: 'Yes, our laboratory formulates specialized slow-cure deep pour resins for hot summer climates, as well as aliphatic polyaspartic coats for maximum exterior UV resistance.'
  }
];

export default function ContactUsPage() {
  const [selectedInquiry, setSelectedInquiry] = useState('tables');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    estimatedQty: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const matchedType = INQUIRY_TYPES.find((t) => t.id === selectedInquiry);
    // Strip leading emojis to keep database records clean and readable
    const serviceLabel = matchedType 
      ? matchedType.label.replace(/^[\p{Emoji}\p{Extended_Pictographic}\s]+/u, '').trim() 
      : 'General Inquiry';

    const detailsList = [];
    if (formData.city) detailsList.push(`City: ${formData.city}`);
    if (formData.estimatedQty) detailsList.push(`Est: ${formData.estimatedQty}`);
    if (formData.message) detailsList.push(formData.message);
    if (attachedFileName) detailsList.push(`File: ${attachedFileName}`);

    const compiledMessage = detailsList.join(' · ') || 'General project consultation requested via website.';

    try {
      await fetchFromApi('/api/vize/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: serviceLabel,
          message: compiledMessage
        })
      });
    } catch (err) {
      console.warn('Inquiry submission notice:', err);
    } finally {
      const randomTicket = 'VZ-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(randomTicket);
      setFormSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="contact-page-root">
      <Header />

      <main>
        {/* =================================================================
            1. HERO SECTION
           ================================================================= */}
        <section className="contact-hero-section" aria-label="Contact Us Header">
          <div className="contact-hero-overlay" />
          <div className="contact-hero-container">
            <div className="contact-company-badge">
              <ShieldCheck size={16} />
              <span>VIZE Specialty Polymers • Official Desk</span>
            </div>
            <h1 className="contact-hero-title">
              Let’s discuss your <span className="contact-title-italic">vision.</span>
            </h1>
            <p className="contact-hero-subtitle">
              Official technical and commercial support from <strong>VIZE Specialty Polymers</strong>.
              Whether you need casting resin calculations, custom contractor formulations,
              architectural specifications, or sample swatches — our polymer specialists are ready to guide you.
            </p>

            {/* Value Trust Badges */}
            <div className="contact-trust-badges">
              <div className="contact-trust-item">
                <Clock size={16} className="contact-trust-icon" />
                <span>Response within <strong>2–4 business hours</strong></span>
              </div>
              <div className="contact-trust-item">
                <ShieldCheck size={16} className="contact-trust-icon" />
                <span>Free <strong>Technical Formulation Advice</strong></span>
              </div>
              <div className="contact-trust-item">
                <Sparkles size={16} className="contact-trust-icon" />
                <span>Direct <strong>Laboratory & Batch Support</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. MAIN INTERACTIVE FORM & DIRECT CHANNELS SECTION
           ================================================================= */}
        <section className="contact-main-section">
          <div className="contact-container">
            <div className="contact-grid-layout">
              {/* Left Column: Interactive Consultation Form */}
              <div className="contact-form-container">
                <div className="contact-form-card">
                  <div className="contact-form-header">
                    <span className="contact-form-eyebrow">DIRECT SPECIFICATION INQUIRY</span>
                    <h2 className="contact-form-title">Start a Project Consultation</h2>
                    <p className="contact-form-subtitle">
                      Select your category below for tailored technical assistance.
                    </p>
                  </div>

                  {/* Inquiry Type Selector Tabs */}
                  <div className="contact-type-tabs">
                    {INQUIRY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`contact-type-btn ${
                          selectedInquiry === type.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedInquiry(type.id)}
                      >
                        <span className="contact-type-label">{type.label}</span>
                        <span className="contact-type-sub">{type.desc}</span>
                      </button>
                    ))}
                  </div>

                  {formSubmitted ? (
                    <div className="contact-success-state">
                      <CheckCircle2 size={56} className="contact-success-icon" />
                      <h3 className="contact-success-title">Inquiry Received Successfully</h3>
                      <p className="contact-success-text">
                        Thank you, <strong>{formData.name || 'Valued Maker'}</strong>. Your consultation
                        request has been assigned reference ID:
                      </p>
                      <div className="contact-ticket-badge">
                        <span>Ticket ID:</span> <strong>{ticketId}</strong>
                      </div>
                      <p className="contact-success-followup">
                        A VIZE senior formulation engineer will review your project requirements and
                        connect via WhatsApp / Email within 2–4 hours with custom batch recommendations.
                      </p>
                      <div className="contact-success-actions">
                        <button
                          type="button"
                          className="contact-btn-primary"
                          onClick={() => {
                            setFormSubmitted(false);
                            setAttachedFileName('');
                            setFormData({
                              name: '',
                              phone: '',
                              email: '',
                              city: '',
                              estimatedQty: '',
                              message: ''
                            });
                          }}
                        >
                          Submit Another Request
                        </button>
                        <Link to="/" className="contact-btn-outline">
                          Return to Home
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-actual-form">
                      <div className="contact-form-row">
                        <div className="contact-field">
                          <label htmlFor="contact-name">
                            Full Name <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            name="name"
                            required
                            placeholder="e.g. Vikram Sharma"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="contact-input"
                          />
                        </div>
                        <div className="contact-field">
                          <label htmlFor="contact-phone">
                            Phone / WhatsApp <span className="req">*</span>
                          </label>
                          <input
                            type="tel"
                            id="contact-phone"
                            name="phone"
                            required
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="contact-input"
                          />
                        </div>
                      </div>

                      <div className="contact-form-row">
                        <div className="contact-field">
                          <label htmlFor="contact-email">
                            Email Address <span className="req">*</span>
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            name="email"
                            required
                            placeholder="vikram@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="contact-input"
                          />
                        </div>
                        <div className="contact-field">
                          <label htmlFor="contact-city">
                            City / Project Location <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            id="contact-city"
                            name="city"
                            required
                            placeholder="e.g. Mumbai, Bengaluru, Delhi"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="contact-input"
                          />
                        </div>
                      </div>

                      <div className="contact-field">
                        <label htmlFor="contact-qty">
                          Estimated Quantity / Area (Optional)
                        </label>
                        <input
                          type="text"
                          id="contact-qty"
                          name="estimatedQty"
                          placeholder="e.g. 15 kg resin or ~250 sq.ft floor"
                          value={formData.estimatedQty}
                          onChange={handleInputChange}
                          className="contact-input"
                        />
                      </div>

                      <div className="contact-field">
                        <label htmlFor="contact-message">
                          Project Details &amp; Requirements (Optional)
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={3}
                          placeholder="Tell us about slab dimensions, desired finish (matte/mirror), floor thickness, or timeline..."
                          value={formData.message}
                          onChange={handleInputChange}
                          className="contact-textarea"
                        />
                      </div>

                      {/* Optional File Attachment Mockup */}
                      <div className="contact-upload-box">
                        <input
                          type="file"
                          id="contact-file-upload"
                          className="contact-file-input"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                        />
                        <label htmlFor="contact-file-upload" className="contact-upload-label">
                          <UploadCloud size={20} className="contact-upload-icon" />
                          <span>
                            {attachedFileName ? (
                              <strong>Attached: {attachedFileName}</strong>
                            ) : (
                              'Attach site photos, slab measurements or blueprints (optional)'
                            )}
                          </span>
                        </label>
                      </div>

                      <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                        <span>{isSubmitting ? 'Transmitting Request...' : 'Send Project Consultation Request'}</span>
                        <Send size={17} />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Direct Channels & Fast Response Info */}
              <div className="contact-info-sidebar">
                {/* Channel 1: WhatsApp Instant Support */}
                <div className="contact-sidebar-card contact-whatsapp-card">
                  <div className="contact-card-head">
                    <div className="contact-icon-bubble whatsapp-bubble">
                      <MessageSquare size={22} />
                    </div>
                    <div>
                      <span className="contact-card-tag">FASTEST RESPONSE</span>
                      <h3 className="contact-card-title">Live WhatsApp Tech Desk</h3>
                    </div>
                  </div>
                  <p className="contact-card-desc">
                    Chat directly with our application engineers for quick mixing ratio checks,
                    formula verification, and order dispatch status.
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20VIZE%20Team,%20I%20have%20an%20inquiry%20regarding%20your%20resin%20systems."
                    target="_blank"
                    rel="noreferrer"
                    className="contact-whatsapp-btn"
                  >
                    <span>Chat on WhatsApp</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Channel 2: Official Corporate Entity & Contact */}
                <div className="contact-sidebar-card">
                  <div className="contact-card-head">
                    <div className="contact-icon-bubble">
                      <Building size={22} />
                    </div>
                    <div>
                      <span className="contact-card-tag">CORPORATE ENTITY</span>
                      <h3 className="contact-card-title">VIZE Specialty Polymers</h3>
                    </div>
                  </div>
                  <div className="contact-direct-links">
                    <div className="contact-link-row">
                      <Building size={16} className="contact-mini-icon" />
                      <div>
                        <span className="contact-sub-label">Operating Company:</span>
                        <span className="contact-link-val" style={{ fontWeight: 600, color: '#091A20' }}>VIZE Specialty Polymers</span>
                      </div>
                    </div>
                    <div className="contact-link-row">
                      <MapPin size={16} className="contact-mini-icon" />
                      <div>
                        <span className="contact-sub-label">Operational Hub:</span>
                        <span className="contact-link-val">Ahmedabad, Gujarat, India - 382445</span>
                      </div>
                    </div>
                    <div className="contact-link-row">
                      <Mail size={16} className="contact-mini-icon" />
                      <div>
                        <span className="contact-sub-label">General &amp; Order Support:</span>
                        <a href="mailto:support@vizeresin.com" className="contact-link-val">support@vizeresin.com</a>
                      </div>
                    </div>
                    <div className="contact-link-row">
                      <Mail size={16} className="contact-mini-icon" />
                      <div>
                        <span className="contact-sub-label">Formulations &amp; Commercial:</span>
                        <a href="mailto:contact@vizeresin.com" className="contact-link-val">contact@vizeresin.com</a>
                      </div>
                    </div>
                    <div className="contact-link-row">
                      <Clock size={16} className="contact-mini-icon" />
                      <div>
                        <span className="contact-sub-label">Working Hours:</span>
                        <span className="contact-link-val">Mon – Sat, 9:30 AM – 6:30 PM IST</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel 3: Sample Box Request */}
                <div className="contact-sidebar-card contact-sample-card">
                  <div className="contact-card-head">
                    <div className="contact-icon-bubble sample-bubble">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <span className="contact-card-tag">ARCHITECT & MAKER KIT</span>
                      <h3 className="contact-card-title">Request Physical Swatches</h3>
                    </div>
                  </div>
                  <p className="contact-card-desc">
                    Experience our 18 metallic, pearlescent, and opaque color finishes in high-gloss cured physical test pucks.
                  </p>
                  <Link to="/table-tops#finishes" className="contact-sample-btn">
                    <span>Explore Color Swatches</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. CORPORATE HEADQUARTERS & NATIONWIDE FULFILLMENT
           ================================================================= */}
        <section className="contact-hubs-section">
          <div className="contact-container">
            <div className="contact-section-header">
              <div>
                <span className="contact-eyebrow">CORPORATE HEADQUARTERS &amp; LOGISTICS</span>
                <h2 className="contact-section-title">Operations &amp; Fulfillment</h2>
              </div>
              <p className="contact-section-desc">
                Official operational facility and certified surface express fulfillment network
                for <strong>VIZE Specialty Polymers</strong> across India.
              </p>
            </div>

            <div className="contact-hubs-grid">
              {CORPORATE_CENTERS.map((hub) => (
                <div key={hub.city} className="contact-hub-card">
                  <div className="contact-hub-top">
                    <span className="contact-hub-badge">{hub.region}</span>
                    <h3 className="contact-hub-city">{hub.city}</h3>
                  </div>
                  <div className="contact-hub-body">
                    <div className="contact-hub-item">
                      <Building size={17} className="contact-hub-icon" />
                      <p className="contact-hub-text"><strong>{hub.company}</strong></p>
                    </div>
                    <div className="contact-hub-item">
                      <MapPin size={17} className="contact-hub-icon" />
                      <p className="contact-hub-text">{hub.address}</p>
                    </div>
                    <div className="contact-hub-item">
                      <Mail size={17} className="contact-hub-icon" />
                      <a href={`mailto:${hub.email}`} className="contact-hub-link">{hub.email}</a>
                    </div>
                  </div>
                  <div className="contact-hub-footer">
                    <span className="contact-hub-features">{hub.services}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            4. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
           ================================================================= */}
        <section className="contact-faq-section">
          <div className="contact-container">
            <div className="contact-section-header contact-header-centered">
              <span className="contact-eyebrow">COMMON QUESTIONS</span>
              <h2 className="contact-section-title">Frequently Asked Questions</h2>
              <p className="contact-section-desc contact-desc-centered">
                Quick answers to common questions about shipping, exotherm safety, and technical specs.
              </p>
            </div>

            <div className="contact-faq-list">
              {FAQS_DATA.map((faq, idx) => (
                <div
                  key={faq.q}
                  className={`contact-faq-item ${activeFaqIndex === idx ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="contact-faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={activeFaqIndex === idx}
                  >
                    <span className="contact-faq-q-text">{faq.q}</span>
                    <span className="contact-faq-chevron">
                      {activeFaqIndex === idx ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                    </span>
                  </button>
                  {activeFaqIndex === idx && (
                    <div className="contact-faq-answer-box">
                      <p className="contact-faq-answer-text">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
