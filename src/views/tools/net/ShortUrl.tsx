import { useState } from 'react';
import { Copy, Check, ExternalLink, Loader2, Globe, Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ShortUrl() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [shortLinks, setShortLinks] = useState<Array<{ provider: string, url: string, note?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateShortUrl = async () => {
    if (!url) return;
    if (!url.startsWith('http')) {
      setError(t('tools.short-url.errorHttp'));
      return;
    }

    setLoading(true);
    setError('');
    setShortLinks([]);

    try {
      // 请求多线路后端接口
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      
      const data = await response.json();

      if (data.success && data.links) {
        setShortLinks(data.links);
      } else {
        throw new Error(data.error || t('tools.short-url.errorFetch'));
      }
    } catch (err: any) {
      setError(err.message || t('tools.short-url.errorRetry'));
      console.error('Shorten Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (linkUrl: string, id: string) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.short-url.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.short-url.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.short-url.labelLong')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/path/with?params=123"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 font-mono text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={generateShortUrl}
              disabled={loading || !url}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {t('tools.short-url.btnShorten')}
            </button>

            {error ? (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <div className="mt-auto rounded-lg border border-cyan-100 bg-cyan-50/50 p-4 text-sm leading-6 text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/20 dark:text-cyan-200">
              {t('tools.short-url.subtitle')}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.short-url.multiStream')}
            </label>
            <span className="rounded-md border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-200">
              {t('tools.short-url.multiStreamEnabled')}
            </span>
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {shortLinks.length > 0 ? (
              <div className="h-full divide-y divide-slate-200 overflow-y-auto dark:divide-slate-700">
              {shortLinks.map((link, index) => (
                <div key={index} className="p-4 transition-colors hover:bg-white dark:hover:bg-[#282c34]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{link.provider}</span>
                        {index === 0 && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {t('tools.short-url.recommended')}
                          </span>
                        )}
                      </div>
                      <div className="truncate break-all font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {link.url}
                      </div>
                      {link.note && <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{link.note}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(link.url, `copy-${index}`)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
                      >
                        {copiedId === `copy-${index}` ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === `copy-${index}` ? t('tools.short-url.copied') : t('tools.short-url.copy')}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-500 dark:text-slate-400">
                <Link2 className="mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm leading-6">{loading ? t('tools.short-url.btnShorten') : t('tools.short-url.multiStream')}</p>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
