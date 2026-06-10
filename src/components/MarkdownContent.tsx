'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { createUniqueHeadingId } from '../lib/markdown-headings';

type CodeProps = ComponentProps<'code'> & {
  node?: unknown;
};

const CodeBlock = ({ children, className, ...props }: CodeProps) => {
  const languageMatch = /language-([\w-]+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');
  const isBlockCode = Boolean(languageMatch) || codeText.includes('\n');

  if (!isBlockCode) {
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <SyntaxHighlighter
        language={languageMatch?.[1] || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'transparent',
          fontSize: '13px',
          lineHeight: '1.7',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
        }}
        wrapLongLines
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
};

const nodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    const childProps = node.props as { children?: ReactNode };
    return nodeText(childProps.children);
  }

  return '';
};

const createMarkdownComponents = (): Components => {
  const headingCounts = new Map<string, number>();

  return {
    a: ({ href, children, ...props }) => {
      const isExternalLink = typeof href === 'string' && /^https?:\/\//.test(href);
      const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (!isExternalLink || !href) return;

        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      };

      return (
        <a
          {...props}
          href={href}
          target={isExternalLink ? '_blank' : undefined}
          rel={isExternalLink ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
        >
          {children}
        </a>
      );
    },
    code: CodeBlock,
    h2: ({ children, ...props }) => (
      <h2 {...props} id={createUniqueHeadingId(nodeText(children), headingCounts)}>
        {children}
      </h2>
    ),
    pre: ({ children }) => <>{children}</>,
  };
};

export default function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents()}>
      {markdown}
    </ReactMarkdown>
  );
}
