import React from 'react'
import { motion } from 'framer-motion'
import {
    FaCheck,
    FaShieldAlt,
    FaTools,
    FaRecycle,
    FaLandmark,
    FaUsers,
    FaLeaf,
    FaGraduationCap,
    FaHeartbeat
} from 'react-icons/fa'
import { EJES_TEMATICOS } from '../constants/rendicionAdminData'

type Props = {
    selectedEjes: string[]
    onToggle: (ejeId: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FaShieldAlt,
    FaTools,
    FaRecycle,
    FaLandmark,
    FaUsers,
    FaLeaf,
    FaGraduationCap,
    FaHeartbeat
}

export default function EjesSelector({ selectedEjes, onToggle }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EJES_TEMATICOS.map((eje) => {
                const isSelected = selectedEjes.includes(eje.id)
                const Icon = iconMap[eje.icon] || FaUsers

                return (
                    <motion.div
                        key={eje.id}
                        className={`
              relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300
              ${isSelected
                                ? 'border-[#002f59] bg-[#002f59]/5 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
            `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onToggle(eje.id)}
                    >
                        <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300
                ${isSelected
                                    ? 'bg-[#002f59] border-[#002f59]'
                                    : 'border-gray-300 bg-white'
                                }
              `}>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    >
                                        <FaCheck className="h-3 w-3 text-white" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#002f59]' : 'text-gray-400'}`} />
                                    <h4 className={`font-medium text-sm ${isSelected ? 'text-[#002f59]' : 'text-gray-700'}`}>
                                        {eje.name}
                                    </h4>
                                </div>
                                {eje.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {eje.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}