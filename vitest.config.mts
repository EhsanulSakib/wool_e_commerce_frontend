import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Components import CSS (e.g. lenis.css). Tests don't need it processed,
  // and the app's PostCSS config (Tailwind) isn't meant for Vite: use none.
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    // One jsdom per worker instead of per file (it took ~80% of the run and
    // caused worker start-up timeouts); test files stay isolated.
    pool: 'vmThreads',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
