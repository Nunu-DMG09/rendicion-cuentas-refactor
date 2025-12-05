import { useState, useCallback } from 'react'
import type { ReporteModalState, Participante, Data } from '../types/reportes'
import { useVerPreguntas } from '@/features/preguntas/hooks/useVerPreguntas'
import { api } from '@/core/config'
import { useQuery } from '@tanstack/react-query'

export const useReportes = () => {
    const [currentPage, setCurrentPage] = useState(1)
    
    const [modal, setModal] = useState<ReporteModalState>({
        isOpen: false,
        pregunta: null,
        participante: null
    })
    const {
		selectedRendicion,
        handleRendicionChange,
        limpiarBusqueda,
    } = useVerPreguntas()
    
    const fetchReport = async (): Promise<Data> => {
        const res = await api.get(`/admin/reportes/${selectedRendicion}?page=${currentPage}`, {
            withCredentials: true
        })
        return res.data.data
    }
    const reportQuery = useQuery({
        queryKey: ['reporte', selectedRendicion, currentPage],
        queryFn: fetchReport,
        enabled: !!selectedRendicion,
        staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (failureCount >= 2) return false;
			if (error.message.includes("404") || error.message.includes("400"))
				return false;
			return true;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
    const getExcel = useCallback(async () => {
        const res = await api.get(`/admin/reportes/${selectedRendicion}/excel`, {
            withCredentials: true,
            responseType: 'blob'
        })
        return res.data
    }, [selectedRendicion])
    const downloadExcel = useCallback(async () => {
        if (!selectedRendicion) return
        try {
            const excelData = await getExcel()
            const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Reporte_${selectedRendicion}.xlsx`)
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error al descargar el archivo Excel:', error)
        }
    }, [selectedRendicion, getExcel])

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

    return {
        selectedRendicion,
        reportData: reportQuery.data,
        isLoading: reportQuery.isLoading,
        isError: reportQuery.isError,
        error: reportQuery.error,
        hasSearched: !!selectedRendicion,
        refetch: reportQuery.refetch,
        hasResults: (reportQuery.data?.participantes?.length ?? 0) > 0,
        handleRendicionChange,
        limpiarBusqueda,
        // Paginación
        currentPage,
        handlePageChange,
        // Modal
        modal,
        openPreguntaModal,
        closePreguntaModal,
        // Excel
        downloadExcel
    }
}