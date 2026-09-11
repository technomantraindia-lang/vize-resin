import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PROCESS_STEPS = [
  {
    num: '01',
    name: 'Prepare',
    title: 'Diamond Grinding & Substrate Profiling',
    desc: 'Concrete is diamond ground to CSP-2/3 profile to open capillary pores, vacuumed dust-free, and moisture tested.'
  },
  {
    num: '02',
    name: 'Prime',
    title: 'Deep Penetrating Vize PrimeX',
    desc: 'Low-viscosity 100% solids epoxy primer seals substrate pores and eliminates outgassing pinholes for permanent bond strength.'
  },
  {
    num: '03',
    name: 'Build',
    title: 'Body Coat & Pigment / Screed Matrix',
    desc: 'Self-leveling resin body, metallic pigment flow or heavy-duty polyurethane mortar is hand-crafted to specified thickness.'
  },
  {
    num: '04',
    name: 'Protect',
    title: 'Aliphatic Polyaspartic / Urethane Shield',
    desc: 'Dual-pass clear topcoat provides extreme UV stability, scratch resistance, and chemical tolerance for decades of performance.'
  }
];

export default function TransformationSection() {
  const [activeProcessStep, setActiveProcessStep] = useState('02');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderContainerRef = useRef(null);

  // Handle Before/After slider dragging
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e) => {
    setIsDraggingSlider(true);
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    const handleMouseMove = (e) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSlider]);

  return (
    <section className="vize-work-transformation-section">
      <div className="vize-work-center-frame">
        
        <h2 className="vize-transform-headline">
          From worn substrate <em className="vize-transform-italic">to finished system.</em>
        </h2>

        <div className="vize-transform-grid">
          
          {/* Left Column: Interactive Before / After Split Slider */}
          <div
            className="vize-before-after-container"
            ref={sliderContainerRef}
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full Base Layer) */}
            <div className="vize-ba-layer after-base">
              <img
                src="/vize-floor-after.png"
                alt="Finished high-gloss seamless resin flooring system"
                className="vize-ba-img"
              />
              <div className="vize-ba-badge after">After</div>
            </div>

            {/* Before Image (Clipped Left Overlay) */}
            <div
              className="vize-ba-layer before-overlay"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
              }}
            >
              <img
                src="/vize-floor-before.png"
                alt="Worn unsealed concrete substrate before treatment"
                className="vize-ba-img"
              />
              <div className="vize-ba-badge before">Before</div>
            </div>

            {/* Draggable Divider Handle Line */}
            <div
              className="vize-ba-divider-line"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="vize-ba-handle-circle" aria-label="Drag comparison slider">
                <span>&lt;&nbsp;&gt;</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4-Step Connected Process List */}
          <div className="vize-transform-steps-col">
            <div className="vize-transform-steps-list">
              {PROCESS_STEPS.map((step) => {
                const isActive = activeProcessStep === step.num;

                return (
                  <div
                    key={step.num}
                    className={`vize-step-item-card ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveProcessStep(step.num)}
                  >
                    <div className="vize-step-item-header">
                      <span className="vize-step-item-num">{step.num}</span>
                      <span className="vize-step-item-name">{step.name}</span>
                    </div>

                    {isActive && (
                      <div className="vize-step-item-expanded">
                        <h4 className="vize-step-item-title">{step.title}</h4>
                        <p className="vize-step-item-desc">{step.desc}</p>
                      </div>
                    )}
                    
                    <div className="vize-step-item-bar" />
                  </div>
                );
              })}
            </div>

            {/* Direct Link */}
            <div className="vize-transform-footer-link">
              <Link to="/flooring-systems" className="vize-transform-cta-link">
                <span>See the complete flooring system</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
