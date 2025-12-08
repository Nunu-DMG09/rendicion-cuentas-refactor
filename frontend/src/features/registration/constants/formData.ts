import { 
  FaUser, 
  FaBuilding, 
  FaUsers, 
  FaVenusMars,
  FaMicrophone 
} from 'react-icons/fa'

export const PARTICIPATION_TYPES = [
  { value: 'personal', label: 'Personal', icon: FaUser },
  { value: 'organization', label: 'Organización', icon: FaBuilding }
]

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino', icon: FaVenusMars },
  { value: 'female', label: 'Femenino', icon: FaVenusMars }
]

export const ROLE_OPTIONS = [
  { 
    value: 'attendee', 
    label: 'Asistente', 
    icon: FaUsers, 
    description: 'Participar como oyente' 
  },
  { 
    value: 'speaker', 
    label: 'Orador', 
    icon: FaMicrophone, 
    description: 'Hacer preguntas públicas' 
  }
]