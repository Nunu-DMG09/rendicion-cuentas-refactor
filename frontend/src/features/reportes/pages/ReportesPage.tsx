import { motion } from 'motion/react'
import ReporteStats from '../components/ReporteStats'
import ReporteTable from '../components/ReporteTable'
import PreguntaModal from '../components/PreguntaModal'
import EmptyReporte from '../components/EmptyReporte'
import { useReportes } from '../hooks/useReportes'
import RendicionesSelector from '@/features/preguntas/components/RendicionesSelector'
import ErrorState from '@/features/preguntas/components/ErrorState'
import { formatDateWithWeekday } from '@/shared/utils'
import { ReportSkeleton } from '../components/ReportSkleleton'
import { PiFolderOpenFill } from 'react-icons/pi'

export default function ReportesPage() {
    const {
        selectedRendicion,
        handleRendicionChange,
        limpiarBusqueda,
        reportData,
        hasSearched,
        isLoading,
        isError,
        error,
        refetch,
        hasResults,
        handlePageChange,
        // Modal
        modal,
        openPreguntaModal,
        closePreguntaModal,
        // Excel
        downloadExcel
    } = useReportes()
    

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <header>
                <h1 className="text-4xl font-titles font-bold text-gray-900">Ver Reportes</h1>
                <p className="text-gray-600 font-body text-lg mt-1">Consulta el reporte de participantes por rendición</p>
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
					</motion.div>
				)}
			</motion.div>
            {!hasSearched && !isLoading && <EmptyReporte />}
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
                    <div className="bg-linear-to-r from-primary-dark to-primary rounded-xl p-4 flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-xl font-bold">{reportData?.rendicion.titulo ?? ""}</h2>
                            <p className="text-blue-100 text-sm">{formatDateWithWeekday(reportData?.rendicion.fecha ?? '')}</p>
                        </div>
                    </div>
                    <ReporteStats stats={reportData?.stats} />
                    {hasResults ? (
                        <ReporteTable
                            participantes={reportData?.participantes || []}
                            totalParticipantes={reportData?.pagination.total || 0}
                            currentPage={reportData?.pagination.current_page || 1}
                            totalPages={reportData?.pagination.total_pages || 1}
                            onPageChange={handlePageChange}
                            onVerPregunta={openPreguntaModal}
                            onDownloadExcel={downloadExcel}
                            isLoading={isLoading}
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
								Sin resultados
							</h3>
							<p className="text-gray-600 font-body text-lg">
								Esta rendición no tiene participantes registrados.
							</p>
						</motion.div>
                    )}
                </motion.div>
            )}
            {isLoading && <ReportSkeleton />}
            <PreguntaModal
                modal={modal}
                onClose={closePreguntaModal}
            />
        </motion.div>
    )
}