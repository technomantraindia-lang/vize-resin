import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Package,
  ShieldCheck,
  Building,
  MapPin,
  Award,
  Truck,
  CheckCircle2,
  FileText,
  LogOut,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Headphones,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  const {
    user,
    isLoggedIn,
    orders,
    savedAddresses,
    activeTab,
    setActiveTab,
    login,
    quickLogin,
    signup,
    logout
  } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vize-page-wrapper">
      <Header />

      <main className="vize-account-page-main">
        <div className="vize-account-page-container">
          <div className="vize-account-page-header">
            <span className="vize-account-page-eyebrow">VIZE CLIENT & CONTRACTOR PORTAL</span>
            <h1>{isLoggedIn ? `Welcome, ${user.name}` : 'My Account & Trade Portal'}</h1>
            <p className="vize-account-page-sub">
              {isLoggedIn
                ? 'Manage your orders, technical project consultations, saved delivery sites, and contractor tier benefits.'
                : 'Sign in to access your orders, commercial trade discounts, and technical epoxy documentation.'}
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="vize-account-page-auth-card">
              <div className="vize-account-page-tabs">
                <button
                  type="button"
                  className={`vize-page-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Sign In to Existing Account
                </button>
                <button
                  type="button"
                  className={`vize-page-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Create New Account
                </button>
              </div>

              {activeTab === 'login' ? (
                <div className="vize-page-form-pane">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      login({ emailOrPhone: 'contractor@vizeresin.com', password: 'password123' });
                    }}
                    className="vize-account-form"
                  >
                    <div className="vize-account-field">
                      <label>Email or Mobile Number</label>
                      <div className="vize-account-input-wrap">
                        <Mail size={16} className="vize-account-input-icon" />
                        <input type="text" placeholder="name@company.com" required defaultValue="contractor@vizeresin.com" />
                      </div>
                    </div>

                    <div className="vize-account-field">
                      <label>Password</label>
                      <div className="vize-account-input-wrap">
                        <Lock size={16} className="vize-account-input-icon" />
                        <input type="password" placeholder="••••••••" defaultValue="password123" />
                      </div>
                    </div>

                    <button type="submit" className="vize-account-primary-btn">
                      <span>Sign In</span>
                      <ArrowRight size={17} />
                    </button>
                  </form>

                  <div className="vize-account-quick-demo-section" style={{ marginTop: '2rem' }}>
                    <span className="vize-account-divider-text">QUICK 1-CLICK DEMO ACCESS</span>
                    <div className="vize-account-demo-buttons">
                      <button
                        type="button"
                        className="vize-account-demo-btn pro"
                        onClick={() => quickLogin('contractor')}
                      >
                        <Building size={15} />
                        <span>Pro Epoxy Contractor (15% Off Tier)</span>
                      </button>
                      <button
                        type="button"
                        className="vize-account-demo-btn designer"
                        onClick={() => quickLogin('architect')}
                      >
                        <Award size={15} />
                        <span>Architect / Interior Designer</span>
                      </button>
                      <button
                        type="button"
                        className="vize-account-demo-btn artisan"
                        onClick={() => quickLogin('retail')}
                      >
                        <User size={15} />
                        <span>Artisan / River Table Maker</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="vize-page-form-pane">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      signup({
                        name: 'Vikram Mehta',
                        email: 'vikram@craft.com',
                        phone: '+91 98765 43210',
                        role: 'contractor',
                        company: 'Mehta Resin Surfaces',
                        gstin: '06AAAAA0000A1Z5'
                      });
                    }}
                    className="vize-account-form"
                  >
                    <div className="vize-account-field">
                      <label>Full Name</label>
                      <div className="vize-account-input-wrap">
                        <User size={16} className="vize-account-input-icon" />
                        <input type="text" placeholder="e.g. Vikram Mehta" required defaultValue="Vikram Mehta" />
                      </div>
                    </div>

                    <div className="vize-account-field">
                      <label>Email Address</label>
                      <div className="vize-account-input-wrap">
                        <Mail size={16} className="vize-account-input-icon" />
                        <input type="email" placeholder="vikram@craft.com" required defaultValue="vikram@craft.com" />
                      </div>
                    </div>

                    <button type="submit" className="vize-account-primary-btn">
                      <span>Create Account & Claim Trade Perks</span>
                      <ArrowRight size={17} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="vize-account-page-dashboard">
              {/* Profile Bar */}
              <div className="vize-account-banner">
                <div className="vize-account-user-badge">
                  <span className="vize-account-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="vize-account-user-meta">
                    <div className="vize-account-name-row">
                      <h4>{user.name}</h4>
                      <span className="vize-account-pro-pill">
                        <ShieldCheck size={13} />
                        {user.role || 'Verified Member'}
                      </span>
                    </div>
                    <p className="vize-account-email-sub">{user.email} &bull; {user.phone}</p>
                    {user.company && (
                      <p className="vize-account-company-tag">
                        <Building size={13} /> {user.company}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="vize-account-logout-btn"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Stats overview */}
              <div className="vize-account-stats-grid">
                <div className="vize-account-stat-card">
                  <span className="stat-label">ACCOUNT STATUS</span>
                  <span className="stat-value highlight">{user.tier || 'Trade Tier 1'}</span>
                  <span className="stat-sub">15% Automatic Trade Discount applied across all catalog</span>
                </div>
                <div className="vize-account-stat-card">
                  <span className="stat-label">VIZE REWARDS</span>
                  <span className="stat-value">{user.points || 1200} pts</span>
                  <span className="stat-sub">Available for free swatch books & kit upgrades</span>
                </div>
                <div className="vize-account-stat-card">
                  <span className="stat-label">ACTIVE ORDERS</span>
                  <span className="stat-value">{orders.length}</span>
                  <span className="stat-sub">Latest: #{orders[0]?.id} ({orders[0]?.status})</span>
                </div>
              </div>

              {/* Orders Section */}
              <div className="vize-account-orders-section">
                <h3 className="section-title">Recent Order History & Tracking</h3>
                <div className="vize-account-orders-list">
                  {orders.map((ord) => (
                    <div key={ord.id} className="vize-account-order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">Order #{ord.id}</span>
                          <span className="order-date">Placed on {ord.date}</span>
                        </div>
                        <span className={`order-badge ${ord.status.toLowerCase().replace(' ', '-')}`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="order-card-items-preview">
                        {ord.items.map((item, i) => (
                          <div key={i} className="mini-item-preview">
                            <img src={item.image} alt={item.name} />
                            <span>{item.name} &bull; {item.size} (x{item.qty})</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div>
                          <span className="order-total-label">Total Billed:</span>
                          <span className="order-total-val">{ord.total}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            type="button"
                            className="vize-account-download-btn"
                            onClick={() => alert(`Downloaded GST Tax Invoice for Order #${ord.id}`)}
                          >
                            <FileText size={14} />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
