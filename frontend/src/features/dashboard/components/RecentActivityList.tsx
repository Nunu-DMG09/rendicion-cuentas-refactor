import { motion } from 'motion/react'
import { FaUser, FaQuestionCircle, FaCalendarAlt } from 'react-icons/fa'
import type { RecentActivity } from '../types/dashboard'

type Props = {
    activities: RecentActivity[]
}

const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
        case 'registro':
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
        case 'registro':
            return 'bg-green-100 text-green-600'
        case 'pregunta':
            return 'bg-yellow-100 text-yellow-600'
        case 'rendicion':
            return 'bg-blue-100 text-[#002f59]'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Hace un momento'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`
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
                <button className="cursor-pointer text-sm text-[#002f59] hover:underline font-medium">
                    Ver todo
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.description}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {activity.user}
                            </p>
                        </div>

                        <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatTimeAgo(activity.timestamp)}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}