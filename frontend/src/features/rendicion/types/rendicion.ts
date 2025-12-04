export type RendicionAxis = {
  id: number
  eje_id: number
  tematica: string
  preguntas: Question[]
}
export interface RendicionAxisWithSelector extends RendicionAxis {
  preguntas: (Question & { is_selected: boolean })[]
}

export type Question = {
  id: number
  contenido: string
  usuario: string
  usuario_id: number
  created_at: string
  id_eje: number
}

export type RendicionData = Record<string, RendicionAxis>
export type RendicionDataWithSelector = Record<string, RendicionAxisWithSelector>

export type RendicionDetailProps = {
  rendicionId: string
  title?: string
  date?: string
  time?: string
}

// Para uso interno del componente
export type NormalizedRendicionData = {
  axes: RendicionAxis[]
  totalQuestions: number
}
export type NormalizedRendicionDataWithSelector = {
  axes: RendicionAxisWithSelector[]
  totalQuestions: number
}