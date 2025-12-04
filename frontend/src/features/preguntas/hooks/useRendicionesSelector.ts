import { api } from "@/core/config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useRendicionesSelector = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchQueryChange = (newSearchQuery: string) => setSearchQuery(newSearchQuery);
    const fetchRendiciones = async () => {
        const res = await api.get(`/admin/rendiciones?query=${searchQuery}`, {
            withCredentials: true,
        });
        return res.data.data as Array<{id: number, titulo: string}>;
    }
    const rendicionesQuery = useQuery({
        queryKey: ['rendicionesPerYear', searchQuery],
        queryFn: fetchRendiciones,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (failureCount >= 2) return false
            if (error.message.includes('404') || error.message.includes("400")) return false
            return true
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
    const rendicionesOptions = rendicionesQuery.data || [];
    const hasRendiciones = rendicionesOptions.length > 0;
    return {
        rendicionesQuery,
        rendicionesOptions,
        hasRendiciones,
        isLoading: rendicionesQuery.isLoading,
        isError: rendicionesQuery.isError,
        error: rendicionesQuery.error,
        refetch: rendicionesQuery.refetch,
        searchQuery,
        handleSearchQueryChange,
    }
}