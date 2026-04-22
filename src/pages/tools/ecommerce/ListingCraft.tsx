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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col flex-1">
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

        <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-[600px] relative">
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

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Listing Craft 核心 AI 文案生成平台，赋能跨境出海电商</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          面对浩如烟海的海外零售市场，一条出彩并带有高 SEO 转化基因的商品 Listing 往往比投入重金铺设广告更具有长尾变现能力。这不仅要求极高的英语水平与本土语境应用逻辑，还需要对底层算法关键词进行铺排。为了解决中小商家及内容创作者“编词穷”的困顿，本大语言模型驱动应用因此被构建出台。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            硬核技术驱动：该功能并不局限于固定模板的僵硬替换。我们在服务器后端调用了业界先进的大型语言模型 AI，对您输入的简短词汇进行极具商业素养的文章扩写和解构分行渲染，从痛点捕捉到五点描述 (Bullet Points) 一气呵成。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">这款电商文案生成工具如何帮助您实现销量突围？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 对抗空白状态的灵感火花：</strong>
            <span>只要你能在左侧文本框毫无章法地罗列出类似“红色、木材质、包邮、适合送礼”这样的原始大白话，强大的人工智能便有能力从不同维度构建筑梦，撰写出兼具紧迫感和格调的高转化商品描述。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 符合本土思维及搜索偏好：</strong>
            <span>告别了机械呆板的在线机翻，AI 会根据大量海外主流电子商务平台（如 Amazon, Shopify 等）爬取分析到的高光畅销句式作为底层骨架进行组装，帮助您自然而然地埋设买家高频搜索的核心大词。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 内置 Markdown 与一键带走：</strong>
            <span>系统右侧的结果生成框默认承载了 Markdown 语法的可视化解析，配合顶部的无缝快捷拷贝按钮，使得您能直接把优美排版好的副文本瞬间黏贴到后台表单中，直接发布上线。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          AI 生成不是最终的终点，而是极高起点的脚手架。对于真正追求卓越复购率爆品的运营专家来说，建议在它输出后的成果上略加润色属于自家品牌的专有温度。
        </p>
      </div>

    </div>
  );
}
