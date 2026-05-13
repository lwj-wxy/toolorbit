import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, FileText, Send, Copy, Loader2, Tag, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Xiaohongshu() {
  const { t, i18n } = useTranslation();
  
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState('种草测评');
  
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const styleOptions = [
    { value: '种草测评', label: t('tools.ai-xiaohongshu.style1', '种草测评 (分享/安利)') },
    { value: '干货教程', label: t('tools.ai-xiaohongshu.style2', '干货教程 (技能/科普)') },
    { value: '情感共鸣', label: t('tools.ai-xiaohongshu.style3', '情感共鸣 (吐槽/鸡汤)') },
    { value: '好物合集', label: t('tools.ai-xiaohongshu.style4', '好物合集 (盘点/清单)') },
    { value: '探店打卡', label: t('tools.ai-xiaohongshu.style5', '探店打卡 (美食/旅游)') }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error(t('tools.ai-xiaohongshu.errorEmpty', '请输入核心主题'));
      return;
    }

    setIsGenerating(true);
    setResult('');
    
    // Auto scroll to result area
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch('/api/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords,
          style,
          language: i18n.language === 'zh' ? '中文' : 'English'
        }),
      });

      if (response.status === 429) {
        throw new Error(t('common.rateLimit', '请求过于频繁，请稍后再试'));
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsGenerating(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  toast.error(parsed.error);
                  setIsGenerating(false);
                  return;
                }
                setResult(prev => prev + parsed.content);
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || t('common.error', '发生错误，请稍后再试'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
        .then(() => toast.success(t('common.copied', '已复制到剪贴板')))
        .catch(() => toast.error('复制失败'));
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-xl mb-4">
            <Sparkles className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('tools.ai-xiaohongshu.title', '小红书文案生存器')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            {t('tools.ai-xiaohongshu.subtitle', '基于深度的社交媒体语料库训练，一键产出网感满分、排版吸睛的爆款图文笔记文案。')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('tools.ai-xiaohongshu.topicLabel', '核心主题 (必填)')}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('tools.ai-xiaohongshu.topicPlaceholder', '例如：租房神器、冬季护肤指南...')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('tools.ai-xiaohongshu.keywordsLabel', '包含关键词 (选填)')}
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={t('tools.ai-xiaohongshu.keywordsPlaceholder', '例如：平价, 氛围感, 绝绝子 (用逗号分隔)')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('tools.ai-xiaohongshu.styleLabel', '笔记风格定调')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStyle(opt.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                          style === opt.value
                            ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-200 dark:hover:border-red-500/30"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('tools.ai-xiaohongshu.generating', 'AI 奋笔疾书中...')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('tools.ai-xiaohongshu.generateBtn', '一键生成爆款笔记')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 border border-red-100 dark:border-slate-700">
              <h3 className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                写作提示
              </h3>
              <p className="text-sm text-red-600/80 dark:text-slate-400 leading-relaxed">
                主题越具体，大模型生成的成文越有“干货感”。如把“洗发水”改为“油性发质如何两周改善坍塌发根的洗发水推荐”，效果更佳。
              </p>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7" ref={resultRef}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  {t('tools.ai-xiaohongshu.resultTitle', 'AI 成稿结果')}
                </h3>
                <button
                  onClick={handleCopy}
                  disabled={!result || isGenerating}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  title={t('common.copy', '复制内容')}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 bg-slate-50/50 dark:bg-slate-900/20">
                {!result && !isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4 py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Tag className="w-8 h-8 opacity-50" />
                    </div>
                    <p>{t('tools.ai-xiaohongshu.emptyTip', '在这里见证爆款文案的诞生')}</p>
                  </div>
                ) : (
                  <div className="prose prose-red dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 
                                  prose-p:leading-relaxed prose-headings:font-bold prose-a:text-red-600
                                  font-sans text-[15px]">
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                    {isGenerating && (
                      <span className="inline-block w-2 h-5 bg-red-500 ml-1 animate-pulse align-middle" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
