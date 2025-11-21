import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import RendicionPage from './pages/RendicionPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rendicion/:rendicionId" element={<RendicionPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
