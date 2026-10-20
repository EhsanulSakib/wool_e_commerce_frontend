'use client';

import { useCallback, useState } from 'react';

/**
 * Open/closed state for overlays.
 *
 *   const cart = useDisclosure();
 *   <Button onClick={cart.onOpen}>Cart</Button>
 *   <Drawer open={cart.open} onClose={cart.onClose} …/>
 */
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((o) => !o), []);
  return { open, setOpen, onOpen, onClose, onToggle };
}
