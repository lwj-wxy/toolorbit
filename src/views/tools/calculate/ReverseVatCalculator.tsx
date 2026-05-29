import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const ReverseVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['reverse-vat-calculator']} />;

export default ReverseVatCalculator;
