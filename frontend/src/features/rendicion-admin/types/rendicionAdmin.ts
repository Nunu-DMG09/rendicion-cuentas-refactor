export type RendicionFormData = {
    fecha: string
    hora: string
    banners: BannerFile[]
    ejesTematicos: string[]
}

export type BannerFile = {
    id: string
    file: File
    preview: string
    name: string
}

export type EjeTematico = {
    id: string
    name: string
    description?: string
    icon: string
}

export type RendicionFormProps = {
    onSubmit: (data: RendicionFormData) => void
    isLoading: boolean
}

export type RendicionModalType = 'success' | 'error' | 'loading'

export type RendicionModalState = {
    isOpen: boolean
    type: RendicionModalType
    title: string
    message: string
}

export type BannerSelectorProps = {
    selectedBanners: BannerFile[]
    onAdd: (files: FileList) => void
    onRemove: (bannerId: string) => void
}
export interface CreatedRendicion {
    status: 'success' | 'error';
    message: string;
    data: {
        id: number;
        rendicion: {
            id: string;
            fecha: string;
            hora: string;
            admin_id: string;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
        };
        banners: {
            id: string;
            file_path: string;
            url: string;
            original_name: string;
            file_size: number;
        }[];
        ejes_asocidados: {
            id: string;
            id_eje: string;
            cantidad_preguntas: number;
        }[];
        total_banners: number;
        total_ejes: number;
    }
}

// Tipos para Ver Rendiciones
export type RendicionStatus = 'programada' | 'en_curso' | 'finalizada'

export type RendicionItem = {
    id: string
    fecha: string
    hora: string
    banners: BannerPreview[]
    ejesTematicos: {
        id: string
        nombre: string
        cantidad_pregunta: number
    }[]
    status: RendicionStatus
    asistentesRegistrados: number
    preguntasRecibidas: number
    year: number
    detalles: RendicionDetalles
}

export type RendicionDetalles = {
    totalInscritos: number
    asistentes: number
    noAsistentes: number
    totalPreguntas: number
    preguntasRespondidas: number
    preguntasPendientes: number
    lugar: string
}

export type BannerPreview = {
    id: string
    url: string
    name: string
}

export type RendicionEditData = {
    id: string
    fecha: string
    hora: string
    banners: BannerFile[]
}

export type EditModalState = {
    isOpen: boolean
    rendicion: RendicionItem | null
}

export type ViewModalState = {
    isOpen: boolean
    rendicion: RendicionItem | null
}