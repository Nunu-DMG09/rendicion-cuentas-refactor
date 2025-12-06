import { api } from "@/core/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, UserModalState } from "../types/user";
import { useState, useMemo } from "react";
import type { ApiError } from "@/core/types/api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const useListUsers = () => {
	const queryClient = useQueryClient();
	const { user } = useAuthStore();
	const adminId = user?.id;

	const [currentTab, setCurrentTab] = useState<"list" | "search">("list");
	const [roleFilter, setRoleFilter] = useState<
		"all" | "admin" | "super_admin"
	>("all");
	const [statusFilter, setStatusFilter] = useState<"all" | "1" | "0">("all");
	const [modal, setModal] = useState<UserModalState>({
		isOpen: false,
		type: "success",
		title: "",
		message: "",
	});

	const handleTabChange = (tab: "list" | "search") => setCurrentTab(tab);
	const handleRoleFilterChange = (filter: "all" | "admin" | "super_admin") =>
		setRoleFilter(filter);
	const handleStatusFilterChange = (filter: "all" | "1" | "0") =>
		setStatusFilter(filter);

	const fetchUsers = async (): Promise<User[]> => {
		const res = await api.get("/admin", {
			withCredentials: true,
		});
		return res.data.data;
	};

	const usersQuery = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
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

	const changePassword = async (data: {
		userId: string;
		newPassword: string;
        motivo?: string;
	}): Promise<User> => {
		const res = await api.put(
			`/admin/${data.userId}`,
			{
				action: "change_password",
				password: data.newPassword,
                motivo: data.motivo,
				realizado_por: adminId,
			},
			{ withCredentials: true }
		);
		return res.data.data;
	};

	const changePasswordMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: (updatedUser) => {
			queryClient.setQueryData<User[]>(["users"], (old = []) =>
				old.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				)
			);
			setModal({
				isOpen: true,
				type: "success",
				title: "¡Contraseña actualizada!",
				message: `La contraseña de ${
					updatedUser.nombre || updatedUser.dni
				} ha sido actualizada exitosamente.`,
			});
		},
		onError: (error: ApiError) => {
			setModal({
				isOpen: true,
				type: "error",
				title: "Error al cambiar contraseña",
				message:
					error.response?.data?.message ||
					"No se pudo actualizar la contraseña.",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const updateRole = async (data: {
		userId: string;
		newRole: "admin" | "super_admin";
        motivo?: string;
	}): Promise<User> => {
		const res = await api.put(
			`/admin/${data.userId}`,
			{
				action: "edit_role",
				categoria: data.newRole,
                motivo: data.motivo,
				realizado_por: adminId,
			},
			{ withCredentials: true }
		);
		return res.data.data;
	};
	const updateRoleMutation = useMutation({
		mutationFn: updateRole,
		onSuccess: (updatedUser) => {
			queryClient.setQueryData<User[]>(["users"], (old = []) =>
				old.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				)
			);
			const roleLabel =
				updatedUser.categoria === "super_admin"
					? "Super Admin"
					: "Administrador";
			setModal({
				isOpen: true,
				type: "success",
				title: "¡Rol actualizado!",
				message: `${
					updatedUser.nombre || updatedUser.dni
				} ahora es ${roleLabel}.`,
			});
		},
		onError: (error: ApiError) => {
			setModal({
				isOpen: true,
				type: "error",
				title: "Error al actualizar rol",
				message:
					error.response?.data?.message ||
					"No se pudo actualizar el rol.",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const toggleStatus = async (data:{
		userId: string,
		action: "habilitar" | "deshabilitar"
        motivo?: string;
    }
	): Promise<User> => {
		const res = await api.post(
			`/admin/${data.userId}/cambiar-estado`,
			{
				action: data.action,
                motivo: data.motivo,
				realizado_por: adminId,
			},
			{ withCredentials: true }
		);
		return res.data.data;
	};
	const toggleStatusMutation = useMutation({
		mutationFn: toggleStatus,
		onMutate: async (data: {userId: string, action: "habilitar" | "deshabilitar", motivo?: string}) => {
			await queryClient.cancelQueries({ queryKey: ["users"] });
			const previousUsers = queryClient.getQueryData<User[]>(["users"]);
			queryClient.setQueryData<User[]>(["users"], (old = []) =>
				old.map((user) =>
					user.id === data.userId
						? { ...user, estado: user.estado === "1" ? "0" : "1" }
						: user
				)
			);
			return { previousUsers };
		},
		onSuccess: (updatedUser) => {
			const action =
				updatedUser.estado === "1" ? "habilitado" : "deshabilitado";
			setModal({
				isOpen: true,
				type: "success",
				title: "¡Estado actualizado!",
				message: `El usuario ${
					updatedUser.nombre || updatedUser.dni
				} ha sido ${action}.`,
			});
		},
		onError: (error: ApiError, _, context) => {
			if (context?.previousUsers) {
				queryClient.setQueryData<User[]>(
					["users"],
					context.previousUsers
				);
			}
			setModal({
				isOpen: true,
				type: "error",
				title: "Error al cambiar estado",
				message:
					error.response?.data?.message ||
					"No se pudo actualizar el estado.",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const filteredUsers = useMemo(() => {
		if (!usersQuery.data) return [];

		return usersQuery.data.filter((user) => {
			const matchesRole =
				roleFilter === "all" || user.categoria === roleFilter;
			const matchesStatus =
				statusFilter === "all" || user.estado === statusFilter;
			return matchesRole && matchesStatus;
		});
	}, [usersQuery.data, roleFilter, statusFilter]);

	const showChangePasswordModal = (user: User) => {
		setModal({
			isOpen: true,
			type: "change_password",
			title: "Cambiar contraseña",
			message: `Ingrese la nueva contraseña para ${
				user.nombre || user.dni
			}`,
			user,
		});
	};
	const showEditRoleModal = (user: User) => {
		setModal({
			isOpen: true,
			type: "edit_role",
			title: "Cambiar rol",
			message: `Seleccione el nuevo rol para ${user.nombre || user.dni}`,
			user,
		});
	};
	const showToggleStatusConfirm = (user: User) => {
		const action = user.estado === "1" ? "deshabilitar" : "habilitar";
		setModal({
			isOpen: true,
			type: "confirm",
			title: `¿${
				action.charAt(0).toUpperCase() + action.slice(1)
			} usuario?`,
			message: `¿Está seguro que desea ${action} a ${
				user.nombre || user.dni
			}?`,
			user,
		});
	};
	const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));
	const confirmModalAction = (data?: {
		newPassword?: string;
		newRole?: "admin" | "super_admin";
        motivo?: string;
	}) => {
		if (!modal.user) {
			closeModal();
			return;
		}

		switch (modal.type) {
			case "change_password":
				if (data?.newPassword) {
					changePasswordMutation.mutate({
						userId: modal.user.id,
						newPassword: data.newPassword,
                        motivo: data.motivo
					});
					closeModal();
				}
				break;

			case "edit_role":
				if (data?.newRole) {
					updateRoleMutation.mutate({
						userId: modal.user.id,
						newRole: data.newRole,
                        motivo: data.motivo
					});
					closeModal();
				}
				break;

			case "confirm":
				if (data?.motivo) {
                    const action = modal.user.estado === "1" ? "deshabilitar" : "habilitar";
                    toggleStatusMutation.mutate({
                        userId: modal.user.id,
                        action,
                        motivo: data.motivo
                    });
                    closeModal();
                }
				break;

			default:
				closeModal();
				break;
		}
	};

	return {
		users: usersQuery.data,
		filteredUsers,
		isLoading: usersQuery.isLoading,
		isError: usersQuery.isError,
		refetch: usersQuery.refetch,
		error: usersQuery.error,
		// Tabs
		currentTab,
		handleTabChange,
		// Filtros
		roleFilter,
		handleRoleFilterChange,
		statusFilter,
		handleStatusFilterChange,
		// Modals
		modal,
		showChangePasswordModal,
		showEditRoleModal,
		showToggleStatusConfirm,
		closeModal,
		confirmModalAction,
        // Mutations
        isChangingPassword: changePasswordMutation.isPending,
        isUpdatingRole: updateRoleMutation.isPending,
        isTogglingStatus: toggleStatusMutation.isPending,
	};
};
