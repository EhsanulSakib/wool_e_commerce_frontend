'use client';

import { ErrorView } from '@/components/layout/ErrorView';

// Errors outside the storefront group (e.g. /dev pages). Errors in the root
// layout itself are handled by global-error.tsx.
export default function RootError(props: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorView {...props} />;
}
