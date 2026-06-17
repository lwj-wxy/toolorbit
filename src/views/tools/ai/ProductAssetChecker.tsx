import { type ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Copy,
  FileImage,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

type UploadedAsset = {
  id: string;
  name: string;
  role: string;
  type: string;
  size: number;
  width: number;
  height: number;
  imageBase64: string;
};

type ImageFinding = {
  imageIndex?: number;
  imageName?: string;
  role?: string;
  risk?: 'Low' | 'Medium' | 'High' | string;
  issues?: string[];
  fixes?: string[];
};

type ComplianceCheck = {
  label?: string;
  status?: 'pass' | 'warning' | 'fail' | string;
  evidence?: string;
  fix?: string;
};

type CheckerResult = {
  overallRisk?: 'Low' | 'Medium' | 'High' | string;
  verdict?: string;
  assetSummary?: string;
  imageFindings?: ImageFinding[];
  checks?: ComplianceCheck[];
  nextActions?: string[];
  disclaimer?: string;
  model?: string;
};

const platforms = [
  { value: 'Google Shopping', zh: 'Google Shopping', en: 'Google Shopping' },
  { value: 'Amazon', zh: 'Amazon', en: 'Amazon' },
  { value: 'TikTok Shop', zh: 'TikTok Shop', en: 'TikTok Shop' },
  { value: 'Shopify product page', zh: 'Shopify 商品页', en: 'Shopify product page' },
  { value: 'Meta Ads', zh: 'Meta 广告', en: 'Meta Ads' },
  { value: 'General cross-border listing', zh: '通用出海上架', en: 'General cross-border listing' },
];

const markets = [
  { value: 'United States', zh: '美国', en: 'United States' },
  { value: 'European Union', zh: '欧盟', en: 'European Union' },
  { value: 'United Kingdom', zh: '英国', en: 'United Kingdom' },
  { value: 'Canada', zh: '加拿大', en: 'Canada' },
  { value: 'Australia', zh: '澳大利亚', en: 'Australia' },
  { value: 'Other', zh: '其他市场', en: 'Other' },
];

const imageRoles = [
  { value: 'Main image', zh: '主图', en: 'Main image' },
  { value: 'Lifestyle image', zh: '场景图', en: 'Lifestyle image' },
  { value: 'Packaging image', zh: '包装图', en: 'Packaging image' },
  { value: 'Label image', zh: '标签图', en: 'Label image' },
  { value: 'Detail image', zh: '细节图', en: 'Detail image' },
];

const riskClass = (risk = '') => {
  const normalizedRisk = risk.toLowerCase();
  if (normalizedRisk === 'low') return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300';
  if (normalizedRisk === 'high') return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300';
  return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300';
};

const statusClass = (status = '') => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'pass') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
  if (normalizedStatus === 'fail') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
  return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
};

const localizedRisk = (risk = '', isZh = false) => {
  const normalizedRisk = risk.toLowerCase();
  if (normalizedRisk === 'low') return isZh ? '低' : 'Low';
  if (normalizedRisk === 'medium') return isZh ? '中' : 'Medium';
  if (normalizedRisk === 'high') return isZh ? '高' : 'High';
  return risk || (isZh ? '待判断' : 'Unknown');
};

const localizedStatus = (status = '', isZh = false) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'pass') return isZh ? '通过' : 'Pass';
  if (normalizedStatus === 'warning') return isZh ? '注意' : 'Warning';
  if (normalizedStatus === 'fail') return isZh ? '需修改' : 'Fix';
  return status || (isZh ? '待判断' : 'Unknown');
};

const readImageFile = (file: File, role: string) =>
  new Promise<UploadedAsset>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image.'));
    reader.onload = () => {
      const imageBase64 = String(reader.result || '');
      const image = new Image();
      image.onload = () => {
        resolve({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          role,
          type: file.type,
          size: file.size,
          width: image.naturalWidth,
          height: image.naturalHeight,
          imageBase64,
        });
      };
      image.onerror = () => reject(new Error('Could not inspect image dimensions.'));
      image.src = imageBase64;
    };
    reader.readAsDataURL(file);
  });

