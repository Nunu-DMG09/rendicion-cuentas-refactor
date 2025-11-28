export type Pregunta = {
    id: string
    texto: string
    participante: {
        id: string
        nombre: string
        dni: string
    }
    ejeId: string
    ejeNombre: string
    fechaCreacion: string
    respondida: boolean
}

export type PreguntasPorEje = {
    ejeId: string
    ejeNombre: string
    preguntas: Pregunta[]
}

export type RendicionOptionPreguntas = {
    id: string
    label: string
    fecha: string
}

export type PreguntasModalType = 'confirm' | 'success' | 'error' | 'presentar'

export type PreguntasModalState = {
    isOpen: boolean
    type: PreguntasModalType
    title: string
    message: string
    preguntaId?: string
}

export type PresentacionState = {
    isOpen: boolean
    preguntasPorEje: PreguntasPorEje[]
    rendicionLabel: string
}