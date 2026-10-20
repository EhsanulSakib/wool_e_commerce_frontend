'use client';

import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Container } from '@/components/ui/layout';
import { NotificationDot } from '@/components/ui/NotificationDot';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/lib/site-config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeAllOverlays,
  closeCartDrawer,
  closeMobileMenu,
  closeSearch,
  openCartDrawer,
  openMobileMenu,
  openSearch,
  selectIsCartDrawerOpen,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
} from '@/store/slices/uiSlice';
import { CurrencySwitcher } from './CurrencySwitcher';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { mockCartLines } from './mock-cart';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderScroll } from './useHeaderScroll';

/*
 * Storefront navbar.
 *
 * - Sticky; hides when scrolling down and comes back when scrolling up
 *   (useHeaderScroll writes data attributes; transform only; no re-render
 *   per scroll frame).
 * - Transparent at the top of the home page (over the hero), solid after.
 * - Desktop (lg+): Shop mega menu + links + icons. Mobile: menu button,
 *   logo, search and cart; everything else lives in the mobile menu.
 * - Overlay open/close state is in Redux (uiSlice), so other parts of the
 *   app (e.g. "Add to cart" in module 30) can open the cart drawer.
 */

// The drawers aren't needed for the first paint: their code loads the first
// time each one opens (and is preloaded when the pointer reaches its button),
// keeping it off the critical path for LCP.
const loadCart = () => import('./CartDrawer');
const loadMenu = () => import('./MobileMenu');
const loadSearch = () => import('./SearchOverlay');
const CartDrawer = dynamic(() => loadCart().then((m) => m.CartDrawer));
const MobileMenu = dynamic(() => loadMenu().then((m) => m.MobileMenu));
const SearchOverlay = dynamic(() => loadSearch().then((m) => m.SearchOverlay));

const iconLink =
  'grid size-11 place-items-center rounded-full text-fg transition-colors duration-fast hover:bg-muted';

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(selectIsCartDrawerOpen);
  const isMenuOpen = useAppSelector(selectIsMobileMenuOpen);
  const isSearchOpen = useAppSelector(selectIsSearchOpen);
  const [megaOpen, setMegaOpen] = useState(false);
  // Mock cart lines until module 30 (shared by the badge and the drawer).
  const [cartLines, setCartLines] = useState(mockCartLines);
  const cartCount = cartLines.reduce((n, l) => n + l.quantity, 0);

  // Mount each drawer once it has been opened, then keep it (so the close
  // animation plays). Adjusting state during render is React's pattern for
  // state derived from changing props/store values.
  const [mounted, setMounted] = useState({
    cart: false,
    menu: false,
    search: false,
  });
  if (
    (isCartOpen && !mounted.cart) ||
    (isMenuOpen && !mounted.menu) ||
    (isSearchOpen && !mounted.search)
  ) {
    setMounted({
      cart: mounted.cart || isCartOpen,
      menu: mounted.menu || isMenuOpen,
      search: mounted.search || isSearchOpen,
    });
  }

  useHeaderScroll(headerRef);

  // Navigating closes every overlay.
  useEffect(() => {
    dispatch(closeAllOverlays());
  }, [pathname, dispatch]);

  const overHero = pathname === '/';

  return (
    <>
      <header
        ref={headerRef}
        data-locked={megaOpen || undefined}
        className={cn(
          'sticky top-0 z-sticky border-b border-border bg-bg transition-[transform,background-color,border-color] duration-base ease-standard data-[hidden=true]:-translate-y-full',
          // Transparent while at the top of the home page (until module 10's
          // hero sits under it, the page background shows through).
          overHero &&
            !megaOpen &&
            'not-data-[at-top=false]:border-transparent not-data-[at-top=false]:bg-transparent',
        )}
      >
        <Container
          size="wide"
          className="flex h-16 items-center gap-2 lg:h-18 lg:gap-6"
        >
          <IconButton
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => dispatch(openMobileMenu())}
            onPointerEnter={loadMenu}
            onFocus={loadMenu}
            className="-ml-2 lg:hidden"
          >
            <Icon icon={Menu} />
          </IconButton>

          <Logo className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              <MegaMenu onOpenChange={setMegaOpen} />
              {siteConfig.mainNav.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      prefetch={false}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-sm py-2 text-small font-medium transition-colors duration-fast',
                        active ? 'text-fg' : 'text-muted-fg hover:text-fg',
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <IconButton
              aria-label="Search"
              aria-expanded={isSearchOpen}
              onClick={() => dispatch(openSearch())}
              onPointerEnter={loadSearch}
              onFocus={loadSearch}
            >
              <Icon icon={Search} />
            </IconButton>
            <CurrencySwitcher className="hidden lg:inline-flex" />
            <ThemeToggle className="hidden lg:inline-flex" />
            <Link
              href="/login"
              prefetch={false}
              aria-label="Account"
              className={cn(iconLink, 'hidden lg:grid')}
            >
              <Icon icon={User} />
            </Link>
            <Link
              href="/wishlist"
              prefetch={false}
              aria-label="Wishlist"
              className={cn(iconLink, 'hidden sm:grid')}
            >
              <Icon icon={Heart} />
            </Link>
            <span className="relative -mr-2 inline-flex lg:mr-0">
              <IconButton
                aria-label={
                  cartCount > 0
                    ? `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                    : 'Cart, empty'
                }
                aria-expanded={isCartOpen}
                onClick={() => dispatch(openCartDrawer())}
                onPointerEnter={loadCart}
                onFocus={loadCart}
              >
                <Icon icon={ShoppingBag} />
              </IconButton>
              <NotificationDot
                count={cartCount}
                className="absolute top-1 right-0.5"
              />
            </span>
          </div>
        </Container>
      </header>

      {mounted.menu && (
        <MobileMenu
          open={isMenuOpen}
          onClose={() => dispatch(closeMobileMenu())}
        />
      )}
      {mounted.search && (
        <SearchOverlay
          open={isSearchOpen}
          onClose={() => dispatch(closeSearch())}
        />
      )}
      {mounted.cart && (
        <CartDrawer
          open={isCartOpen}
          onClose={() => dispatch(closeCartDrawer())}
          lines={cartLines}
          onLinesChange={setCartLines}
        />
      )}
    </>
  );
}
