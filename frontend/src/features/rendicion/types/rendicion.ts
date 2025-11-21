export type RendicionAxis = {
  id: string
  name: string
  description: string
  questionsCount: number
  questions: Question[]
}

export type Question = {
  id: string
  personName: string
  question: string
  createdAt: string
}

export type RendicionData = {
  id: string
  title: string
  date: string
  time: string
  location: string
  axes: RendicionAxis[]
}

export type RendicionDetailProps = {
  rendicionId: string
}

export type QuestionsModalProps = {
  isOpen: boolean
  onClose: () => void
  axis: RendicionAxis | null
}