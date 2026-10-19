import { createSlice } from '@reduxjs/toolkit';

/**
 * Global UI state that several components need to control. Example: in
 * module 30, "Add to cart" on the product page opens the cart drawer that
 * lives in the navbar. State that only one component uses stays local
 * (useState) instead.
 */
export type UiState = {
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
};

const initialState: UiState = {
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCartDrawer(state) {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch(state) {
      state.isSearchOpen = false;
    },
    /** Called on route changes and when resizing to desktop. */
    closeAllOverlays() {
      return initialState;
    },
  },
  selectors: {
    selectIsCartDrawerOpen: (state) => state.isCartDrawerOpen,
    selectIsMobileMenuOpen: (state) => state.isMobileMenuOpen,
    selectIsSearchOpen: (state) => state.isSearchOpen,
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
  closeAllOverlays,
} = uiSlice.actions;

export const {
  selectIsCartDrawerOpen,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
} = uiSlice.selectors;
