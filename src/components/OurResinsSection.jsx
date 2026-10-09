import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import productsData from '../data/products.json';
import { fetchFromApi, resolveImageUrl } from '../utils/api';

const CATEGORIES = [
  'All Products',
  'Flooring Systems',
  'Casting & Art',
  'Primers & Screeds',
  'Protective Coatings',
];

const mapCategory = (cat, appCat) => {
  if (appCat?.toLowerCase().includes('primer') || appCat?.toLowerCase().includes('screed')) return 'Primers & Screeds';
  if (cat?.toLowerCase().includes('flooring')) return 'Flooring Systems';
  if (cat?.toLowerCase().includes('casting')) return 'Casting & Art';
  if (cat?.toLowerCase().includes('protective') || cat?.toLowerCase().includes('finishing')) return 'Protective Coatings';
  return 'Flooring Systems';
};

const formatProductsList = (list) => {
  return (list || []).map((p) => {
    const rawImg = p.images?.find((img) => typeof img === 'string' && img.includes('bucket')) || p.images?.[0] || '/rasin-product/primex-bucket.png';
    const bucketImg = resolveImageUrl(rawImg);
    return {
      id: p.slug || p.id,
      name: p.name,
      category: mapCategory(p.category, p.applicationCategory),
      subtitle: p.tagline || p.chemistry,
      image: bucketImg,
      link: `/product/${p.id || p.slug}`
    };
  });
};

const DEFAULT_PRODUCTS = formatProductsList(productsData);

export default function OurResinsSection() {
  const [activeCategory, setActiveCategory] = useState('All Products');
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
    activeCategory === 'All Products'
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
  }, [activeCategory]);

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
        <div className="resins-header-top">
          <div className="resins-eyebrow">
            <span className="resins-eyebrow-text">OUR RESINS</span>
            <span className="resins-eyebrow-line"></span>
          </div>

          {/* Slider Arrow Controls */}
          <div className="resins-slider-nav">
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

        <h2 className="resins-title">The resin behind the result.</h2>
        
        {/* Category Tabs */}
        <div className="resins-tabs">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All Products'
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
          {filteredProducts.map((product) => (
            <div key={product.id} className="sub-product-card horizontal-slide-card">
              {/* Free-floating Bucket Visual on the Left */}
              <div className="sub-product-img-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="sub-product-img"
                  loading="lazy"
                />
                <div className="sub-product-pedestal" />
              </div>

              {/* Information Aside on the Right */}
              <div className="sub-product-info">
                <span className="sub-product-coverage-badge">50 Sq.Ft Kit</span>
                <h3 className="sub-product-name">{product.name}</h3>
                <p className="sub-product-subtitle">{product.subtitle}</p>

                <Link to={product.link} className="btn-shop-product">
                  <span>Shop Product</span>
                  <ArrowRight size={15} strokeWidth={1.8} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


