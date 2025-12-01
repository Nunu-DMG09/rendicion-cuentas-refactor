import { motion } from "motion/react";
import {
	FaClock,
	FaUsers,
	FaQuestionCircle,
	FaEdit,
	FaEye,
	FaTags,
} from "react-icons/fa";
import type { RendicionItem } from "../types/rendicionAdmin";
import { formatDateWithWeekday } from "@/shared/utils";
import { statusConfig } from "../constants/config";

type Props = {
	rendicion: RendicionItem;
	isEditable: boolean;
	onEdit: () => void;
	onView: () => void;
};

export default function RendicionCard({
	rendicion,
	isEditable,
	onEdit,
	onView,
}: Props) {
	const status = statusConfig[rendicion.status];

	return (
		<motion.article
			className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -5 }}
		>
			<header className="relative h-48 md:h-56 overflow-hidden">
				<img
					src={
						rendicion.banners[0]?.url ||
						"https://placehold.co/1200x400/002f59/white?text=Sin+Banner"
					}
					alt="Banner de rendición"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
				<div
					className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${status.bg} ${status.text} flex items-center gap-2`}
				>
					<span
						className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}
					/>
					<span className="text-sm font-semibold">
						{status.label}
					</span>
				</div>
				<div className="absolute bottom-4 left-4 text-white">
					<p className="text-2xl font-bold capitalize">
						{formatDateWithWeekday(rendicion.fecha)}
					</p>
					<p className="text-lg opacity-90 flex items-center gap-2">
						<FaClock className="h-4 w-4" />
						{rendicion.hora} hrs
					</p>
				</div>
			</header>
			<main className="p-6">
				<div className="grid grid-cols-2 gap-4 mb-6">
					<div className="bg-blue-50 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
								<FaUsers className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold text-primary-dark">
									{rendicion.asistentesRegistrados}
								</p>
								<p className="text-sm text-gray-500">
									Asistentes
								</p>
							</div>
						</div>
					</div>
					<div className="bg-yellow-50 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
								<FaQuestionCircle className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold text-yellow-600">
									{rendicion.preguntasRecibidas}
								</p>
								<p className="text-sm text-gray-500">
									Preguntas
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-2">
						<FaTags className="h-4 w-4 text-gray-400" />
						<span className="text-sm font-medium text-gray-600">
							Ejes Temáticos
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{(rendicion.ejesTematicos || [])
							.slice(0, 3)
							.map((eje, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
								>
									{eje.nombre}
								</span>
							))}
						{(rendicion.ejesTematicos || []).length > 3 && (
							<span className="px-3 py-1 bg-primary-dark/10 text-primary-dark rounded-full text-sm font-medium">
								+{(rendicion.ejesTematicos || []).length - 3}{" "}
								más
							</span>
						)}
					</div>
				</div>
				<div className="flex gap-3">
					{isEditable ? (
						<motion.button
							onClick={onEdit}
							className="flex-1 py-3 px-4 bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-all cursor-pointer"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<FaEdit className="h-4 w-4" />
							Editar Rendición
						</motion.button>
					) : (
						<motion.button
							onClick={onView}
							className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all cursor-pointer"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<FaEye className="h-4 w-4" />
							Ver Detalles
						</motion.button>
					)}
				</div>
			</main>
		</motion.article>
	);
}
