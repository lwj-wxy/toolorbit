import React, { useState } from 'react';
import { Lock, Unlock, Copy, CheckCircle2, Shield, RefreshCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';

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

      let result = '';
      if (isEncrypt) {
        // @ts-ignore
        const encrypted = CryptoJS[algo].encrypt(input, key, cfg);
        result = encrypted.toString();
      } else {
        // @ts-ignore
        const decrypted = CryptoJS[algo].decrypt(input, key, cfg);
        result = decrypted.toString(CryptoJS.enc.Utf8);
        if (!result) throw new Error(t('tools.crypto-symmetric.errorDecryptFailed'));
      }
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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Lock className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEncrypt ? t('tools.crypto-symmetric.titleEncrypt') : t('tools.crypto-symmetric.titleDecrypt')}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {t('tools.crypto-symmetric.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shadow-inner self-start">
          <button
            onClick={() => setIsEncrypt(true)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              isEncrypt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('tools.crypto-symmetric.tabEncrypt')}
          </button>
          <button
            onClick={() => setIsEncrypt(false)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              !isEncrypt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('tools.crypto-symmetric.tabDecrypt')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input/Output Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {isEncrypt ? <Lock size={16} /> : <Unlock size={16} />} 
                {isEncrypt ? t('tools.crypto-symmetric.inputPlaintextLabel') : t('tools.crypto-symmetric.inputCiphertextLabel')}
              </label>
              <button
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title={t('tools.crypto-symmetric.clearBtn')}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isEncrypt ? t('tools.crypto-symmetric.inputPlaintextPlaceholder') : t('tools.crypto-symmetric.inputCiphertextPlaceholder')}
              className="w-full h-40 p-5 font-mono text-sm bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all resize-none outline-none"
            />
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative group">
            <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-900">
              <span className="flex items-center gap-2 uppercase tracking-wider">
                {t('tools.crypto-symmetric.outputLabel')} {isEncrypt ? t('tools.crypto-symmetric.outputCiphertext') : t('tools.crypto-symmetric.outputPlaintext')}
              </span>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? t('tools.crypto-symmetric.copiedBtn') : t('tools.crypto-symmetric.copyBtn')}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              placeholder={t('tools.crypto-symmetric.outputPlaceholder')}
              className="w-full h-40 p-5 font-mono text-sm bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all resize-none outline-none"
            />
            {error && (
              <div className="absolute top-20 left-10 right-10 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Settings Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
              {t('tools.crypto-symmetric.paramsTitle')}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('tools.crypto-symmetric.algoLabel')}</label>
                <select 
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-200 transition-all cursor-pointer"
                >
                  {ALGORITHMS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('tools.crypto-symmetric.keyLabel')}</label>
                <div className="relative">
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={t('tools.crypto-symmetric.keyPlaceholder')}
                    className="w-full p-3 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-200 transition-all"
                  />
                  <RefreshCcw 
                    className="absolute right-3 top-3 text-slate-300 hover:text-indigo-500 cursor-pointer transition-colors" 
                    size={16}
                    onClick={() => setKey(Math.random().toString(36).substring(2, 10))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('tools.crypto-symmetric.ivLabel')}</label>
                <input
                  type="text"
                  value={iv}
                  onChange={(e) => setIv(e.target.value)}
                  placeholder={t('tools.crypto-symmetric.ivPlaceholder')}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('tools.crypto-symmetric.modeLabel')}</label>
                  <select 
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-200 transition-all cursor-pointer"
                  >
                    {MODES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('tools.crypto-symmetric.paddingLabel')}</label>
                  <select 
                    value={padding}
                    onChange={(e) => setPadding(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-200 transition-all cursor-pointer"
                  >
                    {PADDINGS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isEncrypt ? <Lock size={18} /> : <Unlock size={18} />}
                {isEncrypt ? t('tools.crypto-symmetric.actionEncrypt') : t('tools.crypto-symmetric.actionDecrypt')}
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-indigo-600" size={18} />
              <h4 className="text-sm font-bold text-indigo-900">{t('tools.crypto-symmetric.securityNoteTitle')}</h4>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              {t('tools.crypto-symmetric.securityNoteDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
