import { useQuery } from "@tanstack/react-query";
import { api } from "@/core/config";
import type {
	DashboardStats,
	RendicionChartData,
	RecentActivity,
	UpcomingRendicion,
	DashboardApiResponse,
} from "../types/dashboard";

export const useDashboard = () => {
	const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
		const res = await api.get("/admin/dashboard", {
			withCredentials: true,
		});
		return res.data;
	};
	const dashboardQuery = useQuery({
		queryKey: ["dashboard", "stats"],
		queryFn: fetchDashboardData,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			if (failureCount >= 2) return false;
			if (error.message.includes("404") || error.message.includes("400"))
				return false;
			return true;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const transformData = (data?: DashboardApiResponse["data"]) => {
		if (!data) return null;
		const stats: DashboardStats = {
			totalRendiciones: data.resumen_general.total_rendiciones,
			rendicionesRealizadas: data.resumen_general.rendiciones_realizadas,
			totalAsistentes: data.resumen_general.total_asistentes,
			totalOradores: data.resumen_general.total_oradores,
			preguntasRecibidas: data.resumen_general.preguntas_recibidas,
			preguntasRespondidas: data.resumen_general.preguntas_respondidas,
			preguntasPendientes: data.resumen_general.preguntas_pendientes,
		};
		const chartData: RendicionChartData = {
			asistentes: data.graficos.asistentes_por_mes.map((item) => ({
				name: formatMonth(item.mes),
				value: item.total,
			})),
			preguntas: data.graficos.preguntas_por_mes.map((item) => ({
				name: formatMonth(item.mes),
				value: item.total,
			})),
			ejesTematicos: data.graficos.preguntas_por_eje.map((item) => ({
				name: item.tematica,
				value: parseInt(item.total_preguntas, 10),
			})),
		};
		const recentActivity: RecentActivity[] = data.actividad_reciente.map(
			(item, index) => ({
				id: `${item.type}_${index}`,
				type: item.type,
				title: item.title,
				subtitle: item.subtitle,
				time_ago: item.time_ago,
				datetime: item.datetime,
				administrador: item.administrador,
			})
		);
		const upcomingRendiciones: UpcomingRendicion[] =
			data.rendiciones.proximas.map((item) => ({
				id: item.id,
				title: item.titulo || `Rendición #${item.id}`,
				descripcion: item.descripcion,
				date: item.fecha,
				time: item.hora,
				registrados: item.registrados,
				preguntasCount: item.preguntas_count,
				status: item.estado,
			}));
		const rendicionesHoy: UpcomingRendicion[] =
			data.rendiciones.programadas_hoy.map((item) => ({
				id: item.id,
				title: item.titulo || `Rendición #${item.id}`,
				descripcion: item.descripcion,
				date: item.fecha,
				time: item.hora,
				registrados: item.registrados,
				preguntasCount: item.preguntas_count,
				status: item.estado,
			}));

		return {
			stats,
			chartData,
			recentActivity,
			upcomingRendiciones,
			rendicionesHoy,
		};
	};

	const transformedData = transformData(dashboardQuery.data?.data);

	const refreshData = () => {
		dashboardQuery.refetch();
	};

	return {
		stats: transformedData?.stats || null,
		chartData: transformedData?.chartData || null,
		recentActivity: transformedData?.recentActivity || [],
		upcomingRendiciones: transformedData?.upcomingRendiciones || [],
		rendicionesHoy: transformedData?.rendicionesHoy || [],
		isLoading: dashboardQuery.isLoading,
		isFetching: dashboardQuery.isFetching,
		error: dashboardQuery.error?.message || null,
		refreshData,
		isSuccess: dashboardQuery.isSuccess,
		isError: dashboardQuery.isError,
	};
};

const formatMonth = (monthString: string): string => {
	if (!monthString) return "";

	const [year, month] = monthString.split("-");
	const date = new Date(parseInt(year), parseInt(month) - 1);

	return date.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "short",
	});
};
