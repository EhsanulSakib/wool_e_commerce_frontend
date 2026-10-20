'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP, useLenisScrollTrigger } from '@/lib/gsap';
import { durationS, gsapEase } from '@/styles/motion';

/*
 * Text slides up line by line (or word by word) from behind a mask, once,
 * when it scrolls into view. Uses GSAP SplitText.
 *
 *   <TextReveal as="h2" className="text-h2">Made from soft merino wool</TextReveal>
 *
 * - Children must be plain text (SplitText rewrites the element's DOM; it is
 *   restored on unmount).
 * - Re-splits after fonts load and on resize (autoSplit), so lines stay right.
 * - Screen readers read a visually hidden copy of the whole sentence; the
 *   split, animated copy is aria-hidden. (SplitText's own aria: 'auto' puts
 *   aria-label on the element, which isn't allowed on <p>.)
 * - With reduced motion the text is never split: plain, visible text.
 * - Not for the LCP element: the text is hidden just after hydration.
 */

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

export interface TextRevealProps {
  children: string;
  as?: TagName;
  /** Split into lines (headings, paragraphs) or words (short phrases). */
  by?: 'lines' | 'words';
  delay?: number;
  /** ScrollTrigger start, e.g. "top 85%" = element top hits 85% of the viewport. */
  start?: string;
  className?: string;
}

export function TextReveal({
  children,
  as: Tag = 'p',
  by = 'lines',
  delay = 0,
  start = 'top 85%',
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const visual = useRef<HTMLSpanElement>(null);
  useLenisScrollTrigger();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(visual.current, {
          type: by === 'lines' ? 'lines' : 'words',
          mask: by, // each piece sits in an overflow:hidden wrapper
          autoSplit: true,
          aria: 'none', // the visual copy is already aria-hidden
          tag: 'span', // valid inside <p> and headings (divs aren't)
          // Runs on every (re)split; returning the tween lets SplitText
          // revert it before splitting again.
          onSplit: (self) => {
            const pieces = by === 'lines' ? self.lines : self.words;
            // The <span> wrappers are inline, and inline boxes ignore
            // transform and don't clip. Set display here, after SplitText has
            // measured the line breaks (CSS on the wrappers would also hit
            // the temporary word spans it measures with, and break lines).
            gsap.set([...self.masks, ...pieces], {
              display: by === 'lines' ? 'block' : 'inline-block',
            });
            return gsap.from(pieces, {
              yPercent: 110,
              duration: durationS.slower,
              ease: gsapEase.outExpo,
              stagger: by === 'lines' ? 0.08 : 0.04,
              delay,
              scrollTrigger: { trigger: ref.current, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [by, delay, start] },
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      <span className="sr-only">{children}</span>
      <span ref={visual} aria-hidden="true" className="block">
        {children}
      </span>
    </Tag>
  );
}
