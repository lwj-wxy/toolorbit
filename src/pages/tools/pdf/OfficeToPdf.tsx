import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, CheckCircle2, FileSpreadsheet, Presentation, CloudCog, AlertCircle } from 'lucide-react';

export default function OfficeToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-10 h-10 text-blue-600" />;
    if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="w-10 h-10 text-green-600" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <Presentation className="w-10 h-10 text-orange-500" />;
    return <FileText className="w-10 h-10 text-slate-500" />;
  };

  const getFormatName = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['doc', 'docx'].includes(ext || '')) return 'Word 文档';
    if (['xls', 'xlsx'].includes(ext || '')) return 'Excel 表格';
    if (['ppt', 'pptx'].includes(ext || '')) return 'PowerPoint 演示文稿';
    return 'Office 文档';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileSelection(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  const processFileSelection = (selectedFile: File) => {
    const validExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
    if (validExtensions.includes(ext)) {
      setFile(selectedFile);
      setIsFinished(false);
    } else {
      alert("请上传有效的 Word、Excel 或 PowerPoint 文件！支持格式: .doc, .docx, .xls, .xlsx, .ppt, .pptx");
    }
  };

  const clearFile = () => {
    setFile(null);
    setIsUploading(false);
    setIsProcessing(false);
    setIsFinished(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const simulateConversion = () => {
    if (!file) return;
    
    // Simulate Upload phase
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      // Simulate Processing phase
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
      }, 3000); // 3 seconds server processing emulation
      
    }, 1500); // 1.5 seconds upload emulation
  };

  const handleDownload = () => {
    // In a real app, this would be the URL returned by your conversion APÏ
    alert("【开发提示】此为界面演示版本。真实环境中，由于 Office 排版引擎的复杂性，纯前端无法实现完美转换。您后续需要接入如 CloudConvert 等后端 API 来返回真实的 PDF 供用户下载。");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <CloudCog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">Office 文档转 PDF</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              将 Word、Excel、PPT 文件一键转换为 PDF 格式，保持原版排版。
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10">
        {!file ? (
          <div 
            className={`rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer
              ${isDragging ? 'border-indigo-600 bg-indigo-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx" 
              className="hidden" 
            />
            
            <div className="flex gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="w-7 h-7" />
              </div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm -mt-2">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <Presentation className="w-7 h-7" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#1e293b] mb-2">点击选择或拖入 Office 文件</h3>
            <p className="text-[#64748b] mb-6">支持扩展名: .docx, .xlsx, .pptx 等</p>
            <button className="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择文档变身 PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[360px] max-w-lg mx-auto w-full">
            
            {!isFinished && !isUploading && !isProcessing && (
              <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  {getFileIcon(file.name)}
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-1 truncate w-full max-w-[300px]" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-[#64748b] text-sm mb-6">
                  {getFormatName(file.name)} · {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <div className="flex w-full gap-3">
                  <button 
                    onClick={clearFile}
                    className="flex-1 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-colors"
                  >
                    取消重选
                  </button>
                  <button 
                    onClick={simulateConversion}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm"
                  >
                    开始云端转换
                  </button>
                </div>
              </div>
            )}

            {(isUploading || isProcessing) && (
              <div className="w-full flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="animate-spin text-indigo-600 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getFileIcon(file.name)}
                  </div>
                </div>
                <div className="space-y-1 mt-4">
                  <h3 className="text-xl font-bold text-[#1e293b]">
                    {isUploading ? '正在安全上传...' : '服务器排版解析中...'}
                  </h3>
                  <p className="text-[#64748b] text-sm">
                    {isUploading ? '正在将文档传输至云端处理中心引擎' : '正在调用云端 Office 引擎深度渲染 PDF...'}
                  </p>
                </div>
              </div>
            )}

            {isFinished && (
              <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center text-center mt-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">转换大功告成！</h3>
                <p className="text-emerald-600 text-sm mb-8">
                  文档已成功按照原样极高还原度转换为 PDF 格式。
                </p>

                <div className="flex w-full gap-3">
                  <button 
                    onClick={clearFile}
                    className="flex-1 bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 py-3.5 rounded-xl font-bold transition-colors"
                  >
                    转换其他文件
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(5,150,105,0.2)] flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    下载 PDF 文件
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Disclaimers & Info */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-[#e2e8f0] text-[14px]">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-2 text-[#475569] leading-relaxed">
            <p>
              <strong className="text-slate-800">关于文档在线转换的技术说明：</strong><br />
              与“图片压缩”或“PDF转图片”不同，Microsoft Office (Word、Excel、PPT) 格式使用的是专有且极其复杂的排版渲染引擎。
            </p>
            <p>
              目前技术层面 <strong className="text-blue-600">无法在纯浏览器前端完全精准地渲染 Word 或 PPT</strong>（大概率会出现跑版、字体丢失、错位等严重问题）。为了向您提供最精确保留原格式的 PDF 排版级转换，此工具需要将文档<strong>临时安全上传至后端的专属解析器 API 进行深度计算转换</strong>，转换完成后文件即刻销毁。
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
