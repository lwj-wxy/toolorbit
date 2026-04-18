import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Code2,
  Download,
  FileImage,
  Image as ImageIcon,
  RefreshCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  convertSvgTextToPng,
  createSvgPreviewUrl,
  formatBytes,
  getSvgMetadata,
  readFileAsText,
  SvgMetadata,
} from '../../lib/imageTools';

function parsePositiveNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}

export default function SvgToPng() {
  const [svgText, setSvgText] = useState('');
  const [sourceName, setSourceName] = useState('vector-image');
  const [svgPreviewUrl, setSvgPreviewUrl] = useState('');
  const [pngUrl, setPngUrl] = useState('');
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [sourceMeta, setSourceMeta] = useState<SvgMetadata | null>(null);
  const [outputWidth, setOutputWidth] = useState('');
  const [outputHeight, setOutputHeight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!svgText.trim()) {
      setSvgPreviewUrl('');
      setSourceMeta(null);
      return;
    }

    const metadata = getSvgMetadata(svgText);
    setSourceMeta(metadata);

    if (!metadata) {
      setSvgPreviewUrl('');
      return;
    }

    const previewUrl = createSvgPreviewUrl(svgText);
    setSvgPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [svgText]);

  useEffect(() => {
    if (!pngUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(pngUrl);
    };
  }, [pngUrl]);

  const resetOutput = () => {
    setPngBlob(null);
    setPngUrl('');
    setError('');
  };

  const applySvgSource = (text: string, nextSourceName?: string) => {
    setSvgText(text);
    setSourceName(nextSourceName ?? sourceName);
    resetOutput();

    const metadata = getSvgMetadata(text);
    if (metadata) {
      setOutputWidth(
        metadata.width
          ? String(Math.round(metadata.width))
          : metadata.viewBoxWidth
            ? String(Math.round(metadata.viewBoxWidth))
            : '',
      );
      setOutputHeight(
        metadata.height
          ? String(Math.round(metadata.height))
          : metadata.viewBoxHeight
            ? String(Math.round(metadata.viewBoxHeight))
            : '',
      );
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    await loadSvgFile(selectedFile);
  };

  const loadSvgFile = async (file: File) => {
    const isSvgFile = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    if (!isSvgFile) {
      setError('请上传 SVG 文件。');
      return;
    }

    try {
      const text = await readFileAsText(file);
      if (!getSvgMetadata(text)) {
        throw new Error('这个文件不是有效的 SVG。');
      }

      applySvgSource(text, file.name.replace(/\.svg$/i, ''));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'SVG 文件读取失败。');
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (!selectedFile) {
      return;
    }

    await loadSvgFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!svgText.trim()) {
      setError('请先上传 SVG 文件或粘贴 SVG 代码。');
      return;
    }

    const width = parsePositiveNumber(outputWidth);
    const height = parsePositiveNumber(outputHeight);

    if (outputWidth.trim() && !width) {
      setError('输出宽度请输入大于 0 的数字。');
      return;
    }

    if (outputHeight.trim() && !height) {
      setError('输出高度请输入大于 0 的数字。');
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      const result = await convertSvgTextToPng(svgText, { width, height });
      const resultUrl = URL.createObjectURL(result.blob);
      setPngBlob(result.blob);
      setPngUrl(resultUrl);
      setOutputWidth(String(result.width));
      setOutputHeight(String(result.height));
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : 'SVG 转 PNG 失败。');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pngUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${sourceName || 'vector-image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setSvgText('');
    setSvgPreviewUrl('');
    setPngUrl('');
    setPngBlob(null);
    setSourceMeta(null);
    setOutputWidth('');
    setOutputHeight('');
    setError('');
    setSourceName('vector-image');

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
              <FileImage className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">SVG 转 PNG</h1>
              <p className="text-[#64748b] mt-1 text-sm md:text-base">
                支持上传 SVG 文件或直接粘贴 SVG 代码，在浏览器本地完成渲染、缩放和导出。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/tools/png-to-svg"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              试试 PNG 转 SVG
            </Link>
            <Link
              to="/tools/image-converter"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#475569] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              通用图片转换
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 space-y-6">
          <div
            className={`rounded-2xl border-2 border-dashed transition-all p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer ${
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
              accept=".svg,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-5 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b] mb-2">拖拽 SVG 文件到这里</h2>
            <p className="text-[#64748b] mb-5">或点击选择本地 SVG 文件，自动载入代码并生成预览</p>
            <button className="bg-white border border-[#cbd5e1] text-[#0f172a] px-5 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择 SVG 文件
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#2563eb]" />
                SVG 代码
              </label>
              {sourceMeta && (
                <span className="text-xs font-medium text-[#64748b] bg-slate-100 px-2.5 py-1 rounded-md">
                  原始尺寸 {Math.round(sourceMeta.width ?? sourceMeta.viewBoxWidth ?? 0)} ×{' '}
                  {Math.round(sourceMeta.height ?? sourceMeta.viewBoxHeight ?? 0)}
                </span>
              )}
            </div>
            <textarea
              value={svgText}
              onChange={(event) => {
                setSvgText(event.target.value);
                resetOutput();
              }}
              placeholder="<svg>...</svg>"
              className="w-full min-h-[240px] rounded-2xl border border-[#cbd5e1] bg-white px-4 py-4 text-[14px] text-[#1e293b] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#475569] mb-2">输出宽度（可选）</label>
              <input
                type="number"
                min="1"
                value={outputWidth}
                onChange={(event) => setOutputWidth(event.target.value)}
                placeholder="例如 1024"
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#475569] mb-2">输出高度（可选）</label>
              <input
                type="number"
                min="1"
                value={outputHeight}
                onChange={(event) => setOutputHeight(event.target.value)}
                placeholder="例如 1024"
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="bg-[#10b981] hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.2)] flex items-center gap-2"
            >
              {isConverting ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  正在转换...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  转换为 PNG
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="bg-slate-100 hover:bg-slate-200 text-[#334155] px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              清空内容
            </button>

            {pngUrl && (
              <button
                onClick={handleDownload}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(37,99,235,0.2)] flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                下载 PNG
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e293b]">预览与结果</h2>
              {pngBlob && (
                <div className="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  转换成功
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm font-bold text-[#475569] mb-2">SVG 预览</div>
                <div className="aspect-[4/3] rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                  {svgPreviewUrl ? (
                    <img src={svgPreviewUrl} alt="SVG Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-sm text-[#94a3b8] px-6">
                      上传 SVG 文件或粘贴代码后，这里会显示矢量预览。
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#475569] mb-2">PNG 输出</div>
                <div className="aspect-[4/3] rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                  {pngUrl ? (
                    <img src={pngUrl} alt="PNG Result" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-sm text-[#94a3b8] px-6">
                      点击“转换为 PNG”后，这里会展示导出的位图结果。
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-[#64748b] mb-1">输出尺寸</div>
                <div className="font-bold text-[#1e293b]">
                  {outputWidth || '--'} × {outputHeight || '--'}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-[#64748b] mb-1">PNG 大小</div>
                <div className="font-bold text-[#1e293b]">{pngBlob ? formatBytes(pngBlob.size) : '--'}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-[15px] font-bold text-[#1e3a8a]">使用提示</h3>
            <p className="text-sm text-[#1d4ed8] leading-relaxed">
              宽高任意留空时，会自动按 SVG 原始比例补齐。整个转换过程都在本地浏览器里完成，不会上传服务器。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div className="prose max-w-none text-[14px] leading-loose text-[#475569]">
          <p className="mb-4">
            SVG 转 PNG 适合把图标、Logo、插画和前端矢量资源导出为位图，方便在电商主图、社媒封面、PPT 素材和旧平台兼容场景中直接使用。
          </p>
          <p className="mb-4">
            如果你的 SVG 来自设计稿或图标库，直接粘贴源码即可；如果需要更大的导出图，只要填写宽度或高度，工具会自动按比例生成目标 PNG。
          </p>
        </div>
      </div>
    </div>
  );
}
