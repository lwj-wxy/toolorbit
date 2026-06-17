import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Copy,
  FileText,
  Globe2,
  Loader2,
  PackageCheck,
  SearchCheck,
  ShieldAlert,
} from 'lucide-react';

type Candidate = {
  codePattern?: string;
  confidence?: 'High' | 'Medium' | 'Low' | string;
  whyItMayFit?: string;
  whyItMayNotFit?: string;
  questionsToConfirm?: string[];
};

type HsAssistantResult = {
  customsName?: string;
  invoiceDescription?: string;
  classificationBrief?: string;
  summary?: {
    material?: string;
    use?: string;
    market?: string;
  };
  candidates?: Candidate[];
  brokerQuestions?: string[];
  missingInformation?: string[];
  riskLevel?: 'Low' | 'Medium' | 'High' | string;
  officialLookup?: {
    label?: string;
    url?: string;
  };
  disclaimer?: string;
};

type FormState = {
  productName: string;
  productUse: string;
  material: string;
  targetMarket: string;
  battery: string;
  electronics: string;
  setSold: string;
  packageContents: string;
  productForm: string;
  userGroup: string;
  brandModel: string;
  unitWeight: string;
  riskFlags: string[];
  outputLanguage: string;
};

const initialForm: FormState = {
  productName: '',
  productUse: '',
  material: '',
  targetMarket: 'United States',
  battery: 'No',
  electronics: 'No',
  setSold: 'No',
  packageContents: '',
  productForm: 'Finished product',
  userGroup: '',
  brandModel: '',
  unitWeight: '',
  riskFlags: [],
  outputLanguage: 'English',
};

const markets = [
  { value: 'United States', zh: '美国', en: 'United States' },
  { value: 'European Union', zh: '欧盟', en: 'European Union' },
  { value: 'United Kingdom', zh: '英国', en: 'United Kingdom' },
  { value: 'Canada', zh: '加拿大', en: 'Canada' },
  { value: 'Australia', zh: '澳大利亚', en: 'Australia' },
  { value: 'Other', zh: '其他市场', en: 'Other' },
];

const productForms = [
  { value: 'Finished product', zh: '成品', en: 'Finished product' },
  { value: 'Part', zh: '零件', en: 'Part' },
  { value: 'Accessory', zh: '配件', en: 'Accessory' },
  { value: 'Raw material', zh: '原材料', en: 'Raw material' },
  { value: 'Set', zh: '套装', en: 'Set' },
  { value: 'Sample', zh: '样品', en: 'Sample' },
];

const officialLookupByMarket: Record<string, { label: string; url: string }> = {
  'United States': {
    label: 'USITC Harmonized Tariff Schedule',
    url: 'https://hts.usitc.gov/',
  },
  'European Union': {
    label: 'EU TARIC consultation',
    url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp',
  },
  'United Kingdom': {
    label: 'GOV.UK commodity code guidance',
    url: 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports',
  },
  Canada: {
    label: 'Canada Customs Tariff',
    url: 'https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html',
  },
  Australia: {
    label: 'Australian Border Force tariff classification',
    url: 'https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification',
  },
  Other: {
    label: 'WCO Harmonized System overview',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx',
  },
};

const riskFlagOptions = [
  { value: 'food-contact', zh: '接触食品材料', en: 'Food-contact material' },
  { value: 'children', zh: '儿童用品或玩具', en: 'Children or toy product' },
  { value: 'cosmetic-health', zh: '化妆品、保健品或药品', en: 'Cosmetic, supplement, or medicine' },
  { value: 'battery-liquid-powder', zh: '含电池、液体、粉末或磁铁', en: 'Battery, liquid, powder, or magnet' },
  { value: 'medical', zh: '医疗用途', en: 'Medical use' },
  { value: 'animal-plant', zh: '动植物材料', en: 'Animal or plant material' },
  { value: 'brand-authorization', zh: '品牌或授权不明确', en: 'Unclear brand authorization' },
];

const confidenceClass = (confidence = '') => {
  const normalizedConfidence = confidence.toLowerCase();
  if (normalizedConfidence === 'high') return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300';
  if (normalizedConfidence === 'low') return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300';
  return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300';
};

const compactLines = (lines: Array<string | undefined>) => lines.filter(Boolean).join('\n');

