export default function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Pour',
      description: 'Precision resins for limitless possibilities.',
    },
    {
      num: '02',
      title: 'Shape',
      description: 'Expertly applied for flawless results.',
    },
    {
      num: '03',
      title: 'Transform',
      description: 'Surfaces that inspire for years to come.',
    },
  ];

  return (
    <section className="process-section" id="process" aria-label="The Process">
      <div className="process-container">
        <div className="process-grid">
          {/* Left Column: Heading and 3 numbered steps */}
          <div className="process-info-col">
            <div className="process-eyebrow-wrap">
              <span className="process-eyebrow">THE PROCESS</span>
              <span className="process-eyebrow-line" />
            </div>

            <h2 className="process-title">
              From liquid.<br />
              To extraordinary.
            </h2>

            <div className="process-steps-list">
              {steps.map((step) => (
                <div key={step.num} className="process-step-item">
                  <span className="process-step-num">{step.num}</span>
                  <div className="process-step-content">
                    <h4 className="process-step-title">{step.title}</h4>
                    <p className="process-step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column / Left Visual Card: Process in Action */}
          <div className="process-visual-card">
            <img
              src="/processes.JPG"
              alt="Live resin crafting and workshop process"
              className="process-visual-img"
              loading="lazy"
            />
            <div className="process-card-overlay">
              <p className="process-card-caption">
                IDEAS FLOW.<br />
                POSSIBILITIES TAKE SHAPE.
              </p>
            </div>
          </div>

          {/* Right Column: Finishing Floor Visual Card */}
          <div className="process-visual-card">
            <img
              src="/process-trowel.jpg"
              alt="Epoxy floor surface application"
              className="process-visual-img"
              loading="lazy"
            />
            <div className="process-card-overlay">
              <p className="process-card-caption">
                MORE THAN A FLOOR.<br />
                A TRANSFORMATION.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
