import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';
import { Input } from './Input';
import { QuantityStepper } from './QuantityStepper';
import { Select } from './Select';
import { Textarea } from './Textarea';

describe('FormField', () => {
  it('labels the control', () => {
    render(
      <FormField label="Email">
        <Input type="email" />
      </FormField>,
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('links the hint with aria-describedby', () => {
    render(
      <FormField label="Phone" hint="11 digits">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Phone')).toHaveAccessibleDescription(
      '11 digits',
    );
  });

  it('marks the control invalid and describes it with the error', () => {
    render(
      <FormField label="Phone" hint="11 digits" error="Number is too short">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Phone');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('11 digits Number is too short');
  });

  it('is valid without an error', () => {
    render(
      <FormField label="Name">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Name');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('passes required and disabled to the control', () => {
    render(
      <FormField label="Name" required disabled>
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText(/Name/);
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('keeps describedby ids the control already has', () => {
    render(
      <>
        <p id="extra">Extra info</p>
        <FormField label="Name" hint="Hint">
          <Input aria-describedby="extra" />
        </FormField>
      </>,
    );
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription(
      'Hint Extra info',
    );
  });

  it('wires Select, Textarea and QuantityStepper the same way', () => {
    render(
      <>
        <FormField label="District" error="Choose one">
          <Select>
            <option>Dhaka</option>
          </Select>
        </FormField>
        <FormField label="Note" error="Too long">
          <Textarea />
        </FormField>
        <FormField label="Qty" error="Only 2 in stock">
          <QuantityStepper />
        </FormField>
      </>,
    );
    expect(screen.getByLabelText('District')).toHaveAccessibleDescription(
      'Choose one',
    );
    expect(screen.getByLabelText('Note')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Qty' }),
    ).toHaveAccessibleDescription('Only 2 in stock');
  });
});
