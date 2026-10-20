import { Marquee } from '@/components/motion/Marquee';
import { siteConfig } from '@/lib/site-config';
import { DismissAnnouncement } from './DismissAnnouncement';

/*
 * Thin scrolling bar above the navbar. Dismissible; the choice is kept in a
 * cookie for 30 days (per announcement id, so a new announcement shows again).
 *
 * No flash, and the page stays static: reading the cookie on the server
 * (cookies()) would make every page dynamic. Instead, `announcementScript`
 * runs in <head> (root layout) before anything is painted and marks <html>;
 * CSS then hides the bar (the same technique next-themes uses for the theme).
 * It lives in the root layout, which only renders on the server, because
 * React warns when a <script> is rendered on the client.
 */

export const ANNOUNCEMENT_COOKIE = 'announcement_dismissed';

/** Inline, render-blocking on purpose: it must run before the first paint. */
export const announcementScript = `try{if(document.cookie.split('; ').indexOf('${ANNOUNCEMENT_COOKIE}=${siteConfig.announcement.id}')>-1)document.documentElement.setAttribute('data-announcement-dismissed','')}catch(e){}`;

export function AnnouncementBar() {
  const { id, messages } = siteConfig.announcement;

  return (
    <>
      <aside
        aria-label="Announcements"
        data-announcement
        className="relative flex items-center bg-primary text-primary-fg [html[data-announcement-dismissed]_&]:hidden"
      >
        <Marquee
          speed={45}
          gap="3rem"
          className="flex-1 py-2 text-caption tracking-wide uppercase"
        >
          {messages.map((m) => (
            <span key={m} className="flex items-center gap-12">
              {m}
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
            </span>
          ))}
        </Marquee>
        <DismissAnnouncement cookie={ANNOUNCEMENT_COOKIE} id={id} />
      </aside>
    </>
  );
}
