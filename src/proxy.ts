import { NextResponse, type NextRequest } from 'next/server';
import { LLMS_TXT } from './lib/llms';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/llms.txt') {
    return new NextResponse(LLMS_TXT, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/llms.txt'],
};
