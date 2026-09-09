import { useState } from 'react';

const STEPS = [
  { num: '01', name: 'Prepare' },
  { num: '02', name: 'Prime' },
  { num: '03', name: 'Create' },
  { num: '04', name: 'Protect' },
  { num: '05', name: 'Finish' },
];

export default function CompleteSystemSection() {
  const [activeStep, setActiveStep] = useState('03');

  return (
    <section className="complete-system-section" id="system" aria-label="The Complete System">
      {/* Full-width background 3D Visual */}
      <div className="system-bg-frame">
        <img
          src="/rasin-explored.png"
          alt="The Complete System - Multi-layer Resin Floor"
          className="system-full-bg"
        />
        <div className="system-dark-gradient" />
      </div>

      {/* Content Layer */}
      <div className="system-content-layer">
        {/* Top Header */}
        <div className="system-header-area">
          <div className="system-title-box">
            <div className="system-eyebrow-wrap">
              <span className="system-eyebrow">THE COMPLETE SYSTEM</span>
              <span className="system-eyebrow-line" />
            </div>
            <h2 className="system-title">
              One floor.<br />
              A complete system.
            </h2>
          </div>
        </div>

        {/* Minimalist Connected Stepper Timeline Bar */}
        <div className="system-timeline-container">
          <div className="system-stepper-wrapper">
            {/* The single continuous line running across */}
            <div className="system-timeline-track">
              {STEPS.map((step, idx) => {
                const isSelected = activeStep === step.num;
                return (
                  <div key={step.num} className="system-timeline-step-group">
                    {idx > 0 && <div className={`system-connector-line ${parseInt(activeStep, 10) >= parseInt(step.num, 10) ? 'active' : ''}`} />}
                    <button
                      type="button"
                      className={`system-timeline-node ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveStep(step.num)}
                      aria-label={`Step ${step.num}: ${step.name}`}
                    >
                      <div className="timeline-node-circle">
                        <span className="timeline-node-num">{step.num}</span>
                        {isSelected && <span className="timeline-pulse-ring" />}
                      </div>
                      <span className="timeline-node-label">{step.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Tagline */}
            <div className="system-tagline-col">
              <div className="system-tagline-line" />
              <div className="system-tagline-text">
                <p>Seamless results.</p>
                <p>Built to last.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

