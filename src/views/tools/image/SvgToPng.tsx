import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileImage, UploadCloud, Download, Code, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function SvgToPng() {
  const { t } = useTranslation();
  const [svgContent, setSvgContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('converted_image');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(800);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse SVG string to establish original dimensions
  useEffect(() => {
    if (!svgContent) {
        setPreviewError('');
        return;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const errNode = doc.querySelector('parsererror');
        if (errNode) {
            setPreviewError(t('tools.svg-to-png.parseError'));
            return;
        }

        const rootSvg = doc.documentElement;
        if (rootSvg.tagName.toLowerCase() !== 'svg') {
            setPreviewError(t('tools.svg-to-png.noRootError'));
            return;
        }

        let w = parseFloat(rootSvg.getAttribute('width') || '0');
        let h = parseFloat(rootSvg.getAttribute('height') || '0');
        const viewBox = rootSvg.getAttribute('viewBox');

        if ((!w || !h) && viewBox) {
            const parts = viewBox.split(/\s+|,/);
            if (parts.length >= 4) {
               w = parseFloat(parts[2]);
               h = parseFloat(parts[3]);
            }
        }

        if (w > 0 && h > 0) {
           const ratio = w / h;
           setOriginalAspectRatio(ratio);
           // We ONLY auto-update the setting inputs when they first load the SVG, to be helpful.
           setWidth(Math.round(w));
           setHeight(Math.round(h));
        }

        setPreviewError('');

    } catch (e) {
        setPreviewError(t('tools.svg-to-png.unknownError'));
    }

  }, [svgContent, t]);

  const handleWidthChange = (val: number) => {
      setWidth(val);
      if (maintainRatio && originalAspectRatio > 0) {
          setHeight(Math.round(val / originalAspectRatio));
      }
  };

  const handleHeightChange = (val: number) => {
      setHeight(val);
      if (maintainRatio && originalAspectRatio > 0) {
          setWidth(Math.round(val * originalAspectRatio));
      }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (e) => {
       const text = e.target?.result;
       if (typeof text === 'string') {
          setSvgContent(text);
       }
    };
    reader.readAsText(file);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
     if (!svgContent) return;
     const canvas = canvasRef.current;
     if (!canvas) return;

     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     const parser = new DOMParser();
     const doc = parser.parseFromString(svgContent, 'image/svg+xml');
     const rootSvg = doc.documentElement;
     rootSvg.setAttribute('width', width.toString());
     rootSvg.setAttribute('height', height.toString());
     const modifiedSvgString = new XMLSerializer().serializeToString(doc);

     const img = new Image();
     const svgBlob = new Blob([modifiedSvgString], { type: 'image/svg+xml;charset=utf-8' });
     const blobURL = URL.createObjectURL(svgBlob);

     img.onload = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(img, 0, 0, width, height);
         const pngUrl = canvas.toDataURL("image/png");
         const downloadLink = document.createElement("a");
         downloadLink.href = pngUrl;
         downloadLink.download = `${fileName}.png`;
         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink);
         URL.revokeObjectURL(blobURL);
     };

     img.src = blobURL;
  };

  const clearAll = () => {
      setSvgContent('');
      setPreviewError('');
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const getEncodedSvgUri = () => {
      if (!svgContent || previewError) return null;
      return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgContent)));
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} width={width} height={height} className="hidden" />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.svg-to-png.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.svg-to-png.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              <Code className="h-4 w-4 text-cyan-600" />
              {t('tools.svg-to-png.editorTitle')}
            </label>
            {svgContent ? (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.svg-to-png.clearBtn')}
              </button>
            ) : null}
          </div>

          <div
            className={`flex h-[500px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34] ${
              isDragging ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20' : ''
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".svg,image/svg+xml"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {!svgContent ? (
              <div className="flex h-56 flex-col items-center justify-center border-b border-slate-200 px-8 text-center dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                    <UploadCloud className="h-6 w-6" />
                  </span>
                  <span className="text-base font-semibold text-slate-950 dark:text-white">{t('tools.svg-to-png.dropLabel')}</span>
                  <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{t('tools.svg-to-png.dropDesc')}</span>
                  <span className="mt-4 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                    {t('tools.svg-to-png.selectBtn')}
                  </span>
                </button>
              </div>
            ) : null}

            <textarea
              value={svgContent}
              onChange={(e) => setSvgContent(e.target.value)}
              placeholder={`${t('tools.svg-to-png.orPaste')}\n<svg viewBox="0 0 100 100"> ... </svg>`}
              className="block min-h-0 flex-1 resize-none border-0 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 dark:bg-[#282c34] dark:text-slate-100"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <ImageIcon className="h-4 w-4 text-cyan-600" />
            {t('tools.svg-to-png.renderTitle')}
          </label>

          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.svg-to-png.widthLabel')}</label>
                <input
                  type="number"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.svg-to-png.heightLabel')}</label>
                <input
                  type="number"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
                />
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={maintainRatio}
                onChange={(e) => setMaintainRatio(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              {t('tools.svg-to-png.lockRatio')}
            </label>

            <div
              className="mt-5 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#282c34]"
              style={{
                backgroundImage: 'linear-gradient(45deg, rgba(148, 163, 184, 0.18) 25%, transparent 25%), linear-gradient(-45deg, rgba(148, 163, 184, 0.18) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148, 163, 184, 0.18) 75%), linear-gradient(-45deg, transparent 75%, rgba(148, 163, 184, 0.18) 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              {previewError ? (
                <div className="max-w-sm rounded-lg border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-200">
                  <div className="mb-1 font-semibold">{t('tools.svg-to-png.failTitle')}</div>
                  {previewError}
                </div>
              ) : getEncodedSvgUri() ? (
                <img
                  src={getEncodedSvgUri()!}
                  alt="SVG Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <FileImage className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              )}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!svgContent || !!previewError || width === 0 || height === 0}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              <Download className="h-4 w-4" />
              {t('tools.svg-to-png.downloadBtn')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
