import { ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 'residential',
    title: 'Residential',
    subtitle: 'Live beautifully.',
    image: '/residential.png',
    link: '#residential',
  },
  {
    id: 'custom',
    title: 'Custom Creations',
    subtitle: 'Make it one of a kind.',
    image: '/cat-casting.jpg',
    link: '#custom-creations',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Make a lasting impression.',
    image: '/commercial.png',
    link: '#commercial',
  },
];

export default function ProjectGallerySection() {
  return (
    <section className="project-gallery-section" id="gallery" aria-label="Project Gallery">
      <div className="project-gallery-container">
        {/* Header Area */}
        <div className="project-gallery-header">
          <div className="project-gallery-title-box">
            <div className="gallery-eyebrow-wrap">
              <span className="gallery-eyebrow">PROJECT GALLERY</span>
              <span className="gallery-eyebrow-line" />
            </div>
            <h2 className="project-gallery-title">The finish speaks for itself.</h2>
          </div>
          <div className="project-gallery-header-right">
            <span className="gallery-slogan">REAL SPACES. REAL POSSIBILITIES.</span>
          </div>
        </div>

        {/* 3 Projects Grid */}
        <div className="project-gallery-grid">
          {PROJECTS.map((proj) => (
            <a key={proj.id} href={proj.link} className="project-showcase-card">
              <div className="project-image-wrap">
                <img src={proj.image} alt={proj.title} className="project-img" />
                <div className="project-card-overlay" />
              </div>
              <div className="project-card-content">
                <div className="project-text-block">
                  <h3 className="project-card-title">{proj.title}</h3>
                  <p className="project-card-sub">{proj.subtitle}</p>
                </div>
                <div className="project-card-arrow" aria-hidden="true">
                  <ArrowRight size={20} strokeWidth={1.8} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
