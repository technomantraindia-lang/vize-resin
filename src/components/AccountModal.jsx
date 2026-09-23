import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ShieldCheck,
  Package,
  MapPin,
  FileText,
  LogOut,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ExternalLink,
  Award,
  Headphones,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AccountModal() {
  const {
    user,
    isLoggedIn,
    orders,
    savedAddresses,
    isAccountModalOpen,
    activeTab,
    setActiveTab,
    closeAccountModal,
    login,
    quickLogin,
    signup,
    logout,
    updateProfile
  } = useAuth();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('contractor');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupGstin, setSignupGstin] = useState('');

  // UI feedback
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountModalOpen) {
        closeAccountModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountModalOpen, closeAccountModal]);

  if (!isAccountModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setActionError('');
    if (!loginEmail) {
      setActionError('Please enter your email or mobile number.');
      return;
    }
    const res = login({ emailOrPhone: loginEmail, password: loginPassword });
    if (res.success) {
      setActionSuccess('Successfully signed in to VIZE account.');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setActionError('');
    if (!signupName || !signupEmail) {
      setActionError('Please fill in your name and email address.');
      return;
    }
    const res = signup({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      role: signupRole,
      company: signupCompany,
      gstin: signupGstin
    });
    if (res.success) {
      setActionSuccess('Account created successfully! Welcome to VIZE.');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleQuickDemo = (type) => {
    quickLogin(type);
    setActionSuccess(`Signed in with demo profile (${type})`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return typeof document !== 'undefined'
    ? createPortal(
        <div className="vize-account-modal-portal">
          {/* Backdrop */}
          <div
            className="vize-account-backdrop"
            onClick={closeAccountModal}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div
            className="vize-account-modal-wrapper"
            role="dialog"
            aria-modal="true"
            aria-label="Account Portal"
          >
            {/* Header / Brand Banner */}
            <div className="vize-account-modal-header">
              <div className="vize-account-header-brand">
                <img
                  src="/main logo.png"
                  alt="VIZE"
                  className="vize-account-header-logo"
                />
                <span className="vize-account-header-tag">
                  {isLoggedIn ? 'CLIENT PORTAL' : 'ACCOUNT ACCESS'}
                </span>
              </div>
              <button
                type="button"
                className="vize-account-close-btn"
                onClick={closeAccountModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification alert banner */}
            {actionSuccess && (
              <div className="vize-account-alert success">
                <CheckCircle2 size={16} />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="vize-account-alert error">
                <X size={16} />
                <span>{actionError}</span>
              </div>
            )}

            {/* Main Modal Body */}
            <div className="vize-account-modal-body">
              {!isLoggedIn ? (
                /* ===================================================================
                   LOGGED-OUT VIEW: SIGN IN / REGISTER
                   =================================================================== */
                <div className="vize-account-auth-container">
                  {/* Auth Mode Switcher Tabs */}
                  <div className="vize-account-tab-pills">
                    <button
                      type="button"
                      className={`vize-account-pill-btn ${activeTab === 'login' ? 'active' : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className={`vize-account-pill-btn ${activeTab === 'signup' ? 'active' : ''}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Create Account
                    </button>
                  </div>

                  {activeTab === 'login' ? (
                    /* --- SIGN IN FORM --- */
                    <div className="vize-account-form-pane">
                      <div className="vize-account-pane-heading">
                        <h3>Welcome back to VIZE</h3>
                        <p>Access your orders, pro contractor discounts, and technical specs.</p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="vize-account-form">
                        <div className="vize-account-field">
                          <label htmlFor="login-email">Email or Mobile Number</label>
                          <div className="vize-account-input-wrap">
                            <Mail size={17} className="vize-account-input-icon" />
                            <input
                              id="login-email"
                              type="text"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="e.g. contractor@vizeresin.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="vize-account-field">
                          <div className="vize-account-field-header">
                            <label htmlFor="login-password">Password</label>
                            <a
                              href="#forgot"
                              onClick={(e) => {
                                e.preventDefault();
                                alert('Password reset instructions will be sent to your registered email.');
                              }}
                              className="vize-account-link"
                            >
                              Forgot password?
                            </a>
                          </div>
                          <div className="vize-account-input-wrap">
                            <Lock size={17} className="vize-account-input-icon" />
                            <input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="Enter your account password"
                            />
                            <button
                              type="button"
                              className="vize-account-eye-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="vize-account-options-row">
                          <label className="vize-account-checkbox-label">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Keep me signed in</span>
                          </label>
                        </div>

                        <button type="submit" className="vize-account-primary-btn">
                          <span>Sign In to Account</span>
                          <ArrowRight size={17} />
                        </button>
                      </form>

                      {/* Quick 1-Click Demo Profiles */}
                      <div className="vize-account-quick-demo-section">
                        <span className="vize-account-divider-text">OR TEST WITH 1-CLICK DEMO PROFILE</span>
                        <div className="vize-account-demo-buttons">
                          <button
                            type="button"
                            className="vize-account-demo-btn pro"
                            onClick={() => handleQuickDemo('contractor')}
                          >
                            <Building size={15} />
                            <span>Pro Epoxy Contractor (15% Off Tier)</span>
                          </button>
                          <button
                            type="button"
                            className="vize-account-demo-btn designer"
                            onClick={() => handleQuickDemo('architect')}
                          >
                            <Sparkles size={15} />
                            <span>Architect / Interior Designer</span>
                          </button>
                          <button
                            type="button"
                            className="vize-account-demo-btn artisan"
                            onClick={() => handleQuickDemo('retail')}
                          >
                            <User size={15} />
                            <span>Artisan / River Table Maker</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- SIGN UP FORM --- */
                    <div className="vize-account-form-pane">
                      <div className="vize-account-pane-heading">
                        <h3>Join VIZE Speciality Polymers</h3>
                        <p>Unlock commercial pricing, GST invoices & priority technical support.</p>
                      </div>

                      <form onSubmit={handleSignupSubmit} className="vize-account-form">
                        <div className="vize-account-field">
                          <label>I am registering as</label>
                          <div className="vize-account-role-selector">
                            {[
                              { id: 'contractor', label: 'Epoxy Contractor', icon: Building },
                              { id: 'designer', label: 'Designer / Architect', icon: Sparkles },
                              { id: 'retail', label: 'Artisan / Maker', icon: User }
                            ].map((role) => {
                              const Icon = role.icon;
                              return (
                                <button
                                  key={role.id}
                                  type="button"
                                  className={`vize-account-role-chip ${signupRole === role.id ? 'selected' : ''}`}
                                  onClick={() => setSignupRole(role.id)}
                                >
                                  <Icon size={14} />
                                  <span>{role.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="vize-account-grid-2">
                          <div className="vize-account-field">
                            <label htmlFor="signup-name">Full Name *</label>
                            <div className="vize-account-input-wrap">
                              <User size={16} className="vize-account-input-icon" />
                              <input
                                id="signup-name"
                                type="text"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                placeholder="e.g. Arjun Sharma"
                                required
                              />
                            </div>
                          </div>

                          <div className="vize-account-field">
                            <label htmlFor="signup-phone">Mobile Number</label>
                            <div className="vize-account-input-wrap">
                              <Phone size={16} className="vize-account-input-icon" />
                              <input
                                id="signup-phone"
                                type="tel"
                                value={signupPhone}
                                onChange={(e) => setSignupPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="vize-account-field">
                          <label htmlFor="signup-email">Work / Personal Email *</label>
                          <div className="vize-account-input-wrap">
                            <Mail size={16} className="vize-account-input-icon" />
                            <input
                              id="signup-email"
                              type="email"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              placeholder="name@company.com"
                              required
                            />
                          </div>
                        </div>

                        {(signupRole === 'contractor' || signupRole === 'designer') && (
                          <div className="vize-account-grid-2">
                            <div className="vize-account-field">
                              <label htmlFor="signup-company">Company / Studio Name</label>
                              <div className="vize-account-input-wrap">
                                <Building size={16} className="vize-account-input-icon" />
                                <input
                                  id="signup-company"
                                  type="text"
                                  value={signupCompany}
                                  onChange={(e) => setSignupCompany(e.target.value)}
                                  placeholder="e.g. Apex Floors LLP"
                                />
                              </div>
                            </div>

                            <div className="vize-account-field">
                              <label htmlFor="signup-gstin">GSTIN (for B2B Tax Credit)</label>
                              <div className="vize-account-input-wrap">
                                <FileText size={16} className="vize-account-input-icon" />
                                <input
                                  id="signup-gstin"
                                  type="text"
                                  value={signupGstin}
                                  onChange={(e) => setSignupGstin(e.target.value)}
                                  placeholder="22AAAAA0000A1Z5"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="vize-account-field">
                          <label htmlFor="signup-password">Create Password</label>
                          <div className="vize-account-input-wrap">
                            <Lock size={16} className="vize-account-input-icon" />
                            <input
                              id="signup-password"
                              type="password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                            />
                          </div>
                        </div>

                        <button type="submit" className="vize-account-primary-btn">
                          <span>Create Account & Claim Pro Benefits</span>
                          <ArrowRight size={17} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                /* ===================================================================
                   LOGGED-IN VIEW: CLIENT DASHBOARD & ORDERS
                   =================================================================== */
                <div className="vize-account-dashboard">
                  {/* User Profile Card Banner */}
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
                            {user.role || 'Verified Customer'}
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
                      title="Log Out of VIZE"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>

                  {/* Dashboard Nav Tabs */}
                  <div className="vize-account-dash-tabs">
                    <button
                      type="button"
                      className={`vize-account-dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('profile');
                        setSelectedOrder(null);
                      }}
                    >
                      <User size={15} />
                      <span>Overview & Tier</span>
                    </button>
                    <button
                      type="button"
                      className={`vize-account-dash-tab ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('orders');
                        setSelectedOrder(null);
                      }}
                    >
                      <Package size={15} />
                      <span>My Orders ({orders.length})</span>
                    </button>
                    <button
                      type="button"
                      className={`vize-account-dash-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('addresses');
                        setSelectedOrder(null);
                      }}
                    >
                      <MapPin size={15} />
                      <span>Saved Addresses ({savedAddresses.length})</span>
                    </button>
                    <button
                      type="button"
                      className={`vize-account-dash-tab ${activeTab === 'pro' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('pro');
                        setSelectedOrder(null);
                      }}
                    >
                      <Award size={15} />
                      <span>Trade Desk & Tech Hotline</span>
                    </button>
                  </div>

                  {/* Tab 1: Profile & Tier Overview */}
                  {activeTab === 'profile' && (
                    <div className="vize-account-tab-content">
                      <div className="vize-account-stats-grid">
                        <div className="vize-account-stat-card">
                          <span className="stat-label">ACCOUNT STATUS</span>
                          <span className="stat-value highlight">{user.tier || 'Trade Tier 1'}</span>
                          <span className="stat-sub">15% Automatic Pro Discount applied at checkout</span>
                        </div>
                        <div className="vize-account-stat-card">
                          <span className="stat-label">VIZE REWARDS</span>
                          <span className="stat-value">{user.points || 1200} pts</span>
                          <span className="stat-sub">Redeemable on all Resin Kits & Swatches</span>
                        </div>
                        <div className="vize-account-stat-card">
                          <span className="stat-label">TOTAL ORDERS</span>
                          <span className="stat-value">{orders.length}</span>
                          <span className="stat-sub">Latest: #{orders[0]?.id} ({orders[0]?.status})</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="vize-account-quick-links-box">
                        <div className="vize-account-quick-link-item" onClick={() => setActiveTab('orders')}>
                          <div className="link-icon-wrap">
                            <Truck size={18} />
                          </div>
                          <div className="link-text">
                            <h5>Track Current Shipments</h5>
                            <p>Check live BlueDart/Delhivery dispatch status for pending deliveries</p>
                          </div>
                          <ChevronRight size={18} className="chevron" />
                        </div>

                        <div className="vize-account-quick-link-item" onClick={() => setActiveTab('pro')}>
                          <div className="link-icon-wrap pro">
                            <Headphones size={18} />
                          </div>
                          <div className="link-text">
                            <h5>Consult Senior Polymer Engineer</h5>
                            <p>Direct priority WhatsApp line for mix ratios, pot life & substrate advice</p>
                          </div>
                          <ChevronRight size={18} className="chevron" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Orders & Tracking */}
                  {activeTab === 'orders' && (
                    <div className="vize-account-tab-content">
                      {selectedOrder ? (
                        /* Order Detail View */
                        <div className="vize-account-order-detail">
                          <button
                            type="button"
                            className="vize-account-back-btn"
                            onClick={() => setSelectedOrder(null)}
                          >
                            &larr; Back to all orders
                          </button>

                          <div className="vize-order-detail-card">
                            <div className="order-detail-top">
                              <div>
                                <span className="order-number">Order #{selectedOrder.id}</span>
                                <p className="order-date">Placed on {selectedOrder.date}</p>
                              </div>
                              <span className={`order-status-badge ${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                                {selectedOrder.status}
                              </span>
                            </div>

                            {/* Tracking Progress Bar */}
                            <div className="vize-tracking-stepper">
                              {[
                                { step: 1, label: 'Order Confirmed' },
                                { step: 2, label: 'Lab Formulated & Packed' },
                                { step: 3, label: 'In Transit' },
                                { step: 4, label: 'Delivered' }
                              ].map((s) => (
                                <div
                                  key={s.step}
                                  className={`tracking-step ${selectedOrder.statusStep >= s.step ? 'completed' : ''} ${selectedOrder.statusStep === s.step ? 'current' : ''}`}
                                >
                                  <div className="step-circle">
                                    {selectedOrder.statusStep >= s.step ? <CheckCircle2 size={14} /> : s.step}
                                  </div>
                                  <span className="step-label">{s.label}</span>
                                </div>
                              ))}
                            </div>

                            <div className="order-carrier-info">
                              <Truck size={16} />
                              <span>{selectedOrder.carrier} &bull; Expected Delivery: <strong>{selectedOrder.estimatedDelivery}</strong></span>
                            </div>

                            {/* Items List */}
                            <div className="order-items-table">
                              <h5>Items in this shipment</h5>
                              {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                  <img src={item.image} alt={item.name} className="item-thumb" />
                                  <div className="item-info">
                                    <h6>{item.name}</h6>
                                    <span className="item-variant">{item.size} &bull; {item.color}</span>
                                    <span className="item-qty">Qty: {item.qty}</span>
                                  </div>
                                  <span className="item-price">{item.price}</span>
                                </div>
                              ))}
                            </div>

                            <div className="order-footer-row">
                              <div>
                                <span className="total-label">Total Amount Paid</span>
                                <span className="total-val">{selectedOrder.total}</span>
                              </div>
                              <button
                                type="button"
                                className="vize-account-download-btn"
                                onClick={() => alert(`Tax invoice for Order #${selectedOrder.id} generated with GSTIN input credit breakdown.`)}
                              >
                                <FileText size={15} />
                                <span>Download Tax Invoice (PDF)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Orders List */
                        <div className="vize-account-orders-list">
                          {orders.map((ord) => (
                            <div
                              key={ord.id}
                              className="vize-account-order-card"
                              onClick={() => setSelectedOrder(ord)}
                            >
                              <div className="order-card-header">
                                <div>
                                  <span className="order-id">Order #{ord.id}</span>
                                  <span className="order-date">{ord.date}</span>
                                </div>
                                <span className={`order-badge ${ord.status.toLowerCase().replace(' ', '-')}`}>
                                  {ord.status}
                                </span>
                              </div>

                              <div className="order-card-items-preview">
                                {ord.items.map((item, i) => (
                                  <div key={i} className="mini-item-preview">
                                    <img src={item.image} alt={item.name} />
                                    <span>{item.name} ({item.size})</span>
                                  </div>
                                ))}
                              </div>

                              <div className="order-card-footer">
                                <div>
                                  <span className="order-total-label">Total</span>
                                  <span className="order-total-val">{ord.total}</span>
                                </div>
                                <button type="button" className="order-view-btn">
                                  <span>View Tracking & Invoice</span>
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Saved Addresses */}
                  {activeTab === 'addresses' && (
                    <div className="vize-account-tab-content">
                      <div className="vize-account-addresses-grid">
                        {savedAddresses.map((addr) => (
                          <div key={addr.id} className="vize-account-address-card">
                            <div className="address-card-top">
                              <span className="address-tag-pill">
                                <MapPin size={13} /> {addr.tag}
                              </span>
                              {addr.isDefault && <span className="default-pill">DEFAULT</span>}
                            </div>
                            <h5 className="address-name">{addr.fullName}</h5>
                            <p className="address-line">{addr.addressLine1}</p>
                            <p className="address-line">{addr.addressLine2}</p>
                            <p className="address-city">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="address-phone"><Phone size={13} /> {addr.phone}</p>
                            {addr.gstin && (
                              <p className="address-gstin"><FileText size={13} /> GSTIN: {addr.gstin}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="vize-account-add-address-btn"
                        onClick={() => alert('Add Address dialog: Enter site location and contractor delivery instructions.')}
                      >
                        + Add New Site / Workshop Delivery Address
                      </button>
                    </div>
                  )}

                  {/* Tab 4: Pro Contractor Hotline */}
                  {activeTab === 'pro' && (
                    <div className="vize-account-tab-content">
                      <div className="vize-account-pro-desk-card">
                        <div className="pro-desk-badge">
                          <ShieldCheck size={18} />
                          <span>DEDICATED POLYMER TECHNICAL HOTLINE</span>
                        </div>
                        <h4>Vize Technical & Formulation Support</h4>
                        <p>
                          As a registered partner, you get direct access to our laboratory engineers
                          for epoxy curing ratios, moisture mitigation, custom RAL pigment matching, and on-site guidance.
                        </p>

                        <div className="pro-hotline-contacts">
                          <div className="hotline-contact-row">
                            <Phone size={16} />
                            <div>
                              <strong>Technical Lab Desk</strong>
                              <span>+91 98110 00000 (Mon - Sat, 9am - 7pm)</span>
                            </div>
                          </div>
                          <div className="hotline-contact-row">
                            <Mail size={16} />
                            <div>
                              <strong>Architectural Specs & B2B Inquiries</strong>
                              <span>projects@vizeresin.com</span>
                            </div>
                          </div>
                        </div>

                        <div className="pro-desk-actions">
                          <a
                            href="https://wa.me/919811000000?text=Hello%20VIZE%20Technical%20Team%2C%20I%20need%20assistance%20with%20my%20order%20and%20application"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vize-account-whatsapp-btn"
                          >
                            <span>WhatsApp Senior Polymer Chemist</span>
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
