import { ViewTransition } from 'react';

/*
 * Page transition for storefront navigations, using React's <ViewTransition>
 * (the browser's View Transitions API). A template remounts on every
 * navigation, so enter/exit fire here (a layout would persist).
 *
 * - Only client-side navigations animate: the first load paints instantly,
 *   so the hero (LCP) is never delayed.
 * - The navbar and footer live in the layout, outside this wrapper.
 * - Animations: .page-exit / .page-enter in globals.css (off with reduced
 *   motion). Browsers without the API simply swap pages.
 */
export default function ShopTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
