import { describe, expect, it } from 'vitest';
import { makeStore } from '../store';
import {
  closeAllOverlays,
  openCartDrawer,
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
    });
  });

  it('opens and toggles overlays through the store', () => {
    const store = makeStore();

    store.dispatch(openCartDrawer());
    store.dispatch(toggleMobileMenu());

    expect(selectIsCartDrawerOpen(store.getState())).toBe(true);
    expect(selectIsMobileMenuOpen(store.getState())).toBe(true);
  });

  it('closeAllOverlays closes everything', () => {
    const store = makeStore();
    store.dispatch(openCartDrawer());
    store.dispatch(toggleSearch());

    store.dispatch(closeAllOverlays());

    expect(store.getState().ui).toEqual({
      isCartDrawerOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
    });
  });

  it('gives every makeStore() call its own state', () => {
    const a = makeStore();
    const b = makeStore();

    a.dispatch(openCartDrawer());

    expect(selectIsCartDrawerOpen(b.getState())).toBe(false);
  });
});
