import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function PromptGenerator() {
  const { t, i18n } = useTranslation();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const styles = [
    'Photorealistic / 真实感摄影',
    'Anime / 动漫风格',
    'Cyberpunk / 赛博朋克',
    '3D Render / 3D渲染',
    'Oil Painting / 油画',
    'Logo Design / Logo设计',
    'Watercolor / 水彩',
    'Sketch / 素描手绘'
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/ai-prompt-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic,
          style,
          language: i18n.language
        })
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'AI service is currently unavailable.');
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
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) throw new Error(data.error);
                if (data.content) {
                  setResult(prev => prev + data.content);
                }
              } catch (e) {
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  console.error('Parse error:', e);
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySpecificPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderPrompts = () => {
    if (!result) return null;

    const sections = result.split(/==========+/).filter(s => s.trim() !== '');
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      let title = `Prompt ${index + 1}`;
      let promptText = '';
      let translationText = '';
      let currentPart = 'prompt'; 
      
      for (const line of lines) {
        if (line.startsWith('### ')) {
          title = line.replace('### ', '').trim();
          title = title.replace(/^\*\*(.*?)\*\*$/, '$1');
        } else if (line.startsWith('---')) {
          currentPart = 'translation';
        } else {
          if (currentPart === 'prompt') {
            promptText += line + '\n';
          } else {
            translationText += line + '\n';
          }
        }
      }

      promptText = promptText.trim();
      translationText = translationText.trim();

      if (!promptText && !translationText) {
         promptText = section.trim(); 
      }

      return (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-fuchsia-100 dark:border-fuchsia-900/30 mb-4 whitespace-normal shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            {promptText && (
              <button
                onClick={() => copySpecificPrompt(promptText, index)}
                className="flex items-center gap-1.5 text-xs text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 font-medium px-2 py-1.5 rounded-md hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-colors"
              >
                {copiedIndex === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === index ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy')}
              </button>
            )}
          </div>
          {promptText && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-sm font-mono text-slate-700 dark:text-slate-300 mb-3 break-words">
              {promptText}
            </div>
          )}
          {translationText && (
            <div className="text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-1 text-justify">
              {translationText}
            </div>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {t('tools.ai-prompt-generator.title') || 'AI Prompt Generator'}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {t('tools.ai-prompt-generator.description') || 'Generate high-quality painting prompts for Midjourney and Stable Diffusion.'}
        </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="contents">
          <div className="contents">
            
            {/* Input Section */}
            <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-prompt-generator.topic') || 'What do you want to draw?'}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('tools.ai-prompt-generator.placeholder') || 'E.g., A cute cat drinking coffee in Paris'}
                  className="w-full h-40 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-prompt-generator.style') || 'Art Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {styles.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-prompt-generator.generating') || 'Generating...'}
                  </>
                ) : (
                  <>
                     <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-prompt-generator.generateBtn') || 'Generate Prompts'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex min-h-0 flex-1 flex-col">
                 <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.ai-prompt-generator.result') || 'Generated Prompts'}
                    </label>
                 </div>
                 
                 <div className="relative min-h-0 flex-1">
                    <div className={`absolute inset-0 p-2 sm:p-5 rounded-xl border transition-all overflow-y-auto whitespace-pre-wrap
                      ${result 
                        ? 'bg-white dark:bg-[#282c34] border-slate-200 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center gap-2 h-full">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : result ? (
                        <div className="flex flex-col">
                          {renderPrompts()}
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-prompt-generator.waiting') || 'Awaiting input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
