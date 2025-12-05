export type ReporteModalState = {
    isOpen: boolean
    pregunta: string | null
    participante: string | null
}

export interface ReporteDataResponse {
    data: Data;
}

export interface Data {
    rendicion:     Rendicion;
    stats:         Stats;
    participantes: Participante[];
    pagination:    Pagination;
}

export interface Pagination {
    total:        number;
    per_page:     number;
    current_page: number;
    total_pages:  number;
    has_next:     boolean;
    has_prev:     boolean;
    first_page:   number;
    last_page:    number;
}

export interface Participante {
    dni:          string;
    nombre:       string;
    sexo:         string;
    tipo:         string;
    ruc:          null | string;
    organizacion: null | string;
    asistencia:   string;
    eje:          string;
    pregunta:     string;
}

export interface Rendicion {
    id:         string;
    titulo:     string;
    fecha:      string;
    hora:       string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
}

export interface Stats {
    total_inscritos:     number;
    total_asistentes:    number;
    total_no_asistieron: number;
    total_oradores:      number;
    total_con_pregunta:  number;
    total_sin_preguntas: number;
}
