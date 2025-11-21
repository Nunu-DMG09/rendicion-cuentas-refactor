import React, { useState } from 'react'
import type { QuestionFormData, ParticipationType } from '../types/registration'

type Props = {
    onSubmit: (data: QuestionFormData) => void
    onBack: () => void
    isLoading: boolean
    rendicionTitle: string
    rendicionDate: string
}

export default function QuestionForm({ onSubmit, onBack, isLoading, rendicionTitle, rendicionDate }: Props) {
    const [participationType, setParticipationType] = useState<ParticipationType>('personal')
    const [thematicAxis, setThematicAxis] = useState('')
    const [question, setQuestion] = useState('')

    const thematicAxes = [
        'Seguridad Ciudadana',
        'Infraestructura',
        'Limpieza Pública',
        'Institucionalidad',
        'Desarrollo Social',
        'Medio Ambiente'
    ]

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
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Header */}
            <header className="text-center mb-8">
                <div className="w-16 h-16 bg-[#002f59] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{rendicionTitle}</h1>
                <p className="text-gray-600">{rendicionDate}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Participation Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-4">
                        Su participación será a título...
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="personal"
                                checked={participationType === 'personal'}
                                onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
                            />
                            <span className="ml-2 text-gray-700">Personal</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="organization"
                                checked={participationType === 'organization'}
                                onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                                className="h-4 w-4 text-[#002f59] border-gray-300 focus:ring-[#002f59]"
                            />
                            <span className="ml-2 text-gray-700">Organización</span>
                        </label>
                    </div>
                </div>

                {/* tematica */}
                <div>
                    <label htmlFor="thematicAxis" className="block text-sm font-medium text-gray-900 mb-2">
                        Eje Temático
                    </label>
                    <select
                        id="thematicAxis"
                        value={thematicAxis}
                        onChange={(e) => setThematicAxis(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002f59] focus:border-[#002f59] transition-colors"
                        required
                    >
                        <option value="">Seleccione un Eje Temático</option>
                        {thematicAxes.map((axis) => (
                            <option key={axis} value={axis}>{axis}</option>
                        ))}
                    </select>
                </div>

                {/* Question */}
                <div>
                    <label htmlFor="question" className="block text-sm font-medium text-gray-900 mb-2">
                        Pregunta
                    </label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Escriba su pregunta aquí..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002f59] focus:border-[#002f59] transition-colors resize-none"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="cursor-pointer flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer flex-1 py-3 bg-[#002f59] text-white font-medium rounded-lg hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </form>
        </div>
    )
}