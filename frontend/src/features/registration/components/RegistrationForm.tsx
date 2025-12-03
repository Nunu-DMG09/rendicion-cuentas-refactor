import { motion } from 'motion/react'
import { FaUser, FaIdCard } from 'react-icons/fa'
import type { Gender, Role, RegistrationFormComponentProps } from '../types/registration'
import { useFormAnimations } from '../hooks/useFormAnimations'
import { GENDER_OPTIONS, ROLE_OPTIONS } from '../constants/formData'
import { LuUserRound } from "react-icons/lu";
import { HiMiniCheck } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { Button, InputField, Loader } from 'dialca-ui'
import { ImInfo } from 'react-icons/im'

export default function RegistrationForm({ 
  onSubmitAttendee, 
  onSubmitSpeaker, 
  isLoading, 
  rendicionTitle, 
  rendicionDate,
  registrationForm
}: RegistrationFormComponentProps) {
  const { containerVariants, itemVariants } = useFormAnimations()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (registrationForm.role === 'speaker') {
      onSubmitSpeaker()
    } else {
      onSubmitAttendee()
    }
  }

  return (
    <motion.article
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
        <motion.header 
          className="bg-linear-to-r from-primary-dark to-primary p-8 text-center relative overflow-hidden"
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
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <LuUserRound className="size-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-2 font-titles"
            variants={itemVariants}
          >
            {rendicionTitle}
          </motion.h1>
          <motion.p 
            className="text-blue-100 text-lg font-body"
            variants={itemVariants}
          >
            {rendicionDate}
          </motion.p>
        </motion.header>
        <motion.div className="p-8" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="flex items-center justify-center mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center text-white font-semibold">1</div>
                <div className="w-16 h-1 bg-primary-dark rounded-full"></div>
                <div className={`w-8 h-8 ${registrationForm.role === 'speaker' ? 'bg-blue-200' : 'bg-gray-200'} rounded-full flex items-center justify-center font-semibold ${registrationForm.role === 'speaker' ? 'text-primary-dark' : 'text-gray-400'}`}>2</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField
                label="Documento de Identidad (DNI)"
                required
                icon={<FaIdCard className="h-5 w-5 text-gray-400" />}
                maxLength={8}
                value={registrationForm.dni}
                onChange={(e) => {
                  registrationForm.handleDniChange(e.target.value)
                }}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField
                label="Nombres y Apellidos Completos"
                required
                icon={<FaUser className="h-5 w-5 text-gray-400" />}
                value={registrationForm.fullName}
                onChange={(e) => registrationForm.handleFullNameChange(e.target.value)}
                isLoading={registrationForm.isLoadingName}
                loader={<Loader />}
              />
            </motion.div>
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
                      ${registrationForm.gender === genderOption.value 
                        ? 'border-primary-dark bg-primary-dark/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={genderOption.value}
                      checked={registrationForm.gender === genderOption.value}
                      onChange={(e) => registrationForm.handleGenderChange(e.target.value as Gender)}
                      className="h-5 w-5 text-primary-dark border-2 border-gray-300 focus:ring-primary-dark"
                    />
                    <genderOption.icon className="ml-3 text-xl text-primary-dark" />
                    <span className="ml-2 text-lg font-medium text-gray-700">
                      {genderOption.label}
                    </span>
                    {registrationForm.gender === genderOption.value && (
                      <motion.div
                        className="absolute inset-0 border-2 border-primary-dark rounded-xl"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>
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
                      ${registrationForm.role === roleOption.value 
                        ? 'border-primary-dark bg-primary-dark/5 shadow-lg' 
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
                        checked={registrationForm.role === roleOption.value}
                        onChange={(e) => registrationForm.handleRoleChange(e.target.value as Role)}
                        className="h-5 w-5 text-primary-dark border-2 border-gray-300 focus:ring-primary-dark"
                      />
                      <roleOption.icon className="ml-3 text-2xl text-primary-dark" />
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        {roleOption.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      {roleOption.description}
                    </p>
                    {registrationForm.role === roleOption.value && (
                      <motion.div
                        className="absolute inset-0 border-2 border-primary-dark rounded-xl"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>
            <motion.div 
              variants={itemVariants} 
              className="pt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                loadingText='Procesando...'
                loadingIcon={<Loader classes={{ outerRing: "border-t-white!", innerRing: "border-t-gray-300!" }} />}
                disabled={isLoading}
                loading={isLoading}
                className='w-full!'
              >
                <motion.div className="flex items-center justify-center gap-3">
                  {registrationForm.role === 'speaker' ? (
                    <>
                      Continuar con mi pregunta
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <RiArrowRightSLine className='size-6' />
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <HiMiniCheck className='size-6' />
                      Completar Registro
                    </>
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
      <motion.footer 
        className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center shrink-0">
            <ImInfo className='size-5 text-white' />
          </div>
          <div>
            <h3 className="font-semibold text-primary-dark mb-2">¿Cómo funciona?</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• <span className="font-medium">Asistente:</span> Registro directo para participar como oyente</p>
              <p>• <span className="font-medium">Orador:</span> Registro + formulario de pregunta para intervenir públicamente</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.article>
  )
}