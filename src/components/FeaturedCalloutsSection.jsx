import { ArrowRight } from 'lucide-react';

export default function FeaturedCalloutsSection() {
  return (
    <section className="featured-callouts-section" aria-label="Featured Collections">
      <div className="callouts-container">
        {/* Card 1: Resin Table Tops */}
        <div className="callout-card callout-table-tops">
          <img
            src="/cat-casting.jpg"
            alt="Resin Table Tops - Live Edge Wood and Epoxy"
            className="callout-bg-img"
          />
          <div className="callout-overlay" />
          <div className="callout-content">
            <h2 className="callout-title">Resin Table Tops</h2>
            <p className="callout-subtitle">Natural spaces.<br />Extraordinary results.</p>
            <a href="#table-tops" className="callout-btn-primary">
              Shop Table Tops <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Card 2: Workshop Essentials */}
        <div className="callout-card callout-workshop">
          <img
            src="/cat-protective.jpg"
            alt="Workshop Essentials - Pigments and Tools"
            className="callout-bg-img"
          />
          <div className="callout-overlay" />
          <div className="callout-content">
            <h2 className="callout-title">Workshop Essentials</h2>
            <p className="callout-subtitle">Tools. Pigments. Ideas.<br />Bring it to life.</p>
            <a href="#workshop" className="callout-btn-secondary">
              Shop Workshop <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
