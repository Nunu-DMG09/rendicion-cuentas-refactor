import { useQuery } from "@tanstack/react-query";
import { api } from "../config";

export interface RegistrationRendicion {
	id: string;
	titulo: string;
	fecha: string;
	hora: string;
	descripcion: string;
	ejes_seleccionados: Array<{
		id: string;
		tematica: string;
	}>;
}

export interface RegistrationDataResponse {
	success: boolean;
	message: string;
	data: RegistrationRendicion;
}

export const useRegistrationData = () => {
	// Fetch para registrarse en la rendición más reciente
	const fetchRegistrationData = async (): Promise<RegistrationDataResponse> => {
		const res = await api.get("/home/datos-registro");
		return res.data;
	};
	const registrationQuery = useQuery({
		queryKey: ["registration", "current"],
		queryFn: fetchRegistrationData,
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
	const hasActiveRegistration = Boolean(
		registrationQuery.data?.success && registrationQuery.data?.data?.id
	);
	const rendicionData = registrationQuery.data?.data;
	const isRegistrationAvailable =
		hasActiveRegistration && !registrationQuery.isLoading;

	return {
		registrationQuery,
		rendicionData,
		hasActiveRegistration,
		isRegistrationAvailable,
		isLoading: registrationQuery.isLoading,
		error: registrationQuery.error,
		refetch: registrationQuery.refetch,
	};
};
