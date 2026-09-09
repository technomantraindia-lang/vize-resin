import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All Products',
  'Flooring Systems',
  'Casting & Art',
  'Primers & Screeds',
  'Protective Coatings',
];

const ALL_PRODUCTS = [
  {
    id: 'primex',
    name: 'Vize PrimeX',
    category: 'Primers & Screeds',
    subtitle: 'High-performance primer',
    image: '/bucket.png',
    link: '#primex',
  },
  {
    id: 'epowrap-pro',
    name: 'Vize EpoWrap Pro',
    category: 'Flooring Systems',
    subtitle: 'Professional flooring system',
    image: '/bucket.png',
    link: '#epowrap-pro',
  },
  {
    id: 'epowrap-max',
    name: 'Vize EpoWrap Max',
    category: 'Protective Coatings',
    subtitle: 'For demanding environments',
    image: '/bucket.png',
    link: '#epowrap-max',
  },
  {
    id: 'art-max',
    name: 'Vize Art Max',
    category: 'Casting & Art',
    subtitle: 'Art & resin artwork formulation',
    image: '/bucket.png',
    link: '#art-max',
  },
  {
    id: 'aspartic-max',
    name: 'Vize Aspartic Max',
    category: 'Protective Coatings',
    subtitle: 'Protective exterior floor shield',
    image: '/bucket.png',
    link: '#aspartic-max',
  },
  {
    id: 'cast-max',
    name: 'Vize Cast Max',
    category: 'Casting & Art',
    subtitle: 'Crystal clear river table casting',
    image: '/bucket.png',
    link: '#cast-max',
  },
  {
    id: 'epowrap',
    name: 'Vize EpoWrap',
    category: 'Flooring Systems',
    subtitle: 'Seamless monolithic interior flooring',
    image: '/bucket.png',
    link: '#epowrap',
  },
  {
    id: 'nano-silicon',
    name: 'Vize Nano / SiliCon',
    category: 'Protective Coatings',
    subtitle: 'Hydrophobic nanotech sealant',
    image: '/bucket.png',
    link: '#nano-silicon',
  },
  {
    id: 'rockhard',
    name: 'Vize RockHard',
    category: 'Flooring Systems',
    subtitle: 'Natural aggregate stone carpet',
    image: '/bucket.png',
    link: '#rockhard',
  },
  {
    id: 'screed-max',
    name: 'Vize Screed Max',
    category: 'Primers & Screeds',
    subtitle: 'Heavy-duty leveling floor screed',
    image: '/bucket.png',
    link: '#screed-max',
  },
  {
    id: 'urethane-max',
    name: 'Vize Urethane Max',
    category: 'Protective Coatings',
    subtitle: 'Aliphatic polyurethane topcoat',
    image: '/bucket.png',
    link: '#urethane-max',
  },
];

export default function OurResinsSection() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredProducts =
    activeCategory === 'All Products'
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeCategory);

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
                ? ALL_PRODUCTS.length
                : ALL_PRODUCTS.filter((p) => p.category === cat).length;
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


