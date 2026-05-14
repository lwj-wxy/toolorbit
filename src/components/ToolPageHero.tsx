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
  accentClassName = 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
}: ToolPageHeroProps) {
  return (
    <div className="text-center mb-10">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative group ${accentClassName}`}>
        <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
        <Icon className="w-8 h-8 relative z-10" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
