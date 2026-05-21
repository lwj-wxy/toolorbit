import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, Trash2, Image as ImageIcon, Columns, Maximize, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

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

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Upload for Crop',
      label: selectedFile.type,
      metadata: { size: selectedFile.size }
    });
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
    
    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Change Crop Aspect',
      label: newAspect ? newAspect.toString() : 'free'
    });

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
      
      analytics.trackEvent({
        category: 'Image Tools',
        action: 'Download Cropped Image',
        label: aspect ? aspect.toString() : 'free',
        metadata: { width: canvas.width, height: canvas.height }
      });

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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.image-cropper.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-cropper.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {imgSrc ? t('tools.image-cropper.editingTitle', { name: file?.name }) : t('tools.image-cropper.dropLabel')}
            </label>
            {imgSrc ? (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.image-cropper.reselectBtn')}
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
            {!imgSrc ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-cropper.dropLabel')}</span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.image-cropper.dropDesc')}</span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                  {t('tools.image-cropper.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    <ImageIcon className="h-4 w-4 shrink-0 text-cyan-600" />
                    <span className="truncate">{file?.name}</span>
                  </span>
                  <span className="ml-4 shrink-0 text-slate-500 dark:text-slate-400">
                    {t('tools.image-cropper.originalDim', { width: actualWidth, height: actualHeight })}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-slate-50 p-4 dark:bg-slate-900">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-full max-w-full rounded border border-slate-300 shadow-sm dark:border-slate-700"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{ maxHeight: '430px', objectFit: 'contain' }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <MousePointer2 className="h-4 w-4" />
                  {t('tools.image-cropper.dragTip')}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.image-cropper.settingsTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-6">
              {/* Aspect Ratio Presets */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.image-cropper.aspectLabel')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleAspectClick(undefined)}
                    disabled={!imgSrc}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${!aspect ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {t('tools.image-cropper.aspectFree')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(1)}
                    disabled={!imgSrc}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${aspect === 1 ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {t('tools.image-cropper.aspectSquare')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(16 / 9)}
                    disabled={!imgSrc}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${aspect === 16 / 9 ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {t('tools.image-cropper.aspect169')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(4 / 3)}
                    disabled={!imgSrc}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${aspect === 4 / 3 ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {t('tools.image-cropper.aspect43')}
                  </button>
                  <button 
                    onClick={() => handleAspectClick(9 / 16)}
                    disabled={!imgSrc}
                    className={`col-span-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${aspect === 9 / 16 ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {t('tools.image-cropper.aspect916')}
                  </button>
                </div>
              </div>

              {/* Real-time Crop Size Feedback */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                 <label className="mb-3 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                   <Columns className="h-4 w-4" /> {t('tools.image-cropper.outputDimLabel')}
                 </label>
                 
                 <div className="flex items-center gap-4 text-center">
                    <div className="relative flex-1 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
                       <span className="block font-mono text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{realCropSize.width}</span>
                       <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.image-cropper.widthLabel')}</span>
                    </div>
                    <div className="text-slate-300 dark:text-slate-600">
                      <Maximize className="mx-auto h-5 w-5" />
                    </div>
                    <div className="relative flex-1 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
                       <span className="block font-mono text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{realCropSize.height}</span>
                       <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.image-cropper.heightLabel')}</span>
                    </div>
                 </div>
              </div>

            </div>
            
            <div className="mt-auto">
              <button 
                onClick={downloadCroppedImage}
                disabled={!completedCrop?.width || !completedCrop?.height || !imgSrc}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                {t('tools.image-cropper.downloadBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
