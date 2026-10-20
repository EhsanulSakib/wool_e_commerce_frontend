'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';
import { useEffect } from 'react';
import { claimLenisDriver, useLenis } from '@/providers/smooth-scroll-provider';

/*
 * The only place GSAP is imported from. Import it only in client components
 * that animate with GSAP (TextReveal, Parallax…): routes that never import
 * this file never download GSAP.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

// ---------------------------------------------------------------- Lenis sync
// While at least one GSAP component is mounted, gsap.ticker drives Lenis and
// every Lenis scroll updates ScrollTrigger: one loop, same frame, no jitter.
// Ref-counted so ten components still add one ticker callback.

let connected: { lenis: Lenis; count: number; disconnect: () => void } | null =
  null;

function connect(lenis: Lenis): () => void {
  if (connected && connected.lenis !== lenis) connected.disconnect();

  if (!connected || connected.lenis !== lenis) {
    const tick = (time: number) => lenis.raf(time * 1000); // seconds → ms
    const release = claimLenisDriver();
    const offScroll = lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    // Don't "catch up" after a slow frame: Lenis already handles time.
    gsap.ticker.lagSmoothing(0);

    const entry = {
      lenis,
      count: 0,
      disconnect: () => {
        gsap.ticker.remove(tick);
        offScroll();
        release();
        if (connected === entry) connected = null;
      },
    };
    connected = entry;
  }

  const entry = connected;
  entry.count += 1;
  return () => {
    entry.count -= 1;
    if (entry.count === 0) entry.disconnect();
  };
}

/**
 * Call in every component that uses ScrollTrigger. No-op when Lenis is off
 * (touch-only devices, reduced motion), where ScrollTrigger reads native
 * scrolling by itself.
 */
export function useLenisScrollTrigger() {
  const lenis = useLenis();
  useEffect(() => (lenis ? connect(lenis) : undefined), [lenis]);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
