import { api } from "@/core/config";
import type { ApiError, User } from "@/core/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const login = async (credentials: { dni: string; password: string }) => {
        const res = await api.post('/auth/login', credentials, {
            withCredentials: true,
        });
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
        },
        onError: (error: ApiError) => {
            console.error('Login error:', error);            
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.error) errorMessage = error.response.data.error;
            else if (error.response?.data?.message) errorMessage = error.response.data.message;
            else if (error.message) errorMessage = error.message;
            
            toast.error(errorMessage);
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
        },
        onError: () => {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            toast.info('Sesión cerrada localmente.');
        }
    })
    
    return {
        useLoginMutation,
        useLogoutMutation,
    }
}