import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 10000, // El puerto en el que Render espera que esté tu aplicación
    host: '0.0.0.0', // Exponer a todas las interfaces de red
  },
})
