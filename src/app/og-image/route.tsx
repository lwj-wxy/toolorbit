import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ToolOrbit';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function GET() {
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
              Ω
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800 }}>ToolOrbit</div>
          </div>
          <div style={{ fontSize: '88px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.02 }}>
            Modern Toolbox for Modern Creators
          </div>
          <div style={{ color: '#bfdbfe', fontSize: '34px', lineHeight: 1.35, marginTop: '36px' }}>
            Fast online tools for developers, creators, and everyday workflows.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
