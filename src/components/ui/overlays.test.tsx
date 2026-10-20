import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { DropdownMenu, DropdownMenuItem } from './DropdownMenu';
import { Modal } from './Modal';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { Toaster, toast } from './Toast';

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button">Before</button>
      <Button onClick={() => setOpen(true)}>Open size guide</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Size guide"
        description="Measurements in cm"
      >
        <input aria-label="Chest" />
        <button type="button">Save</button>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('opens with focus inside, traps Tab, closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Open size guide' });

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Size guide' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Measurements in cm');

    // Focus starts on the first focusable element (the close button).
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus(),
    );

    // Tab cycles inside: Close → Chest → Save → back to Close.
    await user.tab();
    expect(screen.getByLabelText('Chest')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    // The page behind is inert while open.
    expect(screen.getByText('Before').closest('[inert]')).not.toBeNull();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
    expect(screen.getByText('Before').closest('[inert]')).toBeNull();
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    await user.click(screen.getByRole('button', { name: 'Open size guide' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});

describe('Tabs', () => {
  it('moves selection with arrow keys, Home and End (roving tabindex)', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a" label="Info">
        <TabList>
          <Tab value="a">Details</Tab>
          <Tab value="b">Care</Tab>
          <Tab value="c">Shipping</Tab>
        </TabList>
        <TabPanel value="a">Details panel</TabPanel>
        <TabPanel value="b">Care panel</TabPanel>
        <TabPanel value="c">Shipping panel</TabPanel>
      </Tabs>,
    );
    const [a, b, c] = screen.getAllByRole('tab');
    expect(a).toHaveAttribute('aria-selected', 'true');
    expect(b).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');

    await user.tab();
    expect(a).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(b).toHaveFocus();
    expect(b).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Care' })).toBeVisible();

    await user.keyboard('{End}');
    expect(c).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}'); // wraps
    expect(a).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}'); // wraps back
    expect(c).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(a).toHaveAttribute('aria-selected', 'true');
  });
});

describe('DropdownMenu', () => {
  it('opens on Enter, moves with arrows, selects with Enter and returns focus', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger={<Button>Sort</Button>}>
        <DropdownMenuItem onSelect={() => onSelect('new')}>
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('low')}>
          Price: low
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('high')}>
          Price: high
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Sort' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.tab();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Newest' })).toHaveFocus(),
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Price: low' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}'); // wraps to the last
    expect(screen.getByRole('menuitem', { name: 'Price: high' })).toHaveFocus();
    await user.keyboard('p'); // typeahead: next item starting with "p"
    expect(screen.getByRole('menuitem', { name: 'Price: low' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('low');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu trigger={<Button>More</Button>}>
        <DropdownMenuItem>One</DropdownMenuItem>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'More' }));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'More' })).toHaveFocus();
  });
});

describe('toast', () => {
  afterEach(() => {
    act(() => toast.dismiss());
    vi.useRealTimers();
  });

  it('shows at most 3, queues the rest in order, and announces politely', async () => {
    render(<Toaster />);
    act(() => {
      for (let i = 1; i <= 4; i++) toast(`Toast ${i}`, { duration: 0 });
    });
    const region = await screen.findByRole('list');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.queryByText('Toast 4')).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole('button', { name: 'Dismiss notification' })[0],
    );
    await waitFor(() =>
      expect(screen.queryByText('Toast 1')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
  });

  it('runs the action and dismisses', async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.info('Item removed', {
        duration: 0,
        action: { label: 'Undo', onClick: undo },
      });
    });
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByText('Item removed')).not.toBeInTheDocument(),
    );
  });

  it('auto-dismisses after its duration', async () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast.success('Saved', { duration: 1000 });
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1100));
    vi.useRealTimers();
    await waitFor(() =>
      expect(screen.queryByText('Saved')).not.toBeInTheDocument(),
    );
  });
});
