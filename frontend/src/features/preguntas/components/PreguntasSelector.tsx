import { motion } from 'motion/react'
import { FaCalendarAlt, FaSearch, FaDesktop } from 'react-icons/fa'
import type { RendicionOptionPreguntas } from '../types/preguntas'

type Props = {
    selectedRendicion: string
    rendiciones: RendicionOptionPreguntas[]
    onChange: (value: string) => void
    onBuscar: () => void
    onPresentar: () => void
    isLoading: boolean
    hasResults: boolean
}

export default function PreguntasSelector({ 
    selectedRendicion, 
    rendiciones, 
    onChange, 
    onBuscar,
    onPresentar,
    isLoading,
    hasResults
}: Props) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                {/* Select */}
                <div className="flex-1 w-full">
                    <label 
                        htmlFor="rendicion" 
                        className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                        <FaCalendarAlt className="inline-block mr-2 text-[#002f59]" />
                        Fecha de Rendición
                    </label>
                    <select
                        id="rendicion"
                        value={selectedRendicion}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all text-gray-900 bg-white cursor-pointer"
                        disabled={isLoading}
                    >
                        <option value="">Seleccione una rendición</option>
                        {rendiciones.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.label} - {formatDate(r.fecha)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    {/* Botón Buscar */}
                    <motion.button
                        onClick={onBuscar}
                        disabled={!selectedRendicion || isLoading}
                        className={`
                            cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300
                            flex items-center justify-center gap-2 min-w-[140px]
                            ${!selectedRendicion || isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#002f59] to-[#003d73] text-white hover:from-[#003366] hover:to-[#004080] shadow-lg hover:shadow-xl cursor-pointer'
                            }
                        `}
                        whileHover={{ scale: !selectedRendicion || isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: !selectedRendicion || isLoading ? 1 : 0.98 }}
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Buscando...
                            </>
                        ) : (
                            <>
                                <FaSearch className="h-4 w-4" />
                                Buscar
                            </>
                        )}
                    </motion.button>

                    {/* Botón Presentar */}
                    {hasResults && (
                        <motion.button
                            onClick={onPresentar}
                            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <FaDesktop className="h-4 w-4" />
                            Presentar
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}