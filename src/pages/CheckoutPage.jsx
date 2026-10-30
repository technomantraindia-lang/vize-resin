import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Building2,
  FileText,
  Phone,
  Mail,
  User,
  CreditCard,
  QrCode,
  Landmark,
  BadgePercent,
  Sparkles,
  Printer,
  ShoppingBag
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchFromApi } from '../utils/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, grandTotal, subtotal, discountAmount, shippingCost, clearCart } = useCart();
  const { user, isLoggedIn, savedAddresses, addSavedAddress, addOrder, openAccountModal } = useAuth();

  // Contact State (auto-filled for logged-in user)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');

  // Selected saved address ID (or 'new' for adding new address)
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  // New Address Form Fields
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [sitePhone, setSitePhone] = useState('');
  const [addressTag, setAddressTag] = useState('Workshop & Studio');
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);

  // Payment Method: 'online' | 'bank_wire' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill user details when user is logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      setGstin(user.gstin || '');
      if (!sitePhone && user.phone) {
        setSitePhone(user.phone);
      }
    }
  }, [user]);

  // Set initial selected address if user has saved addresses
  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else {
      setSelectedAddressId('new');
    }
  }, [savedAddresses]);

  // Handle Form Submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0 && !orderSuccessData) {
      setErrorMessage('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full customer name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address for invoice and tracking.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a contact phone number for dispatch verification.');
      return;
    }

    // Determine shipping address payload
    let activeShippingAddress = null;

    if (selectedAddressId !== 'new' && savedAddresses && savedAddresses.length > 0) {
      const existing = savedAddresses.find((a) => String(a.id) === String(selectedAddressId));
      if (existing) {
        activeShippingAddress = {
          fullName: existing.fullName || fullName,
          phone: existing.phone || phone,
          addressLine1: existing.addressLine1 || '',
          addressLine2: existing.addressLine2 || '',
          city: existing.city || '',
          state: existing.state || '',
          pincode: existing.pincode || '',
          tag: existing.tag || 'Saved Address',
        };
      }
    }

    if (!activeShippingAddress) {
      // Validate new address fields
      if (!addressLine1.trim()) {
        setErrorMessage('Please provide your street or site address.');
        return;
      }
      if (!city.trim()) {
        setErrorMessage('Please provide your delivery city.');
        return;
      }
      if (!pincode.trim() || pincode.replace(/\D/g, '').length < 6) {
        setErrorMessage('Please provide a valid 6-digit postal PIN code.');
        return;
      }

      activeShippingAddress = {
        fullName: fullName.trim(),
        phone: sitePhone.trim() || phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state,
        pincode: pincode.trim(),
        tag: addressTag.trim() || 'Workshop / Delivery Site',
        save_to_account: saveAddressToAccount,
      };
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_id: user?.db_id || (user?.id && !isNaN(Number(user.id)) ? Number(user.id) : null),
        customer_email: email.trim(),
        customer_name: fullName.trim(),
        phone: phone.trim(),
        company: company.trim(),
        gstin: gstin.trim(),
        payment_method: paymentMethod,
        order_notes: orderNotes.trim(),
        shipping_address: activeShippingAddress,
        items: cartItems.map((it) => ({
          name: it.name + (it.size?.label ? ` - ${it.size.label}` : '') + (it.color?.name ? ` (${it.color.name})` : ''),
          quantity: it.quantity,
          price: it.price,
          total: it.price * it.quantity,
        })),
        subtotal: subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        grand_total: grandTotal,
      };

      const res = await fetchFromApi('/api/vize/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        // If address was saved and returned, automatically add to user's saved addresses
        if (res.saved_address && isLoggedIn) {
          addSavedAddress(res.saved_address);
        } else if (isLoggedIn && selectedAddressId === 'new') {
          addSavedAddress({
            id: 'addr-' + Date.now(),
            tag: activeShippingAddress.tag,
            isDefault: savedAddresses.length === 0,
            fullName: activeShippingAddress.fullName,
            phone: activeShippingAddress.phone,
            addressLine1: activeShippingAddress.addressLine1 + (activeShippingAddress.addressLine2 ? ', ' + activeShippingAddress.addressLine2 : ''),
            city: activeShippingAddress.city,
            state: activeShippingAddress.state,
            pincode: activeShippingAddress.pincode,
            gstin: gstin.trim(),
            company: company.trim(),
          });
        }

        // Add newly created order to user's order history
        const newOrderRecord = {
          id: res.increment_id || ('VZ-' + Math.floor(10000 + Math.random() * 90000)),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          statusStep: 1,
          estimatedDelivery: res.estimated_delivery || '4-5 Business Days',
          carrier: res.carrier || 'BlueDart Express / V-Trans Surface Cargo',
          total: `₹${Number(grandTotal).toLocaleString('en-IN')}`,
          itemCount: cartItems.length,
          items: cartItems.map((item) => ({
            name: item.name,
            size: item.size?.label || 'Standard Pack',
            color: item.color?.name || 'Standard Clear',
            qty: item.quantity,
            price: `₹${Number(item.price).toLocaleString('en-IN')}`,
            image: item.image || '/bucket.png',
          })),
          shippingAddress: activeShippingAddress,
        };
        addOrder(newOrderRecord);

        // Clear shopping cart
        clearCart();

        // Show confirmation view
        setOrderSuccessData({
          orderId: res.increment_id || newOrderRecord.id,
          grandTotal: grandTotal,
          carrier: res.carrier,
          estimatedDelivery: res.estimated_delivery,
          shippingAddress: activeShippingAddress,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          itemCount: cartItems.length,
          paymentMethod: paymentMethod,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('Could not connect to dispatch server. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // VIEW: ORDER COMPLETED SUCCESS VIEW
  // =========================================================================
  if (orderSuccessData) {
    return (
      <div className="vize-page-wrapper vize-checkout-page">
        <Header />
        <main className="vize-checkout-success-container">
          <div className="vize-checkout-success-card">
            {/* Top Badge & Checkmark */}
            <div className="vize-checkout-success-icon-box">
              <CheckCircle2 size={46} strokeWidth={2.5} />
            </div>

            <span className="vize-checkout-success-badge">
              Order Dispatched to Fulfillment Queue
            </span>

            <h1 className="vize-checkout-success-title">
              Thank You! Your Order is Confirmed
            </h1>
            <p className="vize-checkout-success-desc">
              Order <strong style={{ color: '#0D2C33', fontFamily: 'monospace' }}>#{orderSuccessData.orderId}</strong> has been assigned to our central Pune chemical warehouse for tamper-proof packaging and dispatch.
            </p>

            {/* Quick Status Cards */}
            <div className="vize-checkout-stats-grid">
              <div className="vize-checkout-stat-card">
                <span className="vize-checkout-stat-label">Total Paid</span>
                <span className="vize-checkout-stat-value">
                  ₹{Number(orderSuccessData.grandTotal).toLocaleString('en-IN')}
                </span>
                <span className="vize-checkout-stat-sub">✓ 18% GST Tax Invoice Included</span>
              </div>

              <div className="vize-checkout-stat-card">
                <span className="vize-checkout-stat-label">Estimated Delivery</span>
                <span className="vize-checkout-stat-value" style={{ fontSize: '1.05rem' }}>
                  {orderSuccessData.estimatedDelivery || '3-4 Business Days'}
                </span>
                <span className="vize-checkout-stat-sub" style={{ color: '#4A5568', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={13} style={{ color: '#8C4830' }} /> Express Freight Cargo
                </span>
              </div>

              <div className="vize-checkout-stat-card">
                <span className="vize-checkout-stat-label">Delivery Destination</span>
                <span className="vize-checkout-stat-value" style={{ fontSize: '0.95rem' }}>
                  {orderSuccessData.shippingAddress.city}, {orderSuccessData.shippingAddress.state}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginTop: '3px' }}>
                  PIN: {orderSuccessData.shippingAddress.pincode}
                </span>
              </div>
            </div>

            {/* Address Auto-Saved Notification */}
            {isLoggedIn && (
              <div className="vize-checkout-auto-saved-box">
                <MapPin size={20} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Delivery Address Saved to Account:</strong> This delivery destination has been automatically stored in your <strong style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => openAccountModal('addresses')}>Saved Addresses</strong> in the Client Portal for rapid 1-click reorders.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="vize-checkout-actions-row">
              <button
                type="button"
                onClick={() => openAccountModal('orders')}
                className="vize-checkout-btn-primary"
              >
                <User size={16} />
                <span>Track in Client Portal & My Orders</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="vize-checkout-btn-secondary"
              >
                <Printer size={16} />
                <span>Print Tax Invoice Proforma</span>
              </button>

              <Link
                to="/"
                className="vize-checkout-btn-terracotta"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // =========================================================================
  // VIEW: CHECKOUT FORM
  // =========================================================================
  return (
    <div className="vize-page-wrapper vize-checkout-page">
      <Header />

      <main className="vize-checkout-container">
        {/* Breadcrumb Navigation */}
        <nav className="vize-checkout-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/cart">Shopping Cart</Link>
          <span>/</span>
          <span className="active">Secure Checkout</span>
        </nav>

        {/* Page Title */}
        <div className="vize-checkout-title-wrap">
          <div className="vize-checkout-title-row">
            <h1 className="vize-checkout-title">
              Secure Checkout & Delivery Dispatch
            </h1>
            <span className="vize-checkout-ssl-badge">
              <Lock size={12} /> 256-Bit SSL
            </span>
          </div>
          <p className="vize-checkout-subtitle">
            Specify job-site delivery destination, tax credit invoicing, and carrier logistics.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="vize-checkout-error-banner">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="vize-checkout-layout">
            
            {/* LEFT COLUMN: Checkout Sections */}
            <div className="vize-checkout-main-col">

              {/* 1. Account / Contact Information */}
              <div className="vize-checkout-card">
                <div className="vize-checkout-card-header">
                  <div className="vize-checkout-step-title">
                    <span className="vize-checkout-step-num">1</span>
                    <h2 className="vize-checkout-card-title">Customer Contact & Account</h2>
                  </div>

                  {isLoggedIn ? (
                    <span className="vize-checkout-user-badge">
                      ✓ Logged in as {user?.name}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAccountModal('login')}
                      className="vize-checkout-login-link"
                    >
                      Already have an account? Sign In ↗
                    </button>
                  )}
                </div>

                <div className="vize-checkout-row">
                  <div className="vize-checkout-field">
                    <label>Full Name *</label>
                    <div className="vize-checkout-input-wrap">
                      <User size={16} className="vize-checkout-input-icon" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Vivek Patel"
                        className="vize-checkout-input"
                      />
                    </div>
                  </div>

                  <div className="vize-checkout-field">
                    <label>Email Address (For Tax Invoices & AWB) *</label>
                    <div className="vize-checkout-input-wrap">
                      <Mail size={16} className="vize-checkout-input-icon" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. vivek.patel@company.com"
                        className="vize-checkout-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="vize-checkout-row full">
                  <div className="vize-checkout-field">
                    <label>Primary Phone (1-Click WhatsApp Updates) *</label>
                    <div className="vize-checkout-input-wrap">
                      <Phone size={16} className="vize-checkout-input-icon" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 96541 25784"
                        className="vize-checkout-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery & Job-Site Address */}
              <div className="vize-checkout-card">
                <div className="vize-checkout-card-header">
                  <div className="vize-checkout-step-title">
                    <span className="vize-checkout-step-num">2</span>
                    <h2 className="vize-checkout-card-title">Delivery Site / Workshop Location</h2>
                  </div>
                  <span className="vize-checkout-step-meta">Pan-India Express Freight</span>
                </div>

                {/* Option A: Saved Addresses Selection for Logged-In User */}
                {isLoggedIn && savedAddresses && savedAddresses.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4A5568', marginBottom: '0.6rem' }}>
                      Choose from Your Saved Delivery Locations:
                    </label>
                    <div className="vize-checkout-addr-grid">
                      {savedAddresses.map((addr) => {
                        const isSelected = String(selectedAddressId) === String(addr.id);
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`vize-checkout-addr-card ${isSelected ? 'selected' : ''}`}
                          >
                            <div className="vize-checkout-addr-header">
                              <span className="vize-checkout-addr-tag">
                                <MapPin size={12} /> {addr.tag || 'Workshop'}
                              </span>
                              {addr.isDefault && (
                                <span className="vize-checkout-addr-default-pill">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <div className="vize-checkout-addr-name">{addr.fullName}</div>
                            <div className="vize-checkout-addr-line">
                              {addr.addressLine1}
                            </div>
                            <div className="vize-checkout-addr-city">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </div>
                            <div className="vize-checkout-addr-phone">
                              <Phone size={10} /> {addr.phone}
                            </div>
                          </div>
                        );
                      })}

                      {/* Custom / New Address Radio Option */}
                      <div
                        onClick={() => setSelectedAddressId('new')}
                        className={`vize-checkout-addr-new-btn ${selectedAddressId === 'new' ? 'selected' : ''}`}
                      >
                        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0D2C33', lineHeight: 1 }}>+</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D2C33', marginTop: '4px' }}>Ship to a New / Project Site</span>
                        <span style={{ fontSize: '0.72rem', color: '#718096', marginTop: '2px' }}>Enter a new delivery address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Option B: Address Form (Shown if no saved address or 'new' selected) */}
                {(selectedAddressId === 'new' || !savedAddresses || savedAddresses.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.25rem' }}>
                    {isLoggedIn && savedAddresses.length === 0 && (
                      <div style={{ padding: '0.75rem 1rem', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', fontSize: '0.82rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} style={{ color: '#D97706', flexShrink: 0 }} />
                        <span>
                          <strong>First Delivery:</strong> Enter your address below — it will be <strong>automatically saved to your account</strong> for future orders!
                        </span>
                      </div>
                    )}

                    <div className="vize-checkout-field">
                      <label>Street Address / Industrial Shed / Workshop No. *</label>
                      <input
                        type="text"
                        required={selectedAddressId === 'new'}
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. Shed 18, GIDC Industrial Estate Phase 3"
                        className="vize-checkout-input"
                      />
                    </div>

                    <div className="vize-checkout-field">
                      <label>Area / Landmark / Building (Optional)</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="e.g. Near Express Highway Toll / Behind Power Substation"
                        className="vize-checkout-input"
                      />
                    </div>

                    <div className="vize-checkout-row tri">
                      <div className="vize-checkout-field">
                        <label>City *</label>
                        <input
                          type="text"
                          required={selectedAddressId === 'new'}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Vadodara"
                          className="vize-checkout-input"
                        />
                      </div>

                      <div className="vize-checkout-field">
                        <label>State *</label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="vize-checkout-select"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="vize-checkout-field">
                        <label>PIN Code *</label>
                        <input
                          type="text"
                          required={selectedAddressId === 'new'}
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 390010"
                          className="vize-checkout-input"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                    <div className="vize-checkout-row">
                      <div className="vize-checkout-field">
                        <label>Site Supervisor / Receiving Phone</label>
                        <input
                          type="text"
                          value={sitePhone}
                          onChange={(e) => setSitePhone(e.target.value)}
                          placeholder="e.g. +91 96541 25784"
                          className="vize-checkout-input"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>

                      <div className="vize-checkout-field">
                        <label>Address Tag / Label</label>
                        <input
                          type="text"
                          value={addressTag}
                          onChange={(e) => setAddressTag(e.target.value)}
                          placeholder="e.g. Studio Workshop / Project Site 1"
                          className="vize-checkout-input"
                        />
                      </div>
                    </div>

                    {isLoggedIn && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingTop: '4px' }}>
                        <input
                          type="checkbox"
                          checked={saveAddressToAccount}
                          onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#0D2C33' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0D2C33' }}>
                          Save this delivery address to my account for 1-click future orders
                        </span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* 3. B2B Commercial & Tax Credit Invoicing */}
              <div className="vize-checkout-card">
                <div className="vize-checkout-card-header">
                  <div className="vize-checkout-step-title">
                    <span className="vize-checkout-step-num">3</span>
                    <div>
                      <h2 className="vize-checkout-card-title">B2B Tax Credit & Commercial Billing</h2>
                    </div>
                  </div>
                  <span className="vize-checkout-step-meta">Optional for GST Registered Entities</span>
                </div>

                <div className="vize-checkout-row">
                  <div className="vize-checkout-field">
                    <label>Company / Studio / Firm Name</label>
                    <div className="vize-checkout-input-wrap">
                      <Building2 size={16} className="vize-checkout-input-icon" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. ESTN Coatings & Polymer Solutions"
                        className="vize-checkout-input"
                      />
                    </div>
                  </div>

                  <div className="vize-checkout-field">
                    <label>GSTIN (For 18% Input Tax Credit)</label>
                    <div className="vize-checkout-input-wrap">
                      <FileText size={16} className="vize-checkout-input-icon" />
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 24AAACE1234F1Z8"
                        className="vize-checkout-input"
                        style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Payment Method Selection */}
              <div className="vize-checkout-card">
                <div className="vize-checkout-card-header">
                  <div className="vize-checkout-step-title">
                    <span className="vize-checkout-step-num">4</span>
                    <h2 className="vize-checkout-card-title">Payment & Dispatch Settlement</h2>
                  </div>
                  <span className="vize-checkout-step-meta">Safe & Encrypted</span>
                </div>

                <div className="vize-checkout-pay-list">
                  {/* Option 1: Instant UPI & Cards */}
                  <label
                    className={`vize-checkout-pay-card ${paymentMethod === 'online' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="vize-checkout-pay-radio"
                    />
                    <div className="vize-checkout-pay-body">
                      <div className="vize-checkout-pay-title-row">
                        <span className="vize-checkout-pay-title">
                          <QrCode size={18} style={{ color: '#8C4830' }} />
                          <span>Instant UPI (GPay, PhonePe, Paytm) & Cards / NetBanking</span>
                        </span>
                        <span className="vize-checkout-pay-badge">FASTEST</span>
                      </div>
                      <p className="vize-checkout-pay-desc">
                        Instant automated payment verification for priority same-day pallet dispatch.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Advance RTGS / NEFT */}
                  <label
                    className={`vize-checkout-pay-card ${paymentMethod === 'bank_wire' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_wire"
                      checked={paymentMethod === 'bank_wire'}
                      onChange={() => setPaymentMethod('bank_wire')}
                      className="vize-checkout-pay-radio"
                    />
                    <div className="vize-checkout-pay-body">
                      <div className="vize-checkout-pay-title-row">
                        <span className="vize-checkout-pay-title">
                          <Landmark size={18} style={{ color: '#8C4830' }} />
                          <span>Advance RTGS / NEFT (Direct to VIZE Chemicals Bank Account)</span>
                        </span>
                      </div>
                      <p className="vize-checkout-pay-desc">
                        Proforma invoice generated instantly. Dispatch initiated upon UTR confirmation.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: COD / Pay on Dispatch */}
                  <label
                    className={`vize-checkout-pay-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="vize-checkout-pay-radio"
                    />
                    <div className="vize-checkout-pay-body">
                      <div className="vize-checkout-pay-title-row">
                        <span className="vize-checkout-pay-title">
                          <CreditCard size={18} style={{ color: '#8C4830' }} />
                          <span>Pay on Dispatch / Verified Commercial Trade Credit</span>
                        </span>
                      </div>
                      <p className="vize-checkout-pay-desc">
                        For verified contractors & applicators. A dedicated polymer specialist will call within 30 mins.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Placement */}
            <div>
              <div className="vize-checkout-summary-card">
                <div className="vize-checkout-summary-header">
                  <h3 className="vize-checkout-summary-title">Order Items ({cartItems.length})</h3>
                  <Link to="/cart" style={{ fontSize: '0.8rem', color: '#8C4830', fontWeight: 700, textDecoration: 'none' }}>
                    Edit Cart
                  </Link>
                </div>

                {/* Items List */}
                <div className="vize-checkout-items-scroll">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="vize-checkout-item-row">
                      <img
                        src={item.image || '/bucket.png'}
                        alt={item.name}
                        className="vize-checkout-item-thumb"
                      />
                      <div className="vize-checkout-item-details">
                        <div className="vize-checkout-item-name">{item.name}</div>
                        <div className="vize-checkout-item-meta">
                          {item.size?.label || 'Standard Pack'} &bull; Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="vize-checkout-item-price">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="vize-checkout-calc-block">
                  <div className="vize-checkout-calc-row">
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 700, color: '#0D2C33' }}>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="vize-checkout-calc-row" style={{ color: '#059669', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BadgePercent size={14} /> 15% Partner Trade Discount
                      </span>
                      <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="vize-checkout-calc-row">
                    <span>Pan-India Surface Freight</span>
                    <span style={{ fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      FREE
                    </span>
                  </div>

                  <div className="vize-checkout-calc-row" style={{ color: '#718096' }}>
                    <span>Estimated GST (18% inclusive)</span>
                    <span style={{ fontFamily: 'monospace' }}>₹{Math.round((grandTotal * 18) / 118).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="vize-checkout-calc-row total-row">
                    <span className="vize-checkout-total-label">Grand Total</span>
                    <div style={{ textAlign: 'right' }}>
                      <div className="vize-checkout-total-val">
                        ₹{Number(grandTotal).toLocaleString('en-IN')}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#718096' }}>Includes GST & Express Freight</span>
                    </div>
                  </div>
                </div>

                {/* Submit Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="vize-checkout-submit-btn"
                >
                  <Lock size={16} />
                  <span>
                    {isSubmitting
                      ? 'Dispatching Order to Warehouse...'
                      : `Place Order & Dispatch Request (₹${Number(grandTotal).toLocaleString('en-IN')})`}
                  </span>
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>

                {/* Trust Badges */}
                <div className="vize-checkout-trust-list">
                  <div className="vize-checkout-trust-row">
                    <ShieldCheck size={14} style={{ color: '#059669', flexShrink: 0 }} />
                    <span>100% Authentic Polymer Formulation Guarantee</span>
                  </div>
                  <div className="vize-checkout-trust-row">
                    <Truck size={14} style={{ color: '#0D2C33', flexShrink: 0 }} />
                    <span>Dispatched in UN-certified tamper-proof drums & pails</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
