import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Layers,
  Info,
  CheckCircle2,
  FilePlus,
  ShieldCheck,
  Zap,
  MousePointer2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';

interface PdfMetadata {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
}

export default function PdfMerge() {
  const { t } = useTranslation();
  const [pdfs, setPdfs] = useState<PdfMetadata[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const newPdfs: PdfMetadata[] = [];
    
    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        alert(t('pdf-merge.errors.onlyPdf'));
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        newPdfs.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          pages: pdfDoc.getPageCount(),
        });
      } catch (err) {
        console.error(err);
        alert(t('pdf-merge.errors.parseError', { name: file.name }));
      }
    }

    setPdfs(prev => [...prev, ...newPdfs]);
    setIsSuccess(false);
  }, [t]);

  const removePdf = (id: string) => {
    setPdfs(pdfs.filter(p => p.id !== id));
    setIsSuccess(false);
  };

  const movePdf = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pdfs.length - 1) return;

    const newPdfs = [...pdfs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPdfs[index], newPdfs[targetIndex]] = [newPdfs[targetIndex], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) return;

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfMetadata of pdfs) {
        const pdfBytes = await pdfMetadata.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, `merged_${new Date().getTime()}.pdf`);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert(t('pdf-merge.errors.mergeError'));
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = pdfs.reduce((sum, pdf) => sum + pdf.pages, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Layers className="w-10 h-10 text-blue-600" />
          {t('pdf-merge.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('pdf-merge.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group"
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            <input
              id="pdf-upload"
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files!)}
            />
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('pdf-merge.dropLabel')}</h3>
            <p className="text-gray-500 mb-6">{t('pdf-merge.dropDesc')}</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {t('pdf-merge.selectBtn')}
            </button>
          </div>

          {/* File List */}
          {pdfs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  {t('pdf-merge.listTitle', { count: pdfs.length })}
                </h3>
                <button 
                  onClick={() => setPdfs([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {t('pdf-merge.clearAll')}
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {pdfs.map((pdf, index) => (
                    <motion.div
                      key={pdf.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 flex items-center gap-4 group hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => movePdf(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-0"
                        >
                          <ArrowUp className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => movePdf(index, 'down')}
                          disabled={index === pdfs.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-0"
                        >
                          <ArrowDown className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{pdf.name}</p>
                        <p className="text-sm text-gray-500">
                          {pdf.pages} {t('pdf-merge.totalPages')} · {(pdf.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        onClick={() => removePdf(pdf.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                onClick={() => document.getElementById('pdf-upload')?.click()}
                className="w-full p-4 text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 transition-colors border-t border-gray-100"
              >
                <FilePlus className="w-5 h-5" />
                {t('pdf-merge.addMore')}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              {t('pdf-merge.settingsTitle')}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">{t('pdf-merge.totalFiles')}</span>
                <span className="font-semibold text-gray-900">{pdfs.length}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">{t('pdf-merge.totalPages')}</span>
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 mb-8 border border-amber-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  {t('pdf-merge.dragTip')}
                </p>
              </div>
            </div>

            {isSuccess && !isMerging && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3 border border-green-100 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">{t('pdf-merge.successMsg')}</span>
              </div>
            )}

            <button
              onClick={mergePdfs}
              disabled={pdfs.length < 2 || isMerging}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex flex-col items-center justify-center gap-1 ${
                pdfs.length < 2 || isMerging
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'
              }`}
            >
              {isMerging ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('pdf-merge.processingMsg')}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t('pdf-merge.downloadBtn')}
                  </div>
                  <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">
                    {t('pdf-merge.downloadDesc')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pdf-merge.seoTitle')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('pdf-merge.seoDesc')}</p>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <p className="text-sm text-blue-900">
                      <strong>{t('pdf-merge.privacyNotice')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">{t('pdf-merge.whyTitle')}</h3>
              
              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('pdf-merge.highlight1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('pdf-merge.highlight1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('pdf-merge.highlight2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('pdf-merge.highlight2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('pdf-merge.highlight3Title')}</h4>
                  <p className="text-sm text-gray-600">{t('pdf-merge.highlight3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <p className="text-gray-500 italic">
              {t('pdf-merge.seoFooter')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
