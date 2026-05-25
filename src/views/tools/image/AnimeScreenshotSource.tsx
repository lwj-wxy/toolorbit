import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';
import { analytics } from '../../../services/analytics';

type SourceResult = {
  id: string;
  similarity: number;
  thumbnail?: string;
  sourceName: string;
  title: string;
  author?: string;
  urls: string[];
  indexName?: string;
};

type SearchResponse = {
  success?: boolean;
  results?: SourceResult[];
  message?: string;
  shortRemaining?: number;
  longRemaining?: number;
};

const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export default function AnimeScreenshotSource() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [results, setResults] = useState<SourceResult[]>([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const unit = 1024;
    const sizeLabels = ['B', 'KB', 'MB'];
    const sizeIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(unit)), sizeLabels.length - 1);
    return `${parseFloat((bytes / Math.pow(unit, sizeIndex)).toFixed(2))} ${sizeLabels[sizeIndex]}`;
  };

  const fileExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || '';

  const validateFile = (selectedFile: File) => {
    const extension = fileExtension(selectedFile.name);
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      return t('tools.anime-screenshot-source.errorUnsupported');
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return t('tools.anime-screenshot-source.errorTooLarge');
    }

    return '';
  };

  const loadImageFile = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError('');
    setResults([]);
    setHasSearched(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      loadImageFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      loadImageFile(droppedFile);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setResults([]);
    setError('');
    setHasSearched(false);
    setCopiedUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const errorMessageFor = (responseData: SearchResponse) => {
    return responseData.message || t('tools.anime-screenshot-source.errorSearchFailed');
  };

  const searchSource = async () => {
    if (!file) return;

    setIsSearching(true);
    setError('');
    setHasSearched(false);
    setResults([]);

    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Anime Source Search',
      label: file.type || fileExtension(file.name),
      metadata: { fileSize: file.size },
    });

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/anime-screenshot-source', {
        method: 'POST',
        body: formData,
      });

      const responseData = (await response.json().catch(() => ({}))) as SearchResponse;
      if (!response.ok || !responseData.success) {
        throw new Error(errorMessageFor(responseData));
      }

      setResults(responseData.results || []);
      setHasSearched(true);
    } catch (searchError: any) {
      setError(searchError.message || t('tools.anime-screenshot-source.errorSearchFailed'));
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    window.setTimeout(() => setCopiedUrl(''), 1600);
  };

  const primaryLinkFor = (result: SourceResult) => result.urls[0] || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.anime-screenshot-source.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.anime-screenshot-source.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {file ? t('tools.anime-screenshot-source.previewTitle') : t('tools.anime-screenshot-source.dropLabel')}
            </label>
            {file ? (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('tools.anime-screenshot-source.clearBtn')}
              </button>
            ) : null}
          </div>

          <div
            className={cn(
              'h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#282c34]',
              isDragging && 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20',
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center px-8 text-center transition-colors hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <UploadCloud className="h-6 w-6" />
                </span>
                <span className="text-base font-semibold text-slate-950 dark:text-white">
                  {t('tools.anime-screenshot-source.dropLabel')}
                </span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t('tools.anime-screenshot-source.dropDesc')}
                </span>
                <span className="mt-6 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
                  {t('tools.anime-screenshot-source.selectBtn')}
                </span>
              </button>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                  <span className="truncate font-semibold text-slate-900 dark:text-slate-100" title={file.name}>
                    {file.name}
                  </span>
                  <span className="ml-4 shrink-0 text-slate-500 dark:text-slate-400">{formatSize(file.size)}</span>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-5 dark:bg-slate-900">
                  {previewUrl ? (
                    <img src={previewUrl} className="max-h-full max-w-full object-contain" alt={file.name} />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>
            )}
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.anime-screenshot-source.resultsTitle')}
          </label>

          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {t('tools.anime-screenshot-source.engineLabel')}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {t('tools.anime-screenshot-source.engineDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={searchSource}
                disabled={!file || isSearching}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isSearching ? t('tools.anime-screenshot-source.searchingBtn') : t('tools.anime-screenshot-source.searchBtn')}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {!file ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t('tools.anime-screenshot-source.emptyTitle')}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('tools.anime-screenshot-source.emptyDesc')}
                  </p>
                </div>
              ) : isSearching ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-cyan-600 dark:text-cyan-300" />
                  <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t('tools.anime-screenshot-source.searchingTitle')}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('tools.anime-screenshot-source.searchingDesc')}
                  </p>
                </div>
              ) : hasSearched && results.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                  <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t('tools.anime-screenshot-source.noResultTitle')}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('tools.anime-screenshot-source.noResultDesc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, resultIndex) => {
                    const primaryUrl = primaryLinkFor(result);
                    return (
                      <article
                        key={result.id}
                        className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]"
                      >
                        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                          {result.thumbnail ? (
                            <img src={result.thumbnail} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200">
                              {t('tools.anime-screenshot-source.matchRank', { rank: resultIndex + 1 })}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {result.similarity.toFixed(2)}%
                            </span>
                          </div>

                          <h2 className="mt-2 truncate text-sm font-semibold text-slate-950 dark:text-white" title={result.title}>
                            {result.title}
                          </h2>
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {result.author || result.indexName || t('tools.anime-screenshot-source.unknownAuthor')}
                          </p>

                          {primaryUrl ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={primaryUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-200"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t('tools.anime-screenshot-source.openLinkBtn')}
                              </a>
                              <button
                                type="button"
                                onClick={() => void copyUrl(primaryUrl)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                {copiedUrl === primaryUrl ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                {copiedUrl === primaryUrl
                                  ? t('tools.anime-screenshot-source.copiedBtn')
                                  : t('tools.anime-screenshot-source.copyLinkBtn')}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="anime-screenshot-source" />
    </div>
  );
}
