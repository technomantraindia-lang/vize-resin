import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import productsData from '../data/products.json';
import { fetchFromApi, resolveImageUrl } from '../utils/api';

const CATEGORIES = [
  'All Materials',
  'Flooring Resins',
  'Casting & Art',
  'Protective Coatings',
  'Finishing Compounds'
];

const formatProductsList = (list) => {
  return (list || []).map((p) => {
    const rawImgs = Array.isArray(p.images)
      ? p.images
      : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);

    const primaryImg = rawImgs.find((img) => typeof img === 'string' && img.includes('bucket'))
      || rawImgs[0]
      || '/rasin-product/primex-bucket.png';

    return {
      id: p.slug || p.id,
      slug: p.slug || p.id,
      name: p.name,
      category: p.category || 'Flooring Resins',
      applicationTag: p.applicationTag || p.application_tag || p.category,
      subtitle: p.tagline || p.chemistry || 'Epoxy Polymer Formulation',
      image: resolveImageUrl(primaryImg),
      images: rawImgs.map(resolveImageUrl),
      packQty: p.packQty || p.pack_qty || (p.coverage ? `${p.coverage}` : 'Standard Kit'),
      basePrice: p.basePrice || p.base_price,
      link: `/product/${p.slug || p.id}`
    };
  });
};

const DEFAULT_PRODUCTS = formatProductsList(productsData);

export default function OurResinsSection() {
  const [activeCategory, setActiveCategory] = useState('All Materials');
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS);
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLive = async () => {
      try {
        const json = await fetchFromApi('/api/vize/products');
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          setProductsList(formatProductsList(json.data));
        }
      } catch (e) {
        // Fallback gracefully
      }
    };
    fetchLive();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts =
    activeCategory === 'All Materials' || activeCategory === 'All Products'
      ? productsList
      : productsList.filter((p) => p.category === activeCategory);

  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollLeft = 0;
      updateScrollState();
      slider.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
      return () => {
        slider.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [activeCategory, filteredProducts]);

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="our-resins-section" id="explore" aria-label="Our Resins Collection">
      {/* Section Header */}
      <div className="resins-header">
        <div className="resins-header-top" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="resins-eyebrow" style={{ marginBottom: '0.5rem' }}>
              <span className="resins-eyebrow-text">OUR RESINS</span>
              <span className="resins-eyebrow-line"></span>
            </div>
            <h2 className="resins-title" style={{ margin: 0 }}>The resin behind the result.</h2>
          </div>

          {/* Slider Arrow Controls (Horizontal side-by-side) */}
          <div className="resins-slider-nav resins-nav-controls">
            <button
              type="button"
              className={`resins-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              type="button"
              className={`resins-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Category Tabs (Exactly synced with Backend & Resins Page) */}
        <div className="resins-tabs">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All Materials'
                ? productsList.length
                : productsList.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`resins-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} <span className="resins-tab-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div className="resins-slider-container">
        <div
          className="resins-slider-track"
          ref={sliderRef}
        >
          {filteredProducts.map((product) => {
            const hasUploadedImg = Array.isArray(product.images) && product.images.length > 0 &&
              (product.images[0].startsWith('/uploads') || product.images[0].includes('upload') || product.images[0].startsWith('http'));

            const displayImage = hasUploadedImg
              ? product.images[0]
              : (product.image || '/rasin-product/primex-bucket.png');

            return (
              <div key={product.id} className="sub-product-card horizontal-slide-card">
                {/* Visual on the Left */}
                <div className="sub-product-img-wrap">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="sub-product-img"
                    loading="lazy"
                    style={hasUploadedImg ? { objectFit: 'contain', padding: '6px' } : {}}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/rasin-product/primex-bucket.png';
                    }}
                  />
                  <div className="sub-product-pedestal" />
                </div>

                {/* Information Aside on the Right */}
                <div className="sub-product-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span className="sub-product-coverage-badge">{product.packQty || 'Standard Kit'}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#8C4830', letterSpacing: '0.04em' }}>
                      {product.category}
                    </span>
                  </div>

                  <h3 className="sub-product-name">{product.name}</h3>
                  <p className="sub-product-subtitle">{product.subtitle}</p>

                  {product.basePrice && (
                    <div style={{ marginTop: 'auto', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase', display: 'block' }}>
                        Starting Price
                      </span>
                      <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#0D2C33', fontFamily: 'monospace' }}>
                        ₹{Number(product.basePrice).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}

                  <Link to={product.link} className="btn-shop-product">
                    <span>View Product</span>
                    <ArrowRight size={15} strokeWidth={1.8} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
