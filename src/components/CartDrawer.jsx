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
            <div className="vize-cart-items-list">
              {cartItems.map((item) => (
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
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="vize-cart-item-bottom">
                      <div className="vize-cart-item-price">
                        {item.currency} {(item.price * item.quantity).toLocaleString('en-IN')}
                        {item.quantity > 1 && (
                          <span className="vize-unit-price">
                            ({item.currency} {item.price.toLocaleString('en-IN')} each)
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
              ))}
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
            <p className="vize-drawer-tax-note">
              Taxes and shipping calculated at checkout
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
