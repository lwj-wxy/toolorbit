import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const IrelandVatCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['ireland-vat-calculator']} />;

export default IrelandVatCalculator;
