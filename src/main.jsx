import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthenticationProvider } from './contexts/authentication-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingProvider } from './contexts/onboarding-context'
const queryClient = new QueryClient()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthenticationProvider>
      <OnboardingProvider> {/* <-- wrap here */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </OnboardingProvider>
    </AuthenticationProvider>
  </BrowserRouter>,
)
