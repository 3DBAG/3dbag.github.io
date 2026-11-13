import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: 'static/home-map',
    emptyOutDir: true,
    rollupOptions: {
      input: 'assets/js/home-map.js',
      output: { entryFileNames: 'home-map.js', assetFileNames: '[name][extname]' }
    }
  }
});
