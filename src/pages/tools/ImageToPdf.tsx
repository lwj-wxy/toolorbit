import React, { useState, useRef } from 'react';
import { Upload, FileImage, Trash2, ArrowUp, ArrowDown, Download, CheckCircle2, GripVertical, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface LoadedImage {
  id: string;
  file: File;
  url: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<LoadedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageFormat, setPageFormat] = useState<'a4' | 'fit'>('a4');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (files: File[]) => {
    const validImages = files.filter(f => f.type.startsWith('image/'));
    const newImages = validImages.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Optional: revokeObjectURL to free memory
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    setImages(prev => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageFormat === 'a4' ? 'a4' : undefined 
        // We will adjust page by page if 'fit'
      });

      for (let i = 0; i < images.length; i++) {
        const imgObj = images[i];
        
        // Ensure image is fully loaded to get dimensions
        const img = new Image();
        img.src = imgObj.url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Add a new page if not the first image
        if (i > 0) {
           if (pageFormat === 'a4') {
             pdf.addPage('a4', 'portrait');
           } else {
             // For 'fit', we add a page exactly the size of the image (in mm)
             // 1px = ~0.264583 mm
             const widthInMm = img.width * 0.264583;
             const heightInMm = img.height * 0.264583;
             pdf.addPage([widthInMm, heightInMm], widthInMm > heightInMm ? 'landscape' : 'portrait');
           }
        } else if (pageFormat === 'fit') {
           // For the first page, if fit, delete default and recreate or just resize?
           // jsPDF doesn't cleanly resize first page, so delete it and recreate.
           const widthInMm = img.width * 0.264583;
           const heightInMm = img.height * 0.264583;
           // Workaround: add new page of correct size, delete page 1
           pdf.addPage([widthInMm, heightInMm], widthInMm > heightInMm ? 'landscape' : 'portrait');
           pdf.setPage(1);
           pdf.deletePage(1);
        }

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        let finalW = pdfWidth;
        let finalH = pdfHeight;
        let x = 0;
        let y = 0;

        if (pageFormat === 'a4') {
          // Fit image within A4 maintaining aspect ratio
          const imgRatio = img.width / img.height;
          const pdfRatio = pdfWidth / pdfHeight;

          if (imgRatio > pdfRatio) {
            finalW = pdfWidth;
            finalH = pdfWidth / imgRatio;
            y = (pdfHeight - finalH) / 2; // Center vertically
          } else {
            finalH = pdfHeight;
            finalW = pdfHeight * imgRatio;
            x = (pdfWidth - finalW) / 2; // Center horizontally
          }
        } // else (fit mode): finalW and finalH are already matching page size

        // Convert image type for jsPDF
        let format = 'JPEG';
        if (imgObj.file.type === 'image/png') format = 'PNG';
        if (imgObj.file.type === 'image/webp') format = 'WEBP';

        pdf.addImage(img, format, x, y, finalW, finalH);
      }

      pdf.save('merged-images.pdf');
    } catch (e) {
      console.error('Error generating PDF', e);
      alert('生成 PDF 时出现错误，请检查图片格式。');
    }

    setIsGenerating(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">图片转 PDF 工具</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              将多张图片（JPG/PNG 等）无损合并为一个 PDF 文件，纯本地处理。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Upload and List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
            
            <div 
              className={`rounded-xl border-2 border-dashed transition-all p-8 text-center flex flex-col items-center justify-center cursor-pointer mb-6
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
                multiple
                className="hidden" 
              />
              <Upload className="w-8 h-8 text-[#2563eb] mb-3" />
              <h3 className="text-lg font-bold text-[#1e293b] mb-1">拖拽或点击选择多张图片</h3>
              <p className="text-sm text-[#64748b]">支持批量选择，支持常见图片格式</p>
            </div>

            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    已选图片 ({images.length} 张)
                  </h3>
                  <button 
                    onClick={() => setImages([])}
                    className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    全部清空
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {images.map((img, index) => (
                    <div key={img.id} className="flex items-center gap-4 bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl transition-all hover:border-blue-200 hover:shadow-sm group">
                      <div className="cursor-move text-slate-400">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#e2e8f0] shrink-0 bg-white">
                        <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1e293b] truncate text-sm mb-1">{img.file.name}</p>
                        <p className="text-xs text-[#64748b]">{(img.file.size / 1024).toFixed(1)} KB</p>
                      </div>

                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="上移"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => moveDown(index)}
                          disabled={index === images.length - 1}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="下移"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeImage(img.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Settings and Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
            <h3 className="font-bold text-[#1e293b] mb-4">输出设置</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#64748b] mb-3">页面尺寸 (Page Size)</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-3 border border-[#e2e8f0] rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <input 
                      type="radio" 
                      name="format" 
                      checked={pageFormat === 'a4'} 
                      onChange={() => setPageFormat('a4')}
                      className="mt-0.5 accent-[#2563eb]"
                    />
                    <div>
                      <div className="font-bold text-[#1e293b] text-sm md:text-base">A4 纸张 (规范尺寸)</div>
                      <div className="text-[12px] text-[#64748b] mt-1">自动将图片缩放并居中放置在 A4 页面内，适合文档打印。</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-3 border border-[#e2e8f0] rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <input 
                      type="radio" 
                      name="format" 
                      checked={pageFormat === 'fit'} 
                      onChange={() => setPageFormat('fit')}
                      className="mt-0.5 accent-[#2563eb]"
                    />
                    <div>
                      <div className="font-bold text-[#1e293b] text-sm md:text-base">适应图片 (无白边)</div>
                      <div className="text-[12px] text-[#64748b] mt-1">生成与原图片等比例尺寸的 PDF 页面，完全贴合不留白。</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e2e8f0] mt-6 pt-6">
              <button 
                onClick={generatePDF}
                disabled={isGenerating || images.length === 0}
                className="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
              >
                {isGenerating ? (
                  <>正在生成 PDF...</>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    导出 PDF 文件
                  </>
                )}
              </button>
            </div>
            
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 leading-relaxed font-medium">
              纯本地离线处理：您的图片不会被上传至任何服务器，保护您的个人文件与数据隐私。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
