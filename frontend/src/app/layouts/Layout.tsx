import Header from './components/Header'
import { Footer } from '../../features/footer/components/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}