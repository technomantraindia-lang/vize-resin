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
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [sandboxPendingTx, setSandboxPendingTx] = useState(null);
  const [activeSandboxModal, setActiveSandboxModal] = useState(null);

  // Delhivery Logistics Live Pincode State
  const [delhiveryCheck, setDelhiveryCheck] = useState(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Helper: Complete Sandbox Simulation in Test Mode
  const simulateSandboxSuccess = async (txnId) => {
    setIsVerifyingPayment(true);
    setErrorMessage('');
    try {
      const res = await fetchFromApi(`/api/vize/payment/phonepe/status/${txnId}?simulate=1`);
      if (res && res.success && res.payment_status === 'PAID') {
        clearCart();
        const pendingStr = sessionStorage.getItem('vize_pending_order');
        const pending = pendingStr ? JSON.parse(pendingStr) : {};
        sessionStorage.removeItem('vize_pending_order');

        const confirmedOrder = {
          orderId: res.increment_id,
          grandTotal: res.grand_total,
          carrier: res.carrier || 'Delhivery Surface Express',
          delhiveryAwb: res.delhivery_awb,
          delhiveryTrackUrl: res.delhivery_track_url,
          estimatedDelivery: res.estimated_delivery,
          shippingAddress: res.shipping_address || pending.shippingAddress || {},
          customerName: pending.customerName || 'Valued Customer',
          customerEmail: pending.customerEmail || '',
          customerPhone: pending.customerPhone || '',
          itemCount: pending.itemCount || 1,
          paymentMethod: 'PhonePe UPI & Cards (Sandbox Verified)',
          phonepeTxnId: res.phonepe_txn_id,
        };

        addOrder({
          id: res.increment_id,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          statusStep: 1,
          estimatedDelivery: res.estimated_delivery || '3-4 Business Days',
          carrier: res.carrier || 'Delhivery Surface Express',
          delhiveryAwb: res.delhivery_awb,
          total: `₹${Number(res.grand_total).toLocaleString('en-IN')}`,
          itemCount: pending.itemCount || 1,
          items: pending.items || [],
          shippingAddress: res.shipping_address || pending.shippingAddress || {},
        });

        setOrderSuccessData(confirmedOrder);
        setSandboxPendingTx(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(res?.message || 'Payment simulation failed.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Payment simulation error.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Handle Return from PhonePe Gateway (phonepe_status=check&txId=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('phonepe_status');
    const txId = params.get('txId');

    if (statusParam === 'check' && txId) {
      setIsVerifyingPayment(true);
      const verifyPayment = async () => {
        try {
          const res = await fetchFromApi(`/api/vize/payment/phonepe/status/${txId}`);
          if (res && res.success && res.payment_status === 'PAID') {
            clearCart();
            const pendingStr = sessionStorage.getItem('vize_pending_order');
            const pending = pendingStr ? JSON.parse(pendingStr) : {};
            sessionStorage.removeItem('vize_pending_order');

            const confirmedOrder = {
              orderId: res.increment_id,
              grandTotal: res.grand_total,
              carrier: res.carrier || 'Delhivery Surface Express',
              delhiveryAwb: res.delhivery_awb,
              delhiveryTrackUrl: res.delhivery_track_url,
              estimatedDelivery: res.estimated_delivery,
              shippingAddress: res.shipping_address || pending.shippingAddress || {},
              customerName: pending.customerName || 'Valued Customer',
              customerEmail: pending.customerEmail || '',
              customerPhone: pending.customerPhone || '',
              itemCount: pending.itemCount || 1,
              paymentMethod: 'PhonePe UPI & Cards (Verified)',
              phonepeTxnId: res.phonepe_txn_id,
            };

            addOrder({
              id: res.increment_id,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'Processing',
              statusStep: 1,
              estimatedDelivery: res.estimated_delivery || '3-4 Business Days',
              carrier: res.carrier || 'Delhivery Surface Express',
              delhiveryAwb: res.delhivery_awb,
              total: `₹${Number(res.grand_total).toLocaleString('en-IN')}`,
              itemCount: pending.itemCount || 1,
              items: pending.items || [],
              shippingAddress: res.shipping_address || pending.shippingAddress || {},
            });

            setOrderSuccessData(confirmedOrder);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (res && res.payment_status === 'PENDING' && res.is_sandbox) {
            setSandboxPendingTx(txId);
          } else {
            setErrorMessage(res?.message || 'PhonePe payment was cancelled or could not be completed. Please try again.');
          }
        } catch (e) {
          console.error('Payment verification error:', e);
          setErrorMessage('Could not verify PhonePe payment. If amount was debited, our priority dispatch desk will confirm your order.');
        } finally {
          setIsVerifyingPayment(false);
        }
      };

      verifyPayment();
    }
  }, [location.search]);

  // Live Delhivery Serviceability Check for Pincode
  useEffect(() => {
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      setIsCheckingPincode(true);
      fetchFromApi(`/api/vize/shipping/delhivery/check-pincode?pincode=${cleanPin}`)
        .then((res) => {
          if (res && res.success && res.serviceable) {
            setDelhiveryCheck(res);
            if (res.state && !state) {
              setState(res.state);
            }
          } else {
            setDelhiveryCheck(null);
          }
        })
        .catch(() => setDelhiveryCheck(null))
        .finally(() => setIsCheckingPincode(false));
    } else {
      setDelhiveryCheck(null);
    }
  }, [pincode]);

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

        // If PhonePe payment gateway redirect is required
        if (res.requires_redirect && res.redirect_url) {
          sessionStorage.setItem('vize_pending_order', JSON.stringify({
            orderId: res.increment_id,
            grandTotal: grandTotal,
            carrier: res.carrier || 'Delhivery Surface Express',
            shippingAddress: activeShippingAddress,
            customerName: fullName,
            customerEmail: email,
            customerPhone: phone,
            itemCount: cartItems.length,
            items: cartItems.map((item) => ({
              name: item.name,
              size: item.size?.label || 'Standard Pack',
              color: item.color?.name || 'Standard Clear',
              qty: item.quantity,
              price: `₹${Number(item.price).toLocaleString('en-IN')}`,
              image: item.image || '/bucket.png',
            })),
          }));

          // In developer sandbox test mode, open Interactive Simulator Modal directly
          if (res.is_sandbox) {
            setIsSubmitting(false);
            setActiveSandboxModal({
              txId: res.transaction_id,
              orderId: res.increment_id,
              amount: grandTotal,
              redirectUrl: res.redirect_url,
            });
            return;
          }

          // In live production, redirect directly to PhonePe hosted checkout
          window.location.href = res.redirect_url;
          return;
        }

        // Add newly created order to user's order history
        const newOrderRecord = {
          id: res.increment_id || ('VZ-' + Math.floor(10000 + Math.random() * 90000)),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          statusStep: 1,
          estimatedDelivery: res.estimated_delivery || '4-5 Business Days',
          carrier: res.carrier || 'Delhivery Surface Express / V-Trans Cargo',
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
          carrier: res.carrier || 'Delhivery Surface Express / V-Trans Cargo',
          estimatedDelivery: res.estimated_delivery,
          shippingAddress: activeShippingAddress,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          itemCount: cartItems.length,
          paymentMethod: paymentMethod === 'online' ? 'PhonePe UPI & Cards' : paymentMethod,
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
  // VIEW: PHONEPE VERIFYING PAYMENT LOADER
  // =========================================================================
  if (isVerifyingPayment) {
    return (
      <div className="vize-page-wrapper vize-checkout-page">
        <Header />
        <main className="vize-checkout-success-container">
          <div className="vize-checkout-success-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div
              style={{
                width: 50,
                height: 50,
                border: '4px solid #E2E8F0',
                borderTopColor: '#5F259F',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'vize-spin 0.8s linear infinite'
              }}
            />
            <h2 style={{ color: '#0D2C33', fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Verifying PhonePe Payment...
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: 460, margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
              Please do not reload, refresh, or hit the back button. We are securely validating your transaction with the PhonePe banking network.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#5F259F', fontWeight: 600, background: '#F5F3FF', padding: '0.4rem 0.9rem', borderRadius: '20px' }}>
              🔒 256-Bit Bank-Grade Encrypted Session
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              Order <strong style={{ color: '#0D2C33', fontFamily: 'monospace' }}>#{orderSuccessData.orderId}</strong> has been assigned to our central chemical warehouse for tamper-proof packaging and dispatch.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', margin: '0.75rem auto 1.5rem' }}>
              {orderSuccessData.phonepeTxnId && (
                <div style={{ padding: '0.6rem 1rem', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#5B21B6' }}>
                  <CheckCircle2 size={16} />
                  <span>PhonePe Ref: <strong style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{orderSuccessData.phonepeTxnId}</strong></span>
                </div>
              )}
              {orderSuccessData.delhiveryAwb && (
                <div style={{ padding: '0.6rem 1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#166534' }}>
                  <Truck size={16} style={{ color: '#16A34A' }} />
                  <span>Delhivery AWB: <strong style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{orderSuccessData.delhiveryAwb}</strong></span>
                  <a
                    href={orderSuccessData.delhiveryTrackUrl || `https://www.delhivery.com/track/package/${orderSuccessData.delhiveryAwb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '6px', color: '#15803D', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Track ↗
                  </a>
                </div>
              )}
            </div>

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

        {/* PhonePe Sandbox Simulation Card */}
        {sandboxPendingTx && (
          <div style={{ margin: '0 0 1.5rem', padding: '1.25rem 1.5rem', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '14px', textAlign: 'left', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.98rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🧪</span> PhonePe Sandbox Test Mode Active
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                DEVELOPER SIMULATOR
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#78350F', margin: '0 0 14px', lineHeight: 1.5 }}>
              Your order transaction <code style={{ background: '#FDE68A', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>{sandboxPendingTx}</code> is pending bank simulation. Because real UPI banking apps do not link to sandbox test merchants, click below to complete the test payment instantly:
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => simulateSandboxSuccess(sandboxPendingTx)}
                disabled={isVerifyingPayment}
                style={{ padding: '9px 20px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)' }}
              >
                {isVerifyingPayment ? 'Verifying...' : '✓ Complete Test Payment & Confirm Order (₹0 Charged)'}
              </button>
              <button
                type="button"
                onClick={() => { setSandboxPendingTx(null); setErrorMessage(''); }}
                style={{ padding: '8px 14px', background: '#fff', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
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
                        {isCheckingPincode && (
                          <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E1' }}></span>
                            <span>Checking Delhivery Surface Express coverage...</span>
                          </div>
                        )}
                        {delhiveryCheck && (
                          <div style={{ marginTop: '6px', padding: '6px 10px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Truck size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
                            <span>
                              <strong>Delhivery Express:</strong> {delhiveryCheck.distribution_hub}, {delhiveryCheck.state} ({delhiveryCheck.estimated_days})
                            </span>
                          </div>
                        )}
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

        {/* Interactive PhonePe Sandbox Simulator Modal */}
        {activeSandboxModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '520px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              {/* Modal Header */}
              <div style={{ background: 'linear-gradient(135deg, #5F259F 0%, #3B1266 100%)', color: '#fff', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.15rem' }}>
                    पे
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.02rem', letterSpacing: '0.3px' }}>PhonePe Payment Gateway</div>
                    <div style={{ fontSize: '0.72rem', color: '#E9D5FF', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }}></span>
                      Developer Sandbox Simulator Active
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSandboxModal(null)}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '1.3rem', cursor: 'pointer', padding: '4px' }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Order Info Card */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#64748B' }}>
                    <span>Order Reference</span>
                    <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>#{activeSandboxModal.orderId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#64748B' }}>
                    <span>Merchant MID</span>
                    <span style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: '0.78rem' }}>PGTESTPAYUAT86</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #CBD5E1', fontSize: '0.95rem', fontWeight: 700 }}>
                    <span style={{ color: '#334155' }}>Total Amount</span>
                    <span style={{ color: '#5F259F', fontSize: '1.15rem' }}>₹{Number(activeSandboxModal.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Select a test simulation option below to verify checkout, automated Delhivery logistics manifest, and customer tax receipt:
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const tx = activeSandboxModal.txId;
                      setActiveSandboxModal(null);
                      simulateSandboxSuccess(tx);
                    }}
                    disabled={isVerifyingPayment}
                    style={{
                      padding: '12px 18px',
                      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>✓ Simulate Payment SUCCESS (Instant ₹0 Test)</span>
                  </button>

                  <a
                    href={activeSandboxModal.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 18px',
                      background: '#F1F5F9',
                      color: '#334155',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Open Official Mercury UAT Page ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSandboxModal(null);
                      setErrorMessage('Simulated payment was cancelled.');
                    }}
                    style={{
                      padding: '8px 18px',
                      background: 'transparent',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Simulate Payment Cancel / Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
