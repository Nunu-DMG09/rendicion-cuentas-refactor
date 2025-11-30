import type {
	CreatedRendicion,
	RendicionFormData,
} from "../types/rendicionAdmin";
import { useRendicionModal } from "./useRendicionModal";
import { api } from "@/core/config";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/core/types";

export const useRendicionForm = () => {
	const {
		modalState,
		showSuccessModal,
		showErrorModal,
		showLoadingModal,
		closeModal,
	} = useRendicionModal();
	const createRendicion = async (
		data: RendicionFormData
	): Promise<CreatedRendicion> => {
		const formData = new FormData();
		const jsonData = {
			fecha: data.fecha,
			hora: data.hora,
			ejes: data.ejesTematicos,
            admin_id: 1, // Temporal hasta implementar auth
		};
		formData.append("data", JSON.stringify(jsonData));
		data.banners.forEach((banner, index) => {
			formData.append(`banner_${index}`, banner.file, banner.name);
		});
        console.log('Enviando datos:', {
            jsonData,
            totalBanners: data.banners.length,
            bannerNames: data.banners.map(b => b.name)
        });
		const res = await api.post("/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data as CreatedRendicion;
	};
	const createRendicionMutation = useMutation({
		mutationFn: createRendicion,
		onMutate: () => showLoadingModal(),
		onSuccess: (response) => {
			console.log('Rendición creada exitosamente:', {
                id: response.data.id,
                fecha: response.data.rendicion.fecha,
                hora: response.data.rendicion.hora,
                totalBanners: response.data.total_banners,
                totalEjes: response.data.total_ejes,
                banners: response.data.banners.map(b => ({
                    id: b.id,
                    name: b.original_name,
                    url: b.url
                }))
            });
			showSuccessModal();
		},
		onError: (error: ApiError) => {
			console.error("Error al crear rendición:", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"No se pudo crear la rendición. Verifique los datos e intente nuevamente.";
			showErrorModal(errorMessage);
		},
	});

	const submitRendicion = async (data: RendicionFormData) => {
		if (!data.fecha) {
            showErrorModal('La fecha es requerida')
            return false
        }
        if (!data.hora) {
            showErrorModal('La hora es requerida')
            return false
        }
        if (data.banners.length === 0) {
            showErrorModal('Debe subir al menos un banner')
            return false
        }
        if (data.ejesTematicos.length === 0) {
            showErrorModal('Debe seleccionar al menos un eje temático')
            return false
        }
        const selectedDate = new Date(data.fecha)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            showErrorModal('La fecha no puede ser en el pasado')
            return false
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        const oversizedFiles = data.banners.filter(banner => banner.file.size > maxSize)
        if (oversizedFiles.length > 0) {
            showErrorModal(`El/Los archivo(s) ${oversizedFiles.map(f => f.name).join(', ')} excede(n) el tamaño máximo de 5MB`)
            return false
        }

		try {
            await createRendicionMutation.mutateAsync(data)
            return true
        } catch (error) {
            console.error('Error al enviar la rendición:', error)
            return false
        }
	};

	return {
		isLoading: createRendicionMutation.isPending,
		modalState,
		submitRendicion,
		closeModal,
	};
};
