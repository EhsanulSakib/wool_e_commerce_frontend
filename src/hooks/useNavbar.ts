'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeAllOverlays,
  closeMobileMenu,
  closeSearch,
  selectIsCartDrawerOpen,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
  toggleCartDrawer,
  toggleMobileMenu,
  toggleSearch,
} from '@/store/slices/uiSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Navbar state. The cart drawer, mobile menu and search live in Redux (other
 * components will open the cart drawer later); dropdowns are only used here,
 * so they stay local state.
 */
export function useNavbar() {
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector(selectIsMobileMenuOpen);
  const isCartOpen = useAppSelector(selectIsCartDrawerOpen);
  const isSearchExpanded = useAppSelector(selectIsSearchOpen);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: number]: boolean;
  }>({});
  const pathname = usePathname();

  // Close overlays when resizing to a large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) dispatch(closeAllOverlays());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Close overlays on route change
  useEffect(() => {
    dispatch(closeAllOverlays());
  }, [pathname, dispatch]);

  // Reset dropdowns on route change (adjusting local state while rendering,
  // the React pattern for "reset when a value changes")
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenDropdowns({});
  }

  // Determine if a link is active
  const isActiveLink = (url: string, isHome: boolean = false) => {
    return isHome
      ? pathname === '/'
      : pathname === url || pathname.startsWith(url);
  };

  const toggleDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: !prev[index] }));
  const openDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: true }));
  const closeDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: false }));

  return {
    isMenuOpen,
    openDropdowns,
    isCartOpen,
    isSearchExpanded,
    closeSearch: () => dispatch(closeSearch()),
    isActiveLink,
    toggleMenu: () => dispatch(toggleMobileMenu()),
    closeMenu: () => dispatch(closeMobileMenu()),
    toggleDropdown,
    openDropdown,
    closeDropdown,
    toggleCart: () => dispatch(toggleCartDrawer()),
    toggleSearch: () => dispatch(toggleSearch()),
  };
}
