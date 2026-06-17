import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { cn } from '../../../lib/utils';

export default function HashGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': ''
  });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
      return;
    }

    try {
      const newHashes: Record<string, string> = {};
      
      // MD5 via crypto-js
      newHashes['MD5'] = CryptoJS.MD5(text).toString();

      // SHA via native crypto.subtle
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
      
      for (const algo of algos) {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        newHashes[algo] = hashHex;
      }
      
      setHashes(newHashes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const copyToClipboard = (text: string, algo: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(algo);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {t('tools.hash-generator.title')}
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {t('tools.hash-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid min-h-[560px] grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.hash-generator.inputLabel')}
            </h2>
            <span className="font-mono text-[12px] text-slate-400">TEXT</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-0 flex-1 resize-none border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:bg-slate-900 dark:text-slate-200"
            placeholder={t('tools.hash-generator.inputPlaceholder')}
            spellCheck={false}
          />
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.hash-generator.outputLabel')}
            </h2>
            <span className="font-mono text-[12px] text-slate-400">HEX</span>
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-auto bg-slate-50 p-4 dark:bg-slate-950/40">
          {Object.entries(hashes).map(([algo, hashValue]) => {
            const hash = String(hashValue);
            return (
              <div key={algo} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{algo}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(hash, algo)}
                    disabled={!hash}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white',
                      copiedHash === algo && 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300',
                    )}
                    aria-label={`Copy ${algo}`}
                  >
                    {copiedHash === algo ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
                <div className="min-h-11 break-all rounded-md bg-slate-100 p-3 font-mono text-[13px] leading-6 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  {hash || <span className="text-slate-400">{t('tools.hash-generator.outputPlaceholder', '等待输入内容...')}</span>}
                </div>
              </div>
            );
          })}
          </div>
        </section>
      </div>
    </div>
  );
}
