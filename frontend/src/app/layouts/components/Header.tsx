import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import logo from '../../../assets/logo.png'
import { IoAddCircleSharp } from "react-icons/io5"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-5">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.img
                src={logo}
                alt="Logo Municipalidad José Leonardo Ortiz"
                className="h-20 w-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.div
                className="leading-tight hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
                <div className="text-2xl font-semibold text-primary-dark">Municipalidad José Leonardo Ortiz</div>
                <div className="text-lg text-gray-500">Rendición de Cuentas</div>
              </motion.div>
            </Link>
          </motion.div>

          <div className="flex items-center gap-3">
            <Link
              to="/register/2"
              className="inline-flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-dark text-white hover:bg-primary-dark/90 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Registrarse"
            >
              Registra tu asistencia
              <IoAddCircleSharp className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}