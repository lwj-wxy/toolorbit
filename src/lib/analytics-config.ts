export const DEFAULT_GA_MEASUREMENT_ID = 'G-B7N9BGZ2B0';

export const getGaMeasurementId = () =>
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
