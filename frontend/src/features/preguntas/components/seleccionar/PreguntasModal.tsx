import { motion, AnimatePresence } from 'motion/react'
import { 
    FaTimes, 
    FaCheckCircle, 
    FaExclamationTriangle,
    FaTrash 
} from 'react-icons/fa'
import type { PreguntasModalState } from '../../types/preguntas'

type Props = {
    modal: PreguntasModalState
    onClose: () => void
    onConfirm: () => void
}

const modalConfig = {
    success: {
        icon: FaCheckCircle,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-500',
        buttonBg: 'bg-green-500 hover:bg-green-600'
    },
    error: {
        icon: FaExclamationTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        buttonBg: 'bg-red-500 hover:bg-red-600'
    },
    confirm: {
        icon: FaTrash,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        buttonBg: 'bg-red-500 hover:bg-red-600'
    },
    presentar: {
        icon: FaCheckCircle,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        buttonBg: 'bg-purple-500 hover:bg-purple-600'
    }
}

export default function PreguntasModal({ modal, onClose, onConfirm }: Props) {
    const config = modalConfig[modal.type]
    const Icon = config.icon

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
            transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
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
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-end p-4 pb-0">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <FaTimes className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="px-6 pb-6 text-center">
                            <motion.div 
                                className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                            >
                                <Icon className={`h-8 w-8 ${config.iconColor}`} />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {modal.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {modal.message}
                            </p>
                            <div className={`flex gap-3 ${modal.type === 'confirm' ? 'justify-center' : ''}`}>
                                {modal.type === 'confirm' ? (
                                    <>
                                        <motion.button
                                            onClick={onClose}
                                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancelar
                                        </motion.button>
                                        <motion.button
                                            onClick={onConfirm}
                                            className={`flex-1 py-3 px-4 text-white rounded-xl font-semibold transition-all cursor-pointer ${config.buttonBg}`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Eliminar
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        onClick={onClose}
                                        className={`w-full py-3 px-4 text-white rounded-xl font-semibold transition-all cursor-pointer ${config.buttonBg}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Aceptar
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}