import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuantityStepper } from './QuantityStepper';

function setup(props: Parameters<typeof QuantityStepper>[0] = {}) {
  const onValueChange = vi.fn();
  render(<QuantityStepper onValueChange={onValueChange} {...props} />);
  return {
    onValueChange,
    input: screen.getByRole('spinbutton', { name: 'Quantity' }),
    plus: screen.getByRole('button', { name: 'Increase quantity' }),
    minus: screen.getByRole('button', { name: 'Decrease quantity' }),
  };
}

describe('QuantityStepper', () => {
  it('exposes the value as a spinbutton with min and max', () => {
    const { input } = setup({ defaultValue: 2, min: 1, max: 5 });
    expect(input).toHaveValue('2');
    expect(input).toHaveAttribute('aria-valuenow', '2');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '5');
  });

  it('+ and − change the value and report it', async () => {
    const { input, plus, minus, onValueChange } = setup({ defaultValue: 2 });
    await userEvent.click(plus);
    expect(input).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(minus);
    expect(input).toHaveValue('2');
  });

  it('stays at max and disables + there', async () => {
    const { input, plus, onValueChange } = setup({ defaultValue: 5, max: 5 });
    expect(plus).toBeDisabled();
    await userEvent.click(plus);
    expect(input).toHaveValue('5');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disables − at min', () => {
    const { minus } = setup({ defaultValue: 1, min: 1 });
    expect(minus).toBeDisabled();
  });

  it('keyboard: arrows step, Home/End jump to min/max', async () => {
    const { input } = setup({ defaultValue: 3, min: 1, max: 10 });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');
    expect(input).toHaveValue('4');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveValue('2');
    await userEvent.keyboard('{End}');
    expect(input).toHaveValue('10');
    await userEvent.keyboard('{Home}');
    expect(input).toHaveValue('1');
  });

  it('clamps a typed number above max on Enter', async () => {
    const { input, onValueChange } = setup({ defaultValue: 1, max: 10 });
    await userEvent.clear(input);
    await userEvent.type(input, '999{Enter}');
    expect(input).toHaveValue('10');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it('ignores letters and reverts empty input on blur', async () => {
    const { input, onValueChange } = setup({ defaultValue: 4 });
    await userEvent.clear(input);
    await userEvent.type(input, 'abc');
    expect(input).toHaveValue(''); // letters are never accepted
    await userEvent.tab();
    expect(input).toHaveValue('4'); // back to the last valid value
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('clamps 0 up to min', async () => {
    const { input } = setup({ defaultValue: 3, min: 1 });
    await userEvent.clear(input);
    await userEvent.type(input, '0');
    await userEvent.tab();
    expect(input).toHaveValue('1');
  });

  it('announces the committed value', async () => {
    const { plus } = setup({ defaultValue: 1 });
    await userEvent.click(plus);
    expect(screen.getByText('Quantity: 2')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
