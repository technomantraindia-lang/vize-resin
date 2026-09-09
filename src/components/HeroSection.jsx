import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDown, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const VIDEO_SLIDES = [
  {
    id: 'metallic-flooring',
    tag: 'VIZE / METALLIC FLOORING',
    title: 'A seamless finish.',
    subtitle: 'A complete resin system.',
    linkText: 'Explore Flooring Systems',
    linkUrl: '/flooring-systems',
    videoSrc: '/hero-video.mp4',
  },
  {
    id: 'casting-art',
    tag: 'VIZE / CASTING & ART',
    title: 'Depth and clarity.',
    subtitle: 'Crafted for deep pours.',
    linkText: 'Explore Casting Resins',
    linkUrl: '/casting-art',
    videoSrc: '/hero-video-2.mp4',
  },
  {
    id: 'protective-coatings',
    tag: 'VIZE / PROTECTIVE COATINGS',
    title: 'Unmatched endurance.',
    subtitle: 'High-gloss surface shield.',
    linkText: 'Explore Protective Coatings',
    linkUrl: '/coatings',
    videoSrc: '/hero-video-3.mp4',
  },
];

// Smooth linear interpolation
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export default function HeroSection() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);

  // Transition thresholds — wide dead zones so you can "rest" on each card
  // 0% → 15%: Card 1 resting zone (nothing moves)
  // 15% → 30%: Transition Card 1 → Card 2
  // 30% → 65%: Card 2 resting zone (nothing moves)
  // 65% → 80%: Transition Card 2 → Card 3
  // 80% → 100%: Card 3 resting zone (nothing moves)
  const T1_START = 0.15, T1_END = 0.30;
  const T2_START = 0.65, T2_END = 0.80;

  const applyCardStyles = useCallback((progress) => {
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // Card 0: stays, scales down + dims when card 1 enters
    const card0 = cardRefs.current[0];
    if (card0) {
      const exitP = clamp((progress - T1_START) / (T1_END - T1_START), 0, 1);
      const scale = 1 - exitP * 0.05;
      const brightness = 1 - exitP * 0.3;
      card0.style.transform = `scale(${scale})`;
      card0.style.filter = `brightness(${brightness})`;
      card0.style.opacity = 1 - exitP * 0.5;
      card0.style.zIndex = 1;
    }

    // Card 1: rises from 130% to 0%, then recedes when card 2 enters
    const card1 = cardRefs.current[1];
    if (card1) {
      const enterP = clamp((progress - T1_START) / (T1_END - T1_START), 0, 1);
      const exitP = clamp((progress - T2_START) / (T2_END - T2_START), 0, 1);

      if (enterP <= 0) {
        card1.style.transform = 'translate3d(0, 130%, 0)';
        card1.style.opacity = 0;
        card1.style.filter = 'brightness(1)';
      } else {
        const riseY = (1 - enterP) * 130;
        const scaleDown = 1 - exitP * 0.05;
        card1.style.transform = `translate3d(0, ${riseY}%, 0) scale(${scaleDown})`;
        card1.style.opacity = 1 - exitP * 0.5;
        card1.style.filter = `brightness(${1 - exitP * 0.3})`;
      }
      card1.style.zIndex = 2;
    }

    // Card 2: rises from 130% to 0%
    const card2 = cardRefs.current[2];
    if (card2) {
      const enterP = clamp((progress - T2_START) / (T2_END - T2_START), 0, 1);

      if (enterP <= 0) {
        card2.style.transform = 'translate3d(0, 130%, 0)';
        card2.style.opacity = 0;
      } else {
        const riseY = (1 - enterP) * 130;
        card2.style.transform = `translate3d(0, ${riseY}%, 0)`;
        card2.style.opacity = 1;
      }
      card2.style.zIndex = 3;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      targetProgress.current = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    };

    // Smooth animation loop — lerps toward target for buttery motion
    const animate = () => {
      const diff = targetProgress.current - currentProgress.current;

      // Only update if there's meaningful difference
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.08);
        applyCardStyles(currentProgress.current);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    applyCardStyles(0);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [applyCardStyles]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      videoRefs.current.forEach((v) => { if (v) next ? v.play() : v.pause(); });
      return next;
    });
  };

  return (
    <div className="hero-scroll-track" ref={trackRef}>
      <div className="hero-sticky-frame">

        {/* ===== TOP TEXT (completely static) ===== */}
        <div className="hero-text-block">
          <div className="hero-text-inner">
            <div className="hero-top-grid">
              <div className="hero-top-left">
                <span className="hero-eyebrow">RESIN. REIMAGINED.</span>
                <h1 className="hero-title">
                  <span className="title-sans">Extraordinary surfaces.</span><br />
                  <span className="title-serif-italic">Start with Vize.</span>
                </h1>
              </div>
              <div className="hero-top-right">
                <div className="hero-info-card">
                  <div className="hero-info-line"></div>
                  <div className="hero-info-body">
                    <p className="hero-info-text">
                      Resin systems for flooring, casting and creative possibilities.
                    </p>
                    <Link to="/resins" className="btn-explore-resins">
                      <span>Explore Resins</span>
                      <ArrowUpRight size={17} strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== VIDEO CARDS (each is its own independent box) ===== */}
        <div className="hero-cards-area">
          {VIDEO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="hero-video-card"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={slide.videoSrc}
                autoPlay loop muted playsInline
                className="hero-main-video"
              />
              <div className="video-tag-pill"><span>{slide.tag}</span></div>
              <div className="video-bottom-left">
                <div className="video-quote-line"></div>
                <div className="video-quote-content">
                  <p className="video-quote-title">{slide.title}</p>
                  <p className="video-quote-subtitle">{slide.subtitle}</p>
                  <Link to={slide.linkUrl} className="video-quote-link">
                    <span>{slide.linkText}</span>
                    <ArrowUpRight size={15} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="hero-bottom-bar">
          <div className="bottom-categories">
            <span>Flooring</span><span className="slash">/</span>
            <span>Casting</span><span className="slash">/</span>
            <span>Art & Coatings</span>
          </div>
          <div className="bottom-divider-line"></div>
          <a href="#explore" className="scroll-to-explore">
            <span>Scroll to explore</span>
            <ArrowDown size={15} strokeWidth={1.8} />
          </a>
        </div>

      </div>
    </div>
  );
}
