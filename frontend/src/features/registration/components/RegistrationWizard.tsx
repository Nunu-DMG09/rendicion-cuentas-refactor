import RegistrationForm from "./RegistrationForm";
import QuestionForm from "./QuestionForm";
import RegistrationModal from "./RegistrationModal";
import { useRegistration } from "../hooks/useRegistration";
import type { RegistrationFormProps } from "../types/registration";
import { useRegistrationData } from "@/core/hooks";
import { formatDateWithWeekday } from "@/shared/utils";
import { Button, Loader } from "dialca-ui";
import { motion } from "motion/react";
import { HiExclamationTriangle, HiHome } from "react-icons/hi2";
import { HiRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function RegistrationWizard({
	rendicionId,
}: RegistrationFormProps) {
	const {
		rendicionData,
		isLoading: isLoadingData,
		error,
		refetch,
	} = useRegistrationData();
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
	const navigate = useNavigate();

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
	if (error || !rendicionData) {
		const isNetworkError =
			error?.message?.includes("Network Error") ||
			error?.message?.includes("fetch");
		const is404Error = error?.message?.includes("404");
		const isServerError =
			error?.message?.includes("500") ||
			error?.message?.includes("502") ||
			error?.message?.includes("503");

		return (
			<div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4">
				<motion.div
					className="text-center bg-white rounded-2xl p-12 shadow-xl max-w-lg mx-auto border border-gray-100"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<motion.div
						className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-100 flex items-center justify-center"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.2,
							type: "spring",
							stiffness: 200,
						}}
					>
						<HiExclamationTriangle className="w-10 h-10 text-red-500" />
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						{is404Error ? (
							<>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Rendición no encontrada
								</h2>
								<p className="text-gray-600 mb-6 leading-relaxed">
									La rendición de cuentas que buscas no existe
									o ha sido eliminada. Verifica que el enlace
									sea correcto o contacta con la
									administración.
								</p>
							</>
						) : isNetworkError ? (
							<>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Error de conexión
								</h2>
								<p className="text-gray-600 mb-6 leading-relaxed">
									No pudimos conectar con el servidor.
									Verifica tu conexión a internet e intenta
									nuevamente.
								</p>
							</>
						) : isServerError ? (
							<>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Servicio temporalmente no disponible
								</h2>
								<p className="text-gray-600 mb-6 leading-relaxed">
									Estamos experimentando problemas técnicos.
									Por favor, intenta nuevamente en unos
									minutos.
								</p>
							</>
						) : (
							<>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Registro no disponible
								</h2>
								<p className="text-gray-600 mb-6 leading-relaxed">
									No se pudo cargar la información de la
									rendición de cuentas. Esto puede deberse a
									que el período de registro ha finalizado o
									la rendición no está disponible.
								</p>
							</>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						{!is404Error && (
							<Button
								onClick={() => refetch()}
								variant="primary"
								className="flex items-center gap-2"
								disabled={isLoadingData}
								loading={isLoadingData}
								classes={{
									content: "flex items-center gap-4"
								}}
							>
								<HiRefresh className="w-4 h-4" />
								Reintentar
							</Button>
						)}

						<Button
							onClick={() => navigate("/")}
							variant="outline"
							className="flex items-center gap-2"
							classes={{
								content: "flex items-center gap-4"
							}}
						>
							<HiHome className="w-4 h-4" />
							Volver al inicio
						</Button>
					</motion.div>
					<motion.div
						className="mt-8 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
					>
						<p className="text-sm text-blue-800">
							<strong>¿Necesitas ayuda?</strong>
							<br />
							Si el problema persiste, contacta al equipo de
							soporte técnico o verifica las próximas fechas
							disponibles en la página principal.
						</p>
					</motion.div>
				</motion.div>
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
