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
  Activity,
  CalendarDays,
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
  'ai-resume-optimizer': FileText,
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
  'bmi-calculator': Activity,
  'age-calculator': CalendarDays,
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
    <div className="absolute left-0 top-[58px] z-50 invisible w-full -translate-y-1 border-b border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_94%,transparent)] opacity-0 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-[var(--app-border)] dark:bg-[color-mix(in_srgb,var(--app-bg-soft)_94%,transparent)]">
      <div className="mx-auto max-w-[1536px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6">
          {categories.map(({ category, path, tools }) => {
            return (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="mb-2 px-2 text-[12px] font-bold uppercase tracking-wide text-[var(--app-muted)] dark:text-[var(--app-muted)]">
                  {t(`common.categories.${category}`)}
                </h3>
                <div className="flex flex-col gap-1">
                  {tools.slice(0, 6).map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group/item flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-[var(--app-accent-soft)] dark:hover:bg-[var(--app-accent-soft)]"
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center text-[var(--app-muted)] group-hover/item:text-[var(--app-accent-ink)] dark:group-hover/item:text-[var(--app-accent-ink)] transition-colors">
                        <ToolNavIcon id={tool.id} size={16} />
                      </div>
                      <span className="truncate text-[13px] font-medium text-[var(--app-text)] transition-colors group-hover/item:text-[var(--app-accent-ink)] dark:text-[var(--app-text)] dark:group-hover/item:text-[var(--app-accent-ink)]">
                        {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                      </span>
                    </Link>
                  ))}
                  {tools.length > 6 && (
                    <Link
                      to={path}
                      className="mt-1 px-2 text-[12px] font-semibold text-[var(--app-accent-ink)] hover:text-[var(--app-accent-strong)] dark:text-[var(--app-accent-ink)]"
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

export function AiMegaDropdown({ aiCategoryPath, aiTools }: { aiCategoryPath: string; aiTools: NavTool[] }) {
  const { t } = useTranslation();

  return (
    <div className="absolute left-0 top-[58px] z-50 invisible w-full -translate-y-1 border-b border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_94%,transparent)] opacity-0 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-[var(--app-border)] dark:bg-[color-mix(in_srgb,var(--app-bg-soft)_94%,transparent)]">
      <div className="mx-auto max-w-[1536px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[var(--app-muted)] dark:text-[var(--app-muted)]">
            {t('common.categories.AI 工具') || 'AI Tools'}
          </h3>
          <Link
            to={aiCategoryPath}
            className="text-[12px] font-semibold text-[var(--app-accent-ink)] hover:text-[var(--app-accent-strong)] dark:text-[var(--app-accent-ink)]"
          >
            {t('common.viewMore')} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-1">
          {aiTools.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group/item flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-[var(--app-accent-soft)] dark:hover:bg-[var(--app-accent-soft)]"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[var(--app-muted)] transition-colors group-hover/item:text-[var(--app-accent-ink)] dark:group-hover/item:text-[var(--app-accent-ink)]">
                <ToolNavIcon id={tool.id} size={15} />
              </div>
              <span className="min-w-0 truncate text-[13px] font-medium text-[var(--app-text)] transition-colors group-hover/item:text-[var(--app-accent-ink)] dark:text-[var(--app-text)] dark:group-hover/item:text-[var(--app-accent-ink)]">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
