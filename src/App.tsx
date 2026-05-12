/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { usePageTracking } from './hooks/usePageTracking';
import ScrollToTop from './components/ScrollToTop';
import RecentToolsTracker from './components/RecentToolsTracker';
import Layout from './components/Layout';

// Core Pages
const Home = lazy(() => import('./views/Home'));
const BlogList = lazy(() => import('./views/BlogList'));
const BlogPost = lazy(() => import('./views/BlogPost'));
const Privacy = lazy(() => import('./views/Privacy'));
const Terms = lazy(() => import('./views/Terms'));
const About = lazy(() => import('./views/About'));

// Dev Tools
const JsonFormatter = lazy(() => import('./views/tools/dev/JsonFormatter'));
const XmlToJson = lazy(() => import('./views/tools/dev/XmlToJson'));
const TextDiff = lazy(() => import('./views/tools/dev/TextDiff'));
const Base64 = lazy(() => import('./views/tools/dev/Base64'));
const AsciiTable = lazy(() => import('./views/tools/dev/AsciiTable'));
const UrlEncoder = lazy(() => import('./views/tools/dev/UrlEncoder'));
const HashGenerator = lazy(() => import('./views/tools/dev/HashGenerator'));
const UuidGenerator = lazy(() => import('./views/tools/dev/UuidGenerator'));
const UnicodeConverter = lazy(() => import('./views/tools/dev/UnicodeConverter'));
const ChmodCalculator = lazy(() => import('./views/tools/dev/ChmodCalculator'));
const ColorConverter = lazy(() => import('./views/tools/dev/ColorConverter'));
const ColorPalette = lazy(() => import('./views/tools/dev/ColorPalette'));
const ColorPicker = lazy(() => import('./views/tools/dev/ColorPicker'));
const TimestampConverter = lazy(() => import('./views/tools/dev/TimestampConverter'));
const BaseConverter = lazy(() => import('./views/tools/dev/BaseConverter'));
const PasswordGenerator = lazy(() => import('./views/tools/dev/PasswordGenerator'));
const JwtDebugger = lazy(() => import('./views/tools/dev/JwtDebugger'));
const JsonToTs = lazy(() => import('./views/tools/dev/JsonToTs'));
const RegexTester = lazy(() => import('./views/tools/dev/RegexTester'));
const CryptoSymmetric = lazy(() => import('./views/tools/dev/CryptoSymmetric'));
const MorseCode = lazy(() => import('./views/tools/dev/MorseCode'));
const HexStringConverter = lazy(() => import('./views/tools/dev/HexStringConverter'));
const ChineseCrypto = lazy(() => import('./views/tools/dev/ChineseCrypto'));

// Text Tools
const TextAnalyzer = lazy(() => import('./views/tools/text/TextAnalyzer'));
const TextCleaner = lazy(() => import('./views/tools/text/TextCleaner'));
const SymbolLibrary = lazy(() => import('./views/tools/text/SymbolLibrary'));

// Image Tools
const QrGenerator = lazy(() => import('./views/tools/image/QrGenerator'));
const QrScanner = lazy(() => import('./views/tools/image/QrScanner'));
const BarcodeGenerator = lazy(() => import('./views/tools/image/BarcodeGenerator'));
const ImageToIco = lazy(() => import('./views/tools/image/ImageToIco'));
const ImageCompressor = lazy(() => import('./views/tools/image/ImageCompressor'));
const ImageConverter = lazy(() => import('./views/tools/image/ImageConverter'));
const ImageToBase64 = lazy(() => import('./views/tools/image/ImageToBase64'));
const SvgToPng = lazy(() => import('./views/tools/image/SvgToPng'));
const ImageCropper = lazy(() => import('./views/tools/image/ImageCropper'));

// PDF Tools
const PdfToImage = lazy(() => import('./views/tools/pdf/PdfToImage'));
const ImageToPdf = lazy(() => import('./views/tools/pdf/ImageToPdf'));
const PdfMerge = lazy(() => import('./views/tools/pdf/PdfMerge'));
const PdfSplit = lazy(() => import('./views/tools/pdf/PdfSplit'));

