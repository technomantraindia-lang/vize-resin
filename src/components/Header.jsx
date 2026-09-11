import { Search, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItemCount, openDrawer } = useCart();
  const location = useLocation();

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

        {/* Navigation Menu */}
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
              <a href="/#finishes" className="nav-item nav-dropdown-trigger">
                Colors & Pigments
              </a>
              <div className="nav-mega-dropdown">
                <div className="nav-dropdown-header">
                  <div>
                    <span className="nav-dropdown-eyebrow">PIGMENTS & FINISHES</span>
                    <h4 className="nav-dropdown-title">Explore 18 Signature Metallic Swatches</h4>
                  </div>
                  <a href="/#finishes" className="nav-dropdown-view-all">
                    <span>View All</span>
                  </a>
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
                    <a key={color.id} href="/#finishes" className="nav-dropdown-color-item">
                      <div className="nav-dropdown-img-box">
                        <img src={color.image} alt={color.name} />
                      </div>
                      <span className="nav-dropdown-color-name">{color.name}</span>
                    </a>
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
          </ul>
        </nav>

        {/* Right Actions: Divider, Search, User & Cart */}
        <div className="header-actions">
          <span className="header-divider"></span>
          <button className="icon-action-btn" aria-label="Search">
            <Search size={19} strokeWidth={1.75} />
          </button>
          <button className="icon-action-btn" aria-label="User Account">
            <User size={19} strokeWidth={1.75} />
          </button>
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
        </div>
      </div>
    </header>
  );
}