export default function ProductAssetChecker() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Google Shopping');
  const [targetMarket, setTargetMarket] = useState('United States');
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingFiles, setReadingFiles] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const canAnalyze = Boolean(assets.length > 0 && productTitle.trim() && !loading && !readingFiles);

  const resultText = useMemo(() => {
    if (!result) return '';
    const imageText = (result.imageFindings || [])
      .map((finding) =>
        [
          `${finding.imageIndex || '-'} ${finding.imageName || ''} (${localizedRisk(finding.risk, isZh)})`,
          ...(finding.issues || []).map((issue) => `- ${issue}`),
          ...(finding.fixes || []).map((fix) => `${isZh ? '修复' : 'Fix'}: ${fix}`),
        ].join('\n'),
      )
      .join('\n\n');
    const checkText = (result.checks || [])
      .map((check) => `- [${localizedStatus(check.status, isZh)}] ${check.label || ''}: ${check.evidence || ''}${check.fix ? ` ${isZh ? '建议' : 'Fix'}: ${check.fix}` : ''}`)
      .join('\n');

    return [
      `${isZh ? '总体风险' : 'Overall risk'}: ${localizedRisk(result.overallRisk, isZh)}`,
      result.verdict,
      result.assetSummary,
      imageText ? `\n${isZh ? '图片问题' : 'Image findings'}:\n${imageText}` : undefined,
      checkText ? `\n${isZh ? '检查项' : 'Checks'}:\n${checkText}` : undefined,
      result.nextActions?.length ? `\n${isZh ? '下一步' : 'Next actions'}:\n${result.nextActions.map((action) => `- ${action}`).join('\n')}` : undefined,
      result.disclaimer,
    ].filter(Boolean).join('\n');
  }, [isZh, result]);

  const addImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';
    if (selectedFiles.length === 0) return;

    setReadingFiles(true);
    setError('');
    try {
      const remainingSlots = Math.max(0, 8 - assets.length);
      const validFiles = selectedFiles
        .filter((file) => file.type.startsWith('image/'))
        .filter((file) => file.size <= 5 * 1024 * 1024)
        .slice(0, remainingSlots);

      if (validFiles.length === 0) {
        throw new Error(isZh ? '请上传 JPG、PNG 或 WebP 图片，单张不超过 5MB。' : 'Upload JPG, PNG, or WebP images up to 5MB each.');
      }

      const nextAssets = await Promise.all(
        validFiles.map((file, index) => readImageFile(file, imageRoles[Math.min(assets.length + index, imageRoles.length - 1)].value)),
      );
      setAssets((currentAssets) => [...currentAssets, ...nextAssets]);
    } catch (uploadError: any) {
      setError(uploadError.message || (isZh ? '图片读取失败。' : 'Could not read images.'));
    } finally {
      setReadingFiles(false);
    }
  };

  const updateAssetRole = (assetId: string, role: string) => {
    setAssets((currentAssets) => currentAssets.map((asset) => (asset.id === assetId ? { ...asset, role } : asset)));
  };

  const removeAsset = (assetId: string) => {
    setAssets((currentAssets) => currentAssets.filter((asset) => asset.id !== assetId));
  };

  const copyResult = async () => {
    if (!resultText.trim()) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const analyzeAssets = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai-product-asset-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle,
          productDescription,
          targetPlatform,
          targetMarket,
          interfaceLanguage: i18n.language,
          outputLanguage: isZh ? 'Simplified Chinese' : 'English',
          images: assets.map((asset) => ({
            name: asset.name,
            role: asset.role,
            type: asset.type,
            size: asset.size,
            width: asset.width,
            height: asset.height,
            imageBase64: asset.imageBase64,
          })),
        }),
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseData.error || (isZh ? '图片质检失败，请稍后再试。' : 'Asset check failed. Please try again.'));
      }
      setResult(responseData);
    } catch (requestError: any) {
      setError(requestError.message || (isZh ? '图片质检失败，请稍后再试。' : 'Asset check failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isZh ? '出海素材质检' : 'Global commerce asset check'}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {t('tools.ai-product-asset-checker.title', isZh ? 'AI 商品素材合规质检器' : 'AI Product Asset Compliance Checker')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t(
                'tools.ai-product-asset-checker.subtitle',
                isZh
                  ? '上传商品主图、场景图、包装图或标签图，检查出海上架和广告素材中的视觉风险、文字覆盖、包装信息和平台适配问题。'
                  : 'Upload product images, packaging photos, or label shots to check visual risks, text overlays, packaging gaps, and platform readiness.',
              )}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200 lg:max-w-sm">
            {isZh
              ? '本工具提供素材风险筛查，不代表平台审核结论。发布前仍需对照目标平台规则和账号后台提示复核。'
              : 'This tool screens asset risks. It does not replace official platform review or account-level diagnostics.'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <ClipboardList className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              {isZh ? '商品与平台' : 'Product and platform'}
            </h2>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '商品标题' : 'Product title'}
              </label>
              <input
                value={productTitle}
                onChange={(event) => setProductTitle(event.target.value)}
                placeholder={isZh ? '例如：手工陶瓷杯' : 'e.g. Handmade ceramic cup'}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '商品说明' : 'Product description'}
              </label>
              <textarea
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
                placeholder={isZh ? '材质、颜色、数量、包装内容、用途等。' : 'Material, color, quantity, package contents, use case, and key claims.'}
                className="min-h-[92px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {isZh ? '目标平台' : 'Target platform'}
                </label>
                <select
                  value={targetPlatform}
                  onChange={(event) => setTargetPlatform(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {isZh ? platform.zh : platform.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {isZh ? '目标市场' : 'Target market'}
                </label>
                <select
                  value={targetMarket}
                  onChange={(event) => setTargetMarket(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {markets.map((market) => (
                    <option key={market.value} value={market.value}>
                      {isZh ? market.zh : market.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <FileImage className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              {isZh ? '上传图片' : 'Upload images'}
            </h2>
            <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20">
              <ImagePlus className="mb-3 h-8 w-8 text-emerald-600 dark:text-emerald-300" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {readingFiles ? (isZh ? '正在读取图片...' : 'Reading images...') : (isZh ? '选择商品图片' : 'Choose product images')}
              </span>
              <span className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {isZh ? '最多 8 张，单张不超过 5MB。支持 JPG、PNG、WebP。' : 'Up to 8 images, 5MB each. JPG, PNG, and WebP supported.'}
              </span>
              <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={addImages} className="hidden" />
            </label>

            {assets.length ? (
              <div className="space-y-3">
                {assets.map((asset, index) => (
                  <div key={asset.id} className="grid grid-cols-[72px_minmax(0,1fr)_36px] gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <img src={asset.imageBase64} alt={asset.name} className="h-16 w-16 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{asset.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {asset.width} x {asset.height}px · {(asset.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                      <select
                        value={asset.role}
                        onChange={(event) => updateAssetRole(asset.id, event.target.value)}
                        className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        {imageRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {index === 0 && role.value === 'Main image' ? (isZh ? '主图' : 'Main image') : (isZh ? role.zh : role.en)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                      aria-label={isZh ? '删除图片' : 'Remove image'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          ) : null}

          <button
            onClick={analyzeAssets}
            disabled={!canAnalyze}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? (isZh ? '正在质检' : 'Checking') : (isZh ? '开始素材质检' : 'Check assets')}
          </button>
        </div>

        <div className="min-h-[620px] rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">{isZh ? '正在检查图片、文字覆盖和平台风险...' : 'Checking images, overlays, and platform risks...'}</p>
            </div>
          ) : null}

          {!loading && !result ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
              <ShieldCheck className="mb-4 h-14 w-14 text-slate-300 dark:text-slate-700" />
              <p className="max-w-md text-sm leading-6">
                {isZh
                  ? '上传商品主图、包装图或标签图后，工具会检查图片尺寸、文字覆盖、商品一致性、包装信息和平台素材风险。'
                  : 'Upload product, packaging, or label images to check dimensions, overlays, product consistency, packaging information, and platform risks.'}
              </p>
            </div>
          ) : null}

          {!loading && result ? (
            <div className="space-y-4">
              <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#282c34]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '质检结论' : 'Asset check result'}</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {isZh ? '根据上传素材生成的风险摘要' : 'Risk summary based on uploaded assets'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClass(result.overallRisk)}`}>
                      {isZh ? '风险' : 'Risk'}: {localizedRisk(result.overallRisk, isZh)}
                    </span>
                    <button
                      onClick={copyResult}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:ring-offset-slate-900"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制结果' : 'Copy result')}
                    </button>
                  </div>
                </div>
                <div className="grid gap-0 md:grid-cols-[0.95fr_1.35fr]">
                  <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700 md:border-b-0 md:border-r">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {isZh ? '判断' : 'Verdict'}
                    </p>
                    <p className="text-base leading-7 text-slate-950 dark:text-white">{result.verdict || localizedRisk(result.overallRisk, isZh)}</p>
                  </div>
                  <div className="bg-slate-50/80 px-5 py-4 dark:bg-slate-950/35">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {isZh ? '素材摘要' : 'Asset summary'}
                    </p>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{result.assetSummary || result.verdict}</p>
                  </div>
                </div>
              </section>

              {result.imageFindings?.length ? (
                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#282c34]">
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-700">
                    <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '图片问题' : 'Image findings'}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {result.imageFindings.length} {isZh ? '张图' : 'images'}
                    </span>
                  </div>
                  {result.imageFindings.map((finding, index) => (
                    <article key={`${finding.imageName}-${index}`} className="border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-950 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                          #{finding.imageIndex || index + 1}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClass(finding.risk)}`}>
                          {localizedRisk(finding.risk, isZh)}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{finding.imageName || finding.role}</span>
                        {finding.role ? <span className="text-xs text-slate-500 dark:text-slate-400">/{finding.role}</span> : null}
                      </div>
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <div className="rounded-md bg-rose-50/70 p-3 dark:bg-rose-950/20">
                          <p className="mb-2 text-xs font-semibold uppercase text-rose-700 dark:text-rose-300">{isZh ? '问题' : 'Issues'}</p>
                          <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {(finding.issues || []).map((issue) => (
                              <li key={issue} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-rose-500" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-md bg-emerald-50/70 p-3 dark:bg-emerald-950/20">
                          <p className="mb-2 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">{isZh ? '修复' : 'Fixes'}</p>
                          <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {(finding.fixes || []).map((fix) => (
                              <li key={fix} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                                <span>{fix}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              ) : null}

              {result.checks?.length ? (
                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#282c34]">
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-700">
                    <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '检查项' : 'Checks'}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{isZh ? '逐项核对' : 'Item review'}</span>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {result.checks.map((check, index) => (
                      <div key={`${check.label}-${index}`} className="grid gap-3 px-5 py-4 md:grid-cols-[9rem_1fr]">
                        <div className="flex items-start gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(check.status)}`}>
                            {localizedStatus(check.status, isZh)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-950 dark:text-white">{check.label}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{check.evidence}</p>
                          {check.fix ? <p className="mt-1 text-sm leading-6 text-emerald-700 dark:text-emerald-300">{check.fix}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className={`grid gap-4 ${result.nextActions?.length ? 'lg:grid-cols-[1fr_1.15fr]' : ''}`}>
                {result.nextActions?.length ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
                    <h2 className="mb-3 text-base font-semibold text-slate-950 dark:text-white">{isZh ? '下一步' : 'Next actions'}</h2>
                    <ol className="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {result.nextActions.map((action, index) => (
                        <li key={action} className="grid grid-cols-[1.75rem_1fr] gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {index + 1}
                          </span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    {isZh ? '复核提示' : 'Review note'}
                  </div>
                  <p>
                    {result.disclaimer || (isZh ? '本结果是 AI 风险筛查，不是平台审核结论。发布前请对照目标平台规则和账号后台提示复核。' : 'This is an AI risk screen, not an official platform decision. Verify against platform rules and account diagnostics before publishing.')}
                  </p>
                </section>
              </section>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}
