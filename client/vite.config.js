import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://residenceradar-mh1u.onrender.com/',
        secure: false,
      },
    },
  },
  plugins: [react()],
})
