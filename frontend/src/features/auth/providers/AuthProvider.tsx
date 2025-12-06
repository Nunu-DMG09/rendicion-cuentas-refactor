import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { api } from "@/core/config";
import { useEffect, createContext, useContext, useState } from "react";
import type { User } from "@/core/types/auth";

interface Props {
    children: React.ReactNode;
}
interface AuthContextType {
    isInitializing: boolean;
    isRefreshing: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: Props) => {
    const [isInitialized, setIsInitialized] = useState(false);
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
        refetchInterval: 5 * 60 * 1000,
        retry: false,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!refreshQuery.isSuccess && !refreshQuery.isError) return;
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
            if (data.roleChanged) useAuthStore.getState().setUser(data.user!);
        }
        if (refreshQuery.isError) useAuthStore.getState().clearAuth();
        setIsInitialized(true);
    }, [refreshQuery.isSuccess, refreshQuery.data, refreshQuery.isError]);

    const authContextValue: AuthContextType = {
        isInitializing: !isInitialized,
        isRefreshing: refreshQuery.isFetching && !refreshQuery.isLoading,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
