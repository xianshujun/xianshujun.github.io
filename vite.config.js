import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ui': ['react', 'react-dom', '@radix-ui/themes'],
          'animation': ['gsap', 'motion/react'],
        },
      },
    },
  },
});
