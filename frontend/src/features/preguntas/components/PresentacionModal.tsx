import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
    FaTimes, 
    FaChevronLeft, 
    FaChevronRight, 
    FaTags,
    FaUser,
    FaQuestionCircle,
    FaFilter,
    FaPlay
} from 'react-icons/fa'
import type { PresentacionState, PreguntasPorEje } from '../types/preguntas'
//ME LO HIZO COPILOTxd
type Props = {
    presentacion: PresentacionState
    onClose: () => void
}

type ViewMode = 'selector' | 'presentacion'

export default function PresentacionModal({ presentacion, onClose }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('selector')
    const [selectedEjeId, setSelectedEjeId] = useState<string | 'todos'>('todos')
    const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(0)

    // Filtrar preguntas según el eje seleccionado
    const preguntasFiltradas = useMemo(() => {
        if (selectedEjeId === 'todos') {
            // Aplanar todas las preguntas
            return presentacion.preguntasPorEje.flatMap(eje => 
                eje.preguntas.map(p => ({ ...p, ejeNombre: eje.ejeNombre }))
            )
        }
        const eje = presentacion.preguntasPorEje.find(e => e.ejeId === selectedEjeId)
        return eje ? eje.preguntas.map(p => ({ ...p, ejeNombre: eje.ejeNombre })) : []
    }, [presentacion.preguntasPorEje, selectedEjeId])

    const currentPregunta = preguntasFiltradas[currentPreguntaIndex]
    const totalPreguntas = preguntasFiltradas.length

    // Reset al cambiar eje o abrir
    React.useEffect(() => {
        if (presentacion.isOpen) {
            setViewMode('selector')
            setSelectedEjeId('todos')
            setCurrentPreguntaIndex(0)
        }
    }, [presentacion.isOpen])

    // Navegación
    const goToPrevPregunta = () => {
        if (currentPreguntaIndex > 0) {
            setCurrentPreguntaIndex(prev => prev - 1)
        }
    }

    const goToNextPregunta = () => {
        if (currentPreguntaIndex < totalPreguntas - 1) {
            setCurrentPreguntaIndex(prev => prev + 1)
        }
    }

    const canGoPrev = currentPreguntaIndex > 0
    const canGoNext = currentPreguntaIndex < totalPreguntas - 1

    // Iniciar presentación
    const startPresentacion = () => {
        setCurrentPreguntaIndex(0)
        setViewMode('presentacion')
    }

    // Volver al selector
    const backToSelector = () => {
        setViewMode('selector')
    }

    // Atajos de teclado
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!presentacion.isOpen || viewMode !== 'presentacion') return

            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                goToPrevPregunta()
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault()
                goToNextPregunta()
            } else if (e.key === 'Escape') {
                backToSelector()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [presentacion.isOpen, viewMode, currentPreguntaIndex, totalPreguntas])

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const contentVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0, scale: 0.95 }
    }

    // Vista del selector de eje
    const renderSelector = () => (
        <motion.div
            className="h-full flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaFilter className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Seleccionar Eje Temático
                    </h2>
                    <p className="text-blue-200">
                        Elige qué preguntas deseas presentar
                    </p>
                </div>

                {/* Opciones de ejes */}
                <div className="space-y-3 mb-8">
                    {/* Opción todos */}
                    <motion.button
                        onClick={() => setSelectedEjeId('todos')}
                        className={`
                            w-full p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer
                            ${selectedEjeId === 'todos'
                                ? 'bg-white text-[#002f59]'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                selectedEjeId === 'todos' ? 'bg-[#002f59]/10' : 'bg-white/10'
                            }`}>
                                <FaTags className={`h-5 w-5 ${
                                    selectedEjeId === 'todos' ? 'text-[#002f59]' : 'text-white'
                                }`} />
                            </div>
                            <span className="font-semibold">Todos los ejes</span>
                        </div>
                        <span className={`text-sm ${
                            selectedEjeId === 'todos' ? 'text-[#002f59]/70' : 'text-white/70'
                        }`}>
                            {presentacion.preguntasPorEje.reduce((acc, e) => acc + e.preguntas.length, 0)} preguntas
                        </span>
                    </motion.button>

                    {/* Ejes individuales */}
                    {presentacion.preguntasPorEje.map((eje, index) => (
                        <motion.button
                            key={eje.ejeId}
                            onClick={() => setSelectedEjeId(eje.ejeId)}
                            className={`
                                w-full p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer
                                ${selectedEjeId === eje.ejeId
                                    ? 'bg-white text-[#002f59]'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    selectedEjeId === eje.ejeId ? 'bg-[#002f59]/10' : 'bg-white/10'
                                }`}>
                                    <FaTags className={`h-5 w-5 ${
                                        selectedEjeId === eje.ejeId ? 'text-[#002f59]' : 'text-white'
                                    }`} />
                                </div>
                                <span className="font-semibold">{eje.ejeNombre}</span>
                            </div>
                            <span className={`text-sm ${
                                selectedEjeId === eje.ejeId ? 'text-[#002f59]/70' : 'text-white/70'
                            }`}>
                                {eje.preguntas.length} preguntas
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Botón iniciar */}
                <motion.button
                    onClick={startPresentacion}
                    disabled={preguntasFiltradas.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                        ${preguntasFiltradas.length > 0
                            ? 'bg-white text-[#002f59] hover:bg-blue-50 cursor-pointer'
                            : 'bg-white/20 text-white/50 cursor-not-allowed'
                        }
                    `}
                    whileHover={{ scale: preguntasFiltradas.length > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: preguntasFiltradas.length > 0 ? 0.98 : 1 }}
                >
                    <FaPlay className="h-5 w-5" />
                    Iniciar Presentación
                    <span className="text-sm font-normal opacity-70">
                        ({preguntasFiltradas.length} preguntas)
                    </span>
                </motion.button>
            </div>
        </motion.div>
    )

    // Vista de presentación
    const renderPresentacion = () => (
        <>
            {/* Contenido principal */}
            <div className="h-full flex items-center justify-center px-8 py-24">
                <AnimatePresence mode="wait">
                    {currentPregunta && (
                        <motion.div
                            key={currentPregunta.id}
                            className="max-w-5xl w-full"
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Badge del eje */}
                            <motion.div 
                                className="flex justify-center mb-8"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                    <FaTags className="h-5 w-5 text-amber-400" />
                                    <span className="text-xl font-semibold text-white">
                                        {currentPregunta.ejeNombre}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Card de la pregunta */}
                            <motion.div
                                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {/* Ícono de pregunta */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-[#002f59]/10 rounded-full flex items-center justify-center">
                                        <FaQuestionCircle className="h-8 w-8 text-[#002f59]" />
                                    </div>
                                </div>

                                {/* Texto de la pregunta */}
                                <p className="text-2xl md:text-4xl text-gray-900 text-center leading-relaxed font-medium mb-8">
                                    "{currentPregunta.texto}"
                                </p>

                                {/* Participante */}
                                <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                                    <div className="w-12 h-12 bg-[#002f59] rounded-full flex items-center justify-center">
                                        <FaUser className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xl font-bold text-gray-900">
                                            {currentPregunta.participante.nombre}
                                        </p>
                                        <p className="text-gray-500">
                                            DNI: {currentPregunta.participante.dni}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contador de preguntas */}
                            <motion.div 
                                className="flex justify-center mt-8"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                    <span className="text-white/60 text-lg">Pregunta</span>
                                    <span className="text-white font-bold text-xl">
                                        {currentPreguntaIndex + 1}
                                    </span>
                                    <span className="text-white/60 text-lg">de</span>
                                    <span className="text-white font-bold text-xl">
                                        {totalPreguntas}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navegación */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                {/* Botón anterior */}
                <motion.button
                    onClick={goToPrevPregunta}
                    disabled={!canGoPrev}
                    className={`
                        flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all
                        ${canGoPrev
                            ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }
                    `}
                    whileHover={{ scale: canGoPrev ? 1.05 : 1 }}
                    whileTap={{ scale: canGoPrev ? 0.95 : 1 }}
                >
                    <FaChevronLeft className="h-5 w-5" />
                    Anterior
                </motion.button>

                {/* Indicador de progreso */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPreguntas, 20) }).map((_, index) => {
                        // Si hay más de 20 preguntas, mostrar indicadores agrupados
                        const isActive = totalPreguntas <= 20 
                            ? index === currentPreguntaIndex
                            : Math.floor(currentPreguntaIndex / (totalPreguntas / 20)) === index
                        
                        return (
                            <div
                                key={index}
                                className={`
                                    h-2 rounded-full transition-all
                                    ${isActive ? 'bg-white w-6' : 'bg-white/30 w-2'}
                                `}
                            />
                        )
                    })}
                </div>

                {/* Botón siguiente */}
                <motion.button
                    onClick={goToNextPregunta}
                    disabled={!canGoNext}
                    className={`
                        flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all
                        ${canGoNext
                            ? 'bg-white text-[#002f59] hover:bg-blue-50 cursor-pointer'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }
                    `}
                    whileHover={{ scale: canGoNext ? 1.05 : 1 }}
                    whileTap={{ scale: canGoNext ? 0.95 : 1 }}
                >
                    Siguiente
                    <FaChevronRight className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Instrucciones de teclado */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform">
                <p className="text-white/40 text-sm text-center">
                    Usa las flechas ← → o la barra espaciadora para navegar • ESC para volver
                </p>
            </div>
        </>
    )

    return (
        <AnimatePresence>
            {presentacion.isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-[#001a33] via-[#002f59] to-[#003d73]"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            {viewMode === 'presentacion' && (
                                <motion.button
                                    onClick={backToSelector}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <FaChevronLeft className="h-5 w-5 text-white" />
                                </motion.button>
                            )}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {presentacion.rendicionLabel}
                                </h1>
                                <p className="text-blue-200 text-lg">
                                    {viewMode === 'selector' 
                                        ? 'Selección de eje temático'
                                        : selectedEjeId === 'todos' 
                                            ? 'Todas las preguntas'
                                            : presentacion.preguntasPorEje.find(e => e.ejeId === selectedEjeId)?.ejeNombre
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                        >
                            <FaTimes className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    {/* Contenido según modo */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'selector' ? (
                            <motion.div
                                key="selector"
                                className="h-full pt-24"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                {renderSelector()}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="presentacion"
                                className="h-full"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                            >
                                {renderPresentacion()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}