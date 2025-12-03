import RegistrationForm from "./RegistrationForm";
import QuestionForm from "./QuestionForm";
import RegistrationModal from "./RegistrationModal";
import { useRegistration } from "../hooks/useRegistration";
import type { RegistrationFormProps } from "../types/registration";
import { useRegistrationData } from "@/core/hooks";
import { formatDateWithWeekday } from "@/shared/utils";
import { Loader } from "dialca-ui";

export default function RegistrationWizard({
	rendicionId,
}: RegistrationFormProps) {
	const { rendicionData, isLoading: isLoadingData } = useRegistrationData();
	const {
		currentStep,
		isLoading,
		modalState,
		goToQuestion,
		goBackToRegistration,
		submitAttendeeOnly,
		submitSpeakerWithQuestion,
		closeModal,
		registrationForm,
		questionForm,
	} = useRegistration(rendicionId);

	if (isLoadingData) {
		return (
			<div className="w-full py-20 flex items-center justify-center">
				<div className="text-center">
					<Loader
						classes={{
							container: "mx-auto! mb-4!",
						}}
					/>
					<p className="text-gray-600">Cargando información...</p>
				</div>
			</div>
		);
	}

	const renditionTitle = rendicionData
		? rendicionData.titulo
		: "Registro a Rendición de Cuentas";
	const renditionDate = `Fecha: ${formatDateWithWeekday(
		rendicionData ? rendicionData.fecha : new Date().toISOString()
	)}`;

	return (
		<>
			<section className="w-full py-20 bg-gray-50 min-h-screen">
				<div className="max-w-4xl mx-auto px-6 lg:px-8">
					{currentStep === "registration" ? (
						<RegistrationForm
							onSubmitAttendee={submitAttendeeOnly}
							onSubmitSpeaker={goToQuestion}
							isLoading={isLoading}
							rendicionTitle={renditionTitle}
							rendicionDate={renditionDate}
							registrationForm={registrationForm}
						/>
					) : (
						<QuestionForm
							onSubmit={submitSpeakerWithQuestion}
							onBack={goBackToRegistration}
							isLoading={isLoading}
							rendicionTitle={renditionTitle}
							rendicionDate={renditionDate}
							questionForm={questionForm}
							axis={
								rendicionData?.ejes_seleccionados.map((r) => ({
									value: r.id,
									label: r.tematica,
								})) || []
							}
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
	);
}

export { RegistrationWizard };
