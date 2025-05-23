import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      devTarget: 'es2022',
      plugins: [['@swc/plugin-emotion', {}]],
    }),
  ],
});
