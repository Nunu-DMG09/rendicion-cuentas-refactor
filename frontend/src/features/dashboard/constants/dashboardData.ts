import { 
  FaUsers, 
  FaQuestionCircle, 
  FaCalendarAlt, 
  FaMicrophone,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'
import type { RendicionChartData } from '../types/dashboard'

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

export const CHART_COLORS = {
  blue: '#002f59',
  lightBlue: '#003366',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1'
}