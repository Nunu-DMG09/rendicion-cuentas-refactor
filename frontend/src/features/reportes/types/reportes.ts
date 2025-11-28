export type TipoParticipacion = 'asistente' | 'orador'

export type Participante = {
    id: string
    dni: string
    nombre: string
    sexo: 'M' | 'F'
    tipoParticipacion: TipoParticipacion
    titulo: string | null
    ruc: string | null
    nombreOrganizacion: string | null
    asistencia: boolean
    eje: string | null
    pregunta: string | null
}

export type RendicionOption = {
    id: string
    label: string
    fecha: string
}

export type ReporteStats = {
    totalInscritos: number
    asistentes: number
    noAsistentes: number
    oradores: number
    asistentesComunes: number
    conPreguntas: number
    sinPreguntas: number
}

export type ReporteData = {
    rendicionId: string
    rendicionLabel: string
    fecha: string
    stats: ReporteStats
    participantes: Participante[]
}

export type ReporteModalState = {
    isOpen: boolean
    pregunta: string | null
    participante: string | null
}

export type PaginationState = {
    currentPage: number
    itemsPerPage: number
    totalItems: number
}