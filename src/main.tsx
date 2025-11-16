import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Unregister service worker in development to prevent caching issues
if (import.meta.env.DEV) {
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('🔄 Service Worker unregistered in development mode');
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)






