import { motion } from 'motion/react'
import { FaQuestionCircle, FaCheckCircle, FaClock, FaTags } from 'react-icons/fa'

type Props = {
    total: number
    respondidas: number
    pendientes: number
    ejes: number
}

export default function PreguntasStats({ total, respondidas, pendientes, ejes }: Props) {
    const stats = [
        {
            label: 'Total Preguntas',
            value: total,
            icon: FaQuestionCircle,
            bg: 'bg-[#e8f4fc]',
            border: 'border-[#cce5f5]',
            iconBg: 'bg-[#3b82f6]',
            textColor: 'text-[#3b82f6]'
        },
        {
            label: 'Respondidas',
            value: respondidas,
            icon: FaCheckCircle,
            bg: 'bg-[#e6f7ed]',
            border: 'border-[#c3ecd3]',
            iconBg: 'bg-[#22c55e]',
            textColor: 'text-[#22c55e]'
        },
        {
            label: 'Pendientes',
            value: pendientes,
            icon: FaClock,
            bg: 'bg-[#fef9e6]',
            border: 'border-[#fcefc3]',
            iconBg: 'bg-[#f59e0b]',
            textColor: 'text-[#f59e0b]'
        },
        {
            label: 'Ejes Temáticos',
            value: ejes,
            icon: FaTags,
            bg: 'bg-[#f3e8ff]',
            border: 'border-[#e9d5ff]',
            iconBg: 'bg-[#a855f7]',
            textColor: 'text-[#a855f7]'
        }
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className={`${stat.bg} ${stat.border} border rounded-xl p-4`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${stat.textColor}`}>
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}