import type { RendicionOption, Participante } from '../types/reportes'

export const RENDICIONES_OPTIONS: RendicionOption[] = [
    { id: '1', label: 'Rendición Diciembre 2025', fecha: '2025-12-15' },
    { id: '2', label: 'Rendición Junio 2025', fecha: '2025-06-20' },
    { id: '3', label: 'Rendición Diciembre 2024', fecha: '2024-12-10' },
    { id: '4', label: 'Rendición Junio 2024', fecha: '2024-06-15' },
    { id: '5', label: 'Rendición Diciembre 2023', fecha: '2023-12-12' },
]

// Generador de participantes mock
const nombres = [
    'Juan Carlos Pérez García', 'María Elena López Rodríguez', 'Carlos Alberto Mendoza Silva',
    'Ana Lucía Torres Vega', 'Pedro José Ramírez Luna', 'Rosa María Castillo Flores',
    'Luis Fernando Díaz Morales', 'Carmen Sofía Herrera Paz', 'Miguel Ángel Vargas Ruiz',
    'Patricia Isabel Gómez Soto', 'Jorge Eduardo Reyes Castro', 'Lucía Fernanda Paredes Ríos',
    'Roberto Carlos Núñez Vera', 'Silvia Beatriz Ortega Campos', 'Fernando José Medina Cruz',
    'Gloria Esperanza Salazar León', 'Andrés Felipe Jiménez Mora', 'Diana Carolina Espinoza Vidal',
    'Gustavo Adolfo Rojas Pinto', 'Verónica Alejandra Muñoz Quiroz', 'Ricardo Enrique Blanco Fuentes',
    'Mónica Patricia Delgado Ramos', 'Oscar Iván Gutiérrez Peña', 'Claudia Marcela Arias Torres',
    'Héctor Manuel Suárez Cano', 'Laura Cristina Romero Salas', 'Sergio Antonio Castro Mejía',
    'Adriana Isabel Moreno Duarte', 'Raúl Eduardo Palacios Niño', 'Sandra Milena Aguilar Rivas'
]

const titulos = ['Ing.', 'Lic.', 'Dr.', 'Arq.', 'Abog.', 'Mg.', 'Bach.', null]
const organizaciones = [
    'Asociación de Comerciantes del Mercado Central',
    'Junta Vecinal Los Jardines',
    'Club de Madres Santa Rosa',
    'Comité de Seguridad Ciudadana Sector 5',
    'Asociación de Transportistas Unidos',
    'ONG Desarrollo Comunitario',
    'Colegio de Ingenieros',
    'Cámara de Comercio Local',
    'Sindicato de Trabajadores Municipales',
    'Asociación de Padres de Familia I.E. 1234',
    null
]

const ejes = [
    'Seguridad Ciudadana',
    'Infraestructura',
    'Limpieza Pública',
    'Desarrollo Social',
    'Medio Ambiente',
    'Educación y Cultura',
    'Salud Pública',
    null
]

const preguntas = [
    '¿Cuándo se implementará el plan de seguridad ciudadana en el sector 5?',
    '¿Qué avances hay en la construcción del nuevo mercado municipal?',
    '¿Por qué no pasa el camión de basura los días domingos?',
    '¿Cuándo se arreglarán las pistas de la avenida principal?',
    '¿Hay programas de apoyo para adultos mayores en situación vulnerable?',
    '¿Se construirá un nuevo parque en nuestra urbanización?',
    '¿Qué programas de capacitación laboral ofrece la municipalidad?',
    '¿Cuándo se instalará el alumbrado público en la calle Los Rosales?',
    '¿Hay planes para construir más áreas verdes en el distrito?',
    '¿Cómo puedo acceder al programa de vaso de leche?',
    null
]

const generateDNI = () => {
    return String(Math.floor(10000000 + Math.random() * 90000000))
}

const generateRUC = () => {
    const hasRUC = Math.random() > 0.7
    return hasRUC ? `20${Math.floor(100000000 + Math.random() * 900000000)}` : null
}

export const generateMockParticipantes = (count: number): Participante[] => {
    const participantes: Participante[] = []
    
    for (let i = 0; i < count; i++) {
        const tipoParticipacion = Math.random() > 0.85 ? 'orador' : 'asistente'
        const asistencia = Math.random() > 0.15 // 85% asistieron
        const tienePregunta = Math.random() > 0.6 // 40% hizo preguntas
        const pregunta = tienePregunta ? preguntas[Math.floor(Math.random() * (preguntas.length - 1))] : null
        const eje = pregunta ? ejes[Math.floor(Math.random() * (ejes.length - 1))] : null
        
        participantes.push({
            id: `part-${i + 1}`,
            dni: generateDNI(),
            nombre: nombres[Math.floor(Math.random() * nombres.length)],
            sexo: Math.random() > 0.5 ? 'M' : 'F',
            tipoParticipacion,
            titulo: titulos[Math.floor(Math.random() * titulos.length)],
            ruc: generateRUC(),
            nombreOrganizacion: organizaciones[Math.floor(Math.random() * organizaciones.length)],
            asistencia,
            eje,
            pregunta
        })
    }
    
    return participantes
}

// Mock de datos por rendición
export const MOCK_REPORTES: Record<string, Participante[]> = {
    '1': generateMockParticipantes(45),
    '2': generateMockParticipantes(234),
    '3': generateMockParticipantes(312),
    '4': generateMockParticipantes(289),
    '5': generateMockParticipantes(198),
}

export const ITEMS_PER_PAGE = 10