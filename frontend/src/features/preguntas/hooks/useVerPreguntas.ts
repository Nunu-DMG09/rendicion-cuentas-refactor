import { useState, useMemo } from 'react'
import type { Pregunta, PreguntasPorEje, PreguntasModalState, PresentacionState } from '../types/preguntas'
import { RENDICIONES_PREGUNTAS_OPTIONS, MOCK_PREGUNTAS_POR_RENDICION } from '../constants/preguntasData'

export const useVerPreguntas = () => {
    const [selectedRendicion, setSelectedRendicion] = useState<string>('')
    const [preguntas, setPreguntas] = useState<Pregunta[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    
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

    // Opciones de rendiciones
    const rendicionesOptions = RENDICIONES_PREGUNTAS_OPTIONS

    // Agrupar preguntas por eje
    const preguntasPorEje = useMemo((): PreguntasPorEje[] => {
        const grouped: Record<string, PreguntasPorEje> = {}
        
        preguntas.forEach(pregunta => {
            if (!grouped[pregunta.ejeId]) {
                grouped[pregunta.ejeId] = {
                    ejeId: pregunta.ejeId,
                    ejeNombre: pregunta.ejeNombre,
                    preguntas: []
                }
            }
            grouped[pregunta.ejeId].preguntas.push(pregunta)
        })
        
        return Object.values(grouped).sort((a, b) => a.ejeNombre.localeCompare(b.ejeNombre))
    }, [preguntas])

    // Estadísticas
    const stats = useMemo(() => ({
        total: preguntas.length,
        respondidas: preguntas.filter(p => p.respondida).length,
        pendientes: preguntas.filter(p => !p.respondida).length,
        ejes: preguntasPorEje.length
    }), [preguntas, preguntasPorEje])

    // Buscar preguntas
    const buscarPreguntas = async () => {
        if (!selectedRendicion) return

        setIsLoading(true)
        setHasSearched(false)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const preguntasData = MOCK_PREGUNTAS_POR_RENDICION[selectedRendicion] || []
            setPreguntas(preguntasData)
            setHasSearched(true)
        } catch (error) {
            console.error('Error al buscar preguntas:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Mostrar confirmación de borrar
    const showDeleteConfirm = (preguntaId: string) => {
        const pregunta = preguntas.find(p => p.id === preguntaId)
        if (!pregunta) return

        setModal({
            isOpen: true,
            type: 'confirm',
            title: '¿Eliminar pregunta?',
            message: `¿Está seguro que desea eliminar la pregunta de "${pregunta.participante.nombre}"?`,
            preguntaId
        })
    }

    // Eliminar pregunta
    const deletePregunta = async () => {
        if (!modal.preguntaId) return

        setModal(prev => ({ ...prev, isOpen: false }))
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            setPreguntas(prev => prev.filter(p => p.id !== modal.preguntaId))
            
            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Pregunta eliminada!',
                message: 'La pregunta ha sido eliminada exitosamente.'
            })
        } catch (error) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Ocurrió un error al eliminar la pregunta.'
            })
        }
    }

    // Cerrar modal
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }))
    }

    // Confirmar acción del modal
    const confirmModalAction = () => {
        if (modal.type === 'confirm') {
            deletePregunta()
        } else {
            closeModal()
        }
    }

    // Abrir presentación
    const openPresentacion = () => {
        const rendicion = RENDICIONES_PREGUNTAS_OPTIONS.find(r => r.id === selectedRendicion)
        
        setPresentacion({
            isOpen: true,
            preguntasPorEje,
            rendicionLabel: rendicion?.label || ''
        })
    }

    // Cerrar presentación
    const closePresentacion = () => {
        setPresentacion(prev => ({ ...prev, isOpen: false }))
    }

    // Limpiar búsqueda
    const limpiarBusqueda = () => {
        setPreguntas([])
        setSelectedRendicion('')
        setHasSearched(false)
    }

    return {
        selectedRendicion,
        setSelectedRendicion,
        rendicionesOptions,
        preguntas,
        preguntasPorEje,
        isLoading,
        hasSearched,
        buscarPreguntas,
        limpiarBusqueda,
        stats,
        // Modal
        modal,
        closeModal,
        confirmModalAction,
        showDeleteConfirm,
        // Presentación
        presentacion,
        openPresentacion,
        closePresentacion
    }
}