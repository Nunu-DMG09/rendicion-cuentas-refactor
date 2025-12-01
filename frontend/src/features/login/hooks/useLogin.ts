import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";

export const useLogin = () => {
	const [dni, setDni] = useState("");
	const [password, setPassword] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const { useLoginMutation } = useAuth();
    const loginMutation = useLoginMutation();
	const isFormValid =
		dni.trim() !== "" &&
		password.trim() !== "" &&
		dni.length === 8 &&
		password.length >= 8;
	const togglePasswordVisibility = () => setIsVisible(!isVisible);
	const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const cleanedValue = e.target.value.replace(/\D/g, "");
		setDni(cleanedValue);
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) return;
		loginMutation.mutate({
			dni: dni.trim(),
			password: password.trim(),
		});
	};
    return {
        dni,
        password,
        isVisible,
        isFormValid,
        isLoading: loginMutation.isPending,
        togglePasswordVisibility,
        handleDniChange,
        handlePasswordChange,
        handleSubmit,
    }
};
