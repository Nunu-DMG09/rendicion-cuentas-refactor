import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaQuestionCircle, FaUser } from 'react-icons/fa'
import type { ReporteModalState } from '../types/reportes'

type Props = {
    modal: ReporteModalState
    onClose: () => void
}

export default function PreguntaModal({ modal, onClose }: Props) {
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.9, y: 20 }
    }

    return (
        <AnimatePresence>
            {modal.isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#002f59] to-[#003d73] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FaQuestionCircle className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Pregunta del Participante</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <FaTimes className="h-5 w-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Participante */}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FaUser className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Participante</p>
                                    <p className="font-semibold text-gray-900">{modal.participante}</p>
                                </div>
                            </div>

                            {/* Pregunta */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Pregunta realizada:</p>
                                <p className="text-gray-900 leading-relaxed">{modal.pregunta}</p>
                            </div>

                            {/* Botón Cerrar */}
                            <motion.button
                                onClick={onClose}
                                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#002f59] to-[#003d73] text-white rounded-xl font-semibold hover:from-[#003366] hover:to-[#004080] transition-all cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cerrar
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}