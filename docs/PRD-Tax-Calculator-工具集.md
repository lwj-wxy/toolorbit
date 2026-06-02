# PRD：Tax Calculator 工具集

> 作者：Codex  
> 日期：2026-05-28  
> 版本：v1.0  
> 当前站点：toolorbit  
> 目标模块：VAT / Sales Tax / GST 计算器集群

---

## 1. 概述

### 1.1 背景

`VAT / Sales Tax Calculator` 适合做工具站的 programmatic SEO：用户搜索意图明确、计算公式稳定、国家和地区维度可扩展，例如 UK VAT、EU VAT、US sales tax by state。

但单个泛用税费计算器的搜索覆盖有限。下一阶段应围绕同一套税费计算能力，补充“加税、去税、含税价、税前价、国家/地区税率”相关工具，形成可复用的 Tax Calculator 工具集。

### 1.2 核心判断

第一阶段不做复杂税务系统，不做税务合规建议。优先开发确定性强、公式简单、可验证、可复用的计算器页面。

优先级排序：

1. Reverse VAT / Sales Tax Calculator
2. VAT Inclusive / Exclusive Price Calculator
3. Country VAT Calculator Pages
4. GST Calculator Pages

---

## 2. 产品目标

### 2.1 业务目标

- 增加税费计算器类工具页面数量，提升长尾 SEO 覆盖。
- 复用同一套税费计算逻辑，降低后续新增国家/地区页面的开发成本。
- 为 UK VAT、EU VAT、US sales tax by state、GST by country 等 programmatic 页面建立统一模板。
- 提升 Adsense 适配度，覆盖高商业意图的信息型搜索流量。

### 2.2 用户目标

用户可以快速完成以下计算：

- 给税前价加上 VAT / sales tax。
- 从含税价中反推出税前价。
- 计算税额本身。
- 按国家或地区预设税率完成常见计算。
- 查看税率来源和最后更新时间。

### 2.3 非目标

第一版不包含：

- 用户登录。
- 保存计算历史。
- 发票生成。
- ZIP code 级美国销售税精确查询。
- 商品分类税率自动判断。
- 税务申报、税务建议或合规判断。
- 多语言版本。

---

## 3. 开发范围

### 3.1 MVP 范围

MVP 只开发前三项中的最小可用版本：

1. `Reverse VAT / Sales Tax Calculator`
2. `VAT Inclusive / Exclusive Price Calculator`
3. `UK VAT Calculator`

MVP 需要抽出通用 tax calculation engine，供后续 EU、US、GST 页面复用。

### 3.2 后续扩展范围

第二阶段：

- Germany VAT Calculator
- France VAT Calculator
- Spain VAT Calculator
- Italy VAT Calculator
- Netherlands VAT Calculator
- Ireland VAT Calculator

第三阶段：

- `GST Calculator`
  - 支持国家切换：Australia / Canada / New Zealand / Singapore / India
  - 复用统一 tax calculation engine
  - 根据国家切换默认税率、货币、税种名称与说明文案
- 国家落地页：
  - Australia GST Calculator
  - Canada GST / HST Calculator
  - New Zealand GST Calculator
  - Singapore GST Calculator
  - India GST Calculator

---

## 4. 功能需求

### 4.1 通用输入项

所有税费计算器页面默认包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| Amount | number | 输入金额 |
| Tax rate | number | 税率百分比 |
| Calculation mode | segmented control | `Add tax` / `Remove tax` |
| Currency | select | 货币符号 |

货币选项：

- GBP
- EUR
- USD
- AUD
- CAD
- NZD
- SGD

### 4.2 通用输出项

计算结果展示：

| 字段 | 说明 |
|------|------|
| Net amount | 税前金额 |
| Tax amount | 税额 |
| Gross amount | 含税金额 |
| Formula | 当前计算公式说明 |

操作能力：

- Copy result
- Reset
- 税率 preset 点击填入

### 4.3 计算模式

#### Add tax

适用于用户已知税前金额，需要加上税费。

```text
gross = net * (1 + rate)
tax = gross - net
```

#### Remove tax

适用于用户已知含税金额，需要反推税前金额。

```text
net = gross / (1 + rate)
tax = gross - net
```

### 4.4 输入校验

校验规则：

