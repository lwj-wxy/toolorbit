import Link from 'next/link';
import { TOOLS } from '../data/tools';
import en from '../locales/en.json';
import { readPath } from '../lib/metadata';

type ToolSearchContentProps = {
  path: string;
};

function pickToolText(toolId: string, key: string) {
  return readPath(en, `tools.${toolId}.${key}`);
}

function compactTitle(title: string) {
  return title.replace(' | ToolOrbit', '').replace(':', '').trim();
}

function categoryIntent(category: string) {
  if (category.includes('AI')) {
    return 'AI-assisted drafting, rewriting, analysis, and generation workflows where a clear prompt can save time.';
  }
  if (category.includes('PDF')) {
    return 'document workflows such as merging, splitting, converting, or preparing files without installing desktop software.';
  }
  if (category.includes('图片')) {
    return 'image optimization and format conversion tasks for websites, social posts, ecommerce assets, and design handoff.';
  }
  if (category.includes('开发者')) {
    return 'developer debugging, data conversion, encoding, validation, and secure local inspection tasks.';
  }
  if (category.includes('电商')) {
    return 'marketplace planning, fee estimation, listing optimization, and ecommerce operations.';
  }
  return 'fast browser-based conversion, calculation, generation, and everyday productivity tasks.';
}

export default function ToolSearchContent({ path }: ToolSearchContentProps) {
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return null;

  const title = compactTitle(pickToolText(tool.id, 'seoTitle') || pickToolText(tool.id, 'name') || tool.name);
  const description = pickToolText(tool.id, 'seoDesc') || pickToolText(tool.id, 'description') || tool.description;
  const guide = [1, 2, 3, 4]
    .map((index) => pickToolText(tool.id, `guide${index}`))
    .filter(Boolean);
  const highlights = [1, 2, 3]
    .map((index) => ({
      title: pickToolText(tool.id, `highlight${index}Title`),
      description: pickToolText(tool.id, `highlight${index}Desc`),
    }))
    .filter((item) => item.title || item.description);
  const relatedTools = TOOLS.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 4);

  return (
    <section className="mt-10 border-t border-slate-200/70 dark:border-slate-800/70 pt-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Tool guide
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
              {description} This page is designed for {categoryIntent(tool.category)}
            </p>
          </div>

          {guide.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                How people usually use this tool
              </h3>
              <ol className="grid gap-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                {guide.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {highlights.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                Key reasons to use it
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={`${item.title}-${item.description}`} className="rounded-lg border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    {item.title ? <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h4> : null}
                    {item.description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {relatedTools.length > 0 && (
          <aside className="h-fit rounded-lg border border-slate-200/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Related tools
            </h3>
            <div className="mt-4 space-y-3">
              {relatedTools.map((related) => (
                <Link
                  key={related.id}
                  href={related.path}
                  className="block rounded-md border border-slate-100 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
                >
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                    {pickToolText(related.id, 'name') || related.name}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {pickToolText(related.id, 'description') || related.description}
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
