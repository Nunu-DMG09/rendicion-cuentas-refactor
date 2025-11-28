import { motion } from 'framer-motion'
import { 
    FaUsers, 
    FaUserCheck, 
    FaUserTimes, 
    FaMicrophone,
    FaQuestionCircle,
    FaCommentSlash
} from 'react-icons/fa'
import type { ReporteStats as ReporteStatsType } from '../types/reportes'

type Props = {
    stats: ReporteStatsType
}

export default function ReporteStats({ stats }: Props) {
    const statsConfig = [
        {
            label: 'Total Inscritos',
            value: stats.totalInscritos,
            icon: FaUsers,
            bg: 'bg-[#e8f4fc]',
            border: 'border-[#cce5f5]',
            iconBg: 'bg-[#3b82f6]',
            textColor: 'text-[#3b82f6]'
        },
        {
            label: 'Asistentes',
            value: stats.asistentes,
            icon: FaUserCheck,
            bg: 'bg-[#e6f7ed]',
            border: 'border-[#c3ecd3]',
            iconBg: 'bg-[#22c55e]',
            textColor: 'text-[#22c55e]'
        },
        {
            label: 'No Asistieron',
            value: stats.noAsistentes,
            icon: FaUserTimes,
            bg: 'bg-[#fce8e8]',
            border: 'border-[#f5cccc]',
            iconBg: 'bg-[#ef4444]',
            textColor: 'text-[#ef4444]'
        },
        {
            label: 'Oradores',
            value: stats.oradores,
            icon: FaMicrophone,
            bg: 'bg-[#f3e8ff]',
            border: 'border-[#e9d5ff]',
            iconBg: 'bg-[#a855f7]',
            textColor: 'text-[#a855f7]'
        },
        {
            label: 'Con Preguntas',
            value: stats.conPreguntas,
            icon: FaQuestionCircle,
            bg: 'bg-[#fef9e6]',
            border: 'border-[#fcefc3]',
            iconBg: 'bg-[#f59e0b]',
            textColor: 'text-[#f59e0b]'
        },
        {
            label: 'Sin Preguntas',
            value: stats.sinPreguntas,
            icon: FaCommentSlash,
            bg: 'bg-[#f1f5f9]',
            border: 'border-[#e2e8f0]',
            iconBg: 'bg-[#64748b]',
            textColor: 'text-[#64748b]'
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
                        <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
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