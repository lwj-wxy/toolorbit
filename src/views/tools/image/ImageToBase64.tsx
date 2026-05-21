import React, { useState, useRef } from 'react';
import { Upload, Copy, Trash2, CheckCircle2, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Link } from '../../../lib/navigation';
import { useTranslation } from 'react-i18next';

export default function ImageToBase64() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [base64String, setBase64String] = useState<string>('');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedDataUrl, setCopiedDataUrl] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        processFile(droppedFile);
      }
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setBase64String(event.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setBase64String('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const pureBase64 = base64String.split(',')[1] || '';

  const copyToClipboard = async (text: string, type: 'raw' | 'dataurl') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'raw') {
        setCopiedRaw(true);
        setTimeout(() => setCopiedRaw(false), 2000);
      } else {
        setCopiedDataUrl(true);
        setTimeout(() => setCopiedDataUrl(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.image-to-base64.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-to-base64.subtitle')}
          </p>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {file ? t('tools.image-to-base64.sourceImage') : t('tools.image-to-base64.dropLabel')}
            </label>
            {file ? (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.image-to-base64.clearBtn')}
              </button>
            ) : null}
          </div>

          <div
            className={`h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34] ${
              isDragging ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20' : ''
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-to-base64.dropLabel')}</span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.image-to-base64.dropDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                  {t('tools.image-to-base64.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{file.name}</span>
                  <span className="ml-4 shrink-0 text-slate-500 dark:text-slate-400">{formatSize(file.size)}</span>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">{t('tools.image-to-base64.fileFormat')}</span>
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{file.type}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.image-to-base64.detailsTitle')}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(base64String, 'dataurl')}
                disabled={!base64String}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copiedDataUrl ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedDataUrl ? t('tools.image-to-base64.copiedDataUrl') : t('tools.image-to-base64.copyDataUrl')}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(pureBase64, 'raw')}
                disabled={!pureBase64}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copiedRaw ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedRaw ? t('tools.image-to-base64.copiedRaw') : t('tools.image-to-base64.copyRaw')}
              </button>
            </div>
          </div>

          <div className="flex h-[500px] flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {file && file.size > 2 * 1024 * 1024 ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/20 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t('tools.image-to-base64.sizeWarning', { size: formatSize(file.size) })}
              </div>
            ) : null}

            <div className="min-h-0 flex-1">
              <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('tools.image-to-base64.dataUrlTitle')}
              </label>
              <textarea
                readOnly
                value={base64String}
                className="block h-[190px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-xs leading-5 text-slate-900 shadow-sm outline-none dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              />
            </div>

            <div className="min-h-0 flex-1">
              <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('tools.image-to-base64.rawBase64Title')}
              </label>
              <textarea
                readOnly
                value={pureBase64}
                className="block h-[190px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-xs leading-5 text-slate-900 shadow-sm outline-none dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Related Link matching user screenshot */}
      <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-100 bg-amber-50 p-4 text-center dark:border-amber-900/70 dark:bg-amber-950/20">
        <span className="text-sm text-amber-800 dark:text-amber-300">{t('tools.image-to-base64.relatedRecommend')}</span>
        <Link to="/tools/dev/base64" className="flex items-center gap-1 text-sm font-semibold text-amber-700 underline hover:text-amber-800 dark:text-amber-300">
          {t('tools.image-to-base64.relatedLink')} <ArrowRightLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
