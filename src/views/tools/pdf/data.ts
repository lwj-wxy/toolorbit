import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const PDF_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'pdf-merge': {
    zh: {
      summary:
        'PDF 合并工具用于将多个 PDF 文件按指定顺序合并为一个新文档。适合把合同与附件、扫描发票、报告章节、审核材料、单页证书或回执整理成一份便于提交、打印和归档的文件。处理在本地完成，原始文件不会离开用户设备；加密、损坏或权限受限的 PDF 可能无法正常合并。',
      input:
        '上传两个或更多 PDF 文件（支持点击选择、拖拽添加和继续追加）。工具会即时读取每个文件的页数和文件大小，并在文件列表中逐项展示。上传后可通过上移/下移按钮调整文件在最终合并结果中的排列顺序，也可删除多余文件或继续添加新文件。各个文件将严格按照当前列表顺序依次合并，列表顶部的文件排在最前面。',
      output:
        '一个按指定顺序合并后的新 PDF 文件，页面顺序与文件列表中各文件的排列顺序完全一致。侧边栏实时统计当前已添加的文件总数和累计总页数，方便在合并前确认数据完整。生成完成后通过浏览器触发下载，文件名格式为 merged_时间戳.pdf，可直接保存用于后续分发、打印或归档。',
      processing:
        '工具会按当前文件列表顺序读取每份 PDF 的页面，并把页面依次写入新的合并文档。上传时会检查文件类型，只接受 PDF；如果文件加密、损坏或结构异常，页面会给出明确提示。合并结果生成后直接下载，处理过程不需要上传文件。',
      modes: ['多 PDF 上传', '拖拽 / 点击添加', '文件顺序上移 / 下移', '页数实时统计', '本地合并下载', '加密 PDF 支持（忽略密码）'],
      example: {
        title: 'PDF 合并示例',
        input: 'contract.pdf: 4 页\ninvoice.pdf: 1 页\nappendix.pdf: 3 页',
        output: 'merged_1710000000.pdf\n包含文件: 3 个\n总页数: 8 页',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF Merge tool combines multiple PDF files into one document in the order you choose. It is useful for contracts and attachments, scanned invoices, report chapters, review packs, certificates, receipts, and forms that need to be submitted, printed, or archived as a single file. Processing stays local and source files never leave the device; encrypted, damaged, or permission-restricted PDFs may fail to merge.',
      input:
        'Upload two or more PDF files (supports click-to-select, drag-and-drop, and incremental appending). The tool reads each file\'s page count and file size instantly, displaying them item by item in the file list. After uploading, you can reorder files using the up/down buttons to control the final merge sequence, remove unwanted files, or continue adding more. Files are merged strictly in the current list order, with the topmost file appearing first in the output.',
      output:
        'A new merged PDF file with page order matching the file list sequence exactly. A sidebar panel shows the current file count and cumulative total page count in real time, allowing you to verify completeness before merging. Once processing is complete, the browser triggers a download with a filename in the format merged_timestamp.pdf, ready for distribution, printing, or archiving.',
      processing:
        'The tool reads the pages from each PDF in the current file-list order and writes them into a new merged document. Upload validation only accepts PDF files, and encrypted, damaged, or malformed files show clear errors. The merged file is downloaded after generation, with no file upload required.',
      modes: ['Multiple PDF upload', 'Drag-and-drop / click add', 'File reorder up/down', 'Real-time page count', 'Local merge download', 'Encrypted PDF support (ignore password)'],
      example: {
        title: 'PDF merge example',
        input: 'contract.pdf: 4 pages\ninvoice.pdf: 1 page\nappendix.pdf: 3 pages',
        output: 'merged_1710000000.pdf\nFiles: 3\nTotal pages: 8',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'pdf-split': {
    zh: {
      summary:
        'PDF 拆分工具用于将一个多页 PDF 按页拆成多个独立的单页 PDF，并打包为 ZIP 下载。适合把扫描合同、证书、票据、培训资料、申请材料或大型 PDF 拆成可单独归档、发送和管理的页面文件。处理在本地完成，不会上传原始文档。',
      input:
        '上传一个 PDF 文件（仅支持 PDF 格式）。工具会读取并展示文件名、文件大小和总页数信息，确认文件可处理后进入拆分流程。上传前自动校验文件类型，非 PDF 文件会弹出提示。',
      output:
        '一个 ZIP 压缩包，内部每页对应一个独立的 PDF 文件。每个文件名包含原始 PDF 名称和对应页码（如 handbook_p1.pdf、handbook_p2.pdf），便于排序和查找。ZIP 包支持解压后逐页使用，也可以批量解压后按需归档或转发。拆分完成后可选择处理下一份文件。',
      processing:
        '工具会读取上传 PDF 的页数，为每一页生成独立文件，并按页码命名后统一打包为 ZIP。非 PDF 文件会被拒绝；无法读取的文件会提示错误。拆分与打包都在本地完成，适合处理不便上传的合同、票据和内部资料。',
      modes: ['单 PDF 上传', '逐页自动拆分', 'ZIP 打包下载', '页码命名', '本地处理', '继续处理下一份'],
      example: {
        title: 'PDF 拆分示例',
        input: 'handbook.pdf (5 页)',
        output: 'handbook_split.zip\n内含: handbook_p1.pdf ~ handbook_p5.pdf',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF Split tool separates a multi-page PDF into single-page PDF files and packages them as a downloadable ZIP archive. It is useful for contracts, certificates, receipts, training materials, application documents, and large PDFs that need page-by-page archiving, sending, or management. Processing stays local and the source document is not uploaded.',
      input:
        'Upload one PDF file (PDF format only). The tool reads and displays the filename, file size, and total page count information, then confirms the file is processable before entering the split workflow. File type validation runs on upload; non-PDF files trigger an alert.',
      output:
        'A ZIP archive containing one independent PDF file per page. Each filename includes the original PDF name and corresponding page number (e.g. handbook_p1.pdf, handbook_p2.pdf), making files easy to sort and locate. After unzipping, pages can be used individually or batch-archived and forwarded as needed. An option to process another file is available after the split completes.',
      processing:
        'The tool reads the uploaded PDF, creates one independent PDF for each page, names files by page number, and packages them into a ZIP. Non-PDF files are rejected, and unreadable files show an error. Splitting and packaging both run locally, which suits contracts, receipts, and internal materials that should not be uploaded.',
      modes: ['Single PDF upload', 'Auto page-by-page split', 'ZIP archive download', 'Page-numbered naming', 'Local processing', 'Process next file'],
      example: {
        title: 'PDF split example',
        input: 'handbook.pdf (5 pages)',
        output: 'handbook_split.zip\nContents: handbook_p1.pdf ~ handbook_p5.pdf',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'pdf-to-image': {
    zh: {
      summary:
        'PDF 转图片工具用于将 PDF 的每一页转为清晰的 JPG 图片。适合生成 PDF 预览缩略图、提取合同或发票关键页面、把课件页面嵌入文档、制作设计稿预览，或在不方便预览 PDF 的环境中展示内容。支持单页下载和 ZIP 批量下载，转换在本地完成。',
      input:
        '上传一个 PDF 文件。工具会读取文件并展示总页数，转换过程中显示当前进度。每页会按高清预览规格输出，适合网页预览、资料分享和文档嵌入。',
      output:
        '每页生成一张 JPG 图片预览，可直接查看。支持两种下载方式：逐页单独下载（如 page_1.jpg），或将所有图片打包为 ZIP 批量下载。图片数据在本地生成和保存，无需上传 PDF。',
      processing:
        '工具会逐页读取 PDF 内容并生成对应 JPG 图片。转换时会显示进度；完成后可单页保存，也可一次性下载 ZIP。若 PDF 加密、损坏或页面内容过大，可能需要换用原软件另存后再转换。',
      modes: ['PDF 上传', '逐页转图片', '高清输出', 'JPG 图片', '单页下载', 'ZIP 批量下载', '进度条显示'],
      example: {
        title: 'PDF 转图片示例',
        input: 'catalog.pdf (3 页)',
        output: 'page_1.jpg  page_2.jpg  page_3.jpg\n（或 catalog_pages.zip）',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF to Image tool converts every page of a PDF into a clear JPG image. It is useful for PDF thumbnails, contract or invoice page extracts, course material images, design proofs, and environments where PDF preview is not convenient. Single-page download and ZIP batch download are supported, and conversion runs locally.',
      input:
        'Upload one PDF file. The tool reads the file, displays the total page count, and shows progress during conversion. Each page is exported at a clear preview quality suitable for web previews, sharing, and document embedding.',
      output:
        'A JPG preview is generated for each page and can be viewed directly. Two download modes are supported: individual page download, such as page_1.jpg, or a ZIP containing all generated images. Image data is created and saved locally, with no PDF upload required.',
      processing:
        'The tool reads the PDF page by page and creates a JPG image for each page. Progress is shown during conversion; after completion, images can be saved individually or downloaded together as a ZIP. Encrypted, damaged, or very large PDFs may need to be re-saved in the original software before conversion.',
      modes: ['PDF upload', 'Per-page image output', 'High-resolution output', 'JPG images', 'Single page download', 'ZIP batch download', 'Progress bar'],
      example: {
        title: 'PDF to image example',
        input: 'catalog.pdf (3 pages)',
        output: 'page_1.jpg  page_2.jpg  page_3.jpg\n(or catalog_pages.zip)',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-to-pdf': {
    zh: {
      summary:
        '图片转 PDF 工具用于将多张图片按指定顺序合成为一个 PDF 文档。适合把纸质文件照片、收据、设计稿、素材截图、扫描件、证件照片、白板照片、产品图和说明图整理成便于提交、审阅或归档的 PDF。支持 A4 固定页面和按图片比例适配两种模式，处理在本地完成。',
      input:
        '上传一张或多张图片（支持点击选择或拖拽添加）。上传后每个文件会生成本地预览，可通过上移/下移按钮调整页面顺序、删除误添加的图片或继续追加更多图片。页面尺寸提供两种选择：A4 模式（210×297mm 固定页面），图片会等比缩放后居中放置在页面中央；Fit 模式（按图片比例适配），页面尺寸根据实际图片像素尺寸自动计算（以 96 DPI 转换为毫米），确保图片填充整个页面。',
      output:
        '一个按当前排序写入的 PDF 文件，每张图片占据独立一页。A4 模式下图片居中缩放展示，适合打印和正式文档；Fit 模式下图片铺满整页不留白边，适合纯图文档和视觉素材集。生成完成后通过浏览器触发下载，文件名格式为 images_to_pdf_时间戳.pdf。',
      processing:
        '工具会按当前图片列表顺序生成 PDF，每张图片独占一页。A4 模式会等比缩放并居中放置图片；Fit 模式会按图片比例设置页面，尽量减少白边。透明图片转入 PDF 时可能使用白色底色；页面方向会根据图片宽高自动选择。',
      modes: ['多图片上传', '预览排序 / 删除', 'A4 固定页面', 'Fit 图片适配', '自动方向检测', '本地 PDF 生成'],
      example: {
        title: '图片转 PDF 示例',
        input: 'scan_1.jpg\nscan_2.jpg\n页面尺寸: A4',
        output: 'images_to_pdf_1710000000.pdf\n共 2 页',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image to PDF tool combines multiple images into a single PDF in the order you choose. It is useful for paper document photos, receipts, design drafts, screenshots, scans, ID photos, whiteboard photos, product images, and instruction images that need to be submitted, reviewed, or archived as one PDF. A4 fixed page and image-proportional fit modes are supported, with local processing.',
      input:
        'Upload one or more images (supports click-to-select and drag-and-drop). After uploading, local previews are generated for each file. You can reorder pages using the up/down buttons, remove mistakenly added images, or continue appending more. Two page size options are available: A4 mode (210×297mm fixed page), where images are proportionally scaled and centered on the page; and Fit mode (image-proportional), where page dimensions are automatically computed from the actual image pixel dimensions (converted to millimeters at 96 DPI) to ensure the image fills the entire page.',
      output:
        'A PDF file with pages written in the current sort order, each image occupying a separate page. In A4 mode, images are centered and scaled, suitable for printing and formal documents. In Fit mode, images fill the page without white borders, suitable for pure-image documents and visual asset collections. After generation, the browser triggers a download with a filename in the format images_to_pdf_timestamp.pdf.',
      processing:
        'The tool creates the PDF from the current image order, with one image per page. A4 mode scales and centers each image on a fixed page; Fit mode adjusts the page to the image ratio to reduce borders. Transparent images may use a white background in the PDF, and page orientation is selected from the image dimensions.',
      modes: ['Multiple image upload', 'Preview reorder / remove', 'A4 fixed page', 'Fit image-proportional', 'Auto orientation detection', 'Local PDF generation'],
      example: {
        title: 'Image to PDF example',
        input: 'scan_1.jpg\nscan_2.jpg\nPage size: A4',
        output: 'images_to_pdf_1710000000.pdf\n2 pages total',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
