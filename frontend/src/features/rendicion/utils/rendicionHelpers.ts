import { useRegistrationData } from "@/core/hooks";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export const useRendicionInfo = (rendicionId: string) => {
    const { recentRendicionesQuery } = useHomeData();
    const { rendicionData: activeRendicion } = useRegistrationData();

    const foundRendicion = recentRendicionesQuery.data?.find(
        (r: {
            id: number;
            titulo: string;
            fecha: string;
            hora: string;
            description?: string;
        }) => r.id.toString() === rendicionId || r.id === parseInt(rendicionId)
    )
    const isActiveRendicion = activeRendicion?.id.toString() === rendicionId;

    if (foundRendicion) {
        return {
            title: foundRendicion.titulo || `Rendición ${rendicionId}`,
            date: foundRendicion.fecha || '',
            time: foundRendicion.hora || '',
            description: foundRendicion.description || '',
        }
    }
    if (isActiveRendicion && activeRendicion) {
        return {
            title: activeRendicion.titulo || `Rendición ${rendicionId}`,
            date: activeRendicion.fecha || '',
            time: activeRendicion.hora || '',
            description: '',
        }
    }
    return {
        title: `Rendición ${rendicionId}`,
        date: '',
        time: '',
        description: '',
    }
}