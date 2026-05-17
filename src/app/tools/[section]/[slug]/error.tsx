'use client';

import RouteErrorState from '../../../../components/RouteErrorState';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <RouteErrorState
      title="Tool could not be loaded"
      message="This tool hit a rendering issue. Retry without losing your place in ToolOrbit."
      reset={reset}
    />
  );
}
