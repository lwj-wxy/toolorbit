import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const PDF_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'pdf-merge': {
    zh: {
      summary:
        'PDF 合并工具用于在浏览器中将多个 PDF 文件按指定顺序合并为一个新 PDF 文档。适合将分批次导出的合同及其附件合并为完整文档、把多张扫描发票整合为一份财务凭证、将分开保存的报告章节拼接为统一文件、为审核或归档整理多个相关材料，以及将批量导出的单页证书、回执或表格组合成便于提交的打包文件。工具基于 pdf-lib 库读取每个 PDF 文件的全部页面并逐一复制到新文档中，所有文件读取、页面重组和 PDF 生成均在本地浏览器完成，原始文件不会离开用户设备。',
      input:
        '上传两个或更多 PDF 文件（支持点击选择、拖拽添加和继续追加）。工具会即时读取每个文件的页数和文件大小，并在文件列表中逐项展示。上传后可通过上移/下移按钮调整文件在最终合并结果中的排列顺序，也可删除多余文件或继续添加新文件。各个文件将严格按照当前列表顺序依次合并，列表顶部的文件排在最前面。',
      output:
        '一个按指定顺序合并后的新 PDF 文件，页面顺序与文件列表中各文件的排列顺序完全一致。侧边栏实时统计当前已添加的文件总数和累计总页数，方便在合并前确认数据完整。生成完成后通过浏览器触发下载，文件名格式为 merged_时间戳.pdf，可直接保存用于后续分发、打印或归档。',
      processing:
        '基于 pdf-lib 库在浏览器端执行全部合并操作。流程：对列表中的每个 PDF 文件，通过 PDFDocument.load(file.arrayBuffer(), { ignoreEncryption: true }) 加载并读取文档结构，再通过 mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices()) 提取该文件全部页面，逐页调用 mergedPdf.addPage() 追加到新文档末尾。所有文件合并完成后，通过 mergedPdf.save() 序列化为字节数组，以 new Blob(bytes, { type: "application/pdf" }) 构造 Blob，再通过 file-saver 的 saveAs() 触发浏览器下载。上传时自动校验文件类型（仅接受 application/pdf），解析异常会弹出明确提示。',
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
        'The PDF Merge tool combines multiple PDF files into a single new PDF document in a specified order, directly in the browser. Suitable for combining batch-exported contracts with their attachments into complete documents, consolidating multiple scanned invoices into a single financial record, stitching separately saved report chapters into one unified file, organizing related materials for review or archiving, and assembling batch-exported single-page certificates, receipts, or forms into a ready-to-submit package. Based on the pdf-lib library, the tool reads all pages from each PDF file and copies them one by one into a new document. All file reading, page reorganization, and PDF generation run locally in the browser; source files never leave the device.',
      input:
        'Upload two or more PDF files (supports click-to-select, drag-and-drop, and incremental appending). The tool reads each file\'s page count and file size instantly, displaying them item by item in the file list. After uploading, you can reorder files using the up/down buttons to control the final merge sequence, remove unwanted files, or continue adding more. Files are merged strictly in the current list order, with the topmost file appearing first in the output.',
      output:
        'A new merged PDF file with page order matching the file list sequence exactly. A sidebar panel shows the current file count and cumulative total page count in real time, allowing you to verify completeness before merging. Once processing is complete, the browser triggers a download with a filename in the format merged_timestamp.pdf, ready for distribution, printing, or archiving.',
      processing:
        'All merging runs in the browser via the pdf-lib library. Process: for each PDF file in the list, PDFDocument.load(file.arrayBuffer(), { ignoreEncryption: true }) loads and reads the document structure; then mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices()) extracts all pages from that file, and mergedPdf.addPage() appends each page to the end of the new document. After all files are merged, mergedPdf.save() serializes the document to a byte array, a Blob is created via new Blob(bytes, { type: "application/pdf" }), and file-saver\'s saveAs() triggers the browser download. File type validation on upload (application/pdf only); parse errors surface with clear alert messages.',
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
        'PDF 拆分工具用于将一个多页 PDF 文件按页拆分为多个独立的单页 PDF 文件，并打包为 ZIP 压缩包下载。适合将扫描好的多页合同按页拆开以便分别归档或发送、把批量扫描的证书和票据逐页提取后存入独立档案、将培训教材或资料手册拆分为单页方便按需分发某一章节、为需要逐页提交的政府表格或申请材料分别准备独立文件，以及从大型 PDF 文档中提取指定页面用于特定用途。工具基于 pdf-lib 逐页创建新 PDFDocument，通过 JSZip 将生成的文件统一打包，所有处理在浏览器本地完成。',
      input:
        '上传一个 PDF 文件（仅支持 PDF 格式）。工具会读取并展示文件名、文件大小和总页数信息，确认文件可处理后进入拆分流程。上传前自动校验文件类型，非 PDF 文件会弹出提示。',
      output:
        '一个 ZIP 压缩包，内部每页对应一个独立的 PDF 文件。每个文件名包含原始 PDF 名称和对应页码（如 handbook_p1.pdf、handbook_p2.pdf），便于排序和查找。ZIP 包支持解压后逐页使用，也可以批量解压后按需归档或转发。拆分完成后可选择处理下一份文件。',
      processing:
        '基于 pdf-lib + JSZip + file-saver 在浏览器端完成全部操作。流程：通过 PDFDocument.load(file.arrayBuffer()) 加载原始 PDF；遍历每一页（for i = 0; i < totalPages; i++），对每页创建新的 PDFDocument.create()，通过 newDoc.copyPages(originalDoc, [i]) 复制当前页，调用 newDoc.addPage() 添加并保存为字节数组；将所有单页 PDF 字节数组通过 zip.file(`{name}_p{i+1}.pdf`, bytes) 加入 ZIP；最后通过 zip.generateAsync({ type: "blob" }) 生成 ZIP Blob，以 saveAs() 触发下载。',
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
        'The PDF Split tool separates a multi-page PDF into individual single-page PDF files and packages them as a downloadable ZIP archive. Suitable for splitting scanned multi-page contracts into individual pages for separate archiving or sending, extracting batch-scanned certificates and receipts page by page into independent files, breaking training materials or reference handbooks into single pages for selective distribution, preparing independent files for government forms or application materials that require page-by-page submission, and extracting specific pages from large PDF documents for targeted use. Based on pdf-lib for per-page PDFDocument creation and JSZip for packaging, all processing runs locally in the browser.',
      input:
        'Upload one PDF file (PDF format only). The tool reads and displays the filename, file size, and total page count information, then confirms the file is processable before entering the split workflow. File type validation runs on upload; non-PDF files trigger an alert.',
      output:
        'A ZIP archive containing one independent PDF file per page. Each filename includes the original PDF name and corresponding page number (e.g. handbook_p1.pdf, handbook_p2.pdf), making files easy to sort and locate. After unzipping, pages can be used individually or batch-archived and forwarded as needed. An option to process another file is available after the split completes.',
      processing:
        'All operations run in the browser via pdf-lib, JSZip, and file-saver. Process: load the original PDF with PDFDocument.load(file.arrayBuffer()); iterate through every page (for i = 0; i < totalPages; i++), for each page create a new PDFDocument.create(), copy the current page via newDoc.copyPages(originalDoc, [i]), add it with newDoc.addPage(), and save to bytes; add each single-page PDF byte array to the ZIP via zip.file(`{name}_p{i+1}.pdf`, bytes); finally generate the ZIP Blob with zip.generateAsync({ type: "blob" }) and trigger download via saveAs().',
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
        'PDF 转图片工具用于将 PDF 文档的每一页渲染为高清晰 JPG 图片。适合为 PDF 生成网页预览缩略图、将合同和发票中的关键页面提取为截图用于快速分享、把演讲资料和课件页面转为图片格式嵌入幻灯片或文档、为平面设计和印刷品制作页面预览稿供客户确认，以及在不支持 PDF 预览的环境中将文档内容转为通用图片格式展示。工具基于 pdfjs-dist 解析 PDF 并以 2 倍分辨率渲染到 Canvas，导出 90% 质量的 JPEG，支持单页下载和 ZIP 批量打包。所有渲染在浏览器本地完成。',
      input:
        '上传一个 PDF 文件。工具会自动设置 pdfjs-dist 的 Worker 路径（pdfjs.GlobalWorkerOptions.workerSrc），然后读取文件并展示总页数。转换过程中显示实时进度条（当前页/总页数），每页按 2 倍缩放比例（scale: 2.0）渲染，确保输出图片在不同分辨率屏幕上有足够的清晰度。',
      output:
        '每页生成一张 JPG 图片预览（JPEG 格式，90% 质量），在浏览器中可直接查看。支持两种下载方式：逐页单独下载（每张图片保留对应页码命名如 page_1.jpg），以及将所有生成的图片打包为一个 ZIP 文件批量下载。图片数据在浏览器端生成和存储，无需服务端参与。',
      processing:
        '基于 pdfjs-dist 在浏览器端解析并渲染 PDF 页面。流程：通过 pdfjsLib.getDocument(file) 加载 PDF 文档；遍历每一页，对每页调用 page.getViewport({ scale: 2.0 }) 获取 2 倍分辨率的视口，创建离屏 Canvas 并设置宽高匹配视口尺寸；通过 page.render({ canvasContext, viewport, canvas }) 将页面内容渲染到 Canvas；渲染完成后通过 canvas.toDataURL("image/jpeg", 0.9) 生成 90% 质量的 JPEG Data URL。批量下载时，通过 JSZip 将每页图片以 Base64 格式（去除 data: 前缀）写入 ZIP 文件，再通过 file-saver 触发下载。',
      modes: ['PDF 上传', '逐页 Canvas 渲染', '2x 分辨率', 'JPEG 90% 质量', '单页下载', 'ZIP 批量下载', '进度条显示'],
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
        'The PDF to Image tool renders every page of a PDF document as a high-resolution JPG image directly in the browser. Suitable for generating web page preview thumbnails for PDFs, extracting key pages from contracts and invoices as screenshots for quick sharing, converting presentation and course material pages into image format for embedding in slides or documents, creating page proofs for graphic design and print materials for client approval, and displaying document content as a universal image format in environments that lack PDF preview support. Based on pdfjs-dist for PDF parsing and 2x-resolution Canvas rendering, exporting 90%-quality JPEG images with single-page download and ZIP batch packaging. All rendering runs locally in the browser.',
      input:
        'Upload one PDF file. The tool sets the pdfjs-dist worker path (pdfjs.GlobalWorkerOptions.workerSrc) automatically, then reads the file and displays the total page count. A real-time progress bar (current page / total pages) updates during conversion. Each page is rendered at 2x scale (scale: 2.0) to ensure output images have sufficient clarity across different screen resolutions.',
      output:
        'A JPG image preview is generated for each page (JPEG format, 90% quality), viewable directly in the browser. Two download modes are supported: individual per-page download (each image retains the corresponding page number in the filename, e.g. page_1.jpg), and batch download where all generated images are packaged into a single ZIP file. All image data is generated and stored in the browser; no server involvement is needed.',
      processing:
        'Parses and renders PDF pages in the browser via pdfjs-dist. Process: loads the PDF document with pdfjsLib.getDocument(file); iterates through every page, calling page.getViewport({ scale: 2.0 }) to obtain a 2x-resolution viewport; creates an off-screen Canvas with dimensions matching the viewport; renders page content to the Canvas via page.render({ canvasContext, viewport, canvas }); after rendering, generates a 90%-quality JPEG Data URL via canvas.toDataURL("image/jpeg", 0.9). For batch download, JSZip packages each page\'s Base64 image data (after stripping the data: prefix) into a ZIP file, then file-saver triggers the download.',
      modes: ['PDF upload', 'Per-page Canvas rendering', '2x resolution', 'JPEG 90% quality', 'Single page download', 'ZIP batch download', 'Progress bar'],
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
        '图片转 PDF 工具用于将多张图片按指定顺序合成为一个 PDF 文档。适合将手机拍摄的纸质文件或收据照片转换为可归档的 PDF、把设计稿和素材截图整理成单一文档供客户审阅、将扫描件和身份证件照片打包为正式文件用于线上提交、把板书和会议白板照片整理成会议纪要附件，以及将产品照片和说明图片组合为产品手册或目录。工具基于 jsPDF 创建 PDF 页面，提供 A4 固定尺寸和按图片比例自适应两种页面模式，自动计算居中缩放比例，所有处理在浏览器本地完成。',
      input:
        '上传一张或多张图片（支持点击选择或拖拽添加）。上传后每个文件会生成本地预览，可通过上移/下移按钮调整页面顺序、删除误添加的图片或继续追加更多图片。页面尺寸提供两种选择：A4 模式（210×297mm 固定页面），图片会等比缩放后居中放置在页面中央；Fit 模式（按图片比例适配），页面尺寸根据实际图片像素尺寸自动计算（以 96 DPI 转换为毫米），确保图片填充整个页面。',
      output:
        '一个按当前排序写入的 PDF 文件，每张图片占据独立一页。A4 模式下图片居中缩放展示，适合打印和正式文档；Fit 模式下图片铺满整页不留白边，适合纯图文档和视觉素材集。生成完成后通过浏览器触发下载，文件名格式为 images_to_pdf_时间戳.pdf。',
      processing:
        '基于 jsPDF 库在浏览器端创建 PDF 文档。流程：对每张图片，先通过离屏 Canvas 重新绘制以去除 EXIF 旋转信息并获取标准化位图（PNG 保留 PNG 格式，其他格式渲染为白色背景的 JPEG 92% 质量）；A4 模式使用硬编码 210×297mm 页面尺寸；Fit 模式通过 width = imagePx × (25.4 / 96) 将像素转换为毫米；通过 ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) 计算等比缩放比例，再通过 x = (pageWidth - scaledWidth) / 2 计算居中位移；通过 pdf.addImage() 将图片写入页面（使用 "FAST" 压缩模式）。自动检测页面方向：宽大于高时使用横版，否则使用竖版。',
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
        'The Image to PDF tool combines multiple images into a single PDF document in a specified order, directly in the browser. Suitable for converting phone-captured paper documents and receipt photos into archivable PDFs, organizing design drafts and reference screenshots into a single document for client review, packaging scanned pages and ID photos into a formal file for online submission, compiling whiteboard and meeting board photos into meeting minutes attachments, and assembling product photos and instruction images into product handbooks or catalogs. Based on jsPDF for PDF page creation, offering both A4 fixed-size and image-proportional-fit page modes with automatic centered scaling. All processing runs locally in the browser.',
      input:
        'Upload one or more images (supports click-to-select and drag-and-drop). After uploading, local previews are generated for each file. You can reorder pages using the up/down buttons, remove mistakenly added images, or continue appending more. Two page size options are available: A4 mode (210×297mm fixed page), where images are proportionally scaled and centered on the page; and Fit mode (image-proportional), where page dimensions are automatically computed from the actual image pixel dimensions (converted to millimeters at 96 DPI) to ensure the image fills the entire page.',
      output:
        'A PDF file with pages written in the current sort order, each image occupying a separate page. In A4 mode, images are centered and scaled, suitable for printing and formal documents. In Fit mode, images fill the page without white borders, suitable for pure-image documents and visual asset collections. After generation, the browser triggers a download with a filename in the format images_to_pdf_timestamp.pdf.',
      processing:
        'Creates PDF documents in the browser via the jsPDF library. Process: for each image, first redraw onto an off-screen Canvas to strip EXIF orientation and obtain a normalized bitmap (PNGs retain PNG format; other formats render as white-background JPEG at 92% quality). In A4 mode, uses hardcoded 210×297mm page dimensions. In Fit mode, converts pixels to millimeters via width = imagePx × (25.4 / 96). Scaling is computed via ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) to preserve aspect ratio, with centering via x = (pageWidth - scaledWidth) / 2. Images are written to pages via pdf.addImage() using "FAST" compression. Page orientation is auto-detected: landscape when width exceeds height, portrait otherwise.',
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