const localizedLevel = (level = '', isZh = false) => {
  const normalizedLevel = level.toLowerCase();
  if (normalizedLevel === 'high') return isZh ? '高' : 'High';
  if (normalizedLevel === 'medium') return isZh ? '中' : 'Medium';
  if (normalizedLevel === 'low') return isZh ? '低' : 'Low';
  return level || (isZh ? '候选' : 'Candidate');
};

export default function HsCodeAssistant() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [form, setForm] = useState<FormState>({ ...initialForm, outputLanguage: isZh ? 'Simplified Chinese' : 'English' });
  const [result, setResult] = useState<HsAssistantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setForm((currentForm) => ({
      ...currentForm,
      outputLanguage: isZh ? 'Simplified Chinese' : 'English',
    }));
  }, [isZh]);

  const selectedOfficialLookup = officialLookupByMarket[form.targetMarket] || officialLookupByMarket.Other;
  const canSubmit = Boolean(form.productName.trim() && form.productUse.trim() && form.material.trim());

  const setField = (field: keyof FormState, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const toggleRiskFlag = (flag: string) => {
    setForm((currentForm) => {
      const hasFlag = currentForm.riskFlags.includes(flag);
      return {
        ...currentForm,
        riskFlags: hasFlag ? currentForm.riskFlags.filter((item) => item !== flag) : [...currentForm.riskFlags, flag],
      };
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const allResultText = useMemo(() => {
    if (!result) return '';
    const candidateText = result.candidates
      ?.map((candidate, index) =>
        compactLines([
          `${index + 1}. ${candidate.codePattern || ''} (${localizedLevel(candidate.confidence, isZh)})`,
          candidate.whyItMayFit ? `${isZh ? '判断依据' : 'Reason'}: ${candidate.whyItMayFit}` : undefined,
        ]),
      )
      .join('\n\n');

    return compactLines([
      result.customsName ? `${isZh ? '英文报关品名' : 'Customs item name'}: ${result.customsName}` : undefined,
      result.invoiceDescription ? `${isZh ? '英文发票描述' : 'Commercial invoice description'}: ${result.invoiceDescription}` : undefined,
      result.classificationBrief ? `${isZh ? '分类说明' : 'Classification brief'}: ${result.classificationBrief}` : undefined,
      candidateText ? `\n${isZh ? '候选编码方向' : 'Candidate code directions'}:\n${candidateText}` : undefined,
      result.brokerQuestions?.length ? `\n${isZh ? '货代确认' : 'Questions for broker'}:\n${result.brokerQuestions.map((question) => `- ${question}`).join('\n')}` : undefined,
      result.missingInformation?.length ? `\n${isZh ? '缺失信息' : 'Missing information'}:\n${result.missingInformation.map((item) => `- ${item}`).join('\n')}` : undefined,
      result.disclaimer,
    ]);
  }, [isZh, result]);

  const reviewItems = useMemo(() => {
    if (!result) return [];

    const missingItems = (result.missingInformation || []).map((item) => ({
      label: isZh ? '缺失信息' : 'Missing',
      text: item,
      tone: 'rose',
    }));
    const brokerItems = (result.brokerQuestions || []).map((item) => ({
      label: isZh ? '货代确认' : 'Broker',
      text: item,
      tone: 'sky',
    }));

    return [...missingItems, ...brokerItems];
  }, [isZh, result]);

  const reviewItemsText = useMemo(
    () => reviewItems.map((item) => `- [${item.label}] ${item.text}`).join('\n'),
    [reviewItems],
  );

  const parseStructuredResult = (rawText: string) => {
    try {
      return JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error(isZh ? 'AI 返回内容不是可解析的 JSON。' : 'The AI response was not valid JSON.');
    }
  };

  const analyzeProduct = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    let currentText = '';

    try {
      const response = await fetch('/api/ai-hs-code-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          officialLookup: selectedOfficialLookup,
          interfaceLanguage: i18n.language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || (isZh ? '服务暂时不可用。' : 'Service unavailable.'));
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error(isZh ? '无法读取 AI 响应。' : 'Could not read the AI response.');

      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ') || trimmedLine.includes('[DONE]')) continue;
          try {
            const data = JSON.parse(trimmedLine.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.content) currentText += data.content;
          } catch (parseError: any) {
            if (parseError.message) throw parseError;
          }
        }
      }

      const parsedResult = parseStructuredResult(currentText) as HsAssistantResult;
      setResult({
        ...parsedResult,
        officialLookup: parsedResult.officialLookup || selectedOfficialLookup,
      });
    } catch (requestError: any) {
      setError(requestError.message || (isZh ? '分析失败，请稍后再试。' : 'Analysis failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
              <Globe2 className="h-3.5 w-3.5" />
              {isZh ? '跨境报关助手' : 'Cross-border customs helper'}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {t('tools.ai-hs-code-assistant.title', isZh ? 'AI HS 编码与报关品名助手' : 'AI HS Code & Customs Description Assistant')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t(
                'tools.ai-hs-code-assistant.subtitle',
                isZh
                  ? '输入商品名称、材质、用途和目标市场，生成英文报关品名、HS 候选方向、判断依据和需要补充的问题。'
                  : 'Enter product details, material, use, and destination market to draft customs names, HS candidate directions, reasoning, and broker questions.',
              )}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200 lg:max-w-sm">
            {isZh
              ? '本工具只提供候选方向和申报资料草稿。发货前请使用目标市场官方关税系统或交由货代、报关行确认。'
              : 'This tool provides candidate directions and a customs brief. Confirm the code in the official tariff system or with your broker before shipment.'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <PackageCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              {isZh ? '商品信息' : 'Product details'}
            </h2>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '商品名称' : 'Product name'}
              </label>
              <input
                value={form.productName}
                onChange={(event) => setField('productName', event.target.value)}
                placeholder={isZh ? '例如：可折叠硅胶水杯' : 'e.g. Foldable silicone drinking cup'}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '主要材质' : 'Main material'}
              </label>
              <input
                value={form.material}
                onChange={(event) => setField('material', event.target.value)}
                placeholder={isZh ? '例如：食品级硅胶杯身，塑料杯盖' : 'e.g. Food-grade silicone body, plastic lid'}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '用途' : 'Product use'}
              </label>
              <textarea
                value={form.productUse}
                onChange={(event) => setField('productUse', event.target.value)}
                placeholder={isZh ? '例如：户外旅行饮水，可重复使用' : 'e.g. Reusable drinking cup for outdoor travel'}
                className="min-h-[82px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '目标市场' : 'Destination market'}
              </label>
              <select
                value={form.targetMarket}
                onChange={(event) => setField('targetMarket', event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {markets.map((market) => (
                  <option key={market.value} value={market.value}>
                    {isZh ? market.zh : market.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isZh ? '商品形态' : 'Product form'}
              </label>
              <select
                value={form.productForm}
                onChange={(event) => setField('productForm', event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {productForms.map((item) => (
                  <option key={item.value} value={item.value}>
                    {isZh ? item.zh : item.en}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ['battery', isZh ? '是否带电池' : 'Battery'],
              ['electronics', isZh ? '是否含电子元件' : 'Electronics'],
              ['setSold', isZh ? '是否成套销售' : 'Sold as set'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</label>
                <select
                  value={form[field as keyof FormState] as string}
                  onChange={(event) => setField(field as keyof FormState, event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="No">{isZh ? '否' : 'No'}</option>
                  <option value="Yes">{isZh ? '是' : 'Yes'}</option>
                  <option value="Unsure">{isZh ? '不确定' : 'Unsure'}</option>
                </select>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-300" />
              {isZh ? '风险因素' : 'Risk flags'}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {riskFlagOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-amber-300 dark:border-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={form.riskFlags.includes(option.value)}
                    onChange={() => toggleRiskFlag(option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  {isZh ? option.zh : option.en}
                </label>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <input
              value={form.packageContents}
              onChange={(event) => setField('packageContents', event.target.value)}
              placeholder={isZh ? '包装内包含物，例如杯身 + 杯盖' : 'Package contents, e.g. cup body + lid'}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={form.userGroup}
              onChange={(event) => setField('userGroup', event.target.value)}
              placeholder={isZh ? '使用人群，例如成人户外用户' : 'User group, e.g. adult outdoor users'}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={form.brandModel}
              onChange={(event) => setField('brandModel', event.target.value)}
              placeholder={isZh ? '品牌或型号，可选' : 'Brand or model, optional'}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={form.unitWeight}
              onChange={(event) => setField('unitWeight', event.target.value)}
              placeholder={isZh ? '单件重量，可选' : 'Unit weight, optional'}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </section>

          <button
            onClick={analyzeProduct}
            disabled={!canSubmit || loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchCheck className="h-4 w-4" />}
            {isZh ? '分析商品申报资料' : 'Analyze product'}
          </button>
        </div>

        <div className="min-h-[620px] rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {error ? (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
              <p className="text-sm font-medium">{isZh ? '正在整理候选方向和申报描述...' : 'Building candidate directions and customs text...'}</p>
            </div>
          ) : null}

          {!loading && !result ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
              <ClipboardList className="mb-4 h-14 w-14 text-slate-300 dark:text-slate-700" />
              <p className="max-w-md text-sm leading-6">
                {isZh
                  ? '填写商品名称、材质和用途后，工具会生成英文报关品名、商业发票描述、候选编码方向和需要确认的问题。'
                  : 'Enter the product name, material, and use to generate a customs name, invoice description, candidate code directions, and questions to confirm.'}
              </p>
            </div>
          ) : null}

          {!loading && result ? (
            <div className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
                    <FileText className="h-4 w-4 text-amber-600" />
                    {isZh ? '商品申报摘要' : 'Customs brief'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {result.riskLevel ? (
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                        {isZh ? '风险等级' : 'Risk'}: {localizedLevel(result.riskLevel, isZh)}
                      </span>
                    ) : null}
                    <button
                      onClick={() => copyToClipboard(allResultText, 'all')}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {copiedField === 'all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === 'all' ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制全部' : 'Copy all')}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {[
                    [isZh ? '英文报关品名' : 'Customs item name', result.customsName, 'customsName'],
                    [isZh ? '英文发票描述' : 'Commercial invoice description', result.invoiceDescription, 'invoiceDescription'],
                  ].map(([label, value, field]) => (
                    <div key={field} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
                        <button onClick={() => copyToClipboard(String(value || ''), String(field))} className="text-slate-400 hover:text-amber-600">
                          {copiedField === field ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-sm leading-6 text-slate-800 dark:text-slate-200">{value || '-'}</p>
                    </div>
                  ))}
                </div>
                {result.classificationBrief ? (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{isZh ? '分类说明' : 'Classification brief'}</p>
                      <button onClick={() => copyToClipboard(result.classificationBrief || '', 'classificationBrief')} className="text-slate-400 hover:text-amber-600">
                        {copiedField === 'classificationBrief' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{result.classificationBrief}</p>
                  </div>
                ) : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '候选编码方向' : 'Candidate code directions'}</h2>
                {result.candidates?.length ? (
                  result.candidates.map((candidate, index) => (
                    <article key={`${candidate.codePattern}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-slate-950 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                              {candidate.codePattern || `Candidate ${index + 1}`}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${confidenceClass(candidate.confidence)}`}>
                              {localizedLevel(candidate.confidence, isZh)}
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{candidate.whyItMayFit || (isZh ? '需要结合材质、用途和目标市场进一步复核。' : 'Review this direction against material, use, and destination-market rules.')}</p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    {isZh ? '当前信息不足，AI 未给出候选方向。请补充材质、用途、成套情况或电子元件信息后重试。' : 'The current information is not enough for candidate directions. Add material, use, set details, or electronics information and try again.'}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white">{isZh ? '下一步确认' : 'Next checks'}</h2>
                  <button
                    onClick={() => copyToClipboard(reviewItemsText, 'reviewItems')}
                    disabled={!reviewItemsText}
                    className="text-slate-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copiedField === 'reviewItems' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {reviewItems.length ? (
                  <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {reviewItems.map((item, index) => (
                      <li key={`${item.label}-${item.text}-${index}`} className="flex gap-3">
                        <span className={`mt-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.tone === 'rose' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'}`}>
                          {item.label}
                        </span>
                        <span className="flex-1">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {isZh ? '当前没有明显缺失项。仍建议把候选方向交给货代或报关行复核。' : 'No obvious missing fields. Still send the candidate direction to a broker or freight forwarder for review.'}
                  </p>
                )}
              </section>

              <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  {isZh ? '复核提示' : 'Verification note'}
                </div>
                <p>{result.disclaimer || (isZh ? '本结果是 AI 辅助参考，不是海关裁定。请在目标市场官方系统中复核。' : 'This result is an AI-assisted reference, not a customs ruling. Verify it in the official tariff system.')}</p>
                <a
                  href={result.officialLookup?.url || selectedOfficialLookup.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-amber-800 underline underline-offset-4 dark:text-amber-200"
                >
                  {result.officialLookup?.label || selectedOfficialLookup.label}
                </a>
              </section>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}
