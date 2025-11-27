import { motion, AnimatePresence } from 'framer-motion'
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimes,
    FaUserCheck,
    FaComments
} from 'react-icons/fa'
import type { RegistrationModalProps } from '../types/modal'

export default function RegistrationModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    isAttendee
}: RegistrationModalProps) {

    const getIcon = () => {
        switch (type) {
            case 'success':
                return isAttendee ? <FaUserCheck className="h-16 w-16" /> : <FaComments className="h-16 w-16" />
            case 'error':
                return <FaExclamationTriangle className="h-16 w-16" />
            case 'loading':
                return (
                    <motion.div
                        className="w-16 h-16 border-4 border-blue-200 border-t-[#002f59] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                )
            default:
                return <FaCheckCircle className="h-16 w-16" />
        }
    }

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-500'
            case 'error':
                return 'text-red-500'
            case 'loading':
                return 'text-[#002f59]'
            default:
                return 'text-green-500'
        }
    }

    const getButtonText = () => {
        switch (type) {
            case 'success':
                return isAttendee ? 'Entendido' : 'Continuar'
            case 'error':
                return 'Reintentar'
            case 'loading':
                return 'Procesando...'
            default:
                return 'Cerrar'
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`
              p-8 text-center relative
              ${type === 'success' ? 'bg-gradient-to-br from-green-50 to-emerald-50' :
                                type === 'error' ? 'bg-gradient-to-br from-red-50 to-rose-50' :
                                    'bg-gradient-to-br from-blue-50 to-indigo-50'}
            `}>
                            {type !== 'loading' && (
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
                                >
                                    <FaTimes className="h-4 w-4 text-gray-400" />
                                </button>
                            )}

                            <motion.div
                                className={`${getIconColor()} mx-auto mb-4 flex items-center justify-center`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                {getIcon()}
                            </motion.div>

                            <motion.h2
                                className="text-2xl font-bold text-gray-900 mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {title}
                            </motion.h2>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <motion.p
                                className="text-gray-600 text-center leading-relaxed mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {message}
                            </motion.p>

                            {/* Success specific content */}
                            {type === 'success' && (
                                <motion.div
                                    className="bg-gray-50 rounded-xl p-4 mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-[#002f59] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {isAttendee ? (
                                                <>
                                                    <p className="font-semibold mb-1">Próximos pasos:</p>
                                                    <ul className="space-y-1">
                                                        <li>• Revisa tu correo electrónico</li>
                                                        <li>• Confirma tu asistencia</li>
                                                        <li>• Llega 15 minutos antes</li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-semibold mb-1">Tu pregunta será:</p>
                                                    <ul className="space-y-1">
                                                        <li>• Revisada por moderadores</li>
                                                        <li>• Considerada para la sesión</li>
                                                        <li>• Respondida públicamente</li>
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error specific content */}
                            {type === 'error' && (
                                <motion.div
                                    className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <FaExclamationTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-red-700">
                                            <p className="font-semibold mb-1">Posibles soluciones:</p>
                                            <ul className="space-y-1">
                                                <li>• Verifica tu conexión a internet</li>
                                                <li>• Revisa que todos los campos estén completos</li>
                                                <li>• Intenta nuevamente en unos momentos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Button */}
                            {type !== 'loading' && (
                                <motion.button
                                    onClick={onClose}
                                    disabled={type === 'loading'}
                                    className={`
                    cursor-pointer w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                    ${type === 'success'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                            : type === 'error'
                                                ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white'
                                                : 'bg-gradient-to-r from-[#002f59] to-[#003366] hover:from-[#003366] hover:to-[#004080] text-white'
                                        }
                    transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl
                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                    ${type === 'success' ? 'focus:ring-green-500' :
                                            type === 'error' ? 'focus:ring-red-500' : 'focus:ring-[#002f59]'}
                  `}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    {getButtonText()}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}