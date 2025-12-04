import { isSuperAdmin } from "@/core/utils";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Loader } from "dialca-ui";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner"

interface Props {
    children: React.ReactNode;
    isRestricted?: boolean;
}
export const ProtectedRoute: React.FC<Props> = ({ children, isRestricted = false }) => {
    const { isAuthenticated, user } = useAuthStore();
    const { isInitializing, isRefreshing } = useAuthContext();

    useEffect(() => {
        if (!isRefreshing && isAuthenticated && user && user.estado === '0') {
            toast.error('Su cuenta ha sido deshabilitada. Por favor, contacte al administrador.');
        }
    }, [isRefreshing, isAuthenticated, user]);
    if (isInitializing || isRefreshing) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="xl" />
            </div>
        )
    }
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />
    if (isAuthenticated && user && user.estado === '0') return <Navigate to="/auth/login" replace />
    if (isAuthenticated && user && isRestricted) {
        const role = user.rol;
        if (!isSuperAdmin(role)) return <Navigate to="/unauthorized" replace />
    }
    return <>{children}</>;
}