import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const GermanyVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['germany-vat-calculator']} />;

export default GermanyVatCalculator;
