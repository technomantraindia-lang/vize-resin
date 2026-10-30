import { useEffect, useState } from 'react';
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
  ExternalLink,
  Sparkles,
  Factory,
  Store,
  Home,
  GraduationCap,
  Palette,
  MoreHorizontal,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLE_OPTIONS = [
  {
    id: 'contractor',
    label: 'Epoxy Contractor',
    icon: Building,
    hint: 'Unlocks 15% trade tier pricing, priority dispatch & lab chemist hotline.'
  },
  {
    id: 'designer',
    label: 'Designer / Architect',
    icon: Sparkles,
    hint: 'Sample swatch boxes, custom RAL pigment matching & architectural CPD sheets.'
  },
  {
    id: 'retail',
    label: 'Artisan / Maker',
    icon: Palette,
    hint: 'River table formulations, casting resins & creative artist loyalty rewards.'
  },
  {
    id: 'industrial',
    label: 'Industrial / Factory',
    icon: Factory,
    hint: 'Heavy duty floor systems, chemical containment specs & bulk 200L drums.'
  },
  {
    id: 'dealer',
    label: 'Dealer / Distributor',
    icon: Store,
    hint: 'Wholesale tier discounts, showroom marketing POS & territory distribution support.'
  },
  {
    id: 'homeowner',
    label: 'Homeowner / DIYer',
    icon: Home,
    hint: 'DIY garage & countertop project kits with step-by-step application calculators.'
  },
  {
    id: 'student',
    label: 'Workshop Student',
    icon: GraduationCap,
    hint: 'Epoxy training course attendee discount & practical hands-on starter guides.'
  },
  {
    id: 'other',
    label: 'Other',
    icon: MoreHorizontal,
    hint: 'Specialized polymer applications, marine craft, or custom resin consultancy.'
  }
];

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

  const [pageName, setPageName] = useState('');
  const [pageEmail, setPageEmail] = useState('');
  const [pagePhone, setPagePhone] = useState('');
  const [pageRole, setPageRole] = useState('contractor');

  // Login form state
  const [pageLoginEmail, setPageLoginEmail] = useState('');
  const [pageLoginPassword, setPageLoginPassword] = useState('');
  const [pageError, setPageError] = useState('');
  const [pageSuccess, setPageSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                  onClick={() => {
                    setActiveTab('signup');
                    setPageError('');
                  }}
                >
                  Create New Account
                </button>
              </div>

              {pageError && (
                <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', background: '#FEE2E2', border: '1px solid #F87171', borderRadius: '8px', color: '#991B1B', fontSize: '0.875rem' }}>
                  {pageError}
                </div>
              )}

              {pageSuccess && (
                <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', background: '#ECFDF5', border: '1px solid #34D399', borderRadius: '8px', color: '#065F46', fontSize: '0.875rem' }}>
                  {pageSuccess}
                </div>
              )}

              {activeTab === 'login' ? (
                <div className="vize-page-form-pane">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setPageError('');
                      if (!pageLoginEmail) {
                        setPageError('Please enter your email address or mobile number.');
                        return;
                      }
                      setIsSubmitting(true);
                      try {
                        const res = await login({ emailOrPhone: pageLoginEmail, password: pageLoginPassword });
                        if (res && res.success) {
                          setPageSuccess('Signed in successfully.');
                        } else {
                          setPageError(res?.message || 'Login failed. Please verify your credentials.');
                        }
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="vize-account-form"
                  >
                    <div className="vize-account-field">
                      <label>Email or Mobile Number</label>
                      <div className="vize-account-input-wrap">
                        <Mail size={16} className="vize-account-input-icon" />
                        <input
                          type="text"
                          placeholder="name@company.com"
                          required
                          value={pageLoginEmail}
                          onChange={(e) => setPageLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="vize-account-field">
                      <label>Password</label>
                      <div className="vize-account-input-wrap">
                        <Lock size={16} className="vize-account-input-icon" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={pageLoginPassword}
                          onChange={(e) => setPageLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="submit" className="vize-account-primary-btn" disabled={isSubmitting}>
                      <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setPageError('');
                      if (!pageName || !pageEmail) {
                        setPageError('Please enter your full name and email address.');
                        return;
                      }
                      setIsSubmitting(true);
                      try {
                        const res = await signup({
                          name: pageName,
                          email: pageEmail,
                          phone: pagePhone,
                          role: pageRole
                        });
                        if (res && res.success) {
                          setPageSuccess('Account created successfully!');
                        } else {
                          setPageError(res?.message || 'Failed to create account.');
                        }
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="vize-account-form"
                  >
                    <div className="vize-account-field">
                      <label>I am registering as</label>
                      <div className="vize-account-role-selector">
                        {ROLE_OPTIONS.map((role) => {
                          const Icon = role.icon;
                          const isSelected = pageRole === role.id;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              className={`vize-account-role-chip ${isSelected ? 'selected' : ''}`}
                              onClick={() => setPageRole(role.id)}
                            >
                              <Icon size={14} style={{ flexShrink: 0 }} />
                              <span>{role.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {(() => {
                        const active = ROLE_OPTIONS.find((r) => r.id === pageRole);
                        return active?.hint ? (
                          <div className="vize-account-role-benefit-hint">
                            <Info size={13} style={{ flexShrink: 0, color: '#8C4830' }} />
                            <span>
                              <strong>{active.label}:</strong> {active.hint}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <div className="vize-account-grid-2">
                      <div className="vize-account-field">
                        <label htmlFor="page-name">Full Name *</label>
                        <div className="vize-account-input-wrap">
                          <User size={16} className="vize-account-input-icon" />
                          <input
                            id="page-name"
                            type="text"
                            placeholder="e.g. Vikram Mehta"
                            required
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="vize-account-field">
                        <label htmlFor="page-phone">Mobile Number</label>
                        <div className="vize-account-input-wrap">
                          <Phone size={16} className="vize-account-input-icon" />
                          <input
                            id="page-phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={pagePhone}
                            onChange={(e) => setPagePhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vize-account-field">
                      <label htmlFor="page-email">Email Address *</label>
                      <div className="vize-account-input-wrap">
                        <Mail size={16} className="vize-account-input-icon" />
                        <input
                          id="page-email"
                          type="email"
                          placeholder="name@company.com"
                          required
                          value={pageEmail}
                          onChange={(e) => setPageEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="submit" className="vize-account-primary-btn" disabled={isSubmitting}>
                      <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Claim Trade Perks'}</span>
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
                  <span className="stat-sub">
                    {orders.length > 0
                      ? `Latest: #${orders[0]?.id} (${orders[0]?.status})`
                      : 'No orders placed yet'}
                  </span>
                </div>
              </div>

              {/* Orders Section */}
              <div className="vize-account-orders-section">
                <h3 className="section-title">Recent Order History & Tracking</h3>
                {orders.length === 0 ? (
                  <div className="vize-account-empty-state">
                    <Package size={48} className="vize-account-empty-icon" />
                    <h4>No Orders Placed Yet</h4>
                    <p>
                      You haven't placed any orders with this account yet. When you purchase epoxy resins, topcoats, or pigments, your shipment tracking and tax invoices will appear here.
                    </p>
                    <Link
                      to="/resins"
                      className="vize-account-primary-btn"
                      style={{ textDecoration: 'none', display: 'inline-flex', marginTop: '0.5rem', width: 'auto', padding: '0.75rem 1.4rem' }}
                    >
                      <span>Browse Resins &amp; Products</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
