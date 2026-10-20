'use client';

import { Overlay, type OverlayBaseProps } from './Overlay';

/*
 * Centered dialog: size guide, confirmations, quick view.
 *
 *   const sizeGuide = useDisclosure();
 *   <Button onClick={sizeGuide.onOpen}>Size guide</Button>
 *   <Modal open={sizeGuide.open} onClose={sizeGuide.onClose} title="Size guide">…</Modal>
 */

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

export interface ModalProps extends OverlayBaseProps {
  size?: keyof typeof sizes;
}

export function Modal({ size = 'md', ...props }: ModalProps) {
  return (
    <Overlay
      {...props}
      layerClassName="items-center justify-center p-4"
      panelClassName={`w-full ${sizes[size]} max-h-[calc(100dvh-2rem)] rounded-xl`}
      motion={{
        hidden: { opacity: 0, scale: 0.97, y: 8 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
    />
  );
}
