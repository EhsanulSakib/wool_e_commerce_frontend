'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import {
  presets,
  staggerContainer,
  withTransition,
  type PresetName,
} from './presets';

/*
 * Children reveal one after another once the group enters the viewport.
 *
 *   <Stagger as="ul" className="grid grid-cols-4 gap-6">
 *     {products.map((p) => (
 *       <StaggerItem key={p.id} as="li"><ProductCard … /></StaggerItem>
 *     ))}
 *   </Stagger>
 */

const containers = {
  div: m.div,
  ul: m.ul,
  ol: m.ol,
  section: m.section,
} as const;
const items = { div: m.div, li: m.li, article: m.article } as const;

export interface StaggerProps {
  children: React.ReactNode;
  /** Seconds between two children. */
  interval?: number;
  delay?: number;
  as?: keyof typeof containers;
  amount?: number;
  className?: string;
}

export function Stagger({
  children,
  interval = 0.08,
  delay = 0,
  as = 'div',
  amount = 0.15,
  className,
}: StaggerProps) {
  const reduced = useReducedMotion() ?? false;
  const Tag = containers[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      variants={
        reduced ? staggerContainer(0, 0) : staggerContainer(interval, delay)
      }
    >
      {children}
    </Tag>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  preset?: PresetName;
  as?: keyof typeof items;
  className?: string;
}

/** A child of <Stagger>. Inherits hidden/visible from the container. */
export function StaggerItem({
  children,
  preset = 'fadeUp',
  as = 'div',
  className,
}: StaggerItemProps) {
  const reduced = useReducedMotion() ?? false;
  const Tag = items[as];

  return (
    <Tag
      className={className}
      variants={withTransition(presets[preset], { reduced })}
    >
      {children}
    </Tag>
  );
}
