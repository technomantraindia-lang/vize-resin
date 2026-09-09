import { ShieldCheck, Sparkles, Layers, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PILLARS = [
  {
    id: 'clarity',
    icon: Sparkles,
    stat: '99.8%',
    statLabel: 'Optical Clarity',
    title: 'Zero-Yellowing Purity',
    desc: 'Advanced UV-inhibitor matrices and ultra-pure cyclic polymers ensure crystal transparency that will never amber or haze under direct sunlight.',
    tag: 'Optical Grade',
  },
  {
    id: 'strength',
    icon: Layers,
    stat: '95+ MPa',
    statLabel: 'Compressive Strength',
    title: 'Monolithic Endurance',
    desc: 'Engineered for high-traffic commercial atriums and industrial facilities, resisting extreme abrasion, point loads, and aggressive chemical cleaners.',
    tag: 'Industrial Strength',
  },
  {
    id: 'flow',
    icon: ShieldCheck,
    stat: '0 Bubbles',
    statLabel: 'Self-Degassing',
    title: 'Flawless Fluid Dynamics',
    desc: 'Precision-calibrated surface tension promotes natural air-release and seamless self-leveling, giving artisans effortless marbling control.',
    tag: 'Artisan Control',
  },
  {
    id: 'synergy',
    icon: Award,
    stat: '15 Years',
    statLabel: 'System Warranty',
    title: 'End-to-End Chemistry',
    desc: 'From moisture-blocking primers to scratch-resistant nano topcoats, every Vize layer fuses at a molecular level for permanent adhesion.',
    tag: 'Certified Synergy',
  },
];

const METRICS = [
  { number: '1.2M+', label: 'Sq. Ft. Installed Worldwide' },
  { number: '0% VOC', label: 'Solvent-Free & Eco-Certified' },
  { number: '95+ MPa', label: 'Industrial Compressive Yield' },
  { number: '15 Yr', label: 'Integrity & Color Guarantee' },
];

export default function WhyChooseVizeSection() {
  return (
    <section className="why-vize-section" id="why-vize" aria-label="Why Choose Vize">
      <div className="why-vize-container">
        {/* Header Block */}
        <div className="why-vize-header">
          <div className="why-vize-eyebrow">
            <span className="why-vize-eyebrow-text">WHY CHOOSE VIZE</span>
            <span className="why-vize-eyebrow-line" />
          </div>

          <div className="why-vize-title-row">
            <h2 className="why-vize-title">
              Engineered for permanence.<br />
              Crafted for pure beauty.
            </h2>

            <p className="why-vize-lead">
              We engineer our chemical formulations in-house to exceed the stringent requirements of luxury architects, commercial specifiers, and bespoke artisans.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="why-vize-grid">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="why-vize-card">
                <div className="why-card-top">
                  <div className="why-icon-wrap">
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <span className="why-pill-tag">{pillar.tag}</span>
                </div>

                <div className="why-stat-box">
                  <span className="why-stat-num">{pillar.stat}</span>
                  <span className="why-stat-label">{pillar.statLabel}</span>
                </div>

                <h3 className="why-card-title">{pillar.title}</h3>
                <p className="why-card-desc">{pillar.desc}</p>
                
                <div className="why-card-glow" />
              </div>
            );
          })}
        </div>

        {/* Bottom Proof Metrics Bar */}
        <div className="why-vize-metrics-bar">
          <div className="why-metrics-grid">
            {METRICS.map((metric, idx) => (
              <div key={idx} className="why-metric-item">
                <span className="why-metric-number">{metric.number}</span>
                <span className="why-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="why-metrics-action">
            <div className="why-action-text">
              <span className="why-action-title">Experience the Vize standard.</span>
              <span className="why-action-sub">Order certified sample palettes or connect with our laboratory spec team.</span>
            </div>
            <Link to="/products" className="why-cta-btn">
              <span>Explore Collection</span>
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
