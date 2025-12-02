export type DashboardStats = {
  totalRendiciones: number
  rendicionesRealizadas: number
  totalAsistentes: number
  totalOradores: number
  preguntasRecibidas: number
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
export type DashboardApiResponse = {
  success: boolean
  message: string
  data: {
    resumen_general: {
      total_rendiciones: number
      rendiciones_realizadas: number
      total_asistentes: number
      total_oradores: number
      preguntas_recibidas: number
      preguntas_respondidas: number
      preguntas_pendientes: number
    }
    graficos: {
      asistentes_por_mes: Array<{ mes: string; total: number }>
      preguntas_por_mes: Array<{ mes: string; total: number }>
      preguntas_por_eje: Array<{ id: string; tematica: string; total_preguntas: string }>
    }
    actividad_reciente: Array<{
      type: 'usuario' | 'pregunta' | 'rendicion'
      title: string
      subtitle: string
      time_ago: string
      datetime: string
      administrador: string
    }>
    rendiciones: {
      programadas_hoy: Array<RendicionResumen>
      proximas: Array<RendicionResumen>
    }
  }
}

export type RendicionResumen = {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  registrados: number
  preguntas_count: number
  estado: string
}

export type RendicionChartData = {
  asistentes: ChartDataPoint[]
  preguntas: ChartDataPoint[]
  ejesTematicos: ChartDataPoint[]
}

export type RecentActivity = {
  id: string
  type: 'usuario' | 'pregunta' | 'rendicion'
  title: string
  subtitle: string
  time_ago: string
  datetime: string
  administrador: string
}

export type UpcomingRendicion = {
  id: string
  title: string
  descripcion: string
  date: string
  time: string
  registrados: number
  preguntasCount: number
  status: string
}