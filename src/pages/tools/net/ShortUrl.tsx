import React, { useState } from 'react';
import { Link2, Copy, Check, ExternalLink, Loader2, Globe } from 'lucide-react';

export default function ShortUrl() {
  const [url, setUrl] = useState('');
  const [shortLinks, setShortLinks] = useState<Array<{ provider: string, url: string, note?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateShortUrl = async () => {
    if (!url) return;
    if (!url.startsWith('http')) {
      setError('请输入以 http:// 或 https:// 开头的完整有效链接');
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
        throw new Error(data.error || '短链接获取失败');
      }
    } catch (err: any) {
      setError(err.message || '短链服务暂时不可用，请稍后重试');
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">在线短链接转换器</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              多平台并行分发逻辑，确保在任何网络环境下都有 100% 稳定的跳转体验。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-10 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">原始长链接 (URL)</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/path/with?params=123"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>
            <button
              onClick={generateShortUrl}
              disabled={loading || !url}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shrink-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '立即缩短'}
            </button>
          </div>
          {error && <p className="text-rose-500 text-sm font-medium ml-1">{error}</p>}
        </div>

        {shortLinks.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700 italic">检测到多条可用分发路线，请选择最稳定的一条：</label>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Multi-Stream Enabled</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {shortLinks.map((link, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 hover:border-indigo-200 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">{link.provider}</span>
                        {index === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">推荐</span>}
                      </div>
                      <div className="font-mono font-bold text-lg text-slate-700 truncate break-all">
                        {link.url}
                      </div>
                      {link.note && <p className="text-xs text-slate-400">{link.note}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(link.url, `copy-${index}`)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        {copiedId === `copy-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="font-bold text-sm">{copiedId === `copy-${index}` ? '已复制' : '复制'}</span>
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">短链工具使用手册与常见问题</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong>为何需要使用短链接？</strong> 长链接在短信推销、微博转发或者生成二维码时会占用大量空间/点阵。短链接不仅观感清爽，还能有效规避某些平台对过长参数链接的自动截断。 </p>
          <p><strong>关于本工具：</strong> 我们基于全球著名的公益短链服务提供商渲染结果。该服务非常稳定，生成的短链通常是永久活性的（除非因为违规被源站封禁）。</p>
          <p><strong>隐私提示：</strong> 转换过程通过我们的网页与短链接口直接通信，我们不会记录或缓存您的原始长链接内容。请放心使用。</p>
        </div>
      </div>
    </div>
  );
}
