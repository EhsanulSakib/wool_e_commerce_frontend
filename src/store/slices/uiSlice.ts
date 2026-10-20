import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Global UI state that several components need to control. Example: in
 * module 30, "Add to cart" on the product page opens the cart drawer that
 * lives in the navbar. State that only one component uses stays local
 * (useState) instead.
 */
export type CurrencyCode = 'BDT' | 'USD';

export type UiState = {
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  /**
   * Currency picked in the switchers (navbar + mobile menu). UI only for
   * now: module 21 replaces this with a cookie that re-prices the page.
   */
  currency: CurrencyCode;
};

const initialState: UiState = {
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  currency: 'BDT',
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
    openMobileMenu(state) {
      state.isMobileMenuOpen = true;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    openSearch(state) {
      state.isSearchOpen = true;
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch(state) {
      state.isSearchOpen = false;
    },
    /** Called on route changes. Keeps the currency. */
    closeAllOverlays(state) {
      state.isCartDrawerOpen = false;
      state.isMobileMenuOpen = false;
      state.isSearchOpen = false;
    },
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
    },
  },
  selectors: {
    selectIsCartDrawerOpen: (state) => state.isCartDrawerOpen,
    selectIsMobileMenuOpen: (state) => state.isMobileMenuOpen,
    selectIsSearchOpen: (state) => state.isSearchOpen,
    selectCurrency: (state) => state.currency,
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openMobileMenu,
  toggleMobileMenu,
  closeMobileMenu,
  openSearch,
  toggleSearch,
  closeSearch,
  closeAllOverlays,
  setCurrency,
} = uiSlice.actions;

export const {
  selectIsCartDrawerOpen,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
  selectCurrency,
} = uiSlice.selectors;
