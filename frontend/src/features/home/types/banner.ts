export interface BannerApi {
    id: string;
    ruta: string;
    titulo: string;
    descripcion: string;
    exists: boolean;
    raw: {
        id: string;
        id_rendicion: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        file_path: string;
    }
}
export interface BannersResponse {
    success: boolean;
    message: string;
    data: {
        rendicion: {
            id: string;
            fecha: string;
            hora: string;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
        }
        banners: BannerApi[];
    }
}