import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const AI_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'ai-hs-code-assistant': {
    zh: {
      summary:
        'AI HS 编码与报关品名助手用于把商品名称、用途、材质、销售形态和目标市场整理成一份可交给报关行或内部合规同事复核的商品归类简报。它不直接给出最终 HS 编码，也不计算关税税率，而是输出英文报关品名、HS 候选方向、归类依据、缺失信息和需要人工确认的问题。适合跨境卖家、独立站运营、采购或产品上架人员在准备新品出海资料时，先把零散商品信息整理成规范的 customs description draft，再去目标市场官方查询系统或向报关行确认最终归类。',
      input:
        '核心输入包括商品名称、主要用途、材质或成分、目标市场、是否含电池、是否含电子元件、是否成套销售、包装内容、商品形态、用户群体、品牌型号、单件重量和风险标签。商品名称、用途、材质和目标市场是主要判断依据；电池、电子元件、套装销售、液体粉末、食品接触、儿童用品、磁性、无线通信、医疗宣称和化妆品接触等风险标签用于提醒模型识别可能触发额外申报、认证或人工复核的问题。输出语言可选中文或英文，便于中文团队内部沟通或直接准备英文报关沟通材料。',
      output:
        '结果会拆成几块可复制内容：英文报关品名草稿、商业发票描述、给货代或报关行看的归类说明、最多 3 个 HS 候选方向、需要补充确认的问题、缺失信息和风险提醒。每个候选方向都会说明为什么可能匹配、为什么仍然存疑，以及应该继续向供应商、报关行或内部合规人员确认什么。',
      processing:
        '新品出海时，卡在报关品名和 HS 编码上很常见：你知道商品是什么，却不确定该怎么用海关认的说法描述它。把商品名称、用途、材质和目标市场填进去，工具会先帮你理出一份能直接发给报关行的归类简报：一段规范的英文报关品名、几个值得考虑的 HS 编码方向，以及上报前最好先跟供应商确认的问题。它不替你拍板；最终编码和税率仍要以目标市场的官方税则（如美国 HTS、欧盟 TARIC）或报关行意见为准。这里给你的是一份帮你想清楚、问对问题的底稿。',
      modes: ['目标市场选择（US/EU/UK/Canada/Other）', '商品资料结构化输入', '电池/无线/儿童用品等风险标签', '英文报关品名草稿', '最多 3 个 HS 候选方向', '报关行复核问题', '官方查询入口提示', '单项复制'],
      example: {
        title: '硅胶折叠水杯归类简报示例',
        input: '商品名称: Foldable silicone drinking cup\n用途: Reusable cup for outdoor travel and daily drinking\n材质: Food-grade silicone with plastic rim\n目标市场: US\n包装内容: 1 cup with lid\n商品形态: Finished consumer product\n风险标签: Food contact item',
        output:
          'Customs description: Foldable food-grade silicone drinking cup with plastic rim and lid, reusable household/travel drinking container, packed as one finished consumer product.\n\nCandidate 1: 3924 - tableware, kitchenware, other household articles of plastics. Confidence: medium. Reason: finished household drinking container made mainly from silicone/plastic material.\n\nQuestions for broker: Confirm material composition by weight; confirm whether silicone is treated as plastic under the target tariff schedule; confirm whether the lid changes the classification; confirm food-contact documentation requirements.',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The AI HS Code & Customs Description Assistant turns product name, use, material, selling format, and destination market into a classification brief that can be reviewed by a customs broker or internal compliance owner. It does not issue a final HS code and does not calculate duties. Instead, it drafts an English customs description, candidate HS directions, classification reasoning, missing information, and human review questions. It is designed for cross-border sellers, DTC operators, sourcing teams, and listing teams preparing export documents before checking the official tariff system or asking a broker for the final classification.',
      input:
        'Core inputs include product name, primary use, material or composition, target market, battery status, electronics status, set/bundle status, package contents, product form, user group, brand/model, unit weight, and risk flags. Product name, use, material, and destination market are the main classification signals. Risk flags such as battery, electronics, liquid or powder, food contact, children product, magnet, wireless communication, medical claim, and cosmetic contact help the model surface extra declaration or compliance questions. Output language can be Chinese or English, supporting both internal review and direct English broker communication.',
      output:
        'The result is split into copyable sections: an English customs item name draft, commercial invoice wording, a broker-facing classification note, up to 3 HS directions, review questions, missing details, and risk reminders. Each candidate direction explains why it may fit, why it may still be wrong, and what to confirm with the supplier, broker, or compliance owner.',
      processing:
        'Getting a new product ready to export often stalls on one thing: you know what the item is, but not how to describe it the way customs expects. Add the product name, use, material, and destination market, and the tool drafts a classification brief you can hand to your broker: a clean English customs description, several HS code directions worth considering, and the questions to confirm with your supplier before filing. It does not make the final call. The final code and duty rate still come from the official tariff schedule, such as the US HTS or EU TARIC, or from a licensed broker. What you get here is a working draft to think through the issue and ask the right questions.',
      modes: ['Target market selection (US/EU/UK/Canada/Other)', 'Structured product fact input', 'Risk flags for battery/wireless/children products etc.', 'English customs description draft', 'Up to 3 HS candidate directions', 'Broker review questions', 'Official lookup hint', 'Per-section copy'],
      example: {
        title: 'Foldable silicone cup classification brief example',
        input: 'Product name: Foldable silicone drinking cup\nPrimary use: Reusable cup for outdoor travel and daily drinking\nMaterial: Food-grade silicone with plastic rim\nTarget market: US\nPackage contents: 1 cup with lid\nProduct form: Finished consumer product\nRisk flags: Food contact item',
        output:
          'Customs description: Foldable food-grade silicone drinking cup with plastic rim and lid, reusable household/travel drinking container, packed as one finished consumer product.\n\nCandidate 1: 3924 - tableware, kitchenware, other household articles of plastics. Confidence: medium. Reason: finished household drinking container made mainly from silicone/plastic material.\n\nQuestions for broker: Confirm material composition by weight; confirm whether silicone is treated as plastic under the target tariff schedule; confirm whether the lid changes the classification; confirm food-contact documentation requirements.',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
      lastUpdated: '2026-07',
      sources: [
        { label: 'United States Harmonized Tariff Schedule', url: 'https://hts.usitc.gov/' },
        { label: 'EU TARIC consultation', url: 'https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff/combined-nomenclature_en' },
      ],
    },
  },

  'ai-product-asset-checker': {
    zh: {
      summary:
        'AI 商品素材合规质检器用于在跨境商品上架或投放广告前，对商品主图、场景图、包装图、标签图和详情图做一次素材风险预检。它不是平台审核系统，也不输出法律结论，而是根据图片内容、商品描述、目标平台和目标市场，指出可能影响上架或广告审核的视觉问题、包装信息缺口、文字覆盖、水印边框、商品一致性和监管敏感信号。适合跨境卖家、独立站运营、素材设计、供应链和代运营团队在素材交付前先做一次统一检查。',
      input:
        '核心输入包括商品名称、商品描述、目标平台、目标市场和最多 8 张商品素材图片。每张图片可以标记为主图、场景图、包装图、标签图或细节图。商品名称和描述用于判断图片里的商品是否一致；平台和市场会改变检查重点，例如 Google Shopping 主图限制、Amazon 上架图、TikTok Shop 素材、Shopify 商品页或 Meta Ads 广告初稿。上传前请压缩过大的原图，避免把未筛选的素材全部丢进来。',
      output:
        '结果会给出整体风险等级、简短结论、素材可用性摘要、逐图问题和修复建议。检查重点包括尺寸、清晰度、文字覆盖、促销信息、水印边框、商品一致性、包装标签和目标市场风险。最后会整理一份下一步处理清单，方便你分配给摄影、设计、供应商或运营同事继续修。',
      processing:
        '上架前最容易漏掉的是图片里的小问题：主图有促销字、包装图没有容量信息、标签图看不清材质，或者场景图和商品描述对不上。你上传素材并选好平台后，工具会按图片角色逐张检查，把可能影响上架或广告审核的风险列出来。它不能替平台审核你，也不能替律师判断合规；它更适合做交付前的预检清单，帮你在提交前把明显问题先修掉。',
      modes: ['最多 8 张图片上传', '主图/场景图/包装图/标签图/细节图角色标记', '目标平台选择', '目标市场选择', '整体风险等级', '逐图问题与修复建议', '检查项清单', '下一步动作复制'],
      example: {
        title: '陶瓷杯商品素材预检示例',
        input: '商品名称: 手工陶瓷杯\n商品描述: Handmade ceramic drinking cup for hot beverages\n目标平台: Google Shopping\n目标市场: United States\n图片: 主图 1 张、包装图 1 张、标签图 1 张',
        output:
          '整体风险: Medium\n\n结论: 主图商品清晰，但包装图缺少材质和容量信息，标签图未显示是否为食品接触用途。若用于 Google Shopping，主图还需要避免促销文字、水印或边框。\n\n图片问题: 主图通过；包装图需要补拍完整外盒侧面；标签图需要补充容量、材质、产地或供应商提供的食品接触说明。\n\n下一步: 重新导出无文字覆盖主图；向供应商索取包装和标签高清图；确认目标市场是否需要食品接触声明。',
        inputLanguage: 'image+text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The AI Product Asset Compliance Checker reviews product images before cross-border listing or ad submission. It checks main images, lifestyle images, packaging photos, label shots, and detail images for asset risks. It is not a platform review system and does not issue legal conclusions. Instead, it uses the product description, target platform, target market, and image content to surface visual issues, packaging information gaps, text overlays, watermarks, borders, product mismatch, and regulated-product signals. It is designed for cross-border sellers, DTC teams, designers, suppliers, and marketplace operators who need a pre-listing asset checklist.',
      input:
        'Core inputs include product name, product description, target platform, target market, and up to 8 product images. Each image can be labeled as a main image, lifestyle image, packaging image, label image, or detail image. Product name and description help detect mismatch. Platform and market selection shape the review context, such as Google Shopping image constraints, Amazon listing photos, TikTok Shop assets, Shopify product pages, or Meta Ads drafts. Compress oversized originals before upload so the review stays focused on usable assets.',
      output:
        'The result gives an overall risk level, short verdict, asset summary, per-image findings, and fixes. Review points include dimensions, clarity, text overlays, promotional claims, watermarks, borders, product consistency, packaging labels, and market-facing risks. The final section turns the review into a next-action checklist for photographers, designers, suppliers, or marketplace operators.',
      processing:
        'Image reviews often fail on small details: a main image has promo text, a packaging shot misses capacity information, a label is unreadable, or a lifestyle photo shows a product that does not match the listing. Upload the assets, choose the platform, and the tool checks each image by role so you can fix obvious problems before submission. It does not replace platform review, legal advice, or formal certification. Use it as a pre-flight checklist before sending assets to a marketplace, ad account, or client.',
      modes: ['Up to 8 uploaded images', 'Main/lifestyle/packaging/label/detail role labels', 'Target platform selection', 'Target market selection', 'Overall risk level', 'Per-image issues and fixes', 'Review checklist', 'Copyable next actions'],
      example: {
        title: 'Ceramic cup asset pre-check example',
        input: 'Product title: Handmade ceramic cup\nDescription: Handmade ceramic drinking cup for hot beverages\nTarget platform: Google Shopping\nTarget market: United States\nImages: 1 main image, 1 packaging image, 1 label image',
        output:
          'Overall risk: Medium\n\nVerdict: The main image clearly shows the product, but the packaging image does not show material or capacity information, and the label image does not confirm food-contact use. For Google Shopping use, the main image should avoid promotional text, watermarks, or borders.\n\nImage findings: Main image passes; packaging image needs a full side-panel photo; label image needs capacity, material, origin, or supplier food-contact confirmation.\n\nNext actions: Export a clean main image without overlay text; ask the supplier for high-resolution packaging and label photos; confirm whether the target market requires food-contact documentation.',
        inputLanguage: 'image+text',
        outputLanguage: 'json',
      },
      lastUpdated: '2026-07',
      sources: [
        { label: 'Google Merchant Center image requirements', url: 'https://support.google.com/merchants/answer/6324350' },
        { label: 'Etsy Seller Handbook', url: 'https://www.etsy.com/seller-handbook' },
      ],
    },
  },

  'ai-product-image-generator': {
    zh: {
      summary:
        'AI 出海商品图生成器用于根据商品名称、材质、卖点和使用场景生成适合跨境上架、广告投放和独立站展示的商品图片。它是文本到商品图工具，不要求用户上传参考图。用户选择目标平台、图片用途、比例、视觉风格和背景后，工具生成白底主图、生活方式场景图、独立站首屏图、社媒广告图或平台辅图草稿。适合跨境卖家、独立站运营、DTC 品牌、供应商和素材设计人员在缺少拍摄资源时先获得视觉方向。',
      input:
        '核心输入包括商品名称、商品说明、核心卖点、目标平台、目标市场、图片用途、比例、视觉风格、背景、场景补充和生成张数。商品名称是必填项；商品说明和核心卖点用于补充材质、颜色、结构、尺寸、用途、目标人群和包装信息。平台选项覆盖 Amazon、Google Shopping、Shopify、TikTok Shop 和 Meta Ads；图片用途覆盖白底主图、生活方式场景图、独立站首屏图、社媒广告图和平台辅图；比例支持 1:1、4:5、16:9、9:16；生成张数支持 1-3 张。',
      output:
        '结果是一组可下载的商品图草稿，并保留对应的生成说明，方便你交给设计同事继续修图或在下一轮生成时复用。发布前请逐张核对产品结构、颜色、Logo、包装文字、品牌授权和目标平台图片规则，尤其不要把生成图里的虚构包装或错误材质直接用于上架。',
      processing:
        '缺少拍摄素材时，先别急着把商品随便放进通用生图提示里。这个工具会围绕商品名称、卖点、平台、图片用途和画幅，生成更像跨境上架素材的画面方向：白底主图保持干净，场景图说明使用环境，独立站首屏图突出品牌感。生成图仍然是草稿，不能替代实拍素材；正式发布前要检查商品结构、材质、商标和平台禁用元素。',
      modes: ['商品资料文本输入', '目标平台选择', '图片用途选择', '1:1 / 4:5 / 16:9 / 9:16 比例', '视觉风格和背景选择', '1-3 张变体生成', '图片下载', '提示词复制'],
      example: {
        title: '手工陶瓷杯商品图生成示例',
        input: '商品名称: 手工陶瓷杯\n商品说明: 米白色釉面，适合咖啡和热饮\n核心卖点: 手工釉面、送礼场景\n目标平台: Shopify product page\n图片用途: Product page hero image\n比例: 4:5\n视觉风格: Premium DTC brand photography',
        output:
          '输出 2 张商品图：第一张为浅色家居桌面上的陶瓷杯首屏图，第二张为自然光下的咖啡使用场景。每张图提供下载按钮和对应提示词，用户可以继续修图或交给设计同事调整。',
        inputLanguage: 'text',
        outputLanguage: 'image',
      },
    },
    en: {
      summary:
        'The Keyword-to-Product Image Generator turns a product keyword or short brief into ecommerce image drafts. Choose a sales channel, image use, aspect ratio, visual style, and background to create white-background listing images, lifestyle scenes, product-page hero images, or ad creatives. The tool gives cross-border sellers a useful visual direction before a photoshoot or design handoff.',
      input:
        'The only required input is a product keyword or name. Optional product details can describe material, color, structure, size, use case, target buyer, packaging, selling points, or scene notes. Choose Amazon, Google Shopping, Shopify, TikTok Shop, or Meta Ads, then select an image use, aspect ratio, visual style, background, and 1-3 variants.',
      output:
        'The result is a set of downloadable product-image drafts with the matching generation notes for editing or reuse. Before publishing, check product shape, color, logos, packaging text, brand rights, and target-platform image rules. Do not publish a generated draft if it invents packaging, materials, claims, or brand marks.',
      processing:
        'Start with the keyword, then add only the facts that affect the image. The generator uses those facts with the chosen sales channel and image use to shape a focused draft. Treat every result as a draft, not proof of the real product. Review structure, material, trademark use, packaging text, and marketplace image rules before publishing.',
      modes: ['Product keyword input', 'Optional product details', 'Target platform selection', 'Image use selection', '1:1 / 4:5 / 16:9 / 9:16 ratios', 'Visual style and background selection', '1-3 variant generation', 'Image download', 'Prompt copy'],
      example: {
        title: 'Handmade ceramic cup product image example',
        input: 'Product keyword: handmade ceramic coffee cup\nProduct details: off-white glaze for coffee and hot beverages\nKey selling point: handmade glaze, gift-ready look\nTarget platform: Shopify product page\nImage use: Product page hero image\nRatio: 4:5\nVisual style: Premium DTC brand photography',
        output:
          'The tool generates 2 product images: one ceramic-cup hero image on a light home tabletop and one natural-light coffee-use scene. Each image includes a download button and the prompt used for generation.',
        inputLanguage: 'text',
        outputLanguage: 'image',
      },
    },
  },

  'listing-generator': {
    zh: {
      summary:
        'AI Listing 生成器用于把产品名称、卖点和销售平台整理成 Etsy、Amazon、Shopify 或 eBay 上架文案草稿。你可以先生成商品标题、描述、标签和社媒短文，再按真实规格、库存、物流和平台规则校对后发布。',
      input:
        '填写销售平台、产品名称、特色与卖点、输出语言和文案语气。产品名称写清商品类型和目标平台，例如 Etsy 个性化礼品、Amazon 家居用品或 Shopify 独立站新品。卖点可以补充材质、尺寸、使用场景、目标买家、礼品场景、关键词或定制信息。',
      output:
        '结果分为标题、描述、标签和社媒文案四块。标题适合放在商品页；描述可以继续编辑后粘贴到平台；标签用于整理 Etsy、Amazon 或独立站搜索词；社媒文案可作为 Instagram、Pinterest、TikTok 等渠道的短文草稿。每块内容都可以单独复制。',
      processing:
        '上架文案要同时给买家和平台读：标题要清楚，描述要完整，标签要能被搜索，社媒文案要能引导点击。输入商品信息、平台、语言和语气后，工具会拆成四类结果。发布前请确认商品规格、价格、库存、物流承诺、禁用词和平台政策。',
      modes: ['Etsy、Amazon、Shopify、eBay 平台选择', '产品名称和多行卖点输入', '中文、英文、日文、德文输出', '转化导向、专业、紧迫三种语气', '标题、描述、标签、社媒文案分块展示', '单块复制'],
      example: {
        title: 'Listing 文案生成输入到输出示例',
        input: '平台: Etsy\n产品名称: 个性化皮革托特包\n特色与卖点: 手工皮革，可定制首字母，适合通勤和送礼，带电脑隔层，礼品包装，可突出包邮卖点\n语言: Chinese\n语气: Persuasive',
        output: '[TITLE]\n个性化手工皮革托特包 | 可定制首字母通勤包 | 送礼包装\n\n[DESCRIPTION]\n这款个性化皮革托特包采用手工皮革制作，可定制首字母，适合通勤、上课、短途出行和节日送礼。内部电脑隔层方便收纳日常设备，礼品包装让它更适合作为生日、毕业季或职场礼物。\n\n[TAGS]\n皮革托特包, 个性化礼物, 通勤包, 手工皮具, 可定制包, Etsy 礼物\n\n[SOCIAL]\n一只可以刻上名字的皮革托特包，把通勤实用性和送礼心意放在一起。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Listing Generator turns a product name, selling points, and marketplace into editable Etsy, Amazon, Shopify, or eBay listing copy. Use it to draft product titles, descriptions, tags, and short social copy, then review the result against your real specs, stock, shipping terms, and marketplace rules.',
      input:
        'Fill in the marketplace, product name, selling points, output language, and tone. Keep the product name specific to the channel, such as an Etsy personalized gift, Amazon home item, or Shopify store launch. Use the selling-points field for material, size, use case, buyer type, gift occasion, keywords, customization options, or other details buyers should know.',
      output:
        'The result is split into four copyable blocks: title, description, tags, and social copy. Use the title and description for your product page, the tags for Etsy, Amazon, or store search terms, and the social copy as a short draft for Instagram, Pinterest, TikTok, or similar channels.',
      processing:
        'Listing copy has to work for both buyers and platform search: the title must be clear, the description complete, tags searchable, and social copy clickable. Add product details, marketplace, language, and tone, then review the four copy blocks. Check product facts, claims, prices, availability, shipping promises, restricted terms, and platform policy before publishing.',
      modes: ['Etsy, Amazon, Shopify, and eBay selection', 'Product name and selling-point input', 'English, Chinese, Japanese, and German output', 'Persuasive, professional, and urgent tones', 'Title, description, tags, and social-copy blocks', 'Copy each block separately'],
      example: {
        title: 'Listing copy generation input-to-output example',
        input: 'Platform: Etsy\nProduct: Personalized Leather Tote Bag\nFeatures: Handmade leather, custom initials, laptop compartment, gift packaging, commuter-friendly, free shipping angle\nLanguage: English\nTone: Persuasive',
        output: '[TITLE]\nPersonalized Leather Tote Bag | Custom Initials Work Bag | Gift-Ready Commuter Tote\n\n[DESCRIPTION]\nCarry work essentials in a handmade leather tote designed for daily commutes, gifting, and custom initials. The laptop compartment keeps your device organized, while gift-ready packaging makes it easy to send directly to a friend, graduate, coworker, or partner.\n\n[TAGS]\npersonalized leather tote, custom work bag, leather commuter tote, gift for her, laptop tote, Etsy gift\n\n[SOCIAL]\nA leather tote with custom initials, laptop space, and gift-ready packaging for workdays and milestones.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
      lastUpdated: '2026-07',
      sources: [
        { label: 'Etsy Seller Handbook', url: 'https://www.etsy.com/seller-handbook' },
        { label: 'Etsy Creativity Standards', url: 'https://www.etsy.com/legal/handmade/' },
      ],
    },
  },

  'keyword-analyzer': {
    zh: {
      summary:
        '关键词分析器用于把一个产品词整理成长尾词分组、搜索意图和 Listing 文案角度。它适合在写标题、标签、描述或内容 brief 前，先梳理可尝试的关键词方向。',
      input:
        '填写一个种子产品词并选择输出语言。种子词可以是商品名称、品类、材质、风格、使用场景或目标人群，例如“纯银项链”“皮革托特包”“婚礼伴手礼”。词越具体，分组越容易聚焦。',
      output:
        '结果包含关键词摘要、推荐方向和多个关键词分组。你可以把长尾词用于标题、标签、商品描述、广告候选词或内容选题。重要词仍需要用平台搜索、广告后台或真实数据继续验证。',
      processing:
        '选词阶段不要急着把一个种子词塞进标题。先把它拆成购买意图、材质、风格、场景和人群等方向，再决定哪些词用于标题、标签、描述或广告测试。结果是选词草稿，不代表实时搜索量、广告成本或平台排名。',
      modes: ['种子产品词输入', '中文或英文输出', '关键词摘要', '长尾词分组', '搜索意图说明', '单个关键词复制'],
      example: {
        title: '关键词分析输入到输出示例',
        input: '种子产品词: 纯银项链\n输出语言: 中文',
        output: 'Total: 42\nAvg Competition: Medium\nTop Rec: 极简纯银锁骨链\n\n分类：\n【礼物场景词】妈妈生日礼物纯银项链 • 闺蜜伴手礼纯银锁骨链 • 情人节纯银心形项链...\n【材质长尾词】S925 纯银锁骨链 • 纯银镀白金项链 • 999 足银链坠...\n【风格词】极简冷淡风项链 • 复古做旧纯银项链 • 韩式小清新锁骨链...\n【节日词】圣诞节纯银礼物项链 • 母亲节纯银项链 • 毕业季礼物...',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The Keyword Analyzer turns a product seed term into long-tail groups, search-intent notes, and listing copy angles. Use it before writing titles, tags, descriptions, ads, or content briefs.',
      input:
        'Enter one seed product term and choose the output language. The seed can be a product name, category, material, style, use case, or audience phrase, such as "sterling silver necklace," "leather tote bag," or "wedding favor." More specific terms lead to tighter groups.',
      output:
        'The result includes a keyword summary, a recommended direction, and grouped keyword ideas. Use the terms in listing titles, tags, product descriptions, ad tests, or content planning. Validate important terms with marketplace search, ad tools, or your own analytics before treating them as demand signals.',
      processing:
        'Do not push a seed term straight into a listing title. First split it into buying intent, material, style, occasion, and audience groups, then decide which terms fit titles, tags, descriptions, or ad tests. The result is a planning draft, not live search volume, ad cost, or marketplace ranking data.',
      modes: ['Seed product term input', 'Chinese or English output', 'Keyword summary', 'Long-tail keyword groups', 'Search-intent notes', 'Copy individual keywords'],
      example: {
        title: 'Keyword analysis input-to-output example',
        input: 'Seed product: sterling silver necklace\nLanguage: English',
        output: 'Total: 42\nAvg Competition: Medium\nTop Rec: minimalist silver choker necklace\n\nCategories:\n【Gift Intent】mothers day silver necklace • bridesmaid silver choker • valentines heart pendant...\n【Material Long-Tails】S925 sterling silver choker • silver plated white gold necklace • 999 fine silver pendant...\n【Style Keywords】minimalist cold-style necklace • vintage oxidized silver • Korean delicate choker...\n【Seasonal】Christmas silver gift necklace • Mother\'s Day silver necklace • graduation gift...',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
      lastUpdated: '2026-07',
      sources: [
        { label: 'Etsy Seller Handbook', url: 'https://www.etsy.com/seller-handbook' },
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
      ],
    },
  },
};
