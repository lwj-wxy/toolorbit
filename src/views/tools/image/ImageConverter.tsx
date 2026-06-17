import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

export default function ImageConverter() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [hasConverted, setHasConverted] = useState<boolean>(false);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);

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
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setHasConverted(false);
    setConvertedUrl('');
    setConvertedBlob(null);
    
    // Auto switch target format depending on input to suggest something else
    if (selectedFile.type === 'image/jpeg') {
      setTargetFormat('image/png');
    } else {
      setTargetFormat('image/jpeg');
    }

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Upload for Convert',
      label: selectedFile.type
    });
  };

  const convertImage = () => {
    if (!originalUrl || !file) return;
    setIsConverting(true);

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Convert Image Start',
      label: `${file.type} to ${targetFormat}`
    });

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsConverting(false);
        return;
      }
      
      // Fill white background for JPEGs to prevent black backgrounds on transparent PNGs/WebPs
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedBlob(blob);
            setConvertedUrl(URL.createObjectURL(blob));
            setHasConverted(true);

            analytics.trackEvent({
              category: 'Image Tools',
              action: 'Convert Image Success',
              label: targetFormat,
              metadata: { originalSize: file.size, newSize: blob.size }
            });
          }
          setIsConverting(false);
        },
        targetFormat,
        0.92 // High quality default
      );
    };
    img.src = originalUrl;
  };

  const clearFile = () => {
    setFile(null);
    setOriginalUrl('');
    setConvertedUrl('');
    setConvertedBlob(null);
    setHasConverted(false);
    setIsConverting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadImage = () => {
    if (!convertedUrl || !file) return;

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Download Converted Image',
      label: targetFormat
    });

    const a = document.createElement('a');
    a.href = convertedUrl;
    
    const nameParts = file.name.split('.');
    nameParts.pop(); // Remove original extension
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : (targetFormat === 'image/webp' ? 'webp' : 'png');
    a.download = `${nameParts.join('.')}-converted.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.image-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-converter.subtitle')}
          </p>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {file ? t('tools.image-converter.uploadedTitle', { name: file.name }) : t('tools.image-converter.dropLabel')}
            </label>
            {file ? (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.image-converter.clearBtn')}
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
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-converter.dropLabel')}</span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.image-converter.dropDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                  {t('tools.image-converter.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{file.name}</span>
                  <span className="ml-4 shrink-0 text-slate-500 dark:text-slate-400">
                    {hasConverted && convertedBlob ? formatSize(convertedBlob.size) : formatSize(file.size)}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
                  <img
                    src={hasConverted ? convertedUrl : originalUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.image-converter.targetFormat')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-6">
              <select
                value={targetFormat}
                onChange={(e) => {
                  setTargetFormat(e.target.value);
                  if (hasConverted) setHasConverted(false);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/webp">WEBP (.webp)</option>
              </select>

              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-[#282c34]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">{t('tools.image-converter.fileSize')}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {file ? (hasConverted && convertedBlob ? formatSize(convertedBlob.size) : formatSize(file.size)) : '--'}
                  </span>
                </div>
              </div>

              {hasConverted ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/70 dark:bg-green-950/20 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('tools.image-converter.successMsg')}
                </div>
              ) : null}
            </div>

            <div className="mt-auto">
              {!hasConverted ? (
                <button
                  type="button"
                  onClick={convertImage}
                  disabled={!file || isConverting}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  {isConverting ? <RefreshCcw className="h-4 w-4 animate-spin" /> : null}
                  {isConverting ? t('tools.image-converter.converting') : t('tools.image-converter.convertBtn')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={downloadImage}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
                >
                  <Download className="h-4 w-4" />
                  {t('tools.image-converter.downloadBtn')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
