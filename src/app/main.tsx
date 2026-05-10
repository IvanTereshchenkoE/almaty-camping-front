import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './providers';
import { App } from './App';
import { useAuthStore } from '@/entities/user/model';
import './styles/index.css';

// Init auth before render
useAuthStore.getState().init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
