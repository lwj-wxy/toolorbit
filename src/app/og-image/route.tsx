import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';
const size = {
  width: 1200,
  height: 630,
};

function textParam(value: string | null, fallback: string, maxLength: number) {
  const cleaned = (value || fallback).replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = textParam(searchParams.get('title'), 'Modern Toolbox for Modern Creators', 88);
  const description = textParam(
    searchParams.get('description'),
    'Fast online tools for developers, creators, and everyday workflows.',
    150,
  );

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#f8fafc',
          color: '#0f172a',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#0f172a',
            borderRadius: '48px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            padding: '76px 88px',
            width: '100%',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', gap: '24px', marginBottom: '64px' }}>
            <div
              style={{
                alignItems: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                borderRadius: '20px',
                display: 'flex',
                fontSize: '54px',
                fontWeight: 900,
                height: '88px',
                justifyContent: 'center',
                width: '88px',
              }}
            >
              TO
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800 }}>ToolOrbit</div>
          </div>
          <div style={{ fontSize: '88px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.02 }}>
            {title}
          </div>
          <div style={{ color: '#bfdbfe', fontSize: '34px', lineHeight: 1.35, marginTop: '36px' }}>
            {description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
