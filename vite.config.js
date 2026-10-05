import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // chạy được từ thư mục bất kỳ / GitHub Pages
  // Chế độ 3D được tải lười (lazy). Khai báo trước các thư viện 3D để Vite không phải
  // "tối ưu lại" giữa chừng — nguyên nhân gây màn hình đen khi mở #/3d lần đầu.
  optimizeDeps: {
    include: [
      'three', '@react-three/fiber', 'framer-motion',
      '@react-three/drei/core/OrbitControls.js', '@react-three/drei/core/Sparkles.js',
    ],
  },
  build: { chunkSizeWarningLimit: 1500 },
});
