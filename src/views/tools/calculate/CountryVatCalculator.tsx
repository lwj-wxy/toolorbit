import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const CountryVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['country-vat-calculator']} />;

export default CountryVatCalculator;
