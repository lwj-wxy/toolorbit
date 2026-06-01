import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const NetherlandsVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['netherlands-vat-calculator']} />;

export default NetherlandsVatCalculator;
