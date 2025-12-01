import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { api } from "@/core/config";
import { useEffect } from "react";
import type { User } from "@/core/types/auth";

interface Props {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const refresh = async () => {
		const res = await api.get("/auth/refresh", {
			withCredentials: true,
		});
		return res.data;
	};
	const refreshQuery = useQuery({
		queryKey: ["auth", "me", "refresh"],
		queryFn: refresh,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 2_000, // 2 seconds
		retry: false,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	});
	useEffect(() => {
		if (refreshQuery.isSuccess && refreshQuery.data) {
			const data: {
				forceLogout?: boolean;
				user?: User;
				roleChanged?: boolean;
			} = refreshQuery.data;
			if (data.forceLogout) {
				useAuthStore.getState().clearAuth();
				return;
			}
			if (data.user) useAuthStore.getState().setUser(data.user);
			if (data.roleChanged) {
				useAuthStore.getState().setUser(data.user!);
			}
		}
		if (refreshQuery.isError) {
			useAuthStore.getState().clearAuth();
		}
	}, [refreshQuery.isSuccess, refreshQuery.data, refreshQuery.isError]);

	return <>{children}</>;
};
