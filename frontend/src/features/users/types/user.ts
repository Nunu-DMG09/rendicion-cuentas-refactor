export interface User {
    id: string;
    dni: string;
    nombre: string;
    categoria: 'super_admin' | 'admin';
    estado: '1' | '0';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}