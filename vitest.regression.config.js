// Dedicated config for the REGRESSION suite (user journeys over the real app).
// Same runtime contract as the integration suite; kept as its own config so
// `npm run test:regression` can run alone (useful after any future change).
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['test/regression/**/*.test.js'],
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
