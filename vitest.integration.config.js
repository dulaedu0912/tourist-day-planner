// Dedicated config for the INTEGRATION suite (supertest + real Atlas).
// Separate from the default config so that:
//  - `npm test` stays the fast OFFLINE unit suite (no database needed)
//  - `npm run test:integration` targets only the integration folder
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['test/integration/**/*.test.js'],
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 20000, // network + Atlas latency
    hookTimeout: 30000, // first connection + collection wipe
  },
});
