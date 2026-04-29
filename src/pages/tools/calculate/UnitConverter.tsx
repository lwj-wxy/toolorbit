import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft, Calculator } from 'lucide-react';
import { analytics } from '../../../services/analytics';

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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.unit-converter.title')}</h1>
          <p className="text-[#64748b] mt-1 text-sm md:text-base">
            {t('tools.unit-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-full flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto mb-8 custom-scrollbar justify-start sm:justify-center">
          {(Object.entries(UNITS_CONFIG) as [UnitCategory, typeof UNITS_CONFIG[UnitCategory]][]).map(([cat, data]) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                category === cat 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              {data.name}
            </button>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* From */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">{t('tools.unit-converter.fromLabel')}</label>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-2xl font-mono font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                placeholder={t('tools.unit-converter.inputPlaceholder')}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-slate-700 font-bold outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm appearance-none"
              >
                {Object.entries(UNITS_CONFIG[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-5 bg-white border-2 border-slate-200 text-slate-400 hover:text-orange-600 rounded-full shadow-lg hover:shadow-xl hover:-rotate-180 transition-all duration-500"
            >
              <ArrowRightLeft className="w-8 h-8" />
            </button>
          </div>

          {/* To */}
          <div className="bg-orange-50/50 p-6 rounded-3xl border-2 border-orange-100 shadow-sm">
            <label className="block text-sm font-bold text-orange-600/70 uppercase tracking-wider mb-4 px-1">{t('tools.unit-converter.toLabel')}</label>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                readOnly
                value={outputValue}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-2xl font-mono font-bold outline-none text-slate-900 cursor-default shadow-sm"
                placeholder={t('tools.unit-converter.outputPlaceholder')}
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-slate-700 font-bold outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm appearance-none"
              >
                {Object.entries(UNITS_CONFIG[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-8 mt-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl animate-pulse" />
        
        <h2 className="text-2xl font-extrabold text-slate-800 mb-8 relative z-10">{t('tools.unit-converter.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed text-lg relative z-10">
          {t('tools.unit-converter.seoDesc1')}
        </p>

        <h3 className="font-black text-slate-800 text-xl mb-6 relative z-10">{t('tools.unit-converter.seoHighlightsTitle')}</h3>
        <ul className="space-y-6 text-slate-600 relative z-10">
          <li className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0 font-black">1</div>
            <div>
              <strong className="text-slate-800 block mb-1 text-lg">{t('tools.unit-converter.highlight1Title')}</strong>
              <span className="leading-relaxed">{t('tools.unit-converter.highlight1Desc')}</span>
            </div>
          </li>
          <li className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0 font-black">2</div>
            <div>
              <strong className="text-slate-800 block mb-1 text-lg">{t('tools.unit-converter.highlight2Title')}</strong>
              <span className="leading-relaxed">{t('tools.unit-converter.highlight2Desc')}</span>
            </div>
          </li>
          <li className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0 font-black">3</div>
            <div>
              <strong className="text-slate-800 block mb-1 text-lg">{t('tools.unit-converter.highlight3Title')}</strong>
              <span className="leading-relaxed">{t('tools.unit-converter.highlight3Desc')}</span>
            </div>
          </li>
        </ul>
        
        <p className="text-slate-400 text-sm mt-10 pt-8 border-t border-slate-100 italic">
          {t('tools.unit-converter.seoFooter')}
        </p>
      </div>
    </div>
  );
}
