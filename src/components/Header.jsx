import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Palette,
  Layers,
  Box,
  Wrench,
  Briefcase,
  PhoneCall,
  User,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

export default function Header() {
  const { totalItemCount, openDrawer } = useCart();
  const { user, isLoggedIn, openAccountModal } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Keyboard shortcut (Ctrl+K or Cmd+K) to open global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="vize-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="vize-brand-block" aria-label="VIZE Home">
          <img
            src="/main logo.png"
            alt="VIZE Speciality Polymers"
            className="vize-brand-logo-img"
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="vize-nav">
          <ul className="nav-menu">
            <li>
              <Link
                to="/resins"
                className={`nav-item ${location.pathname === '/resins' ? 'active' : ''}`}
              >
                Resins
              </Link>
            </li>
            <li>
              <Link
                to="/flooring-systems"
                className={`nav-item ${location.pathname === '/flooring-systems' ? 'active' : ''}`}
              >
                Flooring Systems
              </Link>
            </li>
            <li>
              <Link
                to="/table-tops"
                className={`nav-item ${location.pathname === '/table-tops' ? 'active' : ''}`}
              >
                Table Tops
              </Link>
            </li>
            <li className="nav-item-dropdown">
              <Link
                to="/colors"
                className={`nav-item nav-dropdown-trigger ${['/colors', '/colors-pigments', '/colour-chart', '/color-chart', '/pigments'].includes(location.pathname) ? 'active' : ''}`}
              >
                Colors & Pigments
              </Link>
              <div className="nav-mega-dropdown">
                <div className="nav-dropdown-header">
                  <div>
                    <span className="nav-dropdown-eyebrow">PIGMENTS & RAL CHART</span>
                    <h4 className="nav-dropdown-title">Explore 200+ RAL Shades & Signature Swatches</h4>
                  </div>
                  <Link to="/colors" className="nav-dropdown-view-all">
                    <span>View All Colors & PDF</span>
                  </Link>
                </div>
                <div className="nav-dropdown-grid">
                  {[
                    { id: 'petrol-teal', name: 'Petrol Teal', image: '/colors/Petrol Teal.png' },
                    { id: 'copper', name: 'Copper', image: '/colors/Copper.png' },
                    { id: 'silver', name: 'Silver', image: '/colors/Silver.png' },
                    { id: 'liquid-gold', name: 'Liquid Gold', image: '/colors/Liquid Gold.png' },
                    { id: 'deep-blue', name: 'Deep Blue', image: '/colors/Deep Blue.png' },
                    { id: 'bronze-vein', name: 'Bronze Vein', image: '/colors/Bronze Vein.png' }
                  ].map((color) => (
                    <Link key={color.id} to="/colors" className="nav-dropdown-color-item">
                      <div className="nav-dropdown-img-box">
                        <img src={color.image} alt={color.name} />
                      </div>
                      <span className="nav-dropdown-color-name">{color.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <Link
                to="/workshop"
                className={`nav-item ${location.pathname === '/workshop' ? 'active' : ''}`}
              >
                Workshop
              </Link>
            </li>
            <li>
              <Link
                to="/our-work"
                className={`nav-item ${['/our-work', '/work', '/resources'].includes(location.pathname) ? 'active' : ''}`}
              >
                Our Work
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`nav-item ${['/contact', '/contact-us', '/support'].includes(location.pathname) ? 'active' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Actions: Divider, Search, Account & Cart + Mobile Menu Toggle */}
        <div className="header-actions">
          <span className="header-divider"></span>
          
          {/* Search Button */}
          <button
            type="button"
            className="icon-action-btn vize-header-search-btn"
            aria-label="Search"
            onClick={() => setSearchModalOpen(true)}
            title="Search Site (Ctrl+K)"
          >
            <Search size={19} strokeWidth={1.75} />
          </button>

          {/* Account / User Portal Button */}
          <button
            type="button"
            className={`icon-action-btn vize-header-account-btn ${isLoggedIn ? 'is-logged-in' : ''}`}
            aria-label="Account & Orders"
            onClick={() => openAccountModal()}
            title={isLoggedIn ? `Account: ${user.name} (${user.role})` : 'Account / Sign In (Pro & Retail)'}
          >
            {isLoggedIn ? (
              <div className="vize-header-avatar-badge" title={`Signed in as ${user.name}`}>
                <span className="vize-header-avatar-letter">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="vize-header-avatar-dot" />
              </div>
            ) : (
              <User size={20} strokeWidth={1.75} />
            )}
          </button>

          {/* Cart Button */}
          <button
            className="icon-action-btn vize-header-cart-btn"
            aria-label="Shopping Cart"
            onClick={openDrawer}
            title="Open Shopping Cart"
          >
            <ShoppingCart size={20} strokeWidth={1.75} />
            {totalItemCount > 0 && (
              <span className="vize-cart-badge-count" key={totalItemCount}>
                {totalItemCount > 99 ? '99+' : totalItemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            className="vize-mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER & BACKDROP (RENDERED VIA PORTAL TO BODY)
         ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {mobileMenuOpen && (
              <div
                className="vize-mobile-backdrop"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
            )}

            <aside
              className={`vize-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
              aria-label="Mobile Navigation"
            >
              <div className="vize-mobile-drawer-header">
                <Link
                  to="/"
                  className="vize-brand-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="/main logo.png"
                    alt="VIZE"
                    className="vize-brand-logo-img"
                    style={{ height: '42px' }}
                  />
                </Link>
                <button
                  type="button"
                  className="vize-mobile-drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Navigation"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="vize-mobile-drawer-body">
                {/* Mobile Account Quick Bar */}
                <div
                  className="vize-mobile-account-card"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAccountModal();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="vize-mobile-account-left">
                    <div className="vize-mobile-account-avatar">
                      {isLoggedIn ? (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div className="vize-mobile-account-meta">
                      <span className="vize-mobile-account-title">
                        {isLoggedIn ? user.name : 'Account & Pro Login'}
                      </span>
                      <span className="vize-mobile-account-subtitle">
                        {isLoggedIn ? (user.role || 'Pro Verified') : 'Sign in for 15% trade discounts'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="vize-mobile-account-arrow" />
                </div>

                <nav className="vize-mobile-nav-list">
                  <button
                    type="button"
                    className="vize-mobile-nav-item vize-mobile-nav-account-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAccountModal();
                    }}
                  >
                    <div className="vize-mobile-item-left">
                      <User size={18} className="vize-mobile-icon" />
                      <span>My Orders & Account</span>
                    </div>
                    <span className="vize-mobile-pill-badge accent">
                      {isLoggedIn ? 'Active' : 'Login'}
                    </span>
                  </button>

                  <Link
                    to="/resins"
                    className={`vize-mobile-nav-item ${location.pathname === '/resins' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Box size={18} className="vize-mobile-icon" />
                      <span>Resins</span>
                    </div>
                    <ChevronRight size={16} className="vize-mobile-chevron" />
                  </Link>

                  <Link
                    to="/flooring-systems"
                    className={`vize-mobile-nav-item ${location.pathname === '/flooring-systems' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Layers size={18} className="vize-mobile-icon" />
                      <span>Flooring Systems</span>
                    </div>
                    <ChevronRight size={16} className="vize-mobile-chevron" />
                  </Link>

                  <Link
                    to="/table-tops"
                    className={`vize-mobile-nav-item ${location.pathname === '/table-tops' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Sparkles size={18} className="vize-mobile-icon" />
                      <span>Table Tops</span>
                    </div>
                    <ChevronRight size={16} className="vize-mobile-chevron" />
                  </Link>

                  <Link
                    to="/colors"
                    className={`vize-mobile-nav-item ${['/colors', '/colors-pigments', '/colour-chart', '/color-chart', '/pigments'].includes(location.pathname) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Palette size={18} className="vize-mobile-icon" />
                      <span>Colors & Pigments</span>
                    </div>
                    <span className="vize-mobile-pill-badge accent">200+ RAL</span>
                  </Link>

                  <Link
                    to="/workshop"
                    className={`vize-mobile-nav-item ${location.pathname === '/workshop' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Wrench size={18} className="vize-mobile-icon" />
                      <span>Workshop</span>
                    </div>
                    <ChevronRight size={16} className="vize-mobile-chevron" />
                  </Link>

                  <Link
                    to="/our-work"
                    className={`vize-mobile-nav-item ${['/our-work', '/work', '/resources'].includes(location.pathname) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <Briefcase size={18} className="vize-mobile-icon" />
                      <span>Our Work</span>
                    </div>
                    <span className="vize-mobile-pill-badge accent">Archive</span>
                  </Link>

                  <Link
                    to="/contact"
                    className={`vize-mobile-nav-item ${['/contact', '/contact-us', '/support'].includes(location.pathname) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="vize-mobile-item-left">
                      <PhoneCall size={18} className="vize-mobile-icon" />
                      <span>Contact Us</span>
                    </div>
                    <ChevronRight size={16} className="vize-mobile-chevron" />
                  </Link>
                </nav>

                {/* Quick Swatch Preview in Mobile Menu */}
                <div className="vize-mobile-swatch-box">
                  <span className="vize-mobile-swatch-eyebrow">POPULAR METALLIC FINISHES</span>
                  <div className="vize-mobile-swatch-row">
                    {[
                      { name: 'Petrol Teal', img: '/colors/Petrol Teal.png' },
                      { name: 'Copper', img: '/colors/Copper.png' },
                      { name: 'Silver', img: '/colors/Silver.png' },
                      { name: 'Liquid Gold', img: '/colors/Liquid Gold.png' }
                    ].map((c) => (
                      <div key={c.name} className="vize-mobile-swatch-chip" title={c.name}>
                        <img src={c.img} alt={c.name} />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="vize-mobile-drawer-footer">
                  <Link
                    to="/our-work"
                    className="vize-mobile-cta-btn primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Start Your Project</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/resins"
                    className="vize-mobile-cta-btn secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Explore All Products</span>
                  </Link>
                </div>
              </div>
            </aside>
          </>,
          document.body
        )}
    </header>
  );
}
