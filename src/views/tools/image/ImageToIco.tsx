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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.image-to-ico.title')}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {t('tools.image-to-ico.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />
        
        {!fileUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-16 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="font-bold text-lg text-slate-700 group-hover:text-emerald-700 mb-1">{t('tools.image-to-ico.dropLabel')}</p>
            <p className="text-sm opacity-60 text-center">{t('tools.image-to-ico.dropDesc')}</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 border border-slate-200/80 p-8 rounded-2xl">
                 <div className="w-48 h-48 bg-[url('https://cdn.pixabay.com/photo/2021/08/11/06/32/transparent-block-pattern-6537672_1280.png')] rounded-xl shadow-inner border border-slate-200 flex items-center justify-center overflow-hidden bg-cover shrink-0">
                    <img src={fileUrl} className="max-w-full max-h-full object-contain" alt="preview" />
                 </div>
                 <div className="flex-1 w-full space-y-4">
                     <div>
                         <h3 className="font-bold text-slate-800 text-lg truncate flex-1" title={fileName}>{fileName}</h3>
                         <div className="text-xs text-slate-500 font-mono mt-1">Ready for compilation • Source mapped frame</div>
                     </div>

                     <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">{t('tools.image-to-ico.sizeLabel')}</label>
                         <div className="flex flex-wrap gap-3">
                             {SIZES.map(s => (
                                <button
                                   key={s}
                                   onClick={() => setTargetSize(s)}
                                   className={cn(
                                       "px-4 py-2 rounded-lg font-mono text-sm font-bold border transition-all",
                                       targetSize === s ? "bg-slate-900 border-slate-900 text-white shadow" : "bg-white border-slate-200/80 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                   )}
                                >
                                    {s}x{s}
                                </button>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>

             <div className="flex gap-4">
                 <button 
                    onClick={() => { setFileUrl(null); setFileName(''); }}
                    className="px-6 py-3 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                 >
                     {t('tools.image-to-ico.reselectBtn')}
                 </button>
                 <button 
                    disabled={isProcessing}
                    onClick={convertToIco}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50"
                 >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                     {isProcessing ? t('tools.image-to-ico.processingMsg') : t('tools.image-to-ico.exportBtn')}
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Content */}
      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.image-to-ico.seoTitle')}</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
           <p>{t('tools.image-to-ico.seoDesc')}</p>
           <p>{t('tools.image-to-ico.seoFooter')}</p>
        </div>
      </div>
    </div>
  );
}
