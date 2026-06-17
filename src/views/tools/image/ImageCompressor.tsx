import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Trash2, CheckCircle2, Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

export default function ImageCompressor() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [quality, setQuality] = useState<number>(0.8);
  const [format, setFormat] = useState<string>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

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
      loadOriginalFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        loadOriginalFile(droppedFile);
      }
    }
  };

  const loadOriginalFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setCompressedUrl('');
    setCompressedBlob(null);
  };

  const compressImage = () => {
    if (!previewUrl || !file) return;
    setIsCompressing(true);

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Compress Image',
      label: file.type,
      metadata: { quality, targetFormat: format }
    });

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsCompressing(false);
        return;
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedUrl(URL.createObjectURL(blob));
          }
          setIsCompressing(false);
        },
        format,
        quality
      );
    };
  };

  const downloadImage = () => {
    if (!compressedUrl || !file) return;

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Download Compressed Image',
      label: format
    });

    const a = document.createElement('a');
    a.href = compressedUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : (format === 'image/webp' ? 'webp' : 'png');
    
    const nameParts = file.name.split('.');
    nameParts.pop();
    a.download = `${nameParts.join('.')}-compressed.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setCompressedUrl('');
    setCompressedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.image-compressor.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-compressor.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {file ? t('tools.image-compressor.previewTitle') : t('tools.image-compressor.dropLabel')}
            </label>
            {file ? (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.image-compressor.reuploadBtn')}
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
                  <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-compressor.dropLabel')}</span>
                  <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.image-compressor.dropDesc')}</span>
                  <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                    {t('tools.image-compressor.selectBtn')}
                  </span>
                </button>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{file.name}</span>
                    <span className="ml-4 shrink-0 text-slate-500 dark:text-slate-400">{formatSize(file.size)}</span>
                  </div>
                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-2">
                    <div className="flex min-h-0 flex-col border-b border-slate-200 dark:border-slate-700 md:border-b-0 md:border-r">
                      <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>{t('tools.image-compressor.originalLabel')}</span>
                        <span>{formatSize(file.size)}</span>
                      </div>
                      <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
                        <img src={previewUrl} className="max-h-full max-w-full object-contain" alt="Original" />
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-col">
                      <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>{t('tools.image-compressor.compressedLabel')}</span>
                        <span>{compressedBlob ? formatSize(compressedBlob.size) : '--'}</span>
                      </div>
                      <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
                        {isCompressing ? (
                          <div className="flex flex-col items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <div className="h-8 w-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                            {t('tools.image-compressor.compressingMsg')}
                          </div>
                        ) : compressedUrl ? (
                          <img src={compressedUrl} className="max-h-full max-w-full object-contain" alt="Compressed" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.image-compressor.settingsTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.image-compressor.qualityLabel')}</label>
                  <span className="rounded-md bg-cyan-50 px-2 py-1 font-mono text-sm font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-cyan-600 dark:bg-slate-700"
                />
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>{t('tools.image-compressor.qualityLow')}</span>
                  <span>{t('tools.image-compressor.qualityHigh')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.image-compressor.formatLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['image/jpeg', 'image/png', 'image/webp'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                        format === f
                          ? 'border-cyan-600 bg-cyan-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'
                      }`}
                    >
                      {f === 'image/jpeg' ? 'JPG' : f.split('/')[1].toUpperCase()}
                    </button>
                  ))}
                </div>
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {t('tools.image-compressor.formatTip')}
                </p>
              </div>

              {compressedBlob ? (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/70 dark:bg-green-950/20 dark:text-green-300">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('tools.image-compressor.savedLabel')}
                  </span>
                  <span>{Math.round(((file!.size - compressedBlob.size) / file!.size) * 100)}%</span>
                </div>
              ) : null}
            </div>

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={compressImage}
                disabled={!file || isCompressing}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <Sliders className="h-4 w-4" />
                {isCompressing ? t('tools.image-compressor.compressingMsg') : t('tools.image-compressor.name')}
              </button>
              {compressedUrl && !isCompressing ? (
                <button
                  type="button"
                  onClick={downloadImage}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  {t('tools.image-compressor.downloadBtn')}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