// Ecommerce Tools
const EtsyFeeCalculator = lazy(() => import('./views/tools/ecommerce/EtsyFee'));
const StripeFeeCalculator = lazy(() => import('./views/tools/ecommerce/StripeFee'));

// AI Tools
const Xiaohongshu = lazy(() => import('./views/tools/ai/Xiaohongshu'));
const ListingGenerator = lazy(() => import('./views/tools/ai/ListingGenerator'));
const KeywordAnalyzer = lazy(() => import('./views/tools/ai/KeywordAnalyzer'));
const CompetitorTracker = lazy(() => import('./views/tools/ai/CompetitorTracker'));
const MarketInsights = lazy(() => import('./views/tools/ai/MarketInsights'));
const TextPolisher = lazy(() => import('./views/tools/ai/TextPolisher'));
const Translator = lazy(() => import('./views/tools/ai/Translator'));
const PromptGenerator = lazy(() => import('./views/tools/ai/PromptGenerator'));
const WeeklyReport = lazy(() => import('./views/tools/ai/WeeklyReport'));
const CodeReviewer = lazy(() => import('./views/tools/ai/CodeReviewer'));
const VideoScript = lazy(() => import('./views/tools/ai/VideoScript'));
const MeetingMinutes = lazy(() => import('./views/tools/ai/MeetingMinutes'));
const ExcelFormula = lazy(() => import('./views/tools/ai/ExcelFormula'));
const RegexGenerator = lazy(() => import('./views/tools/ai/RegexGenerator'));
const SvgGenerator = lazy(() => import('./views/tools/ai/SvgGenerator'));
const LogoGenerator = lazy(() => import('./views/tools/ai/LogoGenerator'));
const ImageGenerator = lazy(() => import('./views/tools/ai/ImageGenerator'));
const YoutubeGenerator = lazy(() => import('./views/tools/ai/YoutubeGenerator'));

// Calculate & Unit Tools
const UnitConverter = lazy(() => import('./views/tools/calculate/UnitConverter'));
const TimeConverter = lazy(() => import('./views/tools/calculate/TimeConverter'));
const ArchiveConverter = lazy(() => import('./views/tools/calculate/ArchiveConverter'));
const RmbConverter = lazy(() => import('./views/tools/calculate/RmbConverter'));
const PpiCalculator = lazy(() => import('./views/tools/calculate/PpiCalculator'));

// Other Tools
const ShortUrl = lazy(() => import('./views/tools/net/ShortUrl'));
const Game2048 = lazy(() => import('./views/tools/fun/Game2048'));
const Minesweeper = lazy(() => import('./views/tools/fun/Minesweeper'));
const PlaceholderTool = lazy(() => import('./views/tools/shared/PlaceholderTool'));

