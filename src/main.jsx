import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Font đóng gói sẵn (chạy offline vẫn đúng dấu tiếng Việt)
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/700.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/lora/500-italic.css';
import '@fontsource/playfair-display/700.css';
import './theme/tokens.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

requestAnimationFrame(() => document.getElementById('boot')?.remove());
