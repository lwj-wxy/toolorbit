'use client';

import type { ComponentType } from 'react';
import {
  Barcode,
  Banknote,
  Binary,
  Calculator,
  Clapperboard,
  Code,
  Code2,
  CreditCard,
  Crop,
  Eraser,
  FileCode,
  FileCode2,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  Files,
  Fingerprint,
  Hash,
  Hexagon,
  Image,
  ImageIcon,
  ImageMinus,
  Keyboard,
  Languages,
  Layers,
  Link as LinkIcon,
  Link2,
  Lock,
  Mic,
  MonitorSmartphone,
  Palette,
  Pipette,
  QrCode,
  RefreshCcw,
  Regex,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Terminal,
  Type,
  Wand2,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import type { NavCategory, NavTool } from '../lib/navigation-menu';

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  'ai-youtube-generator': Clapperboard,
  'ai-prompt-generator': ImageIcon,
  'ai-weekly-report': FileText,
  'ai-code-reviewer': FileCode2,
  'ai-video-script': Clapperboard,
  'ai-meeting-minutes': Mic,
  'ai-excel-formula': FileSpreadsheet,
  'ai-regex': Terminal,
  'logo-generator': Hexagon,
  'ai-image-generator': Image,
  'ai-svg-generator': Image,
  'ai-xiaohongshu': Sparkles,
  'ai-text-polisher': Wand2,
  'ai-translator': Languages,
  'json-formatter': Code2,
  'xml-json': RefreshCcw,
  'text-diff': Layers,
  base64: Binary,
  'ascii-table': Hash,
  'url-encoder': LinkIcon,
  'hash-generator': Hash,
  'uuid-generator': Fingerprint,
  'unicode-converter': Code,
  'text-analyzer': Type,
  'text-cleaner': Eraser,
  'symbol-library': Keyboard,
  'qr-generator': QrCode,
  'qr-scanner': ScanLine,
  'barcode-generator': Barcode,
  'etsy-fee-calculator': ShoppingCart,
  'etsy-offsite-ads-calculator': Target,
  'etsy-pricing-calculator': Calculator,
  'etsy-regulatory-fee-calculator': Banknote,
  'stripe-fee-calculator': CreditCard,
  'listing-generator': Sparkles,
  'keyword-analyzer': Zap,
  'competitor-tracker': Target,
  'market-insights': BarChart3,
  'pdf-merge': Files,
  'pdf-split': FileText,
  'pdf-to-image': FileImage,
  'image-to-pdf': ImageIcon,
  'image-compressor': ImageMinus,
  'image-converter': RefreshCcw,
  'svg-to-png': FileImage,
  'image-to-base64': FileCode2,
  'image-cropper': Crop,
  'anime-screenshot-source': ScanLine,
  'timestamp-converter': Calculator,
  'base-converter': Calculator,
  'unit-converter': Calculator,
  'time-converter': Calculator,
  'archive-converter': RefreshCcw,
  'rmb-converter': Banknote,
  'ppi-calculator': MonitorSmartphone,
  'color-converter': Palette,
  'color-palette': Palette,
  'color-picker': Pipette,
  'image-to-ico': ImageIcon,
  'short-url': Link2,
  'password-generator': ShieldCheck,
  'jwt-debugger': Layers,
  'regex-tester': Regex,
  'json-to-ts': FileJson,
  'crypto-symmetric': Lock,
  'hex-string-converter': FileCode,
  'chinese-crypto': ShieldCheck,
};

export function ToolNavIcon({
  id,
  size = 16,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[id] || Sparkles;
  return <Icon size={size} className={className} />;
}

export function ToolsMegaDropdown({ categories }: { categories: NavCategory[] }) {
  const { t } = useTranslation();

  return (
    <div className="absolute left-0 top-[58px] z-50 invisible w-full -translate-y-1 border-b border-slate-200/80 bg-[#f7f8fb]/95 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="mx-auto max-w-[1536px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6">
          {categories.map(({ category, path, tools }) => {
            return (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="mb-2 px-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-500">
                  {t(`common.categories.${category}`)}
                </h3>
                <div className="flex flex-col gap-1">
                  {tools.slice(0, 6).map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group/item flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-white dark:hover:bg-slate-900"
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                        <ToolNavIcon id={tool.id} size={16} />
                      </div>
                      <span className="truncate text-[13px] font-medium text-slate-700 transition-colors group-hover/item:text-blue-600 dark:text-slate-300 dark:group-hover/item:text-blue-400">
                        {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                      </span>
                    </Link>
                  ))}
                  {tools.length > 6 && (
                    <Link
                      to={path}
                      className="mt-1 px-2 text-[12px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {t('common.viewMore')}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const bgClassMap: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-400',
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400',
  violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 hover:border-violet-100 dark:hover:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 group-hover/item:text-violet-700 dark:group-hover/item:text-violet-400',
  amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:border-amber-100 dark:hover:border-amber-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 group-hover/item:text-amber-700 dark:group-hover/item:text-amber-400',
  rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:border-rose-100 dark:hover:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 group-hover/item:text-rose-700 dark:group-hover/item:text-rose-400',
  green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:border-green-100 dark:hover:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 group-hover/item:text-green-700 dark:group-hover/item:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 hover:border-orange-100 dark:hover:border-orange-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 group-hover/item:text-orange-700 dark:group-hover/item:text-orange-400',
  pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 hover:border-pink-100 dark:hover:border-pink-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 group-hover/item:text-pink-700 dark:group-hover/item:text-pink-400',
  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 hover:border-fuchsia-100 dark:hover:border-fuchsia-800/50 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 group-hover/item:text-fuchsia-700 dark:group-hover/item:text-fuchsia-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-400',
};

export function AiMegaDropdown({ aiCategoryPath, aiTools }: { aiCategoryPath: string; aiTools: NavTool[] }) {
  const { t } = useTranslation();

  return (
    <div className="absolute left-0 top-[58px] z-50 invisible w-full -translate-y-1 border-b border-slate-200/80 bg-[#f7f8fb]/95 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="mx-auto max-w-[1536px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-[13px] font-extrabold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
            {t('common.categories.AI 工具') || 'AI Tools'}
          </h3>
          <Link
            to={aiCategoryPath}
            className="text-[12px] font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t('common.viewMore')} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-1">
          {aiTools.map(tool => {
            const color = tool.color || 'violet';
            const classes = bgClassMap[color] || bgClassMap.violet;
            const titleHover = classes.split(' ').find(c => c.startsWith('group-hover/item:text-')) || '';
            const titleDarkHover = classes.split(' ').find(c => c.startsWith('dark:group-hover/item:text-')) || '';
            const iconBg = classes.split(' ').find(c => c.startsWith('bg-')) || '';
            const iconDarkBg = classes.split(' ').find(c => c.startsWith('dark:bg-')) || '';

            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group/item flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-white dark:hover:bg-slate-900"
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${iconBg} ${iconDarkBg} transition-colors`}>
                  <ToolNavIcon id={tool.id} size={15} />
                </div>
                <span className={`min-w-0 truncate text-[13px] font-medium text-slate-700 dark:text-slate-300 ${titleHover} ${titleDarkHover} transition-colors`}>
                  {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
