<<<<<<< HEAD
// index.tsx (DISABLED)
// File ini sengaja dimatikan
// Supaya tidak bentrok dengan index.html

export {}
=======

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> b52a159 (Initial commit SATMOKO Creative Studio AI)
