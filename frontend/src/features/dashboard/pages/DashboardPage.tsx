import { motion } from "motion/react";
import { FaSyncAlt } from "react-icons/fa";
import StatCard from "../components/StatCard";
import DashboardChart from "../components/DashboardChart";
import RecentActivityList from "../components/RecentActivityList";
import UpcomingRendiciones from "../components/UpcomingRendiciones";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useDashboard } from "../hooks/useDashboard";
import { useDashboardAnimations } from "../hooks/useDashboardAnimations";
import { CHART_COLORS, MOCK_CHART_DATA, STAT_CARDS_CONFIG } from "../constants/dashboardData";
import type { DashboardStats } from "../types/dashboard";
import { PiWarningCircleDuotone } from "react-icons/pi";
import { Button } from "dialca-ui";

export default function DashboardPage() {
	const {
		stats,
		chartData,
		recentActivity,
		upcomingRendiciones,
		isLoading,
		isFetching,
		error,
		refreshData,
	} = useDashboard();

	const { containerVariants, itemVariants } = useDashboardAnimations();

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="size-26 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<PiWarningCircleDuotone className="size-20 text-red-500" />
					</div>
					<h3 className="text-4xl font-titles  font-semibold text-gray-900 mb-2">
						Error al cargar datos
					</h3>
					<p className="text-gray-600 text-lg font-body mb-4">{error}</p>
					<Button
						onClick={refreshData}
					>
						Reintentar
					</Button>
				</div>
			</div>
		);
	}

	if (isLoading) return <DashboardSkeleton />;

	return (
		<motion.div
			className="space-y-8"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.header
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
				variants={itemVariants}
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 font-titles">
						Dashboard
					</h1>
					<p className="text-gray-600 mt-1 font-body text-lg">
						Bienvenido al panel de administración de Rendición de
						Cuentas
					</p>
				</div>
				<motion.button
					onClick={refreshData}
					disabled={isFetching}
					className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-xl hover:bg-primary transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<FaSyncAlt
						className={`h-4 w-4 ${
							isFetching ? "animate-spin" : ""
						}`}
					/>
					{isFetching ? "Actualizando..." : "Actualizar"}
				</motion.button>
			</motion.header>
			<motion.div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				variants={itemVariants}
			>
				{STAT_CARDS_CONFIG.map((config) => (
					<StatCard
						key={config.key}
						title={config.title}
						value={stats?.[config.key as keyof DashboardStats] ?? 0}
						icon={config.icon}
						color={config.color}
						// trend={config.trend}
					/>
				))}
			</motion.div>
			<motion.div
				className="grid grid-cols-1 lg:grid-cols-2 gap-6"
				variants={itemVariants}
			>
				<DashboardChart
					title="Asistentes por Mes"
					data={chartData?.asistentes ?? MOCK_CHART_DATA.asistentes}
					type="area"
					color={CHART_COLORS.blue}
				/>
				<DashboardChart
					title="Preguntas por Mes"
					data={chartData?.preguntas ?? []}
					type="area"
					color={CHART_COLORS.green}
				/>
			</motion.div>
			<motion.div variants={itemVariants}>
				<DashboardChart
					title="Preguntas por Eje Temático"
					data={chartData?.ejesTematicos ?? []}
					type="bar"
					color={CHART_COLORS.lightBlue}
				/>
			</motion.div>
			<motion.div
				className="grid grid-cols-1 lg:grid-cols-2 gap-6"
				variants={itemVariants}
			>
				<RecentActivityList activities={recentActivity} />
				<UpcomingRendiciones rendiciones={upcomingRendiciones} />
			</motion.div>
		</motion.div>
	);
}