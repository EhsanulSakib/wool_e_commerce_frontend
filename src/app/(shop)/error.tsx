'use client';

import { ErrorView } from '@/components/layout/ErrorView';

// Errors in a storefront page: the navbar and footer stay, the page body
// shows a retry. (Error boundaries must be Client Components.)
export default function ShopError(props: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorView {...props} />;
}
