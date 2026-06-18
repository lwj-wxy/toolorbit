import { isValidElement, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Check, ClipboardCheck, Copy, Download, FileText, FileUp, Loader2, RotateCcw, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PDFJS_WORKER_SRC = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const normalizeExtractedText = (value: string) =>
  value
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const RESUME_DATE_RANGE_PATTERN =
  /^\s*(?:19|20)\d{2}(?:[./-]\d{1,2}|年\s*\d{1,2}\s*月?)?\s*(?:[-–—~至]\s*(?:至今|present|now|(?:19|20)\d{2}(?:[./-]\d{1,2}|年\s*\d{1,2}\s*月?)?))\s*$/i;

const getTextFromNode = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextFromNode(node.props.children);
  return '';
};

const getResumeEntryParts = (value: string) => {
  const entryText = value.replace(/\s+/g, ' ').trim();
  const parts = entryText
    .split(/\s*[|｜]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length !== 3 || !RESUME_DATE_RANGE_PATTERN.test(parts[2])) return null;

  return {
    title: parts[0],
    role: parts[1],
    date: parts[2],
  };
};

const ResumeParagraph = ({ children }: { children?: ReactNode }) => {
  const entryParts = getResumeEntryParts(getTextFromNode(children));

  if (!entryParts) return <p>{children}</p>;

  return (
    <p
      data-resume-entry="true"
      className="not-prose my-3 flex w-full flex-col gap-1 text-sm leading-6 text-slate-900 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 dark:text-slate-100"
    >
      <span data-resume-entry-main="true" className="min-w-0">
        <strong data-resume-entry-title="true" className="font-semibold text-slate-950 dark:text-white">
          {entryParts.title}
        </strong>
        {entryParts.role ? (
          <span data-resume-entry-role="true" className="text-slate-700 dark:text-slate-300">
            {' | '}
            {entryParts.role}
          </span>
        ) : null}
      </span>
      <span data-resume-entry-date="true" className="shrink-0 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
        {entryParts.date}
      </span>
    </p>
  );
};

