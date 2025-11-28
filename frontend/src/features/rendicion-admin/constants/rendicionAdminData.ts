import type { BannerOption, EjeTematico } from '../types/rendicionAdmin'



export const EJES_TEMATICOS: EjeTematico[] = [
  {
    id: '1',
    name: 'Seguridad Ciudadana',
    description: 'Temas relacionados con la seguridad y orden público',
    icon: 'FaShieldAlt'
  },
  {
    id: '2',
    name: 'Infraestructura',
    description: 'Obras públicas, vías y construcciones',
    icon: 'FaTools'
  },
  {
    id: '3',
    name: 'Limpieza Pública',
    description: 'Gestión de residuos y mantenimiento urbano',
    icon: 'FaRecycle'
  },
  {
    id: '4',
    name: 'Institucionalidad',
    description: 'Gestión administrativa y transparencia',
    icon: 'FaLandmark'
  },
  {
    id: '5',
    name: 'Desarrollo Social',
    description: 'Programas sociales y bienestar ciudadano',
    icon: 'FaUsers'
  },
  {
    id: '6',
    name: 'Medio Ambiente',
    description: 'Conservación ambiental y áreas verdes',
    icon: 'FaLeaf'
  },
  {
    id: '7',
    name: 'Educación y Cultura',
    description: 'Programas educativos y actividades culturales',
    icon: 'FaGraduationCap'
  },
  {
    id: '8',
    name: 'Salud Pública',
    description: 'Servicios de salud y campañas sanitarias',
    icon: 'FaHeartbeat'
  }
]

// Generar todas las horas del día (00:00 - 23:30, cada 30 minutos - ARRERGLA ESSTO DIEGAZO PORFAVOR)
export const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hours.toString().padStart(2, '0')}:${minutes}`
})

// Formatos de imagen aceptados
export const ACCEPTED_IMAGE_FORMATS = '.jpg,.jpeg,.png,.webp,.gif'
export const MAX_FILE_SIZE_MB = 5
export const MAX_FILES = 10