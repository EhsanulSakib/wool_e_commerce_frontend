import { AnnouncementBar } from './AnnouncementBar';
import { FloatingActions } from './FloatingActions';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { SkipLink } from './SkipLink';

/*
 * The frame around every storefront page: skip link, announcement bar,
 * navbar, <main id="content">, footer, floating buttons. Used by the (shop)
 * layout and by the root not-found page (which renders outside any group).
 */
export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <Navbar />
      {/* tabIndex -1: the skip link can move focus here. */}
      <main id="content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
