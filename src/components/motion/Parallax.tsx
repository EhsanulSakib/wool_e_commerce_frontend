'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { gsap, useGSAP, useLenisScrollTrigger } from '@/lib/gsap';

/*
 * The content (usually an image) moves slower than the page while it
 * crosses the viewport. Desktop only (≥ 1024px) and never with reduced
 * motion: on phones it's static, which is also cheaper.
 *
 *   <Parallax className="aspect-[4/5]">
 *     <Image src={…} alt={…} fill className="object-cover" />
 *   </Parallax>
 *
 * The frame (this component) clips; the inner layer is scaled up just enough
 * that its edges never show while it moves.
 */

export interface ParallaxProps {
  children: React.ReactNode;
  /** Movement as a share of the height in each direction (0.1 = ±10%). */
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.12, className }: ParallaxProps) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  useLenisScrollTrigger();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.fromTo(
            layer.current,
            { yPercent: -speed * 100, scale: 1 + speed * 2 },
            {
              yPercent: speed * 100,
              ease: 'none', // linear: position follows scroll exactly
              scrollTrigger: {
                trigger: frame.current,
                start: 'top bottom', // frame enters at the bottom…
                end: 'bottom top', // …until it leaves at the top
                scrub: true,
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: frame, dependencies: [speed] },
  );

  return (
    <div ref={frame} className={cn('relative overflow-hidden', className)}>
      <div ref={layer} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
