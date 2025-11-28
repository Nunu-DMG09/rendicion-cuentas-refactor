import { useState, useEffect } from 'react'
import type { DashboardStats, RendicionChartData, RecentActivity, UpcomingRendicion } from '../types/dashboard'
import {
    MOCK_STATS,
    MOCK_CHART_DATA,
    MOCK_RECENT_ACTIVITY,
    MOCK_UPCOMING_RENDICIONES
} from '../constants/dashboardData'

export const useDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<RendicionChartData | null>(null)
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [upcomingRendiciones, setUpcomingRendiciones] = useState<UpcomingRendicion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // En producción, aquí irían las llamadas reales a la API
                setStats(MOCK_STATS)
                setChartData(MOCK_CHART_DATA)
                setRecentActivity(MOCK_RECENT_ACTIVITY)
                setUpcomingRendiciones(MOCK_UPCOMING_RENDICIONES)

            } catch (err) {
                setError('Error al cargar los datos del dashboard')
                console.error('Dashboard error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const refreshData = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            // Refrescar datos
            setStats(MOCK_STATS)
            setChartData(MOCK_CHART_DATA)
            setRecentActivity(MOCK_RECENT_ACTIVITY)
            setUpcomingRendiciones(MOCK_UPCOMING_RENDICIONES)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        stats,
        chartData,
        recentActivity,
        upcomingRendiciones,
        isLoading,
        error,
        refreshData
    }
}