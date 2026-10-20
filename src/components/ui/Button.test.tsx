import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { IconButton } from './IconButton';

describe('Button', () => {
  it('renders a <button type="button"> by default', () => {
    render(<Button>Add to cart</Button>);
    const button = screen.getByRole('button', { name: 'Add to cart' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders a link when given href', () => {
    render(<Button href="/shop">Shop now</Button>);
    const link = screen.getByRole('link', { name: 'Shop now' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/shop');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('while loading: stays focusable, is busy, ignores clicks and submits', async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent as SubmitEvent)}>
        <Button type="submit" loading onClick={onClick}>
          Place order
        </Button>
      </form>,
    );
    // The label stays the accessible name while the spinner shows.
    const button = screen.getByRole('button', { name: 'Place order' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  it('uses aria-label as its accessible name', () => {
    render(
      <IconButton aria-label="Open cart">
        <svg />
      </IconButton>,
    );
    expect(
      screen.getByRole('button', { name: 'Open cart' }),
    ).toBeInTheDocument();
  });

  it('requires aria-label (type check)', () => {
    // @ts-expect-error aria-label is required: an icon has no text to announce
    const element = <IconButton>x</IconButton>;
    expect(element).toBeTruthy();
  });
});
