import { motion } from "motion/react";
import {
	FaCommentSlash,
	FaMicrophone,
	FaQuestionCircle,
	FaTable,
	FaUserCheck,
	FaUsers,
	FaUserTimes,
} from "react-icons/fa";

export function ReporteTableSkeleton({ rows = 10 }: { rows?: number }) {
	return (
		<motion.div
			className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<header className="bg-linear-to-r from-primary-dark to-primary p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
						<FaTable className="h-5 w-5 text-white" />
					</div>
					<div className="space-y-2">
						<div className="h-5 bg-white/30 rounded-lg w-48 animate-pulse" />
						<div className="h-4 bg-white/20 rounded-lg w-32 animate-pulse" />
					</div>
				</div>
				<div className="h-10 bg-white/30 rounded-lg w-40 animate-pulse" />
			</header>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-200">
							{[
								"DNI",
								"Nombre",
								"Sexo",
								"Tipo",
								"RUC",
								"Organización",
								"Asistencia",
								"Eje",
								"Pregunta",
							].map((_, index) => (
								<th key={index} className="text-left px-4 py-3">
									<div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: rows }).map((_, rowIndex) => (
							<motion.tr
								key={rowIndex}
								className="border-b border-gray-100"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: rowIndex * 0.03 }}
							>
								<td className="px-4 py-3">
									<div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
								</td>
								<td className="px-4 py-3">
									<div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="w-7 h-7 bg-gray-200 rounded-full mx-auto animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="h-6 bg-gray-200 rounded-full w-20 mx-auto animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
								</td>
								<td className="px-4 py-3">
									<div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="h-6 bg-gray-200 rounded-full w-12 mx-auto animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="h-6 bg-gray-200 rounded-full w-24 mx-auto animate-pulse" />
								</td>
								<td className="px-4 py-3 text-center">
									<div className="h-8 bg-gray-200 rounded-lg w-28 mx-auto animate-pulse" />
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="h-4 bg-gray-300 rounded w-40 animate-pulse" />
					<div className="flex items-center gap-2">
						<div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
						<div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
						<div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
						<div className="h-9 w-9 bg-gray-300 rounded-lg animate-pulse" />
					</div>
					<div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
				</div>
			</div>
		</motion.div>
	);
}

export function ReporteStatsSkeleton() {
	const statsConfig = [
		{
			icon: FaUsers,
			bg: "bg-[#e8f4fc]",
			border: "border-[#cce5f5]",
			iconBg: "bg-[#3b82f6]",
		},
		{
			icon: FaUserCheck,
			bg: "bg-[#e6f7ed]",
			border: "border-[#c3ecd3]",
			iconBg: "bg-[#22c55e]",
		},
		{
			icon: FaUserTimes,
			bg: "bg-[#fce8e8]",
			border: "border-[#f5cccc]",
			iconBg: "bg-[#ef4444]",
		},
		{
			icon: FaMicrophone,
			bg: "bg-[#f3e8ff]",
			border: "border-[#e9d5ff]",
			iconBg: "bg-[#a855f7]",
		},
		{
			icon: FaQuestionCircle,
			bg: "bg-[#fef9e6]",
			border: "border-[#fcefc3]",
			iconBg: "bg-[#f59e0b]",
		},
		{
			icon: FaCommentSlash,
			bg: "bg-[#f1f5f9]",
			border: "border-[#e2e8f0]",
			iconBg: "bg-[#64748b]",
		},
	];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
			{statsConfig.map((stat, index) => (
				<motion.div
					key={index}
					className={`${stat.bg} ${stat.border} border rounded-xl p-3`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.05 }}
				>
					<div className="flex items-center gap-2">
						<div
							className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center shrink-0`}
						>
							<stat.icon className="h-4 w-4 text-white" />
						</div>
						<div className="min-w-0 space-y-1.5 flex-1">
							<div className="h-5 bg-gray-300/50 rounded w-12 animate-pulse" />
							<div className="h-3 bg-gray-300/40 rounded w-16 animate-pulse" />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
}

export function ReporteHeaderSkeleton() {
    return (
        <motion.div
            className="bg-linear-to-r from-primary-dark to-primary rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="space-y-2">
                <div className="h-6 bg-white/30 rounded-lg w-48 animate-pulse" />
                <div className="h-4 bg-white/20 rounded-lg w-32 animate-pulse" />
            </div>
        </motion.div>
    )
}

export const ReportSkeleton = () => (
	<motion.div
		className="space-y-6"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ delay: 0.1 }}
	>
		<ReporteHeaderSkeleton />
		<ReporteStatsSkeleton />
		<ReporteTableSkeleton rows={10} />
	</motion.div>
);
