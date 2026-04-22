/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/tools/dev/JsonFormatter';
import Base64 from './pages/tools/dev/Base64';
import UrlEncoder from './pages/tools/dev/UrlEncoder';
import HashGenerator from './pages/tools/dev/HashGenerator';
import TextAnalyzer from './pages/tools/text/TextAnalyzer';
import QrGenerator from './pages/tools/image/QrGenerator';
import EtsyFeeCalculator from './pages/tools/ecommerce/EtsyFee';
import StripeFeeCalculator from './pages/tools/ecommerce/StripeFee';
import ListingCraft from './pages/tools/ecommerce/ListingCraft';
import PlaceholderTool from './pages/tools/shared/PlaceholderTool';
import TimestampConverter from './pages/tools/dev/TimestampConverter';
import ImageCompressor from './pages/tools/image/ImageCompressor';
import ImageConverter from './pages/tools/image/ImageConverter';
import ImageToBase64 from './pages/tools/image/ImageToBase64';
import PdfToImage from './pages/tools/pdf/PdfToImage';
import ImageToPdf from './pages/tools/pdf/ImageToPdf';
import OfficeToPdf from './pages/tools/pdf/OfficeToPdf';
import ImageCropper from './pages/tools/image/ImageCropper';

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
          <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
          <Route path="/tools/image-cropper" element={<ImageCropper />} />
          
          <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
          <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/tools/office-to-pdf" element={<OfficeToPdf />} />
          
          {/* Newly Added Tools (Placeholders) */}
          <Route path="/tools/pdf-merge" element={<PlaceholderTool title="PDF合并工具" />} />
          <Route path="/tools/pdf-split" element={<PlaceholderTool title="PDF拆分工具" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
