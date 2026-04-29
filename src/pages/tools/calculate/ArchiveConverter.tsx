import { useState, useRef } from 'react';
import { Archive, UploadCloud, Download, X } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

interface FileItem {
  name: string;
  size: number;
  content: File | Blob;
}

export default function ArchiveConverter() {
  const { t } = useTranslation();
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
      alert(t('archive-converter.errors.parseError'));
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('archive-converter.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('archive-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-stretch gap-8">
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
             {isProcessing ? t('tools.archive-converter.processingMsg') : t('tools.archive-converter.dropLabel')}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto italic">
            {t('tools.archive-converter.dropDesc')}
          </p>
        </div>

        {files.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-[#1e293b]">
                 {t('tools.archive-converter.queueTitle', { count: files.length })}
               </h3>
               <div className="flex gap-3">
                 <button onClick={clearAll} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                   {t('tools.archive-converter.clearAll')}
                 </button>
                 <button 
                   onClick={generateZip}
                   disabled={isProcessing}
                   className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-sky-100"
                 >
                   <Download className="w-4 h-4" /> {t('tools.archive-converter.bundleBtn')}
                 </button>
               </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
               <ul className="divide-y divide-slate-200 text-slate-700">
                 {files.map((file, index) => (
                   <li key={index} className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden pr-4">
                        <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm shrink-0">
                          <Archive className="w-4 h-4 text-sky-500" />
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className="font-medium text-sm truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                            {formatSize(file.size)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                           onClick={() => downloadSingle(file)}
                           className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                           title={t('tools.archive-converter.extractSingle')}
                         >
                            <Download className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => removeFile(index)}
                           className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                           title={t('tools.archive-converter.removeFile')}
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

      {/* SEO Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.archive-converter.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          {t('tools.archive-converter.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-6">{t('tools.archive-converter.whyTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">{t('tools.archive-converter.highlight1Title')}</h4>
              <p className="text-slate-500 leading-relaxed">{t('tools.archive-converter.highlight1Desc')}</p>
           </div>
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">{t('tools.archive-converter.highlight2Title')}</h4>
              <p className="text-slate-500 leading-relaxed">{t('tools.archive-converter.highlight2Desc')}</p>
           </div>
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">{t('tools.archive-converter.highlight3Title')}</h4>
              <p className="text-slate-500 leading-relaxed">{t('tools.archive-converter.highlight3Desc')}</p>
           </div>
        </div>
        
        <p className="text-slate-400 text-[11px] mt-12 pt-8 border-t border-slate-100 text-center uppercase font-bold tracking-widest">
          {t('tools.archive-converter.seoFooter')}
        </p>
      </div>
    </div>
  );
}
