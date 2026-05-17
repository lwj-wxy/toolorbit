interface RouteLoadingSkeletonProps {
  variant?: 'page' | 'blog' | 'tool' | 'category';
}

function Bar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function Box({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

export default function RouteLoadingSkeleton({ variant = 'page' }: RouteLoadingSkeletonProps) {
  if (variant === 'blog') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Bar className="mb-8 h-4 w-56" />
        <Bar className="mb-4 h-5 w-40" />
        <Bar className="mb-5 h-12 w-full max-w-3xl" />
        <Bar className="mb-8 h-12 w-3/4" />
        <Box className="mb-12 h-[360px] w-full md:h-[460px]" />
        <div className="space-y-4">
          <Bar className="h-5 w-full" />
          <Bar className="h-5 w-11/12" />
          <Bar className="h-5 w-10/12" />
          <Bar className="h-5 w-full" />
        </div>
      </div>
    );
  }

  if (variant === 'tool') {
    return (
      <div className="space-y-8">
        <Bar className="h-4 w-72" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <Bar className="h-10 w-2/3" />
            <Bar className="h-5 w-full max-w-2xl" />
            <Box className="h-[360px] w-full" />
          </div>
          <Box className="hidden h-[360px] lg:block" />
        </div>
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Bar className="mx-auto h-10 w-72" />
          <Bar className="mx-auto h-5 w-full max-w-2xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <Box key={index} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <Bar className="mx-auto h-10 w-72" />
      <Bar className="mx-auto h-5 w-full max-w-2xl" />
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Box key={index} className="h-44" />
        ))}
      </div>
    </div>
  );
}
