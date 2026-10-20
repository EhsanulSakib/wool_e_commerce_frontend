'use client';

import { ShoppingBag, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { PriceTag } from '@/components/ui/PriceTag';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { toast } from '@/components/ui/Toast';
import { currencies, formatPrice } from '@/lib/money';
import { siteConfig } from '@/lib/site-config';
import type { MockCartLine } from './mock-cart';

/*
 * Cart drawer shell with mock lines (module 30 wires the real cart: Redux
 * slice + API). The lines live in the Navbar's state so the cart badge and
 * the drawer agree.
 */

const BDT = currencies.BDT;

function FreeDeliveryProgress({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.freeDeliveryThreshold.BDT;
  const progress = Math.min(1, subtotal / threshold);
  const remaining = threshold - subtotal;

  return (
    <div className="grid gap-2">
      <p className="flex items-center gap-2 text-small">
        <Icon icon={Truck} size="sm" className="text-muted-fg" />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatPrice(remaining, BDT)}</strong> for free delivery
            inside Dhaka
          </span>
        ) : (
          <span className="font-medium text-success">
            You’ve got free delivery inside Dhaka
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
        aria-valuetext={`${formatPrice(Math.min(subtotal, threshold), BDT)} of ${formatPrice(threshold, BDT)}`}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full origin-left rounded-full bg-fg transition-transform duration-slow ease-standard"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}

export function CartDrawer({
  open,
  onClose,
  lines,
  onLinesChange,
}: {
  open: boolean;
  onClose: () => void;
  lines: MockCartLine[];
  onLinesChange: (lines: MockCartLine[]) => void;
}) {
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const remove = (line: MockCartLine) => {
    const before = lines;
    onLinesChange(lines.filter((l) => l.id !== line.id));
    toast.info(`${line.name} removed`, {
      action: { label: 'Undo', onClick: () => onLinesChange(before) },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      title={count > 0 ? `Your cart (${count})` : 'Your cart'}
      footer={
        lines.length > 0 && (
          <div className="grid gap-4">
            <FreeDeliveryProgress subtotal={subtotal} />
            <div className="flex items-baseline justify-between">
              <span className="text-small text-muted-fg">Subtotal</span>
              <span className="text-h6 font-medium tabular-nums">
                {formatPrice(subtotal, BDT)}
              </span>
            </div>
            <p className="-mt-2 text-caption text-muted-fg">
              Delivery is calculated at checkout. Cash on Delivery available.
            </p>
            <Button href="/checkout" prefetch={false} size="lg" fullWidth>
              Checkout
            </Button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          as="p"
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Find something warm for the winter."
          action={
            <Button href="/shop" prefetch={false} onClick={onClose}>
              Browse the shop
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-4 py-4 first:pt-0">
              <span
                aria-hidden="true"
                className="grid aspect-4/5 w-20 shrink-0 place-items-center rounded-md bg-muted"
              >
                <span
                  className="size-8 rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]"
                  style={{ backgroundColor: line.color }}
                />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-small font-medium">
                      {line.name}
                    </p>
                    <p className="text-caption text-muted-fg">{line.variant}</p>
                  </div>
                  <IconButton
                    aria-label={`Remove ${line.name}`}
                    size="sm"
                    className="-mt-1 -mr-2 size-8"
                    onClick={() => remove(line)}
                  >
                    <Icon icon={Trash2} size="sm" />
                  </IconButton>
                </div>
                <div className="mt-auto flex items-end justify-between gap-2">
                  <QuantityStepper
                    size="sm"
                    label={`Quantity, ${line.name}`}
                    value={line.quantity}
                    max={line.stock}
                    onValueChange={(quantity) =>
                      onLinesChange(
                        lines.map((l) =>
                          l.id === line.id ? { ...l, quantity } : l,
                        ),
                      )
                    }
                  />
                  <PriceTag
                    size="sm"
                    amount={line.price * line.quantity}
                    compareAt={
                      line.compareAt ? line.compareAt * line.quantity : null
                    }
                    currency={BDT}
                    showDiscount={false}
                    className="justify-end"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
