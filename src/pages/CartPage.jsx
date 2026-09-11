import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

// Frequently bought add-on items
const RECOMMENDED_ADDONS = [
  {
    id: 'addon-scale',
    name: 'Precision Digital Mixing Scale (0.1g)',
    category: 'Essential Tool',
    price: 899,
    image: '/bucket.png',
    tag: 'Must Have for Ratio'
  },
  {
    id: 'addon-pigment-pack',
    name: 'Signature Metallic 6-Color Pigment Sampler',
    category: 'Color Pack',
    price: 1250,
    image: '/colors/Petrol Teal.png',
    tag: 'Popular Addon'
  },
  {
    id: 'addon-bubble-torch',
    name: 'Industrial Heat Air Demolding Torch',
    category: 'Application Tool',
    price: 1450,
    image: '/cat-casting.jpg',
    tag: 'Anti-Bubble'
  }
];

export default function CartPage() {
  const {
    cartItems,
    totalItemCount,
    subtotal,
    shippingCost,
    isFreeShipping,
    freeShippingProgress,
    amountNeededForFreeShipping,
    grandTotal,
    estimatedTax,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderNotes,
    setOrderNotes,
    addToCart
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Handle Checkout click
  const handleProceedCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
    }, 1200);
  };

  return (
    <div className="vize-page-wrapper">
      <Header />

      <main className="vize-cart-page-main">
        <div className="vize-cart-page-container">
          
          {/* Breadcrumb Navigation */}
          <nav className="vize-cart-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="vize-crumb-link">Home</Link>
            <span className="vize-crumb-sep">/</span>
            <span className="vize-crumb-current">Shopping Cart</span>
          </nav>

          {/* Page Heading */}
          <div className="vize-cart-page-header">
            <div>
              <h1 className="vize-cart-page-title">
                Shopping Cart
                {totalItemCount > 0 && (
                  <span className="vize-cart-title-badge">
                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
                  </span>
                )}
              </h1>
              <p className="vize-cart-page-subtitle">
                Review your high-performance polymer formulation kits and tooling supplies.
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                className="vize-clear-cart-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to empty your cart?')) {
                    clearCart();
                  }
                }}
              >
                <Trash2 size={15} />
                <span>Clear All Items</span>
              </button>
            )}
          </div>

          {/* If Checkout simulated completed */}
          {checkoutSuccess && (
            <div className="vize-checkout-success-banner">
              <div className="vize-success-icon-box">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="vize-success-title">Order Request Received!</h3>
                <p className="vize-success-desc">
                  Thank you for placing your inquiry. A VIZE Technical Polymer Specialist will contact you within 30 minutes with shipment confirmation and dispatch logistics.
                </p>
              </div>
              <button
                type="button"
                className="vize-success-close-btn"
                onClick={() => {
                  setCheckoutSuccess(false);
                  clearCart();
                }}
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* Cart Empty View */}
          {cartItems.length === 0 ? (
            <div className="vize-cart-page-empty-box">
              <div className="vize-page-empty-icon-wrap">
                <ShoppingBag size={56} strokeWidth={1.3} />
              </div>
              <h2 className="vize-page-empty-title">Your shopping cart is empty</h2>
              <p className="vize-page-empty-text">
                Explore our laboratory-grade epoxy systems, polyaspartic coatings, and signature metallic pigment finishes.
              </p>
              <div className="vize-page-empty-actions">
                <Link to="/resins" className="vize-page-empty-btn primary">
                  <span>Browse Resins & Flooring</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/#finishes" className="vize-page-empty-btn secondary">
                  <span>Explore 18 Color Swatches</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Grid with Items on Left & Summary on Right */
            <div className="vize-cart-layout-grid">
              
              {/* LEFT COLUMN: Cart Items & Extra Options */}
              <div className="vize-cart-items-column">
                
                {/* Free Shipping Banner Card */}
                <div className="vize-page-shipping-card">
                  <div className="vize-page-shipping-top">
                    <div className="vize-page-shipping-icon-circle">
                      <Truck size={18} />
                    </div>
                    <div className="vize-page-shipping-text">
                      {isFreeShipping ? (
                        <p className="vize-page-ship-congrats">
                          🎉 <strong>Complimentary Express Delivery Unlocked!</strong> Pan-India expedited dispatch is free on your order.
                        </p>
                      ) : (
                        <p className="vize-page-ship-prompt">
                          Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more worth of resins or tooling to qualify for <strong>FREE Express Shipping</strong>.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="vize-shipping-track">
                    <div
                      className={`vize-shipping-fill ${isFreeShipping ? 'complete' : ''}`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List Card */}
                <div className="vize-cart-table-card">
                  {/* Table Header (Desktop) */}
                  <div className="vize-cart-table-header">
                    <span className="vize-th-product">Product & Formulation</span>
                    <span className="vize-th-price">Unit Price</span>
                    <span className="vize-th-qty">Quantity</span>
                    <span className="vize-th-total">Total</span>
                    <span className="vize-th-action"></span>
                  </div>

                  {/* Item Rows */}
                  <div className="vize-cart-table-rows">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="vize-cart-table-row">
                        
                        {/* Product Info Col */}
                        <div className="vize-row-product-info">
                          <Link to={`/product/${item.productId}`} className="vize-row-thumb-link">
                            <img src={item.image} alt={item.name} className="vize-row-img" />
                          </Link>
                          
                          <div className="vize-row-meta">
                            <span className="vize-row-cat">{item.category}</span>
                            <h3 className="vize-row-name">
                              <Link to={`/product/${item.productId}`} className="vize-row-name-link">
                                {item.name}
                              </Link>
                            </h3>

                            {/* Badges for Size and Color */}
                            <div className="vize-row-pills">
                              {item.size && (
                                <span className="vize-row-pill size">
                                  <strong>Kit:</strong> {item.size.label}
                                </span>
                              )}
                              {item.color && (
                                <span className="vize-row-pill color">
                                  {item.color.image && (
                                    <img
                                      src={item.color.image}
                                      alt=""
                                      className="vize-row-color-dot"
                                    />
                                  )}
                                  <span>{item.color.name}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Unit Price Col */}
                        <div className="vize-row-unit-price">
                          <span className="vize-mobile-label">Price:</span>
                          <span className="vize-cell-val">
                            {item.currency} {item.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Quantity Stepper Col */}
                        <div className="vize-row-quantity">
                          <span className="vize-mobile-label">Qty:</span>
                          <div className="vize-page-stepper">
                            <button
                              type="button"
                              className="vize-page-step-btn"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="vize-page-step-val">{item.quantity}</span>
                            <button
                              type="button"
                              className="vize-page-step-btn"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line Item Total Col */}
                        <div className="vize-row-total-price">
                          <span className="vize-mobile-label">Total:</span>
                          <span className="vize-cell-total-val">
                            {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Remove Action Col */}
                        <div className="vize-row-remove-action">
                          <button
                            type="button"
                            className="vize-row-del-btn"
                            onClick={() => removeFromCart(item.cartItemId)}
                            aria-label="Remove item"
                            title="Remove from cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Cart Table Bottom Actions */}
                  <div className="vize-cart-table-footer">
                    <Link to="/resins" className="vize-continue-shopping-link">
                      <ArrowLeft size={16} />
                      <span>Continue Shopping</span>
                    </Link>
                    <span className="vize-cart-safe-note">
                      🔒 All chemical kits packaged in UN-certified tamper-proof drums & pails.
                    </span>
                  </div>
                </div>

                {/* Special Order / Delivery Notes */}
                <div className="vize-cart-notes-card">
                  <div className="vize-notes-header">
                    <MessageSquare size={17} className="vize-notes-icon" />
                    <h4>Special Instructions & Batch Notes</h4>
                  </div>
                  <p className="vize-notes-hint">
                    Have specific pot-life requirements, custom color batching, or project site delivery timings? Add your notes here:
                  </p>
                  <textarea
                    className="vize-notes-textarea"
                    placeholder="e.g. Please supply extra accelerator for winter application, or call before dispatching to site..."
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>

                {/* Frequently Bought Together / Recommended Addons */}
                <div className="vize-recommended-addons-card">
                  <div className="vize-addons-header">
                    <div className="vize-addons-icon-wrap">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="vize-addons-title">Recommended Tooling & Pigments</h3>
                      <p className="vize-addons-subtitle">
                        Pair these accessories with your resin kits for flawless surface finishes.
                      </p>
                    </div>
                  </div>

                  <div className="vize-addons-grid">
                    {RECOMMENDED_ADDONS.map((addon) => (
                      <div key={addon.id} className="vize-addon-item-box">
                        <div className="vize-addon-thumb">
                          <img src={addon.image} alt={addon.name} />
                          <span className="vize-addon-tag">{addon.tag}</span>
                        </div>
                        <div className="vize-addon-info">
                          <span className="vize-addon-cat">{addon.category}</span>
                          <h4 className="vize-addon-name">{addon.name}</h4>
                          <span className="vize-addon-price">
                            ₹{addon.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="vize-addon-add-btn"
                          onClick={() => {
                            addToCart(
                              {
                                id: addon.id,
                                name: addon.name,
                                category: addon.category,
                                images: [addon.image],
                                currency: '₹'
                              },
                              { id: `${addon.id}-std`, label: '1 Unit', price: addon.price },
                              { id: 'tool', name: 'Standard', image: addon.image },
                              1,
                              false
                            );
                          }}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Summary Card (Sticky) */}
              <div className="vize-cart-summary-column">
                <div className="vize-summary-card">
                  <h3 className="vize-summary-title">Order Summary</h3>

                  {/* Breakdown Rows */}
                  <div className="vize-summary-breakdown">
                    <div className="vize-summary-row">
                      <span className="vize-summary-label">
                        Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="vize-summary-value">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Shipping Estimate */}
                    <div className="vize-summary-row">
                      <span className="vize-summary-label">
                        Shipping (Pan-India)
                      </span>
                      <span className="vize-summary-value">
                        {isFreeShipping ? (
                          <span className="vize-free-ship-tag">FREE</span>
                        ) : (
                          `₹${shippingCost}`
                        )}
                      </span>
                    </div>

                    {/* Estimated GST */}
                    <div className="vize-summary-row subtle">
                      <span className="vize-summary-label">
                        Estimated GST (18% inclusive)
                      </span>
                      <span className="vize-summary-value">
                        ₹{estimatedTax.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="vize-summary-divider" />

                    {/* Grand Total */}
                    <div className="vize-summary-grand-total">
                      <div>
                        <span className="vize-grand-label">Grand Total</span>
                        <span className="vize-grand-tax-text">(Includes GST & Shipping)</span>
                      </div>
                      <span className="vize-grand-val">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Action Button */}
                  <button
                    type="button"
                    className="vize-proceed-checkout-btn"
                    onClick={handleProceedCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <span className="vize-btn-loading">Preparing Order Details...</span>
                    ) : (
                      <>
                        <Lock size={17} />
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  {/* Assurances & Payment Icons */}
                  <div className="vize-summary-assurances">
                    <div className="vize-assurance-row">
                      <ShieldCheck size={16} className="vize-assure-icon" />
                      <span>100% Authentic Polymer Formulation Guarantee</span>
                    </div>
                    <div className="vize-assurance-row">
                      <RotateCcw size={16} className="vize-assure-icon" />
                      <span>Easy Replacement on Transit Damage</span>
                    </div>
                    <div className="vize-assurance-row">
                      <Clock size={16} className="vize-assure-icon" />
                      <span>Dispatched within 24 Hours from Pune Facility</span>
                    </div>
                  </div>

                  {/* Payment Icons Bar */}
                  <div className="vize-payment-badges-box">
                    <span className="vize-payment-text">Accepted Secure Payments:</span>
                    <div className="vize-payment-pills">
                      <span className="vize-pay-badge">UPI</span>
                      <span className="vize-pay-badge">Visa</span>
                      <span className="vize-pay-badge">MasterCard</span>
                      <span className="vize-pay-badge">RuPay</span>
                      <span className="vize-pay-badge">NetBanking</span>
                    </div>
                  </div>

                  {/* Need Expert Assistance Card */}
                  <div className="vize-summary-expert-help">
                    <div className="vize-help-left">
                      <MessageSquare size={18} className="vize-help-icon" />
                      <div>
                        <strong>Need Technical Consultation?</strong>
                        <p>Speak to our resin chemical engineer for dosage & coverage.</p>
                      </div>
                    </div>
                    <a
                      href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20VIZE%20team,%20I%20need%20help%20with%20my%20order%20and%20polymer%20formulation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vize-help-whatsapp-btn"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

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
