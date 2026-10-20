import { ShopShell } from '@/components/layout/ShopShell';

// Storefront layout: every shop page gets the navbar, footer and floating
// buttons. Module 21 moves this group under [currency].
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopShell>{children}</ShopShell>;
}
