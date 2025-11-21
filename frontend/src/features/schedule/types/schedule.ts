export type ScheduleEvent = {
  id: string
  date: string
  month: string
  status: 'upcoming' | 'completed' | 'active'
  description?: string
}

export type ScheduleData = {
  title: string
  subtitle: string
  events: ScheduleEvent[]
  ctaText: string
  ctaSubtext: string
}