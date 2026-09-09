import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
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
            <li><Link to="/resins" className="nav-item">Resins</Link></li>
            <li><Link to="/flooring-systems" className="nav-item">Flooring Systems</Link></li>
            <li><Link to="/table-tops" className="nav-item">Table Tops</Link></li>
            <li><Link to="/workshop" className="nav-item">Workshop</Link></li>
            <li><Link to="/resources" className="nav-item">Resources</Link></li>
          </ul>
        </nav>

        {/* Right Actions: Divider, Search & Cart */}
        <div className="header-actions">
          <span className="header-divider"></span>
          <button className="icon-action-btn" aria-label="Search">
            <Search size={19} strokeWidth={1.75} />
          </button>
          <button className="icon-action-btn" aria-label="Shopping Cart">
            <ShoppingCart size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
