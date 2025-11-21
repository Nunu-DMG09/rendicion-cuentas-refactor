import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import RendicionPage from './pages/RendicionPage'
import RegistrationPage from './pages/RegistrationPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rendicion/:rendicionId" element={<RendicionPage />} />
          <Route path="/register/:rendicionId" element={<RegistrationPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
