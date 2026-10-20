import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/*
 * What a list shows when it has nothing: empty cart, no search results,
 * no orders yet. Always say what happened and offer a next step.
 *
 *   <EmptyState icon={ShoppingBag} title="Your cart is empty"
 *     description="Find something warm for the winter."
 *     action={<Button href="/shop">Browse the shop</Button>} />
 */

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Heading level for the title, to fit the page outline. */
  as?: 'h2' | 'h3' | 'p';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  as: Title = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <span className="mb-5 grid size-14 place-items-center rounded-full bg-muted text-muted-fg">
          <Icon icon={icon} size="lg" />
        </span>
      )}
      <Title className="font-display text-h5">{title}</Title>
      {description && (
        <p className="mt-2 max-w-sm text-small text-muted-fg">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
