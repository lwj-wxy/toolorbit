import React, { useState, useRef } from 'react';
import { Upload, Columns, Trash2, Download, CheckCircle2, FileText, ChevronRight, Hash, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface LoadedPdf {
  file: File;
  pages: number;
}

export default function PdfSplit() {
  const [pdf, setPdf] = useState<LoadedPdf | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorDesc, setErrorDesc] = useState('');
  
  // Split modes
  const [splitMode, setSplitMode] = useState<'individual' | 'range'>('individual');
  const [rangeStr, setRangeStr] = useState<string>(''); // e.g., "1-5, 8, 11-13"
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    setErrorDesc('');
    setIsFinished(false);
    
    let file: File | null = null;
    if ('dataTransfer' in event && event.dataTransfer.files.length > 0) {
      file = event.dataTransfer.files[0];
    } else if (event.target && (event.target as HTMLInputElement).files?.[0]) {
      file = (event.target as HTMLInputElement).files![0];
    }
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorDesc('只支持上传 PDF 文件');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPdf({
         file,
         pages: pdfDoc.getPageCount()
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      console.error("Error reading PDF", e);
      setErrorDesc('PDF 解析失败，可能已加密或损坏');
    }
  };

  const removeFile = () => {
    setPdf(null);
    setIsFinished(false);
    setRangeStr('');
  };

  const processSplit = async () => {
    if (!pdf) return;
    
    setIsProcessing(true);
    setErrorDesc('');
    try {
      const arrayBuffer = await pdf.file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const fileNameBase = pdf.file.name.replace(/\.[^/.]+$/, "");

      if (splitMode === 'individual') {
        const zip = new JSZip();
        
        for (let i = 0; i < pdf.pages; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
            newPdf.addPage(copiedPage);
            
            const pdfBytes = await newPdf.save();
            zip.file(`${fileNameBase}-page-${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${fileNameBase}-pages.zip`);
        
      } else if (splitMode === 'range') {
        // Parse range string
        const parsedIndices = parsePageRange(rangeStr, pdf.pages);
        if (parsedIndices.length === 0) {
            setErrorDesc('无法解析页码范围，请检查格式是否正确且在总页数内（例如: 1-5, 8）');
            setIsProcessing(false);
            return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(originalPdf, parsedIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `${fileNameBase}-extracted.pdf`);
      }
      
      setIsFinished(true);
    } catch (e) {
      console.error(e);
      setErrorDesc('拆分失败，请确保您上传的 PDF 未加密。');
    } finally {
      setIsProcessing(false);
    }
  };

  // Parses strings like "1-5, 8, 11-13" into zero-based indices
  const parsePageRange = (rangeString: string, maxPages: number): number[] => {
      const indices: Set<number> = new Set();
      const parts = rangeString.split(',').map(s => s.trim()).filter(s => s);
      
      for (const part of parts) {
          if (part.includes('-')) {
              const [startStr, endStr] = part.split('-');
              let start = parseInt(startStr, 10);
              let end = parseInt(endStr, 10);
              if (!isNaN(start) && !isNaN(end)) {
                  // Ensure start is less than end for iteration
                  if (start > end) {
                      const temp = start;
                      start = end;
                      end = temp;
                  }
                  for (let i = start; i <= end; i++) {
                      if (i >= 1 && i <= maxPages) indices.add(i - 1);
                  }
              }
          } else {
              const pageNum = parseInt(part, 10);
              if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
                  indices.add(pageNum - 1);
              }
          }
      }
      return Array.from(indices).sort((a,b) => a - b);
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
    handleFileUpload(e);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Columns className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">PDF 拆分 & 提取</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              从 PDF 中单独提取您需要的页面，或将一个大的文件按页切分成多份。离线纯前端解析，安全无忧。
            </p>
          </div>
        </div>
      </div>

      {!pdf ? (
         <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-16 flex flex-col items-center">
            <div
               onDragOver={onDragOver}
               onDragLeave={onDragLeave}
               onDrop={onDrop}
               className={`w-full max-w-2xl border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-colors ${
                   isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
               }`}
            >
               <input
                   type="file"
                   ref={fileInputRef}
                   className="hidden"
                   accept=".pdf"
                   onChange={handleFileUpload}
               />
               <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 text-[#94a3b8]">
                   <Upload className="w-10 h-10" />
               </div>
               <p className="text-[#1e293b] font-medium text-xl mb-3">拖拽 PDF 文件至此处</p>
               <button
                   onClick={() => fileInputRef.current?.click()}
                   className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
               >
                   选择 PDF 文档
               </button>
            </div>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
             
             {/* Left Column: File Info & Settings */}
             <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* File Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex-1 flex flex-col justify-center">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-[#1e293b] text-lg">待处理的源文档</h3>
                     <button 
                        onClick={removeFile}
                        className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="border border-indigo-100 rounded-xl p-5 flex items-center gap-5 bg-indigo-50/30">
                      <div className="w-14 h-14 bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                         <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-slate-800 text-lg truncate mb-1" title={pdf.file.name}>
                          {pdf.file.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                           <span className="bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm font-mono font-medium text-slate-700">
                             共 {pdf.pages} 页
                           </span>
                           <span>•</span>
                           <span>{(pdf.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="mt-8 bg-blue-50/50 border border-blue-100/50 rounded-xl p-4">
                     <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm mb-1">提取每一页</h4>
                          <p className="text-xs text-blue-800/80 leading-relaxed">
                            此工具将把您的 PDF 文档按页彻底粉碎，拆分成每页独立的小文件。最终将把所有结果无损打包成一个 <span className="font-mono font-bold bg-white/50 px-1 rounded">.ZIP</span> 压缩包为您下载，全程在浏览器内完成。
                          </p>
                        </div>
                     </div>
                   </div>
                </div>

                {errorDesc && (
                    <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium text-sm">
                       {errorDesc}
                    </div>
                )}
             </div>

             {/* Right Column: Execution */}
             <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 text-white relative overflow-hidden flex flex-col flex-1 h-full min-h-[400px]">
                   <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/30 blur-3xl rounded-full"></div>
                   
                   <h3 className="font-bold text-2xl mb-2 relative z-10">准备就绪</h3>
                   <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed">
                      所有转换逻辑都在您的浏览器引擎中闭环计算。请确认文档无误后一键导出。
                   </p>

                   <div className="flex-1"></div>

                   {isFinished ? (
                      <div className="bg-emerald-500/20 text-emerald-400 px-6 py-5 rounded-xl border border-emerald-500/30 flex flex-col items-center gap-3 relative z-10">
                         <CheckCircle2 className="w-10 h-10 mb-1" />
                         <span className="font-bold text-lg">处理成功并已下载</span>
                         <span className="text-xs opacity-80 text-center">可前往浏览器的下载目录中查看结果。或点击下方按钮重新开始。</span>
                         <button 
                           onClick={removeFile}
                           className="mt-2 w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/40 rounded-lg text-emerald-300 text-sm font-medium transition-colors"
                         >
                           处理下一个文件
                         </button>
                      </div>
                    ) : (
                       <button
                         onClick={processSplit}
                         disabled={isProcessing}
                         className="w-full py-5 px-6 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all relative z-10 bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-500"
                       >
                         {isProcessing ? (
                           <span className="flex items-center gap-2">
                              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                              正在为您拆解并打包...
                           </span>
                         ) : (
                           <>
                             <span className="flex items-center gap-2 text-lg">
                               马上提取 <ChevronRight className="w-5 h-5" />
                             </span>
                             <span className="text-[12px] opacity-70 font-normal">
                               生成并下载 ZIP 压缩包
                             </span>
                           </>
                         )}
                       </button>
                    )}
                </div>
             </div>
          </div>
      )}

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 PDF 批量拆分工具，安全高效的办公利器</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          PDF 在线拆分器是一款专为现代办公场景打造的实用辅助工具。当您面对一份包含几十甚至数百页的庞大 PDF 报告、扫描件或合集档案，却只想要从中独立摘出每一页分发给不同部门时，本工具正是为您量身定做。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            本站坚持纯本地浏览器级运算，所有的 PDF 拆解动作均直接在您的设备内存中流转，坚决不上传任何私密财务报表、合同或隐私文档到云端服务器。您在断网环境下亦能顺畅使用该页面。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么选择我们的纯前端拆分引擎？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 无需安装臃肿软件：</strong>
            <span>告别传统老旧软件那繁琐的安装包。基于浏览器原生引擎，兼顾了“随时点开就用”的网络便利性，同时也没有了网络上传统上传工具极易出现的“上传慢、有体积限制、隐私泄漏”等弊端。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 自动化 ZIP 打包归档：</strong>
            <span>您不需要一页一页去疯狂点击下载。拆分完成后，引擎会自动将成百上千张分离后的 PDF 合成为一个标准 ZIP 文件盒，并一次性推送到您的本地。解压即得所有单页文件。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 卓越的全景兼容性：</strong>
            <span>只要设备具备现代化的浏览器，便能打破 Windows、macOS 甚至是移动端手机和平板的生态隔离。不论您的源 PDF 结构多复杂，皆能稳健按页拆解。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          简而言之，合理利用 PDF 本地处理工具，不仅将极大节约您的数字内容整理时间，更是确保数据绝对留存在本地的必备之选。
        </p>
      </div>

    </div>
  );
}
