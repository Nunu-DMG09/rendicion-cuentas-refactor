import { motion } from 'framer-motion'
import type { StatCardProps } from '../types/dashboard'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'bg-[#002f59] text-white',
        text: 'text-[#002f59]'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'bg-green-500 text-white',
        text: 'text-green-600'
    },
    yellow: {
        bg: 'bg-yellow-50',
        icon: 'bg-yellow-500 text-white',
        text: 'text-yellow-600'
    },
    red: {
        bg: 'bg-red-50',
        icon: 'bg-red-500 text-white',
        text: 'text-red-600'
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-500 text-white',
        text: 'text-purple-600'
    },
    indigo: {
        bg: 'bg-indigo-50',
        icon: 'bg-indigo-500 text-white',
        text: 'text-indigo-600'
    }
}

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    const colors = colorClasses[color]

    return (
        <motion.div
            className={`${colors.bg} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${colors.text}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>

                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend.isPositive ? (
                                <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                                <FaArrowDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {trend.value}%
                            </span>
                            <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                        </div>
                    )}
                </div>

                <div className={`${colors.icon} p-4 rounded-xl`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </motion.div>
    )
}