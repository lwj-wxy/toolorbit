import React, { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Download, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../lib/utils';

export default function ImageToIco() {
  const { t } = useTranslation();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSize, setTargetSize] = useState<number>(32);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SIZES = [16, 24, 32, 48, 64, 128, 256];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const url = URL.createObjectURL(file);
       setFileUrl(url);
       setFileName(file.name);
    }
  };

  /**
   * Crafts an authentic cross-platform valid *.ico binary blob 
   * wrapping resizing PNG inside true MS Windows ICON structure blocks.
   */
  const convertToIco = async () => {
    if (!fileUrl) return;
    setIsProcessing(true);
    
    try {
        const image = new Image();
        image.src = fileUrl;
        await new Promise((resolve) => {
            image.onload = resolve;
            image.onerror = resolve; 
        });

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if(!ctx) throw new Error("Canvas context init failed");

        // Maintain original aspect ratio nicely in square
        const scale = Math.min(targetSize / image.width, targetSize / image.height);
        const nw = image.width * scale;
        const nh = image.height * scale;
        const nx = (targetSize - nw) / 2;
        const ny = (targetSize - nh) / 2;
        
        ctx.clearRect(0,0,targetSize,targetSize);
        ctx.drawImage(image, nx, ny, nw, nh);

        // Turn payload into encoded PNG base64 string
        const base64PngUrl = canvas.toDataURL('image/png');
        const pureData = atob(base64PngUrl.split(',')[1]);
        
        // Uint8 buffers
        const pngBytes = new Uint8Array(pureData.length);
        for (let i = 0; i < pureData.length; i++) {
            pngBytes[i] = pureData.charCodeAt(i);
        }
        
        // Build ICO specific bytes frame
        // MS Icon Header is 6 bytes. Dirent size 16. Total 22 offset.
        const buffer = new ArrayBuffer(22 + pngBytes.length);
        const view = new DataView(buffer);
        
        // Header
        view.setUint16(0, 0, true); 
        view.setUint16(2, 1, true); 
        view.setUint16(4, 1, true); // One sub-image

        // Map Dir array parameters
        view.setUint8(6, targetSize >= 256 ? 0 : targetSize);
        view.setUint8(7, targetSize >= 256 ? 0 : targetSize); 
        view.setUint8(8, 0);          
        view.setUint8(9, 0);          
        view.setUint16(10, 1, true);  
        view.setUint16(12, 32, true); 
        view.setUint32(14, pngBytes.length, true); 
        view.setUint32(18, 22, true); 
        
        // Final stitch and build blob
        const finalBytes = new Uint8Array(buffer);
        finalBytes.set(pngBytes, 22);
        
        const blob = new Blob([finalBytes], { type: 'image/x-icon' });
        const objUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = fileName.replace(/\.[^/.]+$/, "") + '.ico';
        a.click();
        URL.revokeObjectURL(objUrl);

    } catch (e) {
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.image-to-ico.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-to-ico.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {fileUrl ? fileName : t('tools.image-to-ico.dropLabel')}
          </label>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            {!fileUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <UploadCloud className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-to-ico.dropLabel')}</span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.image-to-ico.dropDesc')}</span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <span className="truncate font-semibold text-slate-900 dark:text-slate-100" title={fileName}>{fileName}</span>
                  <button
                    type="button"
                    onClick={() => { setFileUrl(null); setFileName(''); }}
                    className="ml-4 shrink-0 text-xs font-semibold text-slate-500 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
                  >
                    {t('tools.image-to-ico.reselectBtn')}
                  </button>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
                  <img src={fileUrl} className="max-h-full max-w-full object-contain" alt="preview" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.image-to-ico.sizeLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTargetSize(s)}
                  className={cn(
                    "rounded-md border px-4 py-3 font-mono text-sm font-semibold transition-colors",
                    targetSize === s
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300"
                  )}
                >
                  {s}x{s}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-500">
              <ImageIcon className="h-12 w-12" />
            </div>

            <button
              type="button"
              disabled={!fileUrl || isProcessing}
              onClick={convertToIco}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isProcessing ? t('tools.image-to-ico.processingMsg') : t('tools.image-to-ico.exportBtn')}
            </button>
          </div>
        </div>

        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />
      </div>

    </div>
  );
}
