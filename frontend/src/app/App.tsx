import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout, AdminLayout } from './layouts'
import HomePage from './pages/HomePage'
import RendicionPage from './pages/RendicionPage'
import RegistrationPage from './pages/RegistrationPage'
import { SidebarProvider } from './providers/SidebarProvider'

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rendicion/:rendicionId" element={<RendicionPage />} />
            <Route path="/register/:rendicionId" element={<RegistrationPage />} />
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<h1>hola:v</h1>} />
            </Route>
          </Routes>
        </Layout>
      </SidebarProvider>
    </Router>
  )
}

export default App
