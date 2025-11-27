import { useState, useCallback } from 'react'
import type {  ModalState } from '../types/modal'

export const useRegistrationModal = () => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
        isAttendee: false
    })

    const showSuccessModal = useCallback((isAttendee: boolean = false) => {
        const title = isAttendee
            ? '¡Registro Completado!'
            : '¡Pregunta Enviada Exitosamente!'

        const message = isAttendee
            ? 'Te has registrado correctamente como asistente. Recibirás más información sobre la audiencia por correo electrónico.'
            : 'Tu pregunta ha sido registrada exitosamente. Será considerada para la sesión de preguntas durante la audiencia pública.'

        setModalState({
            isOpen: true,
            type: 'success',
            title,
            message,
            isAttendee
        })
    }, [])

    const showErrorModal = useCallback((errorMessage?: string) => {
        setModalState({
            isOpen: true,
            type: 'error',
            title: 'Error en el Registro',
            message: errorMessage || 'Ha ocurrido un error inesperado. Por favor, inténtalo nuevamente o contacta al soporte técnico.'
        })
    }, [])

    const showLoadingModal = useCallback((message: string = 'Procesando tu solicitud...') => {
        setModalState({
            isOpen: true,
            type: 'loading',
            title: 'Procesando',
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