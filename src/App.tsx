/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/base64" element={<Base64 />} />
          <Route path="/tools/ascii-table" element={<AsciiTable />} />
          <Route path="/tools/url-encoder" element={<UrlEncoder />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
          <Route path="/tools/unicode-converter" element={<UnicodeConverter />} />
          <Route path="/tools/chmod-calculator" element={<ChmodCalculator />} />
          <Route path="/tools/text-analyzer" element={<TextAnalyzer />} />
          <Route path="/tools/text-cleaner" element={<TextCleaner />} />
          <Route path="/tools/symbol-library" element={<SymbolLibrary />} />
          <Route path="/tools/qr-generator" element={<QrGenerator />} />
          <Route path="/tools/qr-scanner" element={<QrScanner />} />
          <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/tools/etsy-fee-calculator" element={<EtsyFeeCalculator />} />
          <Route path="/tools/stripe-fee-calculator" element={<StripeFeeCalculator />} />
          <Route path="/tools/listing-craft-ai" element={<ListingCraft />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/base-converter" element={<BaseConverter />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/svg-to-png" element={<SvgToPng />} />
          <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
          <Route path="/tools/image-cropper" element={<ImageCropper />} />
          
          <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
          <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/tools/pdf-merge" element={<PdfMerge />} />
          <Route path="/tools/pdf-split" element={<PdfSplit />} />
          
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/time-converter" element={<TimeConverter />} />
          <Route path="/tools/archive-converter" element={<ArchiveConverter />} />
          <Route path="/tools/rmb-converter" element={<RmbConverter />} />
          <Route path="/tools/ppi-calculator" element={<PpiCalculator />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
