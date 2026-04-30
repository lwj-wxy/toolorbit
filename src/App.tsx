/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './hooks/usePageTracking';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/tools/dev/JsonFormatter';
import Base64 from './pages/tools/dev/Base64';
import AsciiTable from './pages/tools/dev/AsciiTable';
import UrlEncoder from './pages/tools/dev/UrlEncoder';
import HashGenerator from './pages/tools/dev/HashGenerator';
import UuidGenerator from './pages/tools/dev/UuidGenerator';
import UnicodeConverter from './pages/tools/dev/UnicodeConverter';
import ChmodCalculator from './pages/tools/dev/ChmodCalculator';
import TextAnalyzer from './pages/tools/text/TextAnalyzer';
import TextCleaner from './pages/tools/text/TextCleaner';
import SymbolLibrary from './pages/tools/text/SymbolLibrary';
import QrGenerator from './pages/tools/image/QrGenerator';
import QrScanner from './pages/tools/image/QrScanner';
import BarcodeGenerator from './pages/tools/image/BarcodeGenerator';
import EtsyFeeCalculator from './pages/tools/ecommerce/EtsyFee';
import StripeFeeCalculator from './pages/tools/ecommerce/StripeFee';
import ListingCraft from './pages/tools/ecommerce/ListingCraft';
import PlaceholderTool from './pages/tools/shared/PlaceholderTool';

import ColorConverter from './pages/tools/dev/ColorConverter';
import ColorPalette from './pages/tools/dev/ColorPalette';
import ColorPicker from './pages/tools/dev/ColorPicker';
import ImageToIco from './pages/tools/image/ImageToIco';
import TimestampConverter from './pages/tools/dev/TimestampConverter';
import BaseConverter from './pages/tools/dev/BaseConverter';
import ImageCompressor from './pages/tools/image/ImageCompressor';
import ImageConverter from './pages/tools/image/ImageConverter';
import ImageToBase64 from './pages/tools/image/ImageToBase64';
import SvgToPng from './pages/tools/image/SvgToPng';
import PdfToImage from './pages/tools/pdf/PdfToImage';
import ImageToPdf from './pages/tools/pdf/ImageToPdf';
import PdfMerge from './pages/tools/pdf/PdfMerge';
import PdfSplit from './pages/tools/pdf/PdfSplit';
import ImageCropper from './pages/tools/image/ImageCropper';
import UnitConverter from './pages/tools/calculate/UnitConverter';
import TimeConverter from './pages/tools/calculate/TimeConverter';
import ArchiveConverter from './pages/tools/calculate/ArchiveConverter';
import RmbConverter from './pages/tools/calculate/RmbConverter';
import PpiCalculator from './pages/tools/calculate/PpiCalculator';

import ShortUrl from './pages/tools/net/ShortUrl';
import Game2048 from './pages/tools/fun/Game2048';
import PasswordGenerator from './pages/tools/dev/PasswordGenerator';
import JwtDebugger from './pages/tools/dev/JwtDebugger';
import JsonToTs from './pages/tools/dev/JsonToTs';
import RegexTester from './pages/tools/dev/RegexTester';
import Minesweeper from './pages/tools/fun/Minesweeper';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/dev/json-formatter" element={<JsonFormatter />} />
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
          <Route path="/tools/ecommerce/listing-craft-ai" element={<ListingCraft />} />
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
          <Route path="/tools/fun/minesweeper" element={<Minesweeper />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
