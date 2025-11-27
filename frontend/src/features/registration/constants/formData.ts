import { 
  FaUser, 
  FaBuilding, 
  FaShieldAlt, 
  FaTools, 
  FaRecycle, 
  FaLandmark, 
  FaUsers, 
  FaLeaf,
  FaVenusMars,
  FaMicrophone 
} from 'react-icons/fa'

export const THEMATIC_AXES = [
  { value: 'Seguridad Ciudadana', icon: FaShieldAlt },
  { value: 'Infraestructura', icon: FaTools },
  { value: 'Limpieza Pública', icon: FaRecycle },
  { value: 'Institucionalidad', icon: FaLandmark },
  { value: 'Desarrollo Social', icon: FaUsers },
  { value: 'Medio Ambiente', icon: FaLeaf }
]

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