export type DashboardStats = {
  totalRendiciones: number
  totalAsistentes: number
  totalOradores: number
  totalPreguntas: number
  preguntasRespondidas: number
  preguntasPendientes: number
}

export type StatCardProps = {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
}

export type ChartDataPoint = {
  name: string
  value: number
}

export type RendicionChartData = {
  asistentes: ChartDataPoint[]
  preguntas: ChartDataPoint[]
  ejesTematicos: ChartDataPoint[]
}

export type RecentActivity = {
  id: string
  type: 'registro' | 'pregunta' | 'rendicion'
  description: string
  user: string
  timestamp: Date
}

export type UpcomingRendicion = {
  id: string
  title: string
  date: Date
  registeredCount: number
  questionsCount: number
  status: 'programada' | 'en_curso' | 'finalizada'
}