'use client';

import { Overlay, type OverlayBaseProps } from './Overlay';

/*
 * Panel that slides in from an edge: cart (right), mobile menu (left),
 * mobile filters (bottom). Same focus, scroll and Escape behavior as Modal.
 *
 *   <Drawer side="right" open={cart.open} onClose={cart.onClose} title="Your cart">…</Drawer>
 */

const layouts = {
  right: {
    layer: 'justify-end',
    panel: 'h-dvh w-[min(100vw-3rem,28rem)]',
    hidden: { x: '100%' },
  },
  left: {
    layer: 'justify-start',
    panel: 'h-dvh w-[min(100vw-3rem,24rem)]',
    hidden: { x: '-100%' },
  },
  bottom: {
    layer: 'items-end',
    panel: 'max-h-[85dvh] w-full rounded-t-2xl',
    hidden: { y: '100%' },
  },
} as const;

export interface DrawerProps extends OverlayBaseProps {
  side?: keyof typeof layouts;
}

export function Drawer({ side = 'right', ...props }: DrawerProps) {
  const layout = layouts[side];
  return (
    <Overlay
      {...props}
      layerClassName={layout.layer}
      panelClassName={layout.panel}
      motion={{ hidden: layout.hidden, visible: { x: 0, y: 0 } }}
    />
  );
}
