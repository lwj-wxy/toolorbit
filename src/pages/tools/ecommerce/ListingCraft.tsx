import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';

export default function ListingCraft() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo: input })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setResult(data.text);
    } catch (err: any) {
      setError(err.message || '生成失败，请稍后重发');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[#1e293b] flex items-center gap-2">
            <Sparkles className="text-blue-600" /> Listing Craft AI
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            输入商品的主要特征及卖点，通过 Node.js 后端 AI 为您生成高转化率的电商 Listing 文案。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5 flex flex-col flex-1">
            <label className="block text-sm font-bold text-[#334155] mb-3">产品基础信息入录</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在这里输入产品名、核心材质、受众特点等... 越详细越好。&#10;例如：高雅实木雕花复古咖啡桌，适合放置在卧室和客厅，原木色，耐用环保..."
              className="w-full flex-1 rounded-lg border border-[#e2e8f0] p-4 text-[14px] leading-relaxed resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 min-h-[300px]"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'AI 正为您创作中...' : '一键生成 Listing 方案'}
            </button>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0] flex flex-col overflow-hidden h-[600px] relative">
          <div className="bg-white border-b border-[#e2e8f0] p-4 flex justify-between items-center">
            <h3 className="font-bold text-[#1e293b]">生成的 AI 方案</h3>
            {result && (
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-xs text-[#64748b] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
                {copied ? '已复制' : '复制文案'}
              </button>
            )}
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
            )}
            {!result && !loading && !error && (
              <div className="text-[#94a3b8] text-center mt-20">生成的文案会显示在这里</div>
            )}
            {result && (
              <div className="markdown-body prose prose-sm max-w-none text-[#334155]">
                <Markdown>{result}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
