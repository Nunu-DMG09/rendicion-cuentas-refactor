import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaIdCard } from 'react-icons/fa'
import type { RegistrationFormData, Gender, Role, RegistrationFormComponentProps } from '../types/registration'
import { useFormAnimations } from '../hooks/useFormAnimations'
import { GENDER_OPTIONS, ROLE_OPTIONS } from '../constants/formData'

export default function RegistrationForm({ 
  onSubmitAttendee, 
  onSubmitSpeaker, 
  isLoading, 
  rendicionTitle, 
  rendicionDate 
}: RegistrationFormComponentProps) {
  const [dni, setDni] = useState('')
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [role, setRole] = useState<Role>('attendee')

  const { containerVariants, itemVariants } = useFormAnimations()

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
    <motion.div
      className="w-full max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Header with gradient */}
        <motion.div 
          className="bg-gradient-to-r from-[#002f59] to-[#003366] p-8 text-center relative overflow-hidden"
          variants={itemVariants}
        >
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              background: [
                "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <motion.div 
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            {rendicionTitle}
          </motion.h1>
          <motion.p 
            className="text-blue-100 text-lg"
            variants={itemVariants}
          >
            {rendicionDate}
          </motion.p>
        </motion.div>

        {/* Form Content */}
        <motion.div className="p-8" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Progress indicator */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[#002f59] rounded-full flex items-center justify-center text-white font-semibold">1</div>
                <div className="w-16 h-1 bg-[#002f59] rounded-full"></div>
                <div className={`w-8 h-8 ${role === 'speaker' ? 'bg-blue-200' : 'bg-gray-200'} rounded-full flex items-center justify-center font-semibold ${role === 'speaker' ? 'text-[#002f59]' : 'text-gray-400'}`}>2</div>
              </div>
            </motion.div>

            {/* DNI Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="dni" className="block text-sm font-semibold text-gray-900 mb-3">
                Documento de Identidad (DNI)*
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaIdCard className="h-5 w-5 text-gray-400" />
                </div>
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
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all duration-300 text-lg"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Full Name Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-3">
                Nombres y Apellidos Completos*
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Carlos Pérez García"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all duration-300 text-lg"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Gender Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Sexo
              </label>
              <div className="grid grid-cols-2 gap-4">
                {GENDER_OPTIONS.map((genderOption) => (
                  <motion.label 
                    key={genderOption.value}
                    className={`
                      relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${gender === genderOption.value 
                        ? 'border-[#002f59] bg-[#002f59]/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={genderOption.value}
                      checked={gender === genderOption.value}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="h-5 w-5 text-[#002f59] border-2 border-gray-300 focus:ring-[#002f59]"
                    />
                    <genderOption.icon className="ml-3 text-xl text-[#002f59]" />
                    <span className="ml-2 text-lg font-medium text-gray-700">
                      {genderOption.label}
                    </span>
                    {gender === genderOption.value && (
                      <motion.div
                        className="absolute inset-0 border-2 border-[#002f59] rounded-xl"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Tipo de Participación
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLE_OPTIONS.map((roleOption) => (
                  <motion.label 
                    key={roleOption.value}
                    className={`
                      relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${role === roleOption.value 
                        ? 'border-[#002f59] bg-[#002f59]/5 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        value={roleOption.value}
                        checked={role === roleOption.value}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="h-5 w-5 text-[#002f59] border-2 border-gray-300 focus:ring-[#002f59]"
                      />
                      <roleOption.icon className="ml-3 text-2xl text-[#002f59]" />
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        {roleOption.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      {roleOption.description}
                    </p>
                    {role === roleOption.value && (
                      <motion.div
                        className="absolute inset-0 border-2 border-[#002f59] rounded-xl"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`
                  cursor-pointer w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#002f59] to-[#003366] hover:from-[#003366] hover:to-[#004080] shadow-lg hover:shadow-xl'
                  } 
                  text-white transform hover:-translate-y-1 hover:scale-105
                  focus:outline-none focus:ring-4 focus:ring-[#002f59]/20
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <motion.div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Procesando...
                    </>
                  ) : role === 'speaker' ? (
                    <>
                      Continuar con mi pregunta
                      <motion.svg 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completar Registro
                    </>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Footer Info */}
      <motion.div 
        className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-[#002f59] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#002f59] mb-2">¿Cómo funciona?</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• <span className="font-medium">Asistente:</span> Registro directo para participar como oyente</p>
              <p>• <span className="font-medium">Orador:</span> Registro + formulario de pregunta para intervenir públicamente</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}