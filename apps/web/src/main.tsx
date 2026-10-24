import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; import './style.css';
document.documentElement.style.setProperty('--haulx-base', import.meta.env.BASE_URL); createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
