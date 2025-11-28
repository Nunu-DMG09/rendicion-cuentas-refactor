import { motion, AnimatePresence } from 'framer-motion'
import {
    FaTimes,
    FaClock,
    FaUsers,
    FaUserCheck,
    FaUserTimes,
    FaQuestionCircle,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaTags,
    FaChartPie
} from 'react-icons/fa'
import type { RendicionItem } from '../types/rendicionAdmin'
import { EJES_TEMATICOS } from '../constants/rendicionAdminData'

type Props = {
    isOpen: boolean
    rendicion: RendicionItem | null
    onClose: () => void
}

const statusConfig = {
    programada: {
        label: 'Programada',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        dot: 'bg-blue-500'
    },
    en_curso: {
        label: 'En Curso',
        bg: 'bg-green-100',
        text: 'text-green-700',
        dot: 'bg-green-500'
    },
    finalizada: {
        label: 'Finalizada',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        dot: 'bg-gray-500'
    }
}

export default function ViewRendicionModal({ isOpen, rendicion, onClose }: Props) {
    if (!rendicion) return null

    const status = statusConfig[rendicion.status]

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const getMonthYear = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        const month = date.toLocaleDateString('es-ES', { month: 'long' })
        const year = date.getFullYear()
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
    }

    const getEjeNames = () => {
        return rendicion.ejesTematicos
            .map(id => EJES_TEMATICOS.find(e => e.id === id))
            .filter(Boolean)
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.9, y: 50 }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header con gradiente */}
                        <div className="relative bg-gradient-to-r from-[#002f59] to-[#003d73] p-6 pb-8 rounded-t-2xl">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors cursor-pointer"
                            >
                                <FaTimes className="h-5 w-5 text-white" />
                            </button>

                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.text} mb-4`}>
                                <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                                <span className="text-sm font-semibold">{status.label}</span>
                            </div>

                            {/* Título */}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Rendición {getMonthYear(rendicion.fecha)}
                            </h2>

                            {/* Fecha y lugar */}
                            <p className="text-white/90 font-medium capitalize mb-1">
                                {formatDate(rendicion.fecha)}
                            </p>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-2">
                                    <FaClock className="h-4 w-4" />
                                    {rendicion.hora} hrs
                                </span>
                                <span className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="h-4 w-4" />
                                    {rendicion.detalles.lugar}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Estadísticas de Asistencia */}
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaChartPie className="h-4 w-4 text-[#002f59]" />
                                    Estadísticas de Asistencia
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Total Inscritos */}
                                    <motion.div
                                        className="bg-[#e8f4fc] border border-[#cce5f5] rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaUsers className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#3b82f6]">
                                                    {rendicion.detalles.totalInscritos}
                                                </p>
                                                <p className="text-xs text-gray-600">Total Inscritos</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Asistentes */}
                                    <motion.div
                                        className="bg-[#e6f7ed] border border-[#c3ecd3] rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#22c55e] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaUserCheck className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#22c55e]">
                                                    {rendicion.detalles.asistentes}
                                                </p>
                                                <p className="text-xs text-gray-600">Asistentes</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* No Asistentes */}
                                    <motion.div
                                        className="bg-[#fce8e8] border border-[#f5cccc] rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#ef4444] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaUserTimes className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#ef4444]">
                                                    {rendicion.detalles.noAsistentes}
                                                </p>
                                                <p className="text-xs text-gray-600">No Asistieron</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Estadísticas de Preguntas */}
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaQuestionCircle className="h-4 w-4 text-amber-500" />
                                    Estadísticas de Preguntas
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Total Preguntas */}
                                    <motion.div
                                        className="bg-[#fef9e6] border border-[#fcefc3] rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaQuestionCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#f59e0b]">
                                                    {rendicion.detalles.totalPreguntas}
                                                </p>
                                                <p className="text-xs text-gray-600">Total Preguntas</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Respondidas */}
                                    <motion.div
                                        className="bg-[#e6f7ed] border border-[#c3ecd3] rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#22c55e] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#22c55e]">
                                                    {rendicion.detalles.preguntasRespondidas}
                                                </p>
                                                <p className="text-xs text-gray-600">Respondidas</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Ejes Temáticos */}
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaTags className="h-4 w-4 text-[#002f59]" />
                                    Ejes Temáticos ({rendicion.ejesTematicos.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {getEjeNames().map((eje, index) => (
                                        <motion.div
                                            key={eje?.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <div className="w-9 h-9 bg-[#002f59] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaTags className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{eje?.name}</p>
                                                {eje?.description && (
                                                    <p className="text-xs text-gray-500 truncate">{eje.description}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-4">
                                <motion.button
                                    onClick={onClose}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-[#002f59] to-[#003d73] text-white rounded-xl font-semibold hover:from-[#003366] hover:to-[#004080] transition-all cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cerrar
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}