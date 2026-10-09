import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import staticOffers from '../data/offers.json';

export default function OfferPopup() {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load offers from JSON / API
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/offers.json?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeList = data.filter((o) => o.isActive !== false);
            if (activeList.length > 0) {
              setOffers(activeList);
              return;
            }
          }
        }
      } catch (err) {
        // Fallback to static
      }
      if (Array.isArray(staticOffers) && staticOffers.length > 0) {
        const activeList = staticOffers.filter((o) => o.isActive !== false);
        if (activeList.length > 0) {
          setOffers(activeList);
        }
      }
    }

    fetchOffers();
  }, []);

  // Show popup after a gentle 2.5-second delay if not dismissed
  useEffect(() => {
    if (offers.length === 0) return;

    if (sessionStorage.getItem('vize_offer_popup_dismissed')) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [offers]);

  // Auto-play slider rotation (every 5 seconds) if multiple offers exist
  useEffect(() => {
    if (!isVisible || offers.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, offers.length, isPaused]);

  if (!mounted || offers.length === 0) return null;

  const currentOffer = offers[currentIndex] || offers[0];
  if (!currentOffer) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('vize_offer_popup_dismissed', 'true');
  };

  const handleReopen = () => {
    setIsVisible(true);
  };

  const handleAction = () => {
    handleClose();
    const link =
      currentOffer.buttonLink ||
      currentOffer.button_link ||
      currentOffer.ctaLink ||
      '/resins';
    if (link.startsWith('http')) {
      window.location.href = link;
    } else {
      navigate(link);
    }
  };

  const offerTitle = currentOffer.title || currentOffer.headline || '';
  const offerBadge =
    currentOffer.badge ||
    currentOffer.badgeText ||
    currentOffer.discountBadge ||
    'SPECIAL DEAL';
  const offerBtn = currentOffer.buttonText || currentOffer.ctaText || 'Shop Now';
  const offerImg =
    currentOffer.imageUrl || currentOffer.image_url || '/epowrap-product.jpg';
  const customFields = Array.isArray(currentOffer.customFields)
    ? currentOffer.customFields
    : Array.isArray(currentOffer.custom_fields)
    ? currentOffer.custom_fields
    : [];

  const modalMarkup = (
    <>
      {/* Floating Re-open Button (shown when dismissed) */}
      {!isVisible && isDismissed && (
        <button
          type="button"
          onClick={handleReopen}
          className="vize-offer-reopen-btn"
          title="View Special Offers"
        >
          <span style={{ fontSize: '16px' }}>🎁</span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '0.02em',
            }}
          >
            {offers.length > 1
              ? `${offers.length} Special Offers`
              : offerBadge}
          </span>
        </button>
      )}

      {/* Main Luxury Offer Modal */}
      {isVisible && (
        <div
          className="vize-offer-overlay"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="vize-offer-card"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="vize-offer-close"
              aria-label="Close offer"
            >
              &times;
            </button>

            {/* Slide counter (e.g. 1 / 3) if multiple offers */}
            {offers.length > 1 && (
              <div className="vize-offer-slide-count">
                {currentIndex + 1} / {offers.length}
              </div>
            )}

            {/* Banner Image Container */}
            <div className="vize-offer-banner">
              <img
                src={offerImg}
                alt={offerTitle}
                onError={(e) => {
                  e.target.src = '/epowrap-product.jpg';
                }}
              />
              <div className="vize-offer-banner-gradient" />

              {/* Deal Badge */}
              <div className="vize-offer-badge">{offerBadge}</div>

              {/* Previous / Next Slide Buttons (if more than 1 offer) */}
              {offers.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="vize-offer-nav-btn prev"
                    aria-label="Previous Offer"
                    title="Previous Offer"
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="vize-offer-nav-btn next"
                    aria-label="Next Offer"
                    title="Next Offer"
                  >
                    &#8250;
                  </button>
                </>
              )}
            </div>

            {/* Content Body */}
            <div className="vize-offer-content">
              <h3 className="vize-offer-title">{offerTitle}</h3>

              {currentOffer.description && (
                <p className="vize-offer-desc">{currentOffer.description}</p>
              )}

              {/* Custom Fields Highlights (if any) */}
              {customFields.length > 0 && (
                <div className="vize-offer-custom-fields">
                  {customFields.map((field, idx) => (
                    <div key={idx} className="vize-offer-field-item">
                      <span className="vize-offer-field-label">
                        <span style={{ color: '#38bdf8' }}>&#8226;</span>
                        {field.label || field.name}:
                      </span>
                      <span className="vize-offer-field-val">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide Dots Indicator */}
              {offers.length > 1 && (
                <div className="vize-offer-dots">
                  {offers.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`vize-offer-dot ${
                        i === currentIndex ? 'active' : ''
                      }`}
                      aria-label={`Go to offer ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAction}
                className="vize-offer-btn-primary"
              >
                <span>{offerBtn}</span>
                <span style={{ fontSize: '18px', fontWeight: 900 }}>&rarr;</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="vize-offer-btn-dismiss"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalMarkup, document.body)
    : null;
}
