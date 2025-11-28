import { useState, useEffect } from 'react'
import type { RendicionItem, EditModalState, ViewModalState, BannerFile } from '../types/rendicionAdmin'
import { MOCK_RENDICIONES, AVAILABLE_YEARS } from '../constants/rendicionAdminData'

export const useVerRendiciones = () => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [rendiciones, setRendiciones] = useState<RendicionItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal de edición
    const [editModal, setEditModal] = useState<EditModalState>({
        isOpen: false,
        rendicion: null
    })

    // Modal de visualización
    const [viewModal, setViewModal] = useState<ViewModalState>({
        isOpen: false,
        rendicion: null
    })

    const [isUpdating, setIsUpdating] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateError, setUpdateError] = useState<string | null>(null)

    // Cargar rendiciones según el año seleccionado
    useEffect(() => {
        const fetchRendiciones = async () => {
            setIsLoading(true)
            try {
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 800))

                const filteredRendiciones = MOCK_RENDICIONES.filter(r => r.year === selectedYear)
                setRendiciones(filteredRendiciones)
            } catch (error) {
                console.error('Error al cargar rendiciones:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRendiciones()
    }, [selectedYear])

    // Determinar si una rendición es editable (solo las más recientes del año actual)
    const isEditable = (rendicion: RendicionItem): boolean => {
        const currentYear = new Date().getFullYear()
        const rendicionDate = new Date(rendicion.fecha)
        const today = new Date()

        // Solo editable si es del año actual y la fecha aún no ha pasado
        return rendicion.year === currentYear && rendicionDate >= today
    }

    // Abrir modal de edición
    const openEditModal = (rendicion: RendicionItem) => {
        setEditModal({
            isOpen: true,
            rendicion
        })
        setUpdateSuccess(false)
        setUpdateError(null)
    }

    // Cerrar modal de edición
    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            rendicion: null
        })
        setUpdateSuccess(false)
        setUpdateError(null)
    }

    // Abrir modal de visualización
    const openViewModal = (rendicion: RendicionItem) => {
        setViewModal({
            isOpen: true,
            rendicion
        })
    }

    // Cerrar modal de visualización
    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            rendicion: null
        })
    }

    // Actualizar rendición
    const updateRendicion = async (
        id: string,
        fecha: string,
        hora: string,
        banners: BannerFile[]
    ) => {
        setIsUpdating(true)
        setUpdateError(null)

        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Validaciones
            if (!fecha) throw new Error('La fecha es requerida')
            if (!hora) throw new Error('La hora es requerida')

            // Actualizar en el estado local (en producción sería una llamada API lo cmabias)
            setRendiciones(prev =>
                prev.map(r => {
                    if (r.id === id) {
                        return {
                            ...r,
                            fecha,
                            hora,
                            banners: banners.length > 0
                                ? banners.map(b => ({ id: b.id, url: b.preview, name: b.name }))
                                : r.banners
                        }
                    }
                    return r
                })
            )

            setUpdateSuccess(true)

            // Cerrar modal después de mostrar éxito
            setTimeout(() => {
                closeEditModal()
            }, 1500)

            return true
        } catch (error) {
            setUpdateError(
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar la rendición'
            )
            return false
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        selectedYear,
        setSelectedYear,
        rendiciones,
        isLoading,
        availableYears: AVAILABLE_YEARS,
        // Edit modal
        editModal,
        openEditModal,
        closeEditModal,
        // View modal
        viewModal,
        openViewModal,
        closeViewModal,
        // Utilidades
        isEditable,
        updateRendicion,
        isUpdating,
        updateSuccess,
        updateError
    }
}