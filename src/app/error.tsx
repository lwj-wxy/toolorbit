'use client';

import RouteErrorState from '../components/RouteErrorState';

export default function GlobalError({ reset }: { reset: () => void }) {
  return <RouteErrorState reset={reset} />;
}
