'use client';

import { CheckCircle2, Code2, Mail, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-8 pb-8 border-b border-slate-100">{t('about.title')}</h1>
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-800"
            dangerouslySetInnerHTML={{ __html: t('about.content') }} 
          />
          <section className="mt-10 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-emerald-700 shadow-sm">
                {TOOL_ORBIT_EDITORIAL_TEAM.avatarInitials}
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {TOOL_ORBIT_EDITORIAL_TEAM.name}
                    </p>
                    <p className="mt-1 font-medium text-emerald-800">
                      {TOOL_ORBIT_EDITORIAL_TEAM.role}
                    </p>
                  </div>
                  <Link
                    to={TOOL_ORBIT_EDITORIAL_TEAM.url}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
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
          <section className="mt-10 border-t border-slate-100 pt-10">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('about.trust.title', { defaultValue: 'How ToolOrbit earns trust' })}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {t('about.trust.intro', {
                defaultValue:
                  'Trust is built through small engineering choices: local processing, clear limitations, practical testing, and a reachable maintainer.',
              })}
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="mt-10 rounded-xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-6 text-slate-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
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
