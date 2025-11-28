import { motion } from 'motion/react'
import { FaTags, FaCheckCircle, FaBan } from 'react-icons/fa'

type Props = {
    total: number
    activos: number
    inactivos: number
}

export default function EjesStats({ total, activos, inactivos }: Props) {
    const stats = [
        {
            label: 'Total Ejes',
            value: total,
            icon: FaTags,
            bg: 'bg-[#e8f4fc]',
            border: 'border-[#cce5f5]',
            iconBg: 'bg-[#3b82f6]',
            textColor: 'text-[#3b82f6]'
        },
        {
            label: 'Activos',
            value: activos,
            icon: FaCheckCircle,
            bg: 'bg-[#e6f7ed]',
            border: 'border-[#c3ecd3]',
            iconBg: 'bg-[#22c55e]',
            textColor: 'text-[#22c55e]'
        },
        {
            label: 'Inactivos',
            value: inactivos,
            icon: FaBan,
            bg: 'bg-[#fce8e8]',
            border: 'border-[#f5cccc]',
            iconBg: 'bg-[#ef4444]',
            textColor: 'text-[#ef4444]'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className={`${stat.bg} ${stat.border} border rounded-xl p-4`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
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