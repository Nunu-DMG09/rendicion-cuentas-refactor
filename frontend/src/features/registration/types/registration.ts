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
  organizationRuc?: string
  organizationName?: string
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
  onSubmitAttendee: () => void
  onSubmitSpeaker: () => void
  isLoading: boolean
  rendicionTitle: string
  rendicionDate: string
  registrationForm: {
    dni: string
    fullName: string
    gender: Gender
    role: Role
    handleDniChange: (value: string) => void
    handleFullNameChange: (value: string) => void
    handleGenderChange: (value: Gender) => void
    handleRoleChange: (value: Role) => void
  }
}

export type QuestionFormComponentProps = {
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
  rendicionTitle: string
  rendicionDate: string
  axis: { value: string; label: string }[]
  questionForm: {
    participationType: ParticipationType
    thematicAxis: string
    question: string
    organizationRuc: string
    organizationName: string
    handleParticipationTypeChange: (value: ParticipationType) => void
    handleThematicAxisChange: (value: string) => void
    handleQuestionChange: (value: string) => void
    handleOrganizationRucChange: (value: string) => void
    handleOrganizationNameChange: (value: string) => void
  }
}

// Re-export modal types
export type { ModalType, RegistrationModalProps, ModalState } from './modal'