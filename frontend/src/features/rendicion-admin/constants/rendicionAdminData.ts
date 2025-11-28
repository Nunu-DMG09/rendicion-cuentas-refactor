import type { EjeTematico, RendicionItem } from '../types/rendicionAdmin'

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

// Formatos de imagen aceptados
export const ACCEPTED_IMAGE_FORMATS = '.jpg,.jpeg,.png,.webp,.gif'
export const MAX_FILE_SIZE_MB = 5
export const MAX_FILES = 10

// Mock de rendiciones por año
export const MOCK_RENDICIONES: RendicionItem[] = [
    // 2025
    {
        id: '1',
        fecha: '2025-12-15',
        hora: '10:00',
        banners: [
            { id: 'b1', url: 'https://placehold.co/1200x400/002f59/white?text=Rendicion+Diciembre+2025', name: 'Banner Diciembre' }
        ],
        ejesTematicos: ['1', '2', '3', '4'],
        status: 'programada',
        asistentesRegistrados: 145,
        preguntasRecibidas: 67,
        year: 2025,
        detalles: {
            totalInscritos: 145,
            asistentes: 0,
            noAsistentes: 0,
            totalPreguntas: 67,
            preguntasRespondidas: 0,
            preguntasPendientes: 67,
            lugar: 'Auditorio Municipal',
        }
    },
    {
        id: '2',
        fecha: '2025-06-20',
        hora: '15:30',
        banners: [
            { id: 'b2', url: 'https://placehold.co/1200x400/003366/white?text=Rendicion+Junio+2025', name: 'Banner Junio' }
        ],
        ejesTematicos: ['1', '3', '5', '6'],
        status: 'finalizada',
        asistentesRegistrados: 234,
        preguntasRecibidas: 89,
        year: 2025,
        detalles: {
            totalInscritos: 234,
            asistentes: 198,
            noAsistentes: 36,
            totalPreguntas: 89,
            preguntasRespondidas: 75,
            preguntasPendientes: 14,
            lugar: 'Centro de Convenciones',
        }
    },
    // 2024
    {
        id: '3',
        fecha: '2024-12-10',
        hora: '09:00',
        banners: [
            { id: 'b3', url: 'https://placehold.co/1200x400/004080/white?text=Rendicion+Diciembre+2024', name: 'Banner Dic 2024' }
        ],
        ejesTematicos: ['1', '2', '4', '7'],
        status: 'finalizada',
        asistentesRegistrados: 312,
        preguntasRecibidas: 156,
        year: 2024,
        detalles: {
            totalInscritos: 312,
            asistentes: 287,
            noAsistentes: 25,
            totalPreguntas: 156,
            preguntasRespondidas: 142,
            preguntasPendientes: 14,
            lugar: 'Auditorio Municipal',
        }
    },
    {
        id: '4',
        fecha: '2024-06-15',
        hora: '11:00',
        banners: [
            { id: 'b4', url: 'https://placehold.co/1200x400/1e40af/white?text=Rendicion+Junio+2024', name: 'Banner Jun 2024' }
        ],
        ejesTematicos: ['2', '3', '5', '8'],
        status: 'finalizada',
        asistentesRegistrados: 289,
        preguntasRecibidas: 134,
        year: 2024,
        detalles: {
            totalInscritos: 289,
            asistentes: 256,
            noAsistentes: 33,
            totalPreguntas: 134,
            preguntasRespondidas: 120,
            preguntasPendientes: 14,
            lugar: 'Plaza Municipal',
        }
    },
    // 2023
    {
        id: '5',
        fecha: '2023-12-12',
        hora: '10:30',
        banners: [
            { id: 'b5', url: 'https://placehold.co/1200x400/1e3a5f/white?text=Rendicion+Diciembre+2023', name: 'Banner Dic 2023' }
        ],
        ejesTematicos: ['1', '4', '6', '7'],
        status: 'finalizada',
        asistentesRegistrados: 198,
        preguntasRecibidas: 87,
        year: 2023,
        detalles: {
            totalInscritos: 198,
            asistentes: 167,
            noAsistentes: 31,
            totalPreguntas: 87,
            preguntasRespondidas: 80,
            preguntasPendientes: 7,
            lugar: 'Auditorio Municipal',
        }
    },
    {
        id: '6',
        fecha: '2023-06-18',
        hora: '14:00',
        banners: [
            { id: 'b6', url: 'https://placehold.co/1200x400/2d4a6f/white?text=Rendicion+Junio+2023', name: 'Banner Jun 2023' }
        ],
        ejesTematicos: ['2', '5', '6', '8'],
        status: 'finalizada',
        asistentesRegistrados: 176,
        preguntasRecibidas: 72,
        year: 2023,
        detalles: {
            totalInscritos: 176,
            asistentes: 145,
            noAsistentes: 31,
            totalPreguntas: 72,
            preguntasRespondidas: 65,
            preguntasPendientes: 7,
            lugar: 'Municipalidad JLO',
        }
    }
]

// Años disponibles
export const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021]