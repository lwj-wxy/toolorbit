import type { LucideIcon } from 'lucide-react';

type ToolPageHeroProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  accentClassName?: string;
};

export default function ToolPageHero({
  icon: Icon,
  title,
  description,
  accentClassName = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
}: ToolPageHeroProps) {
  return (
    <div className="mb-7 border-b border-slate-200 pb-7 text-left dark:border-slate-800">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${accentClassName}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
