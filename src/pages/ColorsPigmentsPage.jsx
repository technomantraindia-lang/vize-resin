import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Compass,
  Palette,
  ShoppingCart
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PigmentsFinishesSection from '../components/PigmentsFinishesSection';
import PigmentsOrderSection from '../components/PigmentsOrderSection';

export default function ColorsPigmentsPage() {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="colors-page-root">
      <Header />

      <main>
        {/* =================================================================
            1. HERO SECTION
           ================================================================= */}
        <section className="colors-hero-section" aria-label="Colors and Pigments">
          <div className="colors-hero-overlay" />
          <div className="colors-hero-container">
            <div className="colors-eyebrow-wrap">
              <span className="colors-eyebrow">COLOR FORMULATION STANDARDS</span>
              <span className="colors-eyebrow-line" />
            </div>

            <h1 className="colors-hero-title">
              200+ Signature Pigments &amp;<br />
              <span className="colors-title-italic">Official RAL Classic Chart.</span>
            </h1>

            <p className="colors-hero-lead">
              From our signature liquid metallics, celestial pearl powders, and textured Granual Epoxy flake blends to certified RAL industrial shades,
              VIZE precision pigment dispersions deliver flawless saturation and long-term UV permanence.
            </p>

            <div className="colors-hero-actions">
              <a href="#order-pigments" className="colors-hero-btn-primary">
                <ShoppingCart size={18} />
                <span>Order Pigments &amp; Colors</span>
              </a>

              <a
                href="/ral-colour-chart.pdf"
                download="RAL-Classic-Colour-Chart-VIZE.pdf"
                className="colors-hero-btn-outline"
                title="Download 4-page official RAL Classic Colour Chart PDF"
              >
                <Download size={18} />
                <span>Download RAL Chart (PDF)</span>
              </a>

              <a href="#finishes" className="colors-hero-btn-outline">
                <Palette size={18} />
                <span>Explore Swatch Palette</span>
              </a>
            </div>

            {/* Value Trust Points */}
            <div className="colors-hero-trust-bar">
              <div className="colors-trust-item">
                <ShieldCheck size={16} className="colors-trust-icon" />
                <span>100% Non-Fading Aliphatic UV Stability</span>
              </div>
              <div className="colors-trust-item">
                <Sparkles size={16} className="colors-trust-icon" />
                <span>Zero Pigment Settlement in Deep Castings</span>
              </div>
              <div className="colors-trust-item">
                <CheckCircle2 size={16} className="colors-trust-icon" />
                <span>Exact Batch-Matched Lab Formulations</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. DEDICATED PIGMENTS & COLORS SEPARATE ORDERING SECTION
           ================================================================= */}
        <PigmentsOrderSection />

        {/* =================================================================
            3. INTERACTIVE PIGMENTS & RAL PALETTE EXPLORER
           ================================================================= */}
        <PigmentsFinishesSection />

        {/* =================================================================
            4. OFFICIAL PIGMENT SELLING PRICE LIST (GST INCLUSIVE)
           ================================================================= */}
        <section className="vize-pigment-pricing-section" id="pigment-price-list">
          <div className="colors-container">
            <div className="vize-pigment-pricing-header">
              <div className="colors-eyebrow-wrap">
                <span className="colors-eyebrow">VIZE SPECIALITY POLYMERS</span>
                <span className="colors-eyebrow-line" />
              </div>
              <h2 className="vize-pigment-pricing-title">
                VIZE Pigments Selling Price List
              </h2>
              <p className="vize-pigment-pricing-subtitle">
                Colours that create extraordinary spaces · All prices are inclusive of 18% GST
              </p>
            </div>

            {/* Price Table Card */}
            <div className="vize-pigment-pricing-card">
              <div className="vize-pigment-table-wrapper">
                <table className="vize-pigment-table">
                  <thead>
                    <tr>
                      <th className="th-product">PRODUCT</th>
                      <th className="th-500g">
                        500 GRAMS
                        <span className="th-sub">SELLING PRICE (GST INCL.)</span>
                      </th>
                      <th className="th-1kg">
                        1 KG
                        <span className="th-sub">SELLING PRICE (GST INCL.)</span>
                      </th>
                      <th className="th-status">AVAILABILITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td-product">
                        <div className="vize-pgm-cell">
                          <div className="vize-pgm-badge-img pigment-blue" />
                          <div>
                            <strong className="vize-pgm-name">PIGMENT</strong>
                            <p className="vize-pgm-desc">Rich, vibrant colours for stunning finishes.</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-price td-500g">
                        <span className="vize-pgm-price">₹513.00</span>
                        <span className="vize-pgm-weight">(500 g)</span>
                      </td>
                      <td className="td-price td-1kg">
                        <span className="vize-pgm-price">₹1,026.00</span>
                        <span className="vize-pgm-weight">(1 kg)</span>
                      </td>
                      <td className="td-status">
                        <span className="vize-pgm-instock-badge">Available Online</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td-product">
                        <div className="vize-pgm-cell">
                          <div className="vize-pgm-badge-img pearl-shimmer" />
                          <div>
                            <strong className="vize-pgm-name">PEARL / MICA</strong>
                            <p className="vize-pgm-desc">Adds depth, shimmer and elegance.</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-price td-500g">
                        <span className="vize-pgm-price">₹769.95</span>
                        <span className="vize-pgm-weight">(500 g)</span>
                      </td>
                      <td className="td-price td-1kg">
                        <span className="vize-pgm-price">₹1,539.90</span>
                        <span className="vize-pgm-weight">(1 kg)</span>
                      </td>
                      <td className="td-status">
                        <span className="vize-pgm-instock-badge">Available Online</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td-product">
                        <div className="vize-pgm-cell">
                          <div className="vize-pgm-badge-img selected-shades" />
                          <div>
                            <strong className="vize-pgm-name">SELECTED SHADES</strong>
                            <p className="vize-pgm-desc">Unique shades for creative expressions.</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-price td-500g">
                        <span className="vize-pgm-price">₹855.00</span>
                        <span className="vize-pgm-weight">(500 g)</span>
                      </td>
                      <td className="td-price td-1kg">
                        <span className="vize-pgm-price">₹1,711.00</span>
                        <span className="vize-pgm-weight">(1 kg)</span>
                      </td>
                      <td className="td-status">
                        <span className="vize-pgm-instock-badge">Available Online</span>
                      </td>
                    </tr>

                    <tr className="tr-metallic-offline">
                      <td className="td-product">
                        <div className="vize-pgm-cell">
                          <div className="vize-pgm-badge-img metallic-gold" />
                          <div>
                            <strong className="vize-pgm-name">METALLIC (COPPER / PALE GOLD)</strong>
                            <p className="vize-pgm-desc">Premium metallic finish for luxurious spaces.</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-price td-500g">
                        <span className="vize-pgm-price">₹1,568.40</span>
                        <span className="vize-pgm-weight">(500 g)</span>
                      </td>
                      <td className="td-price td-1kg">
                        <span className="vize-pgm-price">₹3,079.80</span>
                        <span className="vize-pgm-weight">(1 kg)</span>
                      </td>
                      <td className="td-status">
                        <span className="vize-pgm-offline-badge" title="Not available on website / Special Order">
                          Special / Offline Order
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Shipping Charges Ribbon */}
              <div className="vize-pgm-shipping-bar">
                <div className="vize-pgm-shipping-title-block">
                  <span className="vize-pgm-ship-icon">🚚</span>
                  <div>
                    <strong>SHIPPING CHARGES</strong>
                    <span className="vize-pgm-ship-sub">Direct courier dispatch</span>
                  </div>
                </div>

                <div className="vize-pgm-ship-tier">
                  <span className="vize-pgm-pin-icon">📍</span>
                  <div>
                    <span className="vize-pgm-ship-region">GUJARAT</span>
                    <strong className="vize-pgm-ship-rate">₹75 <small>/kg</small></strong>
                  </div>
                </div>

                <div className="vize-pgm-ship-tier">
                  <span className="vize-pgm-pin-icon">📍</span>
                  <div>
                    <span className="vize-pgm-ship-region">REST OF INDIA</span>
                    <strong className="vize-pgm-ship-rate">₹110 <small>/kg</small></strong>
                  </div>
                </div>

                <div className="vize-pgm-ship-tier defense-tier">
                  <span className="vize-pgm-pin-icon">🛡️</span>
                  <div>
                    <span className="vize-pgm-ship-region">DEFENCE AREAS</span>
                    <span className="vize-pgm-ship-note">Calculated separately</span>
                  </div>
                </div>
              </div>

              {/* Note Bar */}
              <div className="vize-pgm-notice-bar">
                <span className="vize-pgm-notice-badge">NOTE</span>
                <ul className="vize-pgm-notice-list">
                  <li>All prices are inclusive of 18% GST.</li>
                  <li>Metallic Copper &amp; Pale Gold are not available on the website (Available via offline/direct orders).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. ARCHITECTURAL & INDUSTRIAL SPECIFICATION GUIDE
           ================================================================= */}
        <section className="colors-spec-guide-section">
          <div className="colors-container">
            <div className="colors-guide-header">
              <span className="colors-guide-eyebrow">LABORATORY COMPATIBILITY</span>
              <h2 className="colors-guide-title">Pigment Formulations by System</h2>
              <p className="colors-guide-desc">
                Our dispersions and decorative aggregates are tested for optimal rheology, cohesion, and surface tension balance across each polymer base.
              </p>
            </div>

            <div className="colors-guide-grid">
              <div className="colors-guide-card">
                <div className="colors-card-top">
                  <span className="colors-card-badge">DEEP CASTING</span>
                  <h3 className="colors-card-title">River Tables &amp; Block Pours</h3>
                </div>
                <p className="colors-card-desc">
                  Low-viscosity mica powders and transparent alcohol tint inks designed to remain suspended across 72-hour cure times without sinking to the bottom.
                </p>
                <ul className="colors-card-list">
                  <li>✓ Compatible with <strong>Vize SuperCast</strong> (up to 10cm single pour)</li>
                  <li>✓ Disperses evenly in low-exotherm environments</li>
                  <li>✓ High optical clarity and luminous depth</li>
                </ul>
                <Link to="/table-tops" className="colors-card-link">
                  <span>Explore Table Top Systems</span>
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="colors-guide-card">
                <div className="colors-card-top">
                  <span className="colors-card-badge">SEAMLESS SURFACES</span>
                  <h3 className="colors-card-title">Metallic &amp; Industrial Flooring</h3>
                </div>
                <p className="colors-card-desc">
                  Heavy-density dynamic metallic paste and opaque RAL tint packs for seamless commercial floors, retail screeds, and showroom installations.
                </p>
                <ul className="colors-card-list">
                  <li>✓ Compatible with <strong>Vize FloorCoat &amp; Screed Base</strong></li>
                  <li>✓ Superior self-leveling and swirl feathering capability</li>
                  <li>✓ 100% solids, VOC-compliant formula</li>
                </ul>
                <Link to="/flooring-systems" className="colors-card-link">
                  <span>Explore Flooring Systems</span>
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="colors-guide-card">
                <div className="colors-card-top">
                  <span className="colors-card-badge">DECORATIVE &amp; DURABLE</span>
                  <h3 className="colors-card-title">Granual Epoxy Flake Systems</h3>
                </div>
                <p className="colors-card-desc">
                  Pre-engineered multi-color vinyl flakes and quartz granules broadcast into high-solids epoxy primers and sealed with clear polyaspartic.
                </p>
                <ul className="colors-card-list">
                  <li>✓ Compatible with <strong>Vize FlakeBase &amp; ArmorTop</strong></li>
                  <li>✓ Textured, slip-resistant &amp; impact-absorbing finish</li>
                  <li>✓ 8 signature high-contrast &amp; natural mineral blends</li>
                </ul>
                <Link to="/flooring-systems" className="colors-card-link">
                  <span>Explore Granual Flooring</span>
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="colors-guide-card">
                <div className="colors-card-top">
                  <span className="colors-card-badge">BESPOKE MATCHING</span>
                  <h3 className="colors-card-title">Custom Batch Color Matching</h3>
                </div>
                <p className="colors-card-desc">
                  Need an exact pantone, corporate brand shade, or custom stone tint? Our chemical lab creates certified pre-tinted resin masterbatches.
                </p>
                <ul className="colors-card-list">
                  <li>✓ Spectrophotometer color verification (Delta E &lt; 0.5)</li>
                  <li>✓ Physical cured sample pucks shipped before bulk delivery</li>
                  <li>✓ Available in 5kg to 200kg drum volumes</li>
                </ul>
                <Link to="/contact" className="colors-card-link">
                  <span>Request Custom Color Match</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            4. PDF DOCUMENT DOWNLOAD BANNER
           ================================================================= */}
        <section className="colors-pdf-banner-section">
          <div className="colors-container">
            <div className="colors-pdf-card">
              <div className="colors-pdf-card-content">
                <div className="colors-pdf-tag">
                  <FileText size={16} />
                  <span>OFFICIAL REFERENCE DOCUMENT</span>
                </div>
                <h3 className="colors-pdf-card-title">
                  Download the Complete RAL Classic Colour Chart
                </h3>
                <p className="colors-pdf-card-text">
                  Get high-resolution digital access to all 4 pages containing 200+ RAL standard industrial colors, code designations, and color categories.
                </p>
                <div className="colors-pdf-actions">
                  <a
                    href="/ral-colour-chart.pdf"
                    download="RAL-Classic-Colour-Chart-VIZE.pdf"
                    className="colors-download-btn"
                  >
                    <Download size={18} />
                    <span>Download 4-Page PDF (Instant)</span>
                  </a>
                  <a
                    href="/ral-colour-chart.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="colors-view-online-btn"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
