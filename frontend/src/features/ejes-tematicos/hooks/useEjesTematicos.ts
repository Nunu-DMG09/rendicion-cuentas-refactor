import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/core/config'
import type { EjeTematico, CreateEjeFormData, EjesModalState } from '../types/ejesTematicos'
import type { ApiError } from '@/core/types'

const QUERY_KEYS = {
    ejes: ['ejes'] as const
}
const ejesApi = {
    getAll: async (): Promise<EjeTematico[]> => {
        const res = await api.get('ejes')
        return res.data.data || []
    },
    create: async (data: CreateEjeFormData): Promise<EjeTematico> => {
        const res = await api.post('ejes', data)
        return res.data.data
    },
    toggleEstado: async (id: string): Promise<EjeTematico> => {
        const res = await api.put(`ejes/${id}/toggle-estado`)
        return res.data.data
    }
}
export const useEjesTematicos = () => {
    const queryClient = useQueryClient()
    const ejesQuery = useQuery({
        queryKey: QUERY_KEYS.ejes,
        queryFn: ejesApi.getAll,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (failureCount >= 2) return false
            if (error.message.includes('404') || error.message.includes("400")) return false
            return true
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
    const toggleEstadoMutation = useMutation({
        mutationFn: ejesApi.toggleEstado,
        onMutate: async (id: string) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ejes })
            // Snapshot del estado anterior
            const previousEjes = queryClient.getQueryData<EjeTematico[]>(QUERY_KEYS.ejes)
            // Update optimístico
            queryClient.setQueryData<EjeTematico[]>(QUERY_KEYS.ejes, (old = []) =>
                old.map(eje =>
                    eje.id === id
                        ? { ...eje, estado: eje.estado === '1' ? '0' : '1' }
                        : eje
                )
            )
            return { previousEjes }
        },
        onSuccess: (updatedEje) => {
            const newState = updatedEje.estado === '1' ? 'habilitado' : 'deshabilitado'
            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Estado actualizado!',
                message: `El eje ha sido ${newState} exitosamente.`
            })
        },
        onError: (_, __, context) => {
            if (context?.previousEjes) queryClient.setQueryData<EjeTematico[]>(QUERY_KEYS.ejes, context.previousEjes)
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Ocurrió un error al actualizar el estado.'
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ejes })
        }
    })
    const createEjeMutation = useMutation({
        mutationFn: ejesApi.create,
        onSuccess: (newEje) => {
            queryClient.setQueryData<EjeTematico[]>(QUERY_KEYS.ejes, (old = []) => [newEje, ...old])
            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Eje creado!',
                message: `El eje "${newEje.tematica}" ha sido creado exitosamente.`
            })
        },
        onError: (error: ApiError) => {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error al crear',
                message: error.response?.data?.message || 'Ocurrió un error al crear el eje temático.'
            })
        }
    })
    
    const [modal, setModal] = useState<EjesModalState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    })

    // Crear nuevo eje
    const createEje = async (data: CreateEjeFormData) => {
        const exists = ejesQuery.data?.some(eje => eje.tematica.toLowerCase() === data.tematica.toLowerCase())
        if (exists) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error al crear',
                message: `El eje temático "${data.tematica}" ya existe.`
            })
            return false
        }
        try {
            await createEjeMutation.mutateAsync(data)
            return true
        } catch {
            return false
        }
    }
    // Mostrar modal de confirmación
    const showConfirmToggle = (id: string) => {
        const eje = ejesQuery.data?.find(e => e.id === id)
        if (!eje) return
        const action = eje.estado === '1' ? 'deshabilitar' : 'habilitar'
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
        const eje = ejesQuery.data?.find(e => e.id === id)
        if (!eje) return
        toggleEstadoMutation.mutate(id)
    }
    // Cerrar modal
    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))
    // Confirmar acción del modal
    const confirmModalAction = () => {
        if (modal.type === 'confirm' && modal.ejeId) toggleEstado(modal.ejeId)
        else closeModal()
    }
    const stats = {
        total: ejesQuery.data?.length,
        activos: ejesQuery.data?.filter(e => e.estado === '1').length,
        inactivos: ejesQuery.data?.filter(e => e.estado === '0').length
    }

    return {
        ejesQuery,
        toggleEstadoMutation,
        createEjeMutation,
        createEje,
        showConfirmToggle,
        modal,
        closeModal,
        confirmModalAction,
        stats
    }
}