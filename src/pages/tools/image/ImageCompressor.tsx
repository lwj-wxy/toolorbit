import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Trash2, CheckCircle2, Sliders, FileImage } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.image-compressor.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.image-compressor.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Area */}
        <div className="lg:col-span-2">
          {!file ? (
            <div 
              className={`bg-white rounded-3xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer
                ${isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">{t('tools.image-compressor.dropLabel')}</h3>
              <p className="text-[#64748b] mb-8">{t('tools.image-compressor.dropDesc')}</p>
              <button className="bg-[#2563eb] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-[#1d4ed8] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                {t('tools.image-compressor.selectBtn')}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-[#1e293b] truncate max-w-[200px]">{file.name}</span>
                </div>
                <button 
                  onClick={clearFile}
                  className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t('tools.image-compressor.reuploadBtn')}
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold text-[#94a3b8] uppercase tracking-wider mb-6 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-green-500" /> {t('tools.image-compressor.previewTitle')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Original */}
                   <div className="space-y-3">
                      <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group relative">
                         <img src={previewUrl} className="w-full h-full object-contain" alt="Original" />
                         <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-bold">
                            {t('tools.image-compressor.originalLabel')}
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500">{t('tools.image-compressor.sizeLabel')}</span>
                         <span className="font-bold text-slate-800">{formatSize(file.size)}</span>
                      </div>
                   </div>

                   {/* Compressed */}
                   <div className="space-y-3">
                      <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
                         {isCompressing ? (
                           <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs font-bold text-slate-400">{t('tools.image-compressor.compressingMsg')}</span>
                           </div>
                         ) : compressedUrl ? (
                           <>
                            <img src={compressedUrl} className="w-full h-full object-contain animate-in fade-in duration-500" alt="Compressed" />
                            <div className="absolute top-2 left-2 bg-green-600/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-bold">
                               {t('tools.image-compressor.compressedLabel')}
                            </div>
                           </>
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-12 h-12" />
                           </div>
                         )}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500">{t('tools.image-compressor.sizeLabel')}</span>
                         <span className="font-bold text-slate-800">
                           {compressedBlob ? formatSize(compressedBlob.size) : '--'}
                         </span>
                      </div>
                      {compressedBlob && (
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-green-600 font-bold">{t('tools.image-compressor.savedLabel')}</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                               {Math.round(((file.size - compressedBlob.size) / file.size) * 100)}%
                            </span>
                         </div>
                      )}
                   </div>
                </div>
              </div>
              
              {compressedUrl && !isCompressing && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                   <button 
                    onClick={downloadImage}
                    className="bg-[#10b981] hover:bg-[#059669] text-white px-10 py-3.5 rounded-full font-bold shadow-lg shadow-emerald-100 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                   >
                     <Download className="w-5 h-5" /> {t('tools.image-compressor.downloadBtn')}
                   </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 lg:p-8">
              <h3 className="text-lg font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                 <Sliders className="w-5 h-5 text-blue-500" /> {t('tools.image-compressor.settingsTitle')}
              </h3>

              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-slate-600">{t('tools.image-compressor.qualityLabel')}</label>
                       <span className="text-sm font-mono font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
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
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <span>{t('tools.image-compressor.qualityLow')}</span>
                       <span>{t('tools.image-compressor.qualityHigh')}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-600 block">{t('tools.image-compressor.formatLabel')}</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['image/jpeg', 'image/png', 'image/webp'].map((f) => (
                         <button
                           key={f}
                           onClick={() => setFormat(f)}
                           className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                             format === f 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                           }`}
                         >
                           {f === 'image/jpeg' ? 'JPG' : f.split('/')[1].toUpperCase()}
                         </button>
                       ))}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic pr-2">
                      {t('tools.image-compressor.formatTip')}
                    </p>
                 </div>

                 <button 
                  onClick={compressImage}
                  disabled={!file || isCompressing}
                  className="w-full bg-[#1e293b] hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-100"
                 >
                   {isCompressing ? t('tools.image-compressor.compressingMsg') : t('tools.image-compressor.name')}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* SEO & Descriptions */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('tools.image-compressor.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed text-lg italic border-l-4 border-blue-100 pl-6">
          {t('tools.image-compressor.seoDesc')}
        </p>

        <div className="bg-rose-50 border border-rose-100/30 rounded-2xl p-6 mb-10 group hover:bg-rose-100/40 transition-colors">
          <p className="text-rose-800 text-sm font-medium leading-relaxed">
            {t('tools.image-compressor.privacyNotice')}
          </p>
        </div>

        <h3 className="font-bold text-slate-900 text-xl mb-6">{t('tools.image-compressor.whyTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-3">
              <h4 className="font-bold text-slate-800">{t('tools.image-compressor.highlight1Title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('tools.image-compressor.highlight1Desc')}</p>
           </div>
           <div className="space-y-3">
              <h4 className="font-bold text-slate-800">{t('tools.image-compressor.highlight2Title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('tools.image-compressor.highlight2Desc')}</p>
           </div>
           <div className="space-y-3">
              <h4 className="font-bold text-slate-800">{t('tools.image-compressor.highlight3Title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('tools.image-compressor.highlight3Desc')}</p>
           </div>
        </div>
        
        <p className="text-slate-400 text-sm mt-12 pt-8 border-t border-slate-100 text-center">
          {t('tools.image-compressor.seoFooter')}
        </p>
      </div>

    </div>
  );
}
