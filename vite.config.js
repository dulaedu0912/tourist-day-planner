import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: {
    outDir: '../public', // Express serves this folder
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // In development the UI runs on 5173 and the API on 3000.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
