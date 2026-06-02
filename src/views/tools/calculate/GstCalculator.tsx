import TaxCalculator from './TaxCalculator';
import { TAX_CALCULATOR_CONFIGS } from './tax-data';

const GstCalculator = () => <TaxCalculator config={TAX_CALCULATOR_CONFIGS['gst-calculator']} />;

export default GstCalculator;
