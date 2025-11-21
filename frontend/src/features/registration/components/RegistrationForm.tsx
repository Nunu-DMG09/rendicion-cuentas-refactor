import React, { useState } from 'react'
import type { RegistrationFormData, Gender, Role } from '../types/registration'

type Props = {
  onSubmitAttendee: (data: RegistrationFormData) => void
  onSubmitSpeaker: (data: RegistrationFormData) => void
  isLoading: boolean
  rendicionTitle: string
  rendicionDate: string
}

export default function RegistrationForm({ onSubmitAttendee, onSubmitSpeaker, isLoading, rendicionTitle, rendicionDate }: Props) {
  const [dni, setDni] = useState('')
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [role, setRole] = useState<Role>('attendee')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dni.trim() || !fullName.trim()) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    if (dni.length !== 8) {
      alert('El DNI debe tener 8 dígitos')
      return
    }

    const formData: RegistrationFormData = {
      dni: dni.trim(),
      fullName: fullName.trim(),
      gender,
      role
    }

    if (role === 'speaker') {
      onSubmitSpeaker(formData)
    } else {
      onSubmitAttendee(formData)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="w-16 h-16 bg-[#002f59] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{rendicionTitle}</h1>
        <p className="text-gray-600">{rendicionDate}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-900 mb-2">
            DNI*
          </label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 8)
              setDni(value)
            }}
            placeholder="12345678"
            maxLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002f59] focus:border-[#002f59] transition-colors"
            required
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
            Nombres y Apellidos
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Carlos Pérez García"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002f59] focus:border-[#002f59] transition-colors"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Sexo
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
              />
              <span className="ml-2 text-gray-700">Masculino</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
              />
              <span className="ml-2 text-gray-700">Femenino</span>
            </label>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Participación
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="attendee"
                checked={role === 'attendee'}
                onChange={(e) => setRole(e.target.value as Role)}
                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
              />
              <span className="ml-2 text-gray-700">Asistente</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="speaker"
                checked={role === 'speaker'}
                onChange={(e) => setRole(e.target.value as Role)}
                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
              />
              <span className="ml-2 text-gray-700">Orador</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#002f59] text-white font-medium rounded-lg hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Procesando...'
            ) : role === 'speaker' ? (
              <>
                Siguiente
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}