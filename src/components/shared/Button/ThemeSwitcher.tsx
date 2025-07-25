'use client';

import { useThemeSwitch } from '@/hooks/theme/useThemeSwitcher';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeSwitch();

  return (
    <button
      onClick={toggleTheme}
      className="text-2xl transition-colors duration-200 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
    </button>
  );
}