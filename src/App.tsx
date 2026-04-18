/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/tools/JsonFormatter';
import Base64 from './pages/tools/Base64';
import UrlEncoder from './pages/tools/UrlEncoder';
import HashGenerator from './pages/tools/HashGenerator';
import TextAnalyzer from './pages/tools/TextAnalyzer';
import QrGenerator from './pages/tools/QrGenerator';
import EtsyFeeCalculator from './pages/tools/EtsyFee';
import StripeFeeCalculator from './pages/tools/StripeFee';
import ListingCraft from './pages/tools/ListingCraft';
import PlaceholderTool from './pages/tools/PlaceholderTool';
import TimestampConverter from './pages/tools/TimestampConverter';
import ImageCompressor from './pages/tools/ImageCompressor';
import ImageConverter from './pages/tools/ImageConverter';
import SvgToPng from './pages/tools/SvgToPng';
import PngToSvg from './pages/tools/PngToSvg';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/base64" element={<Base64 />} />
          <Route path="/tools/url-encoder" element={<UrlEncoder />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/text-analyzer" element={<TextAnalyzer />} />
          <Route path="/tools/qr-generator" element={<QrGenerator />} />
          <Route path="/tools/etsy-fee-calculator" element={<EtsyFeeCalculator />} />
          <Route path="/tools/stripe-fee-calculator" element={<StripeFeeCalculator />} />
          <Route path="/tools/listing-craft-ai" element={<ListingCraft />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/svg-to-png" element={<SvgToPng />} />
          <Route path="/tools/png-to-svg" element={<PngToSvg />} />
          
          {/* Newly Added Tools (Placeholders) */}
          <Route path="/tools/pdf-merge" element={<PlaceholderTool title="PDF合并工具" />} />
          <Route path="/tools/pdf-split" element={<PlaceholderTool title="PDF拆分工具" />} />
          <Route path="/tools/pdf-to-image" element={<PlaceholderTool title="PDF转图片工具" />} />
          <Route path="/tools/image-to-pdf" element={<PlaceholderTool title="图片转PDF工具" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
