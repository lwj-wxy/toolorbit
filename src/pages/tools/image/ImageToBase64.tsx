import React, { useState, useRef } from 'react';
import { Upload, FileCode2, Copy, Trash2, CheckCircle2, ArrowRight, ArrowRightLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [base64String, setBase64String] = useState<string>('');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedDataUrl, setCopiedDataUrl] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      } else {
        alert("请上传有效的图片文件！");
      }
    }
  };

  const processFile = (selectedFile: File) => {
    // Note: Don't restrict size drastically, but Base64 can freeze UI if it's > 5MB. 
    // Usually it's meant for icons. Let's process it, but warn if it's huge.
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setBase64String(event.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setBase64String('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const pureBase64 = base64String.split(',')[1] || '';

  const copyToClipboard = async (text: string, type: 'raw' | 'dataurl') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'raw') {
        setCopiedRaw(true);
        setTimeout(() => setCopiedRaw(false), 2000);
      } else {
        setCopiedDataUrl(true);
        setTimeout(() => setCopiedDataUrl(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">图片转 Base64 编码工具</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              将图片文件转换为 Base64 编码文本，常用于内联小图标以减少网页 HTTP 请求。
            </p>
          </div>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10">
        {!file ? (
          <div 
            className={`rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer
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
              className="hidden" 
            />
            <div className="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">点击选择图片文件</h3>
            <p className="text-[#64748b] mb-6">或将图片文件拖拽至此框内 (建议小于 2MB)</p>
            <button className="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择图片文件...
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                资源详情与转换结果
              </h3>
              <button 
                onClick={clearFile}
                className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />重新选择
              </button>
            </div>

            {file.size > 2 * 1024 * 1024 && (
               <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm mb-4">
                 <span className="font-bold">⚠️ 温馨提示：</span> 您的图片较大（{formatSize(file.size)}），生成的 Base64 字符会非常长，可能会造成浏览器卡顿或代码过度冗余。一般推荐仅对小图标（&lt; 50KB）使用 Base64。
               </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Preview Area (Left) */}
              <div className="w-full lg:w-[300px] shrink-0">
                <h4 className="text-sm font-bold text-[#64748b] mb-3 uppercase tracking-wider">选择的图片</h4>
                <div className="flex flex-col">
                  <div className="aspect-square bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRUVFIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHg9IjQiIHk9IjQiIGZpbGw9IiNFRUUiLz4KPC9zdmc+')] rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center mb-3">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0] space-y-1.5 text-[13px]">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">文件名</span>
                        <span className="font-bold text-slate-700 truncate w-[140px] text-right">{file.name}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">图片格式</span>
                        <span className="font-bold text-slate-700">{file.type}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500">原始体积</span>
                        <span className="font-bold text-slate-700">{formatSize(file.size)}</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Output Content Area (Right) */}
              <div className="flex-1 space-y-5">
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-[#64748b] uppercase tracking-wider">完整 Data URL (含前缀)</h4>
                    <button 
                      onClick={() => copyToClipboard(base64String, 'dataurl')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      {copiedDataUrl ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedDataUrl ? '已复制！可以直接放到 src 中' : '复制用于 <img> 标签'}
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={base64String}
                    className="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-[#64748b] uppercase tracking-wider">纯 Base64 文本 (无前缀)</h4>
                    <button 
                      onClick={() => copyToClipboard(pureBase64, 'raw')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      {copiedRaw ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedRaw ? '已复制！' : '复制为纯文本 API 传参'}
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={pureBase64}
                    className="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
                  />
                </div>

              </div>
            </div>
          </div>
        )}
        
        {/* Related Link matching user screenshot */}
        <div className="mt-8 bg-amber-50 rounded-xl p-4 text-center border border-amber-100 flex items-center justify-center gap-2">
          <span className="text-amber-800 text-sm">相关推荐：</span>
          <Link to="/tools/base64" className="text-amber-600 hover:text-amber-700 font-bold underline flex items-center gap-1 text-sm">
            Base64 编码与解码工具 <ArrowRightLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mb-8 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">图片转 Base64 工具，前端极客的编码利器</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          图片转 Base64 编码器专为前端开发者及 UI 设计师解决资源内联问题。通过将体积小巧的常用 Icon、SVG 素材甚至是小图背景转化为纯文本格式的 Data-URI 编码，您可以直接将其硬编码进 HTML 或 CSS 样式表之中，减少网络阻塞，优化网站的首屏渲染。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            安全快速的本地转换保障机制：您通过该页面选择的一切文件，最终都在本地 FileReader API 中读取并转换为 Base64 串，整个过程不会向我们的服务器发出哪怕 1 Byte 的上传请求，绝密图像安全无忧。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">使用 Base64 进行小图硬编码的绝佳优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 减少网络请求 (HTTP Requests)：</strong>
            <span>将小图标转换为字符串直接写入页面，能立刻省去建立多次独立图片连接的握手开销。这对于网络环境不佳或是请求数量被严格限制的应用场景而言，简直是首选优化手段。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 防止外部图片盗链或死链失效：</strong>
            <span>由于图片资源已经彻底字符化并寄生在你的核心骨架文件中，它便再也不会遭遇到图片储存桶欠费被删、路径写错出现 404 碎图的尴尬景象，代码在则图片在。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 支持代码区块直接复制应用：</strong>
            <span>我们在工具界面中不仅为您提供了原生的 Base64 输出，还贴心地提供了应用于 CSS url() 包裹格式，以及 HTML img src 标签的两键复制模板，大大减轻了复制粘贴二次加工的烦恼。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          合理评估“图片外链”与“Base64内联”的体积临界点，是每个站长必经的性能考量之路。我们建议对小于 10KB 左右的 UI 层级点缀图像使用本工具。
        </p>
      </div>

    </div>
  );
}
