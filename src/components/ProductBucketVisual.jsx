import React from 'react';

const LOGO_MAP = {
  'vize-primex': '/logos/Vize PrimeX PNG.png',
  'vize-prime': '/logos/Vize PrimeX PNG.png',
  'primex': '/logos/Vize PrimeX PNG.png',

  'vize-screed-max': '/logos/Vize Screed Max PNG.png',
  'vize-polyscreed': '/logos/Vize Screed Max PNG.png',
  'vize-screed': '/logos/Vize Screed Max PNG.png',
  'screed-max': '/logos/Vize Screed Max PNG.png',

  'vize-rockhard': '/logos/Vize RockHard PNG.png',
  'vize-rock-hard': '/logos/Vize RockHard PNG.png',
  'rockhard': '/logos/Vize RockHard PNG.png',

  'vize-epowrap': '/logos/Vize EpoWrap.png',
  'vize-marble-metallics': '/logos/Vize EpoWrap.png',
  'epowrap': '/logos/Vize EpoWrap.png',

  'vize-epowrap-pro': '/logos/Vize EpoWrap Pro.png',
  'vize-marble-slowpro': '/logos/Vize EpoWrap Pro.png',
  'epowrap-pro': '/logos/Vize EpoWrap Pro.png',

  'vize-epowrap-max': '/logos/Vize EpoWrap Max.png',
  'epowrap-max': '/logos/Vize EpoWrap Max.png',

  'vize-aspartic-max': '/logos/Vize Aspartic Max.png',
  'vize-polyaspartic': '/logos/Vize Aspartic Max.png',
  'aspartic-max': '/logos/Vize Aspartic Max.png',

  'vize-urethane-max': '/logos/Vize UrethaneMax.png',
  'vize-glasscoat': '/logos/Vize UrethaneMax.png',
  'urethane-max': '/logos/Vize UrethaneMax.png',

  'vize-cast-max': '/logos/Vize Cast Max.png',
  'vize-cast': '/logos/Vize Cast Max.png',
  'vize-supercast': '/logos/Vize Cast Max.png',
  'cast-max': '/logos/Vize Cast Max.png',

  'vize-art-max': '/logos/Vize Art Max.png',
  'vize-maxart': '/logos/Vize Art Max.png',
  'art-max': '/logos/Vize Art Max.png',

  'vize-nano': '/logos/Vize Nano PNG.png',
  'vize-cutmax': '/logos/Vize Nano PNG.png',
  'vize-shinemax': '/logos/Vize Nano PNG.png',
  'nano-silicon': '/logos/Vize Nano PNG.png',
  'nano': '/logos/Vize Nano PNG.png'
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
