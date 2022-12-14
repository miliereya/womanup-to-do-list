import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { AuthContextProvider } from './context/AuthContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

//<AuthContextProvider> - Wrapping app with user context
root.render(
  <React.StrictMode>
    <AuthContextProvider> 
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
