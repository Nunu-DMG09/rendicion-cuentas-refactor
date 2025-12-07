import { api } from "@/core/config"
import type { HistorialData } from "../types/historial"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react";

export const useHistorial = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page: number) => setCurrentPage(page);
    const fetchHistorial = async (): Promise<HistorialData> => {
        const res = await api.get(`/admin/historial?page=${currentPage}`, {
            withCredentials: true
        })
        return res.data.data
    }
    const historialQuery = useQuery({
        queryKey: ['historial', currentPage],
        queryFn: fetchHistorial,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (failureCount >= 2) return false
            if (error.message.includes('404') || error.message.includes("400")) return false
            return true
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
    return {
        data: historialQuery.data,
        isLoading: historialQuery.isLoading,
        isError: historialQuery.isError,
        refetch: historialQuery.refetch,
        error: historialQuery.error,
        currentPage,
        handlePageChange
    }
}