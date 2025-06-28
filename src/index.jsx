import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

console.log('>>>> RUM VARS:', {
  APP_ID: process.env.REACT_APP_DD_RUM_APP_ID,
  TOKEN: process.env.REACT_APP_DD_RUM_CLIENT_TOKEN
});

datadogRum.init({
  applicationId: process.env.REACT_APP_DD_RUM_APP_ID,
  clientToken:   process.env.REACT_APP_DD_RUM_CLIENT_TOKEN,
  site:          'datadoghq.com',
  service:       process.env.REACT_APP_DD_RUM_SERVICE || 'tcc-frontend',
  env:           process.env.REACT_APP_ENV       || 'production',
  version:       process.env.REACT_APP_VERSION   || '1.0.0',
  sessionSampleRate:       100,
  sessionReplaySampleRate: 20,
  defaultPrivacyLevel:     'mask-user-input',
  plugins: [ reactPlugin({ router: true }) ],
    intakeUrls: {
    rum:           'https://rum-http-intake.logs.datadoghq.com/v1/input',
    sessionReplay: 'https://session-replay-http-intake.logs.datadoghq.com/v1/input'
  }
})

window.datadogRum = datadogRum

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
