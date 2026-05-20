import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { xml2json, json2xml } from 'xml-js';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type JsonNode = {
  type?: string;
  name?: string;
  attributes?: Record<string, string>;
  children?: Array<JsonNode | string>;
  text?: string;
};

function looksLikeHtml(source: string) {
  return /<!doctype\s+html/i.test(source) || /<html[\s>]/i.test(source);
}

function domNodeToJson(node: Node): JsonNode | string | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? text : null;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as Element;
  const attributes = Array.from(element.attributes).reduce<Record<string, string>>((acc, attr) => {
    acc[attr.name] = attr.value;
    return acc;
  }, {});
  const children = Array.from(element.childNodes)
    .map(domNodeToJson)
    .filter((child): child is JsonNode | string => child !== null);

  return {
    type: 'element',
    name: element.tagName.toLowerCase(),
    ...(Object.keys(attributes).length ? { attributes } : {}),
    ...(children.length ? { children } : {}),
  };
}

function htmlToJson(source: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(source, 'text/html');
  const root = domNodeToJson(doc.documentElement);
  return JSON.stringify({ documentType: 'html', root }, null, 2);
}

export default function XmlToJson() {
  const { t } = useTranslation();
  
  const [sourceCode, setSourceCode] = useState('');
  const [resultCode, setResultCode] = useState('');
  const [mode, setMode] = useState<'xml2json' | 'json2xml'>('xml2json');
  const [error, setError] = useState<string | null>(null);

  // Conversion logic
  useEffect(() => {
    if (!sourceCode.trim()) {
      setResultCode('');
      setError(null);
      return;
    }

    try {
      if (mode === 'xml2json') {
        const jsonResult = looksLikeHtml(sourceCode)
          ? htmlToJson(sourceCode)
          : xml2json(sourceCode, { compact: true, spaces: 2 });
        setResultCode(jsonResult);
        setError(null);
      } else {
        JSON.parse(sourceCode);
        const xmlResult = json2xml(sourceCode, { compact: true, spaces: 2 });
        setResultCode(xmlResult);
        setError(null);
      }
    } catch (err: any) {
      setResultCode('');
      setError(err.message || 'Parsing error');
    }
  }, [sourceCode, mode]);

  const toggleMode = () => {
    // If there is valid result code, use it as the new source
    if (resultCode && !error) {
      setSourceCode(resultCode);
    }
    setMode(prev => prev === 'xml2json' ? 'json2xml' : 'xml2json');
  };

  const handleCopy = () => {
    if (resultCode) {
      navigator.clipboard.writeText(resultCode)
        .then(() => toast.success(t('common.copied', '已复制到剪贴板')))
        .catch(() => toast.error('复制失败'));
    }
  };

  const handleClear = () => {
    setSourceCode('');
    setResultCode('');
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 border-b border-slate-200 pb-7 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {t('tools.xml-json.title', 'XML ↔ JSON 互转器')}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {t('tools.xml-json.subtitle', '用于 XML 配置、接口响应、RSS/Sitemap/SVG 片段与 JSON 之间的结构转换；粘贴 HTML 页面源码时会自动使用宽松 HTML 解析。')}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
          <span className={cn("rounded px-3 py-1.5 text-sm font-medium transition-colors", mode === 'xml2json' ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
            XML
          </span>
          <button
            onClick={toggleMode}
            className="rounded p-1.5 text-blue-600 transition-colors hover:bg-white dark:text-blue-300 dark:hover:bg-slate-950"
            title="切换方向"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          <span className={cn("rounded px-3 py-1.5 text-sm font-medium transition-colors", mode === 'json2xml' ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
            JSON
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Trash2 className="h-4 w-4" />
            {t('common.clear', '清空')}
          </button>
          <button
            onClick={handleCopy}
            disabled={!resultCode || !!error}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            {t('common.copy', '复制结果')}
          </button>
        </div>
      </div>

      <div className="grid min-h-[600px] grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[600px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {mode === 'xml2json' ? '输入 XML / HTML' : '输入 JSON'}
            </h2>
            <span className="font-mono text-[12px] text-slate-400">
              {mode === 'xml2json' ? 'XML' : 'JSON'}
            </span>
          </div>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder={mode === 'xml2json' ? '<root>\n  <item>Hello</item>\n</root>' : '{\n  "root": {\n    "item": "Hello"\n  }\n}'}
            className="min-h-0 flex-1 resize-none border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-800 placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
          {error && sourceCode && (
            <div className="max-h-32 overflow-auto border-t border-red-200 bg-red-50 p-3 font-mono text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[600px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {mode === 'xml2json' ? '输出 JSON' : '输出 XML'}
            </h2>
            <span className="font-mono text-[12px] text-slate-400">
              {mode === 'xml2json' ? 'JSON' : 'XML'}
            </span>
          </div>
          <textarea
            readOnly
            value={resultCode}
            placeholder="Output..."
            className="min-h-0 flex-1 resize-none border-0 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-300"
            spellCheck={false}
          />
        </section>
      </div>

      <ToolSEOCard toolKey="xml-json" />
    </div>
  );
}
