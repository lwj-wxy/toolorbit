import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Scissors, 
  Download, 
  CheckCircle2,
  FileArchive,
  ShieldCheck,
  Zap,
  Box,
  RefreshCw
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import('jszip'),
        import('file-saver'),
      ]);
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.pdf-split.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.pdf-split.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {pdf ? t('tools.pdf-split.fileCardTitle') : t('tools.pdf-split.dropLabel')}
          </label>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
        {!pdf ? (
              <button
                type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
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
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.pdf-split.dropLabel')}</span>
                <span className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{t('tools.pdf-split.readyDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                {t('tools.pdf-split.selectBtn')}
                </span>
              </button>
        ) : (
              <div className="h-full overflow-y-auto p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.pdf-split.fileCardTitle')}</h3>
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold text-slate-950 dark:text-white">{pdf.name}</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t('tools.pdf-split.pageCount', { count: pdf.pages })} · {(pdf.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-900/50 dark:bg-cyan-950/20">
                  <div className="flex gap-3">
                    <Box className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700 dark:text-cyan-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">{t('tools.pdf-split.extractFeatureTitle')}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-cyan-800 dark:text-cyan-200">
                        {t('tools.pdf-split.extractFeatureDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="mt-6 font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300"
                >
                  {t('tools.pdf-split.clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.pdf-split.readyTitle')}
          </label>
          <div className="flex h-[500px] flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {!pdf ? (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
                  <Scissors className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                  {t('tools.pdf-split.readyTitle')}
                </h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t('tools.pdf-split.readyDesc')}
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 p-3 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Verified Local Processing</span>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-300">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-slate-950 dark:text-white">{t('tools.pdf-split.successMsg')}</h3>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.pdf-split.successTip')}</p>
                    </div>
                    <button
                      onClick={reset}
                      className="mx-auto flex items-center gap-2 font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300"
                    >
                      <RefreshCw className="h-5 w-5" />
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
                      className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg py-5 font-semibold text-white transition-colors ${
                        isProcessing
                          ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-700'
                          : 'bg-cyan-600 hover:bg-cyan-700'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>{t('tools.pdf-split.processingMsg')}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-lg">
                            <Download className="h-5 w-5" />
                            {t('tools.pdf-split.downloadBtn')}
                          </div>
                          <span className="text-xs opacity-80 font-normal uppercase tracking-widest flex items-center gap-1">
                            <FileArchive className="h-3 w-3" />
                            {t('tools.pdf-split.downloadDesc')}
                          </span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="pdf-split" />
    </div>
  );
}
