import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Dedicated Vitest config (takes precedence over vite.config.js).
// The Vite build config uses root: 'client'; tests run from the project root instead.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // DOM tests opt into jsdom via a per-file docblock
    globals: false,
    setupFiles: ['./test/setup.js'],
    include: ['server/**/*.test.js', 'client/src/**/*.test.js'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      all: true,
      // Unit-test coverage is measured over application logic. UI components,
      // the Express wiring (app.js/routes) and the entrypoint are integration
      // concerns and are intentionally out of the unit scope (see result.md).
      include: [
        'server/config/**/*.js',
        'server/controllers/**/*.js',
        'server/middleware/**/*.js',
        'server/models/**/*.js',
        'server/seed/**/*.js',
        'server/utils/**/*.js',
        'client/src/services/**/*.js',
        'client/src/hooks/**/*.js',
        'client/src/lib/**/*.js',
      ],
      exclude: ['**/*.test.js'],
      reporter: ['text', 'json-summary'],
    },
  },
});
