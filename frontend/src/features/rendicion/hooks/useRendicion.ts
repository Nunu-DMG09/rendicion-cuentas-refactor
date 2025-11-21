import { useState, useEffect } from 'react'
import type { RendicionData } from '../types/rendicion'

export function useRendicion(rendicionId: string): RendicionData | null {
  const [rendicionData, setRendicionData] = useState<RendicionData | null>(null)

  useEffect(() => {
    // Simular datos - aca entras diegazo
    const mockData: Record<string, RendicionData> = {
      '1': {
        id: '1',
        title: 'Rendición I 2025',
        date: '2025-05-29',
        time: '10:00 AM',
        location: 'Auditorio Municipal MDJLO',
        axes: [
          {
            id: 'seguridad',
            name: 'Seguridad Ciudadana',
            description: 'Conjunto de acciones integrales que desarrolla la municipalidad, con la colaboración de instituciones del estado y de la ciudadanía, destinada a asegurar la convivencia pacífica de la población.',
            questionsCount: 15
          },
          {
            id: 'infraestructura',
            name: 'Infraestructura',
            description: 'Constituye las estructuras y sistemas esenciales que proporcionan servicios básicos como agua potable, saneamiento, obras civiles y transporte. Estos servicios son fundamentales para el desarrollo económico y social, así como para mejorar la calidad de vida de la población.',
            questionsCount: 23
          },
          {
            id: 'limpieza',
            name: 'Limpieza Pública',
            description: 'Comprende un conjunto de operaciones y procesos para la recolección, manejo, traslado y tratamiento de los desechos orgánicos e inorgánicos a cargo de la municipalidad.',
            questionsCount: 12
          },
          {
            id: 'institucionalidad',
            name: 'Institucionalidad',
            description: 'Conjunto de normas, y procedimientos de la municipalidad que definen su estructura legal, orgánica y funcional, así como a los mecanismos de control y rendición de cuentas que la rigen.',
            questionsCount: 18
          }
        ]
      },
      '2': {
        id: '2',
        title: 'Rendición II 2025',
        date: '2025-09-29',
        time: '10:00 AM',
        location: 'Auditorio Municipal MDJLO',
        axes: [
          {
            id: 'desarrollo-social',
            name: 'Desarrollo Social',
            description: 'Programas y políticas orientadas al bienestar de la población, incluyendo educación, salud, deportes y participación ciudadana.',
            questionsCount: 20
          },
          {
            id: 'medio-ambiente',
            name: 'Medio Ambiente',
            description: 'Acciones para la protección, conservación y mejoramiento del medio ambiente, incluyendo gestión de residuos y áreas verdes.',
            questionsCount: 14
          }
        ]
      }
    }

    setRendicionData(mockData[rendicionId] || null)
  }, [rendicionId])

  return rendicionData
}