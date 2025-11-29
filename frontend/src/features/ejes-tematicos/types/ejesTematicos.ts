export type EjeTematico = {
    id: string
    tematica: string
    estado: '1' | '0'
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export type CreateEjeFormData = {
    tematica: string
}

export type EjesTableProps = {
    ejes: EjeTematico[]
    onToggleEstado: (id: string) => void
    isLoading: boolean
}

export type CreateEjeFormProps = {
    onSubmit: (data: CreateEjeFormData) => Promise<boolean>
    isLoading: boolean
}

export type EjesModalType = 'success' | 'error' | 'confirm'

export type EjesModalState = {
    isOpen: boolean
    type: EjesModalType
    title: string
    message: string
    ejeId?: string
}

export type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}