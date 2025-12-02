import { 
  FaUsers, 
  FaQuestionCircle, 
  FaCalendarAlt, 
  FaMicrophone,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'
import type { DashboardStats, RendicionChartData, RecentActivity, UpcomingRendicion } from '../types/dashboard'

export const MOCK_STATS: DashboardStats = {
  totalRendiciones: 12,
  totalAsistentes: 1847,
  totalOradores: 234,
  totalPreguntas: 456,
  preguntasRespondidas: 389,
  preguntasPendientes: 67
}

export const STAT_CARDS_CONFIG = [
  {
    key: 'totalRendiciones',
    title: 'Rendiciones Realizadas',
    icon: FaCalendarAlt,
    color: 'blue' as const,
  },
  {
    key: 'totalAsistentes',
    title: 'Total Asistentes',
    icon: FaUsers,
    color: 'green' as const,
    // trend: { value: 12, isPositive: true }
  },
  {
    key: 'totalOradores',
    title: 'Oradores Registrados',
    icon: FaMicrophone,
    color: 'purple' as const,
    // trend: { value: 5, isPositive: true }
  },
  {
    key: 'preguntasRecibidas',
    title: 'Preguntas Recibidas',
    icon: FaQuestionCircle,
    color: 'yellow' as const,
    // trend: { value: 15, isPositive: true }
  },
  {
    key: 'preguntasRespondidas',
    title: 'Preguntas Respondidas',
    icon: FaCheckCircle,
    color: 'indigo' as const,
    // trend: { value: 10, isPositive: true }
  },
  {
    key: 'preguntasPendientes',
    title: 'Preguntas Pendientes',
    icon: FaClock,
    color: 'red' as const,
    // trend: { value: 3, isPositive: false }
  }
]

export const MOCK_CHART_DATA: RendicionChartData = {
  asistentes: [
    { name: 'Ene', value: 120 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Abr', value: 220 },
    { name: 'May', value: 190 },
    { name: 'Jun', value: 250 },
    { name: 'Jul', value: 280 },
    { name: 'Ago', value: 310 },
    { name: 'Sep', value: 275 },
    { name: 'Oct', value: 320 },
    { name: 'Nov', value: 347 },
    { name: 'Dic', value: 0 }
  ],
  preguntas: [
    { name: 'Ene', value: 25 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 42 },
    { name: 'Abr', value: 38 },
    { name: 'May', value: 45 },
    { name: 'Jun', value: 52 },
    { name: 'Jul', value: 48 },
    { name: 'Ago', value: 55 },
    { name: 'Sep', value: 60 },
    { name: 'Oct', value: 58 },
    { name: 'Nov', value: 67 },
    { name: 'Dic', value: 0 }
  ],
  ejesTematicos: [
    { name: 'Seguridad Ciudadana', value: 125 },
    { name: 'Infraestructura', value: 98 },
    { name: 'Limpieza Pública', value: 87 },
    { name: 'Desarrollo Social', value: 76 },
    { name: 'Medio Ambiente', value: 45 },
    { name: 'Institucionalidad', value: 25 }
  ]
}

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    type: 'registro',
    description: 'Nuevo registro como asistente',
    user: 'Juan Pérez García',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    type: 'pregunta',
    description: 'Nueva pregunta sobre Seguridad Ciudadana',
    user: 'María López Rodríguez',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '3',
    type: 'registro',
    description: 'Nuevo registro como orador',
    user: 'Carlos Mendoza Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '4',
    type: 'pregunta',
    description: 'Nueva pregunta sobre Infraestructura',
    user: 'Ana Torres Vega',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '5',
    type: 'rendicion',
    description: 'Rendición de cuentas programada',
    user: 'Administrador',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  }
]

export const MOCK_UPCOMING_RENDICIONES: UpcomingRendicion[] = [
  {
    id: '1',
    title: 'Rendición de Cuentas - Diciembre 2025',
    date: new Date('2025-12-15'),
    registeredCount: 45,
    questionsCount: 12,
    status: 'programada'
  },
  {
    id: '2',
    title: 'Audiencia Pública - Presupuesto 2026',
    date: new Date('2025-12-20'),
    registeredCount: 78,
    questionsCount: 23,
    status: 'programada'
  },
  {
    id: '3',
    title: 'Rendición Trimestral Q4',
    date: new Date('2026-01-10'),
    registeredCount: 15,
    questionsCount: 5,
    status: 'programada'
  }
]

export const CHART_COLORS = {
  blue: '#002f59',
  lightBlue: '#003366',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1'
}