import { useState, useMemo } from 'react'
import type { Pregunta, PreguntasPorEje, PreguntasModalState, PresentacionState } from '../types/preguntas'
import { useRendicion } from '@/features/rendicion/hooks/useRendicion'

export const useVerPreguntas = () => {
    const [selectedRendicion, setSelectedRendicion] = useState<string>('')
    
    const [modal, setModal] = useState<PreguntasModalState>({
        isOpen: false,
        type: 'confirm',
        title: '',
        message: ''
    })

    const [presentacion, setPresentacion] = useState<PresentacionState>({
        isOpen: false,
        preguntasPorEje: [],
        rendicionLabel: ''
    })

    const {
        rendicionData,
        isLoading,
        isError,
        error,
        refetch
    } = useRendicion(selectedRendicion)

    // Agrupar preguntas por eje
    const preguntasPorEje = useMemo((): PreguntasPorEje[] => {
        if (!rendicionData?.axes) return []
        return rendicionData.axes.map(axis => ({
            ejeId: axis.eje_id.toString(),
            ejeNombre: axis.tematica,
            preguntas: axis.preguntas.map(pregunta => ({
                id: pregunta.id.toString(),
                texto: pregunta.contenido,
                participante: {
                    nombre: pregunta.usuario,
                    id: pregunta.usuario_id.toString(),
                    dni: ''
                },
                ejeId: axis.eje_id.toString(),
                ejeNombre: axis.tematica,
                fechaCreacion: pregunta.created_at,
                respondida: false
            }))
        })).filter(eje => eje.preguntas.length > 0)
    }, [rendicionData])

    const allQuestions = useMemo((): Pregunta[] => {
        return preguntasPorEje.flatMap(eje => eje.preguntas)
    }, [preguntasPorEje])

    // Estadísticas
    const stats = useMemo(() => ({
        total: allQuestions.length,
        respondidas: allQuestions.filter(p => p.respondida).length,
        pendientes: allQuestions.filter(p => !p.respondida).length,
        ejes: preguntasPorEje.length
    }), [allQuestions, preguntasPorEje])

    const handleRendicionChange = (rendicionId: string) => {
        setSelectedRendicion(rendicionId)
        setModal(prev => ({ ...prev, isOpen: false }))
        setPresentacion(prev => ({ ...prev, isOpen: false }))
    }
    // Cerrar modal
    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))

    // Abrir presentación
    const openPresentacion = () => {        
        setPresentacion({
            isOpen: true,
            preguntasPorEje,
            rendicionLabel: `Rendición ${selectedRendicion}`
        })
    }

    // Cerrar presentación
    const closePresentacion = () => {
        setPresentacion(prev => ({ ...prev, isOpen: false }))
    }

    // Limpiar búsqueda
    const limpiarBusqueda = () => {
        setSelectedRendicion('')
        setModal(prev => ({ ...prev, isOpen: false }))
        setPresentacion(prev => ({ ...prev, isOpen: false }))
    }

    const hasSearched = !!selectedRendicion
    const hasResults = preguntasPorEje.length > 0

    return {
        selectedRendicion,
        preguntasPorEje,
        isLoading,
        isError,
        error,
        hasSearched,
        hasResults,
        stats,
        // Acciones
        handleRendicionChange,
        limpiarBusqueda,
        refetch,
        // Modal
        modal,
        closeModal,
        // Presentación
        presentacion,
        openPresentacion,
        closePresentacion
    }
}