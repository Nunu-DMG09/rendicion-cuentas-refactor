import { useState } from 'react'
import type { ScheduleData } from '../types/schedule'

export function useSchedule(): ScheduleData {
  const [scheduleData] = useState<ScheduleData>({
    title: 'Rendiciones de Cuentas',
    subtitle: 'Cronograma de audiencias públicas programadas para este año',
    events: [
      {
        id: '1',
        date: '29',
        month: 'Mayo',
        status: 'completed',
        description: 'Primera audiencia pública completada'
      },
      {
        id: '2',
        date: '29',
        month: 'Septiembre',
        status: 'active',
        description: 'Próxima audiencia programada'
      },
      {
        id: '3',
        date: '15',
        month: 'Diciembre',
        status: 'upcoming',
        description: 'Audiencia de cierre anual'
      }
    ],
    ctaText: 'Registrarme',
    ctaSubtext: 'Únete a nuestras conferencias y participa activamente en el desarrollo de nuestra ciudad.'
  })

  return scheduleData
}