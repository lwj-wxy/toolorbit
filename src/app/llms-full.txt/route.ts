import { LLMS_FULL_TXT } from '../../lib/llms';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(LLMS_FULL_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
