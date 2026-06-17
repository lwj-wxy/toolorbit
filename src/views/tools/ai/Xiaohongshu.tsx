import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, FileText, Send, Copy, Loader2, Tag } from 'lucide-react';
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
    <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.ai-xiaohongshu.title', '小红书文案生存器')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ai-xiaohongshu.subtitle', '基于深度的社交媒体语料库训练，一键产出网感满分、排版吸睛的爆款图文笔记文案。')}
          </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              
              <div className="flex flex-1 flex-col space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {t('tools.ai-xiaohongshu.topicLabel', '核心主题 (必填)')}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('tools.ai-xiaohongshu.topicPlaceholder', '例如：租房神器、冬季护肤指南...')}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {t('tools.ai-xiaohongshu.keywordsLabel', '包含关键词 (选填)')}
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={t('tools.ai-xiaohongshu.keywordsPlaceholder', '例如：平价, 氛围感, 绝绝子 (用逗号分隔)')}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
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
                            ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-500 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-300 dark:hover:border-cyan-500/40"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
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

          {/* Result Section */}
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" ref={resultRef}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {t('tools.ai-xiaohongshu.resultTitle', 'AI 成稿结果')}
                </h3>
                <button
                  onClick={handleCopy}
                  disabled={!result || isGenerating}
                  className="rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:hover:bg-slate-800"
                  title={t('common.copy', '复制内容')}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                {!result && !isGenerating ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 py-20 text-slate-400 dark:text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Tag className="w-8 h-8 opacity-50" />
                    </div>
                    <p>{t('tools.ai-xiaohongshu.emptyTip', '在这里见证爆款文案的诞生')}</p>
                  </div>
                ) : (
                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300
                                  prose-p:leading-relaxed prose-headings:font-bold prose-a:text-cyan-600
                                  font-sans text-[15px]">
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                    {isGenerating && (
                      <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-cyan-500 align-middle" />
                    )}
                  </div>
                )}
              </div>
          </div>
        </div>
    </div>
  );
}
