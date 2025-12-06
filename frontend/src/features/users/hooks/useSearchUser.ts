import { api } from "@/core/config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { User } from "../types/user";

export const useSearchUser = () => {
    const [dni, setDni] = useState('');
    const handleDniChange = (value: string) => {
        const formated = value.replace(/\D/g, '');
        setDni(formated);
    };
    const searchUser = async ():Promise<User> => {
        const res = await api.get(`/admin/dni/${dni}`, {
            withCredentials: true,
        });
        return res.data.data;
    }
    const searchUserQuery = useQuery({
        queryKey: ['search-user', dni],
        queryFn: searchUser,
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
    })
    const handleSearch = () => {
        if (dni.length === 8) searchUserQuery.refetch();
    }
    const clearSearch = () => setDni('');
    return {
        dni,
        handleDniChange,
        handleSearch,
        clearSearch,
        isSearching: searchUserQuery.isLoading,
        isSearchError: searchUserQuery.isError,
        searchError: searchUserQuery.error,
        searchedUser: searchUserQuery.data,
        refetchSearchUser: searchUserQuery.refetch,
    }
}