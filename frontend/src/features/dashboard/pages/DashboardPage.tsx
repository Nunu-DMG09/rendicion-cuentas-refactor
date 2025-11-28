import { motion } from 'motion/react'
import { FaSyncAlt } from 'react-icons/fa'
import StatCard from '../components/StatCard'
import DashboardChart from '../components/DashboardChart'
import RecentActivityList from '../components/RecentActivityList'
import UpcomingRendiciones from '../components/UpcomingRendiciones'
import DashboardSkeleton from '../components/DashboardSkeleton'
import { useDashboard } from '../hooks/useDashboard'
import { useDashboardAnimations } from '../hooks/useDashboardAnimations'
import { STAT_CARDS_CONFIG, CHART_COLORS } from '../constants/dashboardData'
import type { DashboardStats } from '../types/dashboard'

export default function DashboardPage() {
    const {
        stats,
        chartData,
        recentActivity,
        upcomingRendiciones,
        isLoading,
        error,
        refreshData
    } = useDashboard()

    const { containerVariants, itemVariants } = useDashboardAnimations()

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={refreshData}
                        className="cursor-pointer px-4 py-2 bg-[#002f59] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                variants={itemVariants}
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Bienvenido al panel de administración de Rendición de Cuentas</p>
                </div>

                <motion.button
                    onClick={refreshData}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#002f59] text-white rounded-xl hover:bg-[#003366] transition-colors shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaSyncAlt className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={itemVariants}
            >
                {STAT_CARDS_CONFIG.map((config) => (
                    <StatCard
                        key={config.key}
                        title={config.title}
                        value={stats?.[config.key as keyof DashboardStats] ?? 0}
                        icon={config.icon}
                        color={config.color}
                        trend={config.trend}
                    />
                ))}
            </motion.div>

            {/* Charts */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
            >
                <DashboardChart
                    title="Asistentes por Mes"
                    data={chartData?.asistentes ?? []}
                    type="area"
                    color={CHART_COLORS.blue}
                />
                <DashboardChart
                    title="Preguntas por Mes"
                    data={chartData?.preguntas ?? []}
                    type="area"
                    color={CHART_COLORS.green}
                />
            </motion.div>

            {/* Pie Chart - Ejes Temáticos */}
            <motion.div variants={itemVariants}>
                <DashboardChart
                    title="Preguntas por Eje Temático"
                    data={chartData?.ejesTematicos ?? []}
                    type="bar"
                    color={CHART_COLORS.purple}
                />
            </motion.div>

            {/* Activity and Upcoming */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
            >
                <RecentActivityList activities={recentActivity} />
                <UpcomingRendiciones rendiciones={upcomingRendiciones} />
            </motion.div>
        </motion.div>
    )
}