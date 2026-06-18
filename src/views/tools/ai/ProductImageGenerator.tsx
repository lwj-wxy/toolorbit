import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Sparkles,
} from 'lucide-react';

type GeneratedImage = {
  imageUrl: string;
  prompt: string;
  model?: string;
  fallbackUsed?: boolean;
  variant?: number;
};

type GeneratorResult = {
  images?: GeneratedImage[];
  elapsedMs?: number;
  size?: string;
  provider?: string;
};

const platforms = [
  { value: 'Amazon listing', zh: 'Amazon 上架图', en: 'Amazon listing' },
  { value: 'Google Shopping', zh: 'Google Shopping', en: 'Google Shopping' },
  { value: 'Shopify product page', zh: 'Shopify 商品页', en: 'Shopify product page' },
  { value: 'TikTok Shop', zh: 'TikTok Shop', en: 'TikTok Shop' },
  { value: 'Meta Ads', zh: 'Meta 广告', en: 'Meta Ads' },
];

const imageUses = [
  { value: 'Clean white-background main image', zh: '白底主图', en: 'White-background main image' },
  { value: 'Lifestyle scene image', zh: '生活方式场景图', en: 'Lifestyle scene image' },
  { value: 'Product page hero image', zh: '独立站首屏图', en: 'Product page hero image' },
  { value: 'Social ad creative', zh: '社媒广告图', en: 'Social ad creative' },
  { value: 'Marketplace secondary image', zh: '平台辅图', en: 'Marketplace secondary image' },
];

