import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from './routes.jsx'
import './tailwind.css'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>,
)
