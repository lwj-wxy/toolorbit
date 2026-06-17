import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Settings,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageMetadata {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

type PageSize = 'a4' | 'fit';

const A4_PAGE = {
  width: 210,
  height: 297,
};

const MM_PER_PX = 25.4 / 96;

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

  const clearImages = () => {
    setImages(prev => {
      prev.forEach(image => URL.revokeObjectURL(image.preview));
      return [];
    });
  };

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

  const getImageSize = (imageElement: HTMLImageElement) => ({
    width: imageElement.naturalWidth || imageElement.width,
    height: imageElement.naturalHeight || imageElement.height,
  });

  const getPdfPageSize = (imageElement: HTMLImageElement) => {
    if (pageSize === 'a4') {
      return A4_PAGE;
    }

    const imageSize = getImageSize(imageElement);
    return {
      width: Math.max(imageSize.width * MM_PER_PX, 1),
      height: Math.max(imageSize.height * MM_PER_PX, 1),
    };
  };

  const getImagePdfSource = (image: ImageMetadata, imageElement: HTMLImageElement) => {
    const imageSize = getImageSize(imageElement);
    const canvas = document.createElement('canvas');
    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }

    const isPng = image.file.type === 'image/png';
    if (!isPng) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    return {
      dataUrl: isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92),
      format: isPng ? 'PNG' : 'JPEG',
    };
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const { jsPDF } = await import('jspdf');
      const firstImageElement = await loadImage(images[0].preview);
      const firstPageSize = getPdfPageSize(firstImageElement);
      const pdf = new jsPDF({
        orientation: firstPageSize.width > firstPageSize.height ? 'l' : 'p',
        unit: 'mm',
        format: [firstPageSize.width, firstPageSize.height],
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageElement = i === 0 ? firstImageElement : await loadImage(image.preview);
        const imageSize = getImageSize(imageElement);
        const pdfPageSize = i === 0 ? firstPageSize : getPdfPageSize(imageElement);

        if (i > 0) {
          pdf.addPage(
            [pdfPageSize.width, pdfPageSize.height],
            pdfPageSize.width > pdfPageSize.height ? 'l' : 'p',
          );
        }

        const ratio = Math.min(pdfPageSize.width / imageSize.width, pdfPageSize.height / imageSize.height);
        const width = imageSize.width * ratio;
        const height = imageSize.height * ratio;
        const x = (pdfPageSize.width - width) / 2;
        const y = (pdfPageSize.height - height) / 2;
        const pdfImageSource = getImagePdfSource(image, imageElement);

        pdf.addImage(pdfImageSource.dataUrl, pdfImageSource.format, x, y, width, height, undefined, 'FAST');
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.image-to-pdf.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.image-to-pdf.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.image-to-pdf.checkedTitle', { count: images.length })}
            </label>
            {images.length > 0 ? (
              <button
                onClick={clearImages}
                className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                {t('tools.image-to-pdf.clearAllBtn')}
              </button>
            ) : null}
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files!)}
            />
            {images.length === 0 ? (
              <button
                type="button"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById('image-upload')?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                  <Upload className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.image-to-pdf.dropLabel')}</span>
                <span className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{t('tools.image-to-pdf.dropDesc')}</span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <AnimatePresence initial={false}>
                    {images.map((image, index) => (
                      <motion.div
                        key={image.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className="rounded p-1 transition-colors hover:bg-slate-200 disabled:opacity-0 dark:hover:bg-slate-800"
                          >
                            <ArrowUp className="h-4 w-4 text-slate-500" />
                          </button>
                          <button
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === images.length - 1}
                            className="rounded p-1 transition-colors hover:bg-slate-200 disabled:opacity-0 dark:hover:bg-slate-800"
                          >
                            <ArrowDown className="h-4 w-4 text-slate-500" />
                          </button>
                        </div>

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
                          <img src={image.preview} alt="" className="h-full w-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{image.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{(image.size / 1024).toFixed(1)} KB</p>
                        </div>

                        <button
                          onClick={() => removeImage(image.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex w-full items-center justify-center gap-2 border-t border-slate-100 p-4 font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 dark:border-slate-800 dark:text-cyan-300 dark:hover:bg-cyan-950/20"
                >
                  <Upload className="h-5 w-5" />
                  {t('tools.image-to-pdf.dropLabel')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.image-to-pdf.settingsTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Settings className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
              {t('tools.image-to-pdf.settingsTitle')}
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="mb-3 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {t('tools.image-to-pdf.pageSizeLabel')}
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setPageSize('a4')}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      pageSize === 'a4' 
                        ? 'border-cyan-500 bg-cyan-50/70 dark:border-cyan-700 dark:bg-cyan-950/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-[#282c34] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="mb-1 font-semibold text-slate-950 dark:text-white">{t('tools.image-to-pdf.pageA4Title')}</div>
                    <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {t('tools.image-to-pdf.pageA4Desc')}
                    </div>
                  </button>

                  <button
                    onClick={() => setPageSize('fit')}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      pageSize === 'fit' 
                        ? 'border-cyan-500 bg-cyan-50/70 dark:border-cyan-700 dark:bg-cyan-950/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-[#282c34] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="mb-1 font-semibold text-slate-950 dark:text-white">{t('tools.image-to-pdf.pageFitTitle')}</div>
                    <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {t('tools.image-to-pdf.pageFitDesc')}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={generatePdf}
              disabled={images.length === 0 || isGenerating}
              className={`flex w-full items-center justify-center gap-3 rounded-lg py-4 font-semibold text-white transition-colors ${
                images.length === 0 || isGenerating 
                  ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-700'
                  : 'bg-cyan-600 hover:bg-cyan-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{t('tools.image-to-pdf.generatingBtn')}</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span>{t('tools.image-to-pdf.generateBtn')}</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
