import { useState } from 'react'
import type { RegistrationStep, QuestionFormData, RegistrationFormData, RegistrationData } from '../types/registration'

export function useRegistration(rendicionId: string) {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('registration')
    const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null)
    const [questionData, setQuestionData] = useState<QuestionFormData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const goToQuestion = (data: RegistrationFormData) => {
        setRegistrationData(data)
        setCurrentStep('question')
    }

    const goBackToRegistration = () => {
        setCurrentStep('registration')
    }

    const submitAttendeeOnly = async (data: RegistrationFormData) => {
        setIsLoading(true)
        try {
            // Enviar solo datos de asistente
            const attendeeSubmission: RegistrationData = {
                rendicionId,
                registrationData: data
            }

            console.log('Asistente registrado:', attendeeSubmission)

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert('Registro como asistente completado exitosamente!')

            // Reset form
            setRegistrationData(null)
            setQuestionData(null)
            setCurrentStep('registration')

        } catch (error) {
            console.error('Error al registrar asistente:', error)
            alert('Error al completar el registro')
        } finally {
            setIsLoading(false)
        }
    }

    const submitSpeakerWithQuestion = async (questionFormData: QuestionFormData) => {
        setIsLoading(true)
        try {
            // Enviar datos completos de orador
            const speakerSubmission: RegistrationData = {
                rendicionId,
                registrationData: registrationData!,
                questionData: questionFormData
            }

            console.log('Orador registrado con pregunta:', speakerSubmission)

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert('Registro como orador completado exitosamente!')

            // Reset form
            setRegistrationData(null)
            setQuestionData(null)
            setCurrentStep('registration')

        } catch (error) {
            console.error('Error al registrar orador:', error)
            alert('Error al completar el registro')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        currentStep,
        registrationData,
        questionData,
        isLoading,
        goToQuestion,
        goBackToRegistration,
        submitAttendeeOnly,
        submitSpeakerWithQuestion
    }
}