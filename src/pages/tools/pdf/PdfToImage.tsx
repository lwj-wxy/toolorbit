import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2,
  FileArchive,
  ShieldCheck,
  Zap,
  MousePointer2,
  Layers,
  ChevronRight
} from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';

// Initialize PDF.js worker
const PDFJS_VERSION = '5.6.205';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

interface PageImage {
  pageNumber: number;
  dataUrl: string;
}

export default function PdfToImage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert(t('tools.pdf-to-image.errors.invalidPdf'));
      return;
    }

    setFile(file);
    setImages([]);
    setIsProcessing(true);
    setProgress({ current: 0, total: 0 });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ 
        data: arrayBuffer,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
      }).promise;
      const totalPages = pdf.numPages;
      setProgress({ current: 0, total: totalPages });

      const loadedImages: PageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); 
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        loadedImages.push({ pageNumber: i, dataUrl });
        setProgress(prev => ({ ...prev, current: i }));
        setImages(prev => [...prev, { pageNumber: i, dataUrl }]);
      }
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      alert(`${t('tools.pdf-to-image.errors.parseError')} (${err.message || 'Unknown error'})`);
    } finally {
      setIsProcessing(false);
    }
  }, [t]);

  const downloadAllAsZip = async () => {
    if (images.length === 0 || !file) return;

    const zip = new JSZip();
    const folder = zip.folder("pdf_images");
    
    images.forEach((img) => {
      const base64Data = img.dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
      folder?.file(`page_${img.pageNumber}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${file.name.replace('.pdf', '')}_images.zip`);
  };

  const clearAll = () => {
    setFile(null);
    setImages([]);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <ImageIcon className="w-10 h-10 text-emerald-600" />
          {t('tools.pdf-to-image.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('tools.pdf-to-image.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFile(droppedFile);
            }}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFile(selectedFile);
              }}
            />
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.pdf-to-image.dropLabel')}</h3>
            <p className="text-gray-500 mb-8">{t('tools.pdf-to-image.dropDesc')}</p>
            <button className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              {t('tools.pdf-to-image.selectBtn')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-xl">
                  <FileText className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {t('tools.pdf-to-image.progressMsg', { current: progress.current, total: progress.total })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={downloadAllAsZip}
                  disabled={images.length === 0}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FileArchive className="w-4 h-4" />
                  {t('tools.pdf-to-image.downloadZipBtn')}
                </button>
                <button
                  onClick={clearAll}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="sr-only">{t('tools.pdf-to-image.clearBtn')}</span>
                </button>
              </div>
            </div>

            {isProcessing && (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">{t('tools.pdf-to-image.processingTitle')}</h3>
                <p className="text-gray-500">{t('tools.pdf-to-image.progressMsg', { current: progress.current, total: progress.total })}</p>
                <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div
                    key={img.pageNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                      <img 
                        src={img.dataUrl} 
                        alt={`Page ${img.pageNumber}`} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => saveAs(img.dataUrl, `page_${img.pageNumber}.jpg`)}
                          className="bg-white text-gray-900 p-3 rounded-full hover:scale-110 transition-transform"
                        >
                          <Download className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600">{t('tools.pdf-to-image.pageLabel', { count: img.pageNumber })}</span>
                      <button
                        onClick={() => saveAs(img.dataUrl, `page_${img.pageNumber}.jpg`)}
                        className="text-emerald-600 text-sm font-bold hover:underline"
                      >
                        {t('tools.pdf-to-image.downloadSingleBtn')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tools.pdf-to-image.seoTitle')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('tools.pdf-to-image.seoDesc')}</p>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                    <p className="text-sm text-emerald-900">
                      <strong>{t('tools.pdf-to-image.privacyNotice')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">{t('tools.pdf-to-image.highlightsTitle')}</h3>
              
              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-to-image.highlight1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-to-image.highlight1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-to-image.highlight2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-to-image.highlight2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <FileArchive className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-to-image.highlight3Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-to-image.highlight3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <p className="text-gray-500 italic">
              {t('tools.pdf-to-image.seoFooter')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
