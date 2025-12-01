import { motion, AnimatePresence } from 'motion/react'
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
import { statusConfig } from '../constants/config'
import { formatDateWithWeekday, getMonthYear } from '@/shared/utils'

type Props = {
    isOpen: boolean
    rendicion: RendicionItem | null
    onClose: () => void
}

export default function ViewRendicionModal({ isOpen, rendicion, onClose }: Props) {
    if (!rendicion) return null

    const status = statusConfig[rendicion.status]

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
            transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.9, y: 50 }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.article
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="relative bg-linear-to-r from-primary-dark to-primary p-6 pb-8 rounded-t-2xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors cursor-pointer"
                            >
                                <FaTimes className="h-5 w-5 text-white" />
                            </button>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.text} mb-4`}>
                                <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                                <span className="text-sm font-semibold">{status.label}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Rendición {getMonthYear(rendicion.fecha)}
                            </h2>
                            <p className="text-white/90 font-medium capitalize mb-1">
                                {formatDateWithWeekday(rendicion.fecha)}
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
                        </header>
                        <main className="p-6 space-y-6">
                            <section>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaChartPie className="h-4 w-4 text-primary-dark" />
                                    Estadísticas de Asistencia
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <motion.div
                                        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                                <FaUsers className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-blue-500">
                                                    {rendicion.detalles.totalInscritos}
                                                </p>
                                                <p className="text-xs text-gray-600">Total Inscritos</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                                <FaUserCheck className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-green-500">
                                                    {rendicion.detalles.asistentes}
                                                </p>
                                                <p className="text-xs text-gray-600">Asistentes</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="bg-red-50 border border-red-200 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
                                                <FaUserTimes className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-red-500">
                                                    {rendicion.detalles.noAsistentes}
                                                </p>
                                                <p className="text-xs text-gray-600">No Asistieron</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaQuestionCircle className="h-4 w-4 text-amber-500" />
                                    Estadísticas de Preguntas
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.div
                                        className="bg-orange-50 border border-orange-200 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                                                <FaQuestionCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-orange-500">
                                                    {rendicion.detalles.totalPreguntas}
                                                </p>
                                                <p className="text-xs text-gray-600">Total Preguntas</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                                <FaCheckCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-green-500">
                                                    {rendicion.detalles.preguntasRespondidas}
                                                </p>
                                                <p className="text-xs text-gray-600">Respondidas</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaTags className="h-4 w-4 text-primary-dark" />
                                    Ejes Temáticos ({rendicion.ejesTematicos.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {rendicion.ejesTematicos.map((eje, index) => (
                                        <motion.div
                                            key={eje?.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <div className="w-9 h-9 bg-primary-dark rounded-lg flex items-center justify-center shrink-0">
                                                <FaTags className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{eje?.nombre}</p>
                                                {/* {eje?.cantidad_pregunta && (
                                                    <p className="text-xs text-gray-500 truncate">{eje.cantidad_pregunta}</p>
                                                )} */}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                            <footer className="pt-4">
                                <motion.button
                                    onClick={onClose}
                                    className="w-full py-3 px-6 bg-primary-dark text-white rounded-xl font-semibold hover:bg-primary transition-all cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cerrar
                                </motion.button>
                            </footer>
                        </main>
                    </motion.div>
                </motion.article>
            )}
        </AnimatePresence>
    )
}