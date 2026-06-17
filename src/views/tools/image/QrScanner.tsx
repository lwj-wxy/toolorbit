import React, { useState, useRef } from 'react';
import { ScanLine, UploadCloud, Copy, RefreshCcw, Check, AlertCircle, FileImage } from 'lucide-react';
import jsQR from 'jsqr';
import { useTranslation } from 'react-i18next';

export default function QrScanner() {
  const { t } = useTranslation();
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError(t('tools.qr-scanner.errors.invalidFile'));
      setResult('');
      return;
    }

    // Reset state
    setError('');
    setResult('');
    setPreviewImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setError(t('tools.qr-scanner.errors.canvasError'));
          return;
        }

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              setResult(code.data);
            } else {
              setError(t('tools.qr-scanner.errors.noCodeFound'));
            }
        } catch (e) {
            setError(t('tools.qr-scanner.errors.unknownError'));
        }
      };
      img.onerror = () => {
         setError(t('tools.qr-scanner.errors.loadError'));
      };
      // Load image data
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetAll = () => {
    setResult('');
    setError('');
    setPreviewImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.qr-scanner.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.qr-scanner.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Left Side: Upload Area */}
        <div className="flex flex-col space-y-3">
           <h3 className="block text-sm font-semibold leading-6 text-slate-900">
              {t('tools.qr-scanner.inputTitle')}
           </h3>

        <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
           {!previewImage ? (
               <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                      isDragging ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
               >
                  <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                          if (e.target.files?.[0]) {
                              handleFile(e.target.files[0]);
                          }
                      }}
                  />
                  <UploadCloud className="mb-4 h-10 w-10 text-slate-400" />
                  <p className="mb-2 text-lg font-semibold text-slate-900">{t('tools.qr-scanner.dropLabel')}</p>
                  <p className="mb-6 text-center text-sm text-slate-500">
                      {t('tools.qr-scanner.dropDesc')}
                  </p>
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-cyan-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-cyan-700"
                  >
                      {t('tools.qr-scanner.selectBtn')}
                  </button>
               </div>
           ) : (
               <div className="relative flex flex-1 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <button 
                     onClick={resetAll}
                     className="absolute right-4 top-4 rounded-md border border-slate-300 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:text-cyan-700"
                     title={t('tools.qr-scanner.reuploadTooltip')}
                  >
                     <RefreshCcw className="w-5 h-5" />
                  </button>
                  <img src={previewImage} alt="Preview" className="max-w-full max-h-[250px] object-contain rounded-lg shadow-sm mb-4" />
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                     <FileImage className="w-4 h-4" />
                     {t('tools.qr-scanner.loadedMsg')}
                  </p>
               </div>
           )}
        </div>
        </div>

        {/* Right Side: Result Output */}
        <div className="flex flex-col space-y-3">
           <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
               <h3 className="block text-sm font-semibold leading-6 text-slate-900">
                  {t('tools.qr-scanner.resultTitle')}
               </h3>
               {result && (
                  <button
                   onClick={copyToClipboard}
                   className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? t('tools.qr-scanner.copiedBtn') : t('tools.qr-scanner.copyBtn')}
                  </button>
               )}
           </div>

           <div className="h-[500px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-6">
              {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-red-500">
                     <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
                     <p className="font-medium max-w-[250px]">{error}</p>
                  </div>
              ) : result ? (
                  <div className="whitespace-pre-wrap break-all font-mono text-slate-950 sm:text-lg">
                     {result}
                  </div>
              ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                     <ScanLine className="w-12 h-12 mb-3 opacity-20" />
                     <p className="text-sm">{t('tools.qr-scanner.waitingMsg')}</p>
                  </div>
              )}
           </div>
        </div>

      </div>

    </div>
  );
}
