import { useState } from "react";
import type {
	RendicionItem,
	EditModalState,
	ViewModalState,
	BannerFile,
	RendicionEditData,
	EditRendicionResponse,
} from "../types/rendicionAdmin";
import { AVAILABLE_YEARS } from "../constants/rendicionAdminData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/core/config";
import { toast } from "sonner";
import type { ApiError } from "@/core/types";

export const useVerRendiciones = () => {
	const queryClient = useQueryClient();
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [editModal, setEditModal] = useState<EditModalState>({
		isOpen: false,
		rendicion: null,
	});
	const [viewModal, setViewModal] = useState<ViewModalState>({
		isOpen: false,
		rendicion: null,
	});
	const fetchRendiciones = async () => {
		const res = await api.get(`/rendiciones?year=${selectedYear}`);
		return res.data.data as RendicionItem[];
	};
	const rendicionesQuery = useQuery({
		queryKey: ["rendiciones", selectedYear],
		queryFn: fetchRendiciones,
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

	const isEditable = (rendicion: RendicionItem): boolean => {
		const currentYear = new Date().getFullYear();
		const rendicionDate = new Date(rendicion.fecha);
		const today = new Date();
		return (
			rendicion.year === currentYear &&
			rendicionDate >= today &&
			rendicion.status === "programada"
		);
	};
	const openEditModal = (rendicion: RendicionItem) => {
		setEditModal({
			isOpen: true,
			rendicion,
		});
	};
	const closeEditModal = () => {
		setEditModal({
			isOpen: false,
			rendicion: null,
		});
        editRendicionMutation.reset();
	};
	const openViewModal = (rendicion: RendicionItem) => {
		setViewModal({
			isOpen: true,
			rendicion,
		});
	};
	const closeViewModal = () => {
		setViewModal({
			isOpen: false,
			rendicion: null,
		});
	};
	const editRendicion = async (
		editData: RendicionEditData
	): Promise<EditRendicionResponse> => {
		const { id, fecha, hora, banners = [] } = editData;
		const formData = new FormData();
		const json = {
			fecha,
			hora,
		};
		formData.append("data", JSON.stringify(json));
		if (banners.length > 0)
			banners.forEach((banner, idx) => {
				formData.append(`banner_${idx}`, banner.file, banner.name);
			});
		console.log("Enviando datos de edición:", {
			id,
			fecha,
			hora,
			totalBanners: banners.length,
			bannerNames: banners.map((b) => b.name),
		});
		const res = await api.post(`/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		});
		if (!res.data.success)
			throw new Error(
				res.data.message || "Error al actualizar la rendición"
			);
		return res.data as EditRendicionResponse;
	};
	const editRendicionMutation = useMutation({
		mutationFn: editRendicion,
		onSuccess: (response, variables) => {
			console.log("Rendición actualizada con éxito:", response.data);
			queryClient.invalidateQueries({
				queryKey: ["rendiciones"],
			});
			queryClient.setQueryData<RendicionItem[]>(
				["rendiciones", new Date().getFullYear()],
				(old = []) => {
					return old.map((rendicion) =>
						rendicion.id === variables.id
							? {
									...rendicion,
									fecha: variables.fecha,
									hora: variables.hora,
									banners: response.data.banners.map((b) => ({
										id: b.id.toString(),
										url: b.url,
										name: b.original_name || "Banner",
									})),
							}
							: rendicion
					);
				}
			);
            toast.success('Rendición actualizada con éxito');
            setTimeout(() => {
                closeEditModal();
            }, 1500);
		},
        onError: (error: ApiError) => {
            console.error("Error actualizando rendición", error);
            let errorMessage = "Error al actualizar la rendición";
            if (error.response?.data?.message) errorMessage = error.response.data.message
            else if (error.message) errorMessage = error.message
            toast.error(errorMessage)
        }
	});
	const updateRendicion = async (
		id: string,
		fecha: string,
		hora: string,
		banners: BannerFile[]
	): Promise<boolean> => {
		if (!fecha) {
            toast.error("La fecha es requerida");
            return false;
        }
        if (!hora) {
            toast.error("La hora es requerida");
            return false;
        }
        const selectedDate = new Date(fecha)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
            toast.error('La fecha no puede ser en el pasado.')
            return false
        }

		try {
			await editRendicionMutation.mutateAsync({
                id,
                fecha,
                hora,
                banners: banners.length > 0 ? banners : undefined
            })
			return true;
		} catch (error) {
			console.error(error)
			return false;
		}
	};

	return {
		selectedYear,
		setSelectedYear,
		rendicionesQuery,
        editRendicionMutation,
		availableYears: AVAILABLE_YEARS,
		// Edit modal
		editModal,
		openEditModal,
		closeEditModal,
		// View modal
		viewModal,
		openViewModal,
		closeViewModal,
		// Utilidades
		isEditable,
		updateRendicion,
        isUpdating: editRendicionMutation.isPending,
		updateSuccess: editRendicionMutation.isSuccess,
		updateError: editRendicionMutation.error?.message || null,
	};
};
