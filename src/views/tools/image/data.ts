import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const IMAGE_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'qr-generator': {
    zh: {
      summary:
        '二维码生成器用于在浏览器中将链接、文本、联系方式、Wi-Fi 凭证或业务编号实时转换为可扫码识别的 QR Code 图像。适合为官网和落地页生成入口二维码、为商品包装和标签添加扫码跳转、为线下海报和展板嵌入活动注册链接、为资料下载页和 App 安装页提供移动端快捷入口、为内部流程单和工单系统关联业务编号，以及为 Wi-Fi 网络生成自动连接二维码（扫码后直接加入网络）。工具支持自定义前景色、背景色和四种纠错等级（L / M / Q / H），生成结果可实时预览并下载为 PNG 图片，适合直接用于印刷品和数字媒体。',
      input:
        '需要编码进二维码的文本内容或 URL（支持普通文本、HTTPS 链接、邮件地址 mailto:、电话号码 tel:、Wi-Fi 凭证 WIFI:T:WPA;S:... 格式和短链接）。同时可配置二维码外观参数：前景色（默认 #000000 黑色）、背景色（默认 #ffffff 白色）和纠错等级（L 约 7% 容错、M 约 15%、Q 约 25%、H 约 30% 容错率）。较高纠错等级生成的二维码图案更密集，但即使部分遮挡或污损也更易被识别，适合需要在二维码中央叠加 Logo 或在高磨损环境中使用的场景。',
      output:
        '在浏览器中即时渲染的二维码 Canvas 预览图，随输入内容、颜色和纠错等级变化实时更新。二维码图案以选定的前景色和背景色呈现，纠错等级越高码点越密集但容错能力越强。预览确认后可将当前二维码下载为 PNG 格式图片文件，适合直接用于网页嵌入、印刷海报、商品标签或社交媒体分享。下载文件为浏览器本地生成的 data URL 转 PNG，无需服务端参与。',
      processing:
        '通过 qrcode.react 库在浏览器端根据输入内容生成 QR Code。该库基于 qrcode 算法，将输入字符串按所选纠错等级（L/M/Q/H）编码为二维码矩阵数据，再通过 HTML5 Canvas API 逐像素绘制二维码图案。下载时读取 Canvas 元素的 toDataURL() 获取 Base64 编码的 PNG 数据，通过动态创建 <a> 标签的 download 属性触发本地文件保存。整个编码、渲染和导出流程均在当前浏览器页面内同步完成，输入内容不会上传至任何服务器。',
      modes: ['文本 / URL 编码', '前景色自定义', '背景色自定义', 'L / M / Q / H 纠错等级', '实时预览', 'PNG 图片下载'],
      example: {
        title: '链接输入到二维码输出示例',
        input: '内容: https://toolorbit.site\n前景色: #000000\n背景色: #ffffff\n纠错等级: H',
        output: '生成一个指向 https://toolorbit.site 的二维码 PNG 图片文件，可用于网页嵌入、印刷海报、商品标签或文档。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The QR Code Generator converts links, text, contact information, Wi-Fi credentials, or business identifiers into scannable QR Code images in real time, directly in the browser. Suitable for creating entry-point QR codes for official websites and landing pages, adding scan-to-visit codes to product packaging and labels, embedding event registration links in offline posters and display boards, providing mobile quick-access for download pages and app install links, associating business identifiers with internal workflow sheets and ticketing systems, and generating auto-connect QR codes for Wi-Fi networks (scan to join). The tool supports custom foreground color, background color, and four error correction levels (L / M / Q / H). Generated results can be previewed in real time and downloaded as PNG images suitable for both print and digital media.',
      input:
        'The text or URL to encode into the QR Code (supports plain text, HTTPS links, mailto: email addresses, tel: phone numbers, WIFI:T:WPA;S:... Wi-Fi credentials, and short links). You can also configure the QR appearance: foreground color (default #000000 black), background color (default #ffffff white), and error correction level (L ≈7%, M ≈15%, Q ≈25%, H ≈30% recovery capacity). Higher error correction levels produce denser QR patterns but allow successful scanning even when partially obscured or damaged, making them ideal when overlaying a logo in the center or in high-wear environments.',
      output:
        'A QR Code preview rendered in real time on a Canvas element in the browser, updating instantly as the input content, colors, and error correction level change. The QR pattern displays with the selected foreground and background colors; higher correction levels produce denser code points but greater fault tolerance. Once confirmed, the QR code can be downloaded as a PNG image file suitable for web embedding, printed posters, product labels, or social media sharing. The download file is generated locally from a Canvas data URL to PNG with no server involvement.',
      processing:
        'QR Code generation runs in the browser via the qrcode.react library. The library encodes the input string into QR Code matrix data based on the selected error correction level (L/M/Q/H), then renders the QR pattern pixel by pixel using the HTML5 Canvas API. For download, it reads the Canvas element\'s toDataURL() to obtain a Base64-encoded PNG, and triggers a local file save by dynamically creating an <a> element with the download attribute. The entire encode-render-export pipeline runs synchronously in the current browser page; input content is never uploaded to any server.',
      modes: ['Text / URL encoding', 'Foreground color picker', 'Background color picker', 'L / M / Q / H error correction', 'Real-time preview', 'PNG image download'],
      example: {
        title: 'Link to QR Code example',
        input: 'Content: https://toolorbit.site\nForeground: #000000\nBackground: #ffffff\nError correction: H',
        output: 'Generates a QR Code PNG pointing to https://toolorbit.site, usable for web, print, or documents.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'qr-scanner': {
    zh: {
      summary:
        '二维码识别器用于在浏览器中从本地图片文件读取并解析 QR Code 中编码的原始内容。适合在发布前验证自生成二维码是否指向正确 URL、解析他人分享的海报或截图中的活动链接、检查商品包装上印刷二维码的可读性、识别线下活动扫码后的跳转目标、从会议资料或文档截图中提取二维码信息，以及作为二维码生成工具的配套验证手段，确保生成结果可被标准扫码设备正确识别。工具支持点击上传和拖拽上传两种方式，识别在浏览器本地完成，图片不会离开用户设备。',
      input:
        '包含清晰可见二维码区域的本地图片文件。支持浏览器可读取的常见图片格式，包括 PNG、JPG、JPEG、WebP 以及屏幕截图。图片中的二维码应尽量方正、清晰且未被大面积遮挡或反光，二维码在图片中的占比越大识别成功率越高。工具会先将图片绘制到 Canvas 以提取像素数据，因此无需额外安装或上传到服务端。',
      output:
        '识别出的二维码原始文本内容。可能是 HTTPS 链接、普通文本、邮件地址、电话号码、Wi-Fi 连接凭证、业务编号或其他编码字符串。识别成功后结果以可复制的文本形式展示，用户可一键复制到剪贴板用于后续操作。若图片中未检测到二维码（如二维码模糊、遮挡严重或图片不包含二维码），工具会输出明确错误提示，而非静默返回空结果。',
      processing:
        '读取用户选择或拖拽的图片文件（通过 FileReader 读取为 data URL），将其绘制到浏览器内存中的临时 Canvas 元素。随后通过 jsQR 库对 Canvas 的像素数据进行逐行扫描分析：先定位二维码的定位图案（Finder Pattern）确定二维码区域，再解析格式信息获取纠错等级和掩码模式，最后按 QR Code 标准解码数据码字还原原始文本。识别全程在浏览器端执行，图片像素数据不会上传至任何服务器，识别结果仅在当前页面展示。',
      modes: ['点击上传图片', '拖拽上传识别', 'QR Code 内容解析', '识别失败错误提示', '一键复制结果', '重新上传'],
      example: {
        title: '二维码图片输入到文本输出示例',
        input: '上传一张包含 ToolOrbit 首页二维码的 PNG 图片文件',
        output: 'https://toolorbit.site',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The QR Code Scanner reads and decodes the raw content encoded in QR Codes from local image files, entirely within the browser. Suitable for verifying that self-generated QR codes point to the correct URL before publishing, parsing activity links from shared posters or screenshots, checking the readability of printed QR codes on product packaging, identifying the redirect target after scanning at offline events, extracting QR-encoded information from meeting materials or document screenshots, and serving as a companion verification tool for the QR Generator to ensure generated results are correctly readable by standard scanning devices. The tool supports both click-to-upload and drag-and-drop; all recognition runs locally and images never leave the device.',
      input:
        'A local image file containing a clearly visible QR Code region. Supports common browser-readable image formats including PNG, JPG, JPEG, WebP, and screenshots. The QR code in the image should be reasonably square, clear, and not significantly obscured or reflective; the larger the QR code\'s proportion in the image, the higher the recognition success rate. The tool draws the image onto a Canvas to extract pixel data, so no additional installation or server upload is needed.',
      output:
        'The raw text content decoded from the QR Code. This may be an HTTPS link, plain text, email address, phone number, Wi-Fi connection credentials, business identifier, or other encoded string. On successful recognition, the result is displayed as copyable text with a one-click copy-to-clipboard action. If no QR Code is detected in the image (e.g. the QR code is too blurry, heavily obscured, or the image does not contain a QR Code), the tool displays a clear error message rather than silently returning empty.',
      processing:
        'Reads the user-selected or dragged image file (via FileReader as a data URL), draws it onto a temporary in-memory Canvas element. Then the jsQR library scans and analyzes the Canvas pixel data row by row: first locating the Finder Pattern to determine the QR Code region, then parsing format information to extract the error correction level and mask pattern, and finally decoding the data codewords according to the QR Code standard to recover the original text. All recognition runs in the browser; image pixel data is never uploaded to any server; decoded results are displayed only in the current page.',
      modes: ['Click to upload image', 'Drag-and-drop recognition', 'QR Code content decoding', 'Recognition failure error', 'One-click copy result', 'Re-upload'],
      example: {
        title: 'QR Code image to text example',
        input: 'Upload a PNG image containing the ToolOrbit homepage QR Code',
        output: 'https://toolorbit.site',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'barcode-generator': {
    zh: {
      summary:
        '条形码生成器用于在浏览器中将商品编号、库存 SKU、订单号、资产编号或测试数据实时转换为可打印、可下载的标准条形码图像。适合为电商商品制作带条码的标签贴纸、为仓储入库和库存盘点打印编码标签、为内部固定资产管理系统生成资产条码、为实验室样品和试剂编号、为门店价签和促销标签添加扫码识别，以及在 ERP / WMS 系统联调测试中快速生成符合标准的条码样本。工具基于 JsBarcode 库支持 CODE128、CODE39、EAN-13、EAN-8、UPC-A、ITF-14、MSI、Pharmacode 等多种国际条码制式，并可自定义线宽、高度、文字显示和颜色，生成结果可下载为 PNG 图片直接用于打印。',
      input:
        '需要编码的文本或数字（如商品 SKU、EAN-13 商品编号、订单号）、条码制式选择（CODE128 / CODE39 / EAN-13 / EAN-8 / UPC-A / ITF-14 / MSI / Pharmacode 等），以及外观参数：线宽（单条宽度）、条码高度（像素）、是否在条码下方显示原始文本值、条码前景色和背景色。不同条码制式对输入字符集和长度有不同约束：CODE128 支持全 ASCII 字符集最为通用，CODE39 支持大写字母和数字，EAN-13 必须为 13 位数字（含校验位），EAN-8 为 8 位数字，UPC-A 为 12 位数字。输入不符合制式要求时工具会给出格式错误提示。',
      output:
        '在浏览器中以 SVG 矢量格式实时渲染的条形码预览图，随输入内容、制式和外观参数变化即时更新。条码以选定线宽和高度渲染，可选在条码下方显示原始文本值便于人工核对。预览确认后可下载为 PNG 格式图片，适合直接用于标签打印、嵌入文档或导入设计软件。若输入内容不符合所选条码制式的编码规则（如 EAN-13 位数不匹配或含非法字符），工具会展示格式错误提示，避免导出不可被扫码设备识别的条码。',
      processing:
        '通过 JsBarcode 库在浏览器端根据输入内容和所选制式生成 SVG 格式条码。JsBarcode 会按指定制式的编码规则将输入字符转换为条空序列（如 CODE128 使用三种字符集和校验码计算），再通过 SVG DOM 元素逐条渲染。下载时将 SVG 序列化为字符串，绘制到内存 Canvas 上，再通过 toDataURL() 导出为 PNG 文件并触发浏览器下载。整个编码、渲染和导出流程在当前页面同步完成，输入数据不会上传至任何服务器。',
      modes: ['CODE128 全 ASCII', 'CODE39 字母数字', 'EAN-13 / EAN-8', 'UPC-A', 'ITF-14 / MSI / Pharmacode', '线宽 / 高度调节', '文本显示开关', '前景色 / 背景色', 'PNG 下载'],
      example: {
        title: '商品编号输入到条形码输出示例',
        input: '内容: 123456789012\n格式: CODE128\n线宽: 2\n高度: 100\n显示文本: 是\n条码颜色: #000000\n背景色: #ffffff',
        output: '生成一个可下载的 CODE128 条形码 PNG 图片，条码下方显示原始文本 123456789012。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Barcode Generator converts product numbers, inventory SKUs, order IDs, asset tags, or test data into printable, downloadable standard barcode images in real time, directly in the browser. Suitable for creating barcode label stickers for e-commerce products, printing encoded labels for warehouse receiving and inventory counting, generating asset barcodes for internal fixed-asset management systems, numbering laboratory samples and reagents, adding scan identification to store price tags and promotional labels, and quickly generating standards-compliant barcode samples during ERP / WMS integration testing. Based on the JsBarcode library, the tool supports multiple international barcode symbologies including CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF-14, MSI, and Pharmacode, with customizable bar width, height, text display, and colors. Results can be downloaded as PNG images ready for printing.',
      input:
        'The text or number to encode (e.g. product SKU, EAN-13 product code, order number), the barcode symbology selection (CODE128 / CODE39 / EAN-13 / EAN-8 / UPC-A / ITF-14 / MSI / Pharmacode), and appearance parameters: bar width (single bar width in pixels), barcode height (in pixels), whether to display the original text value below the barcode, and foreground/background colors. Different symbologies impose different constraints on the input character set and length: CODE128 supports the full ASCII character set and is the most versatile; CODE39 supports uppercase letters and digits; EAN-13 requires exactly 13 digits (including check digit); EAN-8 requires 8 digits; UPC-A requires 12 digits. If the input does not meet the symbology requirements, the tool displays a format error message.',
      output:
        'A barcode preview rendered in real time as SVG vector graphics in the browser, updating instantly as the input content, symbology, and appearance parameters change. The barcode renders at the selected bar width and height, with an option to display the original text value below for human verification. Once confirmed, the barcode can be downloaded as a PNG image suitable for label printing, document embedding, or importing into design software. If the input content violates the encoding rules of the selected symbology (e.g. EAN-13 digit count mismatch or illegal characters), the tool displays a format error to prevent exporting unscannable barcodes.',
      processing:
        'Barcode generation runs in the browser via the JsBarcode library, producing SVG-format barcodes based on the input content and selected symbology. JsBarcode encodes the input characters into bar/space sequences according to the symbology\'s encoding rules (e.g. CODE128 uses three character sets and checksum calculation), then renders each bar via SVG DOM elements. For download, the SVG is serialized to a string, drawn onto an in-memory Canvas, exported as a PNG file via toDataURL(), and the browser download is triggered. The entire encode-render-export pipeline runs synchronously on the current page; input data is never uploaded to any server.',
      modes: ['CODE128 full ASCII', 'CODE39 alphanumeric', 'EAN-13 / EAN-8', 'UPC-A', 'ITF-14 / MSI / Pharmacode', 'Bar width / height', 'Text display toggle', 'Foreground / background color', 'PNG download'],
      example: {
        title: 'Product number to barcode example',
        input: 'Content: 123456789012\nFormat: CODE128\nBar width: 2\nHeight: 100\nShow text: yes\nBar color: #000000\nBackground: #ffffff',
        output: 'Generates a downloadable CODE128 barcode PNG with the original text 123456789012 displayed below.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'anime-screenshot-source': {
    zh: {
      summary:
        '动漫截图溯源工具用于通过番剧截图索引服务反向图像检索定位番剧截图来源。适合上传动画正片截图、GIF 单帧或接近原始画面的二次元场景图，快速查找候选动画作品、集数、时间点和预览链接。工具会返回多条候选结果，并展示相似度评分、画面预览、作品标题与外部链接，便于用户继续人工核对。番剧截图索引服务更适合番剧截图定位，不适合插画、同人图、游戏 CG 或纯原创图片；这类图片应改用其他以图搜图工具交叉验证。',
      input:
        '上传一张需要溯源的番剧截图文件，支持 JPG、JPEG、PNG、WEBP 格式。建议使用清晰度较高、接近 16:9 或 4:3 原始画幅、未过度裁切且未明显调色的版本；强水印、过度裁剪、滤镜调色、合成效果、屏幕斜拍、明显透视变形或低分辨率图片，都会降低命中率。若一次搜索没有找到目标来源，可以尝试上传同一画面的不同裁切版本，或换用更接近原始清晰度的文件。',
      output:
        '按相似度从高到低排列的候选番剧场景列表。每条结果包含相似度评分、预览缩略图、动画标题、集数、时间点，以及可打开的作品信息或预览链接。相似度越高通常越可能接近正确来源，但不等于完全一致；同一作品中相近构图、片头片尾重复镜头、裁切版和压缩版图片，都可能出现接近评分。第一条结果不准确时，应结合预览画面、集数和时间点继续向下比对。',
      processing:
        '工具读取用户上传的图片并提交给番剧截图索引服务，由该服务在番剧截图索引中进行画面特征匹配。接口返回候选结果后，页面提取相似度、预览图、动画标题、集数、时间点与外部链接，并统一整理为可浏览的结果列表。番剧截图索引服务无法保证覆盖所有动画：较旧作品、长篇连载、非日本动画、尚未索引的新番、非正片截图或大幅修改后的图片可能没有命中。由于图片会用于外部检索，请避免上传包含个人信息或隐私内容的图片；必要时应先遮挡或脱敏。',
      modes: ['JPG / JPEG / PNG / WEBP 上传', '番剧截图索引检索', '相似度排序', '预览图展示', '集数 / 时间点定位', '候选结果人工核对'],
      example: {
        title: '动漫截图溯源示例',
        input: '上传文件: anime-scene.png\n图片类型: 番剧截图\n目标: 查找动画作品、集数和时间点',
        output:
          '候选 1: 相似度 92.4% · 第 3 集 · 12:34\n候选 2: 相似度 88.1% · 第 4 集 · 05:18\n用户根据预览图、标题、集数和时间点继续核对正确来源。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Anime Screenshot Source Finder uses an anime scene index service to locate anime scene sources through reverse image search. It is designed for episode screenshots, GIF frames, and images close to original anime frames, helping users find candidate anime titles, episodes, timestamps, and preview links. The tool returns multiple candidate matches with similarity scores, thumbnails, titles, and external links for manual verification. Anime scene indexing is best for episode screenshots, not illustrations, fan art, game CGs, or unpublished original images; use other reverse image search tools for those workflows.',
      input:
        'Upload the anime screenshot you want to trace. Supported formats include JPG, JPEG, PNG, and WEBP. Clear images close to the original 16:9 or 4:3 frame work best. Heavy watermarks, excessive cropping, filters, color grading, compositing, angled screen photos, perspective distortion, or very low-resolution images can reduce accuracy. If the first search misses the target, try another crop of the same frame or a higher-quality version closer to the original.',
      output:
        'A ranked list of candidate anime scenes sorted by similarity. Each result includes a similarity score, thumbnail preview, anime title, episode, timestamp, and external links such as work information or preview pages. A higher score usually means a closer visual match, but it is not proof of an exact source. Similar compositions, repeated opening or ending shots, cropped frames, and compressed versions can all produce close scores. If the first result is not the target, compare the remaining candidates using thumbnails, episode data, timestamps, and links.',
      processing:
        'The tool reads the uploaded image and submits it to an anime scene index service, where visual features are compared against an anime scene index. After the API returns candidates, the page normalizes similarity, thumbnail, anime title, episode, timestamp, and external links into a readable result list. Anime scene indexes do not cover every animation: older titles, very long-running series, non-Japanese animation, newly released episodes not yet indexed, non-scene images, or heavily edited screenshots may not match. Because images are used for external lookup, avoid uploading files that contain personal or private information; mask sensitive areas first when needed.',
      modes: ['JPG / JPEG / PNG / WEBP upload', 'Anime scene index search', 'Similarity ranking', 'Thumbnail preview', 'Episode / timestamp lookup', 'Manual candidate verification'],
      example: {
        title: 'Anime source lookup example',
        input: 'Uploaded file: anime-scene.png\nImage type: anime episode screenshot\nGoal: find anime title, episode, and timestamp',
        output:
          'Candidate 1: 92.4% similarity · Episode 3 · 12:34\nCandidate 2: 88.1% similarity · Episode 4 · 05:18\nThe user verifies the correct source by comparing thumbnails, title, episode, and timestamp.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-compressor': {
    zh: {
      summary:
        '图片压缩工具用于在浏览器中降低 JPG、PNG 或 WebP 图片文件体积，同时尽量保留可用的视觉质量。适合在上传到网站、博客、电商商品页、社交媒体或邮件附件前压缩图片，减少页面加载时间和传输成本；也适合将设计稿预览图、截图、封面图、资料配图和移动端拍摄照片快速处理为更轻量的版本。工具支持质量滑杆和目标格式选择，可对比原图与压缩后图片的文件大小，所有读取、重绘、编码和下载都在当前浏览器本地完成。处理过程不会把图片上传到服务器，适合处理隐私截图、内部资料和未发布素材。',
      input:
        '上传一张浏览器可读取的图片文件，支持常见 JPG、PNG、WebP、GIF 首帧等图片类型。上传后可设置压缩质量（10% 到 100%）和目标导出格式（JPG、PNG、WebP）。质量越低通常文件越小，但细节、边缘和渐变区域可能出现更明显的压缩痕迹；JPG 适合照片类图片，PNG 适合需要无损或透明背景的图形，WebP 通常在网页场景下提供更好的体积表现。工具会在压缩前展示原始文件大小，方便用户根据目标平台限制进行调整。',
      output:
        '压缩后的图片预览和可下载文件。页面会同时展示原图大小与压缩后文件大小，并计算节省比例，用户可在确认质量后下载新图片。导出文件名会在原文件名后追加 -compressed，并根据目标格式使用对应扩展名（jpg、png 或 webp）。如果选择 PNG，由于 PNG 编码本身更偏无损，文件体积不一定比原图更小；如果选择 JPG，透明区域会按浏览器 Canvas 默认绘制结果处理。',
      processing:
        '工具通过 URL.createObjectURL() 创建本地预览地址，并用 HTMLImageElement 加载图片。压缩时创建离屏 Canvas，设置 Canvas 宽高为原图尺寸，通过 drawImage() 将图片绘制到 Canvas，再调用 canvas.toBlob(format, quality) 以指定格式和质量重新编码图片。生成的 Blob 保存在浏览器内存中，并通过 URL.createObjectURL(blob) 生成压缩预览和下载链接。下载时动态创建 <a> 标签并使用 download 属性触发保存。整个流程只依赖浏览器 File、Canvas、Blob 和 Object URL API。',
      modes: ['图片上传', '质量滑杆', 'JPG / PNG / WebP 导出', '原图与压缩图对比', '节省比例统计', '本地下载'],
      example: {
        title: '图片压缩示例',
        input: 'photo.jpg\n原始大小: 2.4 MB\n质量: 80%\n导出格式: WebP',
        output: 'photo-compressed.webp\n压缩后大小: 680 KB\n节省: 72%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image Compressor reduces the file size of JPG, PNG, or WebP images in the browser while preserving usable visual quality. It is useful before uploading images to websites, blogs, e-commerce product pages, social media, or email attachments, where smaller files improve loading speed and reduce transfer cost. It also works for design previews, screenshots, cover images, documentation graphics, and mobile photos that need a lighter version. The tool provides a quality slider and target format selection, compares original and compressed file sizes, and performs all reading, drawing, encoding, and downloading locally in the current browser. Images are not uploaded to a server, making it suitable for private screenshots, internal materials, and unpublished assets.',
      input:
        'Upload one browser-readable image file, such as JPG, PNG, WebP, or the first frame of a GIF. After upload, choose the compression quality (10% to 100%) and the output format (JPG, PNG, or WebP). Lower quality usually means a smaller file, but may introduce more visible artifacts around detail, edges, and gradients. JPG works well for photos, PNG is better for lossless graphics or transparency needs, and WebP often provides strong size savings for web use. The original file size is shown before compression so you can tune the result for platform limits.',
      output:
        'A compressed image preview and a downloadable file. The page displays both the original size and compressed size, then calculates the saved percentage. After checking the visual result, you can download the new image. The exported filename appends -compressed to the original base name and uses the selected extension: jpg, png, or webp. PNG output may not always be smaller because PNG encoding is more lossless-oriented; JPG output handles transparent regions according to the browser Canvas rendering result.',
      processing:
        'The tool creates a local preview URL with URL.createObjectURL() and loads the image into an HTMLImageElement. During compression, it creates an off-screen Canvas with the original image dimensions, draws the image via drawImage(), and re-encodes it using canvas.toBlob(format, quality). The resulting Blob is kept in browser memory, then converted to an Object URL for preview and download. Download is triggered by creating an <a> element with the download attribute. The pipeline relies only on browser File, Canvas, Blob, and Object URL APIs.',
      modes: ['Image upload', 'Quality slider', 'JPG / PNG / WebP export', 'Original vs compressed comparison', 'Savings percentage', 'Local download'],
      example: {
        title: 'Image compression example',
        input: 'photo.jpg\nOriginal size: 2.4 MB\nQuality: 80%\nOutput format: WebP',
        output: 'photo-compressed.webp\nCompressed size: 680 KB\nSaved: 72%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-converter': {
    zh: {
      summary:
        '图片格式转换工具用于在浏览器中将图片重新编码为 JPG、PNG 或 WebP 格式。适合把透明 PNG 转为适合邮件和后台上传的 JPG、把网页素材转换为更现代的 WebP、把拍照文件转成通用格式用于 CMS 或电商后台、把截图转换为 PNG 保留清晰边缘，以及在不同平台对图片格式有限制时快速准备兼容文件。工具上传后展示源图片预览和文件大小，用户选择目标格式后一键转换并下载，所有像素读取、Canvas 绘制和格式编码都在本地完成。',
      input:
        '上传一张图片文件并选择目标格式。支持浏览器可解码的图片类型作为输入，包括 JPG、PNG、WebP 等。工具会根据原始格式自动建议一个不同的目标格式，例如上传 JPG 时默认建议 PNG，上传非 JPG 时默认建议 JPG。转换为 JPG 时透明背景会被白色背景填充，避免透明像素在某些查看器中显示为黑色；转换为 PNG 时更适合需要清晰边缘或透明图形的场景；转换为 WebP 时更适合网页性能优化。',
      output:
        '一个按目标格式重新编码的图片文件。转换后页面会展示新图片预览和文件大小，用户可下载以 -converted 命名的新文件。文件扩展名根据目标格式自动设置为 jpg、png 或 webp。转换过程不会修改原始文件，也不会把文件上传到远程服务器。由于不同格式的压缩模型不同，转换后文件大小可能变小，也可能因 PNG 等格式而增大。',
      processing:
        '工具通过 URL.createObjectURL() 加载本地图片，并创建与图片原始尺寸一致的离屏 Canvas。转换为 JPEG 时，先用白色填充 Canvas 背景，再通过 drawImage() 绘制图片，避免透明通道在 JPEG 中丢失后出现异常底色。随后调用 canvas.toBlob(targetFormat, 0.92) 以目标 MIME 类型重新编码，生成 Blob 后转为 Object URL 供预览和下载。整个转换链路使用浏览器 Canvas 编解码能力完成。',
      modes: ['图片上传', 'JPG 输出', 'PNG 输出', 'WebP 输出', '透明背景白底处理', '转换后预览', '本地下载'],
      example: {
        title: '图片格式转换示例',
        input: 'logo.png\n目标格式: WebP',
        output: 'logo-converted.webp\n转换后的 WebP 图片文件',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image Converter re-encodes images as JPG, PNG, or WebP directly in the browser. It is useful for turning transparent PNGs into JPG files accepted by email or admin systems, converting web assets into modern WebP, preparing camera images for CMS or e-commerce uploads, converting screenshots to PNG for crisp edges, and handling platforms with strict image format requirements. After upload, the tool shows a source preview and file size, lets you choose the target format, and downloads the converted file. All pixel reading, Canvas drawing, and format encoding run locally.',
      input:
        'Upload one image file and choose the target format. Browser-decodable image types such as JPG, PNG, and WebP are supported as input. The tool suggests a different default target format based on the source: JPG inputs default to PNG, while non-JPG inputs default to JPG. When converting to JPG, transparent areas are filled with white to avoid black backgrounds in some viewers. PNG is useful for crisp edges or transparency-oriented graphics, while WebP is useful for web performance.',
      output:
        'A newly encoded image file in the selected target format. After conversion, the page displays the new preview and file size, then lets you download a -converted file. The extension is automatically set to jpg, png, or webp based on the selected format. The original file is not modified and no upload to a remote server occurs. Because formats use different compression models, the output can be smaller or larger depending on the source image and selected format.',
      processing:
        'The tool loads the local image through URL.createObjectURL() and creates an off-screen Canvas matching the original image dimensions. For JPEG output, the Canvas is first filled with white before drawImage() renders the image, preventing transparent pixels from becoming unexpected dark regions after alpha is removed. It then calls canvas.toBlob(targetFormat, 0.92) to encode the selected MIME type. The Blob is converted into an Object URL for preview and download. The entire conversion uses browser Canvas encoding APIs.',
      modes: ['Image upload', 'JPG output', 'PNG output', 'WebP output', 'White fill for JPEG transparency', 'Converted preview', 'Local download'],
      example: {
        title: 'Image format conversion example',
        input: 'logo.png\nTarget format: WebP',
        output: 'logo-converted.webp\nConverted WebP image file',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'svg-to-png': {
    zh: {
      summary:
        'SVG 转 PNG 工具用于将矢量 SVG 图形在浏览器中渲染为指定尺寸的 PNG 位图。适合把图标、Logo、插画、流程图、设计系统组件、网页矢量素材或 AI 生成的 SVG 代码导出为可直接上传、分享或嵌入文档的 PNG 文件。工具支持上传 SVG 文件，也支持直接粘贴 SVG 源码；会自动解析 width、height 或 viewBox 获取原始比例，并允许锁定比例调整输出尺寸。预览和导出均在本地浏览器完成，不需要把 SVG 内容发送到服务器。',
      input:
        '输入可以是一份 .svg 文件，也可以是直接粘贴到编辑区的 SVG XML 字符串。SVG 根节点应为 <svg>，建议包含 width/height 或 viewBox 以便工具自动识别尺寸和宽高比。用户可设置输出宽度和高度，并选择是否锁定原始比例。若粘贴内容无法被 DOMParser 解析为合法 SVG，或根节点不是 svg，工具会给出错误提示，避免导出空白或异常图片。',
      output:
        '一个 PNG 图片文件。右侧预览区域会以透明棋盘格背景展示 SVG 渲染效果，用户调整宽高后可实时确认输出尺寸。导出时文件名沿用上传文件名或默认 converted_image，并使用 .png 扩展名。PNG 是位图格式，导出后不再保留 SVG 的矢量可编辑性，但兼容性更好，适合上传到不支持 SVG 的平台、插入文档或作为 favicon / 图标素材的中间格式。',
      processing:
        '工具使用 DOMParser 解析 SVG 字符串，并从根节点读取 width、height 或 viewBox 来计算原始宽高比。导出时通过 XMLSerializer 将修改过尺寸属性的 SVG 重新序列化，使用 Blob 创建 image/svg+xml Object URL，再用 Image 对象加载该 Blob。加载完成后创建指定宽高的 Canvas，通过 drawImage() 将 SVG 渲染到 Canvas，最后调用 canvas.toDataURL("image/png") 得到 PNG Data URL，并通过 <a download> 触发本地下载。',
      modes: ['SVG 文件上传', 'SVG 源码粘贴', '宽度 / 高度设置', '锁定比例', '实时预览', 'PNG 下载'],
      example: {
        title: 'SVG 转 PNG 示例',
        input: '<svg viewBox="0 0 128 128">...</svg>\n输出尺寸: 512 x 512',
        output: 'converted_image.png\n512 x 512 PNG 位图',
        inputLanguage: 'xml',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The SVG to PNG tool renders vector SVG graphics into PNG bitmaps at a chosen size directly in the browser. It is useful for exporting icons, logos, illustrations, diagrams, design-system assets, web vectors, or AI-generated SVG code into PNG files that can be uploaded, shared, or embedded in documents. The tool supports SVG file upload and direct SVG source paste. It detects the original ratio from width, height, or viewBox, then lets you resize output dimensions with optional aspect-ratio lock. Preview and export both run locally in the browser.',
      input:
        'Input can be a .svg file or an SVG XML string pasted into the editor. The root node should be <svg>, preferably with width/height or viewBox so the tool can detect the dimensions and aspect ratio. You can set output width and height, and choose whether to preserve the original ratio. If the pasted content cannot be parsed by DOMParser as valid SVG, or if the root node is not svg, the tool shows a clear error to avoid exporting blank or broken images.',
      output:
        'A PNG image file. The preview area uses a checkerboard background to show transparent regions while you adjust dimensions. The exported filename uses the uploaded SVG base name or the default converted_image, with a .png extension. PNG output is rasterized and no longer keeps SVG vector editability, but it has broad compatibility for platforms that do not accept SVG, document insertion, favicon workflows, and icon asset pipelines.',
      processing:
        'The tool parses the SVG string with DOMParser and reads width, height, or viewBox from the root element to calculate the original aspect ratio. During export, it updates the SVG size attributes, serializes the document with XMLSerializer, creates an image/svg+xml Blob Object URL, and loads it into an Image object. After loading, it creates a Canvas with the selected dimensions, renders the SVG via drawImage(), generates a PNG Data URL using canvas.toDataURL("image/png"), and triggers a local download through <a download>.',
      modes: ['SVG file upload', 'SVG source paste', 'Width / height settings', 'Aspect ratio lock', 'Live preview', 'PNG download'],
      example: {
        title: 'SVG to PNG example',
        input: '<svg viewBox="0 0 128 128">...</svg>\nOutput size: 512 x 512',
        output: 'converted_image.png\n512 x 512 PNG bitmap',
        inputLanguage: 'xml',
        outputLanguage: 'text',
      },
    },
  },

  'image-to-base64': {
    zh: {
      summary:
        '图片转 Base64 工具用于在浏览器中把本地图片编码为 Base64 字符串和完整 Data URL。适合将小图标、占位图、邮件模板图片、CSS 背景图、Markdown 示例图片、接口调试用图片或前端单文件 Demo 中的图片嵌入到文本内容里，减少额外文件引用。工具上传图片后会展示源图预览、文件格式和大小，并分别输出带 data:image/... 前缀的 Data URL 与纯 Base64 内容，支持一键复制。所有编码由 FileReader 在浏览器本地完成。',
      input:
        '上传一张图片文件。支持浏览器 FileReader 可读取的常见图片类型，如 PNG、JPG、JPEG、WebP、GIF、SVG 等。工具会把文件读取为 Data URL，因此文件越大，输出字符串越长；当图片超过 2 MB 时页面会提示注意体积。Base64 会让原始二进制体积增加约三分之一，不适合嵌入大图或大量图片，更适合小图标、测试样例和不方便管理静态文件的场景。',
      output:
        '两个可复制结果：完整 Data URL 和纯 Base64 字符串。完整 Data URL 包含 MIME 类型前缀，例如 data:image/png;base64,...，可以直接用于 HTML img src、CSS url() 或部分富文本字段；纯 Base64 去掉了逗号前的元信息，适合接口字段、JSON 载荷或需要自行拼接 MIME 前缀的场景。页面保留图片预览和文件元信息，便于核对编码来源。',
      processing:
        '工具通过 FileReader.readAsDataURL(file) 读取用户选择的图片文件。读取完成后，event.target.result 即为完整 Data URL，包含 MIME 类型、base64 标记和编码后的数据。纯 Base64 内容通过按逗号分割 Data URL 并取第二段得到。复制操作使用 navigator.clipboard.writeText() 写入剪贴板，并以短暂状态提示复制成功。整个过程不需要 Canvas，也不会上传图片。',
      modes: ['图片上传', 'Data URL 输出', '纯 Base64 输出', '一键复制', '文件大小提示', '本地编码'],
      example: {
        title: '图片转 Base64 示例',
        input: 'icon.png\n类型: image/png\n大小: 12 KB',
        output: 'data:image/png;base64,iVBORw0KGgo...\n纯 Base64: iVBORw0KGgo...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image to Base64 tool encodes a local image into both a Base64 string and a complete Data URL in the browser. It is useful for embedding small icons, placeholders, email template images, CSS background images, Markdown sample images, API debugging images, or assets in a single-file frontend demo without managing separate files. After upload, the tool shows a source preview, format, and size, then outputs both the full data:image/... Data URL and the raw Base64 content with one-click copy. Encoding is handled locally by FileReader.',
      input:
        'Upload one image file. Common FileReader-readable image types are supported, including PNG, JPG, JPEG, WebP, GIF, and SVG. The file is read as a Data URL, so larger files produce longer strings; the page warns when the image exceeds 2 MB. Base64 increases binary size by roughly one third, so it is not ideal for large images or many embedded assets. It is best for small icons, test samples, and cases where managing a static file is inconvenient.',
      output:
        'Two copyable results: a complete Data URL and a raw Base64 string. The complete Data URL includes the MIME prefix, such as data:image/png;base64,..., and can be used directly in HTML img src, CSS url(), or compatible rich text fields. The raw Base64 removes the metadata before the comma and is better for API fields, JSON payloads, or workflows where the MIME prefix is assembled separately. The source preview and file metadata stay visible for verification.',
      processing:
        'The tool reads the selected image with FileReader.readAsDataURL(file). When reading completes, event.target.result contains the full Data URL with MIME type, base64 marker, and encoded data. The raw Base64 is derived by splitting the Data URL at the comma and taking the second segment. Copy actions use navigator.clipboard.writeText() and show a short success state. The process does not require Canvas and does not upload the image.',
      modes: ['Image upload', 'Data URL output', 'Raw Base64 output', 'One-click copy', 'File size warning', 'Local encoding'],
      example: {
        title: 'Image to Base64 example',
        input: 'icon.png\nType: image/png\nSize: 12 KB',
        output: 'data:image/png;base64,iVBORw0KGgo...\nRaw Base64: iVBORw0KGgo...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-cropper': {
    zh: {
      summary:
        '图片裁剪工具用于在浏览器中对本地图片进行可视化裁剪，并导出裁剪后的 JPG 文件。适合为头像、封面图、商品主图、社交媒体配图、博客缩略图、证件材料截图、设计稿局部和演示素材快速截取指定区域。工具支持自由比例、1:1、16:9、4:3、9:16 等常用裁剪比例，实时显示裁剪区域对应的原始像素尺寸，便于控制输出清晰度和平台尺寸要求。图片读取、裁剪坐标计算、Canvas 绘制和导出全部在浏览器本地完成。',
      input:
        '上传一张图片文件后，在预览区域拖动和缩放裁剪框。用户可以选择自由裁剪，也可以选择固定比例预设。工具会读取图片的自然宽高，并根据当前显示尺寸与原始像素尺寸计算缩放比例。裁剪框完成后会显示输出宽高，帮助用户判断是否满足头像、封面、商品图或广告素材的像素规范。',
      output:
        '一张裁剪后的 JPG 图片文件。导出文件名会在原文件名后追加 -cropped.jpg。裁剪结果按照原图像素比例重新采样，输出尺寸对应用户当前选择的裁剪框在原图中的真实像素范围。导出时会填充白色背景，因此透明 PNG 裁剪后会以白底 JPG 输出，适合普通网页、文档和上传表单使用。',
      processing:
        '工具使用 react-image-crop 管理裁剪框交互，并在图片加载后记录 naturalWidth、naturalHeight 和显示尺寸。下载时根据 completedCrop 的 x、y、width、height 以及 scaleX = naturalWidth / displayedWidth、scaleY = naturalHeight / displayedHeight 计算真实像素裁剪区域。随后创建 Canvas，设置为裁剪后的真实像素尺寸，先填充白色背景，再通过 drawImage() 将原图指定区域绘制到 Canvas。最后调用 canvas.toBlob("image/jpeg", 0.95) 生成 JPG Blob 并触发下载。',
      modes: ['图片上传', '自由裁剪', '固定比例预设', '实时像素尺寸', '拖拽调整裁剪框', 'JPG 导出'],
      example: {
        title: '图片裁剪示例',
        input: 'portrait.png\n裁剪比例: 1:1\n裁剪区域: 1200 x 1200 px',
        output: 'portrait-cropped.jpg\n1200 x 1200 JPG 图片',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image Cropper visually crops local images in the browser and exports the result as a JPG file. It is useful for avatars, cover images, product photos, social media graphics, blog thumbnails, document screenshots, design-detail crops, and presentation assets. The tool supports free crop plus common aspect ratios such as 1:1, 16:9, 4:3, and 9:16. It displays the real pixel size of the selected crop area so you can meet platform size requirements and preserve enough resolution. Image reading, crop calculation, Canvas drawing, and export all run locally.',
      input:
        'Upload one image file, then drag and resize the crop rectangle in the preview area. You can use free crop or a fixed aspect-ratio preset. The tool reads the natural image dimensions and compares them with the displayed dimensions to calculate the correct pixel scale. Once the crop is completed, the output width and height are shown so you can check whether the result fits avatar, cover, product image, or ad creative requirements.',
      output:
        'A cropped JPG image file. The exported filename appends -cropped.jpg to the original base name. The crop is resampled from the original pixel data, so the output dimensions match the real pixel region selected from the source image. A white background is filled during export, so cropped transparent PNGs become white-background JPG files suitable for normal web pages, documents, and upload forms.',
      processing:
        'The tool uses react-image-crop for crop box interaction and records naturalWidth, naturalHeight, and displayed size after the image loads. On download, it calculates the real crop region using completedCrop x/y/width/height plus scaleX = naturalWidth / displayedWidth and scaleY = naturalHeight / displayedHeight. It then creates a Canvas sized to the real crop pixels, fills it white, and uses drawImage() to render the selected source region into the Canvas. Finally, canvas.toBlob("image/jpeg", 0.95) creates the JPG Blob and triggers a local download.',
      modes: ['Image upload', 'Free crop', 'Aspect ratio presets', 'Real pixel dimensions', 'Drag crop box', 'JPG export'],
      example: {
        title: 'Image crop example',
        input: 'portrait.png\nAspect ratio: 1:1\nCrop region: 1200 x 1200 px',
        output: 'portrait-cropped.jpg\n1200 x 1200 JPG image',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-to-ico': {
    zh: {
      summary:
        '图片转 ICO 工具用于在浏览器中把 PNG、JPG、WebP 等普通图片转换为 Windows / 浏览器常用的 .ico 图标文件。适合为网站 favicon、桌面快捷方式、Windows 应用、Electron 应用、PWA 安装图标、后台系统 Logo 或小程序资源准备 ICO 文件。工具支持 16、24、32、48、64、128、256 像素等常见图标尺寸，会将源图等比缩放并居中放入方形画布，再封装为标准 ICO 二进制结构。全部处理在本地完成。',
      input:
        '上传一张图片作为图标源文件，并选择目标图标尺寸。建议使用清晰、边缘简洁、主体居中的图片，最好是正方形 PNG 或高分辨率透明图。尺寸越小，细节越容易丢失；16x16 和 32x32 适合 favicon 和窗口小图标，128x128 和 256x256 更适合高分屏、桌面快捷方式或应用图标。工具会自动保持源图比例，避免拉伸变形。',
      output:
        '一个 .ico 文件。下载文件名沿用原始文件名并替换扩展名为 .ico。ICO 内包含一张按所选尺寸生成的 PNG 图像，并带有 Windows ICON 文件头和目录项，可用于网站 favicon、桌面图标或应用资源。当前工具每次生成一个尺寸的 ICO，如需多尺寸图标可分别导出不同尺寸。',
      processing:
        '工具通过 Object URL 加载本地图片，创建目标尺寸的方形 Canvas。根据 scale = min(targetSize / image.width, targetSize / image.height) 计算等比缩放比例，再计算居中偏移 nx、ny，将图片绘制到 Canvas。随后使用 canvas.toDataURL("image/png") 获取 PNG 数据并解码为 Uint8Array，手动构造 ICO 二进制：6 字节 ICONDIR 头、16 字节 ICONDIRENTRY 目录项和 PNG 数据块。最终以 Blob({ type: "image/x-icon" }) 生成文件并触发下载。',
      modes: ['图片上传', '16 到 256 像素尺寸', '等比缩放', '居中绘制', 'ICO 二进制封装', '本地下载'],
      example: {
        title: '图片转 ICO 示例',
        input: 'app-logo.png\n目标尺寸: 64 x 64',
        output: 'app-logo.ico\n包含 64 x 64 PNG 图像的 ICO 文件',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image to ICO tool converts regular images such as PNG, JPG, and WebP into .ico icon files directly in the browser. It is useful for website favicons, desktop shortcuts, Windows apps, Electron apps, PWA install icons, admin-system logos, and small application resources. The tool supports common icon sizes such as 16, 24, 32, 48, 64, 128, and 256 pixels. It scales the source image proportionally, centers it on a square canvas, and wraps the result in a standard ICO binary structure. All processing runs locally.',
      input:
        'Upload one image as the icon source and choose the target icon size. A clean, centered, high-resolution square PNG or transparent image is recommended. Smaller sizes lose detail more easily; 16x16 and 32x32 are suitable for favicons and small window icons, while 128x128 and 256x256 are better for high-DPI displays, desktop shortcuts, or app icons. The tool preserves the source aspect ratio to avoid stretching.',
      output:
        'A .ico file. The downloaded filename keeps the original base name and replaces the extension with .ico. The ICO contains one PNG image at the selected size, along with a Windows ICON file header and directory entry, making it usable for website favicons, desktop icons, or app resources. The current tool exports one size per file; export multiple sizes separately if you need several variants.',
      processing:
        'The tool loads the local image through an Object URL and creates a square Canvas at the target size. It calculates proportional scale with scale = min(targetSize / image.width, targetSize / image.height), computes centered offsets nx and ny, and draws the image into the Canvas. It then calls canvas.toDataURL("image/png"), decodes the PNG data into a Uint8Array, and manually builds ICO bytes: a 6-byte ICONDIR header, a 16-byte ICONDIRENTRY, and the PNG payload. The final Blob uses type image/x-icon and is downloaded locally.',
      modes: ['Image upload', '16 to 256 pixel sizes', 'Proportional scaling', 'Centered rendering', 'ICO binary wrapping', 'Local download'],
      example: {
        title: 'Image to ICO example',
        input: 'app-logo.png\nTarget size: 64 x 64',
        output: 'app-logo.ico\nICO file containing a 64 x 64 PNG image',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
