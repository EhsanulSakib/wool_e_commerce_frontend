'use client';
import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from './navLinks';
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useNavbar } from '@/hooks/useNavbar';

export default function Navbar() {
  const {
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
  } = useNavbar();

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white font-poppins shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Hamburger Menu (sm, md) */}
        <button
          className="lg:hidden text-3xl"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <Link href="/home">
          <Image
            src="/assets/logo/logo.png"
            alt="E-Shop Logo"
            width={144}
            height={48}
            className="h-12 w-36 object-contain"
          />
        </Link>

        {/* Desktop Menu (lg and up) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((item, index) => {
            const isActive = isActiveLink(item.url, item.title === 'Home');
            return (
              <div key={index} className="relative group">
                {!item.items ? (
                  <Link
                    href={item.url}
                    className={`text-xl hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-500 dark:text-blue-400 font-bold underline'
                        : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`flex items-center gap-1 text-xl hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-500 dark:text-blue-400 font-bold'
                          : ''
                      }`}
                      onMouseEnter={() => openDropdown(index)}
                      onMouseLeave={() => closeDropdown(index)}
                    >
                      {item.title}
                      <FiChevronDown className="text-lg" />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                        openDropdowns[index]
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                      onMouseEnter={() => openDropdown(index)}
                      onMouseLeave={() => closeDropdown(index)}
                    >
                      <div className="p-4 flex flex-col gap-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={`flex items-center gap-2 text-lg hover:text-blue-500 dark:hover:text-blue-400 ${
                              isActiveLink(subItem.url)
                                ? 'text-blue-500 dark:text-blue-400 font-bold underline'
                                : ''
                            }`}
                            onClick={closeMenu}
                          >
                            <Image
                              src={subItem.icon}
                              width={24}
                              height={24}
                              alt=""
                              className="object-contain"
                            />
                            <div>
                              <span>{subItem.title}</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {subItem.des}
                              </p>
                            </div>
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

        {/* Right Section: E-commerce Options */}
        <div className="flex items-center gap-4">
          {/* Search Bar (Nike-style) */}
          <div className="relative">
            <button
              className="lg:hidden text-2xl"
              onClick={toggleSearch}
              aria-label={isSearchExpanded ? 'Close search' : 'Open search'}
            >
              <FiSearch />
            </button>
            <div
              className={`${
                isSearchExpanded ? 'block' : 'hidden'
              } lg:block transition-all duration-300 ease-in-out`}
            >
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className={`pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    isSearchExpanded
                      ? 'w-64'
                      : 'w-40 lg:w-32'
                  }`}
                  onBlur={() => setTimeout(() => setIsSearchExpanded(false), 200)}
                />
              </div>
            </div>
          </div>

          {/* Favorites */}
          <Link
            href="/favorites"
            className={`relative text-2xl ${
              isActiveLink('/favorites')
                ? 'text-blue-500 dark:text-blue-400'
                : 'hover:text-blue-500 dark:hover:text-blue-400'
            } transition-colors duration-200`}
            aria-current={isActiveLink('/favorites') ? 'page' : undefined}
          >
            <FiHeart />
          </Link>

          {/* Cart */}
          <button
            className={`relative text-2xl ${
              isActiveLink('/cart')
                ? 'text-blue-500 dark:text-blue-400'
                : 'hover:text-blue-500 dark:hover:text-blue-400'
            } transition-colors duration-200`}
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <FiShoppingCart />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          {/* Signup */}
          <Link
            href="/signup"
            className={`text-xl px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 ${
              isActiveLink('/signup')
                ? 'font-bold underline'
                : ''
            }`}
            aria-current={isActiveLink('/signup') ? 'page' : undefined}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Mobile Menu (sm, md) */}
      <div
        className={`lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navLinks.map((item, index) => {
            const isActive = isActiveLink(item.url, item.title === 'Home');
            const isDropdownOpen = openDropdowns[index];
            return (
              <div key={index} className="flex flex-col">
                <div
                  className={`flex items-center justify-between text-xl ${
                    isActive
                      ? 'text-blue-500 dark:text-blue-400 font-bold'
                      : 'hover:text-blue-500 dark:hover:text-blue-400'
                  } transition-colors duration-200`}
                  onClick={item.items ? () => toggleDropdown(index) : closeMenu}
                >
                  <Link
                    href={item.items ? '#' : item.url}
                    className="flex-1"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                  {item.items && (
                    <span className="ml-2">
                      {isDropdownOpen ? (
                        <FiChevronUp className="text-lg" />
                      ) : (
                        <FiChevronDown className="text-lg" />
                      )}
                    </span>
                  )}
                </div>
                {item.items && isDropdownOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className={`text-lg flex items-center gap-2 ${
                          isActiveLink(subItem.url)
                            ? 'text-blue-500 dark:text-blue-400 font-bold underline'
                            : 'hover:text-blue-500 dark:hover:text-blue-400'
                        }`}
                        onClick={closeMenu}
                      >
                        <Image
                          src={subItem.icon}
                          width={20}
                          height={20}
                          alt=""
                          className="object-contain"
                        />
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
            className={`text-xl ${
              isActiveLink('/signup')
                ? 'text-blue-500 dark:text-blue-400 font-bold underline'
                : 'hover:text-blue-500 dark:hover:text-blue-400'
            }`}
            onClick={closeMenu}
            aria-current={isActiveLink('/signup') ? 'page' : undefined}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-2xl"
              aria-label="Close cart"
            >
              <FiX />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {/* Mock cart items */}
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.jpg"
                width={50}
                height={50}
                alt="Cart item"
                className="object-cover"
              />
              <div>
                <p className="font-semibold">Sample Product</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">$29.99</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.jpg"
                width={50}
                height={50}
                alt="Cart item"
                className="object-cover"
              />
              <div>
                <p className="font-semibold">Another Product</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">$49.99</p>
              </div>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      </div>
      {/* Overlay for cart drawer */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}
    </nav>
  );
}