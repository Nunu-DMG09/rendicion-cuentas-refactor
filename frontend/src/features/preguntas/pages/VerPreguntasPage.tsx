import { motion } from "motion/react";
import PreguntasStats from "../components/ver/PreguntasStats";
import PreguntasPorEjeList from "../components/PreguntasPorEjeList";
import PresentacionModal from "../components/ver/PresentacionModal";
import EmptyPreguntas from "../components/EmptyPreguntas";
import ErrorState from "../components/ErrorState";
import { useVerPreguntas } from "../hooks/useVerPreguntas";
import RendicionesSelector from "../components/RendicionesSelector";
import { PiFolderOpenFill } from "react-icons/pi";
import { PreguntasSkeleton } from "../components/PreguntasSkeleton";
import { useSeleccionarPreguntas } from "../hooks/useSeleccionarPreguntas";
import PreguntasModal from "../components/seleccionar/PreguntasModal";
import ActionBar from "../components/seleccionar/ActionBar";

export default function VerPreguntasPage({ isSelectorMode = false }: { isSelectorMode?: boolean }) {
	const {
		selectedRendicion,
		preguntasPorEje: preguntasPorEjeSeleccionadas,
		isLoading: isLoadingPreguntasSeleccionadas,
		isError: isErrorPreguntasSeleccionadas,
		error: errorPreguntasSeleccionadas,
		hasSearched,
		hasResults: hasPreguntasSeleccionadas,
		stats: preguntasSeleccionadasStats,
		// Acciones
		handleRendicionChange,
		limpiarBusqueda,
		refetch,
		// Presentación
		presentacion,
		closePresentacion,
		openPresentacion,
	} = useVerPreguntas();
    const {
        isLoading: isLoadingPreguntas,
        isError: isErrorPreguntas,
        error: errorPreguntas,
        hasResults: hasPreguntas,
        preguntasPorEje: allPreguntasPorEje,
        stats: preguntasStats,
        closeModal,
        modal,
        toggleQuestionSelection,
        saveChanges,
        discardChanges,
        hasPendingChanges,
        isUpdating,
    } = useSeleccionarPreguntas(selectedRendicion);

    const isLoading = isSelectorMode ? isLoadingPreguntas : isLoadingPreguntasSeleccionadas;
    const isError = isSelectorMode ? isErrorPreguntas : isErrorPreguntasSeleccionadas;
    const error = isSelectorMode ? errorPreguntas : errorPreguntasSeleccionadas;
    const hasResults = isSelectorMode ? hasPreguntas : hasPreguntasSeleccionadas;
    const preguntasPorEje = isSelectorMode ? allPreguntasPorEje : preguntasPorEjeSeleccionadas;
    const stats = isSelectorMode ? preguntasStats : preguntasSeleccionadasStats;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<header>
				<h1 className="text-4xl font-bold text-gray-900 font-titles">
					{isSelectorMode ? 'Seleccionar Preguntas' : 'Ver Preguntas'}
				</h1>
				<p className="text-gray-600 mt-1 font-body text-lg">
					{isSelectorMode 
                        ? 'Elige las preguntas que serán presentadas en la rendición de cuentas'
                        : 'Consulta y gestiona las preguntas por rendición'
                    }
				</p>
			</header>
			<motion.div
				className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<RendicionesSelector
					selectedRendicion={selectedRendicion}
					onRendicionChange={handleRendicionChange}
				/>
				{selectedRendicion && (
					<motion.div
						className="mt-4 flex flex-wrap gap-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<button
							onClick={limpiarBusqueda}
							className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
						>
							Limpiar selección
						</button>
						{hasResults && !isSelectorMode && (
							<button
								onClick={openPresentacion}
								className="px-4 py-2 text-sm bg-primary-dark hover:bg-primary text-white rounded-lg transition-colors"
							>
								Modo Presentación
							</button>
						)}
                        {isSelectorMode && hasPendingChanges && (
                            <div className="px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
								{"pending" in stats ? (stats.pending as number) : 0} cambios pendientes
                            </div>
                        )}
					</motion.div>
				)}
			</motion.div>
			{!hasSearched && !isLoading && <EmptyPreguntas />}
			{isError && (
				<ErrorState
					error={error}
					onRetry={refetch}
					onClear={limpiarBusqueda}
				/>
			)}
			{hasSearched && !isError && !isLoading &&  (
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
				>
					<PreguntasStats
						total={stats.total}
						respondidas={stats.respondidas}
						pendientes={stats.pendientes}
						ejes={stats.ejes}
                        selected={isSelectorMode ? ("selected" in stats ? (stats.selected as number) : 0) : undefined}
                        pending={isSelectorMode ? ("pending" in stats ? (stats.pending as number) : 0) : undefined}
					/>
					{hasResults ? (
						<PreguntasPorEjeList
							preguntasPorEje={preguntasPorEje}
                            isSelectorMode={isSelectorMode}
                            onSelectQuestion={isSelectorMode ? toggleQuestionSelection : undefined}
                            onUnselectQuestion={isSelectorMode ? toggleQuestionSelection : undefined}
						/>
					) : !isLoading && (
						<motion.div
							className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-4xl">
                                    <PiFolderOpenFill className="text-gray-500" />
                                </span>
							</div>
							<h3 className="text-2xl font-titles font-bold text-gray-900 mb-2">
								Sin preguntas registradas
							</h3>
							<p className="text-gray-600 font-body text-lg">
								Esta rendición aún no tiene preguntas ciudadanas registradas.
							</p>
						</motion.div>
					)}
				</motion.div>
			)}
			{isLoading && (<PreguntasSkeleton />)}
			{!isSelectorMode && (
                <PresentacionModal
                    presentacion={presentacion}
                    onClose={closePresentacion}
                />
            )}

            {isSelectorMode && (
                <PreguntasModal
                    modal={modal}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            )}
            {isSelectorMode && (
                <ActionBar
                    hasPendingChanges={hasPendingChanges}
                    pendingCount={isSelectorMode ? ("pending" in stats ? (stats.pending as number) : 0) : 0}
                    isUpdating={isUpdating}
                    onSave={saveChanges}
                    onDiscard={discardChanges}
                />
            )}
		</motion.div>
	);
}
