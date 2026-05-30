import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AppDialogProvider } from './components/AppDialog';

import './estilos/reset.css';
import './estilos/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppDialogProvider>
        <App />
      </AppDialogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
