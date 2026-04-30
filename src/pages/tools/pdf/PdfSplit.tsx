import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Scissors, 
  Download, 
  CheckCircle2,
  AlertCircle,
  FileArchive,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  MonitorSmartphone,
  RefreshCw
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';

interface PdfMetadata {
  file: File;
  name: string;
  size: number;
  pages: number;
}

export default function PdfSplit() {
  const { t } = useTranslation();
  const [pdf, setPdf] = useState<PdfMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert(t('tools.pdf-split.errors.onlyPdf'));
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      setPdf({
        file,
        name: file.name,
        size: file.size,
        pages: pdfDoc.getPageCount(),
      });
      setIsSuccess(false);
    } catch (err) {
      console.error(err);
      alert(t('tools.pdf-split.errors.parseError'));
    }
  }, [t]);

  const splitPdf = async () => {
    if (!pdf) return;

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      const arrayBuffer = await pdf.file.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer);
      
      for (let i = 0; i < pdf.pages; i++) {
        const newDoc = await PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(originalDoc, [i]);
        newDoc.addPage(copiedPage);
        const pdfBytes = await newDoc.save();
        zip.file(`${pdf.name.replace('.pdf', '')}_p${i + 1}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${pdf.name.replace('.pdf', '')}_split.zip`);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert(t('tools.pdf-split.errors.splitError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdf(null);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Scissors className="w-10 h-10 text-orange-600" />
          {t('tools.pdf-split.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('tools.pdf-split.subtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!pdf ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer group"
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.pdf-split.dropLabel')}</h3>
            <p className="text-gray-500 mb-8">{t('tools.pdf-split.readyDesc')}</p>
            <button className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
              {t('tools.pdf-split.selectBtn')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <FileText className="w-24 h-24" />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('tools.pdf-split.fileCardTitle')}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-xl">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-lg truncate">{pdf.name}</p>
                    <p className="text-gray-500">
                      {t('tools.pdf-split.pageCount', { count: pdf.pages })} · {(pdf.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex gap-3">
                    <Box className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">{t('tools.pdf-split.extractFeatureTitle')}</h4>
                      <p className="text-xs text-blue-800 leading-relaxed mt-1">
                        {t('tools.pdf-split.extractFeatureDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  {t('tools.pdf-split.readyTitle')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {t('tools.pdf-split.readyDesc')}
                </p>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-tight">Verified Local Processing</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.pdf-split.successMsg')}</h3>
                      <p className="text-gray-600">{t('tools.pdf-split.successTip')}</p>
                    </div>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 text-orange-600 font-bold mx-auto hover:gap-3 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      {t('tools.pdf-split.processNext')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="action"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <button
                      onClick={splitPdf}
                      disabled={isProcessing}
                      className={`w-full py-6 rounded-2xl font-bold text-white shadow-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        isProcessing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t('tools.pdf-split.processingMsg')}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-xl">
                            <Download className="w-6 h-6" />
                            {t('tools.pdf-split.downloadBtn')}
                          </div>
                          <span className="text-xs opacity-80 font-normal uppercase tracking-widest flex items-center gap-1">
                            <FileArchive className="w-3 h-3" />
                            {t('tools.pdf-split.downloadDesc')}
                          </span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={reset}
                      className="w-full py-4 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                      {t('tools.pdf-split.clearAll')}
                    </button>
                  </motion.div>
                )}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tools.pdf-split.seoTitle')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('tools.pdf-split.seoDesc')}</p>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
                    <p className="text-sm text-orange-900">
                      <strong>{t('tools.pdf-split.privacyNotice')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">{t('tools.pdf-split.highlightsTitle')}</h3>
              
              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-split.highlight1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-split.highlight1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <FileArchive className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-split.highlight2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-split.highlight2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.pdf-split.highlight3Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.pdf-split.highlight3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <p className="text-gray-500 italic">
              {t('tools.pdf-split.seoFooter')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
