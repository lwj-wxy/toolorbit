import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const ItalyVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['italy-vat-calculator']} />;

export default ItalyVatCalculator;
