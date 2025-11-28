import type { RendicionOptionPreguntas, Pregunta } from '../types/preguntas'

export const RENDICIONES_PREGUNTAS_OPTIONS: RendicionOptionPreguntas[] = [
    { id: '1', label: 'Rendición Diciembre 2025', fecha: '2025-12-15' },
    { id: '2', label: 'Rendición Junio 2025', fecha: '2025-06-20' },
    { id: '3', label: 'Rendición Diciembre 2024', fecha: '2024-12-10' },
    { id: '4', label: 'Rendición Junio 2024', fecha: '2024-06-15' },
]

export const EJES_TEMATICOS_MOCK = [
    { id: 'eje-1', nombre: 'Seguridad Ciudadana' },
    { id: 'eje-2', nombre: 'Infraestructura' },
    { id: 'eje-3', nombre: 'Limpieza Pública' },
    { id: 'eje-4', nombre: 'Desarrollo Social' },
    { id: 'eje-5', nombre: 'Medio Ambiente' },
    { id: 'eje-6', nombre: 'Educación y Cultura' },
    { id: 'eje-7', nombre: 'Salud Pública' },
]

const participantesMock = [
    { id: 'p1', nombre: 'Juan Carlos Pérez García', dni: '12345678' },
    { id: 'p2', nombre: 'María Elena López Rodríguez', dni: '23456789' },
    { id: 'p3', nombre: 'Carlos Alberto Mendoza Silva', dni: '34567890' },
    { id: 'p4', nombre: 'Ana Lucía Torres Vega', dni: '45678901' },
    { id: 'p5', nombre: 'Pedro José Ramírez Luna', dni: '56789012' },
    { id: 'p6', nombre: 'Rosa María Castillo Flores', dni: '67890123' },
    { id: 'p7', nombre: 'Luis Fernando Díaz Morales', dni: '78901234' },
    { id: 'p8', nombre: 'Carmen Sofía Herrera Paz', dni: '89012345' },
    { id: 'p9', nombre: 'Miguel Ángel Vargas Ruiz', dni: '90123456' },
    { id: 'p10', nombre: 'Patricia Isabel Gómez Soto', dni: '01234567' },
]

const preguntasMock = [
    '¿Cuándo se implementará el plan de seguridad ciudadana en el sector 5?',
    '¿Qué avances hay en la construcción del nuevo mercado municipal?',
    '¿Por qué no pasa el camión de basura los días domingos en la urbanización Los Pinos?',
    '¿Cuándo se arreglarán las pistas de la avenida principal que están llenas de huecos?',
    '¿Hay programas de apoyo para adultos mayores en situación de vulnerabilidad económica?',
    '¿Se construirá un nuevo parque en nuestra urbanización este año?',
    '¿Qué programas de capacitación laboral ofrece la municipalidad para jóvenes?',
    '¿Cuándo se instalará el alumbrado público en la calle Los Rosales?',
    '¿Hay planes para construir más áreas verdes en el distrito?',
    '¿Cómo puedo acceder al programa de vaso de leche para mi madre?',
    '¿Qué se está haciendo para combatir la delincuencia en el mercado central?',
    '¿Cuándo comenzarán las obras del nuevo hospital municipal?',
    '¿Por qué aumentó el arbitrio de limpieza pública este año?',
    '¿Hay becas disponibles para estudiantes de bajos recursos?',
    '¿Qué proyectos de reciclaje tiene planificado la municipalidad?',
]

// Generar preguntas mock para una rendición
export const generateMockPreguntas = (rendicionId: string): Pregunta[] => {
    const cantidadPreguntas = Math.floor(Math.random() * 20) + 15 // Entre 15 y 35 preguntas
    const preguntas: Pregunta[] = []
    
    for (let i = 0; i < cantidadPreguntas; i++) {
        const eje = EJES_TEMATICOS_MOCK[Math.floor(Math.random() * EJES_TEMATICOS_MOCK.length)]
        const participante = participantesMock[Math.floor(Math.random() * participantesMock.length)]
        const preguntaTexto = preguntasMock[Math.floor(Math.random() * preguntasMock.length)]
        
        preguntas.push({
            id: `preg-${rendicionId}-${i + 1}`,
            texto: preguntaTexto,
            participante: { ...participante },
            ejeId: eje.id,
            ejeNombre: eje.nombre,
            fechaCreacion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            respondida: Math.random() > 0.3
        })
    }
    
    return preguntas
}

// Mock de datos por rendición
export const MOCK_PREGUNTAS_POR_RENDICION: Record<string, Pregunta[]> = {
    '1': generateMockPreguntas('1'),
    '2': generateMockPreguntas('2'),
    '3': generateMockPreguntas('3'),
    '4': generateMockPreguntas('4'),
}