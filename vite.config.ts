import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'assets/js',
    emptyOutDir: false,
    minify: false, 
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'LogisticsRouting',
      fileName: 'main',
      formats: ['es']
    },
    rollupOptions: {
      external: ['fs', 'path'],
      output: {
        
        preserveModules: false,
        
        compact: false,
      }
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});