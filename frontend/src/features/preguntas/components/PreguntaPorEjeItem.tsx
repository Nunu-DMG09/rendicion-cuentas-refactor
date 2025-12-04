import { AnimatePresence, motion } from "motion/react";
import type {
	PreguntasPorEje,
	PreguntasPorEjeSelector,
} from "../types/preguntas";
import { FaChevronDown, FaTags, FaUser, FaCheckCircle, FaCalendar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Checkbox } from "dialca-ui";
import { formatDate } from "@/shared/utils";

interface Props {
	grupo: PreguntasPorEje | PreguntasPorEjeSelector;
	isExpanded: boolean;
	grupoIndex: number;
	toggleEje: (ejeId: string) => void;
	onUnselect?: (preguntaId: string) => void;
	isSelectorMode?: boolean;
	onSelect?: (preguntaId: string) => void;
}

export const PreguntaPorEjeItem = ({
	grupo,
	isExpanded,
	grupoIndex,
	toggleEje,
	onUnselect,
	isSelectorMode,
	onSelect,
}: Props) => {
	const selectedCount = grupo.preguntas.filter(
		(p) => "isSelected" in p && p.isSelected
	).length;
	const totalCount = grupo.preguntas.length;
	const selectionPercentage =
		totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;

	return (
		<motion.div
			key={grupo.ejeId}
			className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ delay: grupoIndex * 0.05 }}
		>
			<button
				onClick={() => toggleEje(grupo.ejeId)}
				className="w-full bg-linear-to-r from-primary-dark to-primary p-6 flex items-center justify-between cursor-pointer hover:brightness-110 transition-all group"
			>
				<div className="flex items-center gap-4 flex-1 min-w-0">
					<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
						<FaTags className="h-6 w-6 text-white" />
					</div>
					<div className="text-left flex-1 min-w-0">
						<h3 className="text-xl font-bold text-white mb-1 truncate">
							{grupo.ejeNombre}
						</h3>
						<div className="flex items-center gap-4 text-blue-100">
							<span className="text-sm font-medium">
								{totalCount} pregunta{totalCount !== 1 ? "s" : ""}
							</span>
							{isSelectorMode && (
								<>
									<span className="w-1 h-1 bg-blue-200 rounded-full"></span>
									<span className="text-sm font-medium">
										{selectedCount} seleccionada
										{selectedCount !== 1 ? "s" : ""}
									</span>
									{selectedCount > 0 && (
										<>
											<span className="w-1 h-1 bg-blue-200 rounded-full"></span>
											<span className="text-sm font-medium">
												{Math.round(selectionPercentage)}%
											</span>
										</>
									)}
								</>
							)}
						</div>
						{isSelectorMode && (
							<motion.div
								className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden"
								initial={{ width: 0 }}
								animate={{ width: "100%" }}
							>
								<motion.div
									className="h-full bg-white/60 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: `${selectionPercentage}%` }}
									transition={{
										delay: 0.5,
										duration: 0.8,
										ease: "easeOut",
									}}
								/>
							</motion.div>
						)}
					</div>
				</div>
				<motion.div
					animate={{ rotate: isExpanded ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center ml-4"
				>
					<FaChevronDown className="h-5 w-5 text-white" />
				</motion.div>
			</button>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div className="p-6 space-y-4 bg-linear-to-b from-gray-50/50 to-transparent">
							{grupo.preguntas.map((pregunta, index) => {
								const isSelected = "isSelected" in pregunta && pregunta.isSelected;
								return (
									<motion.div
										key={pregunta.id}
										className={`
                                            relative rounded-2xl border-2 transition-all duration-300 overflow-hidden
                                            ${
												isSelected && isSelectorMode
													? "border-primary-dark/30 bg-linear-to-r from-primary-dark/5 to-primary/5 shadow-lg shadow-primary-dark/10"
													: "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
											}
                                        `}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20, height: 0 }}
										transition={{ delay: index * 0.05 }}
										whileHover={{ y: -2 }}
									>
										{isSelected && isSelectorMode && (
											<motion.div
												className="absolute inset-0 bg-linear-to-r from-primary-dark/10 via-transparent to-primary/10 pointer-events-none"
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ duration: 0.3 }}
											/>
										)}
										<div className="p-6">
											<div className="flex items-start gap-4">
												{isSelectorMode && (onSelect || onUnselect) && (
													<div className="shrink-0 pt-1">
														<motion.div
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
														>
															<Checkbox
																checked={isSelected}
																classes={{
																	container:
																		"bg-transparent! shadow-none!",
																}}
																title={
																	isSelected
																		? "Deseleccionar pregunta"
																		: "Seleccionar pregunta"
																}
																onCheckedChange={() => {
																	if (isSelected && onUnselect) {
																		onUnselect(pregunta.id);
																	} else if (!isSelected && onSelect) {
																		onSelect(pregunta.id);
																	}
																}}
															/>
														</motion.div>
													</div>
												)}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between mb-4">
														<div className="flex items-center gap-3">
															<div
																className={`
                                                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                                                                ${
																	isSelected && isSelectorMode
																		? "bg-primary-dark text-white shadow-lg"
																		: "bg-primary-dark/10 text-primary-dark"
																}
                                                            `}
															>
																<FaUser className="w-5 h-5" />
															</div>
															<div className="min-w-0 flex-1">
																<p
																	className={`
                                                                    font-bold text-base leading-tight mb-1
                                                                    ${
																		isSelected && isSelectorMode
																			? "text-primary-dark"
																			: "text-gray-900"
																	}
                                                                `}
																>
																	{pregunta.participante.nombre}
																</p>
																{pregunta.participante.dni && (
																	<p className="text-sm text-gray-500 flex items-center gap-1">
																		<span>
																			DNI:{" "}
																			{
																				pregunta.participante
																					.dni
																			}
																		</span>
																	</p>
																)}
															</div>
														</div>
														<span
															className={`
                                                            inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold
                                                            ${
																pregunta.respondida
																	? "bg-emerald-100 text-emerald-700 border border-emerald-200"
																	: "bg-amber-100 text-amber-700 border border-amber-200"
															}
                                                        `}
														>
															{pregunta.respondida ? (
																<>
																	<FaCheckCircle className="w-3 h-3" />
																	Respondida
																</>
															) : (
																<>
																	<div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
																	Pendiente
																</>
															)}
														</span>
													</div>
													<div
														className={`
                                                        p-4 rounded-xl border-l-4 mb-4 transition-all
                                                        ${
															isSelected && isSelectorMode
																? "bg-white/70 border-l-primary-dark shadow-sm"
																: "bg-gray-50/70 border-l-gray-300"
														}
                                                    `}
													>
														<p className="text-gray-800 leading-relaxed text-base italic">
															"{pregunta.texto}"
														</p>
													</div>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2 text-sm text-gray-500">
															<FaCalendar className="w-4 h-4" />
															<span>
																{formatDate(pregunta.fechaCreacion)}
															</span>
														</div>
														{isSelected && isSelectorMode && (
															<motion.div
																className="flex items-center gap-2 px-3 py-1.5 bg-primary-dark/90 text-white rounded-xl text-sm font-semibold"
																initial={{ scale: 0, x: 20 }}
																animate={{ scale: 1, x: 0 }}
																transition={{
																	delay: 0.1,
																	type: "spring",
																	stiffness: 200,
																}}
															>
																<HiSparkles className="w-4 h-4" />
																<span>Seleccionada</span>
															</motion.div>
														)}
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};
