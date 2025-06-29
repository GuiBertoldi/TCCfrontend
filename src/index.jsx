import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './index.css'
import { BrowserRouter } from "react-router-dom";

import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: process.env.REACT_APP_DD_RUM_APP_ID,
  clientToken:   process.env.REACT_APP_DD_RUM_CLIENT_TOKEN,
  site:          'datadoghq.com',
  service:       process.env.REACT_APP_DD_RUM_SERVICE,
  env:           process.env.REACT_APP_ENV,
  version:       process.env.REACT_APP_VERSION,
  sessionSampleRate:       100,
  sessionReplaySampleRate: 20,
  defaultPrivacyLevel:     'mask-user-input',
  plugins: [reactPlugin({ router: true }) ],
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
