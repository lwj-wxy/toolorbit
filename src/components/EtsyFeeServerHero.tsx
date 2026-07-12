import en from '../locales/en.json';

export default function EtsyFeeServerHero() {
  const copy = en.tools['etsy-fee-calculator'];

  return (
    <section className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {copy.name || copy.title}
      </h1>
      <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
        {copy.subtitle || copy.description}
      </p>
    </section>
  );
}
