import type { Pagination } from "@/core/types";

export interface HistorialItem {
    id: string;
    id_admin: string;
    accion: "habilitar" | "deshabilitar" | "crear" | "editar_password" | "edit_categoria" | '';
    motivo: string;
    realizado_por: string;
    created_at: string;
    updated_at: string;
    admin_nombre: string;
    admin_dni: string;
    realizado_nombre: string;
    realizado_dni: string;
}
export interface HistorialData {
    items: HistorialItem[];
    pagination: Pagination
}