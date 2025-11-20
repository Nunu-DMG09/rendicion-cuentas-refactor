import React from 'react'
import Header from './components/Header'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      {/* Main ahora ocupa todo el ancho. Los componentes internos controlan su propio max-width cuando lo necesiten owo*/}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}