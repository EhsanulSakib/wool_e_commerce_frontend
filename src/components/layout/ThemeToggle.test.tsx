import ThemeProvider from '@/providers/ThemeProvider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

function renderSwitcher() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('has an accessible name', () => {
    renderSwitcher();

    expect(
      screen.getByRole('button', { name: 'Toggle dark mode' }),
    ).toBeInTheDocument();
  });

  it('switches data-theme on <html> and remembers the choice', async () => {
    const user = userEvent.setup();
    renderSwitcher();
    const button = screen.getByRole('button', { name: 'Toggle dark mode' });

    await user.click(button);
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark'),
    );
    expect(localStorage.getItem('theme')).toBe('dark');

    await user.click(button);
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-theme', 'light'),
    );
  });
});
