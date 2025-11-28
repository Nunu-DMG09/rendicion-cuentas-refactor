import { useState, useEffect } from 'react'
import type { EjeTematico, CreateEjeFormData, EjesModalState } from '../types/ejesTematicos'
import { MOCK_EJES } from '../constants/ejesData'

export const useEjesTematicos = () => {
    const [ejes, setEjes] = useState<EjeTematico[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    
    const [modal, setModal] = useState<EjesModalState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    })

    // Cargar ejes al montar
    useEffect(() => {
        const fetchEjes = async () => {
            setIsLoading(true)
            try {
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 800))
                setEjes(MOCK_EJES)
            } catch (error) {
                console.error('Error al cargar ejes:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEjes()
    }, [])

    // Crear nuevo eje
    const createEje = async (data: CreateEjeFormData) => {
        setIsCreating(true)
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Validar que no exista
            const exists = ejes.some(
                e => e.tematica.toLowerCase() === data.tematica.toLowerCase()
            )

            if (exists) {
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error al crear',
                    message: 'Ya existe un eje temático con esa temática.'
                })
                return false
            }

            // Crear nuevo eje
            const newEje: EjeTematico = {
                id: `${Date.now()}`,
                tematica: data.tematica,
                estado: 'activo',
                fechaCreacion: new Date().toISOString().split('T')[0]
            }

            setEjes(prev => [newEje, ...prev])

            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Eje creado!',
                message: `El eje "${data.tematica}" ha sido creado exitosamente.`
            })

            return true
        } catch (error) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Ocurrió un error al crear el eje temático.'
            })
            return false
        } finally {
            setIsCreating(false)
        }
    }

    // Mostrar modal de confirmación
    const showConfirmToggle = (id: string) => {
        const eje = ejes.find(e => e.id === id)
        if (!eje) return

        const action = eje.estado === 'activo' ? 'deshabilitar' : 'habilitar'
        
        setModal({
            isOpen: true,
            type: 'confirm',
            title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} eje?`,
            message: `¿Está seguro que desea ${action} el eje "${eje.tematica}"?`,
            ejeId: id
        })
    }

    // Toggle estado del eje
    const toggleEstado = async (id: string) => {
        setIsToggling(true)
        closeModal()
        
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 800))

            setEjes(prev => prev.map(eje => {
                if (eje.id === id) {
                    return {
                        ...eje,
                        estado: eje.estado === 'activo' ? 'inactivo' : 'activo'
                    }
                }
                return eje
            }))

            const eje = ejes.find(e => e.id === id)
            const newEstado = eje?.estado === 'activo' ? 'deshabilitado' : 'habilitado'

            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Estado actualizado!',
                message: `El eje ha sido ${newEstado} exitosamente.`
            })
        } catch (error) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Ocurrió un error al actualizar el estado.'
            })
        } finally {
            setIsToggling(false)
        }
    }

    // Cerrar modal
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }))
    }

    // Confirmar acción del modal
    const confirmModalAction = () => {
        if (modal.type === 'confirm' && modal.ejeId) {
            toggleEstado(modal.ejeId)
        } else {
            closeModal()
        }
    }

    // Estadísticas
    const stats = {
        total: ejes.length,
        activos: ejes.filter(e => e.estado === 'activo').length,
        inactivos: ejes.filter(e => e.estado === 'inactivo').length
    }

    return {
        ejes,
        isLoading,
        isCreating,
        isToggling,
        createEje,
        showConfirmToggle,
        modal,
        closeModal,
        confirmModalAction,
        stats
    }
}