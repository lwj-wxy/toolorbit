import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const VatInclusiveExclusiveCalculator = () => (
  <TaxCalculator config={TAX_CALCULATOR_CONFIGS['vat-inclusive-exclusive-calculator']} />
);

export default VatInclusiveExclusiveCalculator;
