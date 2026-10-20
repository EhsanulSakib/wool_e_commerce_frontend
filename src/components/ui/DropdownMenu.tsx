'use client';

import Link from 'next/link';
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { Align } from '@/hooks/useAnchoredPosition';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';
import { Floating, portalContainerFor } from './Floating';

/*
 * Menu button (WAI-ARIA menu pattern): account menu, sort options, "more".
 *
 *   <DropdownMenu trigger={<Button variant="outline">Sort</Button>} align="end">
 *     <DropdownMenuItem onSelect={() => setSort('new')}>Newest</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem href="/user/orders">My orders</DropdownMenuItem>
 *   </DropdownMenu>
 *
 * Keyboard: Enter/Space/↓ open on the first item, ↑ on the last; ↑/↓ move
 * (wrapping), Home/End jump, a letter jumps to the next item starting with
 * it, Enter selects, Escape closes, Tab closes and moves on. Focus returns
 * to the trigger after a selection or Escape.
 */

interface MenuContextValue {
  close: (focusTrigger?: boolean) => void;
}
const MenuContext = createContext<MenuContextValue | null>(null);

type TriggerProps = {
  ref?: React.Ref<HTMLElement>;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  'aria-haspopup'?: 'menu';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
};

export interface DropdownMenuProps {
  /** A Button or IconButton; it gets the ARIA attributes and handlers. */
  trigger: ReactElement<TriggerProps>;
  children: ReactNode;
  align?: Align;
  className?: string;
}

function items(menu: HTMLElement | null): HTMLElement[] {
  return menu
    ? [
        ...menu.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])',
        ),
      ]
    : [];
}

export function DropdownMenu({
  trigger,
  children,
  align = 'start',
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<Element | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const menuId = useId();
  // Which item to focus once the menu has rendered.
  const focusOnOpen = useRef<'first' | 'last'>('first');

  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const openMenu = (focus: 'first' | 'last', trigger: Element) => {
    focusOnOpen.current = focus;
    setContainer(portalContainerFor(trigger));
    setOpen(true);
  };

  // Once the menu is in the DOM, focus its first (or last) item.
  useEffect(() => {
    if (!open) return;
    const list = items(menuRef.current);
    (focusOnOpen.current === 'first' ? list[0] : list.at(-1))?.focus({
      preventScroll: true,
    });
  }, [open]);

  useEscapeKey(() => close(true), open);
  useClickOutside([triggerRef, menuRef], () => close(false), open);

  const focusItem = (index: number) => {
    const list = items(menuRef.current);
    if (list.length === 0) return;
    list[(index + list.length) % list.length].focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = items(menuRef.current);
    const current = list.indexOf(document.activeElement as HTMLElement);
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusItem(current + 1),
      ArrowUp: () => focusItem(current - 1),
      Home: () => focusItem(0),
      End: () => focusItem(list.length - 1),
      Tab: () => close(false),
    };
    if (keys[event.key]) {
      if (event.key !== 'Tab') event.preventDefault();
      keys[event.key]();
      return;
    }
    // Typeahead: jump to the next item starting with the typed letter.
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const letter = event.key.toLowerCase();
      const ordered = [
        ...list.slice(current + 1),
        ...list.slice(0, current + 1),
      ];
      ordered
        .find((el) => el.textContent?.trim().toLowerCase().startsWith(letter))
        ?.focus();
    }
  };

  // eslint-disable-next-line react-hooks/refs -- refs here are only read in event handlers (close/focus), never during render
  const triggerElement = cloneElement(trigger, {
    ref: triggerRef,
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (e) => {
      trigger.props.onClick?.(e);
      if (open) close(false);
      else openMenu('first', e.currentTarget as Element);
    },
    onKeyDown: (e) => {
      trigger.props.onKeyDown?.(e);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openMenu(
          e.key === 'ArrowDown' ? 'first' : 'last',
          e.currentTarget as Element,
        );
      }
    },
  });

  return (
    <MenuContext value={{ close }}>
      {triggerElement}
      <Floating
        open={open}
        container={container}
        anchorRef={triggerRef}
        panelRef={menuRef}
        align={align}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        onKeyDown={onMenuKeyDown}
        className={cn(
          'min-w-48 rounded-lg border border-border bg-surface-raised p-1 shadow-lg',
          className,
        )}
      >
        {children}
      </Floating>
    </MenuContext>
  );
}

const itemClass =
  'flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-small text-fg outline-none select-none hover:bg-muted focus-visible:bg-muted focus-visible:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

export interface DropdownMenuItemProps {
  children: ReactNode;
  /** Runs on click/Enter; the menu then closes. */
  onSelect?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function DropdownMenuItem({
  children,
  onSelect,
  href,
  icon,
  disabled = false,
  className,
}: DropdownMenuItemProps) {
  const menu = useContext(MenuContext);
  const props = {
    role: 'menuitem',
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    className: cn(itemClass, className),
    onClick: (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onSelect?.();
      menu?.close(!href);
    },
  };

  return href && !disabled ? (
    <Link href={href} {...props}>
      {icon}
      {children}
    </Link>
  ) : (
    <button type="button" {...props}>
      {icon}
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="-mx-1 my-1 h-px bg-border" />;
}

/** Non-interactive heading inside a menu. */
export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <div
      role="presentation"
      className="px-3 pt-2 pb-1 text-caption text-muted-fg uppercase"
    >
      {children}
    </div>
  );
}
