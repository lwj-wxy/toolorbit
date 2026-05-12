import React, { useState } from 'react';
import { ShieldCheck, Copy, CheckCircle2, Trash2, Info, Lock, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
// @ts-ignore
import { sm2, sm3, sm4 } from 'sm-crypto';

export default function ChineseCrypto() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [algo, setAlgo] = useState('SM4');
  const [encrypt, setEncrypt] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    if (!input) return;
    setError(null);
    try {
      let result = '';
      if (algo === 'SM3') {
        result = sm3(input);
      } else if (algo === 'SM4') {
        if (!key || key.length !== 32) {
          setError(t('tools.chinese-crypto.errorSm4Key'));
          return;
        }
        if (encrypt) {
          result = sm4.encrypt(input, key);
        } else {
          result = sm4.decrypt(input, key);
        }
      } else if (algo === 'SM2') {
         if (encrypt) {
            result = sm2.doEncrypt(input, key);
         } else {
            result = sm2.doDecrypt(input, key);
         }
      }
      setOutput(result);
    } catch (err: any) {
      setError(err.message || t('tools.chinese-crypto.errorOperationFailed'));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('tools.chinese-crypto.title')}</h1>
          <p className="text-slate-500 text-sm">{t('tools.chinese-crypto.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-slate-100">
        <div className="flex flex-wrap gap-4 mb-8 p-1.5 bg-slate-50 rounded-2xl w-fit">
          {['SM2', 'SM3', 'SM4'].map(a => (
            <button
              key={a}
              onClick={() => { setAlgo(a); setOutput(''); setError(null); }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                algo === a ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('tools.chinese-crypto.inputLabel')}</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('tools.chinese-crypto.inputPlaceholder')}
                className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-200 transition-all outline-none resize-none text-sm"
              />
            </div>

            {algo !== 'SM3' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                  {algo === 'SM4' ? t('tools.chinese-crypto.keyLabelSM4') : (encrypt ? t('tools.chinese-crypto.keyLabelSM2Public') : t('tools.chinese-crypto.keyLabelSM2Private'))}
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={t('tools.chinese-crypto.keyPlaceholder')}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-200 transition-all outline-none text-sm font-mono"
                />
              </div>
            )}

            <div className="flex gap-4">
              {algo !== 'SM3' && (
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                  <button
                    onClick={() => setEncrypt(true)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${encrypt ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {t('tools.chinese-crypto.tabEncrypt')}
                  </button>
                  <button
                    onClick={() => setEncrypt(false)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!encrypt ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {t('tools.chinese-crypto.tabDecrypt')}
                  </button>
                </div>
              )}
              <button
                onClick={handleProcess}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2"
              >
                {algo === 'SM3' ? t('tools.chinese-crypto.actionSm3') : (encrypt ? <Lock size={16} /> : <Unlock size={16} />)}
                {algo === 'SM3' ? t('tools.chinese-crypto.actionSm3') : (encrypt ? t('tools.chinese-crypto.actionEncrypt') : t('tools.chinese-crypto.actionDecrypt'))}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 h-full flex flex-col">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('tools.chinese-crypto.outputLabel')}</label>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    copied ? 'bg-emerald-50 text-emerald-600' : 'text-rose-600 hover:bg-rose-50 disabled:opacity-30'
                  }`}
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied ? t('tools.chinese-crypto.copiedBtn') : t('tools.chinese-crypto.copyBtn')}
                </button>
              </div>
              <textarea
                readOnly
                value={output}
                placeholder={t('tools.chinese-crypto.outputPlaceholder')}
                className="w-full flex-1 min-h-[160px] p-5 bg-slate-900 border border-slate-800 rounded-2xl text-rose-400 font-mono text-sm outline-none resize-none"
              />
              {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}
            </div>

            <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-3xl">
              <div className="flex items-center gap-2 mb-3 text-rose-900 font-bold">
                <Info size={16} />
                <h4 className="text-sm">{t('tools.chinese-crypto.introTitle')}</h4>
              </div>
              <div className="text-xs text-rose-700 space-y-2 leading-relaxed">
                <p>{t('tools.chinese-crypto.introSm2')}</p>
                <p>{t('tools.chinese-crypto.introSm3')}</p>
                <p>{t('tools.chinese-crypto.introSm4')}</p>
              </div>
            </div>
          </div>
        </div>
        <ToolSEOCard toolKey="chinese-crypto" />
      </div>
    </div>
  );
}
