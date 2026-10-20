'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';

/**
 * Both icons are rendered and CSS shows the right one (`dark:` variant), so
 * the server HTML is correct before JavaScript runs and there's no hydration
 * mismatch or icon flicker.
 */
export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Icon icon={Moon} className="dark:hidden" />
      <Icon icon={Sun} className="hidden dark:block" />
    </IconButton>
  );
}
