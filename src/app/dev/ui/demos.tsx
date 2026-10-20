'use client';

import { ArrowRight, Mail, ShoppingBag } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  FormField,
  Icon,
  Input,
  PasswordInput,
  QuantityStepper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from '@/components/ui';

/* Interactive demos for /dev/ui (they need state, so they're client components). */

export function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        loading={loading}
        iconLeft={<Icon icon={ShoppingBag} size="sm" />}
        onClick={() => {
          setClicks((c) => c + 1);
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        Add to cart
      </Button>
      <Button variant="outline" loading>
        Always loading
      </Button>
      <span className="text-small text-muted-fg" aria-live="polite">
        Clicks registered: {clicks}
      </span>
    </div>
  );
}

export function StepperDemo() {
  const [qty, setQty] = useState(2);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="grid gap-2">
        <QuantityStepper value={qty} onValueChange={setQty} max={5} />
        <span className="text-caption text-muted-fg">
          Controlled, max 5 · value: {qty}
        </span>
      </div>
      <div className="grid gap-2">
        <QuantityStepper size="sm" defaultValue={9} max={9} />
        <span className="text-caption text-muted-fg">Small, at max</span>
      </div>
      <div className="grid gap-2">
        <QuantityStepper disabled />
        <span className="text-caption text-muted-fg">Disabled</span>
      </div>
    </div>
  );
}

export function ControlsDemo() {
  const [notify, setNotify] = useState(true);

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="grid content-start gap-4">
        <Checkbox label="Remember me" defaultChecked />
        <Checkbox
          label="Subscribe to the newsletter"
          description="One email a month. Unsubscribe anytime."
        />
        <Checkbox label="Select all (some selected)" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled, checked" disabled defaultChecked />
      </div>
      <div className="grid content-start gap-4">
        <Switch
          label="Order updates by email"
          checked={notify}
          onCheckedChange={setNotify}
        />
        <Switch label="Show prices in USD" description="Applies immediately." />
        <Switch label="Disabled" disabled />
      </div>
      <RadioGroup label="Delivery area" defaultValue="inside">
        <Radio
          value="inside"
          label="Inside Dhaka"
          description="৳60 · 1–2 days"
        />
        <Radio
          value="outside"
          label="Outside Dhaka"
          description="৳120 · 2–4 days"
        />
        <Radio
          value="intl"
          label="International"
          description="Unavailable for this order"
          disabled
        />
      </RadioGroup>
      <RadioGroup
        label="Size"
        orientation="horizontal"
        error="Please choose a size."
        required
      >
        {['S', 'M', 'L', 'XL'].map((s) => (
          <Radio key={s} value={s} label={s} />
        ))}
      </RadioGroup>
    </div>
  );
}

/** A small form with client-side validation, to see FormField errors in action. */
export function FormDemo() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get('name')).trim()) next.name = 'Please enter your name.';
    if (!/^01[3-9]\d{8}$/.test(String(data.get('phone'))))
      next.phone = 'Enter an 11-digit Bangladeshi number, e.g. 01712345678.';
    if (!data.get('district')) next.district = 'Please choose a district.';
    setErrors(next);
    setSent(Object.keys(next).length === 0);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid max-w-md gap-5">
      <FormField label="Full name" error={errors.name} required>
        <Input name="name" autoComplete="name" />
      </FormField>
      <FormField
        label="Phone"
        hint="We call to confirm Cash on Delivery orders."
        error={errors.phone}
        required
      >
        <Input
          name="phone"
          type="tel"
          inputMode="numeric"
          prefix="+88"
          autoComplete="tel-national"
        />
      </FormField>
      <FormField label="District" error={errors.district} required>
        <Select name="district" placeholder="Choose a district" defaultValue="">
          <option value="dhaka">Dhaka</option>
          <option value="chattogram">Chattogram</option>
          <option value="sylhet">Sylhet</option>
        </Select>
      </FormField>
      <FormField label="Delivery note" optional>
        <Textarea
          name="note"
          minRows={2}
          maxRows={6}
          placeholder="Gate code, landmark…"
        />
      </FormField>
      <Button type="submit" iconRight={<Icon icon={ArrowRight} size="sm" />}>
        Place order
      </Button>
      {sent && (
        <p role="status" className="text-small text-success">
          Looks good. (Nothing is sent; this is a demo.)
        </p>
      )}
    </form>
  );
}

export function InputsDemo() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField label="Email" hint="We'll send the receipt here.">
        <Input
          type="email"
          placeholder="you@example.com"
          prefix={<Icon icon={Mail} size="sm" />}
        />
      </FormField>
      <FormField label="Password">
        <PasswordInput placeholder="At least 8 characters" />
      </FormField>
      <FormField label="Price" hint="Prefix and suffix text">
        <Input
          inputMode="decimal"
          prefix="৳"
          suffix="BDT"
          defaultValue="1,250"
        />
      </FormField>
      <FormField label="Coupon" error="This coupon has expired.">
        <Input defaultValue="WINTER10" />
      </FormField>
      <FormField label="Small input">
        <Input size="sm" placeholder="sm" />
      </FormField>
      <FormField label="Large input">
        <Input size="lg" placeholder="lg" />
      </FormField>
      <FormField label="Disabled" disabled>
        <Input defaultValue="Can't edit this" />
      </FormField>
      <FormField label="Sort by">
        <Select defaultValue="new">
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </Select>
      </FormField>
      <FormField
        label="Message"
        hint="Grows as you type (2–5 rows), then scrolls."
        className="sm:col-span-2"
      >
        <Textarea minRows={2} maxRows={5} placeholder="Write a few lines…" />
      </FormField>
    </div>
  );
}
