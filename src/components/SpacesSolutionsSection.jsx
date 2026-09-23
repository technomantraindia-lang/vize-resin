import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SPACES = [
  {
    id: 'residential',
    title: 'Residential',
    subtitle: 'Live beautifully.',
    image: '/home.jpg',
    link: '/products?application=residential',
  },
  {
    id: 'industrial',
    title: 'Industrial',
    subtitle: 'Built for performance.',
    image: '/industrial.JPG',
    link: '/products?application=industrial',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Make a lasting impression.',
    image: '/airport.jpg',
    link: '/products?application=commercial',
  },
];

export default function SpacesSolutionsSection() {
  return (
    <section className="spaces-section" id="spaces" aria-label="Solutions for every space">
      <div className="spaces-container">
        <h2 className="spaces-section-title">Solutions for every space.</h2>

        <div className="spaces-grid">
          {SPACES.map((space) => (
            <Link to={space.link} key={space.id} className="space-card">
              <div className="space-card-media">
                <img
                  src={space.image}
                  alt={space.title}
                  className="space-card-img"
                  loading="lazy"
                />
                <div className="space-card-gradient" />
              </div>

              <div className="space-card-content">
                <div className="space-card-text">
                  <h3 className="space-card-title">{space.title}</h3>
                  <p className="space-card-subtitle">{space.subtitle}</p>
                </div>
                <div className="space-card-arrow" aria-hidden="true">
                  <ArrowRight size={20} strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
