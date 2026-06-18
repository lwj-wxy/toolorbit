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
        '工具返回一份结构化 JSON 结果，并在页面中拆分为多个可复制区域：customsName 是英文报关品名草稿，invoiceDescription 是商业发票描述，classificationBrief 是给货代或报关行阅读的商品归类说明；candidates 最多提供 3 个 HS 候选方向，每个候选项包含编码前缀、置信度、可能匹配原因、不适用风险和需要进一步确认的问题；brokerQuestions 列出应该向供应商、报关行或内部合规人员确认的问题；missingInformation 标出当前输入仍缺少的关键信息；riskLevel 标记整体风险级别；disclaimer 明确提醒用户必须以官方税则查询、BTI/CROSS 类裁定数据库或持牌报关意见为准。',
      processing:
        '用户填写表单后，前端将 productName、productUse、material、targetMarket、battery、electronics、setSold、packageContents、productForm、userGroup、brandModel、unitWeight、riskFlags、outputLanguage 和当前界面语言通过 fetch POST 发送到 /api/ai-hs-code-assistant。服务端根据目标市场选择对应的官方查询入口提示信息，例如美国 HTS Search、欧盟 TARIC、英国 Trade Tariff 或加拿大 Customs Tariff，再将商品资料和风险标签写入系统提示词。模型被约束为只返回 JSON，不允许输出最终裁定口吻，不允许计算税费，并且候选 HS 方向最多 3 个。前端读取 JSON 后渲染报关品名、候选表、复核问题、缺失信息和官方查询入口；如果 JSON 解析失败或接口异常，页面会显示错误提示并保留表单内容供用户修正后重试。',
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
        'The tool returns a structured JSON result and displays it as separate copyable sections. customsName is the English customs item name draft, invoiceDescription is the commercial invoice wording, and classificationBrief is the product classification note for a broker or freight forwarder. candidates provides up to 3 HS directions; each candidate includes a code prefix, confidence level, reason it may fit, reason it may not fit, and questions still needing confirmation. brokerQuestions lists questions to ask the supplier, broker, or compliance team. missingInformation highlights important fields absent from the current brief. riskLevel marks the overall review risk. disclaimer states that official tariff databases, BTI/CROSS-style rulings, or licensed broker advice must be used for final classification.',
      processing:
        'After the user submits the form, the frontend sends productName, productUse, material, targetMarket, battery, electronics, setSold, packageContents, productForm, userGroup, brandModel, unitWeight, riskFlags, outputLanguage, and interface language to /api/ai-hs-code-assistant via fetch POST. The server selects an official lookup hint for the chosen market, such as US HTS Search, EU TARIC, UK Trade Tariff, or Canada Customs Tariff, then inserts the product facts and risk flags into the system prompt. The model is constrained to return JSON only, avoid final-ruling language, avoid duty or tax calculations, and limit HS candidates to 3. The frontend parses the JSON and renders the customs description, candidate list, review questions, missing information, and official lookup link. If JSON parsing or the request fails, the page shows an error while keeping the form available for correction and retry.',
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
        'AI 商品素材合规质检器用于在跨境商品上架或投放广告前，对商品主图、场景图、包装图、标签图和详情图做一次素材风险预检。它不是平台审核接口，也不输出法律结论，而是根据图片内容、商品描述、目标平台和目标市场，指出可能影响上架或广告审核的视觉问题、包装信息缺口、文字覆盖、水印边框、商品一致性和监管敏感信号。适合跨境卖家、独立站运营、素材设计、供应链和代运营团队在素材交付前先做一次统一检查。',
      input:
        '核心输入包括商品名称、商品描述、目标平台、目标市场和最多 8 张商品素材图片。图片可标记为主图、场景图、包装图、标签图或细节图；前端会读取文件名、格式、大小、宽高和 base64 图像内容后提交给服务端。商品名称和描述用于判断图片里的商品是否一致；平台和市场用于让模型关注不同使用场景，例如 Google Shopping 主图限制、Amazon 上架图、TikTok Shop 素材、Shopify 商品页或 Meta Ads 广告初稿。工具限制单张图片体积，避免把超大图片直接发送给模型。',
      output:
        '工具返回结构化 JSON，并在页面中拆成可复制的检查结果：overallRisk 标记整体风险等级；verdict 给出简短结论；assetSummary 概括已上传素材的可用性；imageFindings 按图片列出图片角色、风险等级、具体问题和修复建议；checks 汇总尺寸、清晰度、文字覆盖、促销信息、水印边框、商品一致性、包装标签和目标市场风险等检查项；nextActions 形成后续处理清单；disclaimer 提醒用户结果仅用于素材预检，不能替代平台审核、法律意见或正式合规认证。',
      processing:
        '用户上传图片后，前端用 FileReader 读取图片为 data URL，并通过浏览器 Image 对象获取像素宽高，再把图片元数据和 base64 内容随商品资料一起 POST 到 /api/ai-product-asset-checker。服务端验证至少存在一张图片，限制最多处理 8 张，然后把商品信息、平台市场、图片清单和公开素材规则提示写入视觉模型提示词。模型被要求只返回 JSON，且所有说明必须使用当前输出语言。前端解析返回结果后渲染整体风险、每张图的问题、检查项和下一步动作；如果请求失败或 JSON 无法解析，页面显示错误并保留上传素材供用户调整后重试。',
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
        'The AI Product Asset Compliance Checker reviews product images before cross-border listing or ad submission. It checks main images, lifestyle images, packaging photos, label shots, and detail images for asset risks. It is not a platform review API and does not issue legal conclusions. Instead, it uses the product description, target platform, target market, and image content to surface visual issues, packaging information gaps, text overlays, watermarks, borders, product mismatch, and regulated-product signals. It is designed for cross-border sellers, DTC teams, designers, suppliers, and marketplace operators who need a pre-listing asset checklist.',
      input:
        'Core inputs include product name, product description, target platform, target market, and up to 8 uploaded product images. Each image can be labeled as a main image, lifestyle image, packaging image, label image, or detail image. The frontend reads file name, format, file size, pixel dimensions, and base64 image content before sending the request. Product name and description help detect product mismatch. Platform and market selection shape the review context, such as Google Shopping image constraints, Amazon listing photos, TikTok Shop assets, Shopify product pages, or Meta Ads drafts. Per-image file size limits prevent very large images from being sent directly to the model.',
      output:
        'The tool returns structured JSON and renders it as copyable sections. overallRisk marks the overall risk level; verdict provides a short conclusion; assetSummary summarizes whether the uploaded materials are usable; imageFindings lists each image role, risk level, concrete issues, and fixes; checks summarizes review items such as dimensions, clarity, text overlays, promotional elements, watermarks, borders, product consistency, packaging labels, and market-facing risks; nextActions turns the result into a follow-up checklist; disclaimer reminds users that the output is only a pre-check and cannot replace platform review, legal advice, or formal product compliance certification.',
      processing:
        'When images are uploaded, the frontend reads each file as a data URL with FileReader and gets pixel width and height through the browser Image object. It then POSTs image metadata and base64 content with the product brief to /api/ai-product-asset-checker. The server verifies that at least one image exists, limits the batch to 8 images, and inserts the product facts, platform, market, image list, and public asset-rule guidance into the vision-model prompt. The model is constrained to return JSON only, with all explanatory text in the selected output language. The frontend parses the response and displays overall risk, per-image findings, checklist items, and next actions. If the request fails or JSON parsing fails, the page shows an error while keeping the uploaded assets available for correction and retry.',
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
        '工具返回一组生成图片结果，每张图包含 imageUrl、生成提示词、模型名称、是否使用 fallback 模型和变体序号。页面在右侧结果区展示图片预览、生成耗时、输出尺寸、下载按钮和提示词复制按钮。用户可以下载图片用于继续修图，也可以复制提示词到其他设计工具或下一轮生成中复用。页面底部保留复核提示，提醒用户发布前检查产品结构、颜色、Logo、包装文字、品牌授权和目标平台图片规则。',
      processing:
        '用户点击生成后，前端校验必须存在商品名称，然后将产品资料、平台用途、比例、视觉风格、背景、场景补充和生成张数发送到 /api/ai-product-image-generator。服务端根据比例映射生成尺寸，并为每个变体构造一条商品图提示词：要求模型根据文本商品信息生成可信的产品画面，不把商品名渲染成画面文字，不添加价格、促销徽章、水印、假品牌或无关 UI 文案。服务端最多并行生成 3 张图，返回图片 URL、提示词、模型信息和耗时。若接口失败，页面保留表单内容并显示错误。',
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
        'The tool returns generated image results. Each image includes imageUrl, generation prompt, model name, fallback status, and variant number. The page displays image previews, generation time, output size, download buttons, and prompt copy buttons. Users can download images for editing or copy prompts for reuse in another design workflow or another generation pass. A review note reminds users to check product shape, color, logos, packaging text, brand rights, and target-platform image rules before publishing.',
      processing:
        'When the user clicks Generate, the frontend verifies that product name exists, then sends product facts, platform, image use, ratio, visual style, background, scene notes, and variant count to /api/ai-product-image-generator. The server maps the ratio to an image size and builds one prompt per variant. Each prompt tells the model to create a plausible product image from the text brief, avoid rendering the product name as visible image text, and avoid price tags, discount badges, watermarks, fake brands, or unrelated UI copy. The server generates up to 3 images in parallel and returns image URLs, prompts, model metadata, and elapsed time. On failure, the page keeps the form data and shows an error.',
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
        '提交后，工具会根据主题、观众和语气生成一组可编辑的发布素材。发布前请核对视频内容、品牌合作信息、链接、时间戳、免责声明和频道固定格式。',
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
        'After submission, the tool drafts publishing copy from your topic, audience, language, and tone. Before publishing, check the final video content, sponsorship details, links, timestamps, disclaimers, and channel format.',
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
        '提交后，工具会把主题和风格整理成更完整的视觉 brief，并生成几套可尝试的英文提示词。结果是创作草稿，正式商用前请检查版权、品牌元素、人物肖像和平台使用规则。',
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
        'After submission, the tool turns your idea and style choice into a fuller visual brief, then drafts several English prompt options. Treat the output as a starting point and review copyright, brand elements, likeness rights, and platform rules before commercial use.',
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

  'ai-weekly-report': {
    zh: {
      summary:
        'AI 周报生成器用于将零散、口语化甚至不完整的工作记录整理为结构清晰、语气专业一致、可直接提交或经微调后使用的 Markdown 格式周报。适合需要定期向上级、团队或客户汇报进展的个人贡献者（开发工程师、产品经理、设计师、运营专员等），负责汇总团队多成员工作并合并为统一周报的项目经理或技术负责人，进行项目 Sprint 回顾和迭代复盘总结的敏捷团队，需要向导师或学校提交实习周报的实习生，以及希望将日常随手记录的任务碎片格式化为正式文档以便归档和绩效回顾的职场人士。工具支持四种输出语气——Professional（专业正式，适合向上汇报和对外交付）、Concise（简明扼要，适合快节奏团队和快速同步）、Detailed（详尽具体，包含背景、过程、成果和数据的完整叙事）和 Action-Oriented（结果导向，以成果和下一步行动为重心）——用户根据汇报对象和场景选择最合适的风格，AI 自动适配语言组织方式。',
      input:
        '三个核心文本输入字段和语气选择：本周完成事项（必填）——可输入任务列表、需求编号或用户故事 ID（如"STORY-1234 登录模块重构"）、项目里程碑节点（如"完成 V2.1 前端发布"）、口语化的随手记录（如"修了那个用户反馈的闪退 bug，跟后端对了下支付回调的格式"）；下周计划事项（选填，但推荐填写以获得更完整的周报结构）——用于生成规划段落，可列出待启动的需求、预期产出、关键里程碑和协作依赖；问题与风险（选填）——用于记录当前阻塞项、技术债、延期风险、外部依赖等待状态和需要协调的资源缺口；以及语气选项（Professional / Concise / Detailed / Action-Oriented），从预设值中选择一个以控制 AI 生成文本的措辞风格、段落密度和信息组织方式。输入不做本地持久化，切换页面或刷新后数据不保留，如需长期存档请将生成结果复制到文档工具中。',
      output:
        '一份结构化的 Markdown 格式周报，通常包含以下板块（AI 根据输入内容的有无自动决定是否生成对应板块）：本周工作完成情况——以分类或项目维度组织的已完成事项列表，每项包含简要描述和完成状态标记；关键成果与亮点——以量化和定性方式总结本周最有价值的工作产出或其业务影响；下周工作计划——按优先级排序的待推进事项，包含预计产出和依赖说明；风险与问题——当前遇到的阻塞、对项目进度的潜在影响和已采取或需要采取的应对措施；需要支持与协助——明确向谁、在哪方面需要协同或资源支持。输出以 react-markdown + remark-gfm 渲染为格式化的标题、列表、引用和代码块，阅读体验接近 Confluence / Notion 等文档工具的最终效果，支持一键复制全文 Markdown 源码或富文本内容直接粘贴到企业微信、飞书文档、邮件正文或项目管理平台的备注栏中。生成失败时在输出面板展示具体错误信息并保留输入表单状态以便用户调整后重新生成。',
      processing:
        '用户点击生成后，页面将四个核心参数——完成事项文本（done）、下周计划文本（todo）、问题风险文本（problems）和语气选项（tone，如 "professional""concise""detailed""action-oriented"）——连同当前界面语言 locale 一并组装为 JSON 载荷，通过 fetch API 以 POST 方式发送至 /api/ai-weekly-report 端点。服务端验证参数完整性后构建 AI 模型 system prompt："You are a professional weekly report writer. Based on the user\'s completed work, next-week plan, and identified risks, generate a structured weekly report in Markdown format with the specified tone..."，之后将用户的三段文本和语气参数注入 user prompt，模型按 SSE 流式返回生成的周报内容。前端通过 ReadableStream 并发逐块接收数据：每个 SSE 事件块以 TextDecoder 解码为纯文本，JSON.parse 提取 content 字段作为本次增量文本，通过 React 的 setState 函数式更新 prev + chunk.content 将新文本追加到结果字符串末尾，对应输出面板随之实时扩展。流式传输完成后，react-markdown（配合 remark-gfm 支持表格、任务列表等 GitHub Flavored Markdown 扩展语法）对完整 Markdown 文本进行渲染，生成带层级样式的可视化文档。复制功能通过 navigator.clipboard.writeText 复制完整 Markdown 原文，复制成功后按钮文字切换为"已复制"并在 2 秒后恢复。错误处理在 fetch catch 块中统一捕获：网络异常或服务端返回的非 success 响应均设置 error 状态字符串，输出区显示红色背景错误卡片，用户可调整输入文本后重新提交。',
      modes: ['本周完成事项（支持任务列表 / 项目编号 / 口语记录）', '下周计划事项', '问题风险与阻塞标记', '四种语气选择（专业 / 简明 / 详尽 / 结果导向）', 'Markdown 结构化输出（标题/列表/表格 GFM）', 'SSE 流式实时生成', '全文一键复制', '空字段智能跳过对应板块'],
      example: {
        title: 'AI 周报生成输入到输出示例',
        input: '本周完成: 1. 修复登录模块 session 过期后白屏问题；2. 完成用户中心接口文档 v2.0；3. 协助测试团队完成支付模块回归测试\n下周计划: 1. 接入微信支付 V3 回调接口；2. 重构订单列表查询性能（目标 < 200ms）\n问题风险: 第三方物流接口偶尔超时，已与对方技术对接排查中\n语气: 专业正式',
        output:
          '## 本周工作完成\n\n### 问题修复\n- 修复登录模块 session 过期后白屏问题，已上线生产环境。\n\n### 文档与协作\n- 完成用户中心接口文档 v2.0，已通过前后端联合评审。\n- 协助测试团队完成支付模块回归测试，覆盖 43 条用例。\n\n## 关键成果\n- 登录白屏问题修复后用户投诉量下降约 60%。\n\n## 下周计划\n- 接入微信支付 V3 回调接口，预计周三完成联调。\n- 重构订单列表查询，目标将响应时间优化至 200ms 以内。\n\n## 风险与问题\n- 第三方物流接口偶发超时，正在与对方技术团队联合排查。\n\n## 需要的支持\n- 暂无额外协调需求。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Weekly Report Generator transforms scattered, conversational, and sometimes incomplete work notes into a well-structured, professionally toned Markdown weekly report ready to submit or use with minor edits. Suitable for individual contributors (developers, product managers, designers, operations specialists) who need to report progress to managers, teams, or clients on a regular cadence; project managers and tech leads who aggregate multi-member work into a unified team report; agile teams conducting Sprint reviews and iteration retrospectives; interns submitting weekly internship reports to mentors or schools; and professionals who want to format daily jotted task fragments into formal documents for archival and performance review. The tool supports four output tones — Professional (formal and polished, suitable for upward reporting and external delivery), Concise (brief and to the point, for fast-paced teams and rapid sync), Detailed (comprehensive narrative including background, process, results, and data), and Action-Oriented (focused on outcomes and next steps) — allowing users to select the most appropriate style based on the report audience and context, with the AI auto-adapting language and organization accordingly.',
      input:
        'Three core text input fields and a tone selector: Completed Work This Week (required) — accepts task lists, issue IDs or user story IDs (e.g. "STORY-1234 Login module refactor"), project milestones (e.g. "Completed V2.1 frontend release"), or conversational rough notes (e.g. "Fixed that crash bug users reported, synced with backend on payment callback format"); Next Week Plan (optional but recommended for a more complete report structure) — used to generate the planning section, can list upcoming requirements, expected deliverables, key milestones, and collaboration dependencies; Problems & Risks (optional) — for recording current blockers, technical debt, delay risks, external dependency wait states, and resource gaps requiring coordination; and the Tone option (Professional / Concise / Detailed / Action-Oriented) selected from a preset list to control the AI-generated wording style, paragraph density, and information organization. Input is not persisted locally — data is lost on page navigation or refresh; for long-term archiving, copy the generated result into a document tool.',
      output:
        'A structured Markdown weekly report typically containing the following sections (the AI automatically decides whether to generate each section based on whether corresponding input is provided): Completed Work — a list of completed items organized by category or project dimension, each with a brief description and completion status; Key Results & Highlights — a quantitative and qualitative summary of this week\'s most valuable work output or business impact; Next Week Plan — priority-ordered upcoming tasks with expected deliverables and dependency notes; Risks & Issues — current blockers, potential impact on project timeline, and measures already taken or needed; Support Needed — clear identification of who, in what area, needs to collaborate or provide resources. Output is rendered via react-markdown + remark-gfm into formatted headings, lists, blockquotes, and code blocks with a reading experience close to the final rendered result in document tools like Confluence or Notion. A one-click full-text copy button provides the raw Markdown or rich-text content for pasting directly into WeCom, Feishu Docs, email body, or project management platform comment fields. On generation failure, the output panel displays the specific error message and preserves the input form state so the user can adjust and regenerate.',
      processing:
        'When the user clicks Generate, the page collects the four core parameters — completed work text (done), next-week plan text (todo), problems/risks text (problems), and tone option (tone, e.g. "professional", "concise", "detailed", "action-oriented") — together with the current UI locale, assembles them into a JSON payload, and sends it via fetch POST to the /api/ai-weekly-report endpoint. After validating parameter completeness, the server constructs an AI model system prompt: "You are a professional weekly report writer. Based on the user\'s completed work, next-week plan, and identified risks, generate a structured weekly report in Markdown format with the specified tone..." The user\'s three text blocks and tone parameter are then injected into the user prompt, and the model streams the generated report content back via SSE. The frontend receives data in parallel chunks via ReadableStream: each SSE event chunk is decoded to plain text by TextDecoder, the content field is extracted via JSON.parse as the incremental text for this segment, and React\'s setState functional updater (prev + chunk.content) appends new text to the end of the result string, with the output panel expanding in real time. After streaming completes, react-markdown (with remark-gfm supporting GitHub Flavored Markdown extensions such as tables and task lists) renders the full Markdown text into a visually styled hierarchical document. The copy function uses navigator.clipboard.writeText to copy the full Markdown source; on success the button text briefly switches to "Copied" and resets after 2 seconds. Error handling is unified in the fetch catch block: network exceptions or non-success server responses both set an error state string, and the output area displays a red-background error card while preserving the input for retry.',
      modes: ['Completed work (supports task lists / issue IDs / rough notes)', 'Next-week planning', 'Risks & blockers tracking', 'Four tone options (Professional / Concise / Detailed / Action-Oriented)', 'Markdown structured output (headings / lists / tables GFM)', 'SSE real-time streaming generation', 'Full-text one-click copy', 'Auto-skip sections for empty input fields'],
      example: {
        title: 'AI weekly report generation input-to-output example',
        input: 'Done: 1. Fixed login session-expiry white-screen issue; 2. Completed User Center API docs v2.0; 3. Assisted QA team with payment module regression testing\nNext: 1. Integrate WeChat Pay V3 callback; 2. Optimize order list query performance (target < 200ms)\nRisks: Third-party logistics API intermittent timeout, joint investigation underway with their tech team\nTone: Professional',
        output:
          '## Completed This Week\n\n### Bug Fixes\n- Fixed the login session-expiry white-screen issue; deployed to production.\n\n### Documentation & Collaboration\n- Completed User Center API documentation v2.0, approved in joint frontend/backend review.\n- Assisted QA team in completing payment module regression testing covering 43 test cases.\n\n## Key Results\n- User complaints dropped approximately 60% after the login white-screen fix.\n\n## Next Week Plan\n- Integrate WeChat Pay V3 callback API; target completion and joint debugging by Wednesday.\n- Refactor order list query to meet sub-200ms response-time target.\n\n## Risks & Issues\n- Third-party logistics API experiences intermittent timeouts; joint investigation ongoing with their engineering team.\n\n## Support Needed\n- No additional coordination needs at this time.',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
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
        '提交后，工具会根据平台和时长调整脚本密度与节奏。生成内容是拍摄草稿，发布前请核对事实、产品承诺、合规表述、品牌语气和平台规则。',
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
        'After submission, the tool adjusts script density and pacing for the selected platform and duration. Treat the output as a production draft, then check facts, product claims, compliance wording, brand voice, and platform rules before publishing.',
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

  'ai-meeting-minutes': {
    zh: {
      summary:
        'AI 会议纪要生成器用于将原始会议录音转写文本、人工速记、会议聊天记录或多语言讨论片段整理为格式标准、重点突出的专业会议纪要，大幅降低会后手工整理的时间成本，确保讨论要点、决策结论和行动项无遗漏。适合项目推进例会（Sprint Planning、Daily Standup、Sprint Review 等敏捷会议）、客户需求沟通与方案评审会议、跨部门协作与对齐会议、产品需求评审（PRD Review）与技术方案讨论、项目复盘与事故回顾会（Retrospective / Postmortem）、面试记录归档和上级一对一面谈备忘、远程团队 Zoom/Teams/飞书会议的自动转写后处理，以及学术研讨会 / 行业分享会的笔记整理。工具支持三种输出格式——详细纪要（完整记录讨论背景、各方观点、论证过程和结论，适合需要存档备查或向未参会者传达完整语境）、仅提取行动项（去粗取精，只输出谁在什么时间前需要完成什么，并附优先级和依赖说明，适合直接导入 Jira、Linear、Asana 等项目管理工具）和高管摘要（将数十分钟的讨论浓缩为 3-5 个核心要点，适合向高层进行快速同步）——用户根据纪要的阅读对象和交付场景选择最合适的格式。',
      input:
        '两个核心参数：原始会议记录文本（必填）和输出纪要格式（详细纪要 / 仅行动项 / 高管摘要）。原始文本可以来自多种渠道：飞书妙记、腾讯会议云录制、Zoom Transcript、Otter.ai 等工具的语音转写导出文本（通常包含说话人标签和时间戳）；会议期间记录的人工速记或要点笔记；Slack/飞书/企业微信等群聊中的文字讨论历史（可包含 @ 提及、引用回复和文件分享记录）；以及混合中英文或多位发言人的分段讨论内容。输入文本的格式不做严格要求——无论是有序的转写稿还是杂乱的速记碎片，AI 模型均会先做语义理解和主题聚合再生成结构化纪要。格式选项决定最终输出的详略程度和组织方式：详细纪要（Detailed Minutes）输出完整讨论脉络，适合存档和内部分享；仅行动项（Action Items Only）输出纯列表形式的待办，适合直接跟进行动闭环；高管摘要（Executive Summary）输出高层视角的核心结论和风险，适合向上汇报。',
      output:
        '一份结构化的 Markdown 格式会议纪要，根据所选输出格式包含不同板块组合。详细纪要模式下通常包含：会议基本信息（日期、参会人、时长占位）；会议摘要（一段 3-5 句的总览段落概括会议目的和核心结论）；关键讨论与要点（按议题分段，每段含有讨论背景、各方观点和达成的共识或分歧）；决策结论（明确列出会议中做出的每项决策、决策依据和表决情况）；行动项（每项包含任务描述、负责人、截止时间和优先级标记）；待澄清问题（会议中提出但未解决、需要在后续跟进的问题）。仅行动项模式下只输出行动项列表和简要的风险/阻塞备注。高管摘要模式下输出 3-5 个要点段落——每段一句话总结 + 关键背景 + 需要关注的风险或决策请求。输出以 react-markdown + remark-gfm 渲染为格式化可视文档，支持一键复制全文 Markdown 源码，便于粘贴至 Confluence、Notion、飞书文档、邮件正文或项目管理系统评论区。生成失败时在输出面板展示具体错误信息，输入文本保留在表单中供用户调整后重新提交。',
      processing:
        '用户点击生成后，页面将两个核心参数——原始会议文本（rawInput）和输出格式选项（formatType，如 "detailed""actions""executive"）——连同当前界面语言 locale 组装为 JSON 载荷，通过 fetch API 以 POST 方式发送至 /api/ai-meeting-minutes 端点。服务端首先检查参数完整性：原始文本不能为空，格式选项必须在支持列表中。通过后服务端构建 AI 模型 system prompt："You are a professional meeting minutes writer. Based on the raw meeting transcript or notes provided, generate structured meeting minutes in the specified format... The output must be in well-formatted Markdown." 根据格式类型不同，system prompt 中会加入不同的输出约束——"详细纪要"模式下强调"完整记录所有讨论点和决策过程，不得省略关键论据"；"仅行动项"模式下强调"严格只输出行动项列表，每条包含 who/what/when 三要素"；"高管摘要"模式下强调"限制在 5 个要点以内，每个要点的背景不超过 2 句话，聚焦业务影响和需要的决策"。模型按 SSE 流式逐步返回纪要内容，前端通过 ReadableStream 并发读取每个事件块：TextDecoder 解码字节流为字符串，JSON.parse 提取 content 字段，通过 React setState 函数 prev + chunk.content 将增量文本实时追加到输出面板。流式传输结束后，react-markdown（配合 remark-gfm 支持 GFM 表格、任务列表等扩展语法）渲染完整 Markdown 文本。复制按钮通过 navigator.clipboard.writeText 复制 Markdown 全文，复制成功后短暂反馈"已复制"并在 2 秒后通过 setTimeout 恢复。错误处理统一在 fetch catch 块中：设置 error 状态并在输出区展示红色错误卡片，输入表单保留以便修改后重试。',
      modes: ['原始会议文本输入（支持转写稿/速记/聊天记录/多语言混合）', '三种输出格式（详细纪要 / 仅行动项 / 高管摘要）', '议题分段与主题聚合', '决策结论独立列出', '行动项（who/what/when/priority）', 'SSE 流式 Markdown 渲染', '全文一键复制', '格式切换不丢失输入'],
      example: {
        title: 'AI 会议纪要生成输入到输出示例',
        input: '原始记录:\n王明：登录页改版下周上线，我负责接口联调，这周五之前完成。\n李娜：好的，我这周把埋点加上。对了测试环境最近不太稳定，上周五挂了三次。\n王明：那我们周二先内部验证一遍，有问题提前修。\n张总：可以，周二验证完没问题周四灰度发布，先放 5% 流量观察。\n\n输出格式: 仅行动项',
        output:
          '## 行动项\n\n- **王明**: 完成登录接口联调（截止: 本周五），周二参与内部验证。\n- **李娜**: 完成登录页埋点添加（截止: 本周五），周二参与内部验证。\n- **张总**: 周二验证通过后，周四执行 5% 灰度发布。\n\n## 风险\n- 测试环境近一周稳定性较差（上周五三次宕机），需在周二验证前确认环境可用。',
        inputLanguage: 'text',
        outputLanguage: 'markdown',
      },
    },
    en: {
      summary:
        'The AI Meeting Minutes Generator transforms raw meeting audio transcripts, manual shorthand notes, meeting chat logs, or multilingual discussion fragments into professionally formatted, well-structured meeting minutes — drastically reducing the manual post-meeting organization effort while ensuring that discussion points, decisions, and action items are fully captured. Suitable for regular project meetings (Sprint Planning, Daily Standups, Sprint Reviews, and other agile ceremonies), client requirement discussions and solution review sessions, cross-team collaboration and alignment meetings, product requirement reviews (PRD Review) and technical design discussions, retrospectives and postmortems, interview record archival and manager one-on-one memos, post-processing of auto-transcripts from remote meetings on Zoom / Teams / Feishu, and note consolidation for academic seminars and industry talks. The tool supports three output formats — Detailed Minutes (complete record of discussion background, all viewpoints, argumentation, and conclusions, suitable for archival or communicating full context to non-attendees), Action Items Only (distills the discussion to a pure list of who needs to complete what by when, with priority and dependency notes, suitable for direct import into Jira, Linear, Asana, etc.), and Executive Summary (condenses tens of minutes of discussion into 3-5 core takeaways, suitable for rapid sync with leadership) — allowing users to select the most appropriate format based on the minutes\' audience and delivery context.',
      input:
        'Two core parameters: the raw meeting record text (required) and the desired output format (Detailed Minutes / Action Items Only / Executive Summary). The raw text can come from a variety of sources: voice-transcription export text from tools such as Feishu Minutes, Tencent Meeting Cloud Recording, Zoom Transcript, or Otter.ai (typically containing speaker labels and timestamps); manual shorthand notes or key-point jottings taken during the meeting; text discussion history from group chats on Slack / Feishu / WeCom (which may include @ mentions, quoted replies, and file-sharing records); and segmented mixed Chinese-English or multi-speaker discussion content. The format of the input text is not strictly required — whether it is an ordered transcript or messy shorthand fragments, the AI model first performs semantic understanding and topic clustering before generating structured minutes. The format option determines the level of detail and organizational approach of the final output: Detailed Minutes produce the full discussion arc, suitable for archival and internal sharing; Action Items Only produce a pure list of todos, suitable for immediate action-loop follow-up; Executive Summary produces high-level core conclusions and risks, suitable for upward reporting.',
      output:
        'A structured Markdown meeting minutes document whose section composition varies by the selected output format. In Detailed Minutes mode, the output typically includes: Meeting Basic Info (date, attendees, duration placeholders); Meeting Summary (a 3-5 sentence overview paragraph summarizing the meeting purpose and key conclusions); Key Discussions & Points (organized by agenda item, each containing discussion background, viewpoints from each party, and consensus or disagreement reached); Decisions Made (clearly listing each decision made during the meeting, its rationale, and any voting outcomes); Action Items (each containing task description, owner, due date, and priority flag); Open Questions (items raised during the meeting but unresolved, requiring follow-up). In Action Items Only mode, only the action-item list and brief risk/blocker notes are output. In Executive Summary mode, 3-5 key-point paragraphs are output — each with a one-sentence takeaway + essential context + risks or decisions requiring attention. Output is rendered as a formatted visual document via react-markdown + remark-gfm, with a one-click full-text copy button for pasting into Confluence, Notion, Feishu Docs, email body, or project management system comment fields. On generation failure, the output panel displays the specific error message while the input text remains in the form for user adjustment and resubmission.',
      processing:
        'When the user clicks Generate, the page collects the two core parameters — raw meeting text (rawInput) and output format option (formatType, e.g. "detailed", "actions", "executive") — together with the current UI locale, assembles them into a JSON payload, and sends it via fetch POST to the /api/ai-meeting-minutes endpoint. The server first checks parameter completeness: the raw text must not be empty, and the format option must be in the supported list. On passing validation, the server constructs an AI model system prompt: "You are a professional meeting minutes writer. Based on the raw meeting transcript or notes provided, generate structured meeting minutes in the specified format... The output must be in well-formatted Markdown." Different output constraints are injected into the system prompt depending on the format type — Detailed Minutes mode emphasizes "fully record all discussion points and decision processes, do not omit key arguments"; Action Items Only mode emphasizes "strictly output only the action-item list, each containing the three elements of who/what/when"; Executive Summary mode emphasizes "limit to 5 key points maximum, each point\'s background limited to 2 sentences, focus on business impact and decisions needed." The model progressively returns the minutes content via SSE streaming, and the frontend concurrently reads each event chunk via ReadableStream: TextDecoder decodes the byte stream into strings, JSON.parse extracts the content field, and React setState (prev + chunk.content) appends the incremental text to the output panel in real time. After streaming completes, react-markdown (with remark-gfm supporting GFM extensions such as tables and task lists) renders the full Markdown text. The copy button uses navigator.clipboard.writeText to copy the full Markdown source, briefly displaying "Copied" before resetting via setTimeout after 2 seconds. Error handling is unified in the fetch catch block: the error state is set and a red error card is displayed in the output area while the input form is preserved for retry after modification.',
      modes: ['Raw meeting text input (supports transcripts / shorthand / chat logs / mixed languages)', 'Three output formats (Detailed Minutes / Action Items Only / Executive Summary)', 'Agenda-based sectioning and topic clustering', 'Decisions listed independently', 'Action items (who / what / when / priority)', 'SSE streaming Markdown rendering', 'Full-text one-click copy', 'Format switching without losing input'],
      example: {
        title: 'AI meeting minutes generation input-to-output example',
        input: 'Raw record:\nMing: The login page redesign launches next week. I\'ll handle API integration and finish before this Friday.\nLina: Got it. I\'ll add analytics this week. Also, the testing environment has been unstable — it went down three times last Friday.\nMing: Let\'s do an internal validation on Tuesday; fix any issues early.\nZhang: Agreed. If Tuesday validation passes, we\'ll do a 5% canary release on Thursday.\n\nFormat: Action Items Only',
        output:
          '## Action Items\n\n- **Ming**: Complete login API integration (due: this Friday). Participate in Tuesday internal validation.\n- **Lina**: Complete login page analytics instrumentation (due: this Friday). Participate in Tuesday internal validation.\n- **Zhang**: On successful Tuesday validation, execute 5% canary release on Thursday.\n\n## Risks\n- Testing environment stability concerns (three outages last Friday); environment availability must be confirmed before Tuesday validation.',
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
        '提交后，工具会根据你的需求选择合适的函数组合。复杂财务、统计或合规计算仍需要人工验证。',
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
        'After submission, the tool chooses a formula approach based on your task and selected spreadsheet app. Verify complex finance, statistics, or compliance calculations by hand before relying on them.',
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
        '提交后，工具会根据你的描述生成可测试的表达式。正则可能因语言或运行环境不同而表现不同，使用前需要在目标环境验证。',
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
        'After submission, the tool drafts a testable expression from your description. Regex behavior can vary by language and runtime, so verify the pattern in your target environment before shipping it.',
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
        'AI Logo & Avatar Generator 用于根据品牌描述、核心符号、配色偏好和设计风格，通过 AI 图像模型生成适合直接使用的方形 Logo 或头像图。适合独立开发者在新项目启动阶段快速获取应用图标（节省从零设计或外包设计的时间成本和沟通成本），电商卖家为店铺主页、商品系列或新品线探索与品牌调性一致的视觉标识并提供多方向候选方案，内容创作者（YouTuber、播客主播、GitHub 开源项目维护者等）生成统一风格的个人频道或项目头像，品牌设计师在正式投入大量时间出图前通过快速生成多个视觉方向来验证创意方向和缩小风格选择范围（八种风格预设覆盖极简字母、扁平图形、卡通吉祥物、抽象几何、3D 立体、复古纹理和水彩手绘），以及需要将手绘草图、参考图片或竞品 Logo 中的视觉元素通过 AI 重新提炼和再创作为全新 Logo 概念的场景。工具支持文字描述生成和参考图识别两种入口，参考图模式下会先通过 GLM-4V-Flash 视觉模型自动提取图片的视觉特征（色彩、构图、主体、风格）并回填到描述框中作为生成提示的一部分。生成结果以正方形 1:1 图片形式在预览面板展示并带有棋盘格背景校验透明区域效果，支持直接下载（PNG 格式），也可复制或二次编辑后用于更精细的设计工具中。',
      input:
        '三个核心输入参数和一个可选输入：颜色偏好（选填）——支持自由文本输入，可以是具体色名（如"Navy Blue and Gold""珊瑚橙搭配象牙白"）、品牌色 HEX 值组合、情绪色板描述（如"温暖木色调""冷色科技蓝灰"）或场景色彩关键词（如"海洋主题蓝绿色"）；核心概念描述（必填）——建议写清行业背景（如"SaaS 云端开发工具""手工烘焙甜品店"）、品牌个性与定位（如"极简专业""亲和有趣""高端奢华""环保自然"）、主体符号创意（如"轨道、星球、齿轮代表自动化""咖啡豆和书本代表慢生活阅读"）、目标用户画像（如"面向年轻开发者""面向高端茶饮消费者"）和使用场景（网站 favicon、App 启动图标、社交媒体头像等）；设计风格（从 8 种预设中选择一项）——Minimalist（极简风，强调留白与几何概括）、Flat Design（扁平化，强调色块与无阴影）、Mascot（卡通吉祥物，拟人化形象）、Abstract Geometry（抽象几何，非具象图形）、Lettermark（字母标志，文字变形）、3D Render（3D 立体，光影质感）、Vintage（复古风，旧化肌理）、Watercolor（水彩风，柔和晕染）；可选参考图片——支持上传 JPG/PNG/WebP 格式（限制 5MB 以内），通过 GLM-4V-Flash 视觉模型提取颜色、主体、构图和风格特征后自动填入描述框并触发带图生成。',
      output:
        '一张适合 Logo、头像或应用图标使用的 1:1 正方形图片，生成后在右侧预览面板以大尺寸展示，并辅以棋盘格背景（checkerboard pattern）方便直观判断透明/半透明区域的视觉边界。预览区顶部提供模型信息标识（显示当前使用的 AI 生成模型名称，若有 fallback 情况则额外标注），以及一个下载按钮。下载逻辑按结果 URL 类型选择最优策略：若结果为 data:image 协议则直接创建 \<a\> 标签触发浏览器下载；若结果为远程图片地址则通过 fetch 获取 Blob 后创建 Object URL 触发下载，下载完成后释放 Object URL；若两种方式均失败则在新标签页打开图片地址作为兜底方案。生成失败时输出面板展示红色背景错误卡片（含 RotateCcw 图标和具体错误消息），用户可修改描述、颜色或风格后重新点击生成。生成过程中显示加载动画和"AI is designing..."呼吸灯文字，旧数据 URL 不会被重复释放以避免内存泄漏。',
      processing:
        '点击生成按钮后，页面首先判断当前调用模式：若用户直接输入描述（非参考图模式），则直接将颜色偏好（color）、描述文本（finalDescription / description）、风格选项（style）拼接入 AI 系统提示词："Design a high-quality logo. Primary colors: {color}. Description: {finalDescription}. The background should be clean (solid white or transparent), and the logo must be clear, professional, and suitable for app icons or website avatars." 系统提示词与 ratio 固定为 "1:1"、界面语言（i18n.language）一起封装为 JSON 载荷，通过 fetch API 以 POST 方式发送至 /api/ai-image-generator 端点。若用户上传参考图片（参考图模式），则首先通过 FileReader 将图片文件读取为 base64 字符串（验证文件大小 ≤ 5MB），携带 imageBase64 和语言参数发送至 /api/ai-vision-describe 端点，GLM-4V-Flash 视觉模型返回图片描述（data.description），页面将该描述自动填入 textarea（setDescription），紧接着调用 handleGenerate(newDesc, base64String) 将视觉描述和 base64 图片一并传入生成端点。生成请求返回后，页面从 JSON 响应（data.imageUrl, data.model, data.fallbackUsed, data.elapsedMs）中提取图片 URL 存入 resultUrl 状态并在右侧面板实时渲染 img 预览。下载管道实现三种策略的降级链：data URL 直接创建下载链接触发点击 → 远程 URL 通过 fetch + blob + createObjectURL 下载 → 失败则 window.open 打开。下载文件名使用时间戳生成（logo-ai-{Date.now()}.png）避免文件名冲突。参考图模式的 analyzingImage 状态控制上传按钮和 textarea 的禁用状态，确保图片分析完成前不会发起重复请求。',
      modes: ['文字描述生成 Logo', 'GLM-4V 参考图智能识别回填', '8 种 Logo 设计风格预设', '1:1 正方形输出（棋盘格背景校验透明区）', '大尺寸图片预览', '智能下载（Data URL / Blob / 远程 三级降级）', '模型信息与 fallback 状态标识'],
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
        'The AI Logo & Avatar Generator creates production-ready square logo or avatar images from brand descriptions, core symbols, color preferences, and design styles using AI image models. Suitable for indie developers quickly obtaining app icons early in a new project (saving the time and communication cost of designing from scratch or outsourcing); e-commerce sellers exploring store homepages, product lines, or new-category visual marks aligned with brand personality through multiple directional candidates; content creators (YouTubers, podcasters, open-source project maintainers) generating consistent-style personal channel or project avatars; brand designers validating creative direction and narrowing style choices before committing significant time to formal production by rapidly generating multiple visual directions (eight style presets covering minimalist lettermarks, flat graphics, mascot characters, abstract geometry, 3D render, vintage texture, and watercolor hand-drawn); and scenarios where users want to have hand-drawn sketches, reference images, or competitor logos re-imagined by AI into fresh logo concepts. The tool supports two entry modes — text-prompt generation and reference-image analysis — where the reference-image mode first auto-extracts visual characteristics (color, composition, subject, style) via the GLM-4V-Flash vision model and backfills the description field to use as part of the generation prompt. Generated results are displayed as square 1:1 images in the preview panel with a checkerboard background to verify transparent/semi-transparent regions, and support direct download in PNG format for use or further editing in more refined design tools.',
      input:
        'Three core parameters and one optional input: Color Preference (optional) — free-text entry accepting specific color names (e.g. "Navy Blue and Gold," "Coral Orange with Ivory White"), brand-color HEX combinations, mood-palette descriptions (e.g. "Warm wood tones," "Cool tech blue-grey"), or scene color keywords (e.g. "Ocean-themed teal and turquoise"); Core Concept Description (required) — recommended to include industry context (e.g. "SaaS cloud development tool," "Handmade bakery and pastry shop"), brand personality and positioning (e.g. "Minimalist and professional," "Friendly and playful," "Luxury and premium," "Eco-friendly and natural"), central symbol ideas (e.g. "Orbits, planets, and gears representing automation," "Coffee beans and books representing slow-life reading"), target user profile (e.g. "Targeted at young developers," "Targeted at premium tea consumers"), and usage context (website favicon, App launch icon, social media avatar, etc.); Design Style (selected from 8 presets) — Minimalist (emphasizing whitespace and geometric reduction), Flat Design (color blocks, no shadows), Mascot (cartoon mascot characters, anthropomorphized), Abstract Geometry (non-representational graphics), Lettermark (letterform distortion), 3D Render (volumetric lighting and texture), Vintage (aged texture), Watercolor (soft wash effects); optional Reference Image — supports JPG/PNG/WebP uploads (capped at 5MB), analyzed by the GLM-4V-Flash vision model to extract color, subject, composition, and style characteristics, then auto-filled into the description field triggering an image-assisted generation.',
      output:
        'A square 1:1 image suitable for logos, avatars, or app icons, displayed at large size in the right-hand preview panel against a CSS checkerboard background pattern (20px tiles) for intuitive verification of transparent / semi-transparent regions. The preview header shows model metadata (the AI generation model name currently in use, plus a "fallback" label if applicable) and a download button. The download logic follows a three-tier strategy chain based on result URL type: if the result is a data:image protocol URL, a hidden \<a\> element is created and programmatically clicked to trigger a browser download; if it is a remote image URL, fetch retrieves it as a Blob, an Object URL is created for the download, and the Object URL is revoked immediately after; if both methods fail, the image URL is opened in a new browser tab as a last resort. On generation failure, the output panel displays a red-background error card (with a RotateCcw icon and the specific error message), allowing the user to adjust the description, colors, or style and retry. During generation, a loading spinner and pulsing "AI is designing..." text are displayed; stale data URLs are not unnecessarily revoked to avoid memory leaks.',
      processing:
        'When the Generate button is clicked, the page first determines the current invocation mode. If the user entered text directly (non-reference mode), the color preference, description text (finalDescription / description), and style option are spliced into the AI system prompt: "Design a high-quality logo. Primary colors: {color}. Description: {finalDescription}. The background should be clean (solid white or transparent), and the logo must be clear, professional, and suitable for app icons or website avatars." The system prompt is packaged into a JSON payload together with ratio fixed to "1:1" and the UI locale (i18n.language), then sent via fetch POST to the /api/ai-image-generator endpoint. If the user uploads a reference image (reference mode), the image file is first read as a base64 string via FileReader (validating file size ≤ 5MB), then sent with the imageBase64 and language parameters to the /api/ai-vision-describe endpoint. The GLM-4V-Flash vision model returns an image description (data.description); the page auto-fills it into the textarea via setDescription, then immediately calls handleGenerate(newDesc, base64String) to pass both the vision-extracted text and the base64 image into the generation endpoint. After the generation request returns, the page extracts the imageUrl from the JSON response (data.imageUrl, data.model, data.fallbackUsed, data.elapsedMs), stores it in the resultUrl state, and renders the img preview in real time in the right-hand panel. The download pipeline implements the three-tier fallback chain — data URL → direct \<a\> click; remote URL → fetch + blob + Object URL download; fallback → window.open. The download filename uses a timestamp (logo-ai-{Date.now()}.png) to avoid collisions. The analyzingImage state in reference mode controls disabling of the upload button and textarea to prevent duplicate requests before image analysis completes.',
      modes: ['Text-prompt logo generation', 'GLM-4V vision reference-image recognition and auto-fill', '8 logo design style presets', '1:1 square output (checkerboard background for transparency verification)', 'Large-size image preview', 'Smart download (Data URL / Blob / Remote three-tier fallback)', 'Model info and fallback status indication'],
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
        'AI Image Generator 用于将自然语言画面描述转换为高质量图片，支持选择画幅比例和视觉艺术风格，覆盖从创意探索、视觉提案到可直接交付的社交素材的完整轻量工作流。适合内容运营人员为博客封面、社交媒体配图（微博/公众号/小红书首图）、信息流广告素材、邮件营销 Banner 和短视频封面快速生成多种视觉候选方案并从中择优再加工；产品经理和创业者为产品概念图、MVP 演示原型、Pitch Deck 配图或众筹页面渲染图提供视觉参考，无需等待设计师出图即可推动讨论和决策；UI/UX 设计师在正式设计之前通过快速生成多风格示意稿来对齐团队对视觉方向的期望；教育工作者为课件、知识卡片或科普长图生成插图；非设计背景的普通员工用统一的自然语言输入即可获得符合输出格式要求的可下载图片素材；以及需要为不同平台的不同画幅（头像方形 1:1、横版封面 16:9、竖版短视频 9:16）分别生成适配尺寸图片的创作者。工具提供六种预设艺术风格和三种画幅比例，生成后展示 AI 模型元信息（模型名称、是否使用了 fallback 备选模型、耗时毫秒数）方便用户评估生成质量和服务路由路径，并支持一键下载。',
      input:
        '三个核心参数：画面描述（必填，多行文本输入，最大高度 9 行）——支持自由描述主体对象、场景环境、动作状态、构图方式（如三分法、居中对称、鸟瞰）、光线与色调方向（如金色逆光、冷蓝霓虹、自然柔光）、色彩情绪、镜头焦距与景深（如 50mm浅景深）、材质质感（如磨砂金属、透明玻璃、丝绒）和最终用途（如"适合博客封面""用于 Instagram 帖子"）；画幅比例（三选一按钮组）——1:1（Square / 正方形，适合头像、封面、社交媒体方形帖）、16:9（Monitor / 横向宽屏，适合横向海报、视频缩略图、博客头图和推文配图）、9:16（Smartphone / 竖向全屏，适合抖音/TikTok/Reels 竖屏视频封面和手机壁纸），每个选项配有对应图标（Square/Monitor/Smartphone）便于直观选择；艺术风格（下拉选择，六种预设）——Photorealistic（摄影写实，类似专业相机拍摄效果）、Anime（动漫手绘风格）、Digital Art（数字艺术 / 概念插画）、Oil Painting（油画质感与笔触）、3D Render（3D 渲染 / 类似 Blender/C4D 输出）、Cyberpunk（赛博朋克 / 霓虹灯未来都市风）。所有参数均实时反映到组件状态中，修改任一参数后下次点击生成时生效。',
      output:
        'AI 生成的图片在右侧结果面板中以自适应尺寸渲染展示（max-width/max-height 100% 保持原始比例，object-contain 确保不被裁剪），预览区域在生成中显示加载动画和"AI is painting..."文字，生成完成后展示图片并可悬停查看细节。预览面板顶部标题栏显示 AI 模型元信息标签——model 字段标识实际使用的生成模型名称，若 fallbackUsed 为 true 则额外标注"fallback"说明使用了备选模型链路，elapsedMs 显示服务端生成耗时——帮助高级用户了解当前生成服务的工作状态和性能表现。面板右上角提供下载按钮，下载逻辑实现三级降级链：若结果为 blob: 或 data: 协议 URL 则直接创建隐藏 \<a\> 标签并点击触发浏览器下载（文件名格式 ai-image-{timestamp}.png）；若结果为远程 URL 则通过 fetch 获取 Blob 后创建 Object URL 触发下载并随后释放；若前两种方式均失败则在浏览器新标签页打开图片地址作为兜底。每次新生成前页面自动清除旧结果并释放旧 blob URL（if resultUrl.startsWith(\'blob:\')）以避免内存中残留过期预览引用。生成失败时在预览区展示红色错误图标和具体错误文案。',
      processing:
        '用户点击生成按钮后，页面首先执行空值校验（!prompt.trim()），然后依次执行状态清理：设置 loading 为 true → 清除 error → 清空 aiMeta → 若旧 resultUrl 为 blob 协议则调用 URL.revokeObjectURL 释放 → 清空 resultUrl。之后通过 fetch 以 POST 方式将三个参数（prompt / ratio / style）和当前界面语言（i18n.language）序列化为 JSON 发送至 /api/ai-image-generator 端点。服务端根据 ratio 参数自动调整生图分辨率（1:1 → 1024×1024、16:9 → 1792×1024、9:16 → 1024×1792），根据 style 注入对应的负面提示词（negative prompt）排除低质量输出，调用 AI 文生图模型生成图片。前端接收响应后通过 response.json() 解析，若 HTTP 状态码非 ok 则抛出 data.error；若成功则从 data 中读取 imageUrl、model、fallbackUsed、elapsedMs 四个字段，分别存入 resultUrl 和 aiMeta 状态触发 React 重渲染。下载按钮的 handleDownload 函数实现三种策略的顺序尝试：优先通过直接 \<a\> 链接下载（data/blob URL），其次 fetch 转 Blob 下载，最后 window.open 打开。elapsedMs 以毫秒形式在结果标题旁展示，便于横向对比不同参数组合下的生成效率。',
      modes: ['自然语言多行画面描述', '三种画幅比例（1:1 方形 / 16:9 横向 / 9:16 竖向，含图标预览）', '六种艺术风格预设（摄影/动漫/数字艺术/油画/3D/赛博）', 'AI 模型元信息展示（模型名 + fallback 状态 + 耗时）', '自适应图片预览（object-contain 不裁剪）', '三级智能下载（Blob/Fetch/新窗口降级）', '旧 Blob URL 自动释放防内存泄漏'],
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
        'The AI Image Generator converts natural-language visual descriptions into high-quality images with selectable aspect ratios and art styles, covering the full lightweight workflow from creative exploration and visual proposals to deliverable-ready social assets. Suitable for content operators quickly generating multiple visual candidates for blog covers, social media visuals (Weibo / WeChat Official Account / Xiaohongshu cover images), feed ad creatives, email marketing banners, and short-video thumbnails to select and further refine the best option; product managers and entrepreneurs obtaining visual references for product concept art, MVP demo prototypes, pitch deck illustrations, or crowdfunding page renders — enabling discussions and decisions without waiting for designer output; UI/UX designers aligning team expectations on visual direction before formal design by rapidly generating multi-style mockups; educators creating illustrations for courseware, knowledge cards, or educational infographics; non-designer general staff obtaining downloadable image assets meeting output format requirements with a single natural-language input; and creators who need to generate aspect-ratio-adapted images (square 1:1 for avatars, landscape 16:9 for covers, vertical 9:16 for short videos) for different platform requirements. The tool provides six preset art styles and three aspect ratios, displays AI model metadata (model name, fallback usage status, generation elapsed time in milliseconds) to help users evaluate generation quality and service routing, and supports one-click download.',
      input:
        'Three core parameters: Image Description (required, multi-line textarea input, max 9 visible lines) — supports free-form description of main subject, scene and environment, action and state, composition approach (e.g. rule of thirds, centered symmetry, bird\'s-eye view), lighting and color direction (e.g. golden backlight, cool blue neon, natural soft light), color mood, lens focal length and depth of field (e.g. 50mm shallow DoF), material and texture (e.g. frosted metal, transparent glass, velvet), and intended use (e.g. "suitable for a blog cover," "for an Instagram post"); Aspect Ratio (three-button toggle group) — 1:1 (Square, suitable for avatars, covers, social profile images), 16:9 (Monitor / landscape widescreen, suitable for horizontal posters, video thumbnails, blog headers, and tweet illustrations), 9:16 (Smartphone / vertical full-screen, suitable for Douyin/TikTok/Reels vertical video covers and phone wallpapers), each option paired with a corresponding icon (Square/Monitor/Smartphone) for intuitive selection; Art Style (dropdown selection, six presets) — Photorealistic (photography-like realism), Anime (hand-drawn anime style), Digital Art (concept illustration), Oil Painting (oil-on-canvas texture and brushwork), 3D Render (Blender/C4D-like output), Cyberpunk (neon-lit futuristic city aesthetic). All parameters reflect in component state in real time; changes take effect on the next Generate click.',
      output:
        'The AI-generated image is rendered at adaptive size in the right-hand result panel (max-width/max-height 100% maintaining native aspect ratio, object-contain to avoid cropping). During generation, the preview area displays a loading spinner with "AI is painting..." text; after completion, the full-resolution image is shown with hover-to-inspect detail. The preview header bar displays AI model metadata labels — the model field identifies the actual generation model used, a "fallback" label is appended if fallbackUsed is true, and elapsedMs shows server-side generation latency — helping advanced users understand the current generation service\'s working state and performance. A download button in the top-right corner implements a three-tier fallback chain: blob: or data: protocol URLs trigger a direct hidden \<a\> element click for browser download (filename format ai-image-{timestamp}.png); remote URLs are fetched as Blobs, converted to Object URLs for download, then revoked; if both methods fail, the image URL is opened in a new browser tab as the last resort. Before each new generation run, the page auto-clears previous results and revokes old blob URLs (if resultUrl.startsWith(\'blob:\')), preventing stale preview references from persisting in memory. On generation failure, the preview area displays a red error icon with the specific error message.',
      processing:
        'When the user clicks the Generate button, the page first performs an empty-value check (!prompt.trim()), then executes state cleanup in sequence: sets loading to true → clears error → clears aiMeta → if the old resultUrl is a blob protocol URL, calls URL.revokeObjectURL to release it → clears resultUrl. After cleanup, a POST request is sent via fetch to the /api/ai-image-generator endpoint with the three parameters (prompt / ratio / style) and the current UI language (i18n.language) serialized as JSON. The server adjusts generation resolution based on the ratio parameter (1:1 → 1024×1024, 16:9 → 1792×1024, 9:16 → 1024×1792), injects a negative prompt based on the selected style to exclude low-quality output, and invokes an AI text-to-image model to generate the image. The frontend parses the response via response.json(); if the HTTP status code is not ok, data.error is thrown; on success, the four fields — imageUrl, model, fallbackUsed, elapsedMs — are read from data and stored in resultUrl and aiMeta state respectively, triggering a React re-render. The download button\'s handleDownload function attempts three strategies in order: direct \<a\> link download preferred (data/blob URLs), followed by fetch-to-Blob download, and finally window.open as a last resort. elapsedMs is displayed in milliseconds next to the result title for cross-parameter efficiency comparison.',
      modes: ['Natural-language multi-line image description', 'Three aspect ratios (1:1 Square / 16:9 Landscape / 9:16 Portrait, with icon preview)', 'Six art style presets (Photorealistic / Anime / Digital Art / Oil Painting / 3D / Cyberpunk)', 'AI model metadata display (model name + fallback status + elapsed time)', 'Adaptive image preview (object-contain, no cropping)', 'Three-tier smart download (Blob / Fetch / New window fallback)', 'Auto old Blob URL revocation to prevent memory leaks'],
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
        'Smart SVG Generator 用于根据图标或插画的自然语言描述，通过 AI 生成结构完整、可直接复制或下载的 SVG（可缩放矢量图形）代码。相比位图生成工具，它专门面向需要矢量缩放、可嵌入前端代码、可继续在矢量编辑软件（Figma、Illustrator、Inkscape）中修改编辑、且文件体积极小的场景。适合前端开发者快速获取各类 UI 图标（导航栏图标、功能按钮符号、状态指示标记、表单验证图标）的 SVG 源码并直接嵌入 React/Vue 组件中使用；产品设计团队为网站空状态插画、功能引导插图、产品特性符号等批量生成可编辑的矢量草稿；独立开发者为个人项目快速制作 favicon、App 图标和社交媒体素材的矢量版本；市场运营人员为落地页、邮件模板、数据报告长图生成轻量且任意缩放不失真的装饰图形；以及需要将设计系统草案中的图标概念通过自然语言快速原型化为真实 SVG 代码的设计师。工具支持四种矢量视觉风格（扁平化 / 线性 / 极简 / 彩色），生成结果在浏览器内直接渲染为即时矢量预览，并提供复制 SVG 代码和下载 .svg 文件两种导出方式，同时展示 AI 模型元信息。',
      input:
        '两个核心参数：图形描述（必填，多行文本输入框，高度 10 行）——建议描述主体对象（如"一个喝咖啡的猫咪""邮件发送图标""数据仪表盘空状态插画"）、设计用途与展示尺寸（如"适合 24x24 px 小图标""用于 400x300 空状态页"）、形状语言倾向（如"圆角线条、柔和饱满""锐利直角、科技感""流畅曲线、自然有机"）、线条粗细偏好（如"细线 1px 描边""粗线 3px 描边"）、颜色方向（如"纯色单色 #333366""双色 #FF6B6B + #4ECDC4""渐变色紫到蓝"）、是否需要背景（如"透明背景适合直接使用""圆形填充背景""圆角矩形卡片背景"）、元素复杂度（如"极简两个元素""丰富场景包含 5-8 个元素"）和特殊要求（如"需要对称""包含文字标签""可无限平铺"）；目标风格（四选一下拉）——Flat Design（扁平化，色块填充、无描边、几何概括）、Line Art（线性图标，描边为主/可选填色/类似 Feather Icons 风格）、Minimalist（极简风/最大留白/1-2 个核心视觉元素）、Colorful（色彩缤纷/多色渐变/复杂插画感）。输入描述越具体，AI 生成的 SVG 越接近实际可用和易于二次编辑的要求。',
      output:
        'AI 返回的 SVG 内容在右侧结果面板中以两种形式同时呈现：上半部分的即时矢量预览——通过 dangerouslySetInnerHTML 直接渲染清洗后的 SVG 标签（提取第一个 \<svg\>...\</svg\> 块、自动补充缺失的 xmlns="http://www.w3.org/2000/svg" 命名空间属性、注入 style="width:100%;height:100%" 适应容器尺寸），用户在预览区可直观看到矢量图形的实际渲染效果而非代码文本；下半部分（或代码降级模式）——若 AI 返回内容不是标准 SVG 格式（不以 \<svg 标签开头），则降级为深色背景等宽字体的代码文本展示模式，保留完整原始返回内容供用户自行提取或参考。预览面板标题栏展示 AI 模型元信息（model + fallbackUsed + elapsedMs）与两个操作按钮：复制按钮（Copy Code）将清洗后的 SVG 源码通过 navigator.clipboard.writeText 写入系统剪贴板（复制成功后图标切换为 Check 并显示"Copied"2 秒）——这对于开发者直接粘贴到代码编辑器中极为便利；下载按钮（Download）使用 Blob API 创建 MIME 类型为 image/svg+xml;charset=utf-8 的文件并触发浏览器下载（文件名格式 ai-generated-{timestamp}.svg）。生成失败时预览区显示红色错误图标和消息。',
      processing:
        '用户点击生成按钮后，页面执行空值校验（!prompt.trim()）后进入生成流程：清空旧结果和错误、清空元信息，将 prompt、style 和当前语言（i18n.language）序列化为 JSON 通过 fetch POST 发送至 /api/ai-svg-generator 端点。服务端构建 AI system prompt 要求模型输出纯 SVG 代码（不允许包含 markdown 代码块或额外解释文本），根据 style 参数注入不同风格约束：line art 风格强调 stroke-based 路径、扁平风格强调 fill 色块、极简风格强调最小元素数量、彩色风格允许多色渐变和复杂组合。模型返回后，前端通过正则 /<svg[\s\S]*?<\/svg>/i 从 rawSvg 文本中提取第一个完整 SVG 标签块（若未匹配到则保留原始文本作为降级处理），然后检查并补充 xmlns 命名空间属性（if (!finalSvg.includes(\'xmlns=\')) 则在 \<svg 标签后插入 xmlns="http://www.w3.org/2000/svg"），确保渲染和下载的 SVG 在浏览器和其他工具中均能被正确解析。renderSvg 函数判断清洗后的字符串是否以 \<svg 开头：是则通过 dangerouslySetInnerHTML 注入渲染（附带 width:100%;height:100% 样式确保填满预览容器）；否则降级为纯文本展示模式。复制操作用 getCleanSvg 获取清洗后的源码写入剪贴板；下载操作将清洗后的 SVG 通过 Blob + createObjectURL 生成下载链接并自动点击触发（随后释放 Object URL）。',
      modes: ['自然语言 SVG 描述（主体/用途/形状/颜色/复杂度）', '四种矢量风格（Flat / Line Art / Minimalist / Colorful）', 'SVG 标签正则提取与 xmlns 自动补充', '浏览器内即时 SVG 矢量渲染预览', '复制清洗后 SVG 代码（Clipboard API）', '下载 .svg 文件（Blob + MIME 类型）', '非标准返回降级为代码文本展示', 'AI 模型元信息展示'],
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
        'The Smart SVG Generator creates structurally complete, copyable, and downloadable SVG (Scalable Vector Graphics) code from natural-language icon or illustration descriptions using AI. Unlike bitmap generation tools, it is specifically designed for scenarios requiring vector scalability, direct frontend-code embeddability, ongoing editability in vector editing software (Figma, Illustrator, Inkscape), and extremely small file sizes. Suitable for frontend developers quickly obtaining SVG source code for various UI icons (navigation bar icons, function button symbols, status indicators, form validation icons) and directly embedding them in React/Vue components; product design teams batch-generating editable vector drafts for website empty-state illustrations, onboarding guide graphics, and product feature symbols; indie developers quickly creating vector versions of favicons, App icons, and social media assets for personal projects; marketing operators generating lightweight, infinitely scalable decorative graphics for landing pages, email templates, and data-report long images; and designers who need to rapidly prototype icon concepts from design-system drafts into real SVG code via natural language. The tool supports four vector visual styles (Flat / Line Art / Minimalist / Colorful), renders results as live vector previews directly in the browser, provides two export methods — copy SVG code and download .svg file — and displays AI model metadata.',
      input:
        'Two core parameters: Graphic Description (required, multi-line textarea, 10 visible lines) — recommended to describe the main subject (e.g. "a cat drinking coffee," "an email send icon," "a dashboard empty-state illustration"), design purpose and display size (e.g. "suitable for 24×24 px small icons," "for a 400×300 empty-state page"), shape language preference (e.g. "rounded strokes, soft and full," "sharp right angles, tech feel," "flowing curves, natural and organic"), stroke weight preference (e.g. "thin 1px outline," "thick 3px outline"), color direction (e.g. "solid single-color #333366," "two-tone #FF6B6B + #4ECDC4," "gradient purple to blue"), background requirements (e.g. "transparent background ideal for direct use," "circular filled background," "rounded-rect card background"), element complexity (e.g. "minimalist with 2 elements," "rich scene with 5-8 elements"), and special requirements (e.g. "needs symmetry," "includes text labels," "infinitely tileable"); Target Style (four-option dropdown) — Flat Design (color-block fills, no strokes, geometric reduction), Line Art (stroke-based, optional fills, similar to Feather Icons style), Minimalist (maximum whitespace, 1-2 core visual elements), Colorful (multi-color gradients, complex illustration feel). The more specific the description, the closer the AI-generated SVG will be to practically usable and easily editable.',
      output:
        'AI-returned SVG content is presented in the right-hand result panel in two simultaneous forms: the upper portion provides a live vector preview — the cleaned SVG tag (first \<svg\>...\</svg\> block extracted, missing xmlns="http://www.w3.org/2000/svg" namespace attribute auto-added, style="width:100%;height:100%" injected for container adaptation) is rendered directly via dangerouslySetInnerHTML, allowing users to visually see the actual rendered vector graphic rather than code text; the lower portion (or code fallback mode) — if the AI response is not standard SVG format (does not start with an \<svg tag), the display falls back to a dark-background monospace code-text mode preserving the full raw response for the user to extract or reference themselves. The preview header bar shows AI model metadata (model + fallbackUsed + elapsedMs) and two action buttons: a Copy button (Copy Code) writes the cleaned SVG source to the system clipboard via navigator.clipboard.writeText (on success the icon switches to a Check mark with "Copied" text for 2 seconds) — extremely convenient for developers pasting directly into a code editor; a Download button creates a Blob with MIME type image/svg+xml;charset=utf-8 and triggers a browser download (filename format ai-generated-{timestamp}.svg). On generation failure, the preview area displays a red error icon and message.',
      processing:
        'When the user clicks the Generate button, the page performs an empty-value check (!prompt.trim()) and enters the generation flow: clears old results and errors, clears metadata, serializes prompt, style, and the current language (i18n.language) into JSON, and sends it via fetch POST to the /api/ai-svg-generator endpoint. The server constructs an AI system prompt instructing the model to output pure SVG code (no markdown code blocks or extra explanatory text allowed), with different style constraints injected based on the style parameter: line art style emphasizes stroke-based paths, flat style emphasizes fill color blocks, minimalist style emphasizes minimal element count, and colorful style allows multi-color gradients and complex compositions. After the model returns, the frontend extracts the first complete SVG tag block from the rawSvg text via the regex /<svg[\s\S]*?<\/svg>/i (or retains the raw text as a fallback if no match is found), then checks and adds the xmlns namespace attribute if missing (if (!finalSvg.includes(\'xmlns=\')) inserts xmlns="http://www.w3.org/2000/svg" after the \<svg tag) to ensure the rendered and downloaded SVG is correctly parsed in browsers and other tools. The renderSvg function determines whether the cleaned string starts with \<svg: if so, it is rendered via dangerouslySetInnerHTML injection (with width:100%;height:100% style to fill the preview container); otherwise it falls back to a plain-text display mode. The copy action uses getCleanSvg to obtain the cleaned source for clipboard writing; the download action uses the cleaned SVG as a Blob via createObjectURL, creates a download link, and auto-clicks to trigger (then revokes the Object URL).',
      modes: ['Natural-language SVG description (subject / usage / shape / color / complexity)', 'Four vector styles (Flat / Line Art / Minimalist / Colorful)', 'SVG tag regex extraction and xmlns auto-completion', 'Live in-browser SVG vector render preview', 'Copy cleaned SVG code (Clipboard API)', 'Download .svg file (Blob + MIME type)', 'Non-standard response fallback to code-text display', 'AI model metadata display'],
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
        '提交后，工具会按所选风格组织内容结构。发布前请核对产品事实、价格、功效描述、广告合规和平台社区规则。',
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
        'After submission, the tool organizes the draft around your selected style. Before posting, check product facts, prices, benefit claims, ad disclosure, and Xiaohongshu community rules.',
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
        '提交后，工具会围绕清晰度、语气和表达顺序改写文本，不应替你新增未提供的事实。对合同、医疗、金融或法律内容，请只把结果当作语言参考。',
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
        'After submission, the tool improves clarity, tone, and sentence order without adding facts you did not provide. For contracts, medical, financial, or legal text, treat the output as language support only.',
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
        '提交后，工具会结合上下文翻译，而不是逐词替换。涉及合同、合规、医疗或财务内容时，请交给专业人员复核。',
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
        'After submission, the tool translates with context instead of word-by-word replacement. For contracts, compliance, medical, or financial content, use a professional reviewer before publication.',
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
        '提交后，工具会根据你选择的平台、语言和语气组织文案方向，并把商品信息拆成四类结果。生成内容是初稿，发布前请确认商品规格、价格、库存、物流承诺、禁用词和平台政策。',
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
        'After submission, the tool uses your marketplace, language, tone, and product details to draft four types of listing copy. Treat the output as a starting point. Check product facts, claims, prices, availability, shipping promises, restricted terms, and platform policy before publishing.',
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
        '提交后，工具会围绕种子词扩展相关表达，并按购买意图、材质、风格、场景或人群等方向分组。结果是选词草稿，不代表实时搜索量、广告成本或平台排名。',
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
        'After submission, the tool expands the seed term into related phrases and groups them by buying intent, material, style, occasion, or audience. The result is a planning draft, not live search volume, ad cost, or marketplace ranking data.',
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
        '提交后，工具会根据两段输入整理对比角度。结果是运营参考，不代表平台官方数据、真实销量或最终商业判断。',
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
        'After submission, the tool organizes comparison angles from the two inputs. Treat the result as operational reference, not official platform data, verified sales data, or a final business decision.',
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

  'market-insights': {
    zh: {
      summary:
        '市场洞察工具用于把平台、品类或产品想法整理成市场研究笔记。适合在选品、内容选题或广告测试前先梳理可能的机会和风险。',
      input:
        '选择平台和时间范围，并输入你关注的品类、趋势或产品方向。问题越具体，输出越容易形成可执行的验证清单。',
      output:
        '结果包含类目方向、趋势判断、机会点和下一步验证建议。请用平台搜索、广告工具、后台数据或真实订单继续确认。',
      processing:
        '提交后，工具会基于你的输入生成研究草稿。它不是实时市场数据源，不能替代库存、采购、预算或投放决策。',
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
        'After submission, the tool generates a research draft from your inputs. It is not a live market data source and should not replace inventory, sourcing, budget, or ad decisions.',
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
        'AI 代码审查工具用于对粘贴的代码片段进行质量、性能、安全性和可维护性审查，适合在正式提交 Pull Request 前做快速自查，也适合学习他人代码时获得结构化反馈。它可以帮助前端、后端和全栈开发者发现潜在空值问题、异常处理遗漏、重复逻辑、复杂度过高、命名不清、资源泄漏、异步竞态、性能浪费和常见安全风险。工具不会替代真实代码评审，但可以作为提交前的第一轮检查，把明显问题提前暴露出来。',
      input:
        '待审查的代码文本、代码语言和审查关注点。代码可以是一个函数、组件、接口处理器、工具方法、样式片段或配置逻辑；语言选项支持自动识别，也可以指定 JavaScript、TypeScript、React、Python、Java、Go、Rust、C++、CSS/SCSS 等。审查关注点用于控制反馈语气和重点，例如建设性建议、严格挑剔、新手友好或性能优化导向。',
      output:
        '一份 Markdown 格式的代码审查报告，通常包含总体评价、主要问题、风险等级、可改进建议、可能的重构方向和示例代码。输出会以段落、列表和代码块形式渲染；完整报告可以一键复制，报告中的代码块也支持单独复制，便于把建议带回编辑器或 PR 评论中继续处理。',
      processing:
        '点击开始审查后，页面将 code、codeLang、tone 和当前语言提交到 /api/ai-code-reviewer，并读取服务端 SSE 流式响应。每个 data 片段会被解析为 JSON，content 字段实时追加到结果文本中；最终通过 react-markdown 和 remark-gfm 渲染。代码块使用 Prism 高亮展示，并提供局部复制按钮。页面本身不执行静态分析或编译，只负责输入组织、请求提交、流式接收、Markdown 渲染和复制。',
      modes: ['多语言代码审查', '自动语言识别', '审查关注点选择', '流式 Markdown 报告', '代码块高亮', '报告与代码块复制'],
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
        'A Markdown code review report, typically including an overall assessment, key issues, risk level, improvement suggestions, possible refactoring direction, and example code. The output is rendered as paragraphs, lists, and code blocks. The full report can be copied with one click, and code blocks inside the report can be copied separately for use in an editor or PR comment.',
      processing:
        'When review starts, the page submits code, codeLang, tone, and current language to /api/ai-code-reviewer, then reads the server-sent event stream. Each data chunk is parsed as JSON and its content field is appended to the result text in real time. The final result is rendered through react-markdown and remark-gfm. Code blocks are highlighted with Prism and include local copy buttons. The page itself does not run static analysis or compilation; it handles input assembly, request submission, streaming, Markdown rendering, and copying.',
      modes: ['Multi-language code review', 'Auto language detection', 'Review focus selection', 'Streaming Markdown report', 'Highlighted code blocks', 'Report and code-block copy'],
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
        '提交后，工具会围绕岗位要求重组表达和亮点。它不会替你证明不存在的经历；不要让 AI 添加虚假职位、技能、证书或成绩。',
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
        'After submission, the tool reorganizes wording and highlights around the target role. It cannot verify work history for you, so do not let AI add roles, skills, certificates, or achievements that are not true.',
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
