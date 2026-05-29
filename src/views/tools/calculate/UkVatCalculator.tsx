import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const UkVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['uk-vat-calculator']} />;

export default UkVatCalculator;
