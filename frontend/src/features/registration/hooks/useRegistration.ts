import { useState } from 'react'
import type { RegistrationStep, QuestionFormData, RegistrationFormData, RegistrationData } from '../types/registration'
import { useRegistrationModal } from './useRegistrationModal'

export function useRegistration(rendicionId: string) {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('registration')
    const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null)
    const [questionData, setQuestionData] = useState<QuestionFormData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        modalState,
        showSuccessModal,
        showErrorModal,
        showLoadingModal,
        closeModal
    } = useRegistrationModal()

    const goToQuestion = (data: RegistrationFormData) => {
        setRegistrationData(data)
        setCurrentStep('question')
    }

    const goBackToRegistration = () => {
        setCurrentStep('registration')
    }

    const submitAttendeeOnly = async (data: RegistrationFormData) => {
        setIsLoading(true)
        showLoadingModal('Registrando tu participación como asistente...')

        try {
            // Enviar solo datos de asistente
            const attendeeSubmission: RegistrationData = {
                rendicionId,
                registrationData: data
            }

            console.log('Asistente registrado:', attendeeSubmission)

            // Simular delay de API jjiij
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simular posible error (descomentalslo si qkieres probar))
            // if (Math.random() < 0.3) {
            //   throw new Error('Error de conexión con el servidor')
            // }

            showSuccessModal(true)

            // Reset form después de mostrar success
            setTimeout(() => {
                setRegistrationData(null)
                setQuestionData(null)
                setCurrentStep('registration')
            }, 1000)

        } catch (error) {
            console.error('Error al registrar asistente:', error)
            showErrorModal(
                error instanceof Error
                    ? `Error: ${error.message}`
                    : 'No se pudo completar el registro. Verifique su conexión e intente nuevamente.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const submitSpeakerWithQuestion = async (questionFormData: QuestionFormData) => {
        setIsLoading(true)
        showLoadingModal('Enviando tu pregunta para revisión...')

        try {
            // Enviar datos completos de orador
            const speakerSubmission: RegistrationData = {
                rendicionId,
                registrationData: registrationData!,
                questionData: questionFormData
            }

            console.log('Orador registrado con pregunta:', speakerSubmission)

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 2500))

            // Simular posible error (descomenta para probar)
            // if (Math.random() < 0.3) {
            //   throw new Error('Error al procesar la pregunta')
            // }

            showSuccessModal(false)

            // Reset form después de mostrar success
            setTimeout(() => {
                setRegistrationData(null)
                setQuestionData(null)
                setCurrentStep('registration')
            }, 1000)

        } catch (error) {
            console.error('Error al registrar orador:', error)
            showErrorModal(
                error instanceof Error
                    ? `Error: ${error.message}`
                    : 'No se pudo enviar tu pregunta. Verifique su conexión e intente nuevamente.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleModalClose = () => {
        closeModal()
        // Si fue un error, no reseteamos el form para que pueda intentar de nuevo
        if (modalState.type === 'success') {
            setRegistrationData(null)
            setQuestionData(null)
            setCurrentStep('registration')
        }
    }

    return {
        currentStep,
        registrationData,
        questionData,
        isLoading,
        modalState,
        goToQuestion,
        goBackToRegistration,
        submitAttendeeOnly,
        submitSpeakerWithQuestion,
        closeModal: handleModalClose
    }
}