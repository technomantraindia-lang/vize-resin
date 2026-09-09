import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Which resin suits my project?',
    answer:
      'The ideal system depends on your substrate, expected traffic, and aesthetic vision. For high-traffic residential and commercial floors, Epowrap and our metallic epoxy systems provide exceptional durability and seamless elegance. For deep casting, river tables, and wood stabilization, our low-viscosity Art & Casting resins offer crystal clarity and ultra-low bubble retention.',
  },
  {
    id: 'faq-2',
    question: 'How do I choose a finish?',
    answer:
      'We offer Ultra-Gloss, Satin, and Matte protective topcoats. Ultra-Gloss amplifies pigment depth, metallic brilliance, and light reflection—ideal for luxury showrooms and statement living spaces. Satin and Matte finishes deliver a refined, contemporary look while offering superior concealment of everyday micro-abrasions.',
  },
  {
    id: 'faq-3',
    question: 'Where can I find application guides?',
    answer:
      'Comprehensive step-by-step guides, technical data sheets (TDS), mixing ratios, and application videos are available directly in our Education & Resources hub, downloadable under each product specification page, or via our technical support team.',
  },
  {
    id: 'faq-4',
    question: 'What is the typical cure time and working time?',
    answer:
      'Our standard epoxy systems feature a 30–45 minute working window at 22°C (72°F). Light foot traffic is typically safe after 24 hours, with full chemical and mechanical cure achieved within 7 days.',
  },
  {
    id: 'faq-5',
    question: 'Can Vizeresin systems be installed over existing tile or concrete?',
    answer:
      'Yes! With proper mechanical preparation (diamond grinding to CSP-2/3) and our deep-penetrating epoxy primer, our systems bond permanently over sound concrete, terrazzo, and properly abraded ceramic tile.',
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
      <div className="faq-container">
        {/* Left Column */}
        <div className="faq-left-col">
          <div className="faq-eyebrow-wrap">
            <span className="faq-eyebrow">FAQ</span>
            <span className="faq-eyebrow-line" />
          </div>
          <h2 className="faq-title">Before you choose your resin.</h2>
        </div>

        {/* Right Accordion List */}
        <div className="faq-right-col">
          <div className="faq-accordion-list">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? (
                        <Minus size={20} strokeWidth={1.5} />
                      ) : (
                        <Plus size={20} strokeWidth={1.5} />
                      )}
                    </span>
                  </button>
                  <div className={`faq-answer-collapse ${isOpen ? 'show' : ''}`}>
                    <div className="faq-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
