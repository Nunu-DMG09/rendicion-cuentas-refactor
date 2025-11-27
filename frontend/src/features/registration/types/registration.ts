export type ParticipationType = 'personal' | 'organization'
export type Gender = 'male' | 'female'
export type Role = 'attendee' | 'speaker'

export type RegistrationStep = 'registration' | 'question'

export type RegistrationFormData = {
  dni: string
  fullName: string
  gender: Gender
  role: Role
}

export type QuestionFormData = {
  participationType: ParticipationType
  thematicAxis: string
  question: string
}

export type RegistrationData = {
  rendicionId: string
  registrationData: RegistrationFormData
  questionData?: QuestionFormData
}

export type RegistrationFormProps = {
  rendicionId: string
}

export type RegistrationFormComponentProps = {
  onSubmitAttendee: (data: RegistrationFormData) => void
  onSubmitSpeaker: (data: RegistrationFormData) => void
  isLoading: boolean
  rendicionTitle: string
  rendicionDate: string
}

export type QuestionFormComponentProps = {
  onSubmit: (data: QuestionFormData) => void
  onBack: () => void
  isLoading: boolean
  rendicionTitle: string
  rendicionDate: string
}

// Re-export modal types
export type { ModalType, RegistrationModalProps, ModalState } from './modal'