const buildCleanPdfNode = (sourceNode: HTMLElement) => {
  const pdfNode = document.createElement('article');
  pdfNode.innerHTML = sourceNode.innerHTML;
  pdfNode.style.width = '760px';
  pdfNode.style.maxWidth = '760px';
  pdfNode.style.minHeight = '0';
  pdfNode.style.padding = '38px 46px';
  pdfNode.style.background = '#ffffff';
  pdfNode.style.color = '#0f172a';
  pdfNode.style.fontFamily = 'Arial, "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
  pdfNode.style.fontSize = '14px';
  pdfNode.style.lineHeight = '1.65';
  pdfNode.style.boxShadow = 'none';
  pdfNode.style.border = '0';

  const styledNodes = Array.from(pdfNode.querySelectorAll<HTMLElement>('*'));
  styledNodes.forEach((node) => {
    node.removeAttribute('class');
    node.removeAttribute('style');
    node.style.color = '#0f172a';
    node.style.backgroundColor = 'transparent';
    node.style.borderColor = '#cbd5e1';
    node.style.boxShadow = 'none';
    node.style.fontFamily = 'Arial, "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
  });

  pdfNode.querySelectorAll<HTMLElement>('h1').forEach((node) => {
    node.style.margin = '0 0 8px';
    node.style.textAlign = 'center';
    node.style.fontSize = '30px';
    node.style.lineHeight = '1.2';
    node.style.fontWeight = '700';
  });

  pdfNode.querySelectorAll<HTMLElement>('h2').forEach((node) => {
    node.style.margin = '24px 0 9px';
    node.style.paddingBottom = '0';
    node.style.borderBottom = '0';
    node.style.fontSize = '17px';
    node.style.lineHeight = '1.35';
    node.style.fontWeight = '700';
  });

  pdfNode.querySelectorAll<HTMLElement>('h3').forEach((node) => {
    node.style.margin = '14px 0 6px';
    node.style.fontSize = '15px';
    node.style.fontWeight = '700';
  });

  pdfNode.querySelectorAll<HTMLElement>('p').forEach((node) => {
    node.style.margin = '7px 0';
  });

  pdfNode.querySelectorAll<HTMLElement>('ul, ol').forEach((node) => {
    node.style.margin = '7px 0 10px 20px';
    node.style.padding = '0';
    node.style.listStyle = 'none';
  });

  pdfNode.querySelectorAll<HTMLElement>('li').forEach((node) => {
    const listNode = node.parentElement;
    const orderedList = listNode?.tagName.toLowerCase() === 'ol';
    const listItems = listNode ? Array.from(listNode.children).filter((child) => child.tagName.toLowerCase() === 'li') : [];
    const itemIndex = Math.max(0, listItems.indexOf(node));
    const marker = document.createElement('span');
    const content = document.createElement('span');

    marker.textContent = orderedList ? `${itemIndex + 1}.` : '•';
    marker.setAttribute('aria-hidden', 'true');
    marker.style.display = 'inline-flex';
    marker.style.width = '12px';
    marker.style.flex = '0 0 12px';
    marker.style.justifyContent = 'center';
    marker.style.color = '#0f172a';
    marker.style.fontSize = orderedList ? '12px' : '13px';
    marker.style.lineHeight = '1.65';

    content.style.display = 'block';
    content.style.minWidth = '0';
    content.style.flex = '1 1 auto';

    Array.from(node.childNodes).forEach((childNode) => {
      content.appendChild(childNode);
    });

    node.append(marker, content);
    node.style.display = 'flex';
    node.style.alignItems = 'flex-start';
    node.style.gap = '8px';
    node.style.margin = '4px 0';
    node.style.padding = '0';
    node.style.listStyle = 'none';
  });

  pdfNode.querySelectorAll<HTMLElement>('a').forEach((node) => {
    node.style.color = '#0f172a';
    node.style.textDecoration = 'none';
  });

  pdfNode.querySelectorAll('hr').forEach((node) => {
    node.remove();
  });

  pdfNode.querySelectorAll<HTMLElement>('[data-resume-entry="true"]').forEach((node) => {
    node.style.display = 'flex';
    node.style.flexDirection = 'row';
    node.style.alignItems = 'baseline';
    node.style.justifyContent = 'space-between';
    node.style.gap = '18px';
    node.style.margin = '10px 0 8px';
  });

  pdfNode.querySelectorAll<HTMLElement>('[data-resume-entry-main="true"]').forEach((node) => {
    node.style.minWidth = '0';
  });

  pdfNode.querySelectorAll<HTMLElement>('[data-resume-entry-title="true"]').forEach((node) => {
    node.style.fontWeight = '700';
  });

  pdfNode.querySelectorAll<HTMLElement>('[data-resume-entry-role="true"]').forEach((node) => {
    node.style.color = '#334155';
  });

  pdfNode.querySelectorAll<HTMLElement>('[data-resume-entry-date="true"]').forEach((node) => {
    node.style.flex = '0 0 auto';
    node.style.whiteSpace = 'nowrap';
    node.style.color = '#475569';
    node.style.fontSize = '12px';
    node.style.fontWeight = '600';
  });

  let isHeaderBlock = true;
  Array.from(pdfNode.children).forEach((node) => {
    const element = node as HTMLElement;
    if (element.tagName.toLowerCase() === 'h2') {
      isHeaderBlock = false;
    }
    if (isHeaderBlock && element.tagName.toLowerCase() === 'p') {
      element.style.textAlign = 'center';
      element.style.margin = '5px 0';
    }
  });

  return pdfNode;
};

