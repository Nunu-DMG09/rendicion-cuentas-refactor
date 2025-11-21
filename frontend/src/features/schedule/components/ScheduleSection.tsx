import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import ScheduleCard from './ScheduleCard'
import { useSchedule } from '../hooks/useSchedule'

export default function ScheduleSection() {
    const scheduleData = useSchedule()

    return (
        <section className="w-full py-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <motion.header
                    className="text-center mb-16"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="inline-flex items-center justify-center w-20 h-1 mb-8"></div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-titles">
                        {scheduleData.title}
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-body">
                        {scheduleData.subtitle}
                    </p>
                </motion.header>
                <motion.div
                    className="space-y-6 mb-16"
                    whileInView="visible"
                    initial="hidden"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15,
                            },
                        },
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {scheduleData.events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <ScheduleCard event={event} index={index} />
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div
                    className="text-center"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-titles">
                        Sé parte del cambio
                    </h3>
                    <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {scheduleData.ctaSubtext}
                    </p>
                    <Link
                        to="/register/2"
                        className="
                            cursor-pointer group relative inline-flex items-center gap-3 px-8 py-4 
                            bg-primary-dark text-white font-semibold rounded-2xl 
                            shadow-xl hover:shadow-2xl hover:shadow-blue-200
                            transform hover:-translate-y-1 hover:scale-105
                            transition-all duration-300 overflow-hidden
                        "
                    >
                        <div className="absolute inset-0 bg-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <svg className="relative h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="relative">{scheduleData.ctaText}</span>
                        <svg className="relative h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export { ScheduleSection }