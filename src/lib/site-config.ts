/*
 * Store-wide content for the layout: navigation, categories, contact and
 * social links. Static for now; module 39 moves the editable parts (contact
 * numbers, social links, announcement) to backend settings, and categories
 * come from the catalog API (module 20).
 *
 * Phone and social values are placeholders: replace them with the real ones.
 */

export interface NavCategory {
  label: string;
  href: string;
  description: string;
  /** Category photo for the mega menu (real photos arrive in module 10). */
  image?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Wool',
  tagline: 'Premium wool knitwear',
  url: 'https://wool.com.bd',

  announcement: {
    /** Change the id to show a new announcement to people who dismissed the old one. */
    id: '2026-winter',
    messages: [
      'Free delivery inside Dhaka over ৳3,000',
      'Cash on Delivery across Bangladesh',
      'New winter collection is here',
      'Worldwide shipping in USD',
    ],
  },

  categories: [
    {
      label: 'Sweaters',
      href: '/collections/sweaters',
      description: 'Crew necks, turtlenecks and V-necks',
    },
    {
      label: 'Cardigans',
      href: '/collections/cardigans',
      description: 'Button-up layers for every season',
    },
    {
      label: 'Scarves',
      href: '/collections/scarves',
      description: 'Soft merino and lambswool wraps',
    },
    {
      label: 'Beanies',
      href: '/collections/beanies',
      description: 'Ribbed and cable-knit hats',
    },
    {
      label: 'Accessories',
      href: '/collections/accessories',
      description: 'Gloves, socks and wool care',
    },
  ] satisfies NavCategory[],

  collections: [
    { label: 'New In', href: '/collections/new-in' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'Winter Edit', href: '/collections/winter' },
    { label: 'Shop all', href: '/shop' },
  ] satisfies NavLink[],

  /** Top-level desktop links after "Shop" (which opens the mega menu). */
  mainNav: [
    { label: 'New In', href: '/collections/new-in' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'About', href: '/about' },
  ] satisfies NavLink[],

  footer: {
    shop: [
      { label: 'Sweaters', href: '/collections/sweaters' },
      { label: 'Cardigans', href: '/collections/cardigans' },
      { label: 'Scarves', href: '/collections/scarves' },
      { label: 'Beanies', href: '/collections/beanies' },
      { label: 'New In', href: '/collections/new-in' },
    ],
    help: [
      { label: 'Track your order', href: '/track-order' },
      { label: 'Shipping & returns', href: '/shipping-returns' },
      { label: 'Size guide', href: '/size-guide' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact us', href: '/contact' },
    ],
    company: [
      { label: 'About Wool', href: '/about' },
      { label: 'Wool care', href: '/wool-care' },
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Refund policy', href: '/refund-policy' },
    ],
  } satisfies Record<string, NavLink[]>,

  contact: {
    /** International format without + or spaces, for wa.me links. */
    whatsapp: '8801700000000',
    messenger: 'woolbd',
    phone: '+8801700000000',
    phoneDisplay: '+880 1700-000000',
    email: 'hello@wool.com.bd',
    address: 'Dhanmondi, Dhaka 1209, Bangladesh',
    hours: 'Sat–Thu, 10am–8pm',
  },

  social: {
    facebook: 'https://facebook.com/woolbd',
    instagram: 'https://instagram.com/woolbd',
    youtube: 'https://youtube.com/@woolbd',
  },

  /** Free-delivery threshold shown in the cart (moves to shipping rates in module 28). */
  freeDeliveryThreshold: { BDT: 3000, USD: 50 },
} as const;

export const contactLinks = {
  whatsapp: `https://wa.me/${siteConfig.contact.whatsapp}`,
  messenger: `https://m.me/${siteConfig.contact.messenger}`,
  call: `tel:${siteConfig.contact.phone}`,
  email: `mailto:${siteConfig.contact.email}`,
};
