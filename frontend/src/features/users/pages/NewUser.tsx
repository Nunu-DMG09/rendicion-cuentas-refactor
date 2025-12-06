import { useFormAnimations } from "@/features/registration/hooks/useFormAnimations";
import { motion } from "motion/react";
import { LuUserRound } from "react-icons/lu";
import { useCreateUser } from "../hooks/useCreateUser";
import { Button, InputField, Loader } from "dialca-ui";
import { FaIdCard, FaUser } from "react-icons/fa";
import { HiMiniCheck } from "react-icons/hi2";

export const NewUser = () => {
	const { containerVariants, itemVariants } = useFormAnimations();
	const {
		handleSubmit,
		data: registrationForm,
		handleChange,
		isFetchingDni: isLoadingName,
		roleOptions: ROLE_OPTIONS,
		isFormValid,
		isSubmitting: isLoading,
		showPassword,
		togglePasswordVisibility: toggleVisibility,
	} = useCreateUser();
	return (
		<motion.article
			className="w-full max-w-2xl mx-auto"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.div
				className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
				whileHover={{ scale: 1.01 }}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
						Registrar Nuevo Usuario
					</motion.h1>
					<motion.p
						className="text-blue-100 text-lg font-body"
						variants={itemVariants}
					>
						Complete el formulario para crear una nueva cuenta de
						usuario.
					</motion.p>
				</motion.header>
				<motion.div className="p-8" variants={itemVariants}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="space-y-8"
					>
						<motion.div variants={itemVariants}>
							<InputField
								label="Documento de Identidad (DNI)"
								required
								icon={
									<FaIdCard className="h-5 w-5 text-gray-400" />
								}
								maxLength={8}
								value={registrationForm.dni}
								onChange={(e) =>
									handleChange("dni", e.target.value)
								}
							/>
						</motion.div>
						<motion.div variants={itemVariants}>
							<InputField
								label="Nombres y Apellidos Completos"
								required
								icon={
									<FaUser className="h-5 w-5 text-gray-400" />
								}
								value={registrationForm.nombre}
								onChange={(e) =>
									handleChange("nombre", e.target.value)
								}
								isLoading={isLoadingName}
								loader={<Loader />}
							/>
						</motion.div>
						<motion.div variants={itemVariants}>
							<InputField
								label="Contraseña"
								required
								isPassword
								showPassword={showPassword}
								onToggleVisibility={toggleVisibility}
								minLength={8}
								value={registrationForm.password}
								onChange={(e) =>
									handleChange("password", e.target.value)
								}
							/>
						</motion.div>
						<motion.div variants={itemVariants}>
							<label className="block text-sm font-semibold text-gray-900 mb-4">
								Tipo de Participación
							</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{ROLE_OPTIONS.map((roleOption) => (
									<motion.label
										key={roleOption.value}
										className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                                            ${
												registrationForm.categoria ===
												roleOption.value
													? "border-primary-dark bg-primary-dark/5 shadow-lg"
													: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
											}
                                        `}
										whileHover={{ scale: 1.02, y: -2 }}
										whileTap={{ scale: 0.98 }}
									>
										<div className="flex items-center mb-2">
											<input
												type="radio"
												value={roleOption.value}
												checked={
													registrationForm.categoria ===
													roleOption.value
												}
												onChange={(e) =>
													handleChange(
														"categoria",
														e.target.value
													)
												}
												className="h-5 w-5 text-primary-dark border-2 border-gray-300 focus:ring-primary-dark"
											/>
											<roleOption.icon className="ml-3 text-2xl text-primary-dark" />
											<span className="ml-2 text-lg font-semibold text-gray-900">
												{roleOption.label}
											</span>
										</div>
										<p className="text-sm text-gray-600 ml-8">
											{roleOption.description}
										</p>
										{registrationForm.categoria ===
											roleOption.value && (
											<motion.div
												className="absolute inset-0 border-2 border-primary-dark rounded-xl"
												initial={{
													scale: 1.1,
													opacity: 0,
												}}
												animate={{
													scale: 1,
													opacity: 1,
												}}
												transition={{ duration: 0.2 }}
											/>
										)}
									</motion.label>
								))}
							</div>
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
											outerRing: "border-t-white!",
											innerRing: "border-t-gray-300!",
										}}
									/>
								}
								disabled={isLoading || !isFormValid}
								loading={isLoading}
								className="w-full!"
							>
								<motion.div className="flex items-center justify-center gap-3">
									<>
										<HiMiniCheck className="size-6" />
										Completar Registro
									</>
								</motion.div>
							</Button>
						</motion.div>
					</form>
				</motion.div>
			</motion.div>
		</motion.article>
	);
};
