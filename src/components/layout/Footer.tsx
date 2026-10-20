import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/layout';
import { contactLinks, siteConfig } from '@/lib/site-config';
import {
  FacebookIcon,
  InstagramIcon,
  PaymentMethods,
  YoutubeIcon,
} from './BrandIcons';
import { FooterLinks } from './FooterLinks';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';

/*
 * Storefront footer (server component; the newsletter form and the mobile
 * accordions are small client islands). Content pages behind these links
 * arrive in module 25.
 */

const social = [
  { label: 'Facebook', href: siteConfig.social.facebook, icon: FacebookIcon },
  {
    label: 'Instagram',
    href: siteConfig.social.instagram,
    icon: InstagramIcon,
  },
  { label: 'YouTube', href: siteConfig.social.youtube, icon: YoutubeIcon },
];

export function Footer() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-section border-t border-border bg-surface">
      <Container
        size="wide"
        className="grid gap-12 py-section-sm lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20"
      >
        <div className="grid content-start gap-6">
          <Logo />
          <p className="max-w-xs text-small text-muted-fg">
            Sweaters, cardigans, scarves and beanies knitted from soft, natural
            wool. Made to be worn for many winters.
          </p>
          <NewsletterForm />
          <ul className="flex gap-1" aria-label="Social media">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="grid size-10 place-items-center rounded-full text-muted-fg transition-colors duration-fast hover:bg-muted hover:text-fg"
                >
                  <s.icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-10">
          <FooterLinks
            columns={[
              { title: 'Shop', links: siteConfig.footer.shop },
              { title: 'Help', links: siteConfig.footer.help },
              { title: 'Company', links: siteConfig.footer.company },
            ]}
          />
          <address className="grid gap-3 text-small text-muted-fg not-italic sm:grid-cols-2">
            <a
              href={contactLinks.call}
              className="flex items-center gap-2 rounded-sm hover:text-fg"
            >
              <Icon icon={Phone} size="sm" /> {contact.phoneDisplay}
            </a>
            <a
              href={contactLinks.email}
              className="flex items-center gap-2 rounded-sm hover:text-fg"
            >
              <Icon icon={Mail} size="sm" /> {contact.email}
            </a>
            <span className="flex items-center gap-2">
              <Icon icon={MapPin} size="sm" /> {contact.address}
            </span>
            <span className="flex items-center gap-2">
              <Icon icon={Clock} size="sm" /> {contact.hours}
            </span>
          </address>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container
          size="wide"
          className="flex flex-col-reverse gap-4 py-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-caption text-muted-fg">
            © {year} {siteConfig.name}. Made in Bangladesh.
          </p>
          <PaymentMethods />
        </Container>
      </div>
    </footer>
  );
}
