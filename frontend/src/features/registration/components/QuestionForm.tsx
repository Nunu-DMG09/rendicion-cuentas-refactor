import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { QuestionFormData, ParticipationType, QuestionFormComponentProps } from '../types/registration'
import { useFormAnimations } from '../hooks/useFormAnimations'
import { THEMATIC_AXES, PARTICIPATION_TYPES } from '../constants/formData'

export default function QuestionForm({
    onSubmit,
    onBack,
    isLoading,
    rendicionTitle,
    rendicionDate
}: QuestionFormComponentProps) {
    const [participationType, setParticipationType] = useState<ParticipationType>('personal')
    const [thematicAxis, setThematicAxis] = useState('')
    const [question, setQuestion] = useState('')

    const { slideInVariants, itemVariants } = useFormAnimations()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!thematicAxis || !question.trim()) {
            alert('Por favor completa todos los campos')
            return
        }

        const formData: QuestionFormData = {
            participationType,
            thematicAxis,
            question: question.trim()
        }

        onSubmit(formData)
    }

    return (
        <motion.div
            className="w-full max-w-2xl mx-auto"
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Header */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    {/* Progress indicator */}
                    <motion.div
                        className="flex items-center justify-center mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="w-16 h-1 bg-[#002f59] rounded-full"></div>
                            <div className="w-8 h-8 bg-[#002f59] rounded-full flex items-center justify-center text-white font-semibold">2</div>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Participation Type */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                Su participación será a título...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {PARTICIPATION_TYPES.map((type) => (
                                    <motion.label
                                        key={type.value}
                                        className={`
                      relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${participationType === type.value
                                                ? 'border-[#002f59] bg-[#002f59]/5 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                    `}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <input
                                            type="radio"
                                            value={type.value}
                                            checked={participationType === type.value}
                                            onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                                            className="h-5 w-5 text-[#002f59] border-2 border-gray-300 focus:ring-[#002f59]"
                                        />
                                        <type.icon className="ml-3 text-xl text-[#002f59]" />
                                        <span className="ml-2 text-lg font-medium text-gray-700">
                                            {type.label}
                                        </span>
                                    </motion.label>
                                ))}
                            </div>
                        </motion.div>

                        {/* Thematic Axis */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="thematicAxis" className="block text-sm font-semibold text-gray-900 mb-4">
                                Eje Temático de su consulta
                            </label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <select
                                    id="thematicAxis"
                                    value={thematicAxis}
                                    onChange={(e) => setThematicAxis(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all duration-300 text-lg appearance-none bg-white"
                                    required
                                >
                                    <option value="">Seleccione un Eje Temático</option>
                                    {THEMATIC_AXES.map((axis) => (
                                        <option key={axis.value} value={axis.value}>
                                            {axis.value}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Question */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="question" className="block text-sm font-semibold text-gray-900 mb-4">
                                Su pregunta o consulta
                            </label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Escriba su pregunta de manera clara y específica..."
                                    rows={5}
                                    maxLength={500}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all duration-300 resize-none text-lg"
                                    required
                                />
                                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                                    {question.length}/500
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
                            <motion.button
                                type="button"
                                onClick={onBack}
                                className="cursor-pointer flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver
                            </motion.button>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className={`
                  cursor-pointer flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                  ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#002f59] to-[#003366] hover:from-[#003366] hover:to-[#004080] shadow-lg hover:shadow-xl'
                                    } 
                  text-white transform hover:-translate-y-1
                  focus:outline-none focus:ring-4 focus:ring-[#002f59]/20
                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div className="flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Enviar Pregunta
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#002f59] mb-2">Consejos para una buena pregunta</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>• Sea específico y directo en su consulta</p>
                            <p>• Evite preguntas que requieran respuestas muy extensas</p>
                            <p>• Su pregunta será leída públicamente durante la audiencia</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}