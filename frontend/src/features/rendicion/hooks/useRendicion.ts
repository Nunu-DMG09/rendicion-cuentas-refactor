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
                        questionsCount: 2,
                        questions: [
                            {
                                id: 'q1',
                                personName: 'Edwin Santos Mostacero Baca',
                                question: '¿Van a instalar más cámaras de seguridad?',
                                createdAt: '2025-05-15'
                            },
                            {
                                id: 'q2',
                                personName: 'Jhonatan Leonardo Huaman Vela',
                                question: 'Cuantos vehículos tienen para serenazgo',
                                createdAt: '2025-05-16'
                            }
                        ]
                    },
                    {
                        id: 'infraestructura',
                        name: 'Infraestructura',
                        description: 'Constituye las estructuras y sistemas esenciales que proporcionan servicios básicos como agua potable, saneamiento, obras civiles y transporte.',
                        questionsCount: 6,
                        questions: [{
                            id: 'q1',
                            personName: 'Edwin Santos Mostacero Baca',
                            question: '¿Van a instalar más cámaras de seguridad?',
                            createdAt: '2025-05-15'
                        },
                        {
                            id: 'q2',
                            personName: 'Jhonatan Leonardo Huaman Vela',
                            question: 'Cuantos vehículos tienen para serenazgo',
                            createdAt: '2025-05-16'
                        }, {
                            id: 'q3',
                            personName: 'Edwin Santos Mostacero Baca',
                            question: '¿Van a instalar más cámaras de seguridad?',
                            createdAt: '2025-05-15'
                        },
                        {
                            id: 'q4',
                            personName: 'Jhonatan Leonardo Huaman Vela',
                            question: 'Cuantos vehículos tienen para serenazgo',
                            createdAt: '2025-05-16'
                        },
                        {
                            id: 'q5',
                            personName: 'Edwin Santos Mostacero Baca',
                            question: '¿Van a instalar más cámaras de seguridad?',
                            createdAt: '2025-05-15'
                        },
                        {
                            id: 'q6',
                            personName: 'Jhonatan Leonardo Huaman Vela',
                            question: 'Cuantos vehículos tienen para serenazgo',
                            createdAt: '2025-05-16'
                        }]
                    },
                    {
                        id: 'limpieza',
                        name: 'Limpieza Pública',
                        description: 'Comprende un conjunto de operaciones y procesos para la recolección, manejo, traslado y tratamiento de los desechos orgánicos e inorgánicos a cargo de la municipalidad.',
                        questionsCount: 0,
                        questions: []
                    },
                    {
                        id: 'institucionalidad',
                        name: 'Institucionalidad',
                        description: 'Conjunto de normas, y procedimientos de la municipalidad que definen su estructura legal, orgánica y funcional.',
                        questionsCount: 0,
                        questions: []
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
                        description: 'Programas y políticas orientadas al bienestar de la población.',
                        questionsCount: 0,
                        questions: []
                    }
                ]
            }
        }

        setRendicionData(mockData[rendicionId] || null)
    }, [rendicionId])

    return rendicionData
}