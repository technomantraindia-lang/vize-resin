import { useEffect, useRef } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck
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

  const finalTotal = Math.max(0, subtotal - offerDiscountAmount);

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
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
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

        {/* Free Shipping Notice */}
        <div className="vize-shipping-progress-banner">
          <div className="vize-shipping-progress-info">
            <Truck size={15} className="vize-shipping-icon" style={{ color: isFreeShipping ? '#34d399' : 'rgba(243,241,234,0.7)' }} />
            {isFreeShipping ? (
              <span style={{ color: '#34d399', fontWeight: 600 }}>
                Free Express Delivery Unlocked
              </span>
            ) : (
              <span>
                Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} more for Free Delivery
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
                Looks like you haven't added any speciality resins or tooling to your project kit yet.
              </p>
              <button
                type="button"
                className="vize-empty-shop-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/resins');
                }}
              >
                <span>Explore Products</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 className="vize-cart-item-name" style={{ margin: 0 }}>
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={closeDrawer}
                            className="vize-cart-item-link"
                          >
                            {item.name}
                          </Link>
                        </h4>
                        <button
                          type="button"
                          className="vize-cart-item-remove"
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Variant & Color details */}
                      {(item.size || item.color) && (
                        <div className="vize-cart-item-specs" style={{ margin: '6px 0 8px' }}>
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
                        </div>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="vize-cart-item-bottom" style={{ marginTop: 'auto', paddingTop: '4px' }}>
                        <div className="vize-cart-item-price">
                          {discount.hasDiscount ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.98rem' }}>
                                {item.currency} {(discount.discountedPrice * item.quantity).toLocaleString('en-IN')}
                              </span>
                              <span style={{ textDecoration: 'line-through', color: 'rgba(243, 241, 234, 0.4)', fontSize: '0.8rem' }}>
                                {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#F3F1EA', fontWeight: 700, fontSize: '0.98rem' }}>
                              {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
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
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="vize-cart-drawer-footer">
            {/* Subtotal */}
            <div className="vize-drawer-subtotal-row">
              <span className="vize-drawer-subtotal-label">Subtotal</span>
              <span className="vize-drawer-subtotal-val" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F3F1EA' }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Discount row if active */}
            {offerDiscountAmount > 0 && (
              <div className="vize-drawer-subtotal-row" style={{ color: '#34d399' }}>
                <span className="vize-drawer-subtotal-label" style={{ color: '#34d399' }}>
                  Discount ({activeOfferDiscount?.discountPercent || 15}%)
                </span>
                <span className="vize-drawer-subtotal-val" style={{ color: '#34d399', fontSize: '1.05rem', fontWeight: 600 }}>
                  -₹{offerDiscountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="vize-drawer-subtotal-row" style={{ borderTop: '1px solid rgba(243, 241, 234, 0.12)', paddingTop: '10px', marginTop: '6px', marginBottom: '14px' }}>
              <span className="vize-drawer-subtotal-label" style={{ color: '#F3F1EA', fontSize: '1.05rem', fontWeight: 600 }}>
                Total
              </span>
              <span className="vize-drawer-subtotal-val" style={{ color: '#F3F1EA', fontSize: '1.35rem', fontWeight: 700 }}>
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="vize-drawer-cta-group" style={{ marginBottom: 0 }}>
              <button
                type="button"
                className="vize-drawer-view-cart-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/cart');
                }}
              >
                View Cart
              </button>
              <button
                type="button"
                className="vize-drawer-checkout-btn"
                onClick={() => {
                  closeDrawer();
                  navigate('/checkout');
                }}
              >
                <span>Checkout</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
