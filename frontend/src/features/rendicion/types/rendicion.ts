export type RendicionAxis = {
  id: string
  name: string
  description: string
  questionsCount: number
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