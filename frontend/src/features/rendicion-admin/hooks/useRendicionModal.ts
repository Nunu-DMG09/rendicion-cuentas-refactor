import { useState, useCallback } from 'react'
import type { RendicionModalState } from '../types/rendicionAdmin'

export const useRendicionModal = () => {
    const [modalState, setModalState] = useState<RendicionModalState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    })

    const showSuccessModal = useCallback(() => {
        setModalState({
            isOpen: true,
            type: 'success',
            title: '¡Rendición Creada Exitosamente!',
            message: 'La nueva rendición de cuentas ha sido programada correctamente. Los ciudadanos podrán registrarse y enviar sus preguntas.'
        })
    }, [])

    const showErrorModal = useCallback((errorMessage?: string) => {
        setModalState({
            isOpen: true,
            type: 'error',
            title: 'Error al Crear Rendición',
            message: errorMessage || 'Ha ocurrido un error inesperado. Por favor, verifique los datos e intente nuevamente.'
        })
    }, [])

    const showLoadingModal = useCallback((message: string = 'Procesando...') => {
        setModalState({
            isOpen: true,
            type: 'loading',
            title: 'Creando Rendición',
            message
        })
    }, [])

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }))
    }, [])

    return {
        modalState,
        showSuccessModal,
        showErrorModal,
        showLoadingModal,
        closeModal
    }
}