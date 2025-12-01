import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout, AdminLayout } from './layouts'
import { SidebarProvider, AuthProvider } from './providers'
import HomePage from './pages/HomePage'
import RendicionPage from './pages/RendicionPage'
import RegistrationPage from './pages/RegistrationPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import NuevaRendicionPage from '../features/rendicion-admin/pages/NuevaRendicionPage'
import VerRendicionesPage from '../features/rendicion-admin/pages/VerRendicionesPage'
import EjesTematicosPage from '../features/ejes-tematicos/pages/EjesTematicosPage'
import ReportesPage from '../features/reportes/pages/ReportesPage'
import VerPreguntasPage from '../features/preguntas/pages/VerPreguntasPage'
import { Toaster } from 'sonner'
import { LoginForm } from '@/features/login/pages/Login'

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/rendicion/:rendicionId" element={<RendicionPage />} />
              <Route path="/register/:rendicionId" element={<RegistrationPage />} />
            </Route>
            <Route path='/auth/login' element={<LoginForm />} />
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="rendiciones/nueva-rendicion" element={<NuevaRendicionPage />} />
              <Route path="rendiciones/ver-rendiciones" element={<VerRendicionesPage />} />
              <Route path="ejes" element={<EjesTematicosPage />} />
              <Route path="reportes" element={<ReportesPage />} />
              <Route path="preguntas/ver" element={<VerPreguntasPage />} />
            </Route>
          </Routes>
          <Toaster richColors closeButton />
        </SidebarProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
