import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'vize_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_RATE = 250;

const VALID_COUPONS = {
  VIZE10: { code: 'VIZE10', discountPercent: 10, description: '10% OFF Speciality Polymers' },
  WELCOME15: { code: 'WELCOME15', discountPercent: 15, description: '15% OFF New Customer Welcome' },
  FREESHIP: { code: 'FREESHIP', discountPercent: 0, freeShipping: true, description: 'Free Express Shipping' }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Lock body scroll when drawer is open on mobile/desktop
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Add Item to Cart
  const addToCart = (product, size, color, quantity = 1, openDrawerAfter = true) => {
    const sizeObj = size || product.sizes?.[0] || { id: 'std', label: 'Standard Kit', price: product.price || 1499 };
    const colorObj = color || { id: 'default', name: 'Standard Clear / Opaque', image: product.images?.[0] || '/bucket.png' };
    
    const cartItemId = `${product.id}-${sizeObj.id}-${colorObj.id}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      const newItem = {
        cartItemId,
        productId: product.id,
        name: product.name,
        brand: product.brand || product.name,
        category: product.category || 'Speciality Resin',
        image: product.images?.[0] || '/bucket.png',
        currency: product.currency || '₹',
        size: sizeObj,
        color: colorObj,
        price: sizeObj.price,
        quantity: Math.max(1, quantity)
      };

      return [newItem, ...prevItems];
    });

    if (openDrawerAfter) {
      setIsDrawerOpen(true);
    }
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Coupon Engine
  const applyCoupon = (code) => {
    const upperCode = code?.trim().toUpperCase();
    if (VALID_COUPONS[upperCode]) {
      setAppliedCoupon(VALID_COUPONS[upperCode]);
      return { success: true, message: `Coupon "${upperCode}" applied: ${VALID_COUPONS[upperCode].description}` };
    }
    return { success: false, message: 'Invalid coupon code. Try VIZE10 or WELCOME15.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedCoupon?.discountPercent
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping || subtotal === 0;

  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_RATE;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Estimated GST (18% inclusive or breakdown)
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.18);

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        subtotal,
        discountAmount,
        shippingCost,
        isFreeShipping,
        freeShippingProgress,
        amountNeededForFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        grandTotal,
        estimatedTax,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orderNotes,
        setOrderNotes
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
