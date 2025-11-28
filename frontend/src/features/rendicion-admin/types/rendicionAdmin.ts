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