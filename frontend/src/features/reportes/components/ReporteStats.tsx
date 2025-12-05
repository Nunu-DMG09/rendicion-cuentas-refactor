import { motion } from 'motion/react'
import { 
    FaUsers, 
    FaUserCheck, 
    FaUserTimes, 
    FaMicrophone,
    FaQuestionCircle,
    FaCommentSlash
} from 'react-icons/fa'
import type { Stats } from '../types/reportes'

interface Props {
    stats?: Stats
}

export default function ReporteStats({ stats }: Props) {
    const statsConfig = [
        {
            label: 'Total Inscritos',
            value: stats?.total_inscritos || 0,
            icon: FaUsers,
            bg: 'bg-blue-100',
            border: 'border-blue-300',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            label: 'Asistentes',
            value: stats?.total_asistentes || 0,
            icon: FaUserCheck,
            bg: 'bg-green-100',
            border: 'border-green-300',
            iconBg: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            label: 'No Asistieron',
            value: stats?.total_no_asistieron || 0,
            icon: FaUserTimes,
            bg: 'bg-red-100',
            border: 'border-red-300',
            iconBg: 'bg-red-500',
            textColor: 'text-red-500'
        },
        {
            label: 'Oradores',
            value: stats?.total_oradores || 0,
            icon: FaMicrophone,
            bg: 'bg-purple-100',
            border: 'border-purple-300',
            iconBg: 'bg-purple-500',
            textColor: 'text-purple-500'
        },
        {
            label: 'Con Preguntas',
            value: stats?.total_con_pregunta || 0,
            icon: FaQuestionCircle,
            bg: 'bg-amber-100',
            border: 'border-amber-300',
            iconBg: 'bg-amber-500',
            textColor: 'text-amber-500'
        },
        {
            label: 'Sin Preguntas',
            value: stats?.total_sin_preguntas || 0,
            icon: FaCommentSlash,
            bg: 'bg-gray-100',
            border: 'border-gray-300',
            iconBg: 'bg-gray-500',
            textColor: 'text-gray-500'
        }
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statsConfig.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className={`${stat.bg} ${stat.border} border rounded-xl p-3`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                            <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xl font-bold ${stat.textColor}`}>
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-gray-600 leading-tight">{stat.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}