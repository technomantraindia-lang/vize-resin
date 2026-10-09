import { useEffect, useRef } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    totalItemCount,
    subtotal,
    isFreeShipping,
    freeShippingProgress,
    amountNeededForFreeShipping,
    activeOfferDiscount,
    offerDiscountAmount,
    getItemDiscountInfo,
    estimatedTax,
    taxRateLabel,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart
  } = useCart();

  const drawerRef = useRef(null);
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="vize-cart-drawer-overlay" onClick={closeDrawer} role="dialog" aria-modal="true">
      <div
        className="vize-cart-drawer"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="vize-cart-drawer-header">
          <div className="vize-cart-header-title-box">
            <div className="vize-cart-icon-wrapper">
              <ShoppingBag size={20} className="vize-cart-bag-icon" />
            </div>
            <div>
              <h3 className="vize-cart-title">Your Cart</h3>
              <span className="vize-cart-items-count">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>
          <button
            type="button"
            className="vize-cart-close-btn"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="vize-shipping-progress-banner">
          <div className="vize-shipping-progress-info">
            <Truck size={16} className="vize-shipping-icon" />
            {isFreeShipping ? (
              <span className="vize-shipping-qualified">
                🎉 Congratulations! You unlocked <strong>FREE Express Shipping</strong>
              </span>
            ) : (
              <span className="vize-shipping-needed">
                Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>
              </span>
            )}
          </div>
          <div className="vize-shipping-track">
            <div
              className={`vize-shipping-fill ${isFreeShipping ? 'complete' : ''}`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Drawer Body / Items List */}
        <div className="vize-cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="vize-cart-empty-state">
              <div className="vize-cart-empty-icon-circle">
                <ShoppingBag size={38} strokeWidth={1.4} />
              </div>
              <h4 className="vize-empty-title">Your Cart is Empty</h4>
              <p className="vize-empty-desc">
                Looks like you haven't added any speciality resins, coatings or pigments to your project kit yet.
              </p>
              <button
                type="button"
                className="vize-empty-shop-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/resins');
                }}
              >
                <span>Explore Resins & Pigments</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div>
              {/* Active Offer Discount Banner */}
              {offerDiscountAmount > 0 && (
                <div style={{ margin: '10px 14px 12px', padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>⚡</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46' }}>
                      {activeOfferDiscount?.badge || 'OFFER'}: {activeOfferDiscount?.discountPercent}% OFF Applied
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857' }}>
                    -₹{offerDiscountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="vize-cart-items-list">
                {cartItems.map((item) => {
                  const discount = getItemDiscountInfo(item);
                  return (
                    <div key={item.cartItemId} className="vize-cart-item-card">
                      {/* Item Image */}
                      <div className="vize-cart-item-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>

                      {/* Item Details */}
                      <div className="vize-cart-item-info">
                        <div className="vize-cart-item-top">
                          <span className="vize-cart-item-cat">{item.category}</span>
                          <button
                            type="button"
                            className="vize-cart-item-remove"
                            onClick={() => removeFromCart(item.cartItemId)}
                            aria-label="Remove item"
                            title="Remove from cart"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <h4 className="vize-cart-item-name">
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={closeDrawer}
                            className="vize-cart-item-link"
                          >
                            {item.name}
                          </Link>
                        </h4>

                        {/* Variant & Color details */}
                        <div className="vize-cart-item-specs">
                          {item.size && (
                            <span className="vize-item-spec-pill">{item.size.label}</span>
                          )}
                          {item.color && (
                            <span className="vize-item-color-pill">
                              {item.color.image && (
                                <img
                                  src={item.color.image}
                                  alt=""
                                  className="vize-spec-color-dot"
                                />
                              )}
                              <span>{item.color.name}</span>
                            </span>
                          )}
                          {item.taxRate !== undefined && item.taxRate !== null && (
                            <span className="vize-item-spec-pill" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontWeight: 700 }}>
                              {item.taxRate}% GST
                            </span>
                          )}
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="vize-cart-item-bottom">
                          <div className="vize-cart-item-price">
                            {discount.hasDiscount ? (
                              <div>
                                <span style={{ color: '#16a34a', fontWeight: 800 }}>
                                  {item.currency} {(discount.discountedPrice * item.quantity).toLocaleString('en-IN')}
                                </span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px', marginLeft: '6px' }}>
                                  {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', marginLeft: '6px' }}>
                                  {discount.discountPercent}% OFF
                                </span>
                              </div>
                            ) : (
                              <>
                                {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                                {item.quantity > 1 && (
                                  <span className="vize-unit-price">
                                    ({item.currency} {item.price.toLocaleString('en-IN')} each)
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          <div className="vize-cart-stepper">
                            <button
                              type="button"
                              className="vize-drawer-step-btn"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="vize-drawer-step-qty">{item.quantity}</span>
                            <button
                              type="button"
                              className="vize-drawer-step-btn"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="vize-cart-drawer-footer">
            {/* Subtotal summary */}
            <div className="vize-drawer-subtotal-row">
              <span className="vize-drawer-subtotal-label">Subtotal</span>
              <span className="vize-drawer-subtotal-val">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Offer Discount Cut */}
            {offerDiscountAmount > 0 && (
              <div className="vize-drawer-subtotal-row" style={{ color: '#16a34a', fontWeight: 700 }}>
                <span className="vize-drawer-subtotal-label" style={{ color: '#15803d' }}>
                  ⚡ {activeOfferDiscount?.badge || 'Offer Discount'} ({activeOfferDiscount?.discountPercent}% OFF)
                </span>
                <span className="vize-drawer-subtotal-val" style={{ color: '#15803d' }}>
                  -₹{offerDiscountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="vize-drawer-subtotal-row" style={{ fontWeight: 800, fontSize: '1.05rem', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
              <span className="vize-drawer-subtotal-label" style={{ color: '#0f172a' }}>Estimated Total</span>
              <span className="vize-drawer-subtotal-val" style={{ color: '#0f172a' }}>
                ₹{(subtotal - offerDiscountAmount).toLocaleString('en-IN')}
              </span>
            </div>

            <p className="vize-drawer-tax-note">
              Includes {taxRateLabel || '18% GST'} (₹{estimatedTax.toLocaleString('en-IN')}) · Free shipping on qualifying orders
            </p>

            {/* CTAs */}
            <div className="vize-drawer-cta-group">
              <button
                type="button"
                className="vize-drawer-view-cart-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/cart');
                }}
              >
                <span>View Full Cart</span>
              </button>
              <button
                type="button"
                className="vize-drawer-checkout-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/cart');
                }}
              >
                <Lock size={15} />
                <span>Checkout Now</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="vize-drawer-trust-badges">
              <div className="vize-drawer-trust-item">
                <ShieldCheck size={14} className="vize-trust-icon" />
                <span>100% Genuine Polymer Formulations</span>
              </div>
              <div className="vize-drawer-trust-item">
                <Sparkles size={14} className="vize-trust-icon" />
                <span>Laboratory Verified Batch Specs</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
