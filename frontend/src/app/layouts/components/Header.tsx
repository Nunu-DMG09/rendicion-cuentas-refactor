import React from 'react'
import logo from '../../../assets/logo.png'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="Logo Municipalidad José Leonarlo Ortiz" className="h-10 w-auto" />
            <div className="leading-tight">
              <div className="text-lg font-semibold text-[#002f59]">Municipalidad José Leonarlo Ortiz</div>
              <div className="text-xs text-gray-500">Rendición de Cuentas</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-[#002f59] text-white hover:bg-[#002f59] hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Registrarse"
            >
              Registra tu asistencia
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}