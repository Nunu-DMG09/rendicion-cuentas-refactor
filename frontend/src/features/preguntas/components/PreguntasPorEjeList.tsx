import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTags, FaTrash, FaUser, FaQuestionCircle, FaChevronDown } from 'react-icons/fa'
import type { PreguntasPorEje } from '../types/preguntas'

type Props = {
    preguntasPorEje: PreguntasPorEje[]
    onDeletePregunta: (preguntaId: string) => void
    isLoading: boolean
}

export default function PreguntasPorEjeList({ preguntasPorEje, onDeletePregunta, isLoading }: Props) {
    const [expandedEjes, setExpandedEjes] = useState<Set<string>>(new Set())

    const toggleEje = (ejeId: string) => {
        setExpandedEjes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(ejeId)) {
                newSet.delete(ejeId)
            } else {
                newSet.add(ejeId)
            }
            return newSet
        })
    }

    const expandAll = () => {
        setExpandedEjes(new Set(preguntasPorEje.map(e => e.ejeId)))
    }

    const collapseAll = () => {
        setExpandedEjes(new Set())
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                        <div className="bg-gray-200 h-16" />
                    </div>
                ))}
            </div>
        )
    }

    if (preguntasPorEje.length === 0) {
        return (
            <motion.div
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaQuestionCircle className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No hay preguntas registradas
                </h3>
                <p className="text-gray-500">
                    No se encontraron preguntas para esta rendición.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Controles de expansión */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={expandAll}
                    className="px-3 py-1.5 text-sm text-[#002f59] hover:bg-[#002f59]/10 rounded-lg transition-colors cursor-pointer"
                >
                    Expandir todo
                </button>
                <button
                    onClick={collapseAll}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                    Colapsar todo
                </button>
            </div>

            {/* Lista de ejes (acordeones) */}
            <div className="space-y-3">
                <AnimatePresence>
                    {preguntasPorEje.map((grupo, grupoIndex) => {
                        const isExpanded = expandedEjes.has(grupo.ejeId)
                        
                        return (
                            <motion.div
                                key={grupo.ejeId}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: grupoIndex * 0.05 }}
                            >
                                {/* Header del eje (clickeable) */}
                                <button
                                    onClick={() => toggleEje(grupo.ejeId)}
                                    className="w-full bg-gradient-to-r from-[#002f59] to-[#003d73] p-4 flex items-center justify-between cursor-pointer hover:from-[#003366] hover:to-[#004080] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaTags className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-white">{grupo.ejeNombre}</h3>
                                            <p className="text-blue-100 text-sm">{grupo.preguntas.length} preguntas</p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                                    >
                                        <FaChevronDown className="h-4 w-4 text-white" />
                                    </motion.div>
                                </button>

                                {/* Lista de preguntas (colapsable) */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 space-y-3 bg-gray-50/50">
                                                {grupo.preguntas.map((pregunta, index) => (
                                                    <motion.div
                                                        key={pregunta.id}
                                                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                                        transition={{ delay: index * 0.03 }}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                {/* Participante */}
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-8 h-8 bg-[#002f59]/10 rounded-full flex items-center justify-center">
                                                                        <FaUser className="h-4 w-4 text-[#002f59]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 text-sm">
                                                                            {pregunta.participante.nombre}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            DNI: {pregunta.participante.dni}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Pregunta */}
                                                                <p className="text-gray-700 leading-relaxed pl-10">
                                                                    {pregunta.texto}
                                                                </p>

                                                                {/* Estado */}
                                                                <div className="mt-2 pl-10">
                                                                    <span className={`
                                                                        inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                                                                        ${pregunta.respondida
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : 'bg-amber-100 text-amber-700'
                                                                        }
                                                                    `}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                                            pregunta.respondida ? 'bg-green-500' : 'bg-amber-500'
                                                                        }`} />
                                                                        {pregunta.respondida ? 'Respondida' : 'Pendiente'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Botón eliminar */}
                                                            <motion.button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onDeletePregunta(pregunta.id)
                                                                }}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Eliminar pregunta"
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}