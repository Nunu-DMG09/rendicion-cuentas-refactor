import { api } from "@/core/config"
import type { EjeTematico } from "@/features/ejes-tematicos/types/ejesTematicos"
import { useQuery } from "@tanstack/react-query"

export const useEjesDisponibles = () => {
    const getAllEjes = async () => {
        const res = await api.get('ejes')
        return res.data.data as EjeTematico[] || []
    }
    return useQuery({
        queryKey: ['ejes'],
        queryFn: getAllEjes,
        select: (data: EjeTematico[]) => {
            return data.filter(eje => eje.estado === '1')
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: (failureCount, error) => {
            if (failureCount >= 2) return false
            if (error.message.includes('404') || error.message.includes("400")) return false
            return true
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}