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
            bg: 'bg-blue-100',
            border: 'border-blue-300',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            label: 'Respondidas',
            value: respondidas,
            icon: FaCheckCircle,
            bg: 'bg-green-100',
            border: 'border-green-300',
            iconBg: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            label: 'Pendientes',
            value: pendientes,
            icon: FaClock,
            bg: 'bg-amber-100',
            border: 'border-amber-300',
            iconBg: 'bg-amber-500',
            textColor: 'text-amber-500'
        },
        {
            label: 'Ejes Temáticos',
            value: ejes,
            icon: FaTags,
            bg: 'bg-purple-100',
            border: 'border-purple-300',
            iconBg: 'bg-purple-500',
            textColor: 'text-purple-500'
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
                        <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
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