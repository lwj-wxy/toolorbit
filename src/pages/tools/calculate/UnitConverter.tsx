import { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature';

const UNITS = {
  length: {
    name: '长度',
    units: {
      m: { name: '米 (m)', ratio: 1 },
      km: { name: '千米 (km)', ratio: 1000 },
      cm: { name: '厘米 (cm)', ratio: 0.01 },
      mm: { name: '毫米 (mm)', ratio: 0.001 },
      mile: { name: '英里 (mile)', ratio: 1609.344 },
      yard: { name: '码 (yard)', ratio: 0.9144 },
      foot: { name: '英尺 (foot)', ratio: 0.3048 },
      inch: { name: '英寸 (inch)', ratio: 0.0254 },
    }
  },
  weight: {
    name: '重量/质量',
    units: {
      kg: { name: '千克 (kg)', ratio: 1 },
      g: { name: '克 (g)', ratio: 0.001 },
      mg: { name: '毫克 (mg)', ratio: 0.000001 },
      t: { name: '吨 (t)', ratio: 1000 },
      lb: { name: '磅 (lb)', ratio: 0.45359237 },
      oz: { name: '盎司 (oz)', ratio: 0.028349523125 },
    }
  },
  volume: {
    name: '体积/容积',
    units: {
      l: { name: '升 (L)', ratio: 1 },
      ml: { name: '毫升 (mL)', ratio: 0.001 },
      m3: { name: '立方米 (m³)', ratio: 1000 },
      gal: { name: '美制加仑 (gal)', ratio: 3.785411784 },
      qt: { name: '美制夸脱 (qt)', ratio: 0.946352946 },
      pt: { name: '美制品脱 (pt)', ratio: 0.473176473 },
      cup: { name: '美制杯 (cup)', ratio: 0.236588236 },
      floz: { name: '美制液体盎司 (fl oz)', ratio: 0.0295735295625 },
    }
  },
  temperature: {
    name: '温度',
    units: {
      c: { name: '摄氏度 (°C)', ratio: 0 },
      f: { name: '华氏度 (°F)', ratio: 0 },
      k: { name: '开尔文 (K)', ratio: 0 },
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [inputValue, setInputValue] = useState<string>('1');

  // Switch category reset units
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
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

    const fromRatio = UNITS[category].units[fromUnit as keyof typeof UNITS[typeof category]['units']].ratio;
    const toRatio = UNITS[category].units[toUnit as keyof typeof UNITS[typeof category]['units']].ratio;
    
    // val * fromRatio = base_value
    // base_value / toRatio = output_value
    const out = (val * fromRatio) / toRatio;
    
    // limit precision nicely
    return Number.isInteger(out) ? out.toString() : parseFloat(out.toPrecision(10)).toString();
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">单位转换器</h1>
          <p className="text-[#64748b] mt-1 text-sm md:text-base">
            快速在长度、重量、体积、温度等各类计量单位间换算。
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto mb-8 custom-scrollbar">
          {(Object.entries(UNITS) as [UnitCategory, typeof UNITS[UnitCategory]][]).map(([cat, data]) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              {data.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* From */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-4">从 (From)</label>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="在此输入数值"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-orange-500"
              >
                {Object.entries(UNITS[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-orange-500 rounded-full shadow-sm hover:shadow transition-all"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          {/* To */}
          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
            <label className="block text-sm font-bold text-slate-700 mb-4">转换至 (To)</label>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                readOnly
                value={outputValue}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none text-slate-900 cursor-default"
                placeholder="换算结果"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-orange-500"
              >
                {Object.entries(UNITS[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">全能型网页单位转换器：涵盖物理与生活场景的精确推演</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          不论您是面对海外图纸习惯使用英制单位的建筑工程师，还是在照着国外食谱称量配料烘焙的美食家，快速打破由于地域及历史形成的度量衡单位壁垒是非常具有价值的。该内置工具箱提供了高精度的常量比对转换服务。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">关于纯净度量衡转换器的核心优点：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 即点即出的免计算体验：</strong>
            <span>相比在搜索引擎中到处寻找公式然后打开手机计算器疯狂按乘除，你只需要在这里输入对应标的基数，所有衍生出来的公制、英制、美制标准就会在侧边面板瞬间显现反馈。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 支持复合复杂的度量算法：</strong>
            <span>例如温度从华氏度 (°F) 到摄氏度 (°C) 并不是简单的乘法系数关联，而有复杂的截距常数。系统内置的转化器确保了这些具有极高严谨性物理公式的准确应用，免除手动推导痛苦。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 拒绝臃肿的聚合小程序：</strong>
            <span>如今想要使用汇率或者单位换算，人们往往被逼迫着去下载大量附带广告插件的清理 App。这是一块直接挂载在浏览器核心之上的原生纯净组件，为您的电脑和手机提供零侵扰的静默办公辅助。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          声明补充：浮点数在 JavaScript 编译运算中由于底层二进制精度截断问题，偶然可能会出现小数点后极多位数（比如十万分之一）层级的细微偏差，但这些精度损耗通常不会对您的实际业务应用造成阻碍。
        </p>
      </div>
    </div>
  );
}
