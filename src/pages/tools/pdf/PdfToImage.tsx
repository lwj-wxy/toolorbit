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
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-16 flex flex-col items-center">
            <div 
              className={`w-full max-w-2xl border-2 border-dashed rounded-2xl transition-all p-12 text-center flex flex-col items-center justify-center min-h-[300px] cursor-pointer
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
              <div className="w-20 h-20 bg-white border border-slate-100 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">拖拽或点击选择 PDF 文件</h3>
              <p className="text-[#64748b] mb-8">纯本地离线解析，瞬间完成导出，完全不上传您的数据</p>
              <button className="bg-[#2563eb] text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
                选择文件...
              </button>
            </div>
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
      
      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">PDF 转图片工具，高清离线、安全便捷</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          PDF 转图片功能是一款简单强大、能将 PDF 文档每一页高清转换为独立图像文件的效率工具。无论您是需要将演示文稿导出为 JPG 组图便于在社交媒体分享，还是只为了更方便地将文档内容嵌入到不支持 PDF 的网页与系统中，本工具一键便可完成。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            本工具承诺 100% 纯本地离线处理。您的所有文档、发票、私密截图与报表，完全在您的个人浏览器沙盒中被解析渲染，绝对保证数据不上传到任何云端服务器，从物理层面上杜绝隐私泄露。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么推荐使用我们的纯前端转换方案？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 即用即走，拒绝安装：</strong>
            <span>在原生浏览器的支持下，这颗网页工具包几乎能够无缝替代市面上所有的庞大桌面软件。不占用系统运行空间，不用等冗长的安装读条，随时随地打开网页即可转换。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 高清引擎原汁原味：</strong>
            <span>内置了专业的图形渲染算法，它并不是简单地“截个图”，而是深入解析了 PDF 的源数据，保证提取出的静态图片依然保留原本高清的字形排版和色彩。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 灵活导出与一键打包：</strong>
            <span>除了单独预览下载某张特定的页面外，转换完毕后工具还会立刻在本地瞬间生成 ZIP 压缩包，方便您将数十甚至上百页生成的图片打包带走，大大提升文件梳理的效率。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          总之，依托尖端的本地网页技术解析各类 PDF 文件，您不仅将摆脱缓慢的云端上传等待，更会因彻底阻断了隐密风险而获得一份省心的操作体验。
        </p>
      </div>

    </div>
  );
}
