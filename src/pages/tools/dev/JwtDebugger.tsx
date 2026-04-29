import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Info, AlertTriangle, CheckCircle2, Hash, Database, Clock } from 'lucide-react';

export default function JwtDebugger() {
  const { t } = useTranslation();
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState('');

  const decodeJwt = (token: string) => {
    setError('');
    setHeader(null);
    setPayload(null);
    
    if (!token) return;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error(t('tools.jwt-debugger.errorFormat'));
      }

      const decodePart = (str: string) => {
        try {
          const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(json);
        } catch (e) {
          throw new Error(t('tools.jwt-debugger.errorBase64'));
        }
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (err: any) {
      setError(err.message || t('tools.jwt-debugger.errorUnknown'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.trim();
    setJwt(val);
    decodeJwt(val);
  };

  const formatTimestamp = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">{t('tools.jwt-debugger.title')}</h1>
          <p className="text-slate-500 mt-1 text-sm">{t('tools.jwt-debugger.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
             <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400" />
              {t('tools.jwt-debugger.inputLabel')}
            </label>
            <textarea
              value={jwt}
              onChange={handleInputChange}
              spellCheck={false}
              placeholder={t('tools.jwt-debugger.inputPlaceholder')}
              className="flex-1 w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none overflow-auto"
            />
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            {!error && jwt && (
               <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-600">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{t('tools.jwt-debugger.successMsg')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Header
            </h2>
            <pre className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl font-mono text-xs text-indigo-700 overflow-auto max-h-[150px]">
              {header ? JSON.stringify(header, null, 2) : `// ${t('tools.jwt-debugger.waitingMsg')}`}
            </pre>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Payload
            </h2>
            <pre className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl font-mono text-xs text-amber-700 overflow-auto max-h-[300px] mb-6">
              {payload ? JSON.stringify(payload, null, 2) : `// ${t('tools.jwt-debugger.waitingMsg')}`}
            </pre>

            {payload && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                 <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> {t('tools.jwt-debugger.claimsTitle')}
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase">{t('tools.jwt-debugger.issLabel')} (iss)</span>
                       <span className="text-sm font-mono text-slate-700 truncate block">{payload.iss || 'N/A'}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase">{t('tools.jwt-debugger.subLabel')} (sub)</span>
                       <span className="text-sm font-mono text-slate-700 truncate block">{payload.sub || 'N/A'}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t('tools.jwt-debugger.expLabel')} (exp)
                       </span>
                       <span className="text-sm font-mono text-slate-700 block">{formatTimestamp(payload.exp)}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t('tools.jwt-debugger.iatLabel')} (iat)
                       </span>
                       <span className="text-sm font-mono text-slate-700 block">{formatTimestamp(payload.iat)}</span>
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
             <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
             <div className="space-y-1">
                <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide">{t('tools.jwt-debugger.warningTitle')}</h3>
                <p className="text-xs text-rose-600 leading-relaxed">
                  {t('tools.jwt-debugger.warningDesc')}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
