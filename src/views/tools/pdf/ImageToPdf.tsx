import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Settings,
  X,
  FileImage,
  ShieldCheck,
  Zap,
  MousePointer2,
  MonitorSmartphone,
  ChevronRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

interface ImageMetadata {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

type PageSize = 'a4' | 'fit';

export default function ImageToPdf() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const newImages: ImageMetadata[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Clean up revokeObjectURL
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const img = await loadImage(image.preview);
        
        if (i > 0) pdf.addPage();

        const pdfWidth = pageSize === 'a4' ? 210 : (img.width * 0.264583);
        const pdfHeight = pageSize === 'a4' ? 297 : (img.height * 0.264583);

        if (pageSize === 'fit') {
          // @ts-ignore - Dynamic page size
          pdf.setPage(i + 1);
          // @ts-ignore - Internal method but commonly used for fit
          pdf.addHTML = undefined; // reset
          // For custom size, we need to handle it during page creation or using internal methods
          // Simplest for 'fit' is to use the image dimensions in mm
        }

        const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(image.preview, 'JPEG', x, y, width, height, undefined, 'FAST');
      }

      pdf.save(`images_to_pdf_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error(err);
      alert(t('tools.image-to-pdf.errors.generateError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <FileImage className="w-10 h-10 text-indigo-600" />
          {t('tools.image-to-pdf.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('tools.image-to-pdf.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files!)}
            />
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('tools.image-to-pdf.dropLabel')}</h3>
            <p className="text-gray-500">{t('tools.image-to-pdf.dropDesc')}</p>
          </div>

          {/* Image List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {t('tools.image-to-pdf.checkedTitle', { count: images.length })}
              </h3>
              {images.length > 0 && (
                <button
                  onClick={() => setImages([])}
                  className="text-sm font-bold text-red-600 hover:text-red-700"
                >
                  {t('tools.image-to-pdf.clearAllBtn')}
                </button>
              )}
            </div>

            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 group"
                  >
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-0 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-0 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img src={image.preview} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate text-sm">{image.name}</p>
                      <p className="text-xs text-gray-500">{(image.size / 1024).toFixed(1)} KB</p>
                    </div>

                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              {t('tools.image-to-pdf.settingsTitle')}
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  {t('tools.image-to-pdf.pageSizeLabel')}
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setPageSize('a4')}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      pageSize === 'a4' 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-bold text-gray-900 mb-1">{t('tools.image-to-pdf.pageA4Title')}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      {t('tools.image-to-pdf.pageA4Desc')}
                    </div>
                  </button>

                  <button
                    onClick={() => setPageSize('fit')}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      pageSize === 'fit' 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-bold text-gray-900 mb-1">{t('tools.image-to-pdf.pageFitTitle')}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      {t('tools.image-to-pdf.pageFitDesc')}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={generatePdf}
              disabled={images.length === 0 || isGenerating}
              className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 ${
                images.length === 0 || isGenerating 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('tools.image-to-pdf.generatingBtn')}</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span>{t('tools.image-to-pdf.generateBtn')}</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tools.image-to-pdf.seoTitle')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('tools.image-to-pdf.seoDesc')}</p>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                    <p className="text-sm text-indigo-900">
                      <strong>{t('tools.image-to-pdf.privacyNotice')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">{t('tools.image-to-pdf.highlightsTitle')}</h3>
              
              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.image-to-pdf.highlight1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.image-to-pdf.highlight1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.image-to-pdf.highlight2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.image-to-pdf.highlight2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t('tools.image-to-pdf.highlight3Title')}</h4>
                  <p className="text-sm text-gray-600">{t('tools.image-to-pdf.highlight3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <p className="text-gray-500 italic">
              {t('tools.image-to-pdf.seoFooter')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
