import { motion, AnimatePresence } from "motion/react";
import {
	FaCheckCircle,
	FaExclamationTriangle,
	FaTimes,
	FaCalendarCheck,
} from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import type { RendicionModalState } from "../types/rendicionAdmin";
import { Loader } from "dialca-ui";

type Props = RendicionModalState & {
	onClose: () => void;
};

export default function RendicionAdminModal({
	isOpen,
	onClose,
	type,
	title,
	message,
}: Props) {
	const getIcon = () => {
		switch (type) {
			case "success":
				return <FaCalendarCheck className="h-16 w-16" />;
			case "error":
				return <FaExclamationTriangle className="h-16 w-16" />;
			case "loading":
				return <Loader size="xl" />;
			default:
				return <FaCheckCircle className="h-16 w-16" />;
		}
	};
	const getIconColor = () => {
		switch (type) {
			case "success":
				return "text-green-500";
			case "error":
				return "text-red-500";
			case "loading":
				return "text-primary-dark";
			default:
				return "text-green-500";
		}
	};
	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
		exit: { opacity: 0 },
	};
	const modalVariants = {
		hidden: {
			opacity: 0,
			scale: 0.8,
			y: 50,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 300,
				damping: 20,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			y: 50,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.article
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
					variants={overlayVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					onClick={type !== "loading" ? onClose : undefined}
				>
					<motion.div
						className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden"
						variants={modalVariants}
						onClick={(e) => e.stopPropagation()}
					>
						<header
							className={`
                            p-8 text-center relative
                            ${
								type === "success"
									? "bg-linear-to-br from-green-50 to-emerald-50"
									: type === "error"
									? "bg-linear-to-br from-red-50 to-rose-50"
									: "bg-linear-to-br from-blue-50 to-indigo-50"
							}
                            `}
						>
							{type !== "loading" && (
								<button
									onClick={onClose}
									className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
								>
									<FaTimes className="h-4 w-4 text-gray-400" />
								</button>
							)}
							<motion.div
								className={`${getIconColor()} mx-auto mb-8 flex items-center justify-center`}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									delay: 0.2,
									type: "spring",
									stiffness: 200,
								}}
							>
								{getIcon()}
							</motion.div>
							<motion.h2
								className="text-2xl font-bold text-gray-900 font-titles"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								{title}
							</motion.h2>
						</header>
						<div className="p-8">
							<motion.p
								className="text-gray-600 font-body text-lg text-center leading-relaxed mb-8"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
							>
								{message}
							</motion.p>
							{type === "success" && (
								<motion.div
									className="bg-gray-50 rounded-xl p-4 mb-6"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-primary-dark rounded-full flex items-center justify-center shrink-0 mt-0.5">
											<ImInfo className="size-3 text-white" />
										</div>
										<div className="text-sm text-gray-600">
											<p className="font-semibold mb-1">
												Próximos pasos:
											</p>
											<ul className="space-y-1">
												<li>
													• La rendición aparecerá en
													el calendario público
												</li>
												<li>
													• Los ciudadanos podrán
													registrarse
												</li>
												<li>
													• Recibirá notificaciones de
													nuevas inscripciones
												</li>
											</ul>
										</div>
									</div>
								</motion.div>
							)}
							{type === "error" && (
								<motion.div
									className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									<div className="flex items-start space-x-3">
										<FaExclamationTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
										<div className="text-sm text-red-700">
											<p className="font-semibold mb-1">
												Posibles soluciones:
											</p>
											<ul className="space-y-1">
												<li>
													• Verifique que todos los
													campos estén completos
												</li>
												<li>
													• Revise su conexión a
													internet
												</li>
												<li>
													• Intente nuevamente en unos
													momentos
												</li>
											</ul>
										</div>
									</div>
								</motion.div>
							)}
							{type !== "loading" && (
								<motion.button
									onClick={onClose}
									className={`w-full py-4 px-6 rounded-xl font-semibold text-lg 
                                        transition-all duration-300 cursor-pointer
                                        ${
											type === "success"
												? "bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
												: type === "error"
												? "bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
												: "bg-primary-dark hover:bg-primary text-white"
										}
                                        transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl
                                        focus:outline-none focus:ring-4 focus:ring-opacity-20
                                        ${
											type === "success"
												? "focus:ring-green-500"
												: type === "error"
												? "focus:ring-red-500"
												: "focus:ring-primary-dark"
										}
                                    `}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
								>
									{type === "success"
										? "Entendido"
										: "Reintentar"}
								</motion.button>
							)}
						</div>
					</motion.div>
				</motion.article>
			)}
		</AnimatePresence>
	);
}
