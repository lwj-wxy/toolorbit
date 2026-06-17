import { useState } from 'react';
import { CheckCircle2, Copy, Lock, RefreshCcw, Trash2, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { cn } from '../../../lib/utils';

const ALGORITHMS = [
  { id: 'AES', name: 'AES' },
  { id: 'DES', name: 'DES' },
  { id: 'TripleDES', name: 'Triple DES' },
  { id: 'RC4', name: 'RC4' },
];

const MODES = [
  { id: 'CBC', name: 'CBC' },
  { id: 'CFB', name: 'CFB' },
  { id: 'CTR', name: 'CTR' },
  { id: 'OFB', name: 'OFB' },
  { id: 'ECB', name: 'ECB' },
];

const PADDINGS = [
  { id: 'Pkcs7', name: 'Pkcs7' },
  { id: 'Iso97971', name: 'Iso97971' },
  { id: 'AnsiX923', name: 'AnsiX923' },
  { id: 'Iso10126', name: 'Iso10126' },
  { id: 'ZeroPadding', name: 'ZeroPadding' },
  { id: 'NoPadding', name: 'NoPadding' },
];

export default function CryptoSymmetric() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [algo, setAlgo] = useState('AES');
  const [mode, setMode] = useState('CBC');
  const [padding, setPadding] = useState('Pkcs7');
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    if (!input || !key) {
      setError(input ? t('tools.crypto-symmetric.errorNoKey') : t('tools.crypto-symmetric.errorNoInput'));
      return;
    }

    setError(null);

    try {
      const cfg = {
        mode: (CryptoJS.mode as any)[mode],
        padding: (CryptoJS.pad as any)[padding],
        iv: iv ? CryptoJS.enc.Utf8.parse(iv) : undefined,
      };
      const cipher = (CryptoJS as any)[algo];
      const result = isEncrypt
        ? cipher.encrypt(input, key, cfg).toString()
        : cipher.decrypt(input, key, cfg).toString(CryptoJS.enc.Utf8);

      if (!result) throw new Error(t('tools.crypto-symmetric.errorDecryptFailed'));
      setOutput(result);
    } catch (err: any) {
      setError(err.message || t('tools.crypto-symmetric.errorErrorOccurred'));
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {isEncrypt ? t('tools.crypto-symmetric.titleEncrypt') : t('tools.crypto-symmetric.titleDecrypt')}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
              {t('tools.crypto-symmetric.subtitle')}
            </p>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setIsEncrypt(true)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                isEncrypt ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              {t('tools.crypto-symmetric.tabEncrypt')}
            </button>
            <button
              type="button"
              onClick={() => setIsEncrypt(false)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                !isEncrypt ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              {t('tools.crypto-symmetric.tabDecrypt')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[620px] grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {isEncrypt ? t('tools.crypto-symmetric.inputPlaintextLabel') : t('tools.crypto-symmetric.inputCiphertextLabel')}
            </h2>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30"
              title={t('tools.crypto-symmetric.clearBtn')}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isEncrypt ? t('tools.crypto-symmetric.inputPlaintextPlaceholder') : t('tools.crypto-symmetric.inputCiphertextPlaceholder')}
            className="min-h-[220px] resize-none border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />

          <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <h3 className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.crypto-symmetric.paramsTitle')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.crypto-symmetric.algoLabel')}</span>
                <select value={algo} onChange={(event) => setAlgo(event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {ALGORITHMS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>

              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.crypto-symmetric.modeLabel')}</span>
                <select value={mode} onChange={(event) => setMode(event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {MODES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.crypto-symmetric.keyLabel')}</span>
                <div className="flex">
                  <input
                    type="password"
                    value={key}
                    onChange={(event) => setKey(event.target.value)}
                    placeholder={t('tools.crypto-symmetric.keyPlaceholder')}
                    className="min-w-0 flex-1 rounded-l-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setKey(Math.random().toString(36).substring(2, 10))}
                    className="-ml-px inline-flex w-10 items-center justify-center rounded-r-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                    aria-label="Generate key"
                  >
                    <RefreshCcw size={15} />
                  </button>
                </div>
              </label>

              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.crypto-symmetric.ivLabel')}</span>
                <input
                  type="text"
                  value={iv}
                  onChange={(event) => setIv(event.target.value)}
                  placeholder={t('tools.crypto-symmetric.ivPlaceholder')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>

              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.crypto-symmetric.paddingLabel')}</span>
                <select value={padding} onChange={(event) => setPadding(event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {PADDINGS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={handleProcess}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {isEncrypt ? <Lock size={17} /> : <Unlock size={17} />}
              {isEncrypt ? t('tools.crypto-symmetric.actionEncrypt') : t('tools.crypto-symmetric.actionDecrypt')}
            </button>
          </div>
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.crypto-symmetric.outputLabel')} {isEncrypt ? t('tools.crypto-symmetric.outputCiphertext') : t('tools.crypto-symmetric.outputPlaintext')}
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? t('tools.crypto-symmetric.copiedBtn') : t('tools.crypto-symmetric.copyBtn')}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={t('tools.crypto-symmetric.outputPlaceholder')}
            className="min-h-0 flex-1 resize-none border-0 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:bg-slate-950/40 dark:text-slate-200"
            spellCheck={false}
          />
          {error ? (
            <div className="border-t border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}
        </section>
      </div>

    </div>
  );
}
