import React from 'react';

const LOGO_MAP = {
  'vize-prime': '/logos/Vize PrimeX PNG.png',
  'vize-polyscreed': '/logos/Vize Screed Max PNG.png',
  'vize-rock-hard': '/logos/Vize RockHard PNG.png',
  'vize-marble-metallics': '/logos/Vize EpoWrap.png',
  'vize-marble-slowpro': '/logos/Vize EpoWrap Pro.png',
  'vize-epowrap-max': '/logos/Vize EpoWrap Max.png',
  'vize-polyaspartic': '/logos/Vize Aspartic Max.png',
  'vize-glasscoat': '/logos/Vize UrethaneMax.png',
  'vize-cast': '/logos/Vize Cast Max.png',
  'vize-supercast': '/logos/Vize Cast Max.png',
  'vize-maxart': '/logos/Vize Art Max.png',
  'vize-cutmax': '/logos/Vize Nano PNG.png',
  'vize-shinemax': '/logos/Vize Nano PNG.png',
  // Standard product IDs fallback
  'primex': '/logos/Vize PrimeX PNG.png',
  'epowrap-pro': '/logos/Vize EpoWrap Pro.png',
  'epowrap-max': '/logos/Vize EpoWrap Max.png',
  'epowrap': '/logos/Vize EpoWrap.png',
  'art-max': '/logos/Vize Art Max.png',
  'aspartic-max': '/logos/Vize Aspartic Max.png',
  'cast-max': '/logos/Vize Cast Max.png',
  'rockhard': '/logos/Vize RockHard PNG.png',
  'screed-max': '/logos/Vize Screed Max PNG.png',
  'urethane-max': '/logos/Vize UrethaneMax.png',
  'nano-silicon': '/logos/Vize Nano PNG.png'
};

export default function ProductBucketVisual({ id, name }) {
  const logoSrc = LOGO_MAP[id] || '/logos/Vize PrimeX PNG.png';

  return (
    <div className="vize-logo-card-wrapper">
      <div className="vize-logo-studio-box">
        <img
          src={logoSrc}
          alt={`${name} Logo`}
          className="vize-product-brand-logo"
          loading="lazy"
        />
      </div>
    </div>
  );
}
