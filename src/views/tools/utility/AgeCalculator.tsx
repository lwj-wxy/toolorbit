import { useEffect, useMemo, useState } from 'react';
import { DatePicker } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { Dayjs } from 'dayjs';
import { CalendarDays, Clock3, Hourglass, TimerReset } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DAY_MS = 24 * 60 * 60 * 1000;

const padDatePart = (value: number) => value.toString().padStart(2, '0');

const formatDateInput = (date: Date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
};

const parseDateInput = (value: string) => {
  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;

  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const daysInMonth = (year: number, monthIndex: number) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const calculateAgeParts = (birthDate: Date, today: Date) => {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthIndex = today.getMonth() - 1;
    const previousMonthYear = previousMonthIndex < 0 ? today.getFullYear() - 1 : today.getFullYear();
    const normalizedPreviousMonth = previousMonthIndex < 0 ? 11 : previousMonthIndex;
    days += daysInMonth(previousMonthYear, normalizedPreviousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

const calculateNextBirthday = (birthDate: Date, today: Date) => {
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const daysUntilNextBirthday = Math.round((nextBirthday.getTime() - today.getTime()) / DAY_MS);
  return { nextBirthday, daysUntilNextBirthday };
};

export default function AgeCalculator() {
  const { t, i18n } = useTranslation();
  const today = useMemo(() => startOfToday(), []);
  const [birthDateInput, setBirthDateInput] = useState('2000-01-01');
  const isZh = i18n.language?.startsWith('zh');
  const dayjsLocale = isZh ? 'zh-cn' : 'en';
  const todayValue = useMemo(() => dayjs(formatDateInput(today), 'YYYY-MM-DD').locale(dayjsLocale), [dayjsLocale, today]);
  const selectedBirthDateValue = useMemo(() => dayjs(birthDateInput, 'YYYY-MM-DD').locale(dayjsLocale), [birthDateInput, dayjsLocale]);

  useEffect(() => {
    dayjs.locale(dayjsLocale);
  }, [dayjsLocale]);

  const result = useMemo(() => {
    const birthDate = parseDateInput(birthDateInput);
    if (!birthDate || birthDate > today) return null;

    const ageParts = calculateAgeParts(birthDate, today);
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / DAY_MS);
    const nextBirthday = calculateNextBirthday(birthDate, today);

    return {
      birthDate,
      ageParts,
      totalDays,
      nextBirthday: nextBirthday.nextBirthday,
      daysUntilNextBirthday: nextBirthday.daysUntilNextBirthday,
    };
  }, [birthDateInput, today]);

  const isInvalidDate = !result;

  const disabledDate = (currentDate: Dayjs) => {
    return currentDate.startOf('day').isAfter(todayValue);
  };

  const handleBirthDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirthDateInput(date.format('YYYY-MM-DD'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.age-calculator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.age-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.age-calculator.inputTitle')}
          </label>
          <div className="flex flex-1 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <CalendarDays className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              {t('tools.age-calculator.birthDateLabel')}
            </label>
            <DatePicker
              allowClear={false}
              className="age-date-picker w-full font-mono text-base font-semibold"
              disabledDate={disabledDate}
              format="YYYY / MM / DD"
              inputReadOnly
              key={dayjsLocale}
              locale={isZh ? zhCN : undefined}
              onChange={handleBirthDateChange}
              size="large"
              status={isInvalidDate ? 'error' : undefined}
              style={{ height: 58 }}
              suffixIcon={<CalendarDays className="h-4 w-4 text-cyan-600" />}
              value={selectedBirthDateValue}
            />
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('tools.age-calculator.todayLabel', { date: formatDateInput(today) })}
            </p>

            {isInvalidDate ? (
              <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                {t('tools.age-calculator.invalidHint')}
              </div>
            ) : null}

            <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('tools.age-calculator.methodTitle')}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.age-calculator.methodText')}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.age-calculator.resultTitle')}
          </label>
          <div className="flex flex-1 flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.age-calculator.ageLabel')}</p>
                <p className="mt-3 font-mono text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-none tracking-tight text-cyan-700 dark:text-cyan-300">
                  {result ? result.ageParts.years : '--'}
                  <span className="ml-1 text-sm font-semibold text-slate-500">{t('tools.age-calculator.yearsUnit')}</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.age-calculator.totalDaysLabel')}</p>
                <p className="mt-3 whitespace-nowrap font-mono text-[clamp(1.35rem,2vw,2rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
                  {result ? result.totalDays.toLocaleString() : '--'}
                  <span className="ml-1 text-sm font-semibold text-slate-500">{t('tools.age-calculator.daysUnit')}</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.age-calculator.nextBirthdayLabel')}</p>
                <p className="mt-3 whitespace-nowrap font-mono text-[clamp(1.25rem,1.7vw,1.7rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
                  {result ? result.daysUntilNextBirthday : '--'}
                  <span className="ml-1 text-sm font-semibold text-slate-500">{t('tools.age-calculator.daysUnit')}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-1 h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{t('tools.age-calculator.preciseAgeTitle')}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    {result
                      ? t('tools.age-calculator.preciseAgeText', {
                          years: result.ageParts.years,
                          months: result.ageParts.months,
                          days: result.ageParts.days,
                        })
                      : '--'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Hourglass className="h-4 w-4" />
                  {t('tools.age-calculator.birthDateCardTitle')}
                </div>
                <p className="font-mono text-base font-semibold">{result ? formatDateInput(result.birthDate) : '--'}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <TimerReset className="h-4 w-4" />
                  {t('tools.age-calculator.nextBirthdayDateTitle')}
                </div>
                <p className="font-mono text-base font-semibold">{result ? formatDateInput(result.nextBirthday) : '--'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
