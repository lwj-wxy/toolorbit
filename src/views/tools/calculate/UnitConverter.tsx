import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft } from 'lucide-react';
import { analytics } from '../../../services/analytics';
import ToolSEOCard from '../../../components/ToolSEOCard';

type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature';

export default function UnitConverter() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [inputValue, setInputValue] = useState<string>('1');

  const UNITS_CONFIG = useMemo(() => ({
    length: {
      name: t('tools.unit-converter.length'),
      units: {
        m: { name: 'Meter (m)', ratio: 1 },
        km: { name: 'Kilometer (km)', ratio: 1000 },
        cm: { name: 'Centimeter (cm)', ratio: 0.01 },
        mm: { name: 'Millimeter (mm)', ratio: 0.001 },
        mile: { name: 'Mile (mile)', ratio: 1609.344 },
        yard: { name: 'Yard (yard)', ratio: 0.9144 },
        foot: { name: 'Foot (foot)', ratio: 0.3048 },
        inch: { name: 'Inch (inch)', ratio: 0.0254 },
      }
    },
    weight: {
      name: t('tools.unit-converter.weight'),
      units: {
        kg: { name: 'Kilogram (kg)', ratio: 1 },
        g: { name: 'Gram (g)', ratio: 0.001 },
        mg: { name: 'Milligram (mg)', ratio: 0.000001 },
        t: { name: 'Metric Ton (t)', ratio: 1000 },
        lb: { name: 'Pound (lb)', ratio: 0.45359237 },
        oz: { name: 'Ounce (oz)', ratio: 0.028349523125 },
      }
    },
    volume: {
      name: t('tools.unit-converter.volume'),
      units: {
        l: { name: 'Liter (L)', ratio: 1 },
        ml: { name: 'Milliliter (mL)', ratio: 0.001 },
        m3: { name: 'Cubic Meter (m³)', ratio: 1000 },
        gal: { name: 'US Gallon (gal)', ratio: 3.785411784 },
        qt: { name: 'US Quart (qt)', ratio: 0.946352946 },
        pt: { name: 'US Pint (pt)', ratio: 0.473176473 },
        cup: { name: 'US Cup (cup)', ratio: 0.236588236 },
        floz: { name: 'US Fluid Ounce (fl oz)', ratio: 0.0295735295625 },
      }
    },
    temperature: {
      name: t('tools.unit-converter.temperature'),
      units: {
        c: { name: 'Celsius (°C)', ratio: 0 },
        f: { name: 'Fahrenheit (°F)', ratio: 0 },
        k: { name: 'Kelvin (K)', ratio: 0 },
      }
    }
  }), [t]);

  // Switch category reset units
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS_CONFIG[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);

    analytics.trackEvent({
      category: 'Calculation Tools',
      action: 'Change Unit Category',
      label: cat
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);

    analytics.trackEvent({
      category: 'Calculation Tools',
      action: 'Swap Units',
      label: `${toUnit} <-> ${fromUnit}`
    });
  };

  const convertTemperature = (val: number, from: string, to: string) => {
    let c = val;
    // convert from to C
    if (from === 'f') c = (val - 32) * 5 / 9;
    else if (from === 'k') c = val - 273.15;

    // convert C to to
    if (to === 'f') return c * 9 / 5 + 32;
    if (to === 'k') return c + 273.15;
    return c;
  };

  const outputValue = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';

    if (category === 'temperature') {
      return convertTemperature(val, fromUnit, toUnit).toPrecision(8).replace(/\.?0+$/, '');
    }

    const fromRatio = (UNITS_CONFIG[category].units as any)[fromUnit].ratio;
    const toRatio = (UNITS_CONFIG[category].units as any)[toUnit].ratio;
    
    // val * fromRatio = base_value
    // base_value / toRatio = output_value
    const out = (val * fromRatio) / toRatio;
    
    if (!isNaN(out)) {
      analytics.trackEvent({
        category: 'Calculation Tools',
        action: 'Convert Units',
        label: `${fromUnit} to ${toUnit}`,
        metadata: { category, value: val }
      });
    }

    // limit precision nicely
    return Number.isInteger(out) ? out.toString() : parseFloat(out.toPrecision(10)).toString();
  }, [inputValue, fromUnit, toUnit, category, UNITS_CONFIG]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.unit-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.unit-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.unit-converter.fromLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="mb-5 flex gap-2 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
              {(Object.entries(UNITS_CONFIG) as [UnitCategory, typeof UNITS_CONFIG[UnitCategory]][]).map(([cat, data]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                    category === cat
                      ? 'bg-white text-cyan-700 shadow-sm dark:bg-[#282c34] dark:text-cyan-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-2xl font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder={t('tools.unit-converter.inputPlaceholder')}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {Object.entries(UNITS_CONFIG[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapUnits}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Swap units"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.unit-converter.toLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-5">
              <input
                type="text"
                readOnly
                value={outputValue}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-4 font-mono text-2xl font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
                placeholder={t('tools.unit-converter.outputPlaceholder')}
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              >
                {Object.entries(UNITS_CONFIG[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-auto rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{UNITS_CONFIG[category].name}</div>
              <div className="mt-3 break-all font-mono text-3xl font-semibold text-cyan-700 dark:text-cyan-300">
                {outputValue || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="unit-converter" />
    </div>
  );
}
