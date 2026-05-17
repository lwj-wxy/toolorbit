'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

interface RouteErrorStateProps {
  title?: string;
  message?: string;
  reset?: () => void;
}

export default function RouteErrorState({
  title = 'Something went wrong',
  message = 'This section could not be loaded. Try again or return to another ToolOrbit page.',
  reset,
}: RouteErrorStateProps) {
  return (
    <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertTriangle size={24} />
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{message}</p>
      {reset ? (
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <RotateCcw size={16} />
          Try again
        </button>
      ) : null}
    </div>
  );
}
