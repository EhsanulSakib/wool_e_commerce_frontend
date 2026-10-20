import { describe, expect, it } from 'vitest';
import { makeStore } from '../store';
import {
  closeAllOverlays,
  openCartDrawer,
  setCurrency,
  selectIsCartDrawerOpen,
  selectIsMobileMenuOpen,
  toggleMobileMenu,
  toggleSearch,
  uiSlice,
} from './uiSlice';

describe('uiSlice', () => {
  it('starts with every overlay closed', () => {
    const state = uiSlice.reducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      isCartDrawerOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      currency: 'BDT',
    });
  });

  it('opens and toggles overlays through the store', () => {
    const store = makeStore();

    store.dispatch(openCartDrawer());
    store.dispatch(toggleMobileMenu());

    expect(selectIsCartDrawerOpen(store.getState())).toBe(true);
    expect(selectIsMobileMenuOpen(store.getState())).toBe(true);
  });

  it('closeAllOverlays closes everything but keeps the currency', () => {
    const store = makeStore();
    store.dispatch(openCartDrawer());
    store.dispatch(toggleSearch());
    store.dispatch(setCurrency('USD'));

    store.dispatch(closeAllOverlays());

    expect(store.getState().ui).toEqual({
      isCartDrawerOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      currency: 'USD',
    });
  });

  it('gives every makeStore() call its own state', () => {
    const a = makeStore();
    const b = makeStore();

    a.dispatch(openCartDrawer());

    expect(selectIsCartDrawerOpen(b.getState())).toBe(false);
  });
});
