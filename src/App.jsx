import { Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App
