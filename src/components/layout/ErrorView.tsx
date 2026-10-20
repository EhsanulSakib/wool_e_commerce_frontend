'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/layout';

/*
 * Body of the error boundaries (app/error.tsx, app/(shop)/error.tsx).
 * Never shows the raw error: Server Component errors only carry a digest,
 * which is shown as a reference code for support.
 */
export function ErrorView({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Module 41/42: send to an error-reporting service.
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && 'digest' in error
      ? String((error as Error & { digest?: string }).digest)
      : undefined;

  return (
    <Container size="narrow" className="py-section text-center">
      <p className="text-caption text-muted-fg uppercase">
        Something went wrong
      </p>
      <h1 className="mt-3 text-h2">This page didn’t load</h1>
      <p className="mx-auto mt-4 max-w-prose text-body text-muted-fg">
        It’s probably temporary. Try again, and if it keeps happening, contact
        us and mention the code below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => retry()}
          iconLeft={<Icon icon={RotateCcw} size="sm" />}
        >
          Try again
        </Button>
        <Button href="/" variant="outline">
          Go to the home page
        </Button>
      </div>
      {digest && (
        <p className="mt-6 text-caption text-muted-fg">
          Reference: <code>{digest}</code>
        </p>
      )}
    </Container>
  );
}
