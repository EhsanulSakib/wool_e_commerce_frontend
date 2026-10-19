'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: number]: boolean;
  }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const pathname = usePathname();

  // Close mobile menu, dropdowns, and cart on resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setOpenDropdowns({});
        setIsCartOpen(false);
        setIsSearchExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus on route change. (Adjusting state while rendering, the React
  // pattern for "reset when a value changes", instead of an effect.)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
    setOpenDropdowns({});
    setIsCartOpen(false);
    setIsSearchExpanded(false);
  }

  // Determine if a link is active
  const isActiveLink = (url: string, isHome: boolean = false) => {
    return isHome
      ? pathname === '/'
      : pathname === url || pathname.startsWith(url);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: !prev[index] }));
  const openDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: true }));
  const closeDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: false }));
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchExpanded((prev) => !prev);

  return {
    isMenuOpen,
    openDropdowns,
    isCartOpen,
    isSearchExpanded,
    setIsSearchExpanded,
    isActiveLink,
    toggleMenu,
    closeMenu,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    toggleCart,
    toggleSearch,
  };
}
