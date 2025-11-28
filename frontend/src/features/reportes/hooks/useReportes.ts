import { useState, useMemo, useCallback } from 'react'
import type { ReporteData, ReporteModalState, ReporteStats, Participante } from '../types/reportes'
import { RENDICIONES_OPTIONS, MOCK_REPORTES, ITEMS_PER_PAGE } from '../constants/reportesData'
import * as XLSX from 'xlsx'

export const useReportes = () => {
    const [selectedRendicion, setSelectedRendicion] = useState<string>('')
    const [reporteData, setReporteData] = useState<ReporteData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    
    const [modal, setModal] = useState<ReporteModalState>({
        isOpen: false,
        pregunta: null,
        participante: null
    })

    // Opciones de rendiciones
    const rendicionesOptions = RENDICIONES_OPTIONS

    // Calcular estadísticas
    const calculateStats = (participantes: Participante[]): ReporteStats => {
        const asistentes = participantes.filter(p => p.asistencia).length
        const noAsistentes = participantes.filter(p => !p.asistencia).length
        const oradores = participantes.filter(p => p.tipoParticipacion === 'orador').length
        const asistentesComunes = participantes.filter(p => p.tipoParticipacion === 'asistente').length
        const conPreguntas = participantes.filter(p => p.pregunta !== null).length
        const sinPreguntas = participantes.filter(p => p.pregunta === null).length

        return {
            totalInscritos: participantes.length,
            asistentes,
            noAsistentes,
            oradores,
            asistentesComunes,
            conPreguntas,
            sinPreguntas
        }
    }

    // Buscar reporte
    const buscarReporte = async () => {
        if (!selectedRendicion) return

        setIsLoading(true)
        setCurrentPage(1)

        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1200))

            const rendicion = RENDICIONES_OPTIONS.find(r => r.id === selectedRendicion)
            const participantes = MOCK_REPORTES[selectedRendicion] || []

            if (rendicion) {
                setReporteData({
                    rendicionId: rendicion.id,
                    rendicionLabel: rendicion.label,
                    fecha: rendicion.fecha,
                    stats: calculateStats(participantes),
                    participantes
                })
            }
        } catch (error) {
            console.error('Error al buscar reporte:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Paginación
    const totalPages = useMemo(() => {
        if (!reporteData) return 0
        return Math.ceil(reporteData.participantes.length / ITEMS_PER_PAGE)
    }, [reporteData])

    const paginatedParticipantes = useMemo(() => {
        if (!reporteData) return []
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return reporteData.participantes.slice(startIndex, endIndex)
    }, [reporteData, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Modal de pregunta
    const openPreguntaModal = (participante: Participante) => {
        setModal({
            isOpen: true,
            pregunta: participante.pregunta,
            participante: participante.nombre
        })
    }

    const closePreguntaModal = () => {
        setModal({
            isOpen: false,
            pregunta: null,
            participante: null
        })
    }

    // Descargar Excel
    const downloadExcel = useCallback(() => {
        if (!reporteData) return

        const data = reporteData.participantes.map((p, index) => ({
            'N°': index + 1,
            'DNI': p.dni,
            'Nombre Completo': p.nombre,
            'Sexo': p.sexo === 'M' ? 'Masculino' : 'Femenino',
            'Tipo de Participación': p.tipoParticipacion === 'orador' ? 'Orador' : 'Asistente',
            'Título': p.titulo || '-',
            'RUC': p.ruc || '-',
            'Organización': p.nombreOrganizacion || '-',
            'Asistencia': p.asistencia ? 'Sí' : 'No',
            'Eje Temático': p.eje || 'Sin eje asignado',
            'Pregunta': p.pregunta || 'Sin preguntas'
        }))

        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte')

        // Ajustar ancho de columnas
        const columnWidths = [
            { wch: 5 },   // N°
            { wch: 12 },  // DNI
            { wch: 35 },  // Nombre
            { wch: 12 },  // Sexo
            { wch: 18 },  // Tipo
            { wch: 10 },  // Título
            { wch: 15 },  // RUC
            { wch: 40 },  // Organización
            { wch: 12 },  // Asistencia
            { wch: 20 },  // Eje
            { wch: 60 },  // Pregunta
        ]
        worksheet['!cols'] = columnWidths

        const fileName = `Reporte_${reporteData.rendicionLabel.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
        XLSX.writeFile(workbook, fileName)
    }, [reporteData])

    // Limpiar reporte
    const limpiarReporte = () => {
        setReporteData(null)
        setSelectedRendicion('')
        setCurrentPage(1)
    }

    return {
        selectedRendicion,
        setSelectedRendicion,
        rendicionesOptions,
        reporteData,
        isLoading,
        buscarReporte,
        limpiarReporte,
        // Paginación
        currentPage,
        totalPages,
        paginatedParticipantes,
        handlePageChange,
        // Modal
        modal,
        openPreguntaModal,
        closePreguntaModal,
        // Excel
        downloadExcel
    }
}