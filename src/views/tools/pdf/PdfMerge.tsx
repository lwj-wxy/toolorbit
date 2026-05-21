import { useState, useCallback } from 'react';
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
  FilePlus
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
        alert(t('tools.pdf-merge.errors.onlyPdf'));
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
        alert(t('tools.pdf-merge.errors.parseError', { name: file.name }));
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
      const { saveAs } = await import('file-saver');
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
      alert(t('tools.pdf-merge.errors.mergeError'));
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = pdfs.reduce((sum, pdf) => sum + pdf.pages, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.pdf-merge.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.pdf-merge.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.pdf-merge.listTitle', { count: pdfs.length })}
            </label>
            {pdfs.length > 0 ? (
              <button
                onClick={() => setPdfs([])}
                className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                {t('tools.pdf-merge.clearAll')}
              </button>
            ) : null}
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <input
              id="pdf-upload"
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files!)}
            />
            {pdfs.length === 0 ? (
              <button
                type="button"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById('pdf-upload')?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                  <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.pdf-merge.dropLabel')}</span>
                <span className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{t('tools.pdf-merge.dropDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                  {t('tools.pdf-merge.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                  <AnimatePresence initial={false}>
                    {pdfs.map((pdf, index) => (
                      <motion.div
                        key={pdf.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => movePdf(index, 'up')}
                            disabled={index === 0}
                            className="rounded p-1 transition-colors hover:bg-slate-200 disabled:opacity-0 dark:hover:bg-slate-800"
                          >
                            <ArrowUp className="h-4 w-4 text-slate-500" />
                          </button>
                          <button
                            onClick={() => movePdf(index, 'down')}
                            disabled={index === pdfs.length - 1}
                            className="rounded p-1 transition-colors hover:bg-slate-200 disabled:opacity-0 dark:hover:bg-slate-800"
                          >
                            <ArrowDown className="h-4 w-4 text-slate-500" />
                          </button>
                        </div>

                        <div className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                          <FileText className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-950 dark:text-white">{pdf.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {pdf.pages} {t('tools.pdf-merge.totalPages')} · {(pdf.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          onClick={() => removePdf(pdf.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  className="flex w-full items-center justify-center gap-2 border-t border-slate-100 p-4 font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 dark:border-slate-800 dark:text-cyan-300 dark:hover:bg-cyan-950/20"
                >
                  <FilePlus className="h-5 w-5" />
                  {t('tools.pdf-merge.addMore')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.pdf-merge.settingsTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Layers className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
              {t('tools.pdf-merge.settingsTitle')}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-slate-200 py-3 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">{t('tools.pdf-merge.totalFiles')}</span>
                <span className="font-semibold text-slate-950 dark:text-white">{pdfs.length}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-3 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">{t('tools.pdf-merge.totalPages')}</span>
                <span className="font-semibold text-slate-950 dark:text-white">{totalPages}</span>
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-100">
                  {t('tools.pdf-merge.dragTip')}
                </p>
              </div>
            </div>

            {isSuccess && !isMerging && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 p-4 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">{t('tools.pdf-merge.successMsg')}</span>
              </div>
            )}

            <button
              onClick={mergePdfs}
              disabled={pdfs.length < 2 || isMerging}
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-lg py-4 font-semibold text-white transition-colors ${
                pdfs.length < 2 || isMerging
                  ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-700'
                  : 'bg-cyan-600 hover:bg-cyan-700'
              }`}
            >
              {isMerging ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t('tools.pdf-merge.processingMsg')}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t('tools.pdf-merge.downloadBtn')}
                  </div>
                  <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">
                    {t('tools.pdf-merge.downloadDesc')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="pdf-merge" />
    </div>
  );
}
