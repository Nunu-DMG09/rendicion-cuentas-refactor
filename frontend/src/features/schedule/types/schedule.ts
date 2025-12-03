export type ScheduleEvent = {
  id: string
  titulo: string
  fecha: string
  hora: string
  estado: 'realizada' | 'programada'
  description?: string
}

export type ScheduleData = {
  title: string
  subtitle: string
  events: ScheduleEvent[]
  ctaText: string
  ctaSubtext: string
}