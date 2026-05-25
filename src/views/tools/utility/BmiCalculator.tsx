import { useMemo, useState } from 'react';
import { AlertTriangle, Ruler, Scale, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type Gender = 'female' | 'male';
type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

const parseNumericValue = (value: string) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const isInRange = (value: number | null, min: number, max: number) => {
  return value !== null && value >= min && value <= max;
};

const formatOneDecimal = (value: number) => {
  return value.toFixed(1);
};

const getBmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return 'underweight';
  if (bmi <= 24.9) return 'normal';
  if (bmi < 28) return 'overweight';
  return 'obese';
};

export default function BmiCalculator() {
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>('female');
  const [age, setAge] = useState('28');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');

  const ageValue = parseNumericValue(age);
  const heightValue = parseNumericValue(height);
  const weightValue = parseNumericValue(weight);
  const isAgeValid = isInRange(ageValue, 1, 130);
  const isHeightValid = isInRange(heightValue, 10, 200);
  const isWeightValid = isInRange(weightValue, 1, 500);
  const canCalculate = isAgeValid && isHeightValid && isWeightValid;

  const result = useMemo(() => {
    if (!canCalculate || heightValue === null || weightValue === null) return null;

    const heightMeters = heightValue / 100;
    const bmi = weightValue / (heightMeters * heightMeters);
    const healthyMinWeight = 18.5 * heightMeters * heightMeters;
    const healthyMaxWeight = 24.9 * heightMeters * heightMeters;
    const category = getBmiCategory(bmi);

    return {
      bmi,
      category,
      healthyMinWeight,
      healthyMaxWeight,
      belowHealthyWeight: Math.max(0, healthyMinWeight - weightValue),
      aboveHealthyWeight: Math.max(0, weightValue - healthyMaxWeight),
    };
  }, [canCalculate, heightValue, weightValue]);

  const categoryStyles: Record<BmiCategory, string> = {
    underweight: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300',
    normal: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
    overweight: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
    obese: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300',
  };
  const activeSegmentStyles: Record<BmiCategory, string> = {
    underweight: 'bg-sky-500 text-white shadow-sm',
    normal: 'bg-emerald-500 text-white shadow-sm',
    overweight: 'bg-amber-400 text-slate-950 shadow-sm',
    obese: 'bg-rose-500 text-white shadow-sm',
  };
  const categoryOrder: BmiCategory[] = ['underweight', 'normal', 'overweight', 'obese'];

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg font-semibold text-slate-950 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

  const healthHint = useMemo(() => {
    if (!result) return t('tools.bmi-calculator.waitingHint');
    if (result.belowHealthyWeight > 0) {
      return t('tools.bmi-calculator.gainHint', { value: formatOneDecimal(result.belowHealthyWeight) });
    }
    if (result.aboveHealthyWeight > 0) {
      return t('tools.bmi-calculator.reduceHint', { value: formatOneDecimal(result.aboveHealthyWeight) });
    }
    return t('tools.bmi-calculator.healthyHint');
  }, [result, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.bmi-calculator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.bmi-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.bmi-calculator.inputTitle')}
          </label>
          <div className="flex flex-1 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
              {(['female', 'male'] as Gender[]).map((genderOption) => (
                <button
                  key={genderOption}
                  type="button"
                  onClick={() => setGender(genderOption)}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                    gender === genderOption
                      ? 'bg-white text-cyan-700 shadow-sm dark:bg-[#282c34] dark:text-cyan-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                  )}
                >
                  <UserRound className="h-4 w-4" />
                  {t(`tools.bmi-calculator.gender.${genderOption}`)}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <UserRound className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.bmi-calculator.ageLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={130}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className={cn(inputClass, !isAgeValid && 'border-rose-300 focus:border-rose-500 dark:border-rose-900')}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.ageRange')}</p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Ruler className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.bmi-calculator.heightLabel')}
                </label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                  className={cn(inputClass, !isHeightValid && 'border-rose-300 focus:border-rose-500 dark:border-rose-900')}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.heightRange')}</p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Scale className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.bmi-calculator.weightLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className={cn(inputClass, !isWeightValid && 'border-rose-300 focus:border-rose-500 dark:border-rose-900')}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.weightRange')}</p>
              </div>
            </div>

            {!canCalculate ? (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t('tools.bmi-calculator.invalidHint')}</span>
              </div>
            ) : null}

            <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('tools.bmi-calculator.formulaTitle')}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.bmi-calculator.formulaText')}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.bmi-calculator.resultTitle')}
          </label>
          <div className="flex flex-1 flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.bmiLabel')}</p>
                <div className="mt-3 flex min-w-0 items-end gap-1.5">
                  <span className="font-mono text-[clamp(2.25rem,3vw,3rem)] font-semibold leading-none tracking-tight text-cyan-700 dark:text-cyan-300">
                    {result ? formatOneDecimal(result.bmi) : '--'}
                  </span>
                  <span className="mb-1 shrink-0 text-xs font-semibold text-slate-500 xl:text-sm">kg/m²</span>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.categoryLabel')}</p>
                <div className="mt-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-[20px] py-1.5 text-sm font-semibold',
                      result ? categoryStyles[result.category] : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800',
                    )}
                  >
                    {result ? t(`tools.bmi-calculator.categories.${result.category}`) : t('tools.bmi-calculator.waitingStatus')}
                  </span>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.bmi-calculator.healthyWeightLabel')}</p>
                <p className="mt-3 whitespace-nowrap font-mono text-[clamp(15px,1.15vw,20px)] font-semibold tracking-tight text-slate-950 dark:text-white">
                  {result
                    ? `${formatOneDecimal(result.healthyMinWeight)} - ${formatOneDecimal(result.healthyMaxWeight)} kg`
                    : '--'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{t('tools.bmi-calculator.scaleTitle')}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{healthHint}</p>
              </div>

              <div className="mt-7 grid grid-cols-4 gap-3">
                {categoryOrder.map((category) => {
                  const isActive = result?.category === category;

                  return (
                    <div
                      key={category}
                      className={cn(
                        'rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors',
                        isActive ? activeSegmentStyles[category] : 'text-slate-400 dark:text-slate-500',
                      )}
                    >
                      {t(`tools.bmi-calculator.categories.${category}`)}
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-5 pb-2">
                <div
                  className="h-3 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #38bdf8 0%, #38bdf8 22%, #22c55e 22%, #22c55e 54%, #facc15 54%, #facc15 70%, #fb923c 70%, #fb923c 82%, #ef4444 82%, #ef4444 100%)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:grid-cols-4">
                <span>{t('tools.bmi-calculator.categories.underweight')} &lt;18.5</span>
                <span>{t('tools.bmi-calculator.categories.normal')} 18.5-24.9</span>
                <span>{t('tools.bmi-calculator.categories.overweight')} 24.9-28.0</span>
                <span>{t('tools.bmi-calculator.categories.obese')} ≥28.0</span>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <p className="font-semibold">{t('tools.bmi-calculator.limitationTitle')}</p>
              <p className="mt-1">{t('tools.bmi-calculator.limitationText')}</p>
            </div>
          </div>
        </section>
      </div>

      <ToolSEOCard toolKey="bmi-calculator" />
    </div>
  );
}
