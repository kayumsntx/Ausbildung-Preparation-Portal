'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-lg text-center space-y-4 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-xs text-slate-500">
            {error?.message || 'An unexpected global error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
