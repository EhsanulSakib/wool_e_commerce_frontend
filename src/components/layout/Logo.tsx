import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/lib/site-config';

/*
 * Store logo linking home. Both versions are in the HTML and CSS shows the
 * one for the theme (dark:hidden / dark:block), so there's no flash and no
 * theme check in JavaScript.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn('inline-flex shrink-0 items-center rounded-sm', className)}
    >
      <Image
        src="/logo/logo-black.png"
        alt=""
        width={144}
        height={144}
        className="size-11 object-contain lg:size-12 dark:hidden"
      />
      <Image
        src="/logo/logo-white.png"
        alt=""
        width={144}
        height={144}
        className="hidden size-11 object-contain lg:size-12 dark:block"
      />
    </Link>
  );
}
