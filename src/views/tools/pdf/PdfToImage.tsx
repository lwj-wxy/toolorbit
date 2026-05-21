import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2,
  FileArchive,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import ToolSEOCard from '../../../components/ToolSEOCard';

interface PageImage {
  pageNumber: number;
  dataUrl: string;
}

const PDFJS_WORKER_SRC = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

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
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
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
          canvas: canvas
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

    const [{ default: JSZip }, { saveAs }] = await Promise.all([
      import('jszip'),
      import('file-saver'),
    ]);
    const zip = new JSZip();
    const folder = zip.folder("pdf_images");
    
    images.forEach((img) => {
      const base64Data = img.dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
      folder?.file(`page_${img.pageNumber}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${file.name.replace('.pdf', '')}_images.zip`);
  };

  const downloadImage = async (dataUrl: string, fileName: string) => {
    const { saveAs } = await import('file-saver');
    saveAs(dataUrl, fileName);
  };

  const clearAll = () => {
    setFile(null);
    setImages([]);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.pdf-to-image.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.pdf-to-image.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {file ? file.name : t('tools.pdf-to-image.dropLabel')}
          </label>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            {!file ? (
              <button
                type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) handleFile(droppedFile);
              }}
              onClick={() => document.getElementById('pdf-upload')?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
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
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.pdf-to-image.dropLabel')}</span>
                <span className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{t('tools.pdf-to-image.dropDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                {t('tools.pdf-to-image.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950 dark:text-white">{file.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · {t('tools.pdf-to-image.progressMsg', { current: progress.current, total: progress.total })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearAll}
                    className="rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">{t('tools.pdf-to-image.clearBtn')}</span>
                  </button>
                </div>

                {isProcessing ? (
                  <div className="mt-auto space-y-4 pb-8 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-600 dark:border-cyan-950 dark:border-t-cyan-300" />
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{t('tools.pdf-to-image.processingTitle')}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t('tools.pdf-to-image.progressMsg', { current: progress.current, total: progress.total })}</p>
                    <div className="mx-auto h-2 max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
                        className="h-full bg-cyan-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto rounded-lg border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300">
                    {t('tools.pdf-to-image.progressMsg', { current: progress.current, total: progress.total })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.pdf-to-image.downloadZipBtn')}
            </label>
            <button
              onClick={downloadAllAsZip}
              disabled={images.length === 0}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FileArchive className="h-4 w-4" />
              {t('tools.pdf-to-image.downloadZipBtn')}
            </button>
          </div>
          <div className="h-[500px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {images.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ImageIcon className="mb-4 h-10 w-10 text-slate-400" />
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{t('tools.pdf-to-image.dropDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div
                    key={img.pageNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-colors hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:hover:border-cyan-700"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <img 
                        src={img.dataUrl} 
                        alt={`Page ${img.pageNumber}`} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => downloadImage(img.dataUrl, `page_${img.pageNumber}.jpg`)}
                          className="rounded-full bg-white p-3 text-slate-900 transition-transform hover:scale-105"
                        >
                          <Download className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 p-3 dark:border-slate-800">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('tools.pdf-to-image.pageLabel', { count: img.pageNumber })}</span>
                      <button
                        onClick={() => downloadImage(img.dataUrl, `page_${img.pageNumber}.jpg`)}
                        className="text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300"
                      >
                        {t('tools.pdf-to-image.downloadSingleBtn')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="pdf-to-image" />
    </div>
  );
}
