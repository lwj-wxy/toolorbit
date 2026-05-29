export type TaxCalculationMode = 'add' | 'remove';

export type TaxCalculationResult = {
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
  rateDecimal: number;
};

export const calculateTaxAmount = (amount: number, ratePercent: number) => amount * (ratePercent / 100);

export const calculateTaxFromNet = (netAmount: number, ratePercent: number): TaxCalculationResult => {
  const taxAmount = calculateTaxAmount(netAmount, ratePercent);
  const grossAmount = netAmount + taxAmount;

  return {
    netAmount,
    taxAmount,
    grossAmount,
    rateDecimal: ratePercent / 100,
  };
};

export const calculateTaxFromGross = (grossAmount: number, ratePercent: number): TaxCalculationResult => {
  const rateDecimal = ratePercent / 100;
  const netAmount = grossAmount / (1 + rateDecimal);
  const taxAmount = grossAmount - netAmount;

  return {
    netAmount,
    taxAmount,
    grossAmount,
    rateDecimal,
  };
};

export const calculateTaxResult = (
  amount: number,
  ratePercent: number,
  mode: TaxCalculationMode,
): TaxCalculationResult => {
  return mode === 'add'
    ? calculateTaxFromNet(amount, ratePercent)
    : calculateTaxFromGross(amount, ratePercent);
};

export const formatCurrencyAmount = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};
