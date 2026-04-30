import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';

export default function ListingCraft() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productInfo: input,
          language: i18n.language 
        })
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('Reader initialization failed');

      let isDone = false;
      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.substring(6).trim();
                const data = JSON.parse(jsonStr);
                
                if (data.error) {
                  setError(data.error);
                } else if (data.content) {
                  setResult(prev => prev + data.content);
                }
              } catch (e) {
                // Ignore incomplete JSON chunks from buffer
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || t('tools.listing-craft-ai.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#1e293b] flex items-center gap-2">
            <Sparkles className="text-blue-600" /> {t('tools.listing-craft-ai.title')}
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {t('tools.listing-craft-ai.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col flex-1">
            <label className="block text-sm font-bold text-[#334155] mb-3">{t('tools.listing-craft-ai.inputLabel')}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.listing-craft-ai.placeholder')}
              className="w-full flex-1 rounded-lg border border-[#e2e8f0] p-4 text-[14px] leading-relaxed resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 min-h-[300px]"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? t('tools.listing-craft-ai.generating') : t('tools.listing-craft-ai.generateBtn')}
            </button>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-[600px] relative">
          <div className="bg-white border-b border-[#e2e8f0] p-4 flex justify-between items-center">
            <h3 className="font-bold text-[#1e293b]">{t('tools.listing-craft-ai.resultTitle')}</h3>
            {result && (
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-xs text-[#64748b] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
                {copied ? t('tools.listing-craft-ai.copied') : t('tools.listing-craft-ai.copyBtn')}
              </button>
            )}
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
            )}
            {!result && !loading && !error && (
              <div className="text-[#94a3b8] text-center mt-20">{t('tools.listing-craft-ai.emptyResult')}</div>
            )}
            {result && (
              <div className="markdown-body prose prose-sm max-w-none text-[#334155]">
                <Markdown>{result}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.listing-craft-ai.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.listing-craft-ai.seoDesc')}
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            {t('tools.listing-craft-ai.techDrive')}
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.listing-craft-ai.highlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.listing-craft-ai.highlight1Title')}</strong>
            <span>{t('tools.listing-craft-ai.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.listing-craft-ai.highlight2Title')}</strong>
            <span>{t('tools.listing-craft-ai.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.listing-craft-ai.highlight3Title')}</strong>
            <span>{t('tools.listing-craft-ai.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.listing-craft-ai.disclaimer')}
        </p>
      </div>

    </div>
  );
}
