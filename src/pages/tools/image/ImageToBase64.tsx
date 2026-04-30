import React, { useState, useRef } from 'react';
import { Upload, FileCode2, Copy, Trash2, CheckCircle2, Image as ImageIcon, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.image-to-base64.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.image-to-base64.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-10">
        {!file ? (
          <div 
            className={`rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer
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
            <div className="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">{t('tools.image-to-base64.dropLabel')}</h3>
            <p className="text-[#64748b] mb-6">{t('tools.image-to-base64.dropDesc')}</p>
            <button className="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t('tools.image-to-base64.selectBtn')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                {t('tools.image-to-base64.detailsTitle')}
              </h3>
              <button 
                onClick={clearFile}
                className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />{t('tools.image-to-base64.clearBtn')}
              </button>
            </div>

            {file.size > 2 * 1024 * 1024 && (
               <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm mb-4">
                 <span className="font-bold">⚠️ {t('tools.image-to-base64.sizeWarning', { size: formatSize(file.size) })}</span>
               </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Preview Area (Left) */}
              <div className="w-full lg:w-[300px] shrink-0">
                <h4 className="text-sm font-bold text-[#64748b] mb-3 uppercase tracking-wider">{t('tools.image-to-base64.sourceImage')}</h4>
                <div className="flex flex-col">
                  <div className="aspect-square bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRUVFIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHg9IjQiIHk9IjQiIGZpbGw9IiNFRUUiLz4KPC9zdmc+')] rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center mb-3">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0] space-y-1.5 text-[13px]">
                     <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500">{t('tools.image-to-base64.fileName')}</span>
                        <span className="font-bold text-slate-700 truncate text-right">{file.name}</span>
                     </div>
                     <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500">{t('tools.image-to-base64.fileFormat')}</span>
                        <span className="font-bold text-slate-700">{file.type}</span>
                     </div>
                     <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500">{t('tools.image-to-base64.rawSize')}</span>
                        <span className="font-bold text-slate-700">{formatSize(file.size)}</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Output Content Area (Right) */}
              <div className="flex-1 space-y-5 overflow-hidden">
                
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h4 className="text-sm font-bold text-[#64748b] uppercase tracking-wider">{t('tools.image-to-base64.dataUrlTitle')}</h4>
                    <button 
                      onClick={() => copyToClipboard(base64String, 'dataurl')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      {copiedDataUrl ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedDataUrl ? t('tools.image-to-base64.copiedDataUrl') : t('tools.image-to-base64.copyDataUrl')}
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={base64String}
                    className="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
                  />
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h4 className="text-sm font-bold text-[#64748b] uppercase tracking-wider">{t('tools.image-to-base64.rawBase64Title')}</h4>
                    <button 
                      onClick={() => copyToClipboard(pureBase64, 'raw')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      {copiedRaw ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedRaw ? t('tools.image-to-base64.copiedRaw') : t('tools.image-to-base64.copyRaw')}
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={pureBase64}
                    className="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
                  />
                </div>

              </div>
            </div>
          </div>
        )}
        
        {/* Related Link matching user screenshot */}
        <div className="mt-8 bg-amber-50 rounded-xl p-4 text-center border border-amber-100 flex items-center justify-center gap-2">
          <span className="text-amber-800 text-sm">{t('tools.image-to-base64.relatedRecommend')}</span>
          <Link to="/tools/base64" className="text-amber-600 hover:text-amber-700 font-bold underline flex items-center gap-1 text-sm">
            {t('tools.image-to-base64.relatedLink')} <ArrowRightLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-8 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.image-to-base64.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.image-to-base64.seoDesc')}
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            {t('tools.image-to-base64.privacyNotice')}
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.image-to-base64.highlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.image-to-base64.highlight1Title')}</strong>
            <span>{t('tools.image-to-base64.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.image-to-base64.highlight2Title')}</strong>
            <span>{t('tools.image-to-base64.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.image-to-base64.highlight3Title')}</strong>
            <span>{t('tools.image-to-base64.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100 italic">
          {t('tools.image-to-base64.seoFooter')}
        </p>
      </div>

    </div>
  );
}
