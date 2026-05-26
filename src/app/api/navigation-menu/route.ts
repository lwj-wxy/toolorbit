import { getNavigationMenuData } from '../../../lib/navigation-menu';

export const runtime = 'nodejs';

export function GET() {
  return Response.json(getNavigationMenuData(), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
