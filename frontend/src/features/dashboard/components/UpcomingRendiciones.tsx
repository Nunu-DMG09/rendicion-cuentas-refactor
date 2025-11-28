import { motion } from 'motion/react'
import { FaCalendarAlt, FaUsers, FaQuestionCircle } from 'react-icons/fa'
import type { UpcomingRendicion } from '../types/dashboard'

type Props = {
    rendiciones: UpcomingRendicion[]
}

const getStatusBadge = (status: UpcomingRendicion['status']) => {
    switch (status) {
        case 'programada':
            return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-[#002f59] rounded-full">Programada</span>
        case 'en_curso':
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">En curso</span>
        case 'finalizada':
            return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Finalizada</span>
        default:
            return null
    }
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

export default function UpcomingRendiciones({ rendiciones }: Props) {
    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Próximas Rendiciones</h3>
                <button className="cursor-pointer text-sm text-[#002f59] hover:underline font-medium">
                    Ver calendario
                </button>
            </div>

            <div className="space-y-4">
                {rendiciones.map((rendicion, index) => (
                    <motion.div
                        key={rendicion.id}
                        className="p-4 rounded-xl border border-gray-100 hover:border-[#002f59]/20 hover:bg-blue-50/30 transition-all cursor-pointer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm">{rendicion.title}</h4>
                            {getStatusBadge(rendicion.status)}
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            <FaCalendarAlt className="h-3 w-3 mr-2" />
                            {formatDate(rendicion.date)}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <FaUsers className="h-3 w-3 mr-1 text-green-500" />
                                <span>{rendicion.registeredCount} registrados</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FaQuestionCircle className="h-3 w-3 mr-1 text-yellow-500" />
                                <span>{rendicion.questionsCount} preguntas</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}