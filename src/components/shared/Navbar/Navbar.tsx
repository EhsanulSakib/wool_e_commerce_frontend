'use client';
import { useNavbar } from '@/hooks/useNavbar';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiX,
} from 'react-icons/fi';
import ThemeSwitcher from '../Button/ThemeSwitcher';
import { navLinks } from './navLinks';

/*
 * Temporary navbar, rebuilt on the new UI kit in module 09.
 * Colors use theme tokens (text-foreground, bg-background…) that switch with
 * data-theme, so there are no theme checks in JavaScript. Links to pages
 * that don't exist yet use prefetch={false} to avoid 404 requests.
 */
export default function Navbar() {
  const {
    isMenuOpen,
    openDropdowns,
    isCartOpen,
    isSearchExpanded,
    closeSearch,
    isActiveLink,
    toggleMenu,
    closeMenu,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    toggleCart,
    toggleSearch,
  } = useNavbar();

  return (
    <div className="py-1 shadow-sm">
      <div className="mx-auto flex items-center justify-between px-4">
        {/* Hamburger Menu (sm, md) */}
        <button
          className="text-3xl lg:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo: both variants are rendered, CSS shows the one for the theme */}
        <Link href="/" className="w-full" aria-label="Wool home">
          <Image
            src="/logo/logo-black.png"
            alt="Wool"
            width={144}
            height={144}
            className="h-12 w-12 object-contain lg:h-16 lg:w-20 dark:hidden"
          />
          <Image
            src="/logo/logo-white.png"
            alt="Wool"
            width={144}
            height={144}
            className="hidden h-12 w-12 object-contain lg:h-16 lg:w-20 dark:block"
          />
        </Link>

        {/* Desktop Menu (lg and up) */}
        <div className="w-full">
          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {navLinks.map((item, index) => {
              const isActive = isActiveLink(item.url, item.title === 'Home');
              return (
                <div key={index} className="group relative">
                  {!item.items ? (
                    <Link
                      href={item.url}
                      prefetch={item.url === '/' ? undefined : false}
                      className={`text-lg transition-colors duration-200 hover:text-foreground ${
                        isActive
                          ? 'font-medium text-foreground'
                          : 'text-foreground/70'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`flex cursor-pointer items-center gap-1 text-lg transition-colors duration-200 hover:text-foreground ${
                          isActive
                            ? 'font-medium text-foreground'
                            : 'text-foreground/70'
                        }`}
                        onMouseEnter={() => openDropdown(index)}
                        onMouseLeave={() => closeDropdown(index)}
                        aria-expanded={!!openDropdowns[index]}
                      >
                        {item.title}
                        <FiChevronDown className="text-lg" aria-hidden="true" />
                      </button>
                      <div
                        className={`absolute top-full left-1/2 mt-1 w-64 -translate-x-1/2 transform rounded-lg border border-foreground/10 bg-background shadow-lg transition-all duration-300 ease-in-out ${
                          openDropdowns[index]
                            ? 'scale-100 opacity-100'
                            : 'pointer-events-none invisible scale-95 opacity-0'
                        }`}
                        onMouseEnter={() => openDropdown(index)}
                        onMouseLeave={() => closeDropdown(index)}
                      >
                        <div className="flex flex-col gap-2 p-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              prefetch={false}
                              className={`text-lg hover:text-foreground ${
                                isActiveLink(subItem.url)
                                  ? 'font-medium text-foreground underline'
                                  : 'text-foreground/80'
                              }`}
                              onClick={closeMenu}
                            >
                              <span>{subItem.title}</span>
                              <span className="block text-sm text-foreground/70">
                                {subItem.des}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: E-commerce Options */}
        <div className="flex w-full items-center justify-end gap-4">
          {/* Search */}
          <div className="relative">
            <button
              className="text-2xl lg:hidden"
              onClick={toggleSearch}
              aria-label={isSearchExpanded ? 'Close search' : 'Open search'}
            >
              <FiSearch />
            </button>
            <div
              className={`${
                isSearchExpanded ? 'block' : 'hidden'
              } transition-all duration-300 ease-in-out lg:block`}
            >
              <div className="relative">
                <FiSearch
                  className="absolute top-1/2 left-3 -translate-y-1/2 transform text-foreground/70"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search"
                  aria-label="Search products"
                  className={`rounded-full border border-foreground/40 bg-background/40 py-2 pr-4 pl-10 text-foreground transition-all duration-300 focus:ring-2 focus:ring-foreground focus:outline-none ${
                    isSearchExpanded ? 'w-80' : 'w-56'
                  }`}
                  onBlur={() => setTimeout(closeSearch, 200)}
                />
              </div>
            </div>
          </div>

          {/* Favorites */}
          <Link
            href="/favorites"
            prefetch={false}
            className="relative text-2xl text-foreground transition-colors duration-200 hover:text-foreground/80"
            aria-label="Favorites"
            aria-current={isActiveLink('/favorites') ? 'page' : undefined}
          >
            <FiHeart fill="currentColor" aria-hidden="true" />
          </Link>

          {/* Cart */}
          <button
            className="relative cursor-pointer text-2xl text-foreground transition-colors duration-200 hover:text-foreground/80"
            onClick={toggleCart}
            aria-label="Open cart, 3 items"
          >
            <FiShoppingCart aria-hidden="true" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              3
            </span>
          </button>

          {/* Theme Toggle */}
          <ThemeSwitcher />

          {/* Signup */}
          <Link
            href="/signup"
            prefetch={false}
            className={`rounded-lg px-4 py-2 text-lg transition-all duration-300 ${
              isActiveLink('/signup')
                ? 'bg-foreground text-background'
                : 'bg-foreground/90 text-background hover:bg-foreground'
            }`}
            aria-current={isActiveLink('/signup') ? 'page' : undefined}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Mobile Menu (sm, md) */}
      <div
        className={`border-t border-foreground/20 bg-background transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
          {navLinks.map((item, index) => {
            const isActive = isActiveLink(item.url, item.title === 'Home');
            const isDropdownOpen = openDropdowns[index];
            return (
              <div key={index} className="flex flex-col">
                <div
                  className={`flex items-center justify-between text-lg ${
                    isActive ? 'font-bold' : 'text-foreground/80'
                  } transition-colors duration-200 hover:text-foreground`}
                  onClick={item.items ? () => toggleDropdown(index) : closeMenu}
                >
                  <Link
                    href={item.items ? '#' : item.url}
                    prefetch={false}
                    className="flex-1"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                  {item.items && (
                    <span className="ml-2" aria-hidden="true">
                      {isDropdownOpen ? (
                        <FiChevronUp className="text-lg" />
                      ) : (
                        <FiChevronDown className="text-lg" />
                      )}
                    </span>
                  )}
                </div>
                {item.items && isDropdownOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        prefetch={false}
                        className={`text-lg ${
                          isActiveLink(subItem.url)
                            ? 'font-bold underline'
                            : 'text-foreground/80 hover:text-foreground'
                        }`}
                        onClick={closeMenu}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/signup"
            prefetch={false}
            className={`text-lg ${
              isActiveLink('/signup')
                ? 'font-bold underline'
                : 'text-foreground/80 hover:text-foreground'
            }`}
            onClick={closeMenu}
            aria-current={isActiveLink('/signup') ? 'page' : undefined}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Cart Drawer (mock content until module 30) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        // inert: when closed, hidden from screen readers AND not focusable
        inert={!isCartOpen}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-2xl"
              aria-label="Close cart"
            >
              <FiX />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Sample Product', price: '$29.99' },
              { name: 'Another Product', price: '$49.99' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-12 w-12 rounded bg-foreground/10" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-foreground/70">{item.price}</p>
                </div>
              </div>
            ))}
            <button className="mt-4 rounded-lg bg-foreground px-4 py-2 text-background hover:bg-foreground/90">
              Checkout
            </button>
          </div>
        </div>
      </div>
      {/* Overlay for cart drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleCart} />
      )}
    </div>
  );
}
