import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout, AdminLayout } from './layouts'
import { SidebarProvider } from './providers/SidebarProvider'
import HomePage from './pages/HomePage'
import RendicionPage from './pages/RendicionPage'
import RegistrationPage from './pages/RegistrationPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import NuevaRendicionPage from '../features/rendicion-admin/pages/NuevaRendicionPage'
import VerRendicionesPage from '../features/rendicion-admin/pages/VerRendicionesPage'

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/rendicion/:rendicionId" element={<RendicionPage />} />
            <Route path="/register/:rendicionId" element={<RegistrationPage />} />
          </Route>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="rendiciones/nueva-rendicion" element={<NuevaRendicionPage />} />
            <Route path="rendiciones/ver-rendiciones" element={<VerRendicionesPage />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </Router>
  )
}

export default App
