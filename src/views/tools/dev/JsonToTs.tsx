import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Check, Copy, Trash2 } from 'lucide-react';
import JsonToTS from 'json-to-ts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

type HighlightedCodeInputProps = {
  value: string;
  placeholder: string;
  language: string;
  hasError?: boolean;
  onChange: (value: string) => void;
};

function codeBlockStyle() {
  return {
    margin: 0,
    minHeight: '100%',
    padding: '16px',
    background: 'transparent',
    fontSize: '14px',
    lineHeight: '1.75',
  } as const;
}

function HighlightedCodeInput({ value, placeholder, language, hasError, onChange }: HighlightedCodeInputProps) {
  const highlightRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-0 flex-1 bg-white dark:bg-slate-900">
      {!value ? (
        <div className="pointer-events-none absolute inset-0 p-4 font-mono text-sm leading-7 text-slate-400">
          {placeholder}
        </div>
      ) : null}
      <div ref={highlightRef} className="absolute inset-0 overflow-auto pointer-events-none">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={codeBlockStyle()}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
          wrapLongLines
        >
          {value || ' '}
        </SyntaxHighlighter>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event) => {
          if (!highlightRef.current) return;
          highlightRef.current.scrollTop = event.currentTarget.scrollTop;
          highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
        }}
        className={`absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-slate-900 outline-none selection:bg-blue-200/70 focus:ring-0 dark:caret-slate-100 dark:selection:bg-blue-500/30 ${
          hasError ? 'caret-red-700 dark:caret-red-300' : ''
        }`}
        spellCheck={false}
        aria-label={language}
      />
    </div>
  );
}

function HighlightedCodeOutput({ code, language, placeholder }: { code: string; language: string; placeholder: string }) {
  if (!code) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-4 font-mono text-sm italic text-slate-400 dark:bg-slate-950/40">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/40">
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={codeBlockStyle()}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const JsonToTs: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const interfaces = JsonToTS(parsed);
      setOutput(interfaces.join('\n\n'));
      setError(null);
    } catch (err: any) {
      setError(err.message || t('tools.json-to-ts.errorMsg'));
      setOutput('');
    }
  }, [input, t]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleExample = () => {
    const example = {
      id: 1,
      name: 'ToolOrbit',
      features: ['JSON Formatter', 'Base64', 'UUID'],
      author: {
        name: 'Developer',
        active: true,
      },
      tags: [1, 2, 3],
    };
    setInput(JSON.stringify(example, null, 2));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {t('tools.json-to-ts.title')}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
              {t('tools.json-to-ts.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExample}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('tools.json-to-ts.exampleBtn')}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/30"
              title={t('tools.json-to-ts.clearBtn')}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[560px] grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.json-to-ts.inputLabel')}
            </h2>
            <span className="font-mono text-[12px] text-slate-400">JSON</span>
          </div>
          <HighlightedCodeInput
            value={input}
            onChange={setInput}
            placeholder={t('tools.json-to-ts.placeholder')}
            language="json"
            hasError={Boolean(error)}
          />
          {error ? (
            <div className="flex max-h-32 items-start gap-2 overflow-auto border-t border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-mono">{error}</span>
            </div>
          ) : null}
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.json-to-ts.outputLabel')}
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] text-slate-400">TYPESCRIPT</span>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? t('tools.json-to-ts.copiedBtn') : t('tools.json-to-ts.copyBtn')}
              </button>
            </div>
          </div>
          <HighlightedCodeOutput code={output} language="typescript" placeholder={t('tools.json-to-ts.placeholder')} />
        </section>
      </div>

    </div>
  );
};

export default JsonToTs;
