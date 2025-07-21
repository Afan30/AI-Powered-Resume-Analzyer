import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import './index.css'
import './Styles/navbar.css'
import './Styles/home.css'

import App from './App.jsx'
import './index.css'
import './Styles/jobpost.css'
import './Styles/resumeupload.css'
import './Styles/dashboard.css'
import './Styles/matchresume.css'
import './Styles/optimize.css'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
