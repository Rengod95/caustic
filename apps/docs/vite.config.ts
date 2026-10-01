import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

const here = import.meta.dirname;
const repo = resolve(here, '../..');
const pkg = (p: string) => resolve(repo, 'packages', p);

// apps/docs is not a workspace package with its own node_modules, so the workspace packages
// are aliased to their sources (the same files the gateway renders).
export default defineConfig({
  root: here,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@caustic\/react$/, replacement: pkg('react/src/index.ts') },
      { find: /^@caustic\/react\/styles\.css$/, replacement: pkg('react/src/styles.css') },
      { find: /^@caustic\/spec$/, replacement: pkg('spec/src/index.ts') },
      { find: /^@caustic\/spec\/all$/, replacement: pkg('spec/src/all.ts') },
      { find: /^@caustic\/tokens\/tokens$/, replacement: pkg('tokens/dist/tokens.mjs') },
      { find: /^@caustic\/tokens\/contrast$/, replacement: pkg('tokens/dist/contrast.json') },
      { find: /^lucide-react$/, replacement: pkg('react/node_modules/lucide-react') },
    ],
  },
  // allowedHosts: temporary tunnels (cloudflared) for remote review.
  server: { port: 5180, strictPort: false, allowedHosts: true, fs: { allow: [repo] } },
  preview: { port: 5181, allowedHosts: true },
  optimizeDeps: {
    // Scan every fixture up front so lazy component pages never trigger a mid-session dependency reload.
    entries: [resolve(here, 'index.html'), resolve(repo, 'packages/react/src/components/*/*.fixture.tsx')],
  },
  build: { outDir: resolve(repo, 'dist-docs'), emptyOutDir: true, chunkSizeWarningLimit: 4000 },
});
