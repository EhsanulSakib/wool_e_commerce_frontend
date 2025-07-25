'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useThemeSwitch } from './theme/useThemeSwitcher';

export function useNavbar() {
  const { theme, toggleTheme } = useThemeSwitch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});
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

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdowns({});
    setIsCartOpen(false);
    setIsSearchExpanded(false);
  }, [pathname]);

  // Determine if a link is active
  const isActiveLink = (url: string, isHome: boolean = false) => {
    return isHome
      ? pathname === '/' || pathname === '/home'
      : pathname === url || pathname.startsWith(url);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = (index: number) =>
    setOpenDropdowns((prev) => ({ ...prev, [index]: !prev[index] }));
  const openDropdown = (index: number) => setOpenDropdowns((prev) => ({ ...prev, [index]: true }));
  const closeDropdown = (index: number) => setOpenDropdowns((prev) => ({ ...prev, [index]: false }));
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchExpanded((prev) => !prev);

  return {
    theme,
    toggleTheme,
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