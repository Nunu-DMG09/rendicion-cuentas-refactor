import { api } from "@/core/config";
import type { ApiError } from "@/core/types";
import type { ModalState } from "@/features/registration/types/modal";
import { formatName } from "@/shared/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useAsistencia = () => {
    const [dni, setDni] = useState("");
    const [fullName, setFullName] = useState("");
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    })
    const handleDniChange = (value: string) => {
        const formattedValue = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        setDni(formattedValue);
    }
    const handleFullNameChange = (value: string) => setFullName(value);
    const fetchNameByDni = async (): Promise<string> => {
		const res = await api.get(`/dni/${dni}`);
		const { nombres, apellido_paterno, apellido_materno } = res.data;
		return formatName(nombres, apellido_paterno, apellido_materno);
	};
	const nameQuery = useQuery({
		queryKey: ["nameByDni", dni],
		queryFn: () =>
			dni.length === 8 ? fetchNameByDni() : Promise.resolve(""),
		enabled: dni.length === 8,
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
	useEffect(() => {
		if (nameQuery.isSuccess && nameQuery.data) setFullName(nameQuery.data);
	}, [nameQuery.isSuccess, nameQuery.data]);
    const showSuccessModal = useCallback(() => {
        setModalState({
            isOpen: true,
            type: 'success',
            title: "¡Asistencia Registrada!",
            message: "Tu asistencia ha sido registrada correctamente.",
        })
    }, [])
    const showErrorModal = useCallback((errorMessage?: string) => {
        setModalState({
            isOpen: true,
            type: 'error',
            title: 'Error en el Registro',
            message: errorMessage || 'Ha ocurrido un error inesperado. Por favor, inténtalo nuevamente o contacta al soporte técnico.'
        })
    }, [])
    const showLoadingModal = useCallback((message: string = 'Procesando tu solicitud...') => {
        setModalState({
            isOpen: true,
            type: 'loading',
            title: 'Procesando',
            message
        })
    }, [])
    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }))
    }, [])
    const asistencia = async () => {
        const res = await api.put(`/usuarios/${dni}/asistencia`, {
            asistencia: 'si',
        });
        return res.data;
    }
    const asistenciaMutation = useMutation({
        mutationFn: asistencia,
        onMutate: () => {
            showLoadingModal('Registrando tu asistencia...');
        },
        onSuccess: () => {
            showSuccessModal();
            setTimeout(() => {
                // Reset form
                setDni("");
                setFullName("");
            }, 3000)
        },
        onError: (error: ApiError) => {
            console.error("Error al registrar asistencia:", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"No se pudo completar la asistencia. Verifique su conexión e intente nuevamente.";
			showErrorModal(`Error: ${errorMessage}`);
        }
    })
    const handleSubmit = () => {
        if (dni.length !== 8) {
            showErrorModal("Por favor, ingresa un DNI válido de 8 dígitos.");
            return;
        }
        if (!dni) {
            showErrorModal("El campo DNI es obligatorio.");
            return;
        }
        asistenciaMutation.mutate();
    }

    return {
        dni,
        handleDniChange,
        fullName,
        handleFullNameChange,
        isLoadingName: nameQuery.isLoading,
        isLoading: asistenciaMutation.isPending,
        handleSubmit,
        modalState,
        closeModal,
    }
}