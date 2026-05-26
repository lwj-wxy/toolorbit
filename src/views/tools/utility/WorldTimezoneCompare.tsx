import { useMemo, useState, type ChangeEvent } from 'react';
import Fuse from 'fuse.js';
import { CalendarClock, Clock3, Globe2, LayoutGrid, ListFilter, RotateCcw, Search, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type ViewMode = 'cards' | 'timeline';

type TimezoneOffset = {
  id: string;
  offsetMinutes: number;
  label: string;
  flag: string;
  regions: string;
};

const DAY_MINUTES = 24 * 60;

const TIMEZONE_OFFSETS: TimezoneOffset[] = [
  { id: 'utc-minus-12', offsetMinutes: -720, label: 'UTC-12:00', flag: '🇺🇸', regions: 'Baker Island, Howland Island' },
  { id: 'utc-minus-11', offsetMinutes: -660, label: 'UTC-11:00', flag: '🇦🇸', regions: 'American Samoa, Niue' },
  { id: 'utc-minus-10', offsetMinutes: -600, label: 'UTC-10:00', flag: '🇺🇸', regions: 'Hawaii, French Polynesia' },
  { id: 'utc-minus-0930', offsetMinutes: -570, label: 'UTC-09:30', flag: '🇵🇫', regions: 'Marquesas Islands' },
  { id: 'utc-minus-09', offsetMinutes: -540, label: 'UTC-09:00', flag: '🇺🇸', regions: 'Alaska, Gambier Islands' },
  { id: 'utc-minus-08', offsetMinutes: -480, label: 'UTC-08:00', flag: '🇺🇸', regions: 'Pacific Time - Los Angeles, Vancouver' },
  { id: 'utc-minus-07', offsetMinutes: -420, label: 'UTC-07:00', flag: '🇺🇸', regions: 'Mountain Time - Denver, Phoenix' },
  { id: 'utc-minus-06', offsetMinutes: -360, label: 'UTC-06:00', flag: '🇺🇸', regions: 'Central Time - Chicago, Mexico City' },
  { id: 'utc-minus-05', offsetMinutes: -300, label: 'UTC-05:00', flag: '🇺🇸', regions: 'Eastern Time - New York, Toronto' },
  { id: 'utc-minus-04', offsetMinutes: -240, label: 'UTC-04:00', flag: '🇨🇦', regions: 'Atlantic Time, Caracas, Santiago' },
  { id: 'utc-minus-0330', offsetMinutes: -210, label: 'UTC-03:30', flag: '🇨🇦', regions: 'Newfoundland' },
  { id: 'utc-minus-03', offsetMinutes: -180, label: 'UTC-03:00', flag: '🇦🇷', regions: 'Buenos Aires, Sao Paulo, Montevideo' },
  { id: 'utc-minus-02', offsetMinutes: -120, label: 'UTC-02:00', flag: '🇬🇸', regions: 'South Georgia, Mid-Atlantic' },
  { id: 'utc-minus-01', offsetMinutes: -60, label: 'UTC-01:00', flag: '🇵🇹', regions: 'Azores, Cape Verde' },
  { id: 'utc-plus-00', offsetMinutes: 0, label: 'UTC+00:00', flag: '🇬🇧', regions: 'London, Lisbon, Accra' },
  { id: 'utc-plus-01', offsetMinutes: 60, label: 'UTC+01:00', flag: '🇩🇪', regions: 'Berlin, Paris, Madrid' },
  { id: 'utc-plus-02', offsetMinutes: 120, label: 'UTC+02:00', flag: '🇪🇬', regions: 'Cairo, Johannesburg, Kyiv' },
  { id: 'utc-plus-03', offsetMinutes: 180, label: 'UTC+03:00', flag: '🇷🇺', regions: 'Moscow, Istanbul, Riyadh' },
  { id: 'utc-plus-0330', offsetMinutes: 210, label: 'UTC+03:30', flag: '🇮🇷', regions: 'Tehran' },
  { id: 'utc-plus-04', offsetMinutes: 240, label: 'UTC+04:00', flag: '🇦🇪', regions: 'Dubai, Baku' },
  { id: 'utc-plus-0430', offsetMinutes: 270, label: 'UTC+04:30', flag: '🇦🇫', regions: 'Kabul' },
  { id: 'utc-plus-05', offsetMinutes: 300, label: 'UTC+05:00', flag: '🇵🇰', regions: 'Karachi, Tashkent' },
  { id: 'utc-plus-0530', offsetMinutes: 330, label: 'UTC+05:30', flag: '🇮🇳', regions: 'India, Sri Lanka' },
  { id: 'utc-plus-0545', offsetMinutes: 345, label: 'UTC+05:45', flag: '🇳🇵', regions: 'Nepal' },
  { id: 'utc-plus-06', offsetMinutes: 360, label: 'UTC+06:00', flag: '🇧🇩', regions: 'Dhaka, Almaty' },
  { id: 'utc-plus-0630', offsetMinutes: 390, label: 'UTC+06:30', flag: '🇲🇲', regions: 'Yangon, Cocos Islands' },
  { id: 'utc-plus-07', offsetMinutes: 420, label: 'UTC+07:00', flag: '🇹🇭', regions: 'Bangkok, Jakarta, Hanoi' },
  { id: 'utc-plus-08', offsetMinutes: 480, label: 'UTC+08:00', flag: '🇨🇳', regions: 'Beijing, Singapore, Manila' },
  { id: 'utc-plus-0845', offsetMinutes: 525, label: 'UTC+08:45', flag: '🇦🇺', regions: 'Eucla' },
  { id: 'utc-plus-09', offsetMinutes: 540, label: 'UTC+09:00', flag: '🇯🇵', regions: 'Tokyo, Seoul' },
  { id: 'utc-plus-0930', offsetMinutes: 570, label: 'UTC+09:30', flag: '🇦🇺', regions: 'Darwin, Adelaide' },
  { id: 'utc-plus-10', offsetMinutes: 600, label: 'UTC+10:00', flag: '🇦🇺', regions: 'Sydney, Guam, Port Moresby' },
  { id: 'utc-plus-1030', offsetMinutes: 630, label: 'UTC+10:30', flag: '🇦🇺', regions: 'Lord Howe Island' },
  { id: 'utc-plus-11', offsetMinutes: 660, label: 'UTC+11:00', flag: '🇸🇧', regions: 'Solomon Islands, New Caledonia' },
  { id: 'utc-plus-12', offsetMinutes: 720, label: 'UTC+12:00', flag: '🇳🇿', regions: 'Auckland, Fiji' },
  { id: 'utc-plus-1245', offsetMinutes: 765, label: 'UTC+12:45', flag: '🇳🇿', regions: 'Chatham Islands' },
  { id: 'utc-plus-13', offsetMinutes: 780, label: 'UTC+13:00', flag: '🇼🇸', regions: 'Samoa, Tonga, Tokelau' },
  { id: 'utc-plus-14', offsetMinutes: 840, label: 'UTC+14:00', flag: '🇰🇮', regions: 'Kiritimati, Line Islands' },
];

const normalizeMinutes = (minutes: number) => {
  return ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
};

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const padTimePart = (value: number) => value.toString().padStart(2, '0');

const formatClockTime = (minutes: number, use24Hour: boolean) => {
  const normalizedMinutes = normalizeMinutes(minutes);
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;

  if (use24Hour) {
    return `${padTimePart(hours)}:${padTimePart(mins)}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${padTimePart(mins)} ${period}`;
};

const formatHourMinuteDelta = (minutes: number, isZh: boolean) => {
  if (minutes === 0) return isZh ? '相同时间' : 'same time';

  const absoluteMinutes = Math.abs(minutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const mins = absoluteMinutes % 60;
  const timeText = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

  return minutes > 0 ? (isZh ? `${timeText} 超前` : `${timeText} ahead`) : (isZh ? `${timeText} 落后` : `${timeText} behind`);
};

const getDayDeltaLabel = (dayDelta: number, isZh: boolean) => {
  if (dayDelta === 0) return '';
  if (isZh) {
    if (dayDelta === -1) return '前一天';
    if (dayDelta === 1) return '次日';
    return dayDelta > 0 ? `+${dayDelta} 天` : `${dayDelta} 天`;
  }

  if (dayDelta === -1) return 'previous day';
  if (dayDelta === 1) return 'next day';
  return dayDelta > 0 ? `+${dayDelta} days` : `${dayDelta} days`;
};

const formatReferenceDate = (dayDelta: number, isZh: boolean) => {
  const date = new Date();
  date.setDate(date.getDate() + dayDelta);

  return new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const getTimelinePosition = (minutes: number) => {
  return `${(normalizeMinutes(minutes) / DAY_MINUTES) * 100}%`;
};

export default function WorldTimezoneCompare() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [searchQuery, setSearchQuery] = useState('');
  const [referenceOffsetMinutes, setReferenceOffsetMinutes] = useState(480);
  const [referenceMinutes, setReferenceMinutes] = useState(() => getCurrentMinutes());
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [use24Hour, setUse24Hour] = useState(true);

  const referenceTimezone = useMemo(
    () => TIMEZONE_OFFSETS.find((timezone) => timezone.offsetMinutes === referenceOffsetMinutes) || TIMEZONE_OFFSETS[27],
    [referenceOffsetMinutes],
  );
  const timezoneSearch = useMemo(
    () =>
      new Fuse(TIMEZONE_OFFSETS, {
        keys: ['label', 'regions'],
        threshold: 0.34,
        ignoreLocation: true,
      }),
    [],
  );
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const matchingTimezoneIds = useMemo(() => {
    if (!normalizedSearchQuery) return null;

    const exactMatches = TIMEZONE_OFFSETS.filter((timezone) => {
      const offsetText = timezone.label.replace('UTC', '').toLowerCase();
      return timezone.label.toLowerCase().includes(normalizedSearchQuery) || offsetText.includes(normalizedSearchQuery);
    });
    const fuzzyMatches = timezoneSearch.search(normalizedSearchQuery).map((result) => result.item);

    return new Set([...exactMatches, ...fuzzyMatches].map((timezone) => timezone.id));
  }, [normalizedSearchQuery, timezoneSearch]);
  const convertedTimezones = useMemo(() => {
    const utcMinutes = referenceMinutes - referenceOffsetMinutes;

    return TIMEZONE_OFFSETS.map((timezone) => {
      const absoluteMinutes = utcMinutes + timezone.offsetMinutes;
      const dayDelta = Math.floor(absoluteMinutes / DAY_MINUTES);

      return {
        ...timezone,
        localMinutes: normalizeMinutes(absoluteMinutes),
        dayDelta,
        differenceMinutes: timezone.offsetMinutes - referenceOffsetMinutes,
      };
    }).filter((timezone) => {
      if (!matchingTimezoneIds) return true;

      return matchingTimezoneIds.has(timezone.id);
    });
  }, [matchingTimezoneIds, referenceMinutes, referenceOffsetMinutes]);

  const handleReferenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setReferenceOffsetMinutes(Number(event.target.value));
  };

  const handleReferenceTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReferenceMinutes(Number(event.target.value));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleResetToNow = () => {
    setReferenceMinutes(getCurrentMinutes());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.world-timezone-compare.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.world-timezone-compare.subtitle')}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Search className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              {t('tools.world-timezone-compare.searchLabel')}
            </label>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('tools.world-timezone-compare.searchPlaceholder')}
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Globe2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              {t('tools.world-timezone-compare.referenceLabel')}
            </label>
            <select
              value={referenceOffsetMinutes}
              onChange={handleReferenceChange}
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-950 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {TIMEZONE_OFFSETS.map((timezone) => (
                <option key={timezone.id} value={timezone.offsetMinutes}>
                  {timezone.flag} {timezone.regions} ({timezone.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('tools.world-timezone-compare.referenceTimeLabel', {
                time: formatClockTime(referenceMinutes, true),
                count: convertedTimezones.length,
              })}
            </label>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {referenceTimezone.label}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={DAY_MINUTES - 1}
            step={15}
            value={referenceMinutes}
            onChange={handleReferenceTimeChange}
            className="mt-3 w-full accent-cyan-600"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('tools.world-timezone-compare.viewModeLabel')}
            </p>
            <div className="inline-grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
              {(['cards', 'timeline'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                    viewMode === mode
                      ? 'bg-white text-cyan-700 shadow-sm dark:bg-[#282c34] dark:text-cyan-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                  )}
                >
                  {mode === 'cards' ? <LayoutGrid className="h-4 w-4" /> : <ListFilter className="h-4 w-4" />}
                  {t(`tools.world-timezone-compare.viewModes.${mode}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetToNow}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-[#4183c4] dark:hover:bg-[#4f93d5]"
            >
              <RotateCcw className="h-4 w-4" />
              {t('tools.world-timezone-compare.resetButton')}
            </button>
            <button
              type="button"
              onClick={() => setUse24Hour((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:text-cyan-300"
            >
              <Clock3 className="h-4 w-4" />
              {use24Hour ? t('tools.world-timezone-compare.use12Hour') : t('tools.world-timezone-compare.use24Hour')}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-700 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
              <Timer className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">{t('tools.world-timezone-compare.referenceCardTitle')}</p>
              <p className="mt-1 font-mono text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {formatClockTime(referenceMinutes, use24Hour)}
                <span className="ml-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">{referenceTimezone.label}</span>
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-cyan-800 dark:text-cyan-200">
            {referenceTimezone.flag} {referenceTimezone.regions}
          </p>
        </div>
      </section>

      {viewMode === 'cards' ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {convertedTimezones.map((timezone) => {
            const isReferenceTimezone = timezone.offsetMinutes === referenceOffsetMinutes;
            const dayLabel = getDayDeltaLabel(timezone.dayDelta, isZh);

            return (
              <article
                key={timezone.id}
                className={cn(
                  'rounded-lg border bg-white p-4 shadow-sm transition-colors dark:bg-[#282c34]',
                  isReferenceTimezone
                    ? 'border-cyan-300 ring-2 ring-cyan-100 dark:border-cyan-700 dark:ring-cyan-950'
                    : 'border-slate-200 hover:border-cyan-200 dark:border-slate-800 dark:hover:border-cyan-800',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {formatClockTime(timezone.localMinutes, use24Hour)}
                      </p>
                      {dayLabel ? (
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                          {dayLabel}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {timezone.flag} {timezone.regions}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {timezone.label} · {formatHourMinuteDelta(timezone.differenceMinutes, isZh)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-cyan-300">
                    <CalendarClock className="h-6 w-6" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:grid-cols-8">
            {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
              <span key={hour}>{padTimePart(hour)}:00</span>
            ))}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {convertedTimezones.map((timezone) => {
              const dayLabel = getDayDeltaLabel(timezone.dayDelta, isZh);

              return (
                <div key={timezone.id} className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-[260px_1fr_90px] lg:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {timezone.flag} {timezone.regions}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{timezone.label}</p>
                  </div>

                  <div className="relative h-8 rounded-full bg-slate-100 dark:bg-slate-900">
                    <div className="absolute inset-y-1 left-1/3 right-1/3 rounded-full bg-emerald-200/70 dark:bg-emerald-950/70" />
                    <span
                      className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cyan-600 shadow dark:border-[#282c34]"
                      style={{ left: getTimelinePosition(timezone.localMinutes) }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 lg:block lg:text-right">
                    <p className="font-mono text-base font-semibold text-slate-950 dark:text-white">
                      {formatClockTime(timezone.localMinutes, use24Hour)}
                    </p>
                    {dayLabel ? (
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{dayLabel}</p>
                    ) : (
                      <p className="text-xs text-slate-400">{formatReferenceDate(0, isZh)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="font-semibold">{t('tools.world-timezone-compare.fixedOffsetTitle')}</p>
        <p className="mt-1">{t('tools.world-timezone-compare.fixedOffsetText')}</p>
      </section>

      <ToolSEOCard toolKey="world-timezone-compare" />
    </div>
  );
}
