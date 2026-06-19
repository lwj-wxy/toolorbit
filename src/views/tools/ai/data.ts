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
        'The AI Product Image Generator for Global Listings creates product images from product name, material, selling point, and scene notes. It is a text-to-product-image tool and does not require a reference upload. The user selects target platform, image use, aspect ratio, visual style, and background, then generates draft white-background product images, lifestyle scenes, storefront hero images, social ad creatives, or marketplace secondary images. It fits cross-border sellers, DTC operators, suppliers, and designers who need a first visual direction before a full photoshoot.',
      input:
        'Core inputs include product name, product description, key selling point, target platform, target market, image use, aspect ratio, visual style, background, scene notes, and variant count. Product name is required. Product description and key selling point should cover material, color, structure, size, use case, target buyer, and packaging when relevant. Platform options include Amazon, Google Shopping, Shopify, TikTok Shop, and Meta Ads. Image uses include white-background main image, lifestyle scene, product page hero, social ad creative, and marketplace secondary image. Aspect ratios include 1:1, 4:5, 16:9, and 9:16. Variant count supports 1-3 outputs.',
      output:
        'The result is a set of downloadable product-image drafts with the matching generation notes for editing or reuse. Before publishing, check product shape, color, logos, packaging text, brand rights, and target-platform image rules. Do not publish a generated draft if it invents packaging, materials, claims, or brand marks.',
      processing:
        'When you lack product photography, do not start with a generic image prompt. This tool uses the product name, selling points, platform, image use, and aspect ratio to shape drafts that fit cross-border listing work: clean white-background main images, lifestyle scenes with clear context, or product-page hero visuals with more brand presence. Treat every result as a draft, not proof of the real product. Review structure, material, trademark use, and marketplace image rules before publishing.',
      modes: ['Product brief text input', 'Target platform selection', 'Image use selection', '1:1 / 4:5 / 16:9 / 9:16 ratios', 'Visual style and background selection', '1-3 variant generation', 'Image download', 'Prompt copy'],
      example: {
        title: 'Handmade ceramic cup product image example',
        input: 'Product name: Handmade ceramic cup\nDescription: off-white glaze for coffee and hot beverages\nKey selling point: handmade glaze, gift-ready look\nTarget platform: Shopify product page\nImage use: Product page hero image\nRatio: 4:5\nVisual style: Premium DTC brand photography',
        output:
          'The tool generates 2 product images: one ceramic-cup hero image on a light home tabletop and one natural-light coffee-use scene. Each image includes a download button and the prompt used for generation.',
        inputLanguage: 'text',
        outputLanguage: 'image',
      },
    },
  },

  'ai-youtube-generator': {
    zh: {
      summary:
        'YouTube 标题与简介生成器用于把视频主题整理成发布前的包装文案。你可以生成标题方向、视频简介、标签和缩略图创意，再按频道风格和真实视频内容调整。',
      input:
        '填写视频主题、目标观众、输出语言和语气。主题可以是一句话，也可以补充视频大纲、教程步骤、产品卖点、关键词方向或活动背景。目标观众越具体，标题和简介越容易贴近真实观看人群。',
      output:
        '结果分为标题、简介、标签和缩略图方向。标题可用于比较不同点击角度；简介适合继续编辑后粘贴到 YouTube；标签用于整理搜索词；缩略图方向可交给设计或剪辑同事参考。',
      processing:
        '视频上传前，标题、简介和缩略图方向通常决定第一波点击。输入主题、观众和语气后，工具会整理一组可编辑的发布素材。发布前请核对视频内容、品牌合作信息、链接、时间戳、免责声明和频道固定格式。',
      modes: ['视频主题输入', '目标观众描述', '多语言输出', '教育、吸引点击、戏剧化语气', '标题、简介、标签、缩略图方向分块展示', '单块复制'],
      example: {
        title: 'YouTube 素材生成输入到输出示例',
        input: '视频主题: 在家制作咖啡拉花 — 从零开始学打奶泡和基础图案\n目标观众: 咖啡制作初学者\n语气: 教育型\n输出语言: 中文',
        output:
          '[TITLE]\n1. 新手也能学会的咖啡拉花入门教程 | 从打奶泡到爱心图案\n2. 零基础咖啡拉花：30 分钟做出你的第一杯拿铁艺术\n\n[DESCRIPTION]\n本视频面向完全零基础的咖啡爱好者，从牛奶的选择与打发温度开始，逐步讲解奶泡质量控制、注入角度和基础拉花图案（爱心、树叶）的完整手法……\n\n[TAGS]\n咖啡拉花, 咖啡教程, 拿铁艺术, 新手咖啡, 意式咖啡, 奶泡技巧\n\n[THUMBNAIL_IDEAS]\n左侧：一杯完成拉花的拿铁特写（爱心图案清晰），右侧：文字"零基础学会拉花"，背景暖色调木纹桌面。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The YouTube Title and Description Generator turns a video brief into publishing copy. Use it to draft title options, a description, tags, and thumbnail directions, then edit the result to match the final video and channel style.',
      input:
        'Fill in the video topic, target audience, output language, and tone. The topic can be a short idea or a fuller brief with outline notes, tutorial steps, product details, keyword direction, campaign context, or collaboration notes.',
      output:
        'The result is split into title options, description, tags, and thumbnail directions. Use the titles to compare hooks, the description as an editable YouTube draft, the tags as keyword ideas, and the thumbnail notes as a design brief.',
      processing:
        'Before a video goes live, the title, description, and thumbnail angle often decide the first wave of clicks. Add the topic, audience, language, and tone, then use the draft as editable publishing copy. Check the final video content, sponsorship details, links, timestamps, disclaimers, and channel format before publishing.',
      modes: ['Video topic input', 'Target audience notes', 'Multilingual output', 'Educational, engaging, and dramatic tones', 'Title, description, tag, and thumbnail blocks', 'Copy each block separately'],
      example: {
        title: 'YouTube asset generation input-to-output example',
        input: 'Topic: Making latte art at home — from milk frothing to basic patterns\nAudience: Complete coffee beginners\nTone: Educational\nLanguage: English',
        output:
          '[TITLE]\n1. Beginner Latte Art Tutorial: From Milk Frothing to Heart Pattern\n2. Zero to Latte Art in 30 Minutes — Your First Pour\n\n[DESCRIPTION]\nIn this video, designed for absolute beginners, we cover everything from milk selection and steaming temperature to foam quality control, pouring angle, and basic latte art patterns (heart, rosetta)…\n\n[TAGS]\nlatte art, coffee tutorial, beginner coffee, espresso, milk frothing, home barista\n\n[THUMBNAIL IDEAS]\nLeft: Close-up of a finished latte with clear heart pattern. Right: Overlay text "Latte Art from Zero." Background: warm-toned wooden tabletop.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },

  'ai-prompt-generator': {
    zh: {
      summary:
        'AI 绘画提示词生成器用于把简短画面想法整理成可复制的英文绘图提示词。你可以选择风格，让同一个主题形成不同视觉方向，再拿去 Midjourney、Stable Diffusion 或其它图像模型中测试。',
      input:
        '填写画面主题并选择风格。主题可以写主体、场景、镜头、光线、材质、色彩和用途，例如“雨夜街头的赛博朋克猫”“咖啡馆海报主视觉”。信息越具体，提示词越容易保持画面方向。',
      output:
        '结果通常包含多套英文提示词和简短说明。你可以分别复制不同方案，测试哪一套更适合当前图片任务，再继续补充负面词、比例参数或品牌要求。',
      processing:
        '画面想法太短时，生图模型容易丢主体、风格或构图重点。输入主题和风格后，工具会整理成更完整的视觉 brief，并给出几套可尝试的英文提示词。结果是创作草稿，正式商用前请检查版权、品牌元素、人物肖像和平台使用规则。',
      modes: ['画面主题输入', '风格预设选择', '多套提示词方案', '英文主提示词', '中文说明', '单套复制'],
      example: {
        title: 'AI 绘画提示词生成输入到输出示例',
        input: '主题: 一只穿着风衣的猫站在赛博朋克雨夜街头，霓虹灯倒影在地面水洼中，电影感灯光\n风格: 赛博朋克',
        output:
          'Prompt 1\nA noir-style anthropomorphic cat in a trench coat standing on a rainy cyberpunk street at night, neon signs reflecting in puddles, cinematic volumetric fog, wet asphalt, blue and magenta rim lighting, shallow depth of field, shot on 35mm anamorphic lens, hyper-detailed fur texture, Blade Runner aesthetic --ar 16:9 --v 6\n\n说明: 这套提示词以《银翼杀手》视觉风格为参考，强调雨夜氛围、霓虹色调和电影级虚化。适合 Midjourney v6 使用，可添加 --no text, watermark 排除多余元素。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The AI Image Prompt Generator turns a short visual idea into copy-ready English prompts. Choose a style, compare a few directions, then test the prompt in Midjourney, Stable Diffusion, or another image model.',
      input:
        'Enter the visual idea and choose a style. The brief can include subject, setting, camera angle, lighting, material, color, mood, and intended use. More concrete details keep the prompt closer to the image you want.',
      output:
        'The result usually contains several prompt options with short notes. Copy one option at a time, test it in your image model, then add negative prompts, aspect ratio, brand constraints, or extra details as needed.',
      processing:
        'Short image ideas often lose the subject, style, or composition once they reach an image model. Add the idea and style, then use the expanded visual brief and English prompt options as a creative starting point. Review copyright, brand elements, likeness rights, and platform rules before commercial use.',
      modes: ['Visual idea input', 'Style preset selection', 'Multiple prompt options', 'English main prompt', 'Short explanatory notes', 'Copy each option'],
      example: {
        title: 'AI prompt generation input-to-output example',
        input: 'Topic: A cat in a trench coat standing on a rainy cyberpunk street at night, neon signs reflecting in puddles, cinematic lighting\nStyle: Cyberpunk',
        output:
          'Prompt 1\nA noir-style anthropomorphic cat in a trench coat standing on a rainy cyberpunk street at night, neon signs reflecting in puddles, cinematic volumetric fog, wet asphalt, blue and magenta rim lighting, shallow depth of field, shot on 35mm anamorphic lens, hyper-detailed fur texture, Blade Runner aesthetic --ar 16:9 --v 6\n\nNote: This prompt references Blade Runner visuals, emphasizing rainy-night mood, neon tones, and cinematic bokeh. Works well with Midjourney v6. Add --no text, watermark to exclude unwanted elements.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },


  'ai-video-script': {
    zh: {
      summary:
        'AI 视频脚本生成器用于把视频想法、短片创意或内容主题整理成可拍摄的脚本草稿。你可以选择平台、时长和语气，生成开场钩子、分镜段落、旁白、字幕提示和行动号召。',
      input:
        '填写视频主题、短片创意、目标平台、预计时长和语气。主题可以包含受众、产品卖点、故事线、拍摄限制、必须提到的信息或想避开的表达。',
      output:
        '结果是一份按段落组织的视频或短片脚本，包含开场、主要内容、画面提示、口播或旁白、字幕重点和结尾引导。你可以复制后交给拍摄、剪辑或运营同事继续调整。',
      processing:
        '短视频卡住时，问题通常不是没有主题，而是不知道开头、转折和结尾该怎么排。选择平台和时长后，工具会把脚本密度、镜头节奏和口播重点整理成拍摄草稿。发布前请核对事实、产品承诺、合规表述、品牌语气和平台规则。',
      modes: ['视频主题输入', '平台选择', '时长选择', '语气选择', '分镜脚本', '全文复制'],
      example: {
        title: 'AI 视频脚本生成输入到输出示例',
        input: '主题: 一个 60 秒短片，讲 5 个提升办公效率的隐藏技巧\n时长: 60s 以内\n平台: 抖音\n语气: 教育型 + 轻松幽默',
        output:
          '## 开场钩子 (0-3s)\n画面: 桌面堆满文件和便利贴的快切 → 突然清空只留一台笔记本。\n旁白:「你有没有觉得——明明忙了一天，真正做完的事却不超过三件？」\n\n## 镜头 1 (3-15s)\n画面: 特写手指在键盘上按下 Win+V 键。屏幕弹出剪贴板历史面板。\n旁白:「第一个隐藏技巧：Win+V 打开剪贴板历史，再也不用来回 Ctrl+C/V 切换。」\n\n## 镜头 2 (15-28s)\n…（后续分镜略）\n\n## 结尾 CTA (55-60s)\n画面: 创作者面对镜头微笑 + 屏幕弹出关注动画。\n旁白:「收藏这条视频，周一上班第一个试!」\n字幕: 点击关注 → 每周解锁更多效率技巧',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Video Script Generator turns a video idea, short movie concept, or content topic into a shootable script draft. Choose a platform, duration, and tone to get an opening hook, scene outline, voiceover, subtitle cues, and call to action.',
      input:
        'Enter the video topic, short movie idea, target platform, expected duration, and tone. The topic can include audience, selling points, storyline, filming limits, required claims, or wording you want to avoid.',
      output:
        'The result is a sectioned video or short movie script with opening, main points, visual cues, spoken lines or voiceover, subtitle highlights, and closing prompt. Copy it into your production notes and adjust it for the real shoot.',
      processing:
        'Short-form videos often stall because the hook, turn, and ending are unclear. Choose the platform and duration, then use the draft to shape script density, pacing, and voiceover points. Check facts, product claims, compliance wording, brand voice, and platform rules before publishing.',
      modes: ['Video topic input', 'Platform selection', 'Duration selection', 'Tone selection', 'Scene script draft', 'Full-text copy'],
      example: {
        title: 'AI video script generation input-to-output example',
        input: 'Topic: A 60-second short movie idea about 5 hidden productivity hacks for office workers\nDuration: Under 60s\nPlatform: TikTok\nTone: Educational + Light Humor',
        output:
          '## Opening Hook (0-3s)\nVisual: Fast cuts of a messy desk piled with papers and sticky notes → suddenly cleared to just one laptop.\nVoiceover: "Ever feel like you were busy all day — but actually finished fewer than three real things?"\n\n## Scene 1 (3-15s)\nVisual: Close-up of fingers pressing Win+V keys. Clipboard history panel pops up on screen.\nVoiceover: "First hidden hack: Win+V opens clipboard history. Never juggle Ctrl+C/V back and forth again."\n\n## Scene 2 (15-28s)\n… (remaining scenes truncated)\n\n## Closing CTA (55-60s)\nVisual: Creator smiles at camera + follow animation pops up on screen.\nVoiceover: "Save this video and try the first one Monday morning!"\nSubtitle: Follow for weekly productivity hacks →',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },


  'ai-excel-formula': {
    zh: {
      summary:
        'AI Excel 公式生成器用于把表格需求转换成 Excel 或 Google Sheets 公式。适合处理查找、汇总、条件判断、日期计算和文本拆分等常见任务。',
      input:
        '用自然语言描述你要完成的表格任务，并说明列名、示例数据和期望结果。描述越接近真实表格，公式越容易直接套用。',
      output:
        '结果包含可复制公式和简短解释。复制到表格前，请确认区域引用、分隔符、语言版本和函数兼容性。',
      processing:
        '表格问题写得清楚，公式才容易复核。描述目标、条件和数据范围后，工具会给出适合 Excel 或 Google Sheets 的公式思路。复杂财务、统计或合规计算仍需要人工验证。',
      modes: ['自然语言需求输入', 'Excel 公式', 'Google Sheets 公式', '公式解释', '示例用法', '一键复制'],
      example: {
        title: 'AI Excel 公式生成输入到输出示例',
        input: '需求: A 列是销售区域（如华东、华南、华北），B 列是订单金额，C 列是订单日期（格式 YYYY-MM-DD）。需求：计算 2026 年 5 月华东区域的总订单金额。\n表格类型: Microsoft Excel',
        output:
          '## 推荐公式\n\n```excel\n=SUMIFS(B:B, A:A, "华东", C:C, ">=2026-05-01", C:C, "<=2026-05-31")\n```\n\n## 参数说明\n- **B:B** — 求和区域（订单金额列）。\n- **A:A** — 第一组条件判断区域（销售区域列）。\n- **"华东"** — 第一组条件的匹配值。\n- **C:C, ">=2026-05-01"** — 第二组条件：订单日期大于等于 5 月 1 日。\n- **C:C, "<=2026-05-31"** — 第三组条件：订单日期小于等于 5 月 31 日。\n\n## 注意事项\n- SUMIFS 的第一个参数是求和区域，后续参数按"条件区域, 条件"成对出现，与 SUMIF 参数顺序不同。\n- 如果数据量较大（超过数万行），建议将 B:B 等整列引用改为具体范围（如 B2:B5000）以提升计算效率。\n- 适用于 Excel 2007 及以上版本。Google Sheets 语法完全兼容。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Excel Formula Generator turns spreadsheet tasks into Excel or Google Sheets formulas. Use it for lookups, summaries, conditional logic, date calculations, and text cleanup.',
      input:
        'Describe the spreadsheet task in plain language, including column names, sample data, and the expected result. The closer the description is to your real sheet, the easier the formula is to apply.',
      output:
        'The result includes a copyable formula and a short explanation. Before using it, check cell ranges, separators, locale settings, and function compatibility in your spreadsheet app.',
      processing:
        'A clear spreadsheet task makes the formula easier to review. Describe the goal, conditions, and data range, then use the generated approach in Excel or Google Sheets. Verify complex finance, statistics, or compliance calculations by hand before relying on them.',
      modes: ['Natural-language task input', 'Excel formula', 'Google Sheets formula', 'Formula explanation', 'Usage example', 'One-click copy'],
      example: {
        title: 'AI Excel formula generation input-to-output example',
        input: 'Requirement: Column A is sales region (East, South, North), Column B is order amount, Column C is order date (format YYYY-MM-DD). Calculate the total order amount for the East region in May 2026.\nSpreadsheet type: Microsoft Excel',
        output:
          '## Recommended Formula\n\n```excel\n=SUMIFS(B:B, A:A, "East", C:C, ">=2026-05-01", C:C, "<=2026-05-31")\n```\n\n## Parameter Breakdown\n- **B:B** — Sum range (order amount column).\n- **A:A** — First criteria range (sales region column).\n- **"East"** — First criteria match value.\n- **C:C, ">=2026-05-01"** — Second criteria pair: order date on or after May 1.\n- **C:C, "<=2026-05-31"** — Third criteria pair: order date on or before May 31.\n\n## Notes\n- In SUMIFS, the first argument is the sum range, followed by pairs of (criteria range, criteria). This order differs from SUMIF.\n- For large datasets (tens of thousands of rows or more), consider replacing full-column references like B:B with specific ranges (e.g. B2:B5000) to improve performance.\n- Compatible with Excel 2007+ and Google Sheets (identical syntax).',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },

  'ai-regex': {
    zh: {
      summary:
        'AI 正则生成器用于把匹配需求转换成正则表达式。适合提取邮箱、订单号、URL、日期、代码片段或自定义文本模式。',
      input:
        '描述你要匹配或排除的内容，并补充示例文本。请说明大小写、全局匹配、数字范围、分隔符或必须保留的边界条件。',
      output:
        '结果包含正则表达式、测试样例和简短解释。复制到项目中前，请用真实数据测试，尤其注意多语言字符、换行和转义规则。',
      processing:
        '正则最怕只看起来能匹配。说明要匹配的文本、排除条件和目标环境后，工具会给出可测试的表达式和示例。正则可能因语言或运行环境不同而表现不同，使用前需要在目标环境验证。',
      modes: ['匹配需求输入', '示例文本', '正则表达式', '测试样例', '语法解释', '复制使用'],
      example: {
        title: 'AI 正则表达式生成输入到输出示例',
        input: '匹配需求: 匹配合法电子邮件地址。要求：支持常用的个人和企业邮箱（如 Gmail、Outlook、公司域名邮箱），允许大小写字母、数字、点号、下划线和连字符在 @ 前出现，域名部分允许多级子域名，顶级域名至少两个字母。排除没有 @ 符号、@ 前后为空、或含有连续点号的无效格式。\n正则风格: JavaScript',
        output:
          '## 正则表达式\n\n```javascript\n/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/\n```\n\n## 模式分解\n- `^` — 匹配字符串开头。\n- `[a-zA-Z0-9._%+-]+` — 本地部分：允许字母、数字和 . _ % + - 字符，至少一个。\n- `@` — 必须包含 @ 符号。\n- `[a-zA-Z0-9.-]+` — 域名部分：允许字母、数字、点号和连字符，至少一个。\n- `\\.` — 顶级域名前的点号（转义为字面量）。\n- `[a-zA-Z]{2,}` — 顶级域名：仅允许字母，至少 2 个字符。\n- `$` — 匹配字符串结尾。\n\n## 匹配示例\n✅ user@example.com\n✅ first.last@sub.example.co.uk\n✅ user+tag@domain.com\n❌ user@domain（缺少 TLD）\n❌ @domain.com（本地部分为空）\n❌ user..name@domain.com（连续点号）\n\n## 边界提醒\n- 该正则允许域名中出现连续连字符（如 user@dom--ain.com），如需排除可将域名部分改为 `(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\\.`。\n- 顶级域名最大长度在实际中应 ≤ 63 字符，可添加 {2,63} 约束。\n- 如需在表单中做严格校验，建议先用该正则做格式过滤，再通过发送验证邮件确认地址真实有效。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Regex Generator turns matching requirements into regular expressions. Use it to extract emails, order IDs, URLs, dates, code fragments, or custom text patterns.',
      input:
        'Describe what you want to match or exclude, and add sample text if possible. Mention case sensitivity, global matching, number ranges, separators, or boundary rules that must be preserved.',
      output:
        'The result includes a regular expression, test examples, and a short explanation. Before using it in a project, test it with real data, especially for multilingual text, line breaks, and escaping rules.',
      processing:
        'A regex should be tested against both matches and non-matches. Describe the text, exclusions, and target environment, then use the expression and examples as a reviewable draft. Regex behavior can vary by language and runtime, so verify the pattern in your target environment before shipping it.',
      modes: ['Matching requirement input', 'Sample text', 'Regular expression', 'Test examples', 'Syntax explanation', 'Copy to use'],
      example: {
        title: 'AI regex generation input-to-output example',
        input: 'Requirement: Match valid email addresses. Support common personal and corporate emails (Gmail, Outlook, company domain emails). Allow uppercase and lowercase letters, digits, dots, underscores, and hyphens before the @ sign. Domain part allows multiple levels of subdomains. TLD must be at least two letters. Exclude invalid formats: missing @, empty local or domain part, or consecutive dots.\nFlavor: JavaScript',
        output:
          '## Regular Expression\n\n```javascript\n/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/\n```\n\n## Pattern Breakdown\n- `^` — Match start of string.\n- `[a-zA-Z0-9._%+-]+` — Local part: allows letters, digits, and . _ % + - characters; at least one.\n- `@` — Required @ symbol.\n- `[a-zA-Z0-9.-]+` — Domain part: allows letters, digits, dots, and hyphens; at least one.\n- `\\.` — Dot before TLD (escaped as literal).\n- `[a-zA-Z]{2,}` — TLD: letters only, at least 2 characters.\n- `$` — Match end of string.\n\n## Match Examples\n✅ user@example.com\n✅ first.last@sub.example.co.uk\n✅ user+tag@domain.com\n❌ user@domain (missing TLD)\n❌ @domain.com (empty local part)\n❌ user..name@domain.com (consecutive dots)\n\n## Edge Case Notes\n- This pattern allows consecutive hyphens in the domain (e.g. user@dom--ain.com). To exclude, change the domain part to: `(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\\.`.\n- TLD maximum length should be ≤ 63 characters in practice; consider adding {2,63} constraint.\n- For strict form validation, it\'s recommended to use this regex for format filtering first, then send a verification email to confirm the address is genuinely valid.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },

  'logo-generator': {
    zh: {
      summary:
        'AI Logo & Avatar Generator 用于根据品牌描述、核心符号、配色偏好和设计风格，生成可直接使用的方形 Logo 或头像草稿。适合独立开发者找应用图标、电商卖家试店铺标识、创作者做频道头像，也适合设计师在正式出图前快速比几个方向。你可以直接写文字描述，也可以上传参考图提取视觉方向。生成结果是概念草稿，正式使用前仍需做品牌、商标和设计复核。',
      input:
        '核心输入是品牌概念描述：写清行业、品牌个性、想用的核心符号和使用场景（如网站 favicon、App 图标、社媒头像）。可选填配色偏好（具体色名、品牌色或情绪色板均可）和设计风格（极简、扁平、卡通吉祥物、抽象几何、字母标志、3D、复古、水彩 8 选 1）。你也可以上传一张参考图，工具会从中提取配色、主体和风格方向，自动带入描述。',
      output:
        '结果是一张适合 Logo、头像或应用图标使用的 1:1 正方形图片，预览区会用棋盘格背景帮助你判断透明或半透明边缘。你可以下载 PNG 继续交给设计工具处理，也可以把它当作风格方向给团队讨论。正式使用前请检查可读性、缩小后的识别度、商标相似风险、字体授权和品牌色是否符合实际品牌规范。',
      processing:
        '新项目起名以后，Logo 往往还停留在几句模糊描述里：行业、情绪、颜色、一个想用的符号。你可以直接写品牌概念，也可以上传参考图提取视觉方向；工具会把这些线索整理成方形 Logo 或头像草稿。它适合早期探索和内部比稿，不适合直接完成商标设计。上线前请找设计或品牌负责人复核相似性、字形、缩小后的识别度和商标风险。',
      modes: ['文字描述生成 Logo', '参考图视觉方向提取', '8 种 Logo 设计风格预设', '1:1 正方形输出', '棋盘格背景校验透明区', '大尺寸图片预览', 'PNG 下载'],
      example: {
        title: 'Logo 生成输入到输出示例',
        input: '颜色: 深蓝与金色\n核心概念: 面向开发者的云端自动化工具，图形包含围绕中心旋转的轨道和代码花括号\n风格: Minimalist / 极简风',
        output: '生成一张深蓝与金色配色、白色背景、以轨道弧线和代码花括号为核心视觉元素的极简风格 1:1 Logo 图片。右侧面板预览显示大尺寸锐利图形，用户可直接下载 PNG 用于网站 favicon 或 App 启动图标。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The AI Logo & Avatar Generator creates square logo or avatar drafts from brand descriptions, core symbols, color preferences, and design styles. It helps indie developers explore app icons, ecommerce sellers test store or product-line marks, creators shape channel avatars, and designers compare early directions before investing in polished brand work. You can start from text or use a reference image for visual direction. Results are best treated as concept drafts that still need brand, legal, and design review.',
      input:
        'The core input is your brand concept: describe the industry, brand personality, the central symbol you have in mind, and where the logo will be used (website favicon, app icon, social avatar). Optionally add a color preference (color names, brand colors, or a mood palette) and pick one of 8 styles — Minimalist, Flat, Mascot, Abstract Geometry, Lettermark, 3D, Vintage, or Watercolor. You can also upload a reference image, and the tool pulls color, subject, and style direction from it into the description.',
      output:
        'The result is a square 1:1 image suitable for logos, avatars, or app icons. The preview uses a checkerboard background so transparent or semi-transparent edges are easier to inspect. Download the PNG for further design work or use it as a visual direction in team review. Before using it publicly, check readability, small-size recognition, trademark similarity, font rights, and whether the colors match the real brand system.',
      processing:
        'A new brand often starts with loose notes: industry, mood, colors, and one symbol you keep coming back to. Write those notes directly, or use a reference image to capture a visual direction. The tool turns those cues into square logo or avatar drafts you can compare with a team. It is for exploration, not final trademark work. Before launch, review similarity risk, type choices, small-size readability, color accuracy, and brand ownership.',
      modes: ['Text-prompt logo generation', 'Reference-image visual direction', '8 logo design style presets', '1:1 square output', 'Checkerboard background for transparency review', 'Large-size image preview', 'PNG download'],
      example: {
        title: 'Logo generation input-to-output example',
        input: 'Color: Deep Navy & Gold\nConcept: A cloud automation tool for developers, featuring orbiting arcs and code curly braces around a center\nStyle: Minimalist',
        output: 'A deep navy and gold, white-background, minimalist 1:1 logo image centered on orbital arc lines and code curly braces. The preview panel shows a large, crisp graphic ready for download as a PNG for website favicon or App launch icon use.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ai-image-generator': {
    zh: {
      summary:
        'AI Image Generator 用于把自然语言画面描述转换为图片草稿，可选画幅比例和视觉风格。适合为博客封面、社媒配图、广告素材和短视频封面快速探索视觉方向，再把满意的方向交给设计细化。提供 1:1、16:9、9:16 三种画幅和六种风格，结果可下载后继续修图。',
      input:
        '三个核心参数：画面描述、画幅比例和艺术风格。画面描述可以写主体、场景、动作、构图、光线、色彩、镜头、材质和最终用途，例如“适合博客封面”或“用于 Instagram 帖子”。画幅比例支持 1:1 方形、16:9 横向和 9:16 竖向；艺术风格包含摄影写实、动漫、数字艺术、油画、3D 渲染和赛博朋克。描述越具体，结果越容易贴近你的使用场景。',
      output:
        '结果是一张可预览、可下载的图片草稿，并保留当前画幅和风格信息，便于你比较不同方向。它适合做博客封面、社交媒体配图、视频缩略图或概念视觉的起点。正式使用前请检查文字、水印、人物肖像、品牌元素、版权风险和平台尺寸要求。',
      processing:
        '做封面或配图时，空泛描述通常会产出一张漂亮但没法用的图。先写清主体、场景、镜头、光线和用途，再选画幅和风格；工具会把这些约束变成一张符合场景的图片草稿。生成结果适合拿来比方向、做初稿或交给设计继续修，不适合直接承诺真实产品、真实人物或官方品牌授权。',
      modes: ['自然语言多行画面描述', '三种画幅比例（1:1 方形 / 16:9 横向 / 9:16 竖向）', '六种艺术风格预设（摄影/动漫/数字艺术/油画/3D/赛博）', '图片预览', 'PNG 下载', '用途与版权复核提醒'],
      example: {
        title: 'AI 图片生成输入到输出示例',
        input: '描述: A futuristic city bathed in neon pink and blue lights during heavy rain at night, wet asphalt reflecting the glow of towering holographic billboards, cinematic depth of field, cyberpunk atmosphere\n比例: 16:9\n风格: Cyberpunk / 赛博朋克',
        output: '生成一张 16:9 横向赛博朋克雨夜城市图片，霓虹灯与全息广告牌的光影在湿润沥青路面上形成丰富反射，预览面板展示锐利高清图像。标题栏显示模型名（如 Flux）和生成耗时（如 3200ms），用户可直接下载 PNG 用于社交媒体封面或桌面壁纸。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The AI Image Generator turns natural-language descriptions into image drafts with selectable aspect ratios and art styles. Use it to explore visual directions for blog covers, social graphics, ads, and short-video thumbnails before handing the best one to a designer. It supports 1:1, 16:9, and 9:16 output and six art styles, with downloadable results for further editing.',
      input:
        'Three core parameters shape the result: image description, aspect ratio, and art style. The description can cover subject, scene, action, composition, lighting, color, lens feel, material, and intended use, such as "suitable for a blog cover" or "for an Instagram post." Aspect ratios cover 1:1 square, 16:9 landscape, and 9:16 portrait. Art styles include photorealistic, anime, digital art, oil painting, 3D render, and cyberpunk. More concrete details usually produce a more usable draft.',
      output:
        'The result is a previewable, downloadable image draft with the selected aspect ratio and style preserved for comparison. Use it as a starting point for blog covers, social graphics, video thumbnails, or concept visuals. Before publishing, check for unwanted text, watermarks, likeness issues, brand elements, copyright risk, and platform size requirements.',
      processing:
        'For covers and campaign visuals, vague prompts often create attractive images that do not fit the job. Describe the subject, scene, camera feel, lighting, and final use, then choose the aspect ratio and style. The tool turns those constraints into an image draft for comparison, early design direction, or further editing. Do not use the result as evidence of a real product, real person, or official brand authorization.',
      modes: ['Natural-language multi-line image description', 'Three aspect ratios (1:1 Square / 16:9 Landscape / 9:16 Portrait)', 'Six art style presets (Photorealistic / Anime / Digital Art / Oil Painting / 3D / Cyberpunk)', 'Image preview', 'PNG download', 'Usage and copyright review reminder'],
      example: {
        title: 'AI image generation input-to-output example',
        input: 'Prompt: A futuristic city bathed in neon pink and blue lights during heavy rain at night, wet asphalt reflecting the glow of towering holographic billboards, cinematic depth of field, cyberpunk atmosphere\nRatio: 16:9\nStyle: Cyberpunk',
        output: 'A 16:9 widescreen cyberpunk rainy-night city image is generated with vivid neon reflections on wet asphalt. The preview panel displays a crisp high-resolution image. The header shows model name (e.g. Flux) and generation time (e.g. 3200ms). The user can download the PNG directly for social media cover or desktop wallpaper use.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ai-svg-generator': {
    zh: {
      summary:
        'Smart SVG Generator 用于根据图标或插画描述生成可复制、可下载的 SVG 矢量草稿。它适合需要缩放不失真、文件体积小、还能继续在 Figma、Illustrator 或 Inkscape 中编辑的场景，例如 UI 图标、空状态插画、功能引导图、favicon、App 图标和轻量装饰图形。工具支持扁平、线性、极简和彩色四种矢量风格，结果可以先预览，再复制代码或下载 .svg 文件继续加工。',
      input:
        '两个核心输入：图形描述和目标风格。图形描述里写清主体（如喝咖啡的猫、邮件图标、空状态插画）、用途与尺寸、形状语言（圆角柔和或锐利科技感）、线条粗细、颜色方向、是否要背景、元素复杂度和特殊要求（对称、可平铺等）。目标风格在扁平、线性、极简、彩色中选一个。描述越具体，生成的矢量图越贴近你的设计意图。',
      output:
        '结果会同时提供矢量预览和可复制的 SVG 源码。你可以先看图形是否符合主体、比例、线条和颜色要求，再复制代码放进项目，或下载 .svg 文件交给 Figma、Illustrator、Inkscape 继续编辑。正式使用前请检查视图框、颜色、无障碍命名、商标相似风险和在小尺寸下的清晰度。',
      processing:
        '位图适合氛围图，SVG 更适合图标、空状态插画、简单符号和需要缩放的界面资产。先写清主体、用途、尺寸、线条、颜色和复杂度，再选择扁平、线性、极简或彩色风格；工具会生成一份可预览、可复制、可继续编辑的矢量草稿。它不能保证每个路径都符合你的设计系统，落地前请让设计或工程同事检查命名、颜色变量、可访问性和小尺寸显示效果。',
      modes: ['自然语言 SVG 描述（主体/用途/形状/颜色/复杂度）', '四种矢量风格（Flat / Line Art / Minimalist / Colorful）', 'SVG 矢量预览', '复制 SVG 代码', '下载 .svg 文件', '设计系统复核提醒'],
      example: {
        title: 'SVG 生成输入到输出示例',
        input: '描述: 一个可爱的猫咪在喝咖啡的线性图标，圆角线条风格，适合网页空状态插画使用，纯色 #FF6B6B 描边，透明背景，简洁但有趣\n风格: Line Art / 线性图标',
        output: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">...(猫咪喝咖啡 SVG 路径代码)...</svg>\n预览面板实时展示红色描边的猫咪咖啡矢量图超清缩放效果，用户可一键复制 SVG 代码粘贴到 React 组件，或下载 .svg 文件到 Figma 继续编辑。',
        inputLanguage: 'text',
        outputLanguage: 'xml',
      },
    },
    en: {
      summary:
        'The Smart SVG Generator creates copyable and downloadable SVG vector drafts from natural-language icon or illustration descriptions. It is useful when you need scalable UI icons, empty-state illustrations, onboarding graphics, favicons, app icons, landing-page decorations, or small editable vector assets for Figma, Illustrator, or Inkscape. The tool supports flat, line-art, minimalist, and colorful styles, then lets you preview the result, copy the SVG code, or download a .svg file for further editing.',
      input:
        'Two core inputs shape the result: the graphic description and the target style. In the description, cover the subject (e.g. a cat drinking coffee, a send-mail icon, an empty-state illustration), the intended use and size, the shape language (soft rounded vs. sharp and technical), stroke weight, color direction, whether you need a background, element complexity, and any special needs (symmetry, tileable, etc.). Pick one target style from flat, line art, minimalist, or colorful. The more specific the description, the closer the vector output matches your intent.',
      output:
        'The result provides both a vector preview and copyable SVG source. Check whether the subject, proportions, strokes, and colors match the brief, then copy the code into a project or download the .svg file for editing in Figma, Illustrator, or Inkscape. Before shipping, review the view box, colors, accessibility naming, trademark similarity, and clarity at small sizes.',
      processing:
        'Bitmap images work for mood, but SVG works better for icons, empty states, simple marks, and scalable interface assets. Describe the subject, use case, size, stroke style, colors, and complexity, then choose flat, line art, minimalist, or colorful styling. The tool creates a vector draft you can preview, copy, and edit further. It cannot guarantee the paths match your design system, so have a designer or engineering owner review naming, color tokens, accessibility, and small-size clarity before shipping.',
      modes: ['Natural-language SVG description (subject / usage / shape / color / complexity)', 'Four vector styles (Flat / Line Art / Minimalist / Colorful)', 'SVG vector preview', 'Copy SVG code', 'Download .svg file', 'Design-system review reminder'],
      example: {
        title: 'SVG generation input-to-output example',
        input: 'Description: A cute cat drinking coffee line-art icon, rounded stroke style, suitable for a web empty-state illustration, solid #FF6B6B stroke, transparent background, simple but playful\nStyle: Line Art',
        output: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">...(cat drinking coffee SVG path data)...</svg>\nThe preview panel shows a crisp, infinitely zoomable red-stroke cat-and-coffee vector graphic in real time. Users can copy the SVG code with one click to paste into a React component, or download the .svg file for further editing in Figma.',
        inputLanguage: 'text',
        outputLanguage: 'xml',
      },
    },
  },

  'ai-xiaohongshu': {
    zh: {
      summary:
        '小红书文案生成器用于把主题、关键词和笔记风格整理成图文笔记草稿。适合产品种草、探店打卡、教程分享、好物合集和日常内容选题。',
      input:
        '填写核心主题，补充需要出现的关键词，并选择笔记风格。主题可以写产品、场景、目标人群、价格带、使用体验或想表达的观点。',
      output:
        '结果包含标题方向、正文草稿、话题标签和互动引导。你可以复制后按真实体验、图片素材和账号语气继续修改。',
      processing:
        '小红书笔记不能只堆卖点，还要有开头场景、体验顺序和可相信的细节。选择风格后，工具会整理标题、正文和标签方向。发布前请核对产品事实、价格、功效描述、广告合规和平台社区规则。',
      modes: ['主题输入', '关键词约束', '五种笔记风格', '标题和正文草稿', '话题标签', '全文复制'],
      example: {
        title: '小红书文案生成输入到输出示例',
        input: '核心主题: 油皮冬季极简护肤流程，适合学生党和上班族，通勤早上 5 分钟搞定\n关键词: 平价, 控油, 不搓泥, 哑光质感\n风格: 干货教程',
        output: '## 【油皮冬季护肤】学生党通勤 5 分钟搞定，平价好用不踩雷！\n\n姐妹们冬天油皮真的太难了...又要控油又要保湿，早上起来满脸油光但脸颊又起皮😭\n\n经过一个冬天的实测，这套流程真的绝绝子！总共才 3 步，早上 5 分钟出门：\n\n### Step 1 洁面\n...（正文略）\n\n#油皮护肤 #冬季护肤 #精简护肤 #学生党护肤 #平价好物推荐',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The Xiaohongshu Caption Generator turns a topic, keywords, and note style into a draft post. Use it for product seeding, store check-ins, tutorials, product roundups, and daily content ideas.',
      input:
        'Enter the core topic, add keywords that must appear, and choose a note style. The topic can cover product, setting, audience, price range, usage experience, or the point you want to make.',
      output:
        'The result includes title ideas, a body draft, hashtags, and an engagement prompt. Copy it, then adjust the wording to match your real experience, image set, and account voice.',
      processing:
        'A Xiaohongshu post needs more than a list of selling points; it needs a scene, a readable flow, and believable detail. Choose a style, then use the draft for title, body, and hashtag direction. Before posting, check product facts, prices, benefit claims, ad disclosure, and Xiaohongshu community rules.',
      modes: ['Topic input', 'Keyword constraints', 'Five note styles', 'Title and body draft', 'Hashtags', 'Full-text copy'],
      example: {
        title: 'Xiaohongshu copy generation input-to-output example',
        input: 'Topic: Minimalist winter skincare routine for oily skin, suitable for students and office workers, 5-minute morning commute routine\nKeywords: affordable, oil-control, no pilling, matte finish\nStyle: Practical Tutorial',
        output: '## 【Oily-Skin Winter Skincare】5-Minute Commute Routine for Students — Affordable & Foolproof!\n\nGirls, oily skin in winter is truly such a struggle... you need oil control AND hydration. Wake up with a shiny T-zone but flaky cheeks 😭\n\nAfter a full winter of testing, this routine is a lifesaver! Just 3 steps, out the door in 5 minutes:\n\n### Step 1: Cleanser\n... (body continues)\n\n#oilySkinCare #winterSkincare #minimalistRoutine #studentSkincare #affordableFinds',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },

  'ai-text-polisher': {
    zh: {
      summary:
        'AI 文本润色工具用于把粗糙文本改成更清楚、更顺的版本。适合邮件、产品说明、社媒文案、报告段落和日常备注。',
      input:
        '粘贴需要修改的原文，选择目标语气或用途。保留事实、名称、数字、链接和专业术语；如果有必须保留的措辞，可以直接写在原文里。',
      output:
        '结果会给出一版可复制的改写文本。你可以继续检查事实、删减不需要的句子，或再换一种语气生成。',
      processing:
        '粗糙文本常见问题不是语法错，而是重点顺序不清、语气不稳或句子太绕。粘贴原文并选择目标语气后，工具会围绕清晰度、表达顺序和可读性改写文本，不应替你新增未提供的事实。对合同、医疗、金融或法律内容，请只把结果当作语言参考。',
      modes: ['原文输入', '语气选择', '清晰度改写', '语法和表达调整', '保留原意', '全文复制'],
      example: {
        title: 'AI 文本润色输入到输出示例',
        input: '原文: 这个工具可以帮你把很乱的描述改得更好，然后看起来专业一点，也不会有那么多啰嗦的话。\n语气: Professional / 正式专业',
        output: '该工具能够帮助用户优化结构松散的描述，使其表达更清晰、专业且精炼，避免冗余措辞。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The AI Text Polisher turns rough text into a clearer, smoother version. Use it for emails, product descriptions, social posts, report paragraphs, and everyday notes.',
      input:
        'Paste the original text and choose the target tone or use case. Keep facts, names, numbers, links, and technical terms clear; add any wording that must stay unchanged.',
      output:
        'The result is a copy-ready rewritten version. Review facts, remove anything unnecessary, or generate again with a different tone.',
      processing:
        'Rough text often fails because the point order, tone, or sentence shape is unclear, not because every sentence is wrong. Paste the source text and choose a tone, then review the rewrite for clarity and readability. For contracts, medical, financial, or legal text, treat the output as language support only.',
      modes: ['Original text input', 'Tone selection', 'Clarity rewrite', 'Grammar and phrasing polish', 'Meaning preserved', 'Full-text copy'],
      example: {
        title: 'AI text polishing input-to-output example',
        input: 'Original: This tool can help make messy descriptions better and then they look more professional and also not have so much wordy stuff.\nTone: Professional',
        output: 'This tool helps refine unstructured descriptions into clearer, more professional, and more concise expressions by eliminating unnecessary wordiness.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ai-translator': {
    zh: {
      summary:
        'AI 翻译工具用于把文本翻译成目标语言，并按场景调整语气。适合邮件、商品文案、社媒内容、说明文字和日常沟通。',
      input:
        '粘贴原文，选择目标语言和语气。原文可以包含短句、段落或多语言混合内容；专有名词、品牌名和数字最好保持清楚。',
      output:
        '结果是一版可复制的译文。你可以继续检查术语、品牌语气、地区表达和敏感内容，再用于正式发布。',
      processing:
        '翻译商务邮件、商品文案或客服回复时，直译常会丢语气和使用场景。输入原文、目标语言和上下文后，工具会给出更贴近语境的译文。涉及合同、合规、医疗或财务内容时，请交给专业人员复核。',
      modes: ['源文本输入', '目标语言选择', '语气选择', '上下文翻译', '术语保留', '全文复制'],
      example: {
        title: 'AI 翻译输入到输出示例',
        input: '源文本: 这款手工陶瓷马克杯采用极简造型与温润釉面，适合日常咖啡和作为有温度的伴手礼。由景德镇匠人手工拉坯，每只杯子的釉色纹理都独一无二。\n目标语言: English\n语气: Native / 地道母语',
        output: 'This handmade ceramic mug features a minimalist silhouette and a warm, tactile glaze — perfect for everyday coffee and as a heartfelt gift. Each piece is thrown by artisans in Jingdezhen, giving every mug a one-of-a-kind glaze pattern and texture.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The AI Translator translates text into a target language and adjusts tone for the use case. Use it for emails, product copy, social posts, instructions, and daily communication.',
      input:
        'Paste the source text, then choose the target language and tone. The source can include short lines, paragraphs, or mixed-language content; keep proper nouns, brand names, and numbers clear.',
      output:
        'The result is a copy-ready translation. Check terminology, brand voice, regional phrasing, and sensitive wording before using it publicly.',
      processing:
        'Business emails, product copy, and support replies lose tone when translated word by word. Add the source text, target language, and context, then review the translation for meaning and usage. For contracts, compliance, medical, or financial content, use a professional reviewer before publication.',
      modes: ['Source text input', 'Target language selection', 'Tone selection', 'Context-aware translation', 'Terminology preservation', 'Full-text copy'],
      example: {
        title: 'AI translation input-to-output example',
        input: 'Source: 这款手工陶瓷马克杯采用极简造型与温润釉面，适合日常咖啡和作为有温度的伴手礼。由景德镇匠人手工拉坯，每只杯子的釉色纹理都独一无二。\nTarget: English\nTone: Native',
        output: 'This handmade ceramic mug features a minimalist silhouette and a warm, tactile glaze — perfect for everyday coffee and as a heartfelt gift. Each piece is thrown by artisans in Jingdezhen, giving every mug a one-of-a-kind glaze pattern and texture.',
        inputLanguage: 'text',
        outputLanguage: 'text',
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
    },
  },

  'competitor-tracker': {
    zh: {
      summary:
        '竞品分析器用于把你的产品和竞品信息放在一起比较，找出卖点、弱项和文案机会。适合更新 Listing、准备广告角度或整理产品改进方向。',
      input:
        '填写你的产品描述和竞品详情。竞品信息可以来自标题、描述、规格、价格、评价摘要或你整理的观察结论。',
      output:
        '结果会按关键维度对比双方差异，并给出可继续验证的文案和产品建议。请结合真实评论、销量、价格和供应链情况判断优先级。',
      processing:
        '看竞品时，别只记录对方便宜还是贵。把自己的产品和竞品信息放在一起，工具会整理卖点差异、弱项和可测试的文案机会。结果是运营参考，不代表平台官方数据、真实销量或最终商业判断。',
      modes: ['我的产品描述', '竞品详情输入', '中英文输出', '卖点对比', '机会点建议', '报告复制'],
      example: {
        title: '竞品分析输入到输出示例',
        input: '我的产品: 手工编织托特包，天然玉米叶材质，可折叠收纳，内衬防水涂层，加宽加厚肩带不勒肩，适合海滩度假和日常通勤\n竞品详情: 同类草编托特包，售价低约 20 元，但近 50 条评价中 18 条提到"容量比图片看起来小很多、装不了笔记本电脑"，15 条提到"肩带太细背久了肩膀疼"，整体评分 3.8/5\n语言: 中文',
        output: 'My Score: 82 | Competitor: 68\n\n核心差异：\n- 容量与实用性: You: 可容纳15寸笔记本 vs Competitor: 仅日常小物 → 竞品容量虚标是差评主因，建议在首图和描述中突出实际容量对比\n- 肩带舒适度: You: 加宽加厚不勒肩 vs Competitor: 细肩带久背疼痛 → 这是核心差异化优势，建议在标题和首图卖点中强调"舒适肩带设计"\n- 价格感知: You: ¥89 vs Competitor: ¥69 → 20元价差在有容量和舒适度明显优势下合理，建议文案中强化"多花20元换不勒肩+能装电脑"的价值感',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The Competitor Tracker compares your product with a competitor to surface selling points, weaknesses, and copy opportunities. Use it when updating listings, planning ads, or collecting product-improvement ideas.',
      input:
        'Enter your product description and competitor details. Competitor notes can come from titles, descriptions, specs, pricing, review summaries, or observations you have already collected.',
      output:
        'The result compares both products across key dimensions and suggests copy or product angles worth checking. Use real reviews, sales, prices, and supply-chain constraints to decide priorities.',
      processing:
        'Competitor review should go beyond whether the other product is cheaper. Compare your product and competitor notes side by side, then use the result to find selling-point gaps, weaknesses, and copy angles to test. Treat it as operational reference, not official platform data, verified sales data, or a final business decision.',
      modes: ['My product description', 'Competitor detail input', 'Chinese or English output', 'Selling-point comparison', 'Opportunity suggestions', 'Report copy'],
      example: {
        title: 'Competitor analysis input-to-output example',
        input: 'My product: Handwoven tote bag, natural corn-husk material, foldable, waterproof lining, wide padded shoulder straps, suitable for beach and daily commute\nCompetitor: Similar woven tote bag, priced about $3 lower, but 18 of 50 reviews mention "much smaller than photos suggest, cannot fit a laptop," 15 mention "straps too thin and dig in painfully," overall rating 3.8/5\nLanguage: English',
        output: 'My Score: 82 | Competitor: 68\n\nKey Differences:\n- Capacity & Practicality: You: fits 15" laptop vs Competitor: small daily items only → Competitor\'s overstated capacity is a key cause of negative reviews; suggest highlighting actual capacity comparison in hero image and description\n- Strap Comfort: You: wide padded, pain-free vs Competitor: thin straps, painful after extended wear → This is a core differentiator; emphasize "Comfort Strap Design" in title and hero-image selling points\n- Price Perception: You: $12.99 vs Competitor: $9.99 → The $3 gap is justifiable with clear capacity and comfort advantages; reinforce the value proposition of "spend $3 more for comfort + laptop capacity" in copy',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
  },

  'worldcup-match-predictor': {
    zh: {
      summary:
        '2026 世界杯由美国、墨西哥、加拿大合办，从小组赛到淘汰赛对阵密集。想在开赛前对一场比赛心里有个数？输入对阵的两支球队，工具会给出谁更被看好、胜平负的大致概率、几个可能的比分，以及爆冷的风险。它结合球队实力、常见比赛走势和大赛的比分分布来判断，你不需要自己准备任何数据，结果仅供赛前预判和球迷讨论，不构成投注建议。',
      input:
        '只要填对阵的两支球队，中文或英文队名都行。不用填别的，比赛资料工具会自己处理。',
      output:
        '你会看到这场比赛更被看好的一方、胜平负各自的概率区间、2-3 个最可能的比分，以及一段简短理由和风险提示。可能的比分会用图表呈现，方便你直观比较哪个比分更有可能。',
      processing:
        '看一场球之前，最想知道的无非是谁更稳、会不会闷平、比分大概是紧凑还是开放。填入两支球队，工具会就这几点给你一个清楚的判断，而不是甩给你一堆数字。要说明的是，它靠的是通用的足球分析，并没有接入实时伤停或首发名单，所以在下任何结论前，记得再看一眼最新的赛前消息。',
      modes: ['球队 A / 球队 B 输入', '胜平负概率区间', '最可能结果', '比分概率图表', '冷门风险提示'],
      example: {
        title: '世界杯小组赛预测示例',
        input: '球队 A: 美国\n球队 B: 澳大利亚',
        output:
          '最可能结果：美国小胜。\n胜平负概率：美国胜 48-55%，平局 25-30%，澳大利亚胜 18-23%。\n\n可能比分：\n· 2-1（约 32%）——美国小胜\n· 1-1（约 27%）——平局，次可能\n· 1-0（约 22%）——低比分小胜\n\n理由：美国整体实力略占优，进攻选择更多；澳大利亚有能力把比赛拖进低比分。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The 2026 World Cup, co-hosted by the USA, Mexico, and Canada, packs the group stage and knockouts with back-to-back fixtures. Want a quick read on a match before kickoff? Enter the two teams and the tool tells you who is favored, the rough win-draw-loss split, a few likely scorelines, and the upset risk. It weighs team strength, typical match flow, and tournament scoreline patterns — no data prep needed on your side. Results are for pre-match analysis and fan discussion, not betting advice.',
      input:
        'Just enter the two teams playing — Chinese or English names both work. Nothing else to fill in; the tool handles the match data for you.',
      output:
        'You will see which side is favored, the win-draw-loss probability ranges, the 2-3 most likely scorelines, a short reason, and a risk note. The likely scores are shown as a chart so you can compare at a glance which one is more probable.',
      processing:
        'Before a match, what you really want to know is who is steadier, whether it could end level, and whether the score will run tight or open. Enter the two teams and the tool gives you a clear read on exactly that, instead of a wall of numbers. One thing to keep in mind: it runs on general football analysis, not live injuries or confirmed lineups — so check the latest team news before drawing any conclusions.',
      modes: ['Team A / Team B input', 'Win-draw-loss probability ranges', 'Most likely result', 'Score probability chart', 'Upset risk notes'],
      example: {
        title: 'World Cup group match prediction example',
        input: 'Team A: United States\nTeam B: Australia',
        output:
          'Most likely result: a narrow United States win.\nWin-draw-loss odds: United States 48-55%, draw 25-30%, Australia 18-23%.\n\nLikely scores:\n· 2-1 (about 32%) — narrow United States win\n· 1-1 (about 27%) — draw, second most likely\n· 1-0 (about 22%) — tight low-score win\n\nReason: the United States has a small quality edge and more attacking options, while Australia can keep the match tight.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },

  'market-insights': {
    zh: {
      summary:
        '市场洞察工具用于把平台、品类或产品想法整理成市场研究笔记。适合在选品、内容选题或广告测试前先梳理可能的机会和风险。',
      input:
        '选择平台和时间范围，并输入你关注的品类、趋势或产品方向。问题越具体，输出越容易形成可执行的验证清单。',
      output:
        '结果包含类目方向、趋势判断、机会点和下一步验证建议。请用平台搜索、广告工具、后台数据或真实订单继续确认。',
      processing:
        '选品早期最需要的是问题清单：这个方向谁会买、在哪个平台验证、风险在哪里。输入平台、时间范围和品类方向后，工具会整理市场研究草稿。它不是实时市场数据源，不能替代库存、采购、预算或投放决策。',
      modes: ['平台选择', '时间范围', '品类或产品方向', '机会点整理', '风险提醒', '验证建议'],
      example: {
        title: '市场洞察输入到输出示例',
        input: '平台: Etsy\n时间周期: 7 天\n语言: 中文',
        output: 'Etsy Insights | 2026-05-14 to 2026-05-21\n\n类目趋势:\n- Handmade Jewelry — Vol: 12.4K, Growth: +23%\n- Home Decor — Vol: 8.9K, Growth: +15%\n- Printable Planner — Vol: 6.2K, Growth: +31%\n- Digital Wall Art — Vol: 4.1K, Growth: +8%\n\n榜单洞察:\n1. 个性化珠宝首饰类目近 7 天搜索热度增长 23%，预计母亲节和毕业季送礼需求将持续推高\n2. 数字下载产品类目中的 printable planner 子类增长 31%，建议关注该方向的内容创作者合作机会\n3. 家居装饰类目保持温和增长，但需注意部分子类目的搜索量增速已出现放缓迹象',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The Ecommerce Market Insights Generator turns a platform, category, or product idea into market research notes. Use it before product selection, content planning, or ad testing to outline possible opportunities and risks.',
      input:
        'Choose a platform and timeframe, then enter the category, trend, or product direction you care about. A more specific question makes the output easier to turn into a validation checklist.',
      output:
        'The result includes category directions, trend notes, opportunity ideas, and next-step validation suggestions. Confirm the ideas with platform search, ad tools, store analytics, or real orders.',
      processing:
        'Early product research needs a question list: who might buy, where to validate, and what risks to check. Add the platform, timeframe, and category direction, then use the research draft to plan validation. It is not a live market data source and should not replace inventory, sourcing, budget, or ad decisions.',
      modes: ['Platform selection', 'Timeframe', 'Category or product direction', 'Opportunity notes', 'Risk reminders', 'Validation suggestions'],
      example: {
        title: 'Market insight input-to-output example',
        input: 'Platform: Etsy\nTimeframe: 7 days\nLanguage: English',
        output: 'Etsy Insights | 2026-05-14 to 2026-05-21\n\nCategory Trends:\n- Handmade Jewelry — Vol: 12.4K, Growth: +23%\n- Home Decor — Vol: 8.9K, Growth: +15%\n- Printable Planner — Vol: 6.2K, Growth: +31%\n- Digital Wall Art — Vol: 4.1K, Growth: +8%\n\nInsights:\n1. Handmade personalized jewelry has seen a 23% search increase over the past 7 days; demand is expected to be further driven by upcoming Mother\'s Day and graduation gift purchases.\n2. The printable planner subcategory within digital downloads shows a 31% growth rate; recommend exploring content-creator collaboration opportunities in this direction.\n3. Home decor maintains moderate growth, but note that some subcategories are beginning to show signs of decelerating search growth.',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
  },

  'ai-code-reviewer': {
    zh: {
      summary:
        'AI 代码审查工具用于对粘贴的代码片段做质量、性能、安全和可维护性审查。适合提交 Pull Request 前快速自查，也适合读他人代码时获得结构化反馈，帮你提前发现空值、异常处理、重复逻辑、命名和常见安全问题。它不替代真实评审，更适合当作提交前的第一轮检查。',
      input:
        '待审查的代码文本、代码语言和审查关注点。代码可以是一个函数、组件、接口处理器、工具方法、样式片段或配置逻辑；语言选项支持自动识别，也可以指定 JavaScript、TypeScript、React、Python、Java、Go、Rust、C++、CSS/SCSS 等。审查关注点用于控制反馈语气和重点，例如建设性建议、严格挑剔、新手友好或性能优化导向。',
      output:
        '结果是一份 Markdown 格式的代码审查报告，通常包含总体评价、主要问题、风险等级、改进建议、可能的重构方向和示例代码。你可以复制完整报告，也可以单独复制某段建议，把它带回编辑器、PR 评论或团队讨论中继续处理。',
      processing:
        '提交 PR 前，你可以先把最担心的一段代码贴进来：复杂分支、异步流程、权限判断、数据处理或刚改完的组件。工具会从质量、性能、安全和可维护性角度给出第一轮审查意见，帮你提前发现空值处理、异常分支、重复逻辑和命名问题。它不会替代真实评审、测试或编译结果；合并前仍要跑项目检查，并让熟悉业务的人确认建议是否适用。',
      modes: ['多语言代码审查', '自动语言识别', '审查关注点选择', 'Markdown 审查报告', '代码块高亮', '报告与代码块复制'],
      example: {
        title: '代码审查输入到输出示例',
        input: '语言: TypeScript\n关注点: Performance Focus\n\nfunction findUser(users, id) {\n  return users.filter(user => user.id === id)[0];\n}',
        output:
          '## 主要问题\n- 使用 `filter(...)[0]` 会遍历完整数组，即使已经找到目标用户。\n- `users` 和 `id` 缺少类型声明，调用方传入异常数据时不容易发现。\n\n## 建议\n```ts\nfunction findUser(users: User[], id: string) {\n  return users.find((user) => user.id === id);\n}\n```',
        inputLanguage: 'typescript',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Code Reviewer analyzes pasted code snippets for quality, performance, security, and maintainability issues. It is useful for quick self-review before opening a Pull Request and for getting structured feedback while learning unfamiliar code. It can help frontend, backend, and full-stack developers spot potential null-handling bugs, missing error handling, duplicated logic, excessive complexity, unclear naming, resource leaks, async race conditions, performance waste, and common security risks. It does not replace human review, but it works well as a first pass before submission.',
      input:
        'The code to review, the code language, and the review focus. The code can be a function, component, API handler, utility method, style snippet, or configuration logic. The language selector supports auto-detect or explicit choices such as JavaScript, TypeScript, React, Python, Java, Go, Rust, C++, and CSS/SCSS. The review focus controls tone and priority, such as constructive suggestions, strict critique, beginner-friendly guidance, or performance-oriented feedback.',
      output:
        'A Markdown code review report, typically including an overall assessment, key issues, risk level, improvement suggestions, possible refactoring direction, and example code. The report is organized as paragraphs, lists, and code blocks. Copy the full report or copy a specific code block for use in an editor or PR comment.',
      processing:
        'Before opening a PR, paste the code section you are least sure about: a complex branch, async flow, permission check, data transform, or recently changed component. The tool gives a first-pass review across quality, performance, security, and maintainability, helping surface null handling, missing error paths, duplicated logic, and unclear names. It does not replace tests, compilation, or human review. Before merging, run the project checks and ask someone who knows the business context to confirm whether the advice applies.',
      modes: ['Multi-language code review', 'Auto language detection', 'Review focus selection', 'Markdown review report', 'Highlighted code blocks', 'Report and code-block copy'],
      example: {
        title: 'Code review input-to-output example',
        input: 'Language: TypeScript\nFocus: Performance Focus\n\nfunction findUser(users, id) {\n  return users.filter(user => user.id === id)[0];\n}',
        output:
          '## Key Issues\n- `filter(...)[0]` traverses the full array even after the target user has been found.\n- `users` and `id` have no type annotations, making invalid caller data harder to catch.\n\n## Suggestion\n```ts\nfunction findUser(users: User[], id: string) {\n  return users.find((user) => user.id === id);\n}\n```',
        inputLanguage: 'typescript',
        outputLanguage: 'markdown',
      },
    },
  },

  'ai-resume-optimizer': {
    zh: {
      summary:
        'AI 简历优化工具用于把简历内容改写成更清楚、更贴近岗位的版本。你可以上传简历或粘贴文本，再补充目标职位描述。',
      input:
        '输入简历文本，必要时加入岗位 JD、目标方向、输出语言和版式偏好。请保留真实经历、时间、公司、项目和数据。',
      output:
        '结果是一版可复制的简历草稿，可继续调整为单页版、经典版或重点突出版。发布或投递前，请逐条核对经历和量化数据。',
      processing:
        '改简历时，最容易出问题的是把经历写得更好听，却离岗位要求更远。粘贴简历并补充 JD 后，工具会围绕岗位要求重组表达和亮点。它不会替你证明不存在的经历；不要让 AI 添加虚假职位、技能、证书或成绩。',
      modes: ['简历文本输入', '岗位 JD 对齐', '角色方向选择', '版式选择', '中英文输出', '复制或导出'],
      example: {
        title: 'AI 简历生成输入到输出示例',
        input: '简历文本: 前端开发实习，负责 React 页面开发和接口联调。\n岗位 JD: 需要熟悉 React、TypeScript、性能优化和跨团队协作。\n岗位类型: 前端\n简历版式: 经典单栏',
        output:
          '# 张三\n前端开发工程师 | React / TypeScript / Web 性能优化\n\n## 个人优势\n具备 React 页面开发、接口联调和业务流程落地经验，熟悉前端工程协作流程，能够围绕用户流程完成模块开发与问题定位。\n\n## 技能\n- 前端框架: React, TypeScript, JavaScript\n- 工程协作: 接口联调, 需求拆解, 跨团队沟通\n\n## 项目经历\n- 参与 React 业务页面开发和接口联调，配合后端完成核心流程上线。\n- 根据岗位要求补充 TypeScript 使用范围和性能优化案例后，可进一步强化岗位匹配度。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Resume Optimizer rewrites resume content into a clearer version that fits a target role better. Upload a resume or paste the text, then add the job description you want to target.',
      input:
        'Enter resume text and, if useful, add the job description, target role, output language, and layout preference. Keep real experience, dates, companies, projects, and metrics accurate.',
      output:
        'The result is a copy-ready resume draft that you can refine into a one-page, classic, or highlight-focused version. Before sending it, verify every experience detail and metric.',
      processing:
        'Resume edits can sound better while drifting away from the target role. Paste the resume and add the job description, then use the draft to reorganize wording and highlights around the role. The tool cannot verify work history for you, so do not let AI add roles, skills, certificates, or achievements that are not true.',
      modes: ['Resume text input', 'Job description alignment', 'Role direction', 'Layout choice', 'Chinese or English output', 'Copy or export'],
      example: {
        title: 'AI resume generation input-to-output example',
        input: 'Resume text: Frontend development intern, worked on React page development and API integration.\nJob description: Requires React, TypeScript, performance optimization, and cross-functional collaboration.\nRole type: Frontend\nResume layout: Classic single column',
        output:
          '# Jane Zhang\nFrontend Developer | React / TypeScript / Web Performance\n\n## Professional Summary\nFrontend developer with experience building React pages, integrating APIs, and shipping business workflows with backend teams.\n\n## Skills\n- Frontend: React, TypeScript, JavaScript\n- Collaboration: API integration, requirement breakdown, cross-functional communication\n\n## Project Experience\n- Built React business pages and integrated backend APIs to support a complete user flow.\n- Add verified TypeScript scope or performance work before submission if those details exist in the source resume.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
  },
};
