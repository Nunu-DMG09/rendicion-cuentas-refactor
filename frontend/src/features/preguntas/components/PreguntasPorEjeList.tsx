import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaTags, FaUser, FaChevronDown } from 'react-icons/fa'
import type { PreguntasPorEje } from '../types/preguntas'

type Props = {
    preguntasPorEje: PreguntasPorEje[]
}

export default function PreguntasPorEjeList({ preguntasPorEje }: Props) {
    const [expandedEjes, setExpandedEjes] = useState<Set<string>>(new Set())

    const toggleEje = (ejeId: string) => {
        setExpandedEjes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(ejeId)) newSet.delete(ejeId)
            else newSet.add(ejeId)
            return newSet
        })
    }

    const expandAll = () => setExpandedEjes(new Set(preguntasPorEje.map(e => e.ejeId)))

    const collapseAll = () => setExpandedEjes(new Set())

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <button
                    onClick={expandAll}
                    className="px-3 py-1.5 text-sm text-primary-dark hover:bg-primary-dark/10 rounded-lg transition-colors cursor-pointer"
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
                                <button
                                    onClick={() => toggleEje(grupo.ejeId)}
                                    className="w-full bg-linear-to-r from-primary-dark to-primary p-4 flex items-center justify-between cursor-pointer hover:brightness-110 transition-all"
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
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-8 h-8 bg-primary-dark/10 rounded-full flex items-center justify-center">
                                                                        <FaUser className="h-4 w-4 text-primary-dark" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 text-sm">
                                                                            {pregunta.participante.nombre}
                                                                        </p>
                                                                        {pregunta.participante.dni && (
                                                                            <p className="text-xs text-gray-500">
                                                                                DNI: {pregunta.participante.dni}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 leading-relaxed pl-10">
                                                                    {pregunta.texto}
                                                                </p>
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