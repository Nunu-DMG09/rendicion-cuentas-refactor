import { motion } from 'motion/react'
import { FaUser, FaQuestionCircle, FaCalendarAlt } from 'react-icons/fa'
import type { RecentActivity } from '../types/dashboard'

type Props = {
    activities: RecentActivity[]
}

const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
        case 'usuario':
            return <FaUser className="h-4 w-4" />
        case 'pregunta':
            return <FaQuestionCircle className="h-4 w-4" />
        case 'rendicion':
            return <FaCalendarAlt className="h-4 w-4" />
        default:
            return <FaUser className="h-4 w-4" />
    }
}

const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
        case 'usuario':
            return 'bg-green-100 text-green-600'
        case 'pregunta':
            return 'bg-yellow-100 text-yellow-600'
        case 'rendicion':
            return 'bg-blue-100 text-primary-dark'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

export default function RecentActivityList({ activities }: Props) {
    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
                ) : (
                    activities.slice(0, 10).map((activity) => (
                        <motion.div
                            key={activity.id}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: parseInt(activity.id) * 0.1 }}
                        >
                            <div className={`shrink-0 w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.subtitle}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-400">{activity.time_ago}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">{activity.administrador}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    )
}