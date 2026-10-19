import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { uiSlice } from './slices/uiSlice';

/**
 * Every slice is registered here. Later modules add theirs
 * (auth in module 15, cart and wishlist in module 30…).
 */
const rootReducer = combineSlices(uiSlice);

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Creates a new store. With the App Router the server renders requests from
 * many users, so there must never be one global store shared between them:
 * each request (and each browser tab) gets its own store from this function.
 * `preloadedState` lets the server pass data in (e.g. the current user).
 */
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
