import { api } from "@/core/config";
import { useQuery } from "@tanstack/react-query";
import type { BannersResponse } from "../types/banner";
import type { Slide } from "../types/slide";

export const useHomeData = () => {
	const fetchBanners = async (): Promise<BannersResponse> => {
		const res = await api.get("/home/banners");
		return res.data;
	};
	// Fetch para obtener las rendiciones más recientes y usarlas como url para ver sus preguntas
	const fetchRecentRendiciones = async () => {
		const res = await api.get("/home/rendiciones");
		return res.data.data;
	};
	const bannersQuery = useQuery({
		queryKey: ["banners"],
		queryFn: fetchBanners,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (failureCount >= 2) return false;
			if (error.message.includes("404") || error.message.includes("400"))
				return false;
			return true;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
	const transformBannersToSlides = (
		bannersData?: BannersResponse
	): Slide[] => {
		if (!bannersData?.data?.banners?.length) return [];
		return bannersData.data.banners
			.filter((banner) => banner.ruta)
			.map((banner) => ({
				id: banner.id,
				src: banner.ruta,
				alt: banner.titulo || "Banner image",
				title: banner.titulo,
				description: banner.descripcion,
			}));
	};
	const slides = transformBannersToSlides(bannersQuery.data);
	const recentRendicionesQuery = useQuery({
		queryKey: ["recentRendiciones"],
		queryFn: fetchRecentRendiciones,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (failureCount >= 2) return false;
			if (error.message.includes("404") || error.message.includes("400"))
				return false;
			return true;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
	return {
		bannersQuery,
		slides,
        isLoadingBanners: bannersQuery.isLoading,
        bannersError: bannersQuery.error,
		recentRendicionesQuery,
	};
};
