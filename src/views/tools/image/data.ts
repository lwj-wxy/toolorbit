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
};
