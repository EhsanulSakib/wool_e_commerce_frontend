'use client';

/*
 * First focusable element on every storefront page: keyboard users press
 * Tab once, then Enter, and land on the main content instead of tabbing
 * through the whole navbar. Visible only while focused.
 *
 * Focus is moved by hand (not just the #content jump) because Lenis's
 * anchor handling would only scroll, leaving focus at the top.
 */
export function SkipLink() {
  return (
    <a
      href="#content"
      onClick={(event) => {
        const main = document.getElementById('content');
        if (!main) return;
        event.preventDefault();
        main.focus({ preventScroll: true });
        main.scrollIntoView();
      }}
      className="fixed top-3 left-3 z-toast -translate-y-[200%] rounded-full bg-primary px-5 py-3 text-small font-medium text-primary-fg shadow-lg transition-transform duration-base ease-standard focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