- Amount 不能为空。
- Amount 必须为数字。
- Amount 不允许为负数。
- Tax rate 不能为空。
- Tax rate 必须为数字。
- Tax rate 范围为 `0% - 100%`。
- Tax rate 支持小数，例如 `8.875%`。

错误展示：

- 使用 inline validation。
- 输入非法时不展示错误计算结果。
- 错误文案应明确说明需要修正的字段。

### 4.5 金额格式

展示规则：

- 默认保留 2 位小数。
- 内部计算保留足够精度，避免中间步骤过早四舍五入。
- 输出金额带货币符号。
- 大额数字使用千分位分隔。

---

## 5. 页面需求

### 5.1 Reverse VAT / Sales Tax Calculator

核心用途：

用户输入含税价格和税率，反推出税前价和税额。

目标关键词：

- reverse VAT calculator
- remove VAT from price
- reverse sales tax calculator
- take VAT off price
- 20% VAT reverse calculator

默认模式：

- `Remove tax`

页面重点：

- 第一屏直接显示计算器。
- 解释 reverse VAT 的公式。
- 提供常见税率 preset，例如 `20%`、`19%`、`10%`、`8.875%`。

### 5.2 VAT Inclusive / Exclusive Price Calculator

核心用途：

用户在“含税价”和“税前价”之间转换。

目标关键词：

- VAT inclusive calculator
- VAT exclusive calculator
- add VAT calculator
- remove VAT calculator
- tax inclusive calculator
- tax exclusive calculator

默认模式：

- 支持 `Add tax` 和 `Remove tax` 切换。

页面重点：

- 模式切换清晰。
- 公式说明跟随模式变化。
- 可复用 Reverse VAT / Sales Tax Calculator 的核心逻辑。

### 5.3 UK VAT Calculator

核心用途：

用户使用 UK VAT 常见税率计算税前价、税额、含税价。

默认税率 preset：

| 税率 | 说明 |
|------|------|
| 20% | Standard rate |
| 5% | Reduced rate |
| 0% | Zero rate |

页面必须包含：

- 当前 UK VAT 标准税率。
- reduced rate 和 zero rate 的简要说明。
- 来源链接。
- Last checked 日期。
- 非税务建议声明。

---

## 6. SEO 需求

### 6.1 URL 规划

建议 URL：

```text
/tools/reverse-vat-calculator
/tools/vat-inclusive-exclusive-calculator
/tools/uk-vat-calculator
/tools/eu-vat-calculator
/tools/us-sales-tax-calculator
/tools/sales-tax-calculator/california
```

### 6.2 页面结构

每个工具页包含：

- H1：明确工具名称。
- 简短说明：说明工具能算什么。
- 计算器主体。
- 公式说明。
- FAQ。
- 来源与更新时间。
- disclaimer。

约束：

- 每页只能有一个 H1。
- Title 和 description 必须匹配页面工具。
- FAQ 不堆关键词。
- 涉及具体税率的页面必须展示来源和更新时间。
- 页面不能暗示结果为官方税务建议。

### 6.3 FAQ 示例

可复用问题：

- How do I remove VAT from a price?
- How do I calculate VAT backwards?
- What is the formula for reverse VAT?
- What is the difference between VAT inclusive and VAT exclusive?
- Is sales tax calculated before or after discounts?
- Why can US sales tax vary by city or county?

---

## 7. 数据来源要求

### 7.1 来源展示规则

每个涉及具体税率的页面必须展示：

| 字段 | 说明 |
|------|------|
| Source | 税率来源 |
| Last checked | 本站最后核对日期 |
| Effective date | 来源提供时展示 |
| Note | 税率适用范围或限制 |

### 7.2 推荐来源

| 地区 | 推荐来源 |
|------|----------|
| EU VAT | European Commission VAT rates |
| UK VAT | GOV.UK / HMRC VAT guide |
| US sales tax | Tax Foundation state sales tax rates，后续可补各州官方来源 |

来源链接：

