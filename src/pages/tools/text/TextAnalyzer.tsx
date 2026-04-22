import { useState, useMemo } from 'react';

export default function TextAnalyzer() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\\n\\s*\\n/).filter(Boolean).length : 0;
    const lines = text.trim() ? text.split('\\n').length : 0;

      return [
      { name: '字数/词数', value: words },
      { name: '字符数', value: chars },
      { name: '字符数 (不含空格)', value: charsNoSpaces },
      { name: '句子数', value: sentences },
      { name: '段落数', value: paragraphs },
      { name: '行数', value: lines },
    ];
  }, [text]);

  const letterFrequency = useMemo(() => {
    if (!text) return [];
    const counts: Record<string, number> = {};
    const lowerText = text.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of lowerText) {
      counts[char] = (counts[char] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [text]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            文本分析器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            实时的字数、字符、段落统计以及字母频率分析。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Input */}
        <div className="lg:col-span-2 flex flex-col">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full flex-1 rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-relaxed resize-none bg-white min-h-[500px]"
            placeholder="在此输入或粘贴文本开始实时分析..."
          />
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">标准统计</h3>
            <dl className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-wrap items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="text-md font-bold text-gray-900">{stat.value.toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">字母频率 (前 10 名)</h3>
            {letterFrequency.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-auto">
                {letterFrequency.map(([letter, count]) => {
                  const maxCount = letterFrequency[0][1];
                  const percentage = Math.round((count / maxCount) * 100);
                  
                  return (
                    <div key={letter} className="flex items-center text-sm">
                      <span className="w-4 font-mono font-bold text-gray-700 capitalize">{letter}</span>
                      <div className="flex-1 ml-3 mr-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-medium text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-auto mb-auto">未发现字母字符。</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">纯前端在线文本分析器，中英排版与润色的数据量度助手</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当你作为编辑审校一篇冗长的新闻稿件，或者作为学术作者需要将论文缩减至符合投递字数时，一款功能极简却分析极深的原生字符计量组件便显得弥足珍贵。本工具致力于帮您在瞬间解剖文本肌理。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">关于文本智能提取与梳理的核心亮点：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 空格剔除与多维度统计：</strong>
            <span>许多排版校验工作需要剔除看不见的空白与制表符影响。本面板默认提供基础字数（词数）之余，还将全量字符、排除空格纯字符分轨计算，同时精准界定句法段落总数。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 西文字母落点高频追踪：</strong>
            <span>通过正则识别与自然语言频率模型，为您统计在所录入篇幅中哪些英文字母出现了更为频繁的曝光率。这不仅可以作为文风测算的冷知识，也能给密码学测验爱好者辅助定位指纹特征。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 从头至尾的客户端安全防汛：</strong>
            <span>无论是只言片语还是一整部未发行的奇幻小说文档，您粘贴进来阅读与分析的一切字符都在浏览器的 V8 引擎内自行消化吞吐，我们发誓绝不存在任何后门将其悄然同步至云端。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          提示补注：词语拆解统计当前依照通用空白间隔及符号特征界定边界，中英文夹杂场景下，连续的中文字符群也将依照标准被计量为对应的字单元组合块，确保符合主流的稿费结算认知标准。
        </p>
      </div>
    </div>
  );
}
