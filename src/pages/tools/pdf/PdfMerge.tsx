import React, { useState, useRef } from 'react';
import { Upload, Files, Trash2, ArrowUp, ArrowDown, Download, CheckCircle2, FileText, Plus, GripVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

interface LoadedPdf {
  id: string;
  file: File;
  pages: number;
}

export default function PdfMerge() {
  const [pdfs, setPdfs] = useState<LoadedPdf[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorDesc, setErrorDesc] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    setErrorDesc('');
    setIsFinished(false);
    
    let files: File[] = [];
    if ('dataTransfer' in event) {
      files = Array.from(event.dataTransfer.files);
    } else if (event.target.files) {
      files = Array.from(event.target.files);
    }
    
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      if (files.length > 0) setErrorDesc('只支持上传 PDF 文件');
      return;
    }

    const newPdfs: LoadedPdf[] = [];
    
    for (const file of pdfFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        newPdfs.push({
           id: Math.random().toString(36).substring(7),
           file,
           pages: pdfDoc.getPageCount()
        });
      } catch (e) {
        console.error("Error reading PDF", e);
        setErrorDesc(`文件 ${file.name} 解析失败，可能已加密或已损坏`);
      }
    }

    setPdfs(prev => [...prev, ...newPdfs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
    setIsFinished(false);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStartItem = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropItem = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setPdfs(prev => {
      const copy = [...prev];
      const itemsToMove = copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, itemsToMove[0]);
      return copy;
    });
    setDraggedIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === pdfs.length - 1)
    ) return;

    const newItems = [...pdfs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    setPdfs(newItems);
    setIsFinished(false);
  };

  const processMerge = async () => {
    if (pdfs.length < 2) return;
    
    setIsProcessing(true);
    setErrorDesc('');
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfItem of pdfs) {
        const arrayBuffer = await pdfItem.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged-document.pdf');
      
      setIsFinished(true);
    } catch (e) {
      console.error(e);
      setErrorDesc('合并失败，请确保您上传的 PDF 未加密且未损坏。');
    } finally {
      setIsProcessing(false);
    }
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
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">PDF 合并</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              免费、快速、安全地将多个 PDF 文件拼接合并为一个文件。完全在浏览器本地处理，数据不上传。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         <div className="lg:col-span-8 flex flex-col gap-6">
             {/* Upload File Area */}
             <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-colors ${
                    isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'bg-white border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
                }`}
             >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                />
                <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 text-[#94a3b8]">
                    <Upload className="w-10 h-10" />
                </div>
                <p className="text-[#1e293b] font-medium text-xl mb-3">拖拽多个 PDF 文件至此处</p>
                <p className="text-[#64748b] text-sm text-center mb-8">
                    支持批量选择。合并将在您的浏览器中本地瞬间完成。
                </p>
                <div className="flex gap-4">
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                      选择 PDF 文件
                  </button>
                </div>
             </div>

             {/* Error prompt */}
             {errorDesc && (
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium text-sm">
                   {errorDesc}
                </div>
             )}

             {/* File List */}
             {pdfs.length > 0 && (
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-[#1e293b] text-lg mb-4 flex justify-between items-center">
                    <span>文件列表排序 ({pdfs.length})</span>
                    <button 
                       onClick={() => setPdfs([])}
                       className="text-[#64748b] hover:text-red-500 text-sm font-medium transition-colors"
                    >
                       清空全部
                    </button>
                  </h3>
                  <div className="space-y-3">
                     {pdfs.map((item, index) => (
                        <div 
                          key={item.id} 
                          draggable
                          onDragStart={(e) => handleDragStartItem(e, index)}
                          onDragOver={(e) => handleDragOverItem(e, index)}
                          onDrop={(e) => handleDropItem(e, index)}
                          onDragEnd={() => setDraggedIndex(null)}
                          className={`group border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                            draggedIndex === index ? 'opacity-50 border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-blue-50/30'
                          }`}
                        >
                           <div className="cursor-move text-slate-400 hover:text-blue-500 transition-colors">
                              <GripVertical className="w-5 h-5" />
                           </div>
                           <div className="flex flex-col gap-1 items-center justify-center text-slate-400 border-l pl-4 border-slate-200">
                             <button
                               onClick={() => moveItem(index, 'up')}
                               disabled={index === 0}
                               className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1"
                             >
                                <ArrowUp className="w-4 h-4" />
                             </button>
                             <span className="text-xs font-bold font-mono">{index + 1}</span>
                             <button
                               onClick={() => moveItem(index, 'down')}
                               disabled={index === pdfs.length - 1}
                               className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1"
                             >
                                <ArrowDown className="w-4 h-4" />
                             </button>
                           </div>
                           
                           <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                           </div>

                           <div className="flex-1 overflow-hidden">
                             <h4 className="font-medium text-slate-800 truncate text-sm" title={item.file.name}>
                               {item.file.name}
                             </h4>
                             <p className="text-xs text-slate-500 mt-1">
                               {item.pages} 页 • {(item.file.size / 1024 / 1024).toFixed(2)} MB
                             </p>
                           </div>

                           <button
                             onClick={() => removeFile(item.id)}
                             className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     ))}
                     
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                     >
                        <Plus className="w-5 h-5" /> <span>添加更多 PDF 文件</span>
                     </div>
                  </div>
                </div>
             )}
         </div>

         {/* Right Sidebar: Merge Options & Trigger */}
         <div className="lg:col-span-4 self-start sticky top-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                   <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
                   合并设置与导出
                </h3>

                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">总文件数</span>
                        <span className="font-bold text-slate-800">{pdfs.length} 个</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">预估总合并页数</span>
                        <span className="font-bold text-slate-800">{pdfs.reduce((acc, curr) => acc + curr.pages, 0)} 页</span>
                     </div>
                     <div className="text-xs text-slate-400 mt-2 border-t pt-2">
                        您可以直接在左侧拖拽小箭头调整文件合并时的首尾顺序。
                     </div>
                   </div>

                   {isFinished ? (
                      <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                         <CheckCircle2 className="w-6 h-6 shrink-0" />
                         <span className="font-medium">合并成功！文件已自动下载</span>
                      </div>
                    ) : (
                       <button
                         onClick={processMerge}
                         disabled={pdfs.length < 2 || isProcessing}
                         className={`w-full py-4 px-6 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                           pdfs.length < 2
                             ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                             : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                         }`}
                       >
                         {isProcessing ? (
                           <span className="flex items-center gap-2">
                              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                              正在组合页面...
                           </span>
                         ) : (
                           <>
                             <span className="flex items-center gap-2 text-lg">
                               <Download className="w-5 h-5" />
                               合并并下载
                             </span>
                             <span className="text-[11px] opacity-80 font-normal">离线极速处理 • 生成单文件</span>
                           </>
                         )}
                       </button>
                    )}
                </div>
            </div>
         </div>
      </div>
    
      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 PDF 批量合并工具，一键无损拼合文档</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          PDF 在线合并器是一款专业的文件整理工具。当您需要将多份独立的 PDF 报告、发票、合同或作品集整合成一个完整的文档以便于阅读、打印或集中发送时，本工具正是您的不二之选。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            本站坚持纯本地浏览器级运算，所有的 PDF 合并动作均直接在您的设备内存中流转，坚决不上传任何私密发票、合同或涉密作品到云端服务器。您在断网环境下亦能顺畅使用该页面，100% 绝对保护您的数据隐私。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么选择我们的纯前端合并引擎？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 纯本地极速处理：</strong>
            <span>无需将大体积的 PDF 文件缓慢上传至网络，所有合并逻辑均在您的电脑或手机浏览器本地即刻完成，大幅节省您的等待时间，真正兼顾了工具的便携与软件的高效。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 灵活丝滑的拖拽排序：</strong>
            <span>只需将所有需要处理的文件一次性拖入上方区域，随后您可以直观地通过鼠标拖拽或点击排序箭头，自由调整每个文档在最终合并文件中的先后呈现顺序，所见即所得。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 无损保留原始排版要素：</strong>
            <span>我们采用原生级别的文档对象重组技术，在文件拼合的过程中绝对不会改变原文件的页面排版、文本矢量字形、光栅分辨率或任何画质参数，保持与源文件一致的最高清晰度与完整性。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          简而言之，熟练掌握 PDF 本地合并组合工具，不仅能帮您轻松应对日常办公与学习中的繁杂资料汇总，让信息收集变得井井有条，更能让您无需再为文档隐私外泄而感到焦虑。
        </p>
      </div>

    </div>
  );
}
