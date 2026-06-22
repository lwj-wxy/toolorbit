'use client';

import { BookOpenCheck, CheckCircle2, Code2, History, Mail, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { TOOL_ORBIT_EDITORIAL_TEAM } from '../data/authors';
import { BRAND_CONTACT_EMAIL } from '../data/brand';

export default function About() {
  const { t } = useTranslation();
  const trustItems = [
    {
      icon: ShieldCheck,
      title: t('about.trust.privacy.title', { defaultValue: 'Local-first privacy' }),
      description: t('about.trust.privacy.description', {
        defaultValue:
          'Wherever possible, tools process files, text, and code in your browser instead of uploading them to ToolOrbit servers.',
      }),
    },
    {
      icon: Code2,
      title: t('about.trust.technical.title', { defaultValue: 'Practical technical review' }),
      description: t('about.trust.technical.description', {
        defaultValue:
          'Tool pages and guides are written around real workflows, tested with common edge cases, and updated when browser APIs or tool behavior changes.',
      }),
    },
    {
      icon: CheckCircle2,
      title: t('about.trust.boundaries.title', { defaultValue: 'Clear AI boundaries' }),
      description: t('about.trust.boundaries.description', {
        defaultValue:
          'AI-assisted tools are labeled through the interface and should be reviewed by users before professional, legal, financial, or security decisions.',
      }),
    },
    {
      icon: RefreshCw,
      title: t('about.trust.maintenance.title', { defaultValue: 'Maintained content' }),
      description: t('about.trust.maintenance.description', {
        defaultValue:
          'We keep core tools, metadata, structured data, and documentation aligned so users and crawlers can understand what each page is for.',
      }),
    },
  ];
  const caseItems = [
    {
      title: t('about.cases.case1.title', { defaultValue: 'Developer debugging sessions' }),
      description: t('about.cases.case1.description', {
        defaultValue:
          'Readers use JSON formatting, text diff, URL encoding, timestamps, and regex tools together when checking API payloads, pull requests, and support logs.',
      }),
    },
    {
      title: t('about.cases.case2.title', { defaultValue: 'Publishing and media preparation' }),
      description: t('about.cases.case2.description', {
        defaultValue:
          'Image compression, SVG export, PDF conversion, and QR/barcode workflows are maintained for lightweight publishing tasks that should not require desktop software.',
      }),
    },
    {
      title: t('about.cases.case3.title', { defaultValue: 'AI-assisted drafting with review' }),
      description: t('about.cases.case3.description', {
        defaultValue:
          'AI pages are designed as draft helpers for code review, translation, meeting notes, listings, and scripts, with visible reminders to review generated output before use.',
      }),
    },
  ];
  const updateItems = [
    t('about.updates.item1', {
      defaultValue:
        'May 18, 2026: Expanded About, Privacy, pillar pages, tool guides, FAQs, and structured data for AdSense remediation.',
    }),
    t('about.updates.item2', {
      defaultValue:
        'May 16, 2026: Published Unicode, URL encoding, UUID, password entropy, QR code, and timestamp guides.',
    }),
    t('about.updates.item3', {
      defaultValue:
        'May 15, 2026: Reviewed core local-first workflows for JSON, Base64, image compression, and PDF processing.',
    }),
  ];

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div>
        <div>
          <h1 className="mb-8 border-b border-slate-200 pb-8 text-3xl font-semibold tracking-tight text-slate-950 dark:border-slate-800 dark:text-white">{t('about.title')}</h1>
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-headings:font-semibold prose-p:leading-7 dark:prose-invert dark:prose-headings:text-white"
            dangerouslySetInnerHTML={{ __html: t('about.content') }} 
          />
          <section className="mt-10 border-y border-blue-100 bg-blue-50/40 py-5 text-sm leading-6 text-slate-700 dark:border-blue-950 dark:bg-blue-950/20 dark:text-slate-300">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-blue-600 text-base font-semibold text-white">
                {TOOL_ORBIT_EDITORIAL_TEAM.avatarInitials}
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {TOOL_ORBIT_EDITORIAL_TEAM.name}
                    </p>
                    <p className="mt-1 font-medium text-blue-800 dark:text-blue-300">
                      {TOOL_ORBIT_EDITORIAL_TEAM.role}
                    </p>
                  </div>
                  <Link
                    to={TOOL_ORBIT_EDITORIAL_TEAM.url}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-300"
                  >
                    <UserCheck size={16} />
                    {t('blog.editorial_policy', { defaultValue: 'Author profile' })}
                  </Link>
                </div>
                <p className="mt-3">
                  {TOOL_ORBIT_EDITORIAL_TEAM.bio}
                </p>
              </div>
            </div>
          </section>
          <section className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {t('about.trust.title', { defaultValue: 'How ToolOrbit earns trust' })}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t('about.trust.intro', {
                defaultValue:
                  'Trust is built through small engineering choices: local processing, clear limitations, practical testing, and a reachable maintainer.',
              })}
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpenCheck size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                    {t('about.cases.title', { defaultValue: 'Use cases we maintain for' })}
                  </h2>
                </div>
                <div className="space-y-4">
                  {caseItems.map((item) => (
                    <div key={item.title} className="border-l-4 border-blue-200 pl-4">
                      <h3 className="font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <History size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                    {t('about.updates.title', { defaultValue: 'Recent updates' })}
                  </h2>
                </div>
                <ol className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {updateItems.map((item) => (
                    <li key={item} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
          <section id="contact" className="mt-10 scroll-mt-24 border-y border-blue-100 bg-blue-50/40 py-5 text-sm leading-6 text-slate-700 dark:border-blue-950 dark:bg-blue-950/20 dark:text-slate-300">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">
                  {t('about.contact_title', { defaultValue: 'Feedback and corrections' })}
                </h2>
                <p className="mt-1">
                  {t('about.contact_desc', {
                    defaultValue:
                      'Found an outdated instruction, broken workflow, or unclear tool result? Send the details and we will review it.',
                  })}
                </p>
              </div>
              <a
                href={`mailto:${BRAND_CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Mail size={16} />
                {BRAND_CONTACT_EMAIL}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
