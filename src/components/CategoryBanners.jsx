import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_ITEMS = [
  {
    id: 'flooring',
    title: 'Flooring Resins',
    subtitle: 'For lasting impressions.',
    link: '/flooring-systems',
    image: '/cat-flooring.jpg',
  },
  {
    id: 'casting',
    title: 'Casting & Art',
    subtitle: 'Turn ideas into reality.',
    link: '/casting-art',
    image: '/cat-casting.jpg',
  },
  {
    id: 'protective',
    title: 'Protective Coatings',
    subtitle: 'Beauty that endures.',
    link: '/coatings',
    image: '/cat-protective.jpg',
  },
];

export default function CategoryBanners() {
  return (
    <section className="category-banners-section" aria-label="Product Categories">
      <div className="category-banners-container">
        <div className="category-banners-grid">
          {CATEGORY_ITEMS.map((item) => (
            <Link to={item.link} key={item.id} className="category-banner-card">
              <div className="category-banner-content">
                <h3 className="category-banner-title">{item.title}</h3>
                <p className="category-banner-subtitle">{item.subtitle}</p>
                <div className="category-banner-arrow" aria-hidden="true">
                  <ArrowRight size={18} strokeWidth={2} />
                </div>
              </div>
              <div className="category-banner-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="category-banner-image"
                  loading="lazy"
                />
                <div className="category-banner-fade" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
