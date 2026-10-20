'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

/*
 * Throws during render on demand, to check the error boundary
 * (app/error.tsx): the error view shows, and "Try again" renders this page
 * again (back in its normal state).
 */
export default function ErrorTestPage() {
  const [crash, setCrash] = useState(false);
  if (crash) throw new Error('Test error from /dev/error');

  return (
    <>
      <h1 className="text-h1">Error boundary test</h1>
      <p className="mt-4 mb-8 max-w-prose text-body-lg text-muted-fg">
        Press the button to throw an error while rendering this page.
      </p>
      <Button onClick={() => setCrash(true)}>Throw an error</Button>
    </>
  );
}
