import { useState, useMemo } from 'react';
import { Eraser, Copy, Trash2, Check, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import type { TechnicalOverview } from '../../../types/tool-overview';

const TEXT_CLEANER_OVERVIEW: TechnicalOverview = {
  summary:
    '字符串清洗工具用于把粘贴来的文本按规则清理成更干净的输出，适合批量处理多余空格、换行、空行、制表符和标点符号。可用于表格导入前整理、运营文案清洗、日志片段规整、复制内容去噪和数据预处理。',
  input:
    '任意待清理文本。可包含空格、换行、空白行、Tab、中文/英文标点、混合语言内容和从网页或文档复制出的格式噪声。',
  output:
    '按勾选规则处理后的纯文本结果，并展示输出字符数。结果可复制，也可下载为 .txt 文件。',
  processing:
    '工具在浏览器中按顺序执行字符串替换：压缩空白行、移除普通空格、移除换行符、移除制表符、移除 Unicode 标点符号。输出会随输入和规则变化实时更新。',
  modes: ['移除空格', '移除换行', '移除空白行', '移除 Tab', '移除标点', '实时输出', '复制结果', 'TXT 下载'],
  example: {
    title: '文本清洗输入到输出示例',
    input: 'Hello,  ToolOrbit!\n\n文本\t清洗。',
    output: 'Hello ToolOrbit\n文本清洗',
    inputLanguage: 'text',
    outputLanguage: 'text',
  },
};

export default function TextCleaner() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  
  // Cleaning Options
  const [removeSpaces, setRemoveSpaces] = useState(false); // only space character ' '
  const [removeNewlines, setRemoveNewlines] = useState(false); // \n and \r
  const [removeTabs, setRemoveTabs] = useState(false); // \t
  const [removePunctuation, setRemovePunctuation] = useState(false); // Symbols and punctuation
  const [removeBlankLines, setRemoveBlankLines] = useState(false); // Multiple newlines to single
  
  const [copied, setCopied] = useState(false);

  const cleanText = (text: string) => {
    let result = text;

    if (removeBlankLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }
    if (removeSpaces) {
      result = result.replace(/ /g, '');
    }
    if (removeNewlines) {
      result = result.replace(/\r?\n|\r/g, '');
    }
    if (removeTabs) {
      result = result.replace(/\t/g, '');
    }
    if (removePunctuation) {
      // Remove all punctuation (both standard and Chinese/Unicode)
      // Keeps letters, numbers, and whitespaces
      result = result.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    return result;
  };

  const outputText = useMemo(() => cleanText(inputText), [inputText, removeSpaces, removeNewlines, removeTabs, removePunctuation, removeBlankLines]);

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearAll = () => {
    setInputText('');
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned-text-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.text-cleaner.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.text-cleaner.subtitle')}
          </p>
        </div>
        <div>
           <button 
             onClick={clearAll}
             className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
           >
             <Trash2 className="w-4 h-4" /> {t('tools.text-cleaner.clearBtn')}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Left Side: Input */}
        <div className="flex flex-col space-y-3">
           <div className="flex items-center justify-between">
              <h3 className="block text-sm font-semibold leading-6 text-slate-900">
                 {t('tools.text-cleaner.inputHeader')}
              </h3>
              <span className="font-mono text-sm text-slate-400">
                 {t('tools.text-cleaner.charCount', { count: inputText.length })}
              </span>
           </div>

           <div className="flex h-[500px] flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('tools.text-cleaner.inputPlaceholder')}
                className="min-h-0 flex-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none focus:border-cyan-500"
              />
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">{t('tools.text-cleaner.rulesHeader')}</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                   {[
                     { checked: removeSpaces, setValue: setRemoveSpaces, label: t('tools.text-cleaner.ruleSpaces') },
                     { checked: removeNewlines, setValue: setRemoveNewlines, label: t('tools.text-cleaner.ruleNewlines') },
                     { checked: removeBlankLines, setValue: setRemoveBlankLines, label: t('tools.text-cleaner.ruleBlankLines') },
                     { checked: removeTabs, setValue: setRemoveTabs, label: t('tools.text-cleaner.ruleTabs') },
                     { checked: removePunctuation, setValue: setRemovePunctuation, label: t('tools.text-cleaner.rulePunctuation') },
                   ].map((rule) => (
                     <label key={rule.label} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">
                       <input
                         type="checkbox"
                         checked={rule.checked}
                         onChange={(event) => rule.setValue(event.target.checked)}
                         className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                       />
                       <span className="truncate">{rule.label}</span>
                     </label>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-col space-y-3">
           <div className="flex items-center justify-between">
              <h3 className="block text-sm font-semibold leading-6 text-slate-900">
                 {t('tools.text-cleaner.outputHeader')}
              </h3>
              <div className="flex items-center gap-3">
                 <span className="mr-2 font-mono text-sm text-slate-400">
                    {t('tools.text-cleaner.charCount', { count: outputText.length })}
                 </span>
                 {outputText && (
                    <>
                       <button
                         onClick={handleDownload}
                         className="rounded-md border border-slate-300 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700"
                         title={t('tools.text-cleaner.downloadTitle')}
                       >
                         <Download className="w-5 h-5" />
                       </button>
                       <button
                         onClick={copyToClipboard}
                         className="rounded-md border border-slate-300 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700"
                         title={t('tools.text-cleaner.copyTitle')}
                       >
                         {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </>
                 )}
              </div>
           </div>
           
           <div className="relative h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
              <textarea
                value={outputText}
                readOnly
                placeholder={t('tools.text-cleaner.outputPlaceholder')}
                className="h-full w-full resize-none bg-transparent p-4 text-sm leading-6 text-slate-950 outline-none"
              ></textarea>
              
              {!outputText && !inputText && (
                 <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-slate-400">
                    <Eraser className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">{t('tools.text-cleaner.supportMsg')}</p>
                 </div>
              )}
           </div>
        </div>

      </div>

      <ToolSEOCard toolKey="text-cleaner" overview={TEXT_CLEANER_OVERVIEW} />
    </div>
  );
}
