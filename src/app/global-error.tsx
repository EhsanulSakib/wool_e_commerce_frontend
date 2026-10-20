'use client';

import './globals.css';

/*
 * Last-resort error page: replaces the root layout when it crashes, so it
 * renders its own <html>/<body> and can't rely on providers, fonts or the
 * theme script. It follows the OS color scheme via the tokens' defaults.
 */
export default function GlobalError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-bg p-6 text-center text-fg">
        <title>Something went wrong | Wool</title>
        <div>
          <h1 className="text-h2">Something went wrong</h1>
          <p className="mt-3 text-body text-muted-fg">
            The store couldn’t load. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-6 h-11 rounded-full bg-primary px-6 font-medium text-primary-fg"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
