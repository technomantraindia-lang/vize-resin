import { createContext, useContext, useState, useEffect } from 'react';
import staticOffers from '../data/offers.json';

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            taxRate: (item.taxRate !== undefined && item.taxRate !== null)
              ? Number(item.taxRate)
              : ((item.tax_rate !== undefined && item.tax_rate !== null) ? Number(item.tax_rate) : 18)
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [activeOffers, setActiveOffers] = useState(() => {
    return Array.isArray(staticOffers) ? staticOffers.filter((o) => o.isActive !== false) : [];
  });

  // Load active offers dynamically from JSON / API
  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch('/offers.json?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const active = data.filter((o) => o.isActive !== false);
            setActiveOffers(active);
            return;
          }
        }
      } catch (err) {
        // Fallback to static
      }
      if (Array.isArray(staticOffers)) {
        setActiveOffers(staticOffers.filter((o) => o.isActive !== false));
      }
    }

    loadOffers();
  }, []);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Lock body scroll when drawer is open
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

    const productTaxRate = (product.tax_rate !== undefined && product.tax_rate !== null)
      ? Number(product.tax_rate)
      : ((product.taxRate !== undefined && product.taxRate !== null)
        ? Number(product.taxRate)
        : 18);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          taxRate: updated[existingIndex].taxRate !== undefined ? updated[existingIndex].taxRate : productTaxRate,
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
        taxRate: productTaxRate,
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
    return { success: false, message: 'Invalid coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // =========================================================================
  // AUTOMATIC OFFER DISCOUNT ENGINE (% OFF on All, Specific Categories, or 1 Product)
  // =========================================================================
  
  // Find primary active discount offer (for global notices)
  const activeOffer = activeOffers.find((o) => {
    const pct = Number(o.discountPercent) || 0;
    return pct > 0;
  }) || null;

  // Determine if a cart item is eligible for a specific offer
  const isItemEligible = (item, categoryScope, targetProductId) => {
    // 1. Particular single product match
    if (categoryScope === 'single_product' || Boolean(targetProductId)) {
      const target = (targetProductId || '').toLowerCase().trim();
      if (!target) return false;

      const itemId = (item.productId || item.id || '').toLowerCase().trim();
      const itemName = (item.name || '').toLowerCase().trim();

      return (
        itemId === target ||
        itemId.includes(target) ||
        target.includes(itemId) ||
        itemName.includes(target)
      );
    }

    // 2. General categories (Old system preserved 100%)
    if (!categoryScope || categoryScope === 'all') return true;

    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();

    if (categoryScope === 'resins') {
      return (
        cat.includes('resin') ||
        cat.includes('cast') ||
        cat.includes('floor') ||
        cat.includes('polymer') ||
        cat.includes('epoxy') ||
        cat.includes('coat') ||
        name.includes('resin') ||
        name.includes('cast') ||
        name.includes('epowrap') ||
        name.includes('poly') ||
        name.includes('hardener')
      );
    }

    if (categoryScope === 'pigments') {
      return (
        cat.includes('pigment') ||
        cat.includes('color') ||
        cat.includes('colour') ||
        cat.includes('ral') ||
        cat.includes('shade') ||
        cat.includes('flake') ||
        name.includes('pigment') ||
        name.includes('metallic') ||
        name.includes('shade') ||
        name.includes('ral')
      );
    }

    if (categoryScope === 'table_tops') {
      return (
        cat.includes('table') ||
        cat.includes('slab') ||
        cat.includes('wood') ||
        name.includes('table') ||
        name.includes('slab')
      );
    }

    return true;
  };

  // Find the matching offer for an item (single product match takes priority)
  const getOfferForItem = (item) => {
    if (!Array.isArray(activeOffers) || activeOffers.length === 0) return null;

    const discountOffers = activeOffers.filter((o) => Number(o.discountPercent) > 0);
    if (discountOffers.length === 0) return null;

    // Check specific product offer first
    const productSpecific = discountOffers.find((o) => {
      const isSingle = o.applicableCategory === 'single_product' || Boolean(o.targetProductId);
      return isSingle && isItemEligible(item, o.applicableCategory, o.targetProductId);
    });

    if (productSpecific) {
      return productSpecific;
    }

    // Check category / storewide offers
    const categoryOffers = discountOffers.filter((o) => {
      if (o.applicableCategory === 'single_product') return false;
      return isItemEligible(item, o.applicableCategory || 'all', o.targetProductId);
    });

    if (categoryOffers.length > 0) {
      return categoryOffers.reduce((best, curr) => {
        return Number(curr.discountPercent) > Number(best.discountPercent) ? curr : best;
      }, categoryOffers[0]);
    }

    return null;
  };

  // Helper to get discount info for any specific cart item
  const getItemDiscountInfo = (item) => {
    const offer = getOfferForItem(item);

    if (!offer) {
      return {
        hasDiscount: false,
        discountPercent: 0,
        originalPrice: item.price,
        discountedPrice: item.price,
        savingsPerUnit: 0,
        totalSavings: 0,
      };
    }

    const pct = Number(offer.discountPercent) || 0;
    if (pct <= 0) {
      return {
        hasDiscount: false,
        discountPercent: 0,
        originalPrice: item.price,
        discountedPrice: item.price,
        savingsPerUnit: 0,
        totalSavings: 0,
      };
    }

    const savingsPerUnit = Math.round((item.price * pct) / 100);
    const discountedPrice = Math.max(0, item.price - savingsPerUnit);
    const totalSavings = savingsPerUnit * item.quantity;

    return {
      hasDiscount: true,
      discountPercent: pct,
      originalPrice: item.price,
      discountedPrice,
      savingsPerUnit,
      totalSavings,
      offerTitle: offer.title,
      offerBadge: offer.badge,
      applicableCategory: offer.applicableCategory,
      targetProductId: offer.targetProductId,
    };
  };

  // Calculations
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Total money cut by the active offer
  const offerDiscountAmount = cartItems.reduce((acc, item) => {
    const info = getItemDiscountInfo(item);
    return acc + (info.hasDiscount ? info.totalSavings : 0);
  }, 0);

  // Coupon discount (if any coupon entered)
  const couponDiscountAmount = appliedCoupon?.discountPercent
    ? Math.round(((subtotal - offerDiscountAmount) * appliedCoupon.discountPercent) / 100)
    : 0;

  const totalDiscount = offerDiscountAmount + couponDiscountAmount;

  const isFreeShipping = (subtotal - totalDiscount) >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping || subtotal === 0;

  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_RATE;

  const freeShippingProgress = Math.min(100, Math.round(((subtotal - totalDiscount) / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - totalDiscount));

  // Dynamic Tax / GST Calculation per item based on each product's configured tax_rate
  const postDiscountSubtotal = Math.max(0, subtotal - offerDiscountAmount);
  const couponFactor = (postDiscountSubtotal > 0 && couponDiscountAmount > 0)
    ? (postDiscountSubtotal - couponDiscountAmount) / postDiscountSubtotal
    : 1;

  let totalTaxCalculated = 0;
  const ratesMap = {};

  cartItems.forEach((item) => {
    const info = getItemDiscountInfo(item);
    const itemPostOfferPrice = info.hasDiscount ? (info.discountedPrice * item.quantity) : (item.price * item.quantity);
    const itemFinalNet = itemPostOfferPrice * couponFactor;
    
    const rate = (item.taxRate !== undefined && item.taxRate !== null)
      ? Number(item.taxRate)
      : ((item.tax_rate !== undefined && item.tax_rate !== null) ? Number(item.tax_rate) : 18);

    const itemTax = itemFinalNet * (rate / 100);
    totalTaxCalculated += itemTax;

    if (!ratesMap[rate]) {
      ratesMap[rate] = { rate, amount: 0, count: 0 };
    }
    ratesMap[rate].amount += itemTax;
    ratesMap[rate].count += item.quantity;
  });

  const estimatedTax = Math.round(totalTaxCalculated);

  const distinctRates = Object.keys(ratesMap).map(Number);
  let taxRateLabel = '18% inclusive';
  if (distinctRates.length === 1) {
    taxRateLabel = distinctRates[0] === 0 ? '0% (Exempt)' : `${distinctRates[0]}% inclusive`;
  } else if (distinctRates.length > 1) {
    taxRateLabel = 'item rates inclusive';
  }

  const taxBreakdown = Object.values(ratesMap).map((r) => ({
    rate: r.rate,
    amount: Math.round(r.amount),
    count: r.count,
  }));

  const grandTotal = Math.max(0, subtotal - totalDiscount + shippingCost);

  const activeOfferDiscount = activeOffer && offerDiscountAmount > 0
    ? {
        title: activeOffer.title,
        badge: activeOffer.badge || 'SPECIAL DEAL',
        discountPercent: Number(activeOffer.discountPercent),
        applicableCategory: activeOffer.applicableCategory || 'all',
        amount: offerDiscountAmount,
      }
    : null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        subtotal,
        discountAmount: totalDiscount,
        offerDiscountAmount,
        couponDiscountAmount,
        activeOfferDiscount,
        getItemDiscountInfo,
        shippingCost,
        isFreeShipping,
        freeShippingProgress,
        amountNeededForFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        grandTotal,
        estimatedTax,
        taxRateLabel,
        taxBreakdown,
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
        setOrderNotes,
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
