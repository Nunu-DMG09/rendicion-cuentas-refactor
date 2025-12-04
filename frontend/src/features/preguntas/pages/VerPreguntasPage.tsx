import { motion } from 'motion/react'
import PreguntasStats from '../components/PreguntasStats'
import PreguntasPorEjeList from '../components/PreguntasPorEjeList'
import PreguntasModal from '../components/PreguntasModal'
import PresentacionModal from '../components/PresentacionModal'
import EmptyPreguntas from '../components/EmptyPreguntas'
import { useVerPreguntas } from '../hooks/useVerPreguntas'
import RendicionesSelector from '../components/RendicionesSelector'

export default function VerPreguntasPage() {
    const {
        selectedRendicion,
        setSelectedRendicion,
        rendicionesOptions,
        preguntasPorEje,
        isLoading,
        hasSearched,
        buscarPreguntas,
        stats,
        // Modal
        modal,
        closeModal,
        confirmModalAction,
        showDeleteConfirm,
        // Presentación
        presentacion,
        openPresentacion,
        closePresentacion
    } = useVerPreguntas()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <header>
                <h1 className="text-4xl font-bold text-gray-900 font-titles">Ver Preguntas</h1>
                <p className="text-gray-600 mt-1 font-body text-lg">Consulta y gestiona las preguntas por rendición</p>
            </header>
            <RendicionesSelector
                selectedRendicion={selectedRendicion}
                onRendicionChange={() => {}}
            />

            {/* Contenido */}
            {hasSearched ? (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Stats */}
                    <PreguntasStats
                        total={stats.total}
                        respondidas={stats.respondidas}
                        pendientes={stats.pendientes}
                        ejes={stats.ejes}
                    />

                    {/* Lista de preguntas por eje */}
                    <PreguntasPorEjeList
                        preguntasPorEje={preguntasPorEje}
                        onDeletePregunta={showDeleteConfirm}
                        isLoading={isLoading}
                    />
                </motion.div>
            ) : !isLoading ? (
                <EmptyPreguntas />
            ) : null}

            {/* Loading State */}
            {isLoading && !hasSearched && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
            )}

            {/* Modal */}
            <PreguntasModal
                modal={modal}
                onClose={closeModal}
                onConfirm={confirmModalAction}
            />

            {/* Presentación */}
            <PresentacionModal
                presentacion={presentacion}
                onClose={closePresentacion}
            />
        </motion.div>
    )
}