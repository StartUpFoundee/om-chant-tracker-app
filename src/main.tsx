
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hasUserIdentity } from './lib/user-identity.ts';

// For first-time users, redirect to welcome flow
const redirectFirstTimeUsers = () => {
  // Only redirect if this is a first-time user and not already on welcome page
  if (!hasUserIdentity() && window.location.pathname !== '/welcome' && !localStorage.getItem('welcomeSkipped')) {
    window.location.href = '/welcome';
  }
};

// Check for first-time user after a small delay
setTimeout(redirectFirstTimeUsers, 500);

createRoot(document.getElementById("root")!).render(<App />);
