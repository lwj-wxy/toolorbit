import { useState } from 'react';
import {
  Check,
  Copy,
  Fingerprint,
  RefreshCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

const MAX_UUID_COUNT = 500;

function createUuidV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

  throw new Error('当前浏览器不支持安全随机数生成，无法创建 UUID。');
}

export default function UuidGenerator() {
  const [countInput, setCountInput] = useState('1');
  const [stripHyphens, setStripHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<'all' | null>(null);
  const [error, setError] = useState('');

  const generatedText = uuids.join('\n');

  const generateUuids = () => {
    const count = Number(countInput);

    if (!Number.isInteger(count) || count <= 0) {
      setError('生成数量请输入大于 0 的整数。');
      return;
    }

    if (count > MAX_UUID_COUNT) {
      setError(`单次最多生成 ${MAX_UUID_COUNT} 个 UUID。`);
      return;
    }

    try {
      const nextUuids = Array.from({ length: count }, () => {
        const uuid = createUuidV4();
        return stripHyphens ? uuid.replaceAll('-', '') : uuid;
      });

      setUuids(nextUuids);
      setError('');
      setCopied(null);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : '生成 UUID 失败，请重试。');
    }
  };

  const clearResults = () => {
    setUuids([]);
    setError('');
    setCopied(null);
  };

  const copyAll = async () => {
    if (!generatedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied('all');
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError('复制失败，请手动复制生成结果。');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">UUID 在线生成工具</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              完全离线运行，基于浏览器安全随机数快速生成 RFC 4122 风格 UUID，适合开发、测试和数据库场景。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10 space-y-6">
        <div className="text-center pt-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e293b] tracking-tight">UUID在线生成工具</h2>
          <p className="text-[#64748b] mt-3 text-sm md:text-base">
            一次生成多个 UUID，可按需去除横线，结果支持一键复制。
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[15px] font-bold text-[#1e293b] mb-3">生成数量：</label>
            <input
              type="number"
              min="1"
              max={MAX_UUID_COUNT}
              value={countInput}
              onChange={(event) => setCountInput(event.target.value)}
              className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 text-[#0f172a]"
              placeholder="请输入要生成的 UUID 数量"
            />
          </div>

          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stripHyphens}
              onChange={(event) => setStripHyphens(event.target.checked)}
              className="w-4 h-4 accent-[#2563eb]"
            />
            <span className="text-sm font-medium text-[#334155]">去除横线，输出 32 位紧凑格式</span>
          </label>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generateUuids}
              className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(20,184,166,0.2)] flex items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              生成UUID
            </button>

            <button
              onClick={copyAll}
              disabled={!generatedText}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {copied === 'all' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied === 'all' ? '已复制全部结果' : '复制全部'}
            </button>

            <button
              onClick={clearResults}
              disabled={!generatedText}
              className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              清空结果
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-bold text-[#1e293b]">生成的UUID：</label>
            <div className="text-sm text-[#64748b]">
              {uuids.length > 0 ? `已生成 ${uuids.length} 个` : '尚未生成结果'}
            </div>
          </div>

          <textarea
            readOnly
            value={generatedText}
            placeholder="点击上方按钮后，这里会显示生成的 UUID 结果。"
            className="w-full min-h-[240px] rounded-2xl border border-[#cbd5e1] bg-white px-4 py-4 text-[14px] text-[#1e293b] outline-none resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#e2e8f0] bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">输出格式</div>
            <div className="font-bold text-[#1e293b]">{stripHyphens ? '32 位无横线' : 'RFC 4122 标准格式'}</div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">随机源</div>
            <div className="font-bold text-[#1e293b]">Web Crypto API</div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">隐私方式</div>
            <div className="font-bold text-[#1e293b]">纯本地离线生成</div>
          </div>
        </div>
      </div>

      <div className="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
        <div className="prose max-w-none text-[14px] leading-loose text-[#475569]">
          <p className="text-[#1e293b] font-bold mb-4">
            UUID（通用唯一标识符）在线生成工具为用户提供方便、快捷地生成 UUID 的服务。主要特点和功能：
          </p>

          <p className="mb-4">
            生成 UUID 的逻辑严格遵循 RFC 4122 的常见 v4 随机标识思路，并支持一键去除横线，方便数据库字段、接口参数和测试数据直接使用。
          </p>

          <p className="text-red-500 font-bold mb-6 bg-red-50/50 p-4 rounded-xl border border-red-100/50">
            数据仅在本地浏览器内生成和处理，不会上传云端，也不会写入第三方缓存服务。
          </p>

          <div className="space-y-4">
            <p>1. 在线访问：打开网页即可使用，无需下载或安装任何额外软件。</p>
            <p>2. 简单易用：只需输入生成数量，点击按钮即可批量得到所需 UUID。</p>
            <p>3. 自定义选项：支持保留横线或输出无横线紧凑格式，满足不同开发场景。</p>
            <p>4. 快速生成：通常可以瞬间生成多个 UUID，适合测试、调试和数据初始化。</p>
            <p>5. 复制功能：支持一键复制全部结果，方便粘贴到代码、数据库或文档里。</p>
            <p>6. 安全性：依赖浏览器安全随机数能力，确保生成结果具备足够的随机性与不可预测性。</p>
            <p>7. 多平台支持：桌面、平板和手机浏览器都可以直接使用。</p>
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-[#e2e8f0] p-5 not-prose">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
              <p className="text-sm text-[#334155] leading-relaxed">
                UUID 在线生成工具适用于软件开发、接口联调、自动化测试、数据库管理等场景，帮你快速准备稳定、可复制的唯一标识。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
