export type ModalType = 'success' | 'error' | 'loading'

export type RegistrationModalProps = {
  isOpen: boolean
  onClose: () => void
  type: ModalType
  title: string
  message: string
  isAttendee?: boolean
}

export type ModalState = {
  isOpen: boolean
  type: ModalType
  title: string
  message: string
  isAttendee?: boolean
}