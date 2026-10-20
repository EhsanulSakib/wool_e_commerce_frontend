'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { presets, withTransition, type PresetName } from './presets';

/*
 * Fades/slides its content in once, when it enters the viewport.
 *
 *   <Reveal><ProductCard … /></Reveal>
 *   <Reveal preset="slideLeft" delay={0.1} as="section">…</Reveal>
 *
 * Never wrap the LCP element (hero heading/image): the hidden start state is
 * rendered on the server, so it would start invisible and delay LCP.
 * With reduced motion, content appears at once in place.
 */

const tags = {
  div: m.div,
  section: m.section,
  article: m.article,
  li: m.li,
  span: m.span,
  p: m.p,
} as const;

export interface RevealProps {
  children: React.ReactNode;
  preset?: PresetName;
  /** Seconds before the animation starts (e.g. to follow a heading). */
  delay?: number;
  as?: keyof typeof tags;
  /** Share of the element that must be visible to trigger (0–1). */
  amount?: number;
  className?: string;
}

export function Reveal({
  children,
  preset = 'fadeUp',
  delay = 0,
  as = 'div',
  amount = 0.2,
  className,
}: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Tag = tags[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      // once: reveal a single time; margin: start a bit before the bottom edge
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      variants={withTransition(presets[preset], { delay, reduced })}
    >
      {children}
    </Tag>
  );
}
