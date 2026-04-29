import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Crop as CropIcon, Download, Trash2, Image as ImageIcon, Settings2, Columns, Maximize, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper() {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const [actualWidth, setActualWidth] = useState<number>(0);
  const [actualHeight, setActualHeight] = useState<number>(0);

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
    setCrop(undefined); // Reset crop
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      setImgSrc(reader.result?.toString() || '')
    );
    reader.readAsDataURL(selectedFile);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setActualWidth(naturalWidth);
    setActualHeight(naturalHeight);
    
    // Default setting a centered crop of 90% if no aspect, otherwise enforce aspect
    const initialAspect = aspect || (width / height); 
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop(centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, initialAspect, width, height),
        width,
        height
      ));
    }
  };

  const handleAspectClick = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (newAspect) {
        setCrop(centerAspectCrop(width, height, newAspect));
      } else {
        // Free ratio
        setCrop(centerCrop(
          makeAspectCrop({ unit: '%', width: 90 }, width / height, width, height),
          width,
          height
        ));
      }
    }
  };

  const downloadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !file) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background in case of PNG crop
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const nameParts = file.name.split('.');
      nameParts.pop(); // remove original extension
      a.download = `${nameParts.join('.')}-cropped.jpg`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
  };

  const clearFile = () => {
    setImgSrc('');
    setFile(null);
    setCrop(undefined);
    setCompletedCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calculate real pixel dimensions of current crop
  const getRealCropSize = () => {
    if (!completedCrop || !imgRef.current) return { width: 0, height: 0 };
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    return {
      width: Math.round(completedCrop.width * scaleX),
      height: Math.round(completedCrop.height * scaleY)
    };
  };

  const realCropSize = getRealCropSize();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <CropIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.image-cropper.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.image-cropper.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            
            {!imgSrc ? (
              <div 
                className={`rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer w-full
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
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">{t('tools.image-cropper.dropLabel')}</h3>
                <p className="text-[#64748b] mb-6">{t('tools.image-cropper.dropDesc')}</p>
                <button className="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
                  {t('tools.image-cropper.selectBtn')}
                </button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                  <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2 truncate">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    {t('tools.image-cropper.editingTitle', { name: file?.name })}
                  </h3>
                  <button 
                    onClick={clearFile}
                    className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />{t('tools.image-cropper.reselectBtn')}
                  </button>
                </div>
                
                <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 flex justify-center items-center overflow-x-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-w-full max-h-[600px] shadow-sm rounded border border-slate-300"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{ maxHeight: '600px', objectFit: 'contain' }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>

                <div className="flex justify-between items-center text-sm text-[#64748b] px-2 font-medium">
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="w-4 h-4" /> {t('tools.image-cropper.dragTip')}
                  </div>
                  <div>{t('tools.image-cropper.originalDim', { width: actualWidth, height: actualHeight })}</div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-[#1e293b]">{t('tools.image-cropper.settingsTitle')}</h3>
            </div>

            <div className="space-y-6">
              {/* Aspect Ratio Presets */}
              <div>
                <label className="text-sm font-bold text-[#64748b] mb-3 block">{t('tools.image-cropper.aspectLabel')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleAspectClick(undefined)}
                    disabled={!imgSrc}
                    className={`py-2 rounded-lg font-bold text-sm transition-all border ${!aspect ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {t('tools.image-cropper.aspectFree')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(1)}
                    disabled={!imgSrc}
                    className={`py-2 rounded-lg font-bold text-sm transition-all border ${aspect === 1 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {t('tools.image-cropper.aspectSquare')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(16 / 9)}
                    disabled={!imgSrc}
                    className={`py-2 rounded-lg font-bold text-sm transition-all border ${aspect === 16 / 9 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {t('tools.image-cropper.aspect169')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(4 / 3)}
                    disabled={!imgSrc}
                    className={`py-2 rounded-lg font-bold text-sm transition-all border ${aspect === 4 / 3 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {t('tools.image-cropper.aspect43')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(9 / 16)}
                    disabled={!imgSrc}
                    className={`py-2 col-span-2 rounded-lg font-bold text-sm transition-all border ${aspect === 9 / 16 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {t('tools.image-cropper.aspect916')}
                  </button>
                </div>
              </div>

              {/* Real-time Crop Size Feedback */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-xl">
                 <label className="text-sm font-bold text-[#64748b] mb-3 flex items-center gap-1">
                   <Columns className="w-4 h-4" /> {t('tools.image-cropper.outputDimLabel')}
                 </label>
                 
                 <div className="flex items-center gap-4 text-center">
                    <div className="flex-1 bg-white border border-[#cbd5e1] rounded-lg p-2 shadow-sm relative">
                       <span className="block text-[#0f172a] font-mono font-bold text-xl tracking-tight">{realCropSize.width}</span>
                       <span className="text-[11px] text-[#64748b] uppercase font-bold tracking-wider">{t('tools.image-cropper.widthLabel')}</span>
                    </div>
                    <div className="text-slate-300">
                      <Maximize className="w-5 h-5 mx-auto" />
                    </div>
                    <div className="flex-1 bg-white border border-[#cbd5e1] rounded-lg p-2 shadow-sm relative">
                       <span className="block text-[#0f172a] font-mono font-bold text-xl tracking-tight">{realCropSize.height}</span>
                       <span className="text-[11px] text-[#64748b] uppercase font-bold tracking-wider">{t('tools.image-cropper.heightLabel')}</span>
                    </div>
                 </div>
              </div>

            </div>
            
            <div className="border-t border-[#e2e8f0] mt-6 pt-6">
              <button 
                onClick={downloadCroppedImage}
                disabled={!completedCrop?.width || !completedCrop?.height || !imgSrc}
                className="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
              >
                <Download className="w-5 h-5" />
                {t('tools.image-cropper.downloadBtn')}
              </button>
            </div>

          </div>
          
        </div>
      </div>
      
      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-2">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.image-cropper.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.image-cropper.seoDesc')}
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            {t('tools.image-cropper.privacyNotice')}
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.image-cropper.whyTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.image-cropper.highlight1Title')}</strong>
            <span>{t('tools.image-cropper.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.image-cropper.highlight2Title')}</strong>
            <span>{t('tools.image-cropper.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-1 md:shrink-0">{t('tools.image-cropper.highlight3Title')}</strong>
            <span>{t('tools.image-cropper.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100 italic">
          {t('tools.image-cropper.seoFooter')}
        </p>
      </div>

    </div>
  );
}
