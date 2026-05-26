'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import type { MouseEvent } from 'react';
import remarkGfm from 'remark-gfm';

const markdownComponents: Components = {
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
};

export default function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {markdown}
    </ReactMarkdown>
  );
}
