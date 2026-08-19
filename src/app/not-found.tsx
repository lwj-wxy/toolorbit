import Link from 'next/link';
import NotFoundTracker from '../components/NotFoundTracker';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <NotFoundTracker />
      <p className="text-sm font-bold uppercase tracking-wider text-blue-600">404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
        This ToolOrbit page does not exist or has been moved. Use the tool directory to find the current utility.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
      >
        Back to tools
      </Link>
    </div>
  );
}
