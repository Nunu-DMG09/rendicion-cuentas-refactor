import { useEffect, useState } from "react";
import type {
	RegistrationStep,
	Gender,
	Role,
	ParticipationType,
} from "../types/registration";
import { useRegistrationModal } from "./useRegistrationModal";
import { toast } from "sonner";
import { api } from "@/core/config";
import { formatName } from "@/shared/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/core/types";

export function useRegistration(rendicionId: string) {
    // =======================
    // States
    // =======================
	const [currentStep, setCurrentStep] = useState<RegistrationStep>("registration");
	const [dni, setDni] = useState("");
	const [fullName, setFullName] = useState("");
	const [gender, setGender] = useState<Gender>("male");
	const [role, setRole] = useState<Role>("attendee");
    const [participationType, setParticipationType] = useState<ParticipationType>("personal");
	const [organizationRuc, setOrganizationRuc] = useState("");
	const [organizationName, setOrganizationName] = useState("");
	const [thematicAxis, setThematicAxis] = useState("");
	const [question, setQuestion] = useState("");
    const isSpeaker = role === "speaker";
    const isMale = gender === "male";
    const isOrganization = participationType === "organization";
    const {
		modalState,
		showSuccessModal,
		showErrorModal,
		showLoadingModal,
		closeModal,
	} = useRegistrationModal();

    const handleModalClose = () => {
		closeModal();
		// Si fue un error, no reseteamos el form para que pueda intentar de nuevo
		if (modalState.type === "success") {
			resetForms();
			setCurrentStep("registration");
		}
	};

    // =======================
    // Handlers
    // ======================
	const handleDniChange = (value: string) => {
		const numericValue = value.replace(/\D/g, "").slice(0, 8);
		setDni(numericValue);
	};
    const handleFullNameChange = (value: string) => setFullName(value);
	const handleGenderChange = (value: Gender) => setGender(value);
	const handleRoleChange = (value: Role) => setRole(value);
    const handleParticipationTypeChange = (value: ParticipationType) => {
		setParticipationType(value);
		if (value === "personal") {
			setOrganizationRuc("");
			setOrganizationName("");
		}
	};
	const handleOrganizationRucChange = (value: string) => setOrganizationRuc(value);
    const handleOrganizationNameChange = (value: string) => setOrganizationName(value);
	const handleThematicAxisChange = (value: string) => setThematicAxis(value);
	const handleQuestionChange = (value: string) => setQuestion(value);
    const goToQuestion = () => {
		if (!validateRegistrationForm()) return;
		setCurrentStep("question");
	};

	const goBackToRegistration = () => setCurrentStep("registration");
    
    // =======================
    // Validations
    // =======================
	const validateRegistrationForm = () => {
		if (!dni.trim() || !fullName.trim()) {
			toast.error("Por favor, completa todos los campos obligatorios.");
			return false;
		}
		if (dni.length !== 8) {
			toast.error("El DNI debe tener 8 dígitos.");
			return false;
		}
		return true;
	};
    const validateQuestionForm = () => {
		if (!thematicAxis || !question.trim()) {
			toast.error("Por favor, completa todos los campos obligatorios.");
			return false;
		}
		if (participationType === "organization") {
			if (!organizationName.trim()) {
				toast.error("Por favor, ingresa el nombre de la organización.");
				return false;
			}
			if (!organizationRuc.trim()) {
				toast.error("Por favor, ingresa el RUC de la organización.");
				return false;
			}
			if (organizationRuc.length !== 11) {
				toast.error("El RUC debe tener 11 dígitos.");
				return false;
			}
		}
		if (question.trim().length < 10) {
			toast.error("La pregunta debe tener al menos 10 caracteres.");
			return false;
		}
		return true;
	};
	const resetForms = () => {
		setDni("");
		setFullName("");
		setGender("male");
		setRole("attendee");
		setParticipationType("personal");
		setOrganizationRuc("");
		setOrganizationName("");
		setThematicAxis("");
		setQuestion("");
	};

    // =======================
    // Queries & Mutations
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

	const fetchRazonSocialByRuc = async (): Promise<string> => {
		const res = await api.get(`/ruc/${organizationRuc}`);
		return res.data.nombre_o_razon_social;
	};
	const rucQuery = useQuery({
		queryKey: ["razonSocialByRuc", organizationRuc],
		queryFn: () =>
			organizationRuc.length === 11
				? fetchRazonSocialByRuc()
				: Promise.resolve(""),
		enabled: organizationRuc.length === 11,
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
		if (rucQuery.isSuccess && rucQuery.data)
			setOrganizationName(rucQuery.data);
	}, [rucQuery.isSuccess, rucQuery.data]);
	

	const submitData = async () => {
		const data = {
			// Basic registration data
			nombre: fullName,
			sexo: isMale ? "M" : "F",
			tipo_participacion: isSpeaker ? "orador" : "asistente",
			id_rendicion: rendicionId,
			dni,
			// Question data (if applicable)
			titulo: isSpeaker ? isOrganization ? "ORGANIZACION" : "PERSONAL" : undefined,
			ruc_empresa:
				isSpeaker && participationType === "organization"
					? organizationRuc
					: undefined,
			nombre_empresa:
				isSpeaker && participationType === "organization"
					? organizationName
					: undefined,
			id_eje: isSpeaker ? thematicAxis : undefined,
			pregunta: isSpeaker ? question : undefined,
		};
		const res = await api.post("/usuarios", data);
		return res.data;
	};
	const registrationMutation = useMutation({
		mutationFn: submitData,
		onMutate: () =>
			showLoadingModal(
				isSpeaker
					? "Enviando tu pregunta para revisión..."
					: "Registrando tu participación como asistente..."
			),
		onSuccess: (response) => {
			console.log(
				isSpeaker
					? "Orador registrado con pregunta:"
					: "Asistente registrado:",
				response
			);
			showSuccessModal(!isSpeaker);
			setTimeout(() => {
				resetForms();
				setCurrentStep("registration");
			}, 1000);
		},
		onError: (error: ApiError) => {
			console.error("Error al registrar:", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"No se pudo completar el registro. Verifique su conexión e intente nuevamente.";
			showErrorModal(`Error: ${errorMessage}`);
		},
	});
    const submitAttendeeOnly = () => {
        if (!validateRegistrationForm()) return;
        registrationMutation.mutate();
    };
    const submitSpeakerWithQuestion = () => {
        if (!validateRegistrationForm()) return;
        if (!validateQuestionForm()) return;
        registrationMutation.mutate();
    };

	return {
		currentStep,
		registrationForm: {
			dni,
			fullName,
			gender,
			role,
			handleDniChange,
			handleFullNameChange,
			handleGenderChange,
			handleRoleChange,
			isLoadingName: nameQuery.isLoading,
		},
		questionForm: {
			participationType,
			organizationRuc,
			organizationName,
			thematicAxis,
			question,
			handleParticipationTypeChange,
			handleOrganizationRucChange,
			handleOrganizationNameChange,
			handleThematicAxisChange,
			handleQuestionChange,
			isLoadingRuc: rucQuery.isLoading,
		},
		isLoading: registrationMutation.isPending,
		modalState,
		goToQuestion,
		goBackToRegistration,
		submitAttendeeOnly,
		submitSpeakerWithQuestion,
		closeModal: handleModalClose,
	};
}