export default function ResumeOptimizer() {
  const { t, i18n } = useTranslation();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [roleType, setRoleType] = useState('general');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [targetLanguage, setTargetLanguage] = useState(i18n.language?.startsWith('zh') ? 'zh' : 'en');
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLElement>(null);

  const roleOptions = [
    { value: 'general', label: t('tools.ai-resume-optimizer.roleGeneral') || 'General role' },
    { value: 'product', label: t('tools.ai-resume-optimizer.roleProduct') || 'Product' },
    { value: 'operations', label: t('tools.ai-resume-optimizer.roleOperations') || 'Operations' },
    { value: 'frontend', label: t('tools.ai-resume-optimizer.roleFrontend') || 'Frontend' },
    { value: 'backend', label: t('tools.ai-resume-optimizer.roleBackend') || 'Backend' },
    { value: 'data', label: t('tools.ai-resume-optimizer.roleData') || 'Data analysis' },
    { value: 'design', label: t('tools.ai-resume-optimizer.roleDesign') || 'Design' },
    { value: 'marketing', label: t('tools.ai-resume-optimizer.roleMarketing') || 'Marketing' },
    { value: 'ecommerce', label: t('tools.ai-resume-optimizer.roleEcommerce') || 'E-commerce' },
  ];

  const templateOptions = [
    { value: 'classic', label: t('tools.ai-resume-optimizer.templateClassic') || 'Classic resume' },
    { value: 'compact', label: t('tools.ai-resume-optimizer.templateCompact') || 'Compact resume' },
    { value: 'modern', label: t('tools.ai-resume-optimizer.templateModern') || 'Modern resume' },
  ];

  useEffect(() => {
    if (!result) return;
    resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const extractPdfText = async (file: File) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((textItem: any) => ('str' in textItem ? textItem.str : ''))
        .join(' ');
      pageTexts.push(pageText);
    }

    return normalizeExtractedText(pageTexts.join('\n\n'));
  };

  const extractDocxText = async (file: File) => {
    const { default: JSZip } = await import('jszip');
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const documentXml = await zip.file('word/document.xml')?.async('string');
    if (!documentXml) throw new Error(t('tools.ai-resume-optimizer.docxParseError') || 'Could not read document.xml from this DOCX file.');

    const documentNode = new DOMParser().parseFromString(documentXml, 'application/xml');
    const paragraphNodes = Array.from(documentNode.getElementsByTagName('w:p'));
    const paragraphs = paragraphNodes
      .map((paragraphNode) =>
        Array.from(paragraphNode.getElementsByTagName('w:t'))
          .map((textNode) => textNode.textContent || '')
          .join(''),
      )
      .filter(Boolean);

    return normalizeExtractedText(paragraphs.join('\n'));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setParsing(true);
    setParseError('');
    setFileName(selectedFile.name);

    try {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const extractedText =
        selectedFile.type === 'application/pdf' || fileExtension === 'pdf'
          ? await extractPdfText(selectedFile)
          : selectedFile.type === DOCX_MIME_TYPE || fileExtension === 'docx'
            ? await extractDocxText(selectedFile)
            : '';

      if (!extractedText || extractedText.length < 80) {
        setParseError(t('tools.ai-resume-optimizer.shortParseWarning') || 'The extracted text looks short. Check the preview or paste the resume text manually.');
      }

      setResumeText(extractedText);
    } catch (parseFailure: any) {
      setParseError(parseFailure.message || (t('tools.ai-resume-optimizer.parseFailed') || 'File parsing failed. Paste the resume text manually.'));
    } finally {
      setParsing(false);
      event.target.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() || loading) return;

    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await fetch('/api/ai-resume-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          roleType,
          templateStyle,
          targetLanguage,
          language: i18n.language,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || 'AI service is currently unavailable.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Reader initialization failed');

      let isDone = false;
      while (!isDone) {
        const { value, done: streamDone } = await reader.read();
        isDone = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const responseData = JSON.parse(line.slice(6));
                if (responseData.error) throw new Error(responseData.error);
                if (responseData.content) {
                  setResult((previousResult) => previousResult + responseData.content);
                }
              } catch (parseFailure) {
                if (parseFailure instanceof Error && parseFailure.message !== 'Unexpected end of JSON input') {
                  console.error('Parse error:', parseFailure);
                }
              }
            }
          }
        }
      }
    } catch (generateFailure: any) {
      setError(generateFailure.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (copyText: string, copyKey: string) => {
    navigator.clipboard.writeText(copyText);
    setCopied(copyKey);
    setTimeout(() => setCopied(''), 2000);
  };

  const downloadResumePdf = async () => {
    if (!result || downloadingPdf) return;
    const resumePreview = resumePreviewRef.current;
    if (!resumePreview) return;

    setDownloadingPdf(true);

    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.left = '-10000px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '760px';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.color = '#0f172a';
    pdfContainer.style.zIndex = '-1';

    const pdfNode = buildCleanPdfNode(resumePreview);
    pdfContainer.appendChild(pdfNode);
    document.body.appendChild(pdfContainer);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const pdfTitle = t('tools.ai-resume-optimizer.pdfTitle') || 'optimized-resume';
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 32;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const canvas = await html2canvas(pdfNode, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: pdfNode.scrollWidth,
      });
      const pageCanvas = document.createElement('canvas');
      const pageCanvasContext = pageCanvas.getContext('2d');
      if (!pageCanvasContext) throw new Error('PDF canvas initialization failed.');

      const pageCanvasHeight = Math.floor((contentHeight / contentWidth) * canvas.width);
      pageCanvas.width = canvas.width;

      for (let sourceTop = 0, pageIndex = 0; sourceTop < canvas.height; sourceTop += pageCanvasHeight, pageIndex += 1) {
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceTop);
        pageCanvas.height = sliceHeight;
        pageCanvasContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCanvasContext.drawImage(canvas, 0, sourceTop, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        if (pageIndex > 0) pdf.addPage();

        const pageImageData = pageCanvas.toDataURL('image/png');
        const pageImageHeight = (sliceHeight * contentWidth) / canvas.width;
        pdf.addImage(pageImageData, 'PNG', margin, margin, contentWidth, pageImageHeight);
      }

      pdf.save(`${pdfTitle}-${Date.now()}.pdf`);
    } catch (pdfFailure) {
      console.error('PDF download failed:', pdfFailure);
      setError(t('tools.ai-resume-optimizer.pdfDownloadFailed') || 'PDF download failed. Try copying the resume instead.');
    } finally {
      document.body.removeChild(pdfContainer);
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.ai-resume-optimizer.title') || 'AI Resume Optimizer'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ai-resume-optimizer.description') || 'Improve resume wording, structure, and keyword fit from resume text and a target job description.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {t('tools.ai-resume-optimizer.uploadTitle') || 'Upload resume file'}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {t('tools.ai-resume-optimizer.uploadHint') || 'PDF and DOCX are parsed in your browser. Scanned PDFs may need manual paste.'}
                  </p>
                </div>
              </div>
              <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                {parsing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                {parsing ? (t('tools.ai-resume-optimizer.parsing') || 'Parsing...') : (t('tools.ai-resume-optimizer.chooseFile') || 'Choose file')}
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {fileName ? (
              <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('tools.ai-resume-optimizer.currentFile') || 'Current file'}: {fileName}
              </p>
            ) : null}
            {parseError ? (
              <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.ai-resume-optimizer.resumeText') || 'Extracted resume text'}
              </label>
              <span className="text-xs text-slate-400">{resumeText.length}</span>
            </div>
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder={t('tools.ai-resume-optimizer.resumePlaceholder') || 'Upload a PDF/DOCX resume or paste resume text here.'}
              className="h-56 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.ai-resume-optimizer.jobDescription') || 'Target job description'}
              </label>
              <span className="text-xs text-slate-400">{jobDescription.length}</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder={t('tools.ai-resume-optimizer.jdPlaceholder') || 'Paste the job description here. Leave blank for a general resume review.'}
              className="h-40 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t('common.moreOptions') || (i18n.language?.startsWith('zh') ? '更多选项（可选）' : 'More options (optional)')}
            </summary>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('tools.ai-resume-optimizer.roleType') || 'Role type'}
                </label>
                <select
                  value={roleType}
                  onChange={(event) => setRoleType(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {roleOptions.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('tools.ai-resume-optimizer.templateStyle') || 'Resume layout'}
                </label>
                <select
                  value={templateStyle}
                  onChange={(event) => setTemplateStyle(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {templateOptions.map((templateOption) => (
                    <option key={templateOption.value} value={templateOption.value}>
                      {templateOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('tools.ai-resume-optimizer.targetLanguage') || 'Output language'}
                </label>
                <select
                  value={targetLanguage}
                  onChange={(event) => setTargetLanguage(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-xs leading-5 text-cyan-900 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-100">
              {t('tools.ai-resume-optimizer.privacyNote') ||
                'File text is extracted locally first. When you click generate, the resume text and job description are sent to the AI service. Remove ID numbers, addresses, phone numbers, and other sensitive details before generating.'}
            </div>
          </details>

          <button
            onClick={handleGenerate}
            disabled={!resumeText.trim() || loading || parsing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('tools.ai-resume-optimizer.generating') || 'Generating resume...'}
              </>
            ) : (
              <>
                <Briefcase className="h-5 w-5" />
                {t('tools.ai-resume-optimizer.generateBtn') || 'Generate optimized resume'}
              </>
            )}
          </button>
        </section>

        <section ref={resultSectionRef} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                {t('tools.ai-resume-optimizer.resultTitle') || 'Optimized resume'}
              </h2>
            </div>
            {result ? (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={downloadResumePdf}
                  disabled={downloadingPdf}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {downloadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {downloadingPdf ? (t('tools.ai-resume-optimizer.downloadingPdf') || 'Preparing PDF...') : (t('tools.ai-resume-optimizer.downloadPdf') || 'Download PDF')}
                </button>
                <button
                  onClick={() => copyToClipboard(result, 'all')}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {copied === 'all' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'all' ? (t('common.copied') || 'Copied') : (t('tools.ai-resume-optimizer.copyResume') || 'Copy resume')}
                </button>
              </div>
            ) : null}
          </div>

          <div
            className={`min-h-[180px] overflow-y-auto rounded-xl border p-5 ${
              result
                ? 'border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-950'
                : 'flex items-center justify-center border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500'
            }`}
          >
            {error ? (
              <div className="flex flex-col items-center gap-2 text-red-500 dark:text-red-400">
                <RotateCcw className="h-8 w-8" />
                <p>{error}</p>
              </div>
            ) : result ? (
              <motion.div
                ref={resumePreviewRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`prose prose-slate mx-auto min-h-[920px] w-full max-w-[760px] bg-white px-8 py-10 text-[13.5px] leading-6 shadow-sm ring-1 ring-slate-200 dark:prose-invert dark:bg-[#282c34] dark:ring-slate-700 prose-headings:font-semibold prose-h1:mb-1 prose-h1:text-center prose-h1:text-3xl prose-h1:tracking-tight prose-h2:mt-7 prose-h2:mb-3 prose-h2:text-base prose-h2:uppercase prose-h2:tracking-wide prose-p:my-2 prose-ul:my-2 prose-li:my-1 [&_h1+p]:text-center [&_h1+p+p]:text-center ${
                  templateStyle === 'compact'
                    ? 'px-7 py-8 text-[13px] leading-5 prose-h2:mt-5 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5'
                    : templateStyle === 'modern'
                      ? 'border-l-4 border-cyan-500 prose-h1:text-left prose-h2:text-cyan-700 dark:prose-h2:text-cyan-300'
                      : ''
                }`}
              >
                <Markdown remarkPlugins={[remarkGfm]} components={{ p: ResumeParagraph, hr: () => null }}>
                  {result}
                </Markdown>
              </motion.div>
            ) : (
              <div className="text-center">
                <ClipboardCheck className="mx-auto mb-3 h-8 w-8 opacity-20" />
                <p>{t('tools.ai-resume-optimizer.waiting') || 'Upload or paste a resume to begin.'}</p>
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
