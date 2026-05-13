import type { Metadata } from 'next';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import path from 'path';
import { BLOG_POSTS } from '../../../constants/blogData';
import { blogPostMetadata } from '../../../lib/metadata';
import { blogPostJsonLd } from '../../../lib/structured-data';
import JsonLd from '../../../components/JsonLd';
import BlogPost from '../../../views/BlogPost';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return blogPostMetadata(slug);
}

async function readInitialMarkdown(slug: string) {
  const articlePath = path.join(process.cwd(), 'public', 'articles', 'en', `${slug}.md`);

  try {
    return await fs.readFile(articlePath, 'utf-8');
  } catch {
    return '';
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const initialMarkdown = await readInitialMarkdown(slug);

  return (
    <>
      <JsonLd id={`structured-data-blog-${slug}`} data={blogPostJsonLd(slug)} />
      <BlogPost slug={slug} initialMarkdown={initialMarkdown} />
    </>
  );
}
