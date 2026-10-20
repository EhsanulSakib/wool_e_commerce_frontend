'use client';

import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

/** Hides the announcement bar now and for 30 days (cookie, read before paint). */
export function DismissAnnouncement({
  cookie,
  id,
}: {
  cookie: string;
  id: string;
}) {
  return (
    <button
      type="button"
      aria-label="Dismiss announcements"
      onClick={() => {
        document.cookie = `${cookie}=${id}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax`;
        document.documentElement.setAttribute(
          'data-announcement-dismissed',
          '',
        );
        // Keep keyboard users in a sensible place once the bar disappears.
        document.getElementById('content')?.focus({ preventScroll: true });
      }}
      className="mr-2 grid size-8 shrink-0 place-items-center rounded-full text-primary-fg/80 transition-colors duration-fast hover:bg-primary-fg/10 hover:text-primary-fg focus-visible:outline-primary-fg"
    >
      <Icon icon={X} size="sm" />
    </button>
  );
}
