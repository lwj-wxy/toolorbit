import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Download,
  Image as ImageIcon,
  RefreshCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  createSvgPreviewUrl,
  formatBytes,
  traceBitmapToSvg,
  type BitmapTraceResult,
} from '../../lib/imageTools';

const TRACE_RESOLUTION_OPTIONS = [64, 96, 128, 160];
const COLOR_LEVEL_OPTIONS = [
  { value: 2, label: '精简（约 8 色）' },
  { value: 3, label: '平衡（约 27 色）' },
  { value: 4, label: '细节（约 64 色）' },
];

export default function PngToSvg() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [svgUrl, setSvgUrl] = useState('');
  const [svgText, setSvgText] = useState('');
  const [traceResult, setTraceResult] = useState<BitmapTraceResult | null>(null);
  const [traceResolution, setTraceResolution] = useState(128);
  const [colorLevels, setColorLevels] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const traceJobRef = useRef(0);

  useEffect(() => {
    if (!originalUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  useEffect(() => {
    if (!svgUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(svgUrl);
    };
  }, [svgUrl]);

  useEffect(() => {
    if (!originalUrl) {
      return;
    }

    const timer = window.setTimeout(() => {
      void runTrace(originalUrl);
    }, 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [originalUrl, traceResolution, colorLevels]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  const loadFile = (selectedFile: File) => {
    const isPng = selectedFile.type === 'image/png' || selectedFile.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setError('请上传 PNG 图片。');
      return;
    }

    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setSvgText('');
    setSvgUrl('');
    setTraceResult(null);
    setError('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    loadFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (!selectedFile) {
      return;
    }

    loadFile(selectedFile);
  };

  const runTrace = async (source: string) => {
    const jobId = traceJobRef.current + 1;
    traceJobRef.current = jobId;
    setIsTracing(true);
    setError('');

    try {
      const result = await traceBitmapToSvg(source, {
        maxDimension: traceResolution,
        colorLevels,
      });

      if (jobId !== traceJobRef.current) {
        return;
      }

      const previewUrl = createSvgPreviewUrl(result.svgText);
      setTraceResult(result);
      setSvgText(result.svgText);
      setSvgUrl(previewUrl);
    } catch (traceError) {
      if (jobId !== traceJobRef.current) {
        return;
      }

      setError(traceError instanceof Error ? traceError.message : 'PNG 转 SVG 失败。');
    } finally {
      if (jobId === traceJobRef.current) {
        setIsTracing(false);
      }
    }
  };

  const handleDownload = () => {
    if (!svgText || !file) {
      return;
    }

    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${file.name.replace(/\.png$/i, '') || 'vectorized-image'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleCopy = async () => {
    if (!svgText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(svgText);
      setCopied(true);
    } catch {
      setError('复制 SVG 代码失败，请手动复制文本框内容。');
    }
  };

  const handleClear = () => {
    setFile(null);
    setOriginalUrl('');
    setSvgUrl('');
    setSvgText('');
    setTraceResult(null);
    setError('');
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">PNG 转 SVG</h1>
              <p className="text-[#64748b] mt-1 text-sm md:text-base">
                把 PNG 图片做成本地色块向量化 SVG，适合 Logo、图标、贴纸和扁平插画快速描摹。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/tools/svg-to-png"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              试试 SVG 转 PNG
            </Link>
            <Link
              to="/tools/image-compressor"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#475569] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              先压缩 PNG
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <div className="space-y-6">
          {!file ? (
            <div
              className={`bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer ${
                isDragging
                  ? 'border-[#2563eb] bg-blue-50/60'
                  : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50'
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,.png"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Upload className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-2">上传 PNG 图片开始描摹</h2>
              <p className="text-[#64748b] mb-6">
                工具会在浏览器中把位图重新抽象成 SVG 色块，更适合图标、Logo 和低复杂度图形。
              </p>
              <button className="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
                选择 PNG 图片
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1e293b]">描摹设置</h2>
                  <p className="text-sm text-[#64748b] mt-1">
                    参数越高，细节越多，导出的 SVG 也会更大。
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  重新选择
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">描摹分辨率</label>
                  <select
                    value={traceResolution}
                    onChange={(event) => setTraceResolution(Number(event.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    {TRACE_RESOLUTION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}px 网格
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">颜色层级</label>
                  <select
                    value={colorLevels}
                    onChange={(event) => setColorLevels(Number(event.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    {COLOR_LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="text-xs text-[#64748b] mb-1">源文件</div>
                  <div className="font-bold text-[#1e293b] truncate">{file.name}</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="text-xs text-[#64748b] mb-1">原图尺寸</div>
                  <div className="font-bold text-[#1e293b]">
                    {traceResult ? `${traceResult.originalWidth} × ${traceResult.originalHeight}` : '--'}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="text-xs text-[#64748b] mb-1">PNG 大小</div>
                  <div className="font-bold text-[#1e293b]">{formatBytes(file.size)}</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="text-xs text-[#64748b] mb-1">描摹网格</div>
                  <div className="font-bold text-[#1e293b]">
                    {traceResult ? `${traceResult.traceWidth} × ${traceResult.traceHeight}` : '--'}
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-sm text-amber-800 leading-relaxed">
                  这是“色块向量化”而不是 AI 细腻描线，最适合图标、Logo、贴纸和扁平图形。照片类素材会被转成海报化、拼块感更强的 SVG。
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e293b]">预览对比</h2>
              {svgText && !isTracing && (
                <div className="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  SVG 已生成
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-bold text-[#475569] mb-2">PNG 原图</div>
                <div className="aspect-square rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                  {originalUrl ? (
                    <img src={originalUrl} alt="PNG Source" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-sm text-[#94a3b8] px-6">上传 PNG 后显示预览</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#475569] mb-2">SVG 结果</div>
                <div className="aspect-square rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center relative">
                  {isTracing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <RefreshCcw className="w-7 h-7 text-[#2563eb] animate-spin mb-2" />
                      <span className="text-sm font-bold text-[#2563eb]">正在生成 SVG...</span>
                    </div>
                  )}

                  {svgUrl ? (
                    <img src={svgUrl} alt="SVG Result" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-sm text-[#94a3b8] px-6">生成后显示矢量预览</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-[#64748b] mb-1">主色数量</div>
                <div className="font-bold text-[#1e293b]">{traceResult?.colorCount ?? '--'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-[#64748b] mb-1">矢量片段</div>
                <div className="font-bold text-[#1e293b]">{traceResult?.segmentCount ?? '--'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-[#64748b] mb-1">输出类型</div>
                <div className="font-bold text-[#1e293b]">SVG 色块描摹</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={handleDownload}
                disabled={!svgText}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                下载 SVG
              </button>
              <button
                onClick={handleCopy}
                disabled={!svgText}
                className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-[#334155] px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? '已复制 SVG 代码' : '复制 SVG 代码'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-[#2563eb]" />
              <h2 className="text-lg font-bold text-[#1e293b]">SVG 代码</h2>
            </div>
            <textarea
              readOnly
              value={svgText}
              placeholder="生成后的 SVG 代码会显示在这里，方便复制到前端项目或设计工具中。"
              className="w-full min-h-[220px] rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-4 text-[13px] text-[#1e293b] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div className="prose max-w-none text-[14px] leading-loose text-[#475569]">
          <p className="mb-4">
            PNG 转 SVG 适合把位图图标重新整理成更容易缩放的矢量素材。描摹分辨率越高，越接近原图；颜色层级越高，色彩还原越充分，但文件也会更大。
          </p>
          <p className="mb-4">
            如果你处理的是电商贴纸、品牌 Logo、App 图标或海报上的扁平图形，这个工具会比直接放大 PNG 更适合后续排版与二次编辑。
          </p>
        </div>
      </div>
    </div>
  );
}
