import { api } from "@/core/config"
import type { ApiError } from "@/core/types"
import { formatName } from "@/shared/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { RiAdminFill, RiUserFill } from "react-icons/ri"
import { toast } from "sonner"

export const useCreateUser = () => {
    const [data, setData] = useState({
        nombre: "",
        dni: "",
        password: "",
        categoria: "admin",
        estado: 1
    })
    const [showPassword, setShowPassword] = useState(false)
    const roleOptions = [
        {
            value: "admin",
            label: "Administrador",
            icon: RiUserFill,
            description: "Puede gestionar rendiciones y participantes."
        },
        {
            value: "super_admin",
            label: "Super admin.",
            icon: RiAdminFill,
            description: "Tiene acceso completo a todas las funciones."
        }
    ]
    const handleChange = (key: string, value: typeof data[keyof typeof data]) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }
    const togglePasswordVisibility = () => setShowPassword(prev => !prev)
    const isFormValid = data.dni.length === 8 && data.nombre.trim() !== "" && data.password.length >= 8
    const validateForm = () => {
        if (data.nombre.trim() === "") {
            toast.error("El nombre no puede estar vacío")
            return false
        }
        if (data.password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres")
            return false
        }
        if (data.dni.trim() === "") {
            toast.error("El DNI no puede estar vacío")
            return false
        }
        if (data.dni.length !== 8) {
            toast.error("El DNI debe tener 8 dígitos")
            return false
        }
        return true
    }
    const resetForm = () => {
        setData({
            nombre: "",
            dni: "",
            password: "",
            categoria: "admin",
            estado: 1
        })
    }

    const fetchNameByDni = async (): Promise<string> => {
		const res = await api.get(`/dni/${data.dni}`);
		const { nombres, apellido_paterno, apellido_materno } = res.data;
		return formatName(nombres, apellido_paterno, apellido_materno);
	};
	const nameQuery = useQuery({
		queryKey: ["nameByDni", data.dni],
		queryFn: () => data.dni.length === 8 ? fetchNameByDni() : Promise.resolve(""),
		enabled: data.dni.length === 8,
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
		if (nameQuery.isSuccess && nameQuery.data) setData(prev => ({ ...prev, nombre: nameQuery.data }));
	}, [nameQuery.isSuccess, nameQuery.data]);

    const submitData = async () => {
        const res = await api.post("/admin", data, {
            withCredentials: true
        })
        return res.data
    }
    const createMutation = useMutation({
        mutationFn: submitData,
        onSuccess: () => {
            toast.success("Usuario creado exitosamente")
            resetForm()
        },
        onError: (error: ApiError) => {
            console.error("Error al registrar:", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"No se pudo completar el registro. Verifique su conexión e intente nuevamente.";
            toast.error(errorMessage);
        }
    }) 
    const handleSubmit = () => {
        if (!validateForm()) return
        createMutation.mutate()
    }

    return {
        data,
        showPassword,
        togglePasswordVisibility,
        handleChange,
        handleSubmit,
        isFormValid,
        roleOptions,
        isSubmitting: createMutation.isPending,
        isFetchingDni: nameQuery.isLoading
    }
}