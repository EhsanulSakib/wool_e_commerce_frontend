'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * next-themes injects a tiny inline script that sets data-theme on <html>
 * before the page paints, so there's no flash of the wrong theme, and it
 * remembers the user's choice in localStorage.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