- [European Commission VAT rates](https://taxation-customs.ec.europa.eu/taxation/vat/vat-rates_en)
- [GOV.UK VAT guide](https://www.gov.uk/guidance/vat-guide-notice-700)
- [Tax Foundation 2026 State Sales Tax Rates](https://taxfoundation.org/data/all/state/sales-tax-rates/)

### 7.3 内容免责声明

建议文案：

```text
This calculator is for general information and quick estimates only. Tax rates and rules can change, and actual tax treatment may depend on your location, product category, and transaction details. This is not tax advice.
```

---

## 8. UI 与交互需求

### 8.1 布局

页面第一屏直接显示计算器，不做营销型 hero。

桌面端：

- 左侧为输入区域。
- 右侧为结果区域。
- 下方展示公式、FAQ、来源。

移动端：

- 输入区和结果区纵向排列。
- 数字输入框高度足够，方便触控。
- Copy result 不遮挡结果。
- 文本不能溢出容器。

### 8.2 控件

推荐控件：

- 计算模式使用 segmented control。
- 货币选择使用 select。
- 常见税率使用 preset buttons。
- Copy result 使用带图标按钮。
- Reset 使用次级按钮。

### 8.3 状态

页面需要覆盖：

- 默认状态。
- 输入中状态。
- 计算成功状态。
- 输入错误状态。
- 复制成功状态。

---

## 9. 技术需求

### 9.1 计算逻辑

建议抽出通用方法：

- `calculateTaxAmount`
- `calculateTaxFromNet`
- `calculateTaxFromGross`
- `formatCurrencyAmount`

页面内简单读取 query 或表单值时，不额外抽无意义包装函数。

### 9.2 数据结构

建议建立税率数据结构：

```ts
type TaxRatePreset = {
  label: string;
  rate: number;
  description?: string;
};

type TaxJurisdiction = {
  slug: string;
  name: string;
  countryCode: string;
  currency: string;
  rates: TaxRatePreset[];
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
  effectiveDate?: string;
  note?: string;
};
```

### 9.3 精度处理

要求：

- rate 以百分比输入，计算时转为小数。
- 内部计算不直接依赖展示字符串。
- 展示层统一处理四舍五入。

---

## 10. 验收标准

### 10.1 功能验收

必须通过以下用例：

| 输入 | 税率 | 模式 | 期望输出 |
|------|------|------|----------|
| 100 | 20% | Add tax | net 100, tax 20, gross 120 |
| 120 | 20% | Remove tax | net 100, tax 20, gross 120 |
| 108.875 | 8.875% | Remove tax | 可正确处理小数税率 |
| 空金额 | 20% | 任意 | 显示错误提示 |
| -100 | 20% | 任意 | 显示错误提示 |
| 100 | 101% | 任意 | 显示错误提示 |

### 10.2 SEO 验收

- 页面 title 与工具名称一致。
- 页面 description 清楚描述功能。
- 页面只有一个 H1。
- FAQ 覆盖真实搜索问题。
- UK VAT 页面展示来源和最后核对日期。
- 所有具体税率页面包含 disclaimer。

### 10.3 交付验收

- 只包含本需求相关变更。
- 不删除既有页面、路由、导入导出或样式块。
- 中文文档显示正常，无乱码。
- 不默认执行 `npm run dev`、`npm run build`、`npm run build:prod`、`npm run build:testing`。

---

## 11. 开发顺序

建议按以下顺序开发：

1. 建立通用 tax calculation engine。
2. 开发 `Reverse VAT / Sales Tax Calculator` 页面。
3. 开发 `VAT Inclusive / Exclusive Price Calculator` 页面。
4. 增加 UK VAT preset。
5. 开发 `UK VAT Calculator` 页面。
6. 补充 FAQ、source、last updated、disclaimer。
7. 扩展 EU country VAT pages。
8. 扩展 GST country pages。

---

## 12. 风险与约束

### 12.1 税率维护风险

税率会变化，页面必须显示来源和最后更新时间。第一版避免承诺自动实时更新。

### 12.2 美国销售税精度风险

US sales tax 可能因 city、county、district 变化。第一版只做 state-level 或 estimated combined rate，并明确说明不是结账级精确税率。

### 12.3 内容合规风险

页面不能写成税务建议。所有信息型内容必须强调 quick estimate 和 general information。

### 12.4 页面重复风险

Programmatic 页面要避免只有税率数字不同。每个国家或州页面至少应包含：

- 本地税率 preset。
- 本地来源。
- 适用范围说明。
- 常见问题或限制说明。
