import { api } from "@/core/config";
import type { User } from "@/core/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../store/auth.store";
import { useEffect } from "react";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const login = async (credentials: { dni: string; password: string }) => {
        const res = await api.post('/auth/login', credentials);
        if (!res.data.success || !res.data.user) {
            throw new Error(res.data.message || res.data.error || 'Error al iniciar sesión.');
        }
        return res.data.user as User;
    }
    const useLoginMutation = () => useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        }
    })
    const logout = async () => {
        await api.post('/auth/logout', {}, {
            withCredentials: true,
        });
    }
    const useLogoutMutation = () => useMutation({
        mutationFn: logout,
        onSuccess: () => {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
        }
    })
    const refresh = async () => {
        const res = await api.get('/auth/refresh', {
            withCredentials: true,
        });
        return res.data;
    }
    const refreshQuery = useQuery({
        queryKey: ['auth', 'me', 'refresh'],
        queryFn: refresh,
        staleTime: Infinity,
        refetchInterval: 5 * 60 * 1000, // 5 minutes
        retry: 1
    })
    useEffect(() => {
        if (refreshQuery.isSuccess && refreshQuery.data) {
            const data: { forceLogout?: boolean; user?: User; roleChanged?: boolean } = refreshQuery.data;
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
    }, [refreshQuery.isSuccess, refreshQuery.data, refreshQuery.isError])
    
    return {
        useLoginMutation,
        useLogoutMutation,
        refreshQuery,
    }
}