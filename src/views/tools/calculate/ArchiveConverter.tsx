import { useState, useRef } from 'react';
import { Archive, UploadCloud, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    analytics.trackEvent({
      category: 'Archive Tools',
      action: 'Upload Files',
      value: uploadedFiles.length
    });

    try {
      const { default: JSZip } = await import('jszip');
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
          analytics.trackEvent({
            category: 'Archive Tools',
            action: 'Extract ZIP',
            label: file.name
          });
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
      alert(t('tools.archive-converter.errors.parseError'));
      analytics.trackEvent({
        category: 'Archive Tools',
        action: 'Process Error',
        label: error instanceof Error ? error.message : 'Unknown'
      });
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

  const downloadSingle = async (file: FileItem) => {
    analytics.trackEvent({
      category: 'Archive Tools',
      action: 'Download Single File',
      label: file.name
    });
    const { saveAs } = await import('file-saver');
    saveAs(file.content, file.name.split('/').pop() || 'download');
  };

  const generateZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    analytics.trackEvent({
      category: 'Archive Tools',
      action: 'Generate ZIP Start',
      value: files.length
    });

    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import('jszip'),
        import('file-saver'),
      ]);
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.name, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `archive_${Date.now()}.zip`);

      analytics.trackEvent({
        category: 'Archive Tools',
        action: 'Generate ZIP Success',
        metadata: { fileCount: files.length, totalSize: blob.size }
      });
    } catch (error) {
       console.error('Error creating zip', error);
       analytics.trackEvent({
         category: 'Archive Tools',
         action: 'Generate ZIP Error',
         label: error instanceof Error ? error.message : 'Unknown'
       });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.archive-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.archive-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {files.length > 0 ? t('tools.archive-converter.queueTitle', { count: files.length }) : t('tools.archive-converter.dropLabel')}
          </label>
          <div
            onClick={() => !isProcessing && files.length === 0 && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34] ${
              isDragging ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20' : ''
            } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            {files.length === 0 ? (
              <button
                type="button"
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <UploadCloud className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">
                  {isProcessing ? t('tools.archive-converter.processingMsg') : t('tools.archive-converter.dropLabel')}
                </span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t('tools.archive-converter.dropDesc')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="min-h-0 flex-1 divide-y divide-slate-200 overflow-y-auto dark:divide-slate-700">
                  {files.map((file, index) => (
                    <div key={index} className="group flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                      <div className="flex min-w-0 items-center gap-3 pr-4">
                        <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-[#282c34]">
                          <Archive className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100" title={file.name}>
                            {file.name}
                          </span>
                          <span className="font-mono text-[10px] font-semibold uppercase text-slate-400">
                            {formatSize(file.size)}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => downloadSingle(file)}
                          className="rounded-md p-1.5 text-cyan-600 transition-colors hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/20"
                          title={t('tools.archive-converter.extractSingle')}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                          title={t('tools.archive-converter.removeFile')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 border-t border-slate-200 p-4 font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 dark:border-slate-700 dark:text-cyan-300 dark:hover:bg-cyan-950/20"
                >
                  <UploadCloud className="h-5 w-5" />
                  {t('tools.archive-converter.dropLabel')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.archive-converter.bundleBtn')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-200 py-3 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">{t('tools.archive-converter.queueTitle', { count: files.length })}</span>
                <span className="font-semibold text-slate-950 dark:text-white">{files.length}</span>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={generateZip}
                disabled={files.length === 0 || isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                {isProcessing ? t('tools.archive-converter.processingMsg') : t('tools.archive-converter.bundleBtn')}
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={files.length === 0 || isProcessing}
                className="flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t('tools.archive-converter.clearAll')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="archive-converter" />
    </div>
  );
}
