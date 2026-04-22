import { useState, useRef } from 'react';
import { Archive, UploadCloud, Download, FileJson, X, Settings } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FileItem {
  name: string;
  size: number;
  content: File | Blob;
}

export default function ArchiveConverter() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      await processUploadedFiles(Array.from(event.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processUploadedFiles = async (uploadedFiles: File[]) => {
    setIsProcessing(true);
    try {
      const newFiles: FileItem[] = [];

      for (const file of uploadedFiles) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          // Extract zip and add its contents to the list
          const zip = new JSZip();
          const contents = await zip.loadAsync(file);
          
          for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
            if (!zipEntry.dir) { // Skip directories
              const blob = await zipEntry.async('blob');
              newFiles.push({
                name: relativePath,
                size: blob.size,
                content: blob
              });
            }
          }
        } else {
          // Regular file
          newFiles.push({
            name: file.name,
            size: file.size,
            content: file
          });
        }
      }

      setFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Error processing files', error);
      alert('解析文件出错，请确保 ZIP 文件未损坏且格式受支持。');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const downloadSingle = (file: FileItem) => {
    saveAs(file.content, file.name.split('/').pop() || 'download');
  };

  const generateZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.name, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `archive_${Date.now()}.zip`);
    } catch (error) {
       console.error('Error creating zip', error);
       alert('生成 ZIP 失败。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">格式与在线存档处理器</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在线解压分析 ZIP 文件并提取内置项目，或多文件打包下载。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50'
          } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-6">
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-sky-500' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
             {isProcessing ? '正在处理打包分析...' : '拖拽任意文件或 ZIP 压缩包至此处'}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            纯前端解析：我们可以提取并罗列出 ZIP 中的所有文件内容，并且支持为您合并重组为全新包裹。
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-[#1e293b]">
                 队列列表 ({files.length})
               </h3>
               <div className="flex gap-3">
                 <button onClick={clearAll} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                   清空队列
                 </button>
                 <button 
                   onClick={generateZip}
                   disabled={isProcessing}
                   className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   <Download className="w-4 h-4" /> 包装为 ZIP
                 </button>
               </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
               <ul className="divide-y divide-slate-200">
                 {files.map((file, index) => (
                   <li key={index} className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors group">
                      <div className="flex flex-col gap-1 overflow-hidden pr-4">
                        <span className="font-medium text-slate-700 text-sm truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {formatSize(file.size)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                           onClick={() => downloadSingle(file)}
                           className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                           title="单独提取下载"
                         >
                            <Download className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => removeFile(index)}
                           className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                           title="从队列移除"
                         >
                            <X className="w-4 h-4" />
                         </button>
                      </div>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线存档解析合成工具，免装客户端的封包站</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当您接收到某个客户或者运营人员传来的 ZIP 压缩包时，传统操作需要您繁琐地下载第三方解压缩软件，不但容易被植入广告全家桶，而且还会产生大量的临时缓存废料文件占用硬盘空间。在这里，这一切重装阵列都能通过您的浏览器无缝解决。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握无痕解压缩与装配的三张王牌：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 即用即拆的透明可视化：</strong>
            <span>只要您将一份受支持格式的 ZIP （未来随着底层库会适配更多流）丢进拖拽上传框里，底层的沙盒脚本会马上把压缩包划开。您可以一眼全览里面的多层级列表页项，只挑挑拣拣把心怡的内部图文或者单体文件提取下载，不必再解压全部无用废料。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 自定义拼接再次组合打包：</strong>
            <span>除了具备“拆解”的能力之外，由于文件已经载入您的内存画布里，您可以自己再传进来一些本地的素材资料或者修改列表内的文件分布，点击右上方的按钮，轻松秒间就能拼装成一个完全归属于您的新压缩包邮寄给他人。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 基于本地内存的静默安全域：</strong>
            <span>您的源代码备份包或者装满了机密证件、商业发票的档案箱是极其隐私的。此封包机器建立在纯 JavaScript 沙盘算法上，在浏览器加载完成并断网后依然可以运作，百分之百杜绝敏感材料的云盘留底与监听侧漏泄露。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          容量限制提示：因为此解压缩封包站是运行挂载在您的本地浏览器标签页内存堆条中进行，因此受制于移动端与桌面端的性能隔离，它更适合处理 1~2 GB 量级以下的文件包。超级蓝光母盘等超巨集档案还是建议使用传统系统工具挂载。
        </p>
      </div>
    </div>
  );
}
