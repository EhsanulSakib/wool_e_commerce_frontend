'use client';

import { makeStore, type RootState } from '@/store/store';
import { useState } from 'react';
import { Provider } from 'react-redux';

/**
 * Creates the Redux store once for this browser session (the useState
 * initializer runs only on the first render) and makes it available to all
 * client components. Server Components don't use Redux; they fetch their own
 * data with fetch().
 */
export default function StoreProvider({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
}) {
  const [store] = useState(() => makeStore(preloadedState));
  return <Provider store={store}>{children}</Provider>;
}
