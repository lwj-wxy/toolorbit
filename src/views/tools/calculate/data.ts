import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const CALCULATE_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'unit-converter': {
    zh: {
      summary:
        '单位换算工具用于在长度、重量、体积、面积、速度、功率、数据存储和温度等常见计量单位之间进行即时换算，覆盖工程、物流、学习与日常生活场景。适合跨地区商品规格整理（如英寸转厘米、磅转千克）、工程草图尺寸校对（英尺转米）、食谱与物流体积换算（加仑转升、品脱转毫升）、学习材料中的单位题目检查与验证、能源与功率单位的工程换算（瓦特转马力、焦耳转卡路里）、数字存储单位的快速转换（字节转千字节/兆字节/千兆字节），以及将英制、美制和公制数据统一到同一表达方式。工具根据当前分类加载对应单位组，输入数值后实时计算目标单位结果，避免手动切换换算公式或在外部分散工具间往复操作的繁琐，所有计算均在浏览器本地完成。',
      input:
        '需要换算的数值（支持正数、小数和科学计数法）、单位分类（长度、重量、体积、面积、速度、功率、能量/热量、数据存储和温度）、源单位和目标单位。长度分类支持米、千米、厘米、毫米、微米、纳米、英寸、英尺、码、英里和海里；重量分类支持克、千克、毫克、微克、吨、磅和盎司；体积分类支持升、毫升、立方米、立方厘米、加仑（美制）、加仑（英制）、品脱（美制）、品脱（英制）和液体盎司；面积分类支持平方米、平方千米、平方厘米、平方毫米、公顷、英亩、平方英尺和平方英寸；速度分类支持米/秒、千米/小时、英里/小时（mph）、节（knot）和马赫；功率分类支持瓦特、千瓦、马力（公制）和马力（英制）；能量/热量分类支持焦耳、千焦、卡路里、千卡（大卡）和英热单位（BTU）；数据存储分类支持位、字节、千字节（KB）、兆字节（MB）、千兆字节（GB）、太字节（TB）和拍字节（PB），提供二进制（1024 进制）与十进制（1000 进制）两种换算标准；温度分类支持摄氏、华氏和开尔文。切换分类时会自动重置为该分类下的默认单位配对，用户也可以点击交换按钮将源单位与目标单位互换以反向换算。',
      output:
        '目标单位下的等价值，保留合理有效数字并可根据需要切换精度。线性单位通过基准单位进行间接换算，保证不同单位之间的结果一致性；温度换算使用摄氏、华氏、开尔文之间的专用公式（包含偏移量），避免将温度误当作普通倍数换算而导致结果偏差。所有换算结果均可一键复制，方便直接粘贴至工程文档、物流表单、学习笔记或规格说明书中。',
      processing:
        '线性单位（长度、重量、体积、面积、速度、功率、能量、数据存储）采用"源单位换算系数 → 基准单位 → 目标单位换算系数"的三段式计算管线，通过预定义的换算系数表查表实现快速转换，避免逐级累积误差。温度单位采用独立转换函数处理偏移量和比例因子：摄氏转华氏为 °F = °C × 9/5 + 32，华氏转摄氏为 °C = (°F - 32) × 5/9，开尔文与摄氏之间为线性偏移（K = °C + 273.15，°C = K - 273.15），华氏转开尔文通过摄氏为中间桥梁。数据存储分类额外提供二进制标准（1 KB = 1024 Byte、1 MB = 1024 KB 等，符合 IEC 标准，即 KiB/MiB/GiB 的实际含义）和十进制标准（1 KB = 1000 Byte、1 MB = 1000 KB 等，符合 SI 国际单位制，常见于硬盘制造商容量标注）两种换算选项，用户可根据场景选择正确的基准。组件状态变化时在浏览器内同步重新计算，不依赖服务端接口，也不会上传输入数据，确保离线可用和数据安全。',
      modes: ['长度换算', '重量换算', '体积换算', '面积换算', '速度换算', '功率换算', '能量/热量换算', '数据存储换算（二/十进制）', '温度换算', '源/目标单位互换', '实时结果', '一键复制输出'],
      example: {
        title: '单位换算输入到输出示例',
        input: '分类: 长度\n输入: 12\n源单位: 英寸\n目标单位: 厘米',
        output: '30.48 厘米',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Unit Converter performs instant conversions across common measurement categories — length, weight, volume, area, speed, power, energy, data storage, and temperature — covering engineering, logistics, education, and everyday scenarios. Suitable for normalizing product specifications across regions (e.g. inches to centimeters, pounds to kilograms), checking dimensions in engineering sketches (feet to meters), converting recipe or logistics volume values (gallons to liters, pints to milliliters), reviewing and verifying unit exercises in learning materials, performing engineering conversions for energy and power (watts to horsepower, joules to calories), quickly converting digital storage units (bytes to KB/MB/GB), and aligning imperial, US customary, and metric data into a single format. The tool loads the correct unit set for the selected category and recalculates the target value in real time as you type, eliminating the need to switch formulas manually or jump between separate external tools. All calculations run locally in the browser.',
      input:
        'The numeric value to convert (supports positive numbers, decimals, and scientific notation), a unit category (Length, Weight, Volume, Area, Speed, Power, Energy/Heat, Data Storage, and Temperature), a source unit, and a target unit. Length supports meter, kilometer, centimeter, millimeter, micrometer, nanometer, inch, foot, yard, mile, and nautical mile. Weight supports gram, kilogram, milligram, microgram, tonne, pound, and ounce. Volume supports liter, milliliter, cubic meter, cubic centimeter, gallon (US), gallon (UK), pint (US), pint (UK), and fluid ounce. Area supports square meter, square kilometer, square centimeter, square millimeter, hectare, acre, square foot, and square inch. Speed supports meter/second, kilometer/hour, mile/hour (mph), knot, and Mach. Power supports watt, kilowatt, metric horsepower, and imperial horsepower. Energy/Heat supports joule, kilojoule, calorie, kilocalorie (Cal), and British Thermal Unit (BTU). Data Storage supports bit, byte, kilobyte (KB), megabyte (MB), gigabyte (GB), terabyte (TB), and petabyte (PB), with both binary (1024-based) and decimal (1000-based) conversion standards. Temperature supports Celsius, Fahrenheit, and Kelvin. Changing the category automatically resets the unit selectors to sensible defaults for that category, and a swap button reverses the source and target units for inverse conversion.',
      output:
        'The equivalent value in the target unit, displayed with reasonable significant digits and adjustable precision. Linear units are converted indirectly through a base unit to ensure consistency across different unit pairs. Temperature conversions use dedicated formulas between Celsius, Fahrenheit, and Kelvin that include offset terms, preventing the incorrect treatment of temperature as a simple multiplier conversion. All results can be copied with one click for direct pasting into engineering documents, logistics forms, study notes, or specification sheets.',
      processing:
        'Linear units (length, weight, volume, area, speed, power, energy, data storage) use a three-stage calculation pipeline: source unit factor → base unit → target unit factor, with pre-defined conversion-coefficient lookup tables for fast conversion while avoiding cumulative rounding errors. Temperature units use independent conversion functions that correctly handle both offset and scale: Celsius to Fahrenheit is °F = °C × 9/5 + 32, Fahrenheit to Celsius is °C = (°F − 32) × 5/9, Kelvin and Celsius share a linear offset (K = °C + 273.15, °C = K − 273.15), and Fahrenheit to Kelvin uses Celsius as an intermediate bridge. The Data Storage category additionally provides both binary standard (1 KB = 1024 Byte, 1 MB = 1024 KB, etc., following the IEC standard and reflecting the actual meaning of KiB/MiB/GiB) and decimal standard (1 KB = 1000 Byte, 1 MB = 1000 KB, etc., following SI International System of Units, commonly used by hard-drive manufacturers for capacity labeling), allowing the user to select the appropriate base for the scenario. State changes trigger synchronous browser-side recalculation without server requests or data uploads, ensuring offline availability and data security.',
      modes: ['Length conversion', 'Weight conversion', 'Volume conversion', 'Area conversion', 'Speed conversion', 'Power conversion', 'Energy/Heat conversion', 'Data storage (binary/decimal)', 'Temperature conversion', 'Swap source/target units', 'Live result', 'One-click copy output'],
      example: {
        title: 'Unit conversion input-to-output example',
        input: 'Category: Length\nInput: 12\nSource unit: inch\nTarget unit: centimeter',
        output: '30.48 centimeters',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'reverse-vat-calculator': {
    zh: {
      summary:
        'Reverse VAT / Sales Tax Calculator（反向增值税/销售税计算器）是一款专注于从含税价格中反推出税前金额和税额的专业工具，适用于跨境电商卖家核对平台含税订单、财务人员审核供应商含税发票、个人消费者查验购物小票中的税费构成、以及任何需要从已含税标价中剥离税费的商业场景。用户只需输入含税总价和目标税率，工具即自动套用反向去税公式 net = gross / (1 + rate) 计算出税前净额，并同步展示税额与含税总额的完整对账信息。支持英国 VAT（20%）、欧盟各国 VAT（19% 起）、美国各州 sales tax（如纽约 8.875%）等全球常见税率，同时内置 GBP、EUR、USD、AUD、CAD、NZD、SGD 七种主流结算货币的格式化展示，确保跨境电商和外贸场景中的金额表达规范统一。无论是电商卖家核对 Amazon、eBay、Etsy、Shopify 等平台的含税销售收入，还是进出口贸易商核算关税完税价格，亦或是普通消费者想了解购物小票中实际税费占比，均可通过本工具快速获得精准的税费拆解结果，无需手动推导公式或在 Excel 中建立计算表格。',
      input:
        '输入金额、税率百分比、计算模式和货币。该工具默认使用 Remove tax 模式，并提供 20%、19%、10%、8.875% 等常见税率按钮，支持小数税率和多币种展示。',
      output:
        '输出税前金额、税额、含税金额和当前公式。金额统一保留两位小数、带货币符号并使用千分位展示；非法输入会显示字段级错误，不展示误导性结果。',
      processing:
        'Remove tax 模式使用 net = gross / (1 + rate)，tax = gross - net。rate 以百分比输入，在计算时转换为小数；内部计算保留 number 精度，展示层统一格式化。复制结果会把模式、税率、三项金额和公式写入剪贴板。',
      modes: ['反向去税', 'Add tax / Remove tax 切换', '小数税率', '税率 preset', '多币种格式化', '字段级校验', '复制结果'],
      example: {
        title: '反向 VAT 计算示例',
        input: 'Amount: 120\nTax rate: 20%\nMode: Remove tax\nCurrency: GBP',
        output: 'Net amount: £100.00\nTax amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Reverse VAT / Sales Tax Calculator is a specialized tool for stripping value-added tax or sales tax from a tax-inclusive price to recover the pre-tax net amount and the tax component. It is essential for cross-border ecommerce sellers reconciling platform orders that include VAT, accountants and bookkeepers verifying supplier invoices with embedded tax, business owners separating deductible VAT from gross revenue, and consumers who want to understand how much tax they are actually paying on a purchase. Enter the gross (tax-inclusive) amount and the applicable tax rate, and the tool applies the standard reverse-VAT formula — net = gross / (1 + rate) — to calculate the net price and the tax amount in real time. It supports global tax rates including UK VAT (20%), EU member state VAT (from 17% to 27%), US state and local sales tax (e.g. 8.875% for New York City), Australian GST (10%), and Canadian GST/HST, making it a versatile companion for international trade and ecommerce. Seven major settlement currencies — GBP, EUR, USD, AUD, CAD, NZD, and SGD — are available with locale-aware formatting (symbols, thousands separators, and two-decimal-place precision). Whether you are a seller on Amazon, eBay, Etsy, or Shopify tracking tax-inclusive revenue, an importer or exporter verifying duty-paid values, or an individual checking a receipt to see the embedded tax, this calculator delivers a clean, instant tax breakdown without the need for manual formulas or spreadsheet setup.',
      input:
        'Enter an amount, tax rate percentage, calculation mode, and currency. The tool defaults to Remove tax and includes common presets such as 20%, 19%, 10%, and 8.875%, with support for decimal tax rates and multiple currency display formats.',
      output:
        'The result shows net amount, tax amount, gross amount, and the active formula. Values are formatted with currency symbols, thousands separators, and two decimal places. Invalid input displays inline validation and suppresses calculation output.',
      processing:
        'Remove tax uses net = gross / (1 + rate), tax = gross - net. The rate is entered as a percentage and converted to a decimal for calculation. Internal calculations use numeric precision and formatting is centralized at display time. Copy result writes the mode, rate, three amounts, and formula to the clipboard.',
      modes: ['Reverse tax removal', 'Add tax / Remove tax toggle', 'Decimal tax rates', 'Rate presets', 'Multi-currency formatting', 'Inline validation', 'Copy result'],
      example: {
        title: 'Reverse VAT calculation example',
        input: 'Amount: 120\nTax rate: 20%\nMode: Remove tax\nCurrency: GBP',
        output: 'Net amount: £100.00\nTax amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'vat-inclusive-exclusive-calculator': {
    zh: {
      summary:
        'VAT Inclusive / Exclusive Price Calculator（含税/不含税价格换算器）是一款帮助用户在含税价（VAT-inclusive）与不含税价（VAT-exclusive）之间双向转换的专业工具，特别适合跨境电商卖家和外贸企业在不同定价体系之间快速切换。在 B2B 批发和国际贸易场景中，报价通常采用不含税价格（net price / VAT-exclusive），而面向终端消费者的 B2C 零售场景中，标价大多已包含 VAT（gross price / VAT-inclusive）——两种定价模式之间的换算常常成为订单核对、报价比对和利润核算中的痛点。本工具提供 Add tax（加税）和 Remove tax（去税）两种模式，一键切换即可完成税前 ↔ 含税的双向转换，无需在多个计算器之间来回操作。用户输入金额和税率后，工具同步输出净额（net amount）、税额（tax amount）和含税总额（gross amount）三项完整数据，并随模式变化展示对应的计算公式，方便审计和核对。支持 0% 到 100% 之间任意小数税率（如 8.875%、19.6% 等各国实际税率），覆盖 UK VAT、EU VAT、GST、sales tax 等全球主流税制，内置 GBP、EUR、USD 等七种货币的本地化金额格式。适合电商卖家在平台定价时统一含税/不含税表达、采购人员在比价时将不同供应商的含税报价标准化为税前价、财务人员在制作报价单和形式发票时快速核验金额一致性、以及外贸从业者在不同税制国家之间进行价格对标和利润测算。',
      input:
        '输入金额、税率、货币并选择 Add tax 或 Remove tax。Add tax 将输入视为税前价；Remove tax 将输入视为含税价。税率支持 0 到 100 之间的小数。',
      output:
        '输出 net amount、tax amount、gross amount 和随模式变化的公式说明。结果可复制，重置按钮会恢复默认金额、税率、货币和模式。',
      processing:
        'Add tax 模式计算 gross = net x (1 + rate)，Remove tax 模式计算 net = gross / (1 + rate)。两种模式复用同一个 tax calculation engine，避免后续国家税率页面重复实现公式。',
      modes: ['含税价换算', '税前价换算', 'Add tax', 'Remove tax', '税率 preset', '多币种展示', '复制结果'],
      example: {
        title: '含税/税前价格换算示例',
        input: 'Amount: 100\nTax rate: 20%\nMode: Add tax',
        output: 'Net amount: £100.00\nTax amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The VAT Inclusive / Exclusive Price Calculator is a dual-mode conversion tool that lets you switch seamlessly between tax-inclusive (gross) and tax-exclusive (net) pricing — a daily necessity for cross-border ecommerce sellers, international B2B traders, procurement professionals, and accountants working across jurisdictions with different VAT display conventions. In B2B wholesale and international trade, quotes are typically presented as net prices (VAT-exclusive), whereas B2C retail prices shown to consumers almost always include VAT (gross / VAT-inclusive). Reconciling these two pricing conventions is a frequent source of confusion and spreadsheet errors. This tool solves that with two clear modes: Add tax — enter a net amount to calculate the gross (tax-inclusive) price; and Remove tax — enter a gross amount to strip out the VAT and recover the net price. Both modes display the full three-figure breakdown (net amount, tax amount, and gross amount) along with the active formula so you can audit the calculation at a glance. Decimal tax rates from 0% to 100% are supported with full precision — enter 8.875% for New York sales tax, 19.6% for historical French VAT, or any jurisdiction-specific rate. Seven currencies (GBP, EUR, USD, AUD, CAD, NZD, SGD) are available with proper locale formatting including currency symbols, thousands separators, and two-decimal-place precision. Ideal for ecommerce sellers normalizing platform prices to a consistent tax-display convention, procurement teams standardizing supplier quotes for comparison, accountants preparing pro-forma invoices and quotations, and international traders performing price benchmarking and margin analysis across tax regimes.',
      input:
        'Enter an amount, tax rate, currency, and choose Add tax or Remove tax. Add tax treats the input as the net price; Remove tax treats the input as the tax-inclusive gross price. Decimal rates from 0 to 100 are supported.',
      output:
        'The result shows net amount, tax amount, gross amount, and the formula for the selected mode. Results can be copied, and reset restores the default amount, rate, currency, and mode.',
      processing:
        'Add tax calculates gross = net x (1 + rate), while Remove tax calculates net = gross / (1 + rate). Both modes reuse the same tax calculation engine so future country and regional tax pages can share the formula layer.',
      modes: ['VAT inclusive conversion', 'VAT exclusive conversion', 'Add tax', 'Remove tax', 'Rate presets', 'Multi-currency display', 'Copy result'],
      example: {
        title: 'Inclusive/exclusive price example',
        input: 'Amount: 100\nTax rate: 20%\nMode: Add tax',
        output: 'Net amount: £100.00\nTax amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'country-vat-calculator': {
    zh: {
      summary:
        'Country VAT Calculator（国家 VAT 计算器）将英国、德国、法国、西班牙、意大利、荷兰和爱尔兰的 VAT preset 收敛到同一个工具中。用户先选择国家或地区，再使用该国家维护的标准税率、优惠税率或零税率 preset 进行 Add tax（从税前价推导含税价）或 Remove tax（从含税价反推税前价）计算。该结构避免把相同计算逻辑拆成多个重复工具，同时保留每个国家独立的税率、默认货币、来源链接、最后核对日期和适用范围说明，适合跨境电商定价、供应商报价核对、B2B/B2C 含税展示转换和财务快速估算。',
      input:
        '输入金额、选择国家或地区、选择 Add tax 或 Remove tax、选择展示货币，并使用当前国家的 VAT preset 填入税率。默认国家为英国，默认税率为 20%，默认货币为 GBP；切换到欧盟国家时会自动切换为 EUR 并加载对应税率 preset。',
      output:
        '输出 net amount、tax amount、gross amount、当前公式、所选国家税率说明、来源链接、Last checked 日期、Effective date（如有）和适用范围备注。',
      processing:
        'Add tax 模式使用 gross = net x (1 + rate)，Remove tax 模式使用 net = gross / (1 + rate)。税率以百分比输入，在计算时转换为小数。各国家税率 preset 和来源信息通过 TaxJurisdiction 数组维护，切换国家时同步替换 preset、默认货币和来源说明，计算逻辑保持同一套实现。',
      modes: ['国家切换', 'UK VAT preset', 'EU VAT preset', 'Add tax', 'Remove tax', '多币种格式化', '来源与更新时间', '复制结果'],
      example: {
        title: '国家 VAT 计算示例',
        input: 'Country: United Kingdom\nAmount: 100\nTax rate: 20%\nMode: Add tax\nCurrency: GBP',
        output: 'Net amount: £100.00\nVAT amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Country VAT Calculator consolidates UK, Germany, France, Spain, Italy, Netherlands, and Ireland VAT presets into one tool. Users choose a country or jurisdiction, then apply that country\'s maintained standard, reduced, super-reduced, or zero-rate presets in Add tax or Remove tax mode. This avoids splitting identical calculation logic into many duplicate tools while preserving country-specific rates, default currency, official source links, last checked dates, and scope notes. It is designed for cross-border ecommerce pricing, supplier quote checks, B2B/B2C tax-display conversion, and quick finance estimates.',
      input:
        'Enter an amount, choose a country or jurisdiction, choose Add tax or Remove tax, choose a display currency, and click the active country VAT preset. The default country is the United Kingdom with a 20% rate and GBP currency; switching to EU countries loads EUR and the selected country rates.',
      output:
        'The result shows net amount, VAT amount, gross amount, formula, selected-country rate notes, source link, last checked date, effective date when available, and scope note.',
      processing:
        'Add tax uses gross = net x (1 + rate), while Remove tax uses net = gross / (1 + rate). The rate is entered as a percentage and converted to a decimal for calculation. Country presets and source data are maintained through a TaxJurisdiction array, so changing country updates presets, default currency, and source notes while keeping one calculation implementation.',
      modes: ['Country switcher', 'UK VAT presets', 'EU VAT presets', 'Add tax', 'Remove tax', 'Multi-currency formatting', 'Source and update date', 'Copy result'],
      example: {
        title: 'Country VAT calculation example',
        input: 'Country: United Kingdom\nAmount: 100\nTax rate: 20%\nMode: Add tax\nCurrency: GBP',
        output: 'Net amount: £100.00\nVAT amount: £20.00\nGross amount: £120.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'time-converter': {
    zh: {
      summary:
        '时区时间转换工具用于将一个基准时间同步换算到多个目标时区，方便远程会议排期、跨境运营排班、海外发布窗口确认、客服覆盖时间规划、全球团队每日站会时间对齐，以及在不同城市之间校验日期是否跨天或是否落在当地法定节假日。工具基于 IANA 时区数据库（tz database）提供覆盖全球主要城市的精确时区选择，支持选择基准时区和时间，也支持一键填入当前系统时间，并在右侧面板同时展示多个目标时区的本地日期时间与相对 UTC 的标准偏移量，所有换算均在浏览器本地完成，不会读取或上传用户的日程信息。',
      input:
        '基准时区（如 Asia/Shanghai、America/New_York、Europe/London、Asia/Tokyo、Australia/Sydney 等主要 IANA 时区标识符）、基准日期时间（支持手动输入 YYYY-MM-DD HH:mm 格式，或通过浏览器日期时间选择器选择），以及右侧需要对照的目标时区列表。用户可以按需添加多个目标时区，支持删除或清空暂不需要查看的时区行；也可以通过一键填入按钮将基准时间设为当前本地时间，方便即时的跨时区沟通场景。',
      output:
        '每个目标时区对应三列信息：本地日期时间（精确到分钟）、时区 IANA 名称（如 Asia/Shanghai），以及相对 UTC 的标准偏移量（如 UTC+8）。右侧列表中的所有时区结果会在基准时间、基准时区或目标时区列表发生变化时立即同步更新，帮助用户快速判断会议是否落在对方工作时间段内、发布窗口是否可能跨越日期变更线、节假日是否会影响排期，以及不同地区之间的实际时差（含夏令时影响）。偏移量会根据所选日期是否处于夏令时区间自动校正，冬季和夏季可能展示不同的 UTC 偏移值。',
      processing:
        '基于 dayjs 及其 timezone 和 utc 插件在浏览器内完成全量换逄。首先将用户输入的基准日期时间与基准时区结合，解析为包含时区信息的 dayjs 对象；随后遍历目标时区列表，调用 dayjs.tz() 方法按 IANA 时区数据库规则将基准时间转换到每个目标时区的本地时间，同时提取该目标时区在该日期的 UTC 偏移量（格式化为 ±HH:mm）。夏令时规则、UTC 历史偏移变更和跨日日期处理由 dayjs 的 timezone 插件依据内嵌的 IANA 时区数据统一计算，页面仅负责组织输入状态、触发换算和渲染结果列表。整个换逄流程在浏览器本地同步执行，无需发送任何网络请求，用户输入的基准时间和选择的城市列表不会离开设备。',
      modes: ['基准时区设置', '当前时间一键填入', '多目标时区对照', 'UTC 偏移量显示（含夏令时校正）', '跨日提示', '添加/删除目标时区', '本地离线换算'],
      example: {
        title: '跨时区换算示例',
        input: '基准时区: Asia/Shanghai\n基准时间: 2026-05-21 09:00\n目标时区: America/New_York, Europe/London, Asia/Tokyo',
        output: 'New York: 2026-05-20 21:00 (UTC-4)\nLondon: 2026-05-21 02:00 (UTC+1)\nTokyo: 2026-05-21 10:00 (UTC+9)',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Time Zone Converter maps one base time to multiple target time zones simultaneously, convenient for remote meeting scheduling, cross-border operations shift planning, overseas release-window verification, customer support coverage planning, global team daily standup alignment, and checking whether dates roll over between cities or fall on local public holidays. The tool offers precise time zone selection based on the IANA Time Zone Database (tz database), covering major cities worldwide. It supports choosing a base time zone and time, filling the current system time with one click, and displaying local date-time values plus standard UTC offsets for multiple target zones in a side-by-side panel. All conversions run locally in the browser; no schedule data is read or uploaded.',
      input:
        'A base time zone (major IANA time zone identifiers such as Asia/Shanghai, America/New_York, Europe/London, Asia/Tokyo, Australia/Sydney, etc.), a base date and time (manually entered in YYYY-MM-DD HH:mm format or selected via the browser date-time picker), and a list of target time zones for comparison on the right-hand side. You can add multiple target zones as needed, and remove or clear individual rows that are no longer required. A one-click button sets the base time to the current local time for instant cross-timezone communication scenarios.',
      output:
        'Three columns of information for each target time zone: the local date and time (to the minute), the IANA time zone name (e.g. Asia/Shanghai), and the standard UTC offset (e.g. UTC+8). All results in the right-hand list update immediately when the base time, base time zone, or target time zone list changes, helping you quickly determine whether a meeting falls within the counterparty\'s working hours, whether a release window might cross the International Date Line, whether holidays will affect scheduling, and the actual time difference between regions including daylight saving time impacts. Offsets are automatically corrected based on whether the selected date falls within a DST period; different UTC offset values may be displayed for winter and summer months.',
      processing:
        'Uses dayjs with its timezone and utc plugins to perform all conversions in the browser. First, the user-supplied base date-time and base time zone are combined and parsed into a timezone-aware dayjs object. Then the target time zone list is iterated, and dayjs.tz() is called for each entry to convert the base time to the target zone\'s local time according to IANA Time Zone Database rules, while also extracting that target zone\'s UTC offset (formatted as ±HH:mm) for the given date. Daylight saving time rules, historical UTC offset changes, and date rollovers are handled uniformly by dayjs\'s timezone plugin based on its embedded IANA time zone data; the page is responsible only for managing input state, triggering conversions, and rendering the result list. The entire conversion pipeline runs synchronously in the local browser without sending any network requests; the base time and selected city list never leave the device.',
      modes: ['Base timezone setting', 'Fill current time', 'Multiple target time zones', 'UTC offset display (with DST correction)', 'Date rollover indication', 'Add/remove target zones', 'Local offline conversion'],
      example: {
        title: 'Time zone conversion example',
        input: 'Base timezone: Asia/Shanghai\nBase time: 2026-05-21 09:00\nTarget timezones: America/New_York, Europe/London, Asia/Tokyo',
        output: 'New York: 2026-05-20 21:00 (UTC-4)\nLondon: 2026-05-21 02:00 (UTC+1)\nTokyo: 2026-05-21 10:00 (UTC+9)',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'archive-converter': {
    zh: {
      summary:
        '压缩包转换工具用于在浏览器中创建 ZIP 压缩包或解析已有的 ZIP 归档文件并导出内部内容。适合临时整理多份资料为单一交付文件、将前端静态资源打包传输、批量下载用户上传的多个附件、在接收 ZIP 文件后快速检查目录结构并提取所需的单个或部分文件，以及在不安装 WinRAR / 7-Zip 等桌面压缩软件的情况下完成轻量归档与解包处理。所有文件经浏览器 File API 读取后在内存中处理，通过 JSZip 生成或解析 ZIP 数据并以 Blob 形式触发下载，文件内容自始至终保留在本地设备中，不会上传至任何服务器或第三方服务。',
      input:
        '两种输入模式自由切换。打包模式（Create ZIP）下，用户通过拖拽或文件选择器添加多个待压缩文件到队列中，支持任意格式文件（文档、图片、音视频、代码文件等），队列以文件名、文件大小和移除操作为行展示，方便审阅打包范围与清理误选文件。解包模式（Extract ZIP）下，用户拖拽或选择一个 .zip 压缩包文件，工具读取压缩包的目录结构并以可折叠树形视图展示所有内部条目（含目录层级与文件名），支持勾选单个或多个条目进行选择性提取，也支持一键全选并批量导出全部内容。',
      output:
        '打包模式下，工具将队列中所有文件按原始文件名和目录结构压入 ZIP 归档，通过浏览器下载机制输出新的 .zip 文件到系统默认下载目录。解包模式下，用户勾选的条目会被提取并触发独立的文件下载，或者将全部勾选条目重新打包为一个新 ZIP 供统一下载。文件列表展示每个文件的原始名称、大小（自动格式化为 B / KB / MB）和当前状态（等待中/已添加/已提取），用户可随时从队列中移除单个文件或一键清空全部队列。',
      processing:
        '基于 JSZip 库在浏览器端完成全量打包与解包。打包管线：用户通过文件选择器或拖拽事件获取 File 对象列表 → JSZip 实例逐文件调用 file(name, blob) 加入归档 → 调用 generateAsync({ type: "blob" }) 异步生成 ZIP 二进制数据 → 通过 URL.createObjectURL 创建临时下载链接并触发浏览器下载。解包管线：用户选择 ZIP 文件 → 通过 JSZip.loadAsync(zipFile) 异步读取归档 → 遍历 zip.files 构建目录树与文件列表 → 用户勾选条目后，对每个选定条目调用 zip.file(name).async("blob") 提取文件内容 → 同样通过 createObjectURL 触发浏览器下载。提取大文件或批量提取时采用异步迭代避免阻塞 UI 线程，文件名编码兼容中日韩等非 ASCII 字符的 UTF-8 文件名。整个处理链路仅使用浏览器 File API、Blob API 和 JSZip 的内存计算能力，没有任何文件数据离开浏览器。',
      modes: ['多文件打包为 ZIP', 'ZIP 文件解包', '选择性提取单个/部分文件', '目录树浏览', '拖拽添加文件', '队列管理与清空', '本地离线处理'],
      example: {
        title: '压缩包处理示例',
        input: '文件队列: report.pdf (2.3 MB), cover.png (450 KB), data.csv (128 KB)\n操作: 打包为 ZIP',
        output: '浏览器自动下载 archive.zip，包含上述 3 个队列文件。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Archive Converter creates ZIP archives or parses existing ZIP files and exports their contents, all directly in the browser. Suitable for temporarily organizing multiple assets into a single deliverable, packaging frontend static resources for transfer, batch-downloading multiple user-uploaded attachments, quickly inspecting the directory structure of a received ZIP and extracting individual or selected files, and handling light archiving and extraction tasks without installing desktop compression tools such as WinRAR or 7-Zip. All files are read through the browser File API and processed in memory; JSZip generates or parses ZIP data and triggers downloads as Blobs. File contents remain on the local device at all times and are never uploaded to any server or third-party service.',
      input:
        'Two freely switchable input modes. In Create ZIP mode, users add multiple files to a queue via drag-and-drop or the file picker. Files of any format are supported (documents, images, audio/video, code files, etc.). The queue displays each file\'s name, size, and a remove action for reviewing the archive scope and clearing incorrectly selected files. In Extract ZIP mode, users drag or select a .zip archive file. The tool reads the archive\'s directory structure and displays all internal entries (including folder hierarchy and file names) in a collapsible tree view. Individual or multiple entries can be selected for selective extraction; a select-all option with batch export is also available.',
      output:
        'In Create ZIP mode, the tool compresses all queued files into a ZIP archive preserving original file names and directory structure, then triggers a browser download of the new .zip file to the system default download directory. In Extract ZIP mode, selected entries are extracted and trigger individual file downloads, or all selected entries can be re-packaged into a new ZIP for a single unified download. The file list shows each file\'s original name, size (auto-formatted as B / KB / MB), and current status (waiting / added / extracted). Users can remove individual files from the queue or clear the entire queue with one click at any time.',
      processing:
        'Uses the JSZip library to perform all archiving and extraction in the browser. The packaging pipeline: user-selected File objects are obtained via the file picker or drag events → a JSZip instance adds each file via file(name, blob) → generateAsync({ type: "blob" }) asynchronously generates the ZIP binary data → a temporary download link is created via URL.createObjectURL and the browser download is triggered. The extraction pipeline: user selects a ZIP file → loadAsync(zipFile) asynchronously reads the archive → zip.files is iterated to build a directory tree and file list → after the user selects entries, each selected entry is extracted via zip.file(name).async("blob") → downloads are triggered similarly via createObjectURL. Large files and batch extractions use async iteration to avoid blocking the UI thread. File name encoding supports UTF-8 for non-ASCII characters including CJK scripts. The entire processing chain uses only the browser File API, Blob API, and JSZip\'s in-memory computation; no file data ever leaves the browser.',
      modes: ['Multi-file ZIP creation', 'ZIP extraction', 'Selective single/partial file extraction', 'Directory tree browsing', 'Drag-and-drop add files', 'Queue management and clear', 'Local offline processing'],
      example: {
        title: 'Archive processing example',
        input: 'File queue: report.pdf (2.3 MB), cover.png (450 KB), data.csv (128 KB)\nAction: create ZIP',
        output: 'Browser automatically downloads archive.zip containing the 3 queued files.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'rmb-converter': {
    zh: {
      summary:
        '人民币大写转换工具用于将阿拉伯数字金额转换为规范的中文大写金额表达，严格遵循中国人民银行《支付结算办法》及财政部会计基础工作规范中关于大写金额书写的标准要求。适合财务人员在填写报销单、借款单、付款申请单、支票、银行汇票、发票备注栏时核对金额大小写是否一致；合同起草人员在金额栏中同步提供小写与大写金额以防篡改；出纳人员在登记现金日记账和银行存款日记账时填写大写合计金额；审计人员在审核原始凭证时快速确认书写规范；法务人员在校验借据、收据、担保函等法律文件时核查金额表达无误；以及开发者在实现财务系统的金额输出功能时作为标准参考对照。工具实时将输入的数字转换为"元、角、分"结构的中文大写金额，并严格遵循整/零/亿/万/仟/佰/拾等金额书写规则，输出结果可直接复制到正式文件和业务系统。',
      input:
        '需要转换的人民币数字金额字符串，支持包含整数和最多两位小数的合法金额值，例如 1234.56、1000000.00、0.08、987654321.99 等；支持以逗号分隔的千分位格式（如 1,234,567.89），工具会自动去除逗号后处理；也支持纯整数输入（如 12000），工具将自动以"整"结尾。提供了常用金额的快捷填充按钮（如 1000、10000、1000000 等），方便快速测试或批量核对文档中的典型金额表达。对空值、含非法字符、负数金额、超出万亿级支持范围或小数位数超过两位的输入，工具会提示具体错误原因而非生成错误结果，避免将不规范输入静默转换为看似合法的大写金额。',
      output:
        '符合中文财务书写标准的大写金额文本，例如"壹仟贰佰叁拾肆元伍角陆分"。整数金额以"整"字结尾（如"壹万元整"），含角分的金额按角分补齐（如"壹佰元零叁角伍分"）；连续零的处理遵循财务习惯——中间连续的零合并为一个"零"字（如"壹仟零贰元"），末尾零不读取（如"壹仟贰佰元"），零角分位按规则展示（如"零捌分"）；万位和亿位自动按中文数位分组转换，正确处理"万""亿"等数量单位。输出结果可一键复制，直接粘贴到 Excel 表格、Word 合同、财务软件金额栏或打印模板中使用。',
      processing:
        '在浏览器内将金额数值拆分为整数部分和小数部分分别处理。整数部分按从低位到高位的顺序每 4 位分为一组（万进位制），每组内按"仟佰拾"数位体系逐位映射为对应大写汉字（零/壹/贰/叁/肆/伍/陆/柒/捌/玖），组间插入"万""亿"等进位单位。转换过程中执行多道清理规则：合并相邻的多个"零"为单个"零"（如"壹零零零贰" → "壹仟零贰"）；移除万位和亿位之前的冗余零；末位为"零"时移除该零并根据规则决定是否补充单位；整数部分全零时（即金额小于 1 元）仅输出小数字。小数部分按角（十分位）、分（百分位）逐一转换，角位为零分位非零时补"零"（如"零叁分"），角位和分位均为零时追加"整"字。所有校验和转换均在浏览器本地同步完成，输入金额不经过任何网络传输。',
      modes: ['阿拉伯数字 → 大写金额', '元角分标准格式', '整字规则处理', '零字合并与规范化', '亿/万进位单位', '千分位逗号自动识别', '快捷金额测试', '一键复制结果'],
      example: {
        title: '人民币大写转换示例',
        input: '输入金额: 1234.56',
        output: '壹仟贰佰叁拾肆元伍角陆分',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The RMB Uppercase Converter turns numeric RMB (Chinese Yuan) amounts into formal Chinese uppercase currency text, strictly following the standard rules for uppercase amount writing set out in the People\'s Bank of China Payment and Settlement Regulations and the Ministry of Finance\'s Accounting Basic Work Standards. Suitable for finance staff verifying that uppercase and lowercase amounts match when filling out reimbursement forms, loan request forms, payment application forms, cheques, bank drafts, and invoice remarks; contract drafters providing both lowercase and uppercase amounts in the amount column to prevent tampering; cashiers writing uppercase total amounts when recording cash journals and bank deposit journals; auditors quickly verifying writing standards when reviewing original vouchers; legal staff checking the correctness of amount expressions when examining IOUs, receipts, and letters of guarantee; and developers using it as a standard reference when implementing amount-output functionality in financial systems. The tool converts entered numbers in real time into Chinese uppercase amounts with a "yuan / jiao / fen" structure, strictly following writing rules for 整 (integer), 零 (zero), 亿 (hundred million), 万 (ten thousand), 仟 (thousand), 佰 (hundred), and 拾 (ten). Output can be copied directly into formal documents and business systems.',
      input:
        'A RMB numeric amount string, supporting valid amounts with an integer part and up to two decimal places, such as 1234.56, 1000000.00, 0.08, 987654321.99, etc. Comma-separated thousand-separator format is supported (e.g. 1,234,567.89); commas are automatically removed before processing. Pure integer input is also supported (e.g. 12000), and the tool automatically adds the 整 suffix. Quick-fill buttons for common amounts (e.g. 1000, 10000, 1000000) are provided for quick testing or batch verification of typical amount expressions in documents. For empty values, illegal characters, negative amounts, amounts exceeding the trillion-level support range, or input with more than two decimal places, the tool displays specific error reasons rather than generating incorrect results, preventing irregular input from being silently converted into plausible-looking uppercase amounts.',
      output:
        'Formal Chinese uppercase RMB text compliant with financial writing standards, such as "壹仟贰佰叁拾肆元伍角陆分". Integer amounts end with the 整 character (e.g. "壹万元整"). Amounts with jiao and fen are rendered accordingly (e.g. "壹佰元零叁角伍分"). Consecutive zeros are handled according to financial conventions — intermediate consecutive zeros are merged into a single 零 character (e.g. "壹仟零贰元"), trailing zero is not read aloud (e.g. "壹仟贰佰元"), and zero jiao/fen positions are displayed per rules (e.g. "零捌分"). The wan and yi positions are automatically grouped and converted according to Chinese digit grouping rules, correctly handling quantity units such as 万 and 亿. Results can be copied with one click and pasted directly into Excel spreadsheets, Word contracts, financial software amount fields, or print templates.',
      processing:
        'Splits the amount into integer and decimal parts and processes each separately in the browser. The integer part is grouped from low to high in groups of 4 digits (the wan-carry system). Each group is mapped digit-by-digit to the corresponding uppercase Chinese character (零/壹/贰/叁/肆/伍/陆/柒/捌/玖) using the 仟佰拾 digit-unit system, with carry units such as 万 and 亿 inserted between groups. Multiple cleanup rules are applied during conversion: adjacent multiple 零 characters are merged into a single 零 (e.g. "壹零零零贰" → "壹仟零贰"); redundant zeros before wan and yi positions are removed; when the last digit is 零 it is removed and units are supplemented or not based on rules; when the entire integer part is zero (i.e. amount < 1 yuan) only the decimal part is output. The decimal part is converted digit by digit as jiao (tenths) and fen (hundredths). When jiao is zero and fen is non-zero, a 零 is inserted (e.g. "零叁分"). When both jiao and fen are zero, the 整 suffix is appended. All validation and conversion runs synchronously in the local browser; the entered amount is never transmitted over the network.',
      modes: ['Arabic numerals to uppercase', 'Yuan/Jiao/Fen standard format', 'Integer ending rule (整)', 'Zero merging and normalization', 'Yi/Wan carry units', 'Thousand-separator comma recognition', 'Quick amount presets', 'One-click copy result'],
      example: {
        title: 'RMB uppercase conversion example',
        input: 'Amount: 1234.56',
        output: '壹仟贰佰叁拾肆元伍角陆分',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ppi-calculator': {
    zh: {
      summary:
        'PPI（Pixels Per Inch，每英寸像素数）计算器用于根据显示设备的横向物理像素数、纵向物理像素数和对角线屏幕尺寸快速计算像素密度，帮助评估和对比不同屏幕的显示精细程度。适合前端开发者和 UI 设计师在设计稿适配时参照目标设备的像素密度（确保@2x/@3x 切图与实际 PPI 匹配）、硬件测评人员对比手机、平板、显示器、笔记本和电视屏幕的清晰度指标、IT 采购者在选购显示器时参考 PPI 与视距的关系以平衡清晰度和预算、需要理解 Retina / HiDPI / 高分屏等概念的初学者快速上手计算，以及嵌入式开发人员在为特定屏幕做 UI 适配时确认像素密度与设计规范的契合度。工具还内置常见设备（如 iPhone、iPad、MacBook、主流显示器分辨率）的快捷预设，方便一键填入典型参数进行快速参考，同时提供基于 PPI 区间的清晰度等级评定和典型视距下的最佳 PPI 建议。',
      input:
        '屏幕宽度像素（如 1920、2560、3840 等）、屏幕高度像素（如 1080、1440、2160 等）和对角线物理尺寸（以英寸为单位，如 5.8、6.7、13.3、15.6、27 等）。用户可手动输入任意设备的三个关键参数，也可通过内置的常见设备预设（iPhone 16 Pro、iPad Pro 13"、MacBook Pro 16"、27" 4K 显示器等）一键填充。支持小数英寸输入（如 6.1、14.2），适应不同设备对角线尺寸的实际规格。',
      output:
        '计算得到的 PPI 数值（保留适当小数位），以及根据像素密度区间给出的直观清晰度等级提示。通常 PPI ≥ 300 判定为"高清晰度/Retina 级"（如高端手机与部分笔记本）、PPI 200-299 判定为"良好清晰度"（如主流台式机显示器）、PPI 100-199 判定为"普通清晰度"（如一般笔记本和电视）、PPI < 100 判定为"较低清晰度"（近距离观看时可感知到像素颗粒）。此外还可提供基于视距的查看建议：手机通常视距 25-30cm 建议 PPI ≥ 300、显示器视距 50-70cm 建议 PPI ≥ 90-110、电视视距 2-3m 建议 PPI ≥ 40-60。输出结果适合作为设备选型对比、设计适配参考和显示品质初步判断的依据。',
      processing:
        '使用勾股定理在浏览器内同步计算。首先根据用户输入的横向像素数（Width）和纵向像素数（Height）计算屏幕总像素对角线长度：sqrt(Width² + Height²) → 得到像素对角线值；然后将像素对角线值除以物理对角线英寸数（Diagonal）得到 PPI = sqrt(Width² + Height²) / Diagonal。例如一台 15.6 英寸、1920×1080 分辨率的笔记本，PPI = sqrt(1920² + 1080²) / 15.6 = sqrt(4852800) / 15.6 ≈ 2202.9 / 15.6 ≈ 141.21 PPI。页面根据计算结果所在区间自动映射对应的清晰度等级标签，同时展示常见设备的参考 PPI 对比图表（如 iPhone PPI ≈ 460、主流 27 英寸 4K 显示器 PPI ≈ 163、27 英寸 1080p 显示器 PPI ≈ 82 等），帮助用户理解该 PPI 数值在实际使用场景中的定位。所有计算仅依赖用户输入的三个数值，在浏览器前端同步完成，无需网络连接。',
      modes: ['宽/高像素输入', '对角线英寸尺寸输入', '常见设备预设一键填充', 'PPI 计算值', '清晰度等级评定（Retina/高/中/低）', '视距建议', '典型设备 PPI 参考对比'],
      example: {
        title: 'PPI 计算示例',
        input: '屏幕宽度: 1920 px\n屏幕高度: 1080 px\n对角线: 15.6 in',
        output: 'PPI ≈ 141.21（清晰度等级: 普通）',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PPI (Pixels Per Inch) Calculator computes pixel density from a display device\'s horizontal physical pixel count, vertical physical pixel count, and diagonal screen size, helping evaluate and compare the display sharpness of different screens. Suitable for frontend developers and UI designers referencing target device pixel density when adapting design drafts (ensuring @2x/@3x assets match actual PPI), hardware reviewers comparing sharpness metrics across phones, tablets, monitors, laptops, and TVs, IT purchasers referencing the relationship between PPI and viewing distance when selecting monitors to balance clarity and budget, beginners needing to understand concepts like Retina / HiDPI / high-density displays, and embedded developers verifying that pixel density meets design specifications when adapting UI for specific screens. The tool also includes quick presets for common devices (e.g. iPhone, iPad, MacBook, mainstream monitor resolutions) for one-click entry of typical parameters for quick reference, plus a clarity rating based on PPI ranges and optimal PPI recommendations at typical viewing distances.',
      input:
        'Screen width in pixels (e.g. 1920, 2560, 3840), screen height in pixels (e.g. 1080, 1440, 2160), and diagonal physical size in inches (e.g. 5.8, 6.7, 13.3, 15.6, 27). Users can manually enter the three key parameters for any device or use built-in common-device presets (iPhone 16 Pro, iPad Pro 13", MacBook Pro 16", 27" 4K monitor, etc.) for one-click fill. Decimal inch input is supported (e.g. 6.1, 14.2) to accommodate actual diagonal size specifications of different devices.',
      output:
        'The calculated PPI value (with appropriate decimal precision) plus an intuitive clarity rating based on the pixel density range. Generally, PPI ≥ 300 is rated "High / Retina-grade" (e.g. high-end phones and some laptops), PPI 200–299 is rated "Good clarity" (e.g. mainstream desktop monitors), PPI 100–199 is rated "Standard clarity" (e.g. typical laptops and TVs), and PPI < 100 is rated "Lower clarity" (pixel structure may be visible at close viewing distances). Viewing-distance-based recommendations are also provided: phones at a typical 25–30 cm distance recommend PPI ≥ 300, monitors at 50–70 cm recommend PPI ≥ 90–110, and TVs at 2–3 m recommend PPI ≥ 40–60. Results serve as a reference for device comparison, design adaptation guidance, and preliminary display quality assessment.',
      processing:
        'Calculates synchronously in the browser using the Pythagorean theorem. First the total screen pixel diagonal is computed from the entered horizontal pixel count (Width) and vertical pixel count (Height): sqrt(Width² + Height²) → the pixel diagonal value. Then the pixel diagonal is divided by the physical diagonal size in inches (Diagonal) to obtain PPI = sqrt(Width² + Height²) / Diagonal. For example, a 15.6-inch, 1920×1080 resolution laptop: PPI = sqrt(1920² + 1080²) / 15.6 = sqrt(4852800) / 15.6 ≈ 2202.9 / 15.6 ≈ 141.21 PPI. The page maps the computed result to the corresponding clarity rating label based on its range, and can optionally display a reference comparison chart of common device PPIs (e.g. iPhone PPI ≈ 460, mainstream 27-inch 4K monitor PPI ≈ 163, 27-inch 1080p monitor PPI ≈ 82, etc.) to help users understand where the computed PPI falls in real-world usage scenarios. All calculation depends only on the three user-entered values and runs synchronously in the browser frontend with no network connection required.',
      modes: ['Width/height pixel input', 'Diagonal inch size input', 'Common device preset one-click fill', 'PPI calculated value', 'Clarity rating (Retina/Good/Standard/Low)', 'Viewing distance recommendation', 'Typical device PPI reference comparison'],
      example: {
        title: 'PPI calculation example',
        input: 'Screen width: 1920 px\nScreen height: 1080 px\nDiagonal: 15.6 in',
        output: 'PPI ≈ 141.21 (Clarity rating: Standard)',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
