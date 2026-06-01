import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const SpainVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['spain-vat-calculator']} />;

export default SpainVatCalculator;
