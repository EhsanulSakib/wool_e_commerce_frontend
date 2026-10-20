'use client';

import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

/**
 * Newsletter sign-up, UI only: the newsletter itself is a post-MVP module.
 * Validates the email, then confirms with a toast.
 */
export function NewsletterForm() {
  const [error, setError] = useState<string>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address, like you@example.com.');
      return;
    }
    setError(undefined);
    form.reset();
    toast.success('You’re on the list', {
      description: 'New collections and restocks, about once a month.',
    });
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-3">
      <FormField
        label="Get new collections first"
        hint="About once a month. Unsubscribe anytime."
        error={error}
      >
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          suffix={
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              aria-label="Subscribe"
              className="-mr-2 size-8 px-0"
            >
              <Icon icon={ArrowRight} size="sm" />
            </Button>
          }
        />
      </FormField>
    </form>
  );
}
