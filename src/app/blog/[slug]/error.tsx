'use client';

import RouteErrorState from '../../../components/RouteErrorState';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <RouteErrorState
      title="Article could not be loaded"
      message="The article content or metadata failed to render. Please retry the page."
      reset={reset}
    />
  );
}