const ratios = [
  { value: '1:1', label: '1:1' },
  { value: '4:5', label: '4:5' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
];

const styles = [
  { value: 'Clean ecommerce photography, realistic lighting', zh: '真实电商摄影', en: 'Realistic ecommerce' },
  { value: 'Premium DTC brand photography, minimal props', zh: 'DTC 精品品牌感', en: 'Premium DTC' },
  { value: 'Warm lifestyle photography, natural light', zh: '自然生活方式', en: 'Warm lifestyle' },
  { value: 'Studio catalog photography, crisp shadows', zh: '棚拍目录图', en: 'Studio catalog' },
];

const backgrounds = [
  { value: 'white or very light neutral background', zh: '白色/浅中性背景', en: 'White or light neutral' },
  { value: 'soft home interior background', zh: '柔和家居背景', en: 'Soft home interior' },
  { value: 'natural desktop setting', zh: '自然桌面场景', en: 'Natural desktop' },
  { value: 'clean gradient-free brand color backdrop', zh: '纯净品牌色背景', en: 'Clean brand backdrop' },
];

export default function ProductImageGenerator() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [sellingPoint, setSellingPoint] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Amazon listing');
  const [targetMarket, setTargetMarket] = useState('United States');
  const [imageUse, setImageUse] = useState('Clean white-background main image');
  const [ratio, setRatio] = useState('1:1');
  const [style, setStyle] = useState('Clean ecommerce photography, realistic lighting');
  const [background, setBackground] = useState('white or very light neutral background');
  const [scene, setScene] = useState('');
  const [variantCount, setVariantCount] = useState(2);
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  const canGenerate = Boolean(productName.trim() && !loading);
  const selectedUse = imageUses.find((option) => option.value === imageUse);
  const selectedPlatform = platforms.find((option) => option.value === targetPlatform);

  const requestSummary = useMemo(() => {
    return [
      productName.trim(),
      selectedUse?.[isZh ? 'zh' : 'en'],
      selectedPlatform?.[isZh ? 'zh' : 'en'],
      ratio,
    ].filter(Boolean).join(' / ');
  }, [isZh, productName, ratio, selectedPlatform, selectedUse]);

  useEffect(() => {
    if (!result) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const generateImages = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai-product-image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          sellingPoint,
          targetPlatform,
          targetMarket,
          imageUse,
          ratio,
          style,
          background,
          scene,
          variantCount,
        }),
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseData.error || (isZh ? '商品图生成失败，请稍后再试。' : 'Product image generation failed. Please try again.'));
      }
      setResult(responseData);
    } catch (requestError: any) {
      setError(requestError.message || (isZh ? '商品图生成失败，请稍后再试。' : 'Product image generation failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async (image: GeneratedImage) => {
    await navigator.clipboard.writeText(image.prompt);
    setCopiedPrompt(image.variant || 0);
    setTimeout(() => setCopiedPrompt(null), 1600);
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    const fileName = `product-image-${Date.now()}-${index + 1}.png`;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              {isZh ? 'Cross-border product image' : 'Cross-border product image'}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {t('tools.ai-product-image-generator.title', isZh ? 'AI 出海商品图生成器' : 'AI Product Image Generator for Global Listings')}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t(
                'tools.ai-product-image-generator.subtitle',
                isZh
                  ? '输入商品信息，选择平台、用途和比例，生成适合跨境上架、广告投放和独立站展示的商品图片。'
                  : 'Enter product details, choose platform, use case, and ratio, then generate listing-ready product images.',
              )}
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm leading-6 text-violet-900 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200">
            {isZh ? '请写清材质、颜色、结构和使用场景。发布前仍需核对商品细节。' : 'Describe material, color, structure, and use case. Check product details before publishing.'}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <div className="mb-5 flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{isZh ? '产品与场景' : 'Product and scene'}</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '商品名称' : 'Product name'}</label>
              <input
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-violet-950"
                placeholder={isZh ? '例如：手工陶瓷杯' : 'e.g. Handmade ceramic cup'}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '商品说明' : 'Product description'}</label>
                <span className="text-xs text-slate-400">{productDescription.length}</span>
              </div>
              <textarea
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-violet-950"
                placeholder={isZh ? '材质、颜色、用途、适用人群、包装情况' : 'Material, color, use case, audience, packaging'}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '目标平台' : 'Target platform'}</label>
                <select value={targetPlatform} onChange={(event) => setTargetPlatform(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  {platforms.map((option) => <option key={option.value} value={option.value}>{option[isZh ? 'zh' : 'en']}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '目标市场' : 'Target market'}</label>
                <select value={targetMarket} onChange={(event) => setTargetMarket(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <option value="United States">{isZh ? '美国' : 'United States'}</option>
                  <option value="European Union">{isZh ? '欧盟' : 'European Union'}</option>
                  <option value="United Kingdom">{isZh ? '英国' : 'United Kingdom'}</option>
                  <option value="Canada">{isZh ? '加拿大' : 'Canada'}</option>
                  <option value="Other">{isZh ? '其他市场' : 'Other'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '图片用途' : 'Image use'}</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {imageUses.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setImageUse(option.value)}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors duration-200 ${
                      imageUse === option.value
                        ? 'border-violet-500 bg-violet-50 text-violet-800 dark:border-violet-400 dark:bg-violet-950/30 dark:text-violet-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                    }`}
                  >
                    {option[isZh ? 'zh' : 'en']}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '图片比例' : 'Aspect ratio'}</label>
              <div className="grid grid-cols-4 gap-2">
                {ratios.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRatio(option.value)}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                      ratio === option.value ? 'border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-950/30 dark:text-violet-200' : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '更多选项（可选）' : 'More options (optional)'}
              </summary>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '核心卖点' : 'Key selling point'}</label>
                  <input
                    value={sellingPoint}
                    onChange={(event) => setSellingPoint(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-violet-950"
                    placeholder={isZh ? '例如：手工釉面、适合咖啡热饮' : 'e.g. Handmade glaze, suitable for hot coffee'}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '视觉风格' : 'Visual style'}</label>
                    <select value={style} onChange={(event) => setStyle(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      {styles.map((option) => <option key={option.value} value={option.value}>{option[isZh ? 'zh' : 'en']}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '背景' : 'Background'}</label>
                    <select value={background} onChange={(event) => setBackground(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      {backgrounds.map((option) => <option key={option.value} value={option.value}>{option[isZh ? 'zh' : 'en']}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '场景补充' : 'Scene notes'}</label>
                    <input
                      value={scene}
                      onChange={(event) => setScene(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-violet-950"
                      placeholder={isZh ? '例如：木质桌面、清晨自然光、咖啡旁边' : 'e.g. wooden desk, morning light, next to coffee'}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">{isZh ? '生成张数' : 'Variants'}</label>
                    <select value={variantCount} onChange={(event) => setVariantCount(Number(event.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>
              </div>
            </details>

            {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{error}</div> : null}

            <button
              onClick={generateImages}
              disabled={!canGenerate}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 sm:w-auto sm:px-8"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? (isZh ? '正在生成商品图...' : 'Generating product images...') : (isZh ? '生成商品图' : 'Generate product images')}
            </button>
          </div>
        </section>

        <section ref={resultRef} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-slate-500 dark:text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
              <p className="text-sm font-medium">{isZh ? '正在根据商品信息生成出海商品图...' : 'Generating listing images from your product details...'}</p>
              <p className="max-w-md text-xs leading-5">{isZh ? '生成多张图会需要更长时间。请保留当前页面。' : 'Multiple variants may take longer. Keep this page open.'}</p>
            </div>
          ) : null}

          {!loading && !result ? (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-4 text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              <ImageIcon className="h-5 w-5 flex-none text-slate-300 dark:text-slate-700" />
              <p className="max-w-md text-sm leading-6">
                {isZh ? '填写商品信息后，这里会显示生成结果、下载按钮和生成提示词。' : 'Enter product details to see generated images, download actions, and prompts.'}
              </p>
            </div>
          ) : null}

          {!loading && result ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '生成结果' : 'Generated images'}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{requestSummary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {result.size ? <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{result.size}</span> : null}
                    {result.elapsedMs ? <span>{Math.round(result.elapsedMs / 1000)}s</span> : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(result.images || []).map((image, index) => (
                  <article key={`${image.imageUrl}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#282c34]">
                    <div className="aspect-square bg-slate-100 dark:bg-slate-950">
                      <img src={image.imageUrl} alt={`${productName || 'Product'} ${index + 1}`} className="h-full w-full object-contain" />
                    </div>
                    <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950 dark:text-white">
                            {isZh ? '变体' : 'Variant'} #{image.variant || index + 1}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{image.model || result.provider}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyPrompt(image)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-300"
                          >
                            {copiedPrompt === (image.variant || 0) ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            {isZh ? '提示词' : 'Prompt'}
                          </button>
                          <button
                            onClick={() => downloadImage(image.imageUrl, index)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-emerald-700"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {isZh ? '下载' : 'Download'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                {isZh ? '发布前请核对产品结构、颜色、Logo、包装文字和平台图片规则。AI 生成图不能代替真实商品审核。' : 'Before publishing, check product shape, color, logos, packaging text, and platform image rules. Generated images do not replace product review.'}
              </div>
            </div>
          ) : null}
        </section>

      </div>

    </div>
  );
}
