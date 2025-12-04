// features/preguntas/components/ErrorState.tsx
import { motion } from 'motion/react'
import { HiExclamationTriangle, HiHome } from 'react-icons/hi2'
import { HiRefresh } from 'react-icons/hi'
import { Button } from 'dialca-ui'

interface Props {
    error: { message?: string } | null
    onRetry: () => void
    onClear: () => void
}

export default function ErrorState({ error, onRetry, onClear }: Props) {
    const isNetworkError = error?.message?.includes('Network Error')
    const is404Error = error?.message?.includes('404')

    const btnClasses = {
        content: "flex items-center gap-2",
    }

    return (
        <motion.div
            className="bg-white rounded-2xl p-12 text-center shadow-lg border border-red-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiExclamationTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h3 className="text-3xl font-titles font-bold text-gray-900 mb-4">
                {is404Error 
                    ? 'Rendición no encontrada'
                    : isNetworkError 
                    ? 'Error de conexión'
                    : 'Error al cargar preguntas'
                }
            </h3>
            
            <p className="text-gray-600 text-lg font-titles mb-8 max-w-md mx-auto">
                {is404Error
                    ? 'La rendición seleccionada no existe o no tiene preguntas asociadas.'
                    : isNetworkError
                    ? 'Verifica tu conexión a internet e intenta nuevamente.'
                    : 'Ocurrió un problema al obtener las preguntas. Intenta nuevamente.'
                }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={onRetry}
                    variant="primary"
                    classes={btnClasses}
                >
                    <HiRefresh className="w-4 h-4" />
                    Reintentar
                </Button>
                
                <Button
                    onClick={onClear}
                    variant="outline"
                    classes={btnClasses}
                >
                    <HiHome className="w-4 h-4" />
                    Seleccionar otra
                </Button>
            </div>
        </motion.div>
    )
}