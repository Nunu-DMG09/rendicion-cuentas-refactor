import { useRegistrationData } from "@/core/hooks";
import { formatDateWithWeekday } from "@/shared/utils";
import { Button, InputField, Loader } from "dialca-ui";
import { motion } from "motion/react";
import { HiExclamationTriangle, HiHome, HiMiniCheck } from "react-icons/hi2";
import { HiRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { LuCalendarPlus, LuUserRound } from "react-icons/lu";
import { useFormAnimations } from "@/features/registration/hooks/useFormAnimations";
import { FaIdCard, FaUser } from "react-icons/fa";
import { useAsistencia } from "../hooks/useAsistencia";
import RegistrationModal from "../components/Modal";

export const AsistenciaPage = () => {
	const {
		rendicionData,
		isLoading: isLoadingData,
		error,
		refetch,
	} = useRegistrationData();
    const {
        dni,
        handleDniChange,
        fullName,
        handleFullNameChange,
        isLoadingName,
        isLoading,
        handleSubmit,
        modalState,
        closeModal,
    } = useAsistencia(rendicionData?.id || "");


	const { containerVariants, itemVariants } = useFormAnimations();
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
									Asistencia no disponible
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
									content: "flex items-center gap-4",
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
								content: "flex items-center gap-4",
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
		: "Marcar asistencia Rendición de Cuentas";
	const renditionDate = `Fecha: ${formatDateWithWeekday(
		rendicionData ? rendicionData.fecha : new Date().toISOString()
	)}`;
	return (
		<section className="w-full py-20 bg-gray-50 min-h-screen">
			<div className="max-w-4xl mx-auto px-6 lg:px-8">
				<motion.article
					className="w-full max-w-2xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div
						className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
						whileHover={{ scale: 1.01 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 20,
						}}
					>
						<motion.header
							className="bg-linear-to-r from-primary-dark to-primary p-8 text-center relative overflow-hidden"
							variants={itemVariants}
						>
							<motion.div
								className="absolute inset-0 opacity-10"
								animate={{
									background: [
										"radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
										"radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
										"radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
									],
								}}
								transition={{ duration: 4, repeat: Infinity }}
							/>

							<motion.div
								className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative"
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.5 }}
							>
								<LuUserRound className="size-10 text-white" />
							</motion.div>
							<motion.h1
								className="text-4xl font-bold text-white mb-2 font-titles"
								variants={itemVariants}
							>
								{renditionTitle}
							</motion.h1>
							<motion.p
								className="text-blue-100 text-lg font-body"
								variants={itemVariants}
							>
								{renditionDate}
							</motion.p>
						</motion.header>
						<motion.div className="p-8" variants={itemVariants}>
							<form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }} className="space-y-8">
								<motion.div
									className="flex items-center justify-center mb-8"
									variants={itemVariants}
								>
									<div className="flex items-center space-x-4">
										<p className="text-xl font-titles flex items-center text-gray-700">
                                            <span className="mr-2">
                                                <LuCalendarPlus />
                                            </span>
                                            Marca tu asistencia
                                        </p>
									</div>
								</motion.div>
								<motion.div variants={itemVariants}>
									<InputField
										label="Documento de Identidad (DNI)"
										required
										icon={
											<FaIdCard className="h-5 w-5 text-gray-400" />
										}
										maxLength={8}
										value={dni}
										onChange={(e) => {handleDniChange(e.target.value);
										}}
									/>
								</motion.div>
								<motion.div variants={itemVariants}>
									<InputField
										label="Nombres y Apellidos Completos"
										icon={
											<FaUser className="h-5 w-5 text-gray-400" />
										}
										value={fullName}
										onChange={(e) => handleFullNameChange(e.target.value)}
										isLoading={isLoadingName}
										loader={<Loader />}
									/>
								</motion.div>
								<motion.div
									variants={itemVariants}
									className="pt-4"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										loadingText="Procesando..."
										loadingIcon={
											<Loader
												classes={{
													outerRing:
														"border-t-white!",
													innerRing:
														"border-t-gray-300!",
												}}
											/>
										}
										disabled={isLoading}
										loading={isLoading}
										className="w-full!"
									>
										<motion.div className="flex items-center justify-center gap-3">
                                            <HiMiniCheck className="size-6" />
                                            Completar Registro
										</motion.div>
									</Button>
								</motion.div>
							</form>
						</motion.div>
					</motion.div>
				</motion.article>
                <RegistrationModal
                    isOpen={modalState.isOpen}
                    type={modalState.type}
                    title={modalState.title}
                    message={modalState.message}
                    onClose={closeModal}
                />
			</div>
		</section>
	);
};
