'use client';

import { useTheme } from 'next-themes';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

/**
 * Both icons are rendered and CSS shows the right one (`dark:` variant), so
 * the server HTML is correct before JavaScript runs and there's no hydration
 * mismatch or icon flicker.
 */
export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="cursor-pointer text-2xl transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      <MdDarkMode className="dark:hidden" aria-hidden="true" />
      <MdLightMode className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
