import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'export-vendor': ['xlsx', 'jspdf', 'html2canvas'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          
          // App chunks  
          'dashboard': ['./src/components/Dashboard.tsx', './src/components/Chart.tsx'],
          'forms': ['./src/components/Sales.tsx', './src/components/Expenses.tsx'],
          'reports': ['./src/components/Reports.tsx', './src/utils/export.ts'],
          'shared': ['./src/components/Layout.tsx', './src/components/Cash.tsx'],
        },
      },
    },
  },
});
