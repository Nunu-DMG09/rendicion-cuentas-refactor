import RegistrationForm from './RegistrationForm'
import QuestionForm from './QuestionForm'
import RegistrationModal from './RegistrationModal'
import { useRegistration } from '../hooks/useRegistration'
import { useRendicion } from '../../rendicion/hooks/useRendicion'
import type { RegistrationFormProps } from '../types/registration'

export default function RegistrationWizard({ rendicionId }: RegistrationFormProps) {
    const rendicionData = useRendicion(rendicionId)
    const {
        currentStep,
        isLoading,
        modalState,
        goToQuestion,
        goBackToRegistration,
        submitAttendeeOnly,
        submitSpeakerWithQuestion,
        closeModal
    } = useRegistration(rendicionId)

    if (!rendicionData) {
        return (
            <div className="w-full py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002f59] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información...</p>
                </div>
            </div>
        )
    }

    const renditionTitle = rendicionData.title
    const renditionDate = `Fecha: ${new Date(rendicionData.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })} del 2025`

    return (
        <>
            <section className="w-full py-20 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    {currentStep === 'registration' ? (
                        <RegistrationForm
                            onSubmitAttendee={submitAttendeeOnly}
                            onSubmitSpeaker={goToQuestion}
                            isLoading={isLoading}
                            rendicionTitle={renditionTitle}
                            rendicionDate={renditionDate}
                        />
                    ) : (
                        <QuestionForm
                            onSubmit={submitSpeakerWithQuestion}
                            onBack={goBackToRegistration}
                            isLoading={isLoading}
                            rendicionTitle={renditionTitle}
                            rendicionDate={renditionDate}
                        />
                    )}
                </div>
            </section>

            {/* Modal */}
            <RegistrationModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                isAttendee={modalState.isAttendee}
            />
        </>
    )
}

export { RegistrationWizard }