function Loading() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-sm"></div>
    </div>
  );
}

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RecentToolsTracker />
          <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
          <AnalyticsTracker />
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
            <Route path="/" element={<Home />} />
            {/* ... other routes ... */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools/dev/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/dev/xml-to-json" element={<XmlToJson />} />
            <Route path="/tools/dev/text-diff" element={<TextDiff />} />
            <Route path="/tools/dev/base64" element={<Base64 />} />
            <Route path="/tools/dev/ascii-table" element={<AsciiTable />} />
            <Route path="/tools/dev/url-encoder" element={<UrlEncoder />} />
            <Route path="/tools/dev/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/dev/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/dev/unicode-converter" element={<UnicodeConverter />} />
            <Route path="/tools/dev/chmod-calculator" element={<ChmodCalculator />} />
            
            <Route path="/tools/dev/color-converter" element={<ColorConverter />} />
            <Route path="/tools/dev/color-palette" element={<ColorPalette />} />
            <Route path="/tools/dev/color-picker" element={<ColorPicker />} />
            <Route path="/tools/image/image-to-ico" element={<ImageToIco />} />
            
            <Route path="/tools/text/text-analyzer" element={<TextAnalyzer />} />
            <Route path="/tools/text/text-cleaner" element={<TextCleaner />} />
            <Route path="/tools/text/symbol-library" element={<SymbolLibrary />} />
            <Route path="/tools/generator/qr-generator" element={<QrGenerator />} />
            <Route path="/tools/generator/qr-scanner" element={<QrScanner />} />
            <Route path="/tools/generator/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/ecommerce/etsy-fee-calculator" element={<EtsyFeeCalculator />} />
            <Route path="/tools/ecommerce/stripe-fee-calculator" element={<StripeFeeCalculator />} />
            <Route path="/tools/ai/listing-generator" element={<ListingGenerator />} />
            <Route path="/tools/ai/keyword-analyzer" element={<KeywordAnalyzer />} />
            <Route path="/tools/ai/competitor-tracker" element={<CompetitorTracker />} />
            <Route path="/tools/ai/market-insights" element={<MarketInsights />} />
            <Route path="/tools/ai/text-polisher" element={<TextPolisher />} />
            <Route path="/tools/ai/translator" element={<Translator />} />
            <Route path="/tools/ai/prompt-generator" element={<PromptGenerator />} />
            <Route path="/tools/ai/weekly-report" element={<WeeklyReport />} />
            <Route path="/tools/ai/code-reviewer" element={<CodeReviewer />} />
            <Route path="/tools/ai/video-script" element={<VideoScript />} />
            <Route path="/tools/ai/meeting-minutes" element={<MeetingMinutes />} />
            <Route path="/tools/ai/excel-formula" element={<ExcelFormula />} />
            <Route path="/tools/ai/regex" element={<RegexGenerator />} />
            <Route path="/tools/ai/svg-generator" element={<SvgGenerator />} />
            <Route path="/tools/ai/logo-generator" element={<LogoGenerator />} />
            <Route path="/tools/ai/image-generator" element={<ImageGenerator />} />
            <Route path="/tools/ai/youtube-generator" element={<YoutubeGenerator />} />
            <Route path="/tools/ai/xiaohongshu" element={<Xiaohongshu />} />
            <Route path="/tools/dev/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/dev/base-converter" element={<BaseConverter />} />
            <Route path="/tools/image/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image/image-converter" element={<ImageConverter />} />
            <Route path="/tools/image/svg-to-png" element={<SvgToPng />} />
            <Route path="/tools/image/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/image/image-cropper" element={<ImageCropper />} />
            
            <Route path="/tools/pdf/pdf-to-image" element={<PdfToImage />} />
            <Route path="/tools/pdf/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/tools/pdf/pdf-merge" element={<PdfMerge />} />
            <Route path="/tools/pdf/pdf-split" element={<PdfSplit />} />
            
            <Route path="/tools/calculate/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/calculate/time-converter" element={<TimeConverter />} />
            <Route path="/tools/calculate/archive-converter" element={<ArchiveConverter />} />
            <Route path="/tools/calculate/rmb-converter" element={<RmbConverter />} />
            <Route path="/tools/calculate/ppi-calculator" element={<PpiCalculator />} />

            <Route path="/tools/net/short-url" element={<ShortUrl />} />
            <Route path="/tools/fun/game-2048" element={<Game2048 />} />
            <Route path="/tools/dev/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/dev/jwt-debugger" element={<JwtDebugger />} />
            <Route path="/tools/dev/json-to-ts" element={<JsonToTs />} />
            <Route path="/tools/dev/regex-tester" element={<RegexTester />} />
            <Route path="/tools/dev/crypto-symmetric" element={<CryptoSymmetric />} />
            <Route path="/tools/dev/morse-code" element={<MorseCode />} />
            <Route path="/tools/dev/hex-string-converter" element={<HexStringConverter />} />
            <Route path="/tools/dev/chinese-crypto" element={<ChineseCrypto />} />
            <Route path="/tools/fun/minesweeper" element={<Minesweeper />} />
            {/* Catch-all route to redirect invalid paths to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  </ThemeProvider>
);
}
