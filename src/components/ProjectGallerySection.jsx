import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchFromApi, resolveImageUrl } from '../utils/api';

const DEFAULT_PROJECTS = [
  {
    id: 'residential',
    title: 'Residential',
    subtitle: 'Live beautifully.',
    image: '/residential.png',
    link: '/our-work',
  },
  {
    id: 'custom',
    title: 'Custom Creations',
    subtitle: 'Make it one of a kind.',
    image: '/cat-casting.jpg',
    link: '/our-work',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Make a lasting impression.',
    image: '/commercial.png',
    link: '/our-work',
  },
];

export default function ProjectGallerySection() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveShowcase() {
      try {
        const json = await fetchFromApi('/api/vize/showcase');
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const mapped = json.data.slice(0, 6).map((item) => ({
            id: 'proj-' + item.id,
            title: item.title,
            subtitle: item.description || item.tagline || item.client_type || 'Architectural resin installation.',
            image: resolveImageUrl(item.image || item.image_url || '/commercial.png'),
            link: '/our-work',
          }));
          setProjects(mapped);
        }
      } catch (e) {
        // Fallback to default
      }
    }
    loadLiveShowcase();
    return () => {
      isMounted = false;
    };
  }, []);

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

        {/* Dynamic Bento Projects Grid */}
        <div className="project-gallery-grid">
          {projects.map((proj) => (
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
