import { api } from '@/core/config'
import { useQuery } from '@tanstack/react-query'
import type { NormalizedRendicionData, RendicionData } from '../types/rendicion'

export function useRendicion(rendicionId: string) {
    const fetchQuestionsForRendicion = async (): Promise<RendicionData> => {
        const res = await api.get(`/preguntas-seleccionadas/${rendicionId}`)
        return res.data.data
    }
    const questionsQuery = useQuery({
        queryKey: ['selectedQuestionsForRendicion', rendicionId],
        queryFn: fetchQuestionsForRendicion,
        enabled: !!rendicionId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (failureCount >= 2) return false
            if (error.message.includes('404') || error.message.includes("400")) return false
            return true
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
    const normalizedData: NormalizedRendicionData | undefined = questionsQuery.data ? {
        axes: Object.values(questionsQuery.data).sort((a, b) => a.tematica.localeCompare(b.tematica)),
        totalQuestions: Object.values(questionsQuery.data).reduce((total, axis) => total + axis.preguntas.length, 0)
    } : undefined;

    return {
        rendicionData: normalizedData,
        rawData: questionsQuery.data,
        isLoading: questionsQuery.isLoading,
        isError: questionsQuery.isError,
        error: questionsQuery.error,
        refetch: questionsQuery.refetch,
    }
}