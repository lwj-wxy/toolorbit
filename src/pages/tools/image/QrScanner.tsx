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
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.qr-scanner.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.qr-scanner.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col min-h-[400px]">
           <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-[#2563eb] rounded-sm block"></span>
              {t('tools.qr-scanner.inputTitle')}
           </h3>

           {!previewImage ? (
               <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
                      isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
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
                  <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4 text-[#94a3b8]">
                      <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-[#1e293b] font-medium text-lg mb-2">{t('tools.qr-scanner.dropLabel')}</p>
                  <p className="text-[#64748b] text-sm text-center mb-6">
                      {t('tools.qr-scanner.dropDesc')}
                  </p>
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                      {t('tools.qr-scanner.selectBtn')}
                  </button>
               </div>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl relative">
                  <button 
                     onClick={resetAll}
                     className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors"
                     title={t('tools.qr-scanner.reuploadTooltip')}
                  >
                     <RefreshCcw className="w-5 h-5" />
                  </button>
                  <img src={previewImage} alt="Preview" className="max-w-full max-h-[250px] object-contain rounded-lg shadow-sm mb-4" />
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                     <FileImage className="w-4 h-4" />
                     {t('tools.qr-scanner.loadedMsg')}
                  </p>
               </div>
           )}
        </div>

        {/* Right Side: Result Output */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col min-h-[400px]">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
               <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                  <span className="w-2 h-5 bg-purple-500 rounded-sm block"></span>
                  {t('tools.qr-scanner.resultTitle')}
               </h3>
               {result && (
                  <button
                   onClick={copyToClipboard}
                   className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? t('tools.qr-scanner.copiedBtn') : t('tools.qr-scanner.copyBtn')}
                  </button>
               )}
           </div>

           <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 md:p-6 overflow-auto">
              {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-red-500">
                     <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
                     <p className="font-medium max-w-[250px]">{error}</p>
                  </div>
              ) : result ? (
                  <div className="text-[#0f172a] whitespace-pre-wrap break-all sm:text-lg font-mono">
                     {result}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#94a3b8]">
                     <ScanLine className="w-12 h-12 mb-3 opacity-20" />
                     <p className="text-sm">{t('tools.qr-scanner.waitingMsg')}</p>
                  </div>
              )}
           </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.qr-scanner.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.qr-scanner.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.qr-scanner.seoHighlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.qr-scanner.highlight1Title')}</strong>
            <span>{t('tools.qr-scanner.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.qr-scanner.highlight2Title')}</strong>
            <span>{t('tools.qr-scanner.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.qr-scanner.highlight3Title')}</strong>
            <span>{t('tools.qr-scanner.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.qr-scanner.seoFooter')}
        </p>
      </div>

    </div>
  );
}
