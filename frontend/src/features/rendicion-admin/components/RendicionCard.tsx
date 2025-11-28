import { motion } from 'framer-motion'
import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaQuestionCircle,
    FaEdit,
    FaEye,
    FaTags
} from 'react-icons/fa'
import type { RendicionItem } from '../types/rendicionAdmin'
import { EJES_TEMATICOS } from '../constants/rendicionAdminData'

type Props = {
    rendicion: RendicionItem
    isEditable: boolean
    onEdit: () => void
    onView: () => void
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

export default function RendicionCard({ rendicion, isEditable, onEdit, onView }: Props) {
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

    const getEjeNames = () => {
        return rendicion.ejesTematicos
            .map(id => EJES_TEMATICOS.find(e => e.id === id)?.name)
            .filter(Boolean)
            .slice(0, 3)
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            {/* Banner Header */}
            <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                    src={rendicion.banners[0]?.url || 'https://placehold.co/1200x400/002f59/white?text=Sin+Banner'}
                    alt="Banner de rendición"
                    className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${status.bg} ${status.text} flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                    <span className="text-sm font-semibold">{status.label}</span>
                </div>

                {/* Date overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-2xl font-bold capitalize">
                        {formatDate(rendicion.fecha)}
                    </p>
                    <p className="text-lg opacity-90 flex items-center gap-2">
                        <FaClock className="h-4 w-4" />
                        {rendicion.hora} hrs
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#002f59] rounded-lg flex items-center justify-center">
                                <FaUsers className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#002f59]">
                                    {rendicion.asistentesRegistrados}
                                </p>
                                <p className="text-sm text-gray-500">Asistentes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <FaQuestionCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {rendicion.preguntasRecibidas}
                                </p>
                                <p className="text-sm text-gray-500">Preguntas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ejes Temáticos */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <FaTags className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Ejes Temáticos</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {getEjeNames().map((name, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {name}
                            </span>
                        ))}
                        {rendicion.ejesTematicos.length > 3 && (
                            <span className="px-3 py-1 bg-[#002f59]/10 text-[#002f59] rounded-full text-sm font-medium">
                                +{rendicion.ejesTematicos.length - 3} más
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {isEditable ? (
                        <motion.button
                            onClick={onEdit}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#002f59] to-[#003366] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-[#003366] hover:to-[#004080] transition-all cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaEdit className="h-4 w-4" />
                            Editar Rendición
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={onView}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaEye className="h-4 w-4" />
                            Ver Detalles
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}