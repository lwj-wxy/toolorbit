'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type ToolComponent = ComponentType<Record<string, never>>;
type ToolLoader = () => Promise<{ default: ToolComponent }>;

const ToolLoading = () => (
  <div
    role="status"
    aria-label="Loading tool"
    className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white/70 p-8 dark:border-slate-800 dark:bg-slate-900/60"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
  </div>
);

const lazyTool = (loader: ToolLoader) =>
  dynamic(loader, {
    loading: ToolLoading,
  }) as ToolComponent;

export const toolComponentMap: Record<string, ToolComponent> = {
  '/tools/ai/youtube-generator': lazyTool(() => import('../views/tools/ai/YoutubeGenerator')),
  '/tools/ai/prompt-generator': lazyTool(() => import('../views/tools/ai/PromptGenerator')),
  '/tools/ai/weekly-report': lazyTool(() => import('../views/tools/ai/WeeklyReport')),
  '/tools/ai/code-reviewer': lazyTool(() => import('../views/tools/ai/CodeReviewer')),
  '/tools/ai/video-script': lazyTool(() => import('../views/tools/ai/VideoScript')),
  '/tools/ai/meeting-minutes': lazyTool(() => import('../views/tools/ai/MeetingMinutes')),
  '/tools/ai/excel-formula': lazyTool(() => import('../views/tools/ai/ExcelFormula')),
  '/tools/ai/regex': lazyTool(() => import('../views/tools/ai/RegexGenerator')),
  '/tools/ai/svg-generator': lazyTool(() => import('../views/tools/ai/SvgGenerator')),
  '/tools/ai/logo-generator': lazyTool(() => import('../views/tools/ai/LogoGenerator')),
  '/tools/ai/image-generator': lazyTool(() => import('../views/tools/ai/ImageGenerator')),
  '/tools/ai/xiaohongshu': lazyTool(() => import('../views/tools/ai/Xiaohongshu')),
  '/tools/ai/text-polisher': lazyTool(() => import('../views/tools/ai/TextPolisher')),
  '/tools/ai/translator': lazyTool(() => import('../views/tools/ai/Translator')),
  '/tools/ai/listing-generator': lazyTool(() => import('../views/tools/ai/ListingGenerator')),
  '/tools/ai/keyword-analyzer': lazyTool(() => import('../views/tools/ai/KeywordAnalyzer')),
  '/tools/ai/competitor-tracker': lazyTool(() => import('../views/tools/ai/CompetitorTracker')),
  '/tools/ai/market-insights': lazyTool(() => import('../views/tools/ai/MarketInsights')),
  '/tools/calculate/archive-converter': lazyTool(() => import('../views/tools/calculate/ArchiveConverter')),
  '/tools/calculate/ppi-calculator': lazyTool(() => import('../views/tools/calculate/PpiCalculator')),
  '/tools/calculate/rmb-converter': lazyTool(() => import('../views/tools/calculate/RmbConverter')),
  '/tools/calculate/time-converter': lazyTool(() => import('../views/tools/calculate/TimeConverter')),
  '/tools/calculate/unit-converter': lazyTool(() => import('../views/tools/calculate/UnitConverter')),
  '/tools/dev/ascii-table': lazyTool(() => import('../views/tools/dev/AsciiTable')),
  '/tools/dev/base64': lazyTool(() => import('../views/tools/dev/Base64')),
  '/tools/dev/base-converter': lazyTool(() => import('../views/tools/dev/BaseConverter')),
  '/tools/dev/chinese-crypto': lazyTool(() => import('../views/tools/dev/ChineseCrypto')),
  '/tools/dev/chmod-calculator': lazyTool(() => import('../views/tools/dev/ChmodCalculator')),
  '/tools/dev/color-converter': lazyTool(() => import('../views/tools/dev/ColorConverter')),
  '/tools/dev/color-palette': lazyTool(() => import('../views/tools/dev/ColorPalette')),
  '/tools/dev/color-picker': lazyTool(() => import('../views/tools/dev/ColorPicker')),
  '/tools/dev/crypto-symmetric': lazyTool(() => import('../views/tools/dev/CryptoSymmetric')),
  '/tools/dev/hash-generator': lazyTool(() => import('../views/tools/dev/HashGenerator')),
  '/tools/dev/hex-string-converter': lazyTool(() => import('../views/tools/dev/HexStringConverter')),
  '/tools/dev/json-formatter': lazyTool(() => import('../views/tools/dev/JsonFormatter')),
  '/tools/dev/json-to-ts': lazyTool(() => import('../views/tools/dev/JsonToTs')),
  '/tools/dev/jwt-debugger': lazyTool(() => import('../views/tools/dev/JwtDebugger')),
  '/tools/dev/morse-code': lazyTool(() => import('../views/tools/dev/MorseCode')),
  '/tools/dev/password-generator': lazyTool(() => import('../views/tools/dev/PasswordGenerator')),
  '/tools/dev/regex-tester': lazyTool(() => import('../views/tools/dev/RegexTester')),
  '/tools/dev/text-diff': lazyTool(() => import('../views/tools/dev/TextDiff')),
  '/tools/dev/timestamp-converter': lazyTool(() => import('../views/tools/dev/TimestampConverter')),
  '/tools/dev/unicode-converter': lazyTool(() => import('../views/tools/dev/UnicodeConverter')),
  '/tools/dev/url-encoder': lazyTool(() => import('../views/tools/dev/UrlEncoder')),
  '/tools/dev/uuid-generator': lazyTool(() => import('../views/tools/dev/UuidGenerator')),
  '/tools/dev/xml-to-json': lazyTool(() => import('../views/tools/dev/XmlToJson')),
  '/tools/ecommerce/etsy-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/EtsyFee')),
  '/tools/ecommerce/stripe-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/StripeFee')),
  '/tools/fun/game-2048': lazyTool(() => import('../views/tools/fun/Game2048')),
  '/tools/fun/minesweeper': lazyTool(() => import('../views/tools/fun/Minesweeper')),
  '/tools/generator/barcode-generator': lazyTool(() => import('../views/tools/image/BarcodeGenerator')),
  '/tools/generator/qr-generator': lazyTool(() => import('../views/tools/image/QrGenerator')),
  '/tools/generator/qr-scanner': lazyTool(() => import('../views/tools/image/QrScanner')),
  '/tools/image/image-compressor': lazyTool(() => import('../views/tools/image/ImageCompressor')),
  '/tools/image/image-converter': lazyTool(() => import('../views/tools/image/ImageConverter')),
  '/tools/image/image-cropper': lazyTool(() => import('../views/tools/image/ImageCropper')),
  '/tools/image/image-to-base64': lazyTool(() => import('../views/tools/image/ImageToBase64')),
  '/tools/image/image-to-ico': lazyTool(() => import('../views/tools/image/ImageToIco')),
  '/tools/image/svg-to-png': lazyTool(() => import('../views/tools/image/SvgToPng')),
  '/tools/net/short-url': lazyTool(() => import('../views/tools/net/ShortUrl')),
  '/tools/pdf/image-to-pdf': lazyTool(() => import('../views/tools/pdf/ImageToPdf')),
  '/tools/pdf/pdf-merge': lazyTool(() => import('../views/tools/pdf/PdfMerge')),
  '/tools/pdf/pdf-split': lazyTool(() => import('../views/tools/pdf/PdfSplit')),
  '/tools/pdf/pdf-to-image': lazyTool(() => import('../views/tools/pdf/PdfToImage')),
  '/tools/shared/placeholder': lazyTool(() =>
    import('../views/tools/shared/PlaceholderTool').then((mod) => ({
      default: () => <mod.default title="Tool Coming Soon" />,
    }))
  ),
  '/tools/text/symbol-library': lazyTool(() => import('../views/tools/text/SymbolLibrary')),
  '/tools/text/text-analyzer': lazyTool(() => import('../views/tools/text/TextAnalyzer')),
  '/tools/text/text-cleaner': lazyTool(() => import('../views/tools/text/TextCleaner')),
};
