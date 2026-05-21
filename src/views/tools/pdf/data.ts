import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const PDF_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'pdf-merge': {
    zh: {
      summary:
        'PDF 合并工具用于在浏览器中把多个 PDF 文件按指定顺序合并为一个新 PDF。适合整理合同附件、发票、扫描件、报告章节和批量导出的单页文件，文件读取、页面复制和新文档生成都在本地完成。',
      input:
        '上传两个或更多 PDF 文件。工具会读取每个文件的页数和大小，并允许通过上移、下移、删除和继续添加来调整最终合并顺序。',
      output:
        '输出一个新的合并 PDF 文件，页面顺序与列表中的文件顺序一致。侧边统计会显示当前文件数量和总页数，合并成功后可直接下载生成文件。',
      processing:
        '使用 pdf-lib 在浏览器端逐个读取 PDF 页面，将所有页面复制到新的 PDFDocument 中，再序列化为 Blob 下载。原始文件不会上传到服务器。',
      modes: ['多 PDF 上传', '拖拽添加', '顺序调整', '页数统计', '本地合并下载'],
      example: {
        title: 'PDF 合并示例',
        input: 'contract.pdf: 4 页\ninvoice.pdf: 1 页\nappendix.pdf: 3 页',
        output: 'merged_*.pdf\n总文件: 3\n总页数: 8',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF Merge tool combines multiple PDF files into one new PDF directly in the browser. It is useful for contracts, invoices, scanned documents, report chapters, and exported single-page files. File reading, page copying, and PDF generation all run locally.',
      input:
        'Upload two or more PDF files. The tool reads each file page count and size, then lets you reorder, remove, and add more files before generating the final document.',
      output:
        'A new merged PDF file whose page order follows the file list. The settings panel shows file count and total pages, and the generated file can be downloaded after processing.',
      processing:
        'Uses pdf-lib in the browser to load each PDF, copy pages into a new PDFDocument, serialize it to a Blob, and download it. Source files are not uploaded to a server.',
      modes: ['Multiple PDF upload', 'Drag and drop', 'Order adjustment', 'Page count summary', 'Local merge download'],
      example: {
        title: 'PDF merge example',
        input: 'contract.pdf: 4 pages\ninvoice.pdf: 1 page\nappendix.pdf: 3 pages',
        output: 'merged_*.pdf\nFiles: 3\nTotal pages: 8',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'pdf-split': {
    zh: {
      summary:
        'PDF 拆分工具用于把一个多页 PDF 按页拆分为多个单页 PDF，并打包为 ZIP 下载。适合拆分扫描合同、证书、票据、资料包或需要逐页提交的文档。',
      input:
        '上传一个 PDF 文件。工具会读取文件名、大小和总页数，确认可处理后显示当前文件信息与本地处理状态。',
      output:
        '输出一个 ZIP 压缩包，内部每一页都是独立 PDF 文件，文件名包含原始 PDF 名称和页码，方便后续归档或单独发送。',
      processing:
        '使用 pdf-lib 在浏览器端加载原始 PDF，并为每一页创建新的 PDFDocument；所有单页 PDF 使用 JSZip 打包，再通过 file-saver 下载。',
      modes: ['单 PDF 上传', '逐页拆分', 'ZIP 打包', '本地处理', '继续处理下一份'],
      example: {
        title: 'PDF 拆分示例',
        input: 'handbook.pdf\n总页数: 5',
        output: 'handbook_split.zip\nhandbook_p1.pdf ... handbook_p5.pdf',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF Split tool separates a multi-page PDF into individual one-page PDF files and downloads them as a ZIP archive. It is useful for scanned contracts, certificates, receipts, document packs, and workflows that require page-by-page submission.',
      input:
        'Upload one PDF file. The tool reads the filename, size, and total page count, then displays the file information and local processing status.',
      output:
        'A ZIP archive containing one PDF per page. Each generated file includes the original PDF name and page number, making the files easy to archive or send separately.',
      processing:
        'Uses pdf-lib in the browser to load the original PDF and create a new PDFDocument for each page. The generated PDFs are packaged with JSZip and downloaded via file-saver.',
      modes: ['Single PDF upload', 'Page-by-page split', 'ZIP packaging', 'Local processing', 'Process next file'],
      example: {
        title: 'PDF split example',
        input: 'handbook.pdf\nPages: 5',
        output: 'handbook_split.zip\nhandbook_p1.pdf ... handbook_p5.pdf',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'pdf-to-image': {
    zh: {
      summary:
        'PDF 转图片工具用于把 PDF 每一页渲染为 JPG 图片。适合生成页面预览图、提取文档截图、制作资料缩略图，或把 PDF 内容转为可在图片工作流中继续处理的格式。',
      input:
        '上传一个 PDF 文件。工具会读取总页数，并在转换过程中显示当前页进度。每页按固定渲染比例绘制到 Canvas。',
      output:
        '输出每一页对应的 JPG 图片预览，可单张下载，也可将全部图片打包为 ZIP 下载。转换完成后保留页面编号，方便与原 PDF 对照。',
      processing:
        '使用 pdfjs-dist 在浏览器端解析 PDF 页面，按 2 倍缩放渲染到 Canvas，再通过 toDataURL 生成 JPEG 数据。图片数据保存在本地页面状态中。',
      modes: ['PDF 上传', '逐页渲染', 'JPG 输出', '单页下载', 'ZIP 批量下载'],
      example: {
        title: 'PDF 转图片示例',
        input: 'catalog.pdf\n总页数: 3',
        output: 'page_1.jpg\npage_2.jpg\npage_3.jpg',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PDF to Image tool renders every PDF page as a JPG image. It is useful for page previews, document screenshots, thumbnails, and converting PDF content into an image workflow.',
      input:
        'Upload one PDF file. The tool reads the total page count and shows progress while each page is rendered. Pages are drawn to Canvas at a fixed scale.',
      output:
        'JPG previews for each page. You can download a single page image or package all generated images into a ZIP archive. Page numbers are preserved for easy comparison with the original PDF.',
      processing:
        'Uses pdfjs-dist in the browser to parse PDF pages, render each page to Canvas at 2x scale, and generate JPEG data with toDataURL. Image data stays in local page state.',
      modes: ['PDF upload', 'Page rendering', 'JPG output', 'Single-page download', 'ZIP batch download'],
      example: {
        title: 'PDF to image example',
        input: 'catalog.pdf\nPages: 3',
        output: 'page_1.jpg\npage_2.jpg\npage_3.jpg',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'image-to-pdf': {
    zh: {
      summary:
        '图片转 PDF 工具用于把多张图片按列表顺序生成一个 PDF 文件。适合把照片、截图、扫描页、设计稿或资料图片整理成可归档、可发送的单个文档。',
      input:
        '上传一张或多张图片。工具会生成本地预览，支持删除、上移、下移调整页面顺序，并选择 A4 页面或按图片比例适配的输出方式。',
      output:
        '输出一个由图片组成的 PDF 文件。每张图片按当前排序写入独立页面，并按所选页面尺寸居中缩放。',
      processing:
        '使用浏览器 Object URL 创建图片预览，生成时通过 jsPDF 新建 PDF 页面，读取图片尺寸并计算缩放比例，再把图片写入 PDF 后下载。',
      modes: ['多图片上传', '预览排序', 'A4 页面', '适配图片', '本地 PDF 生成'],
      example: {
        title: '图片转 PDF 示例',
        input: 'scan_1.jpg\nscan_2.jpg\n页面尺寸: A4',
        output: 'images_to_pdf_*.pdf\n2 个页面',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Image to PDF tool creates one PDF from multiple images in list order. It is useful for photos, screenshots, scanned pages, design exports, and reference images that need to be archived or shared as a single document.',
      input:
        'Upload one or more images. The tool creates local previews, supports removing and reordering images, and lets you choose A4 pages or image-fit output.',
      output:
        'A PDF composed of the selected images. Each image is written to its own page in the current order and centered according to the selected page size.',
      processing:
        'Uses browser Object URLs for previews. During generation, jsPDF creates PDF pages, reads image dimensions, calculates scaling, writes each image into the PDF, and downloads the result.',
      modes: ['Multiple image upload', 'Preview ordering', 'A4 page', 'Image fit', 'Local PDF generation'],
      example: {
        title: 'Image to PDF example',
        input: 'scan_1.jpg\nscan_2.jpg\nPage size: A4',
        output: 'images_to_pdf_*.pdf\n2 pages',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
