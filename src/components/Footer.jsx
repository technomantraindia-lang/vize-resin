import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="vize-footer" aria-label="Site Footer">
      <div className="footer-main-container">
        {/* Top / Main Grid */}
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-link" aria-label="VIZE Home">
              <img
                src="/main logo.png"
                alt="VIZE Speciality Polymers"
                className="vize-footer-logo-img"
              />
            </Link>
            <p className="footer-brand-tagline">Floors. Art. A Brighter Tomorrow.</p>
            <div className="footer-brand-company-info">
              <span className="footer-company-name">VIZE Specialty Polymers</span>
              <p className="footer-company-desc">
                Manufacturer &amp; formulator of industrial epoxy resins, polyurethanes &amp; casting systems.
              </p>
            </div>
          </div>

          {/* CTA Center Col */}
          <div className="footer-cta-col">
            <h3 className="footer-cta-title">Let’s build your next surface.</h3>
            <p className="footer-cta-sub">Extraordinary spaces start here.</p>
            <div className="footer-cta-actions">
              <Link to="/resins" className="footer-btn-primary">
                Shop Resins <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="footer-btn-secondary">
                Get Product Guidance <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Nav & Policy Links Col */}
          <div className="footer-links-col">
            {/* Group 1: Products */}
            <div className="footer-nav-group">
              <span className="footer-group-heading">Products</span>
              <Link to="/resins" className="footer-nav-link">Epoxy Resins</Link>
              <Link to="/flooring-systems" className="footer-nav-link">Flooring Systems</Link>
              <Link to="/table-tops" className="footer-nav-link">Table Top Resins</Link>
              <Link to="/colors" className="footer-nav-link">Colors &amp; RAL Chart</Link>
            </div>

            {/* Group 2: Navigation */}
            <div className="footer-nav-group">
              <span className="footer-group-heading">Navigation</span>
              <Link to="/our-work" className="footer-nav-link">Our Work</Link>
              <Link to="/workshop" className="footer-nav-link">Workshops</Link>
              <Link to="/account" className="footer-nav-link">My Account &amp; Orders</Link>
              <Link to="/contact" className="footer-nav-link">Contact Us</Link>
            </div>

            {/* Group 3: Policies & Compliance (PhonePe Mandatory) */}
            <div className="footer-nav-group">
              <span className="footer-group-heading">Policies &amp; Legal</span>
              <Link to="/privacy-policy" className="footer-nav-link footer-policy-highlight">Privacy Policy</Link>
              <Link to="/terms-conditions" className="footer-nav-link footer-policy-highlight">Terms &amp; Conditions</Link>
              <Link to="/refund-policy" className="footer-nav-link footer-policy-highlight">Refund &amp; Cancellation</Link>
              <Link to="/shipping-policy" className="footer-nav-link footer-policy-highlight">Shipping &amp; Delivery</Link>
            </div>
          </div>

          {/* Social & Divider Col */}
          <div className="footer-social-col">
            <div className="footer-copper-divider" />
            <div className="footer-social-links">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="YouTube">
                <YoutubeIcon size={19} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Instagram">
                <InstagramIcon size={19} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                <LinkedinIcon size={19} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Technomantra Credit */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {new Date().getFullYear()} <strong>VIZE Specialty Polymers</strong>. All rights reserved.
            </p>
            <div className="footer-legal-inline">
              <Link to="/privacy-policy" className="footer-legal-inline-link">Privacy Policy</Link>
              <span className="footer-legal-inline-sep">•</span>
              <Link to="/terms-conditions" className="footer-legal-inline-link">Terms &amp; Conditions</Link>
              <span className="footer-legal-inline-sep">•</span>
              <Link to="/refund-policy" className="footer-legal-inline-link">Refund Policy</Link>
              <span className="footer-legal-inline-sep">•</span>
              <Link to="/shipping-policy" className="footer-legal-inline-link">Shipping Policy</Link>
            </div>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-developer-credit">
              <span className="footer-credit-label">Design and Developed by</span>
              <a
                href="https://technomantra.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="technomantra-link"
                title="Technomantra - Official Website"
              >
                <img
                  src="/technomantra-logo.png"
                  alt="Technomantra Logo"
                  className="technomantra-logo-img"
                />
                <span className="technomantra-tag">Technomantra</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

