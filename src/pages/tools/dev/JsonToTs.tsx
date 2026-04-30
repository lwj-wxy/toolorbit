import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Copy, 
  Trash2, 
  Code2, 
  FileJson, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import JsonToTS from 'json-to-ts';
import { motion, AnimatePresence } from 'motion/react';

const JsonToTs: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const interfaces = JsonToTS(parsed);
      setOutput(interfaces.join('\n\n'));
      setError(null);
    } catch (err: any) {
      setError(err.message || t('tools.json-to-ts.errorMsg'));
      setOutput('');
    }
  }, [input, t]);

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

  const loadExample = () => {
    const example = {
      id: 1,
      name: "ToolOrbit",
      version: "1.0.0",
      features: ["JSON Formatter", "Base64", "UUID"],
      author: {
        name: "Developer",
        active: true
      },
      tags: [1, 2, 3]
    };
    setInput(JSON.stringify(example, null, 2));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-sm">
                <FileJson className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {t('tools.json-to-ts.title')}
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  {t('tools.json-to-ts.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadExample}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
              >
                {t('tools.json-to-ts.sampleBtn')}
              </button>
              <button
                onClick={handleClear}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                title={t('tools.json-to-ts.clearBtn')}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,40px,1fr] gap-0">
          {/* Input Area */}
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 size={14} />
                {t('tools.json-to-ts.inputLabel')}
              </label>
              {error && (
                <span className="text-[10px] sm:text-xs font-medium text-red-500 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                  <AlertCircle size={12} />
                  {t('tools.json-to-ts.errorMsg')}
                </span>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.json-to-ts.placeholder')}
              className={`w-full min-h-[400px] p-4 font-mono text-sm bg-slate-50 border rounded-2xl focus:ring-4 transition-all resize-none outline-none ${
                error ? 'border-red-200 focus:ring-red-100' : 'border-slate-100 focus:ring-indigo-100 focus:border-indigo-200'
              }`}
            />
          </div>

          {/* Divider with Icon */}
          <div className="hidden lg:flex flex-col items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 z-10">
              <ChevronRight size={20} />
            </div>
            <div className="absolute top-0 bottom-0 w-px bg-slate-100"></div>
          </div>

          {/* Output Area */}
          <div className="relative p-6 sm:p-8 bg-slate-50/30">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FileJson size={14} />
                {t('tools.json-to-ts.outputLabel')}
              </span>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  copied 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-indigo-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:hover:shadow-none'
                }`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? t('tools.json-to-ts.copiedBtn') : t('tools.json-to-ts.copyBtn')}
              </button>
            </div>
            <div className="relative group">
              <pre className={`w-full min-h-[400px] p-4 font-mono text-sm bg-white border border-slate-200 rounded-2xl overflow-auto group-hover:border-indigo-200 transition-colors ${!output && 'flex items-center justify-center italic text-slate-300'}`}>
                {output || t('tools.json-to-ts.placeholder')}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} />
            {t('tools.json-to-ts.highlight1Title')}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t('tools.json-to-ts.highlight1Desc')}
          </p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} />
            {t('tools.json-to-ts.highlight2Title')}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t('tools.json-to-ts.highlight2Desc')}
          </p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} />
            {t('tools.json-to-ts.highlight3Title')}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t('tools.json-to-ts.highlight3Desc')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JsonToTs;
