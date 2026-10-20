'use client';

import { Heart, Package, User } from 'lucide-react';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/lib/site-config';
import { CurrencyToggle } from './CurrencySwitcher';
import { ThemeToggle } from './ThemeToggle';

/*
 * Mobile navigation: a full-height drawer from the left (focus trapped,
 * page locked, Escape closes). Links appear one after another; categories
 * sit in an accordion; account, currency and theme are at the bottom.
 * Any link closes the drawer (the navbar also closes it on route change).
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title="Menu"
      footer={
        <div className="grid gap-4">
          <ul className="grid gap-1">
            {[
              { label: 'Sign in', href: '/login', icon: User },
              { label: 'Track an order', href: '/track-order', icon: Package },
              { label: 'Wishlist', href: '/wishlist', icon: Heart },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  prefetch={false}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md py-2 text-small"
                >
                  <Icon icon={l.icon} size="sm" className="text-muted-fg" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4">
            <CurrencyToggle />
            <ThemeToggle />
          </div>
        </div>
      }
    >
      <nav aria-label="Mobile">
        <Stagger as="ul" interval={0.05} className="grid">
          <StaggerItem as="li">
            <Accordion headingLevel={3} className="border-t-0">
              <AccordionItem
                value="shop"
                title={<span className="font-display text-h4">Shop</span>}
              >
                <ul className="grid gap-1 pb-2">
                  {siteConfig.categories.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        prefetch={false}
                        onClick={onClose}
                        className="block rounded-md py-2 text-body text-fg"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/shop"
                      prefetch={false}
                      onClick={onClose}
                      className="block rounded-md py-2 text-body text-muted-fg underline underline-offset-4"
                    >
                      Shop all
                    </Link>
                  </li>
                </ul>
              </AccordionItem>
            </Accordion>
          </StaggerItem>
          {[
            ...siteConfig.mainNav,
            { label: 'Winter Edit', href: '/collections/winter' },
            { label: 'Contact', href: '/contact' },
          ].map((l) => (
            <StaggerItem
              key={l.href}
              as="li"
              className="border-b border-border"
            >
              <Link
                href={l.href}
                prefetch={false}
                onClick={onClose}
                className="block rounded-sm py-4 font-display text-h4"
              >
                {l.label}
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </nav>
    </Drawer>
  );
}
