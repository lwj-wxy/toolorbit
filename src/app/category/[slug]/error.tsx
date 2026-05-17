'use client';

import RouteErrorState from '../../../components/RouteErrorState';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <RouteErrorState
      title="Category could not be loaded"
      message="The tool category failed to render. Please retry the page."
      reset={reset}
    />
  );
}
