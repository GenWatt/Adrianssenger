import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
)
