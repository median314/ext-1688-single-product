import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, extendTheme,  } from '@chakra-ui/react'
import { CookiesProvider } from 'react-cookie'
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://1f8c7fc6553c44618dcc06d36bda4f33@glitchtip-u15389.vm.elestio.app/12',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  // tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  tracesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/,],
},);

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}
const theme = extendTheme({ config })

ReactDOM.createRoot(document.getElementById('extension')).render(
  // <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ChakraProvider>

  // </React.StrictMode>,
)
