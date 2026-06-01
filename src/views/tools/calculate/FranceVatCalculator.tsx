import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const FranceVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['france-vat-calculator']} />;

export default FranceVatCalculator;
