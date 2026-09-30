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
    subtitle: 'High-performance primer & sealer',
    image: '/rasin-product/primex-bucket.png',
    link: '/product/vize-primex',
  },
  {
    id: 'screed-max',
    name: 'Vize Screed Max',
    category: 'Primers & Screeds',
    subtitle: 'Heavy-duty leveling floor screed',
    image: '/rasin-product/screedmax-bucket.png',
    link: '/product/vize-screed-max',
  },
  {
    id: 'epowrap',
    name: 'Vize EpoWrap',
    category: 'Flooring Systems',
    subtitle: 'Seamless monolithic metallic flooring',
    image: '/rasin-product/epowrap-bucket.png',
    link: '/product/vize-epowrap',
  },
  {
    id: 'epowrap-pro',
    name: 'Vize EpoWrap Pro',
    category: 'Flooring Systems',
    subtitle: 'Professional slow-flow metallic system',
    image: '/rasin-product/epowrappro-bucket.png',
    link: '/product/vize-epowrap-pro',
  },
  {
    id: 'epowrap-max',
    name: 'Vize EpoWrap Max',
    category: 'Flooring Systems',
    subtitle: '3:1 Super clearcoat epoxy resin',
    image: '/rasin-product/epowrapmax-bucket.png',
    link: '/product/vize-epowrap-max',
  },
  {
    id: 'rockhard',
    name: 'Vize RockHard',
    category: 'Flooring Systems',
    subtitle: 'Natural aggregate stone carpet binder',
    image: '/rasin-product/rockhard-bucket.png',
    link: '/product/vize-rockhard',
  },
  {
    id: 'aspartic-max',
    name: 'Vize Aspartic Max',
    category: 'Protective Coatings',
    subtitle: 'Protective exterior fast-cure shield',
    image: '/rasin-product/asparticmax-bucket.png',
    link: '/product/vize-aspartic-max',
  },
  {
    id: 'urethane-max',
    name: 'Vize Urethane Max',
    category: 'Protective Coatings',
    subtitle: 'High-hardness polyurethane topcoat',
    image: '/rasin-product/urethanemax-bucket.png',
    link: '/product/vize-urethane-max',
  },
  {
    id: 'cast-max',
    name: 'Vize Cast Max',
    category: 'Casting & Art',
    subtitle: 'Crystal clear river table casting resin',
    image: '/rasin-product/castmax-bucket.png',
    link: '/product/vize-cast-max',
  },
  {
    id: 'art-max',
    name: 'Vize Art Max',
    category: 'Casting & Art',
    subtitle: 'Self-doming high-gloss art formulation',
    image: '/rasin-product/artmax-bucket.png',
    link: '/product/vize-art-max',
  },
  {
    id: 'nano-silicon',
    name: 'Vize Nano Silicon',
    category: 'Protective Coatings',
    subtitle: 'Hydrophobic nanotech surface sealant',
    image: '/rasin-product/nano-bucket.png',
    link: '/product/vize-nano',
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


