export const ETSY_CURRENCY_CONVERSION_RATE = 0.025;

export const ETSY_REGULATORY_RATES = [
  { key: 'none', rate: 0 },
  { key: 'uk', rate: 0.0032 },
  { key: 'france', rate: 0.0047 },
  { key: 'italy', rate: 0.0032 },
  { key: 'india', rate: 0.0029 },
  { key: 'spain', rate: 0.0072 },
  { key: 'turkiye', rate: 0.0227 },
  { key: 'vietnam', rate: 0.0124 },
  { key: 'canada', rate: 0.005 },
] as const;
