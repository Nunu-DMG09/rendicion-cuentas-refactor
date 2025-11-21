import { useNavigate } from 'react-router-dom'
import type { ScheduleEvent } from '../types/schedule'

type Props = {
    event: ScheduleEvent
    index: number
}

export default function ScheduleCard({ event, index }: Props) {
    const navigate = useNavigate()

    const getStatusConfig = () => {
        switch (event.status) {
            case 'completed':
                return {
                    card: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md',
                    badge: 'bg-green-50 text-green-700 border border-green-200',
                    badgeText: 'Completada'
                }
            case 'active':
                return {
                    card: 'bg-white border-[#002f59] hover:border-[#002f59] hover:shadow-lg',
                    badge: 'bg-blue-50 text-[#002f59] border border-[#002f59]/20',
                    badgeText: 'En Curso'
                }
            default:
                return {
                    card: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md',
                    badge: 'bg-gray-50 text-gray-600 border border-gray-200',
                    badgeText: 'Próxima'
                }
        }
    }

    const config = getStatusConfig()

    const getIcon = () => {
        switch (event.status) {
            case 'completed':
                return (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )
            case 'active':
                return (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            default:
                return (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )
        }
    }

    const handleCardClick = () => {
        navigate(`/rendicion/${event.id}`)
    }

    return (
        <article
            className={`
        group relative flex items-center justify-between p-8 rounded-2xl border-2 shadow-lg
        transform transition-all duration-300 hover:-translate-y-1 cursor-pointer
        ${config.card}
      `}
            onClick={handleCardClick}
        >
            {/* Left content */}
            <div className="flex items-center space-x-6">
                {/* Icon - Todos con el mismo color */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#002f59] text-white shadow-lg transform transition-all duration-300 group-hover:scale-105">
                    {getIcon()}
                </div>

                {/* Date and description */}
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {event.date} de {event.month}
                    </h3>
                    {event.description && (
                        <p className="text-base text-gray-600 mb-3">{event.description}</p>
                    )}
                    {/* Status badge */}
                    <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit
            ${config.badge}
          `}>
                        {config.badgeText}
                    </span>
                </div>
            </div>

            {/* Right arrow */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#002f59] text-white shadow-lg transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </article>
    )
}