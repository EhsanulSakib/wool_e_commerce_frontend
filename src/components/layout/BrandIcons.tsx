import { cn } from '@/lib/cn';

/*
 * Social and payment marks. lucide-react 1.x no longer ships brand icons,
 * so these are small hand-made SVGs (social) and text badges (payments).
 * Swap in the official brand assets before launch (module 44).
 */

type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-5', className)}
    >
      <path
        fill="currentColor"
        d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={cn('size-5', className)}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-5', className)}
    >
      <path
        fill="currentColor"
        d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"
      />
    </svg>
  );
}

const payments = ['Cash on Delivery', 'bKash', 'Nagad', 'Visa', 'Mastercard'];

/** Accepted payment methods as neutral text badges. */
export function PaymentMethods({ className }: { className?: string }) {
  return (
    <ul
      aria-label="Accepted payment methods"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {payments.map((p) => (
        <li
          key={p}
          className="rounded-sm border border-border bg-bg px-2.5 py-1 text-caption font-semibold text-muted-fg"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}
