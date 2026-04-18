import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, ArrowRight, CheckCircle2, FileImage, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Set worker context from a reliable CDN to avoid bundler headaches with web workers
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageImage {
  pageNumber: number;
  dataUrl: string;
}

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processPdfFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        processPdfFile(droppedFile);
      } else {
        alert("请上传有效的 PDF 文件！");
      }
    }
  };

  const processPdfFile = async (pdfFile: File) => {
    setFile(pdfFile);
    setIsProcessing(true);
    setImages([]);
    setProgress({ current: 0, total: 0 });

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      setProgress({ current: 0, total: numPages });
      
      const newImages: PageImage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        // Scale 2 for better resolution
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Always output JPEG for stability, with white background ensuring transparencies are ok
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          newImages.push({ pageNumber: i, dataUrl });
        }
        
        setProgress({ current: i, total: numPages });
      }

      setImages(newImages);

    } catch (e) {
      console.error("Failed to parse PDF", e);
      alert("解析 PDF 文件失败，请确保文件未加密或损坏。");
      clearFile();
    }
    
    setIsProcessing(false);
  };

  const clearFile = () => {
    setFile(null);
    setImages([]);
    setProgress({ current: 0, total: 0 });
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadAllAsZip = async () => {
    if (images.length === 0 || !file) return;
    
    const zip = new JSZip();
    const folderName = file.name.replace(/\.[^/.]+$/, "");
    const imgFolder = zip.folder(folderName);
    
    if (!imgFolder) return;

    images.forEach(img => {
      // Split the base64 string
      const base64Data = img.dataUrl.split(',')[1];
      imgFolder.file(`page-${img.pageNumber}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${folderName}-images.zip`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">PDF 转长图 / 图片</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在本地解析 PDF 文档并将每一页导出为高清 JPEG 图片，支持一键打包下载。
            </p>
          </div>
        </div>
      </div>

      {!file ? (
        <div 
          className={`bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer shadow-sm
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
            accept="application/pdf" 
            className="hidden" 
          />
          <div className="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-[#1e293b] mb-2">点击选择 PDF 文件或拖拽至此</h3>
          <p className="text-[#64748b] mb-6">纯本地离线解析，瞬间完成导出，高度保护隐私</p>
          <button className="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
            选择 PDF 文件...
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-rose-500" />
              <div>
                <h3 className="font-bold text-[#1e293b]">{file.name}</h3>
                <p className="text-sm text-[#64748b]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB 
                  {progress.total > 0 && ` · 共 ${progress.total} 页`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isProcessing && images.length > 0 && (
                <button 
                  onClick={downloadAllAsZip}
                  className="flex-1 sm:flex-none bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> 打包下载 ZIP
                </button>
              )}
              <button 
                onClick={clearFile}
                className="flex-1 sm:flex-none bg-white border border-[#cbd5e1] hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600 px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> 清除
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">正在全力解析 PDF...</h3>
              <p className="text-[#64748b]">
                已解析 {progress.current} / {progress.total} 页
              </p>
              <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 mt-6 overflow-hidden">
                <div 
                  className="bg-[#2563eb] h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isProcessing && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.pageNumber} className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden group">
                  <div className="bg-slate-100 aspect-[1/1.4] relative flex items-center justify-center p-2 border-b border-[#e2e8f0]">
                    <img 
                      src={img.dataUrl} 
                      alt={`Page ${img.pageNumber}`} 
                      className="max-w-full max-h-full object-contain shadow-sm border border-slate-200" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <a 
                        href={img.dataUrl} 
                        download={`page-${img.pageNumber}.jpg`}
                        className="bg-white text-[#0f172a] px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                      >
                        <Download className="w-4 h-4" /> 单张下载
                      </a>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                     <span className="text-sm font-bold text-[#64748b]">第 {img.pageNumber} 页</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!file && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-8">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            我们使用先进的 JavaScript 引擎在您的浏览器本地直接分解 PDF，文件内容绝不上传，无论是账单、发票还是私密文档都可以安心转换。
          </p>
        </div>
      )}

    </div>
  );
}
