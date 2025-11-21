import { useNavigate } from 'react-router-dom'
import RendicionAxisRow from './RendicionAxisRow'
import { useRendicion } from '../hooks/useRendicion'
import type { RendicionDetailProps } from '../types/rendicion'

export default function RendicionDetail({ rendicionId }: RendicionDetailProps) {
    const navigate = useNavigate()
    const rendicionData = useRendicion(rendicionId)

    if (!rendicionData) {
        return (
            <div className="w-full py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002f59] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información...</p>
                </div>
            </div>
        )
    }

    const handleBackClick = () => {
        navigate('/')
    }

    return (
        <section className="w-full py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-1 bg-[#002f59] rounded-full mb-6"></div>

                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        {rendicionData.title}
                    </h1>

                    <div className="space-y-2 text-gray-600">
                        <p className="text-lg">
                            <span className="font-medium">Fecha:</span> {new Date(rendicionData.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium">Hora:</span> {rendicionData.time}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium">Lugar:</span> {rendicionData.location}
                        </p>
                    </div>
                </header>

                {/* Back Button */}
                <div className="mb-8">
                    <button
                        className="
              cursor-pointer inline-flex items-center gap-2 px-4 py-2 
              text-[#002f59] hover:bg-[#002f59] hover:text-white
              border border-[#002f59] rounded-lg font-medium
              transition-all duration-200 transform hover:scale-105
            "
                        onClick={handleBackClick}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                </div>

                {/* Title Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ejes Seleccionados</h2>
                    <p className="text-gray-600">
                        Selecciona un eje para ver las preguntas y respuestas correspondientes.
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            {/* Table Header */}
                            <thead className="bg-[#002f59] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-r border-blue-600">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-r border-blue-600">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">
                                        Preguntas
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {rendicionData.axes.map((axis, index) => (
                                    <RendicionAxisRow
                                        key={axis.id}
                                        axis={axis}
                                        index={index}
                                        isEven={index % 2 === 0}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-[#002f59] mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-medium text-[#002f59] mb-1">Información Importante</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Durante la audiencia pública, cada eje será presentado con detalle y se responderán
                                las preguntas de la ciudadanía. Tu participación es fundamental para el desarrollo
                                de nuestra comunidad.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { RendicionDetail }