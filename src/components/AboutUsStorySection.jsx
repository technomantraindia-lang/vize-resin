import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CHAPTERS = [
  {
    id: 'heritage',
    tabName: 'The Heritage',
    eyebrow: 'ABOUT VIZE POLYMERS',
    title: 'Precision chemistry for extraordinary spaces.',
    tagline: 'Born from a relentless obsession with molecular clarity and industrial resilience.',
    description:
      'VIZE Speciality Polymers reimagines resin formulation from the molecular foundation up. By engineering 100% solid cyclic polymers with zero solvent evaporants, our systems eliminate yellowing, micro-bubbling, and delamination across architectural and industrial applications.',
    points: [
      'Engineered in ISO-certified polymer formulation laboratories',
      'Proprietary UV-Shield™ cyclic matrix prevents ambering & hazing',
      'Tested to 99.9% crystal optical purity standard'
    ],
    stat: '15+',
    statLabel: 'Years Formulation R&D',
    caption: 'PURITY IN EVERY DROP. ZERO COMPROMISE.',
    image: '/rasin-explored.png',
    link: '/resins',
    linkText: 'Explore Resins'
  },
  {
    id: 'innovation',
    tabName: 'Zero-VOC Standard',
    eyebrow: 'FOOD-SAFE & NON-TOXIC',
    title: 'Extreme durability. Safe for living.',
    tagline: 'Where industrial-grade strength meets zero-emission indoor environmental safety.',
    description:
      'Every resin formulation we produce is 100% solid, solvent-free, and virtually odorless. Engineered for strict indoor air quality compliance, VIZE is certified for demanding bio-safety cleanrooms, food preparation facilities, luxury homes, and healthcare clinics.',
    points: [
      '100% Solids — zero VOC emission & solventless cure',
      'Monolithic non-porous antimicrobial surface density',
      'Ultra-high compressive yield exceeding 95+ MPa'
    ],
    stat: '0% VOC',
    statLabel: 'Solvent-Free & Eco Certified',
    caption: 'BIO-SAFE CLEANROOM & FOOD-GRADE DENSITY.',
    image: '/commercial.png',
    link: '/flooring-systems',
    linkText: 'Flooring Systems'
  },
  {
    id: 'academy',
    tabName: 'The Resineer Academy',
    eyebrow: 'HANDS-ON WORKSHOPS',
    title: 'Empowering master resin craftsmen.',
    tagline: 'We don’t just manufacture resin; we cultivate craftsmanship and trade expertise.',
    description:
      'Through the VIZE Resineer Training Academy and immersive hands-on workshops, we have trained over 2,500+ applicators, contractors, and luxury furniture artisans in advanced pouring techniques, metallic marbling, and precision substrate preparation.',
    points: [
      'Over 2,500+ certified Resineers trained across the country',
      'Hands-on masterclasses in river tables & decorative flooring',
      'Direct contractor technical hotline & trade discounts'
    ],
    stat: '2,500+',
    statLabel: 'Certified Resineers Trained',
    caption: 'TRAINING THE NEXT GENERATION OF CRAFTSMEN.',
    image: '/processes.JPG',
    link: '/workshop',
    linkText: 'Explore Workshops'
  },
  {
    id: 'endurance',
    tabName: 'Architectural Permanence',
    eyebrow: 'BUILT FOR DECADES',
    title: 'Surfaces engineered to defy time.',
    tagline: 'From boutique hotel lobbies to heavy-duty industrial aviation hangars.',
    description:
      'Whether creating custom river tables or casting seamless floors across international transit terminals, VIZE monolithic systems fuse permanently into the concrete substrate, resisting extreme point loads, chemical spills, and high-abrasion traffic for decades.',
    points: [
      'Monolithic substrate bond with zero peeling or flaking',
      'Resistant to heavy vehicular traffic, hot tires & chemical oils',
      'Backed by comprehensive 15-year integrity guarantees'
    ],
    stat: '1.8M+',
    statLabel: 'Sq. Ft. Installed Worldwide',
    caption: 'SURFACES BUILT FOR PERMANENCE.',
    image: '/Industrial Resin Flooring.png',
    link: '/our-work',
    linkText: 'View Our Work'
  }
];

export default function AboutUsStorySection() {
  const [activeTab, setActiveTab] = useState(0);

  const current = CHAPTERS[activeTab];

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % CHAPTERS.length);
  };

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
  };

  return (
    <section className="about-vize-section" id="about-us" aria-label="About VIZE Speciality Polymers">
      <div className="about-vize-container">
        
        {/* Section Top Eyebrow & Slider Controls */}
        <div className="about-vize-header-top">
          <div className="about-vize-eyebrow-wrap">
            <span className="about-vize-eyebrow-text">{current.eyebrow}</span>
            <span className="about-vize-eyebrow-line" />
          </div>

          <div className="about-vize-nav-controls">
            <button
              type="button"
              className="about-vize-nav-btn"
              onClick={handlePrev}
              aria-label="Previous Chapter"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="about-vize-counter">
              0{activeTab + 1} / 0{CHAPTERS.length}
            </span>
            <button
              type="button"
              className="about-vize-nav-btn"
              onClick={handleNext}
              aria-label="Next Chapter"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="about-vize-tabs" role="tablist">
          {CHAPTERS.map((chap, idx) => (
            <button
              key={chap.id}
              type="button"
              role="tab"
              aria-selected={activeTab === idx}
              className={`about-vize-tab-btn ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              {chap.tabName}
            </button>
          ))}
        </div>

        {/* Main 2-Column Grid (Matches Pigments & Process sections) */}
        <div className="about-vize-grid">
          
          {/* Left Column: Story Details */}
          <div className="about-vize-info-col">
            <h2 className="about-vize-title">
              {current.title}
            </h2>

            <p className="about-vize-tagline">
              {current.tagline}
            </p>

            <p className="about-vize-desc">
              {current.description}
            </p>

            <div className="about-vize-points-list">
              {current.points.map((pt, i) => (
                <div key={i} className="about-vize-point-item">
                  <div className="about-vize-point-check">
                    <Check size={14} />
                  </div>
                  <span className="about-vize-point-text">{pt}</span>
                </div>
              ))}
            </div>

            {/* CTA and Stat Row */}
            <div className="about-vize-footer-row">
              <Link to={current.link} className="about-vize-cta-btn">
                <span>{current.linkText}</span>
                <ArrowRight size={16} />
              </Link>

              <div className="about-vize-stat-pill">
                <span className="about-vize-stat-number">{current.stat}</span>
                <span className="about-vize-stat-label">{current.statLabel}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Banner Card */}
          <div className="about-vize-visual-col">
            <div className="about-vize-banner-card">
              <img
                key={current.image}
                src={current.image}
                alt={current.title}
                className="about-vize-banner-img"
                loading="lazy"
              />
              <div className="about-vize-banner-overlay">
                <span className="about-vize-badge-tag">{current.tabName}</span>
                <p className="about-vize-banner-caption">
                  {current.caption}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
