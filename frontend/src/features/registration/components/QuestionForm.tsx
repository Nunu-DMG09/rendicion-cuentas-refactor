import { motion } from "motion/react";
import type {
	ParticipationType,
	QuestionFormComponentProps,
} from "../types/registration";
import { useFormAnimations } from "../hooks/useFormAnimations";
import { PARTICIPATION_TYPES } from "../constants/formData";
import { PiFolderOpenBold } from "react-icons/pi";
import { Button, InputField, Loader, Select } from "dialca-ui";
import { RiArrowLeftSLine } from "react-icons/ri";
import { BsFillSendFill } from "react-icons/bs";
import { TbBulb } from "react-icons/tb";
import { GrCircleQuestion } from "react-icons/gr";
import { HiMiniCheck } from "react-icons/hi2";

export default function QuestionForm({
	onSubmit,
	onBack,
	isLoading,
	rendicionTitle,
	rendicionDate,
	questionForm,
	axis,
}: QuestionFormComponentProps) {
	const { slideInVariants, itemVariants } = useFormAnimations();
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};
	return (
		<motion.article
			className="w-full max-w-2xl mx-auto"
			variants={slideInVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
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
						<GrCircleQuestion className="size-12 text-white" />
					</motion.div>

					<motion.h1
						className="text-3xl font-bold text-white mb-2"
						variants={itemVariants}
					>
						{rendicionTitle}
					</motion.h1>
					<motion.p
						className="text-blue-100 text-lg"
						variants={itemVariants}
					>
						{rendicionDate}
					</motion.p>
				</motion.header>
				<motion.div className="p-8" variants={itemVariants}>
					<motion.div
						className="flex items-center justify-center mb-8"
						variants={itemVariants}
					>
						<div className="flex items-center space-x-4">
							<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
								<HiMiniCheck className="size-5" />
							</div>
							<div className="w-16 h-1 bg-primary-dark rounded-full"></div>
							<div className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
								2
							</div>
						</div>
					</motion.div>
					<form onSubmit={handleSubmit} className="space-y-8">
						<motion.div variants={itemVariants}>
							<label className="block text-sm font-semibold text-gray-900 mb-4">
								Su participación será a título...
							</label>
							<div className="grid grid-cols-2 gap-4">
								{PARTICIPATION_TYPES.map((type) => (
									<motion.label
										key={type.value}
										className={`relative flex items-center p-4 rounded-xl border-2 
                                            cursor-pointer transition-all duration-300 
                                            ${
												questionForm.participationType ===
												type.value
													? "border-primary-dark bg-primary-dark/5 shadow-md"
													: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
											}
                                        `}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<input
											type="radio"
											value={type.value}
											checked={
												questionForm.participationType ===
												type.value
											}
											onChange={(e) =>
												questionForm.handleParticipationTypeChange(
													e.target
														.value as ParticipationType
												)
											}
											className="h-5 w-5 text-primary-dark border-2 border-gray-300 focus:ring-primary-dark"
										/>
										<type.icon className="ml-3 text-xl text-primary-dark" />
										<span className="ml-2 text-lg font-medium text-gray-700">
											{type.label}
										</span>
									</motion.label>
								))}
							</div>
						</motion.div>
						{questionForm.participationType === "organization" && (
							<>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<InputField
										label="RUC de la Organización"
										type="text"
										value={questionForm.organizationRuc}
										onChange={(e) => questionForm.handleOrganizationRucChange(e.target.value)}
									/>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.1 }}
								>
									<InputField
										label="Nombre de la Organización"
										type="text"
										value={questionForm.organizationName}
										onChange={(e) => questionForm.handleOrganizationNameChange(e.target.value)}
										isLoading={
											questionForm.isLoadingRuc
										}
										loader={<Loader />}
									/>
								</motion.div>
							</>
						)}
						<motion.div variants={itemVariants}>
							<label
								htmlFor="thematicAxis"
								className="block text-sm font-semibold text-gray-900 mb-7"
							>
								Eje Temático de su consulta
							</label>
							<motion.div
								className="relative"
								whileFocus={{ scale: 1.02 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<Select
									value={questionForm.thematicAxis}
									label="Eje Temático"
									onChange={(e) =>
										questionForm.handleThematicAxisChange(
											e.target.value
										)
									}
									icon={
										<PiFolderOpenBold className="h-5 w-5 text-gray-400" />
									}
									options={axis}
									required
								/>
							</motion.div>
						</motion.div>
						<motion.div variants={itemVariants}>
							<label
								htmlFor="question"
								className="block text-sm font-semibold text-gray-900 mb-4"
							>
								Su pregunta o consulta
							</label>
							<motion.div
								className="relative"
								whileFocus={{ scale: 1.02 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<textarea
									id="question"
									value={questionForm.question}
									onChange={(e) =>
										questionForm.handleQuestionChange(
											e.target.value
										)
									}
									placeholder="Escriba su pregunta de manera clara y específica..."
									rows={5}
									maxLength={500}
									className="w-full px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark/60 focus:border-primary-dark/60 outline-none transition-all duration-300 resize-none text-lg"
									required
								/>
								<div className="absolute bottom-3 right-3 text-sm text-gray-400">
									{questionForm.question.length}/500
								</div>
							</motion.div>
						</motion.div>
						<motion.div
							variants={itemVariants}
							className="flex space-x-4 pt-4"
						>
							<Button
								onClick={onBack}
								type="button"
								variant="outline"
								classes={{
									container:
										"border-gray-400! hover:bg-gray-200! hover:text-black! flex-1!",
									content:
										"flex items-center gap-3 justify-center text-lg!",
								}}
							>
								<>
									<motion.span
										animate={{ x: [0, 4, 0] }}
										transition={{
											duration: 1.5,
											repeat: Infinity,
										}}
									>
										<RiArrowLeftSLine className="size-6" />
									</motion.span>
									Volver
								</>
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								loading={isLoading}
								loadingIcon={
									<Loader
										size="sm"
										classes={{
											outerRing: "border-t-gray-white",
											innerRing: "border-t-gray-300",
										}}
									/>
								}
								loadingText="Enviando..."
								classes={{
									container: "flex-1!",
									content:
										"flex items-center gap-3 justify-center text-lg!",
								}}
							>
								<>
									<BsFillSendFill />
									Enviar Pregunta
								</>
							</Button>
						</motion.div>
					</form>
				</motion.div>
			</motion.div>
			<motion.footer
				className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100"
				variants={itemVariants}
				whileHover={{ scale: 1.01 }}
			>
				<div className="flex items-start space-x-4">
					<div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center shrink-0">
						<TbBulb className="text-white size-6" />
					</div>
					<div>
						<h3 className="font-semibold text-primary-dark mb-2">
							Consejos para una buena pregunta
						</h3>
						<div className="space-y-1 text-sm text-gray-600">
							<p>• Sea específico y directo en su consulta</p>
							<p>
								• Evite preguntas que requieran respuestas muy
								extensas
							</p>
							<p>
								• Su pregunta será leída públicamente durante la
								audiencia
							</p>
						</div>
					</div>
				</div>
			</motion.footer>
		</motion.article>
	);
